/**
 * Fetches the discography from the Spotify Web API and writes it to
 * `supabase/seed/discography.json`, which `npm run db:seed` loads into the database.
 *
 *   npm run discography:fetch            # reuse the album editions pinned in the JSON
 *   npm run discography:fetch -- --refresh   # resolve every edition again from the titles
 *
 * Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (client credentials flow, no user login).
 * Which releases are included is configured in `scripts/discography/releases.json`.
 *
 * Self-contained on purpose: Node runs this file directly (type stripping), so no local imports.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const CONFIG_PATH = resolve(ROOT, "scripts/discography/releases.json");
const OUTPUT_PATH = resolve(ROOT, "supabase/seed/discography.json");
const API = "https://api.spotify.com/v1";

type AlbumType = "studio" | "live" | "ep" | "single" | "compilation";

type ReleaseConfig = {
  slug: string;
  title: string;
  type: AlbumType;
  releaseYear: number;
  spotifyTitles: string[];
  spotifyId?: string;
  optional?: boolean;
  excludeTracks?: string[];
  renameTracks?: Record<string, string>;
  bonus?: { spotifyTitles: string[]; spotifyId?: string; discs?: number[]; releaseYear: number };
};

type Config = {
  artist: { name: string; spotifyId: string };
  releases: ReleaseConfig[];
  ignoredSpotifyReleases?: { id: string; name: string; reason: string }[];
};

type SeedSong = {
  title: string;
  discNumber: number;
  trackNumber: number;
  durationMs: number;
  spotifyUri: string;
  releaseYear: number;
};

type SeedAlbum = {
  slug: string;
  title: string;
  albumType: AlbumType;
  releaseYear: number;
  coverUrl: string | null;
  spotifyUri: string;
  bonusSpotifyUri?: string;
  songs: SeedSong[];
};

type SeedFile = { source: string; market: string; artist: string; albums: SeedAlbum[] };

type SpotifyImage = { url: string; width: number | null; height: number | null };
type SpotifyArtist = { id: string; name: string };
type SpotifyTrack = {
  id: string;
  uri: string;
  name: string;
  disc_number: number;
  track_number: number;
  duration_ms: number;
  explicit: boolean;
  artists: SpotifyArtist[];
};
type SpotifyAlbumSummary = {
  id: string;
  name: string;
  album_type: string;
  album_group?: string;
  release_date: string;
  total_tracks: number;
};
type SpotifyAlbum = SpotifyAlbumSummary & {
  uri: string;
  images: SpotifyImage[];
  tracks: { items: SpotifyTrack[]; next: string | null };
};
type Paging<T> = { items: T[]; next: string | null };

const args = new Set(process.argv.slice(2));
const refresh = args.has("--refresh");
const market = process.env.SPOTIFY_MARKET || "NL";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Lowercase, drop punctuation and collapse spaces: "Life Is But a Dream..." -> "life is but a dream". */
function normalize(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** "Bat Country - Remastered 2020" -> "Bat Country". Keeps meaningful suffixes like mixes. */
function cleanTrackTitle(name: string): string {
  return name
    .replace(/\s+-\s+(\d{4}\s+)?remaster(ed)?(\s+\d{4})?(\s+version)?$/i, "")
    .replace(/\s+\((\d{4}\s+)?remaster(ed)?(\s+\d{4})?(\s+version)?\)$/i, "")
    .trim();
}

function isLiveTrack(name: string): boolean {
  return /(\(|\[|\s-\s)\s*live\b/i.test(name);
}

function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

let token: string | null = null;

async function getToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    fail("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set (see .env.example).");
  }
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) fail(`Spotify token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function api<T>(pathOrUrl: string, attempt = 0): Promise<T> {
  token ??= await getToken();
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API}${pathOrUrl}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 429 && attempt < 5) {
    const wait = Number(res.headers.get("retry-after") ?? "2");
    console.warn(`  rate limited, waiting ${wait}s`);
    await new Promise((r) => setTimeout(r, (wait + 1) * 1000));
    return api<T>(pathOrUrl, attempt + 1);
  }
  if (!res.ok) fail(`GET ${url} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

async function paginate<T>(first: Paging<T>): Promise<T[]> {
  const items = [...first.items];
  let next = first.next;
  while (next) {
    const page = await api<Paging<T>>(next);
    items.push(...page.items);
    next = page.next;
  }
  return items;
}

async function getAlbum(id: string): Promise<SpotifyAlbum> {
  const album = await api<SpotifyAlbum>(`/albums/${id}?market=${market}`);
  album.tracks.items = await paginate(album.tracks);
  return album;
}

function largestImage(images: SpotifyImage[]): string | null {
  if (images.length === 0) return null;
  return [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0].url;
}

function idFromUri(uri: string | undefined): string | undefined {
  return uri?.split(":").pop();
}

/**
 * Picks the edition that matches one of the titles. When Spotify has several
 * (explicit + clean, reissues), prefer the explicit one, then the most tracks,
 * then the oldest release.
 */
async function resolveEdition(
  titles: string[],
  candidates: SpotifyAlbumSummary[],
  label: string,
): Promise<SpotifyAlbum | null> {
  const wanted = new Set(titles.map(normalize));
  const matches = candidates.filter((c) => wanted.has(normalize(c.name)));
  if (matches.length === 0) return null;

  const albums = await Promise.all(matches.map((m) => getAlbum(m.id)));
  const score = (a: SpotifyAlbum) => a.tracks.items.filter((t) => t.explicit).length;
  albums.sort(
    (a, b) =>
      score(b) - score(a) ||
      b.tracks.items.length - a.tracks.items.length ||
      a.release_date.localeCompare(b.release_date),
  );
  if (albums.length > 1) {
    console.log(
      `  ${label}: ${albums.length} editions on Spotify, picked ${albums[0].id} ` +
        `(${albums[0].tracks.items.length} tracks, ${albums[0].release_date}); pin another with "spotifyId"`,
    );
  }
  return albums[0];
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Config;
  const previous: SeedFile | null =
    !refresh && existsSync(OUTPUT_PATH)
      ? (JSON.parse(readFileSync(OUTPUT_PATH, "utf8")) as SeedFile)
      : null;
  const pinned = new Map(previous?.albums.map((a) => [a.slug, a]) ?? []);

  const artist = await api<SpotifyArtist>(`/artists/${config.artist.spotifyId}`);
  if (normalize(artist.name) !== normalize(config.artist.name)) {
    fail(
      `Artist ${config.artist.spotifyId} is "${artist.name}", expected "${config.artist.name}".`,
    );
  }

  console.log(`Fetching ${artist.name} releases (market ${market})...`);
  const catalog = await paginate(
    await api<Paging<SpotifyAlbumSummary>>(
      `/artists/${artist.id}/albums?include_groups=album,single,compilation&market=${market}&limit=10`,
    ),
  );
  console.log(`  ${catalog.length} releases on Spotify\n`);

  const albums: SeedAlbum[] = [];
  const skippedLive: string[] = [];

  for (const release of config.releases) {
    const pinnedId = release.spotifyId ?? idFromUri(pinned.get(release.slug)?.spotifyUri);
    const main = pinnedId
      ? await getAlbum(pinnedId)
      : await resolveEdition(release.spotifyTitles, catalog, release.title);

    if (!main) {
      const message = `${release.title}: not found on Spotify (titles tried: ${release.spotifyTitles.join(", ")})`;
      if (release.optional) {
        console.warn(`  ⚠ ${message}, skipped (optional)`);
        continue;
      }
      fail(`${message}. Fix "spotifyTitles" or set "spotifyId" in releases.json.`);
    }

    const ownTrack = (t: SpotifyTrack) => t.artists.some((a) => a.id === artist.id);
    const excluded = new Set((release.excludeTracks ?? []).map(normalize));
    const toSong = (t: SpotifyTrack, year: number): SeedSong | null => {
      if (isLiveTrack(t.name)) {
        skippedLive.push(`${release.title}: ${t.name}`);
        return null;
      }
      if (excluded.has(normalize(t.name))) return null;
      return {
        title: release.renameTracks?.[t.name] ?? cleanTrackTitle(t.name),
        discNumber: t.disc_number,
        trackNumber: t.track_number,
        durationMs: t.duration_ms,
        spotifyUri: t.uri,
        releaseYear: year,
      };
    };

    const songs = main.tracks.items
      .filter(ownTrack)
      .map((t) => toSong(t, release.releaseYear))
      .filter((s): s is SeedSong => s !== null);

    let bonusSpotifyUri: string | undefined;
    if (release.bonus) {
      const bonus = release.bonus;
      const bonusId = bonus.spotifyId ?? idFromUri(pinned.get(release.slug)?.bonusSpotifyUri);
      const deluxe = bonusId
        ? await getAlbum(bonusId)
        : await resolveEdition(bonus.spotifyTitles, catalog, `${release.title} (bonus)`);
      if (!deluxe)
        fail(`${release.title}: bonus edition not found (${bonus.spotifyTitles.join(", ")}).`);
      bonusSpotifyUri = deluxe.uri;
      const mainTitles = new Set(songs.map((s) => normalize(s.title)));
      for (const t of deluxe.tracks.items) {
        if ((bonus.discs && !bonus.discs.includes(t.disc_number)) || !ownTrack(t)) continue;
        const song = toSong(t, bonus.releaseYear);
        if (song && !mainTitles.has(normalize(song.title))) songs.push(song);
      }
    }

    if (songs.length === 0) fail(`${release.title}: no tracks left after filtering.`);

    albums.push({
      slug: release.slug,
      title: release.title,
      albumType: release.type,
      releaseYear: release.releaseYear,
      coverUrl: largestImage(main.images),
      spotifyUri: main.uri,
      ...(bonusSpotifyUri ? { bonusSpotifyUri } : {}),
      songs,
    });
    console.log(`  ✓ ${release.title.padEnd(32)} ${String(songs.length).padStart(3)} songs`);
  }

  // Report: titles on more than one release, and Spotify releases nobody chose.
  const byTitle = new Map<string, string[]>();
  for (const album of albums) {
    for (const song of album.songs) {
      const key = normalize(song.title);
      byTitle.set(key, [...(byTitle.get(key) ?? []), `${song.title} (${album.title})`]);
    }
  }
  const duplicates = [...byTitle.values()].filter((v) => v.length > 1);

  const usedIds = new Set(
    albums.flatMap((a) => [idFromUri(a.spotifyUri), idFromUri(a.bonusSpotifyUri)]),
  );
  const leftovers = catalog
    .filter((c) => !usedIds.has(c.id))
    .map((c) => ({
      ...c,
      covered: c.album_type === "single" && byTitle.has(normalize(cleanTrackTitle(c.name))),
    }));

  const output: SeedFile = {
    source: "Spotify Web API (scripts/discography/fetch-spotify.mts)",
    market,
    artist: artist.name,
    albums,
  };
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  const total = albums.reduce((n, a) => n + a.songs.length, 0);
  console.log(`\nWrote ${albums.length} albums / ${total} songs to supabase/seed/discography.json`);

  if (skippedLive.length) console.log(`\nSkipped ${skippedLive.length} live tracks.`);
  if (duplicates.length) {
    console.log(`\nSame title on more than one release (check these are different recordings):`);
    for (const d of duplicates) console.log(`  - ${d.join(" | ")}`);
  }
  const chosenTitles = new Set(
    config.releases.flatMap((r) =>
      [...r.spotifyTitles, ...(r.bonus?.spotifyTitles ?? [])].map(normalize),
    ),
  );
  const ignored = new Set(config.ignoredSpotifyReleases?.map((r) => r.id));
  const otherEditions = leftovers.filter((l) => chosenTitles.has(normalize(l.name)));
  const uncovered = leftovers.filter(
    (l) => !l.covered && !chosenTitles.has(normalize(l.name)) && !ignored.has(l.id),
  );
  const unused = [...ignored].filter((id) => !catalog.some((c) => c.id === id));
  if (unused.length) console.log(`\nIgnored releases no longer on Spotify: ${unused.join(", ")}`);
  if (otherEditions.length) {
    console.log(`\nOther editions of included releases (ignored): ${otherEditions.length}`);
  }
  if (uncovered.length) {
    console.log(`\nSpotify releases not in releases.json (add them if they should be seeded):`);
    for (const l of uncovered) {
      console.log(`  - [${l.album_group ?? l.album_type}] ${l.name} (${l.release_date}) ${l.id}`);
    }
  }
}

await main();
