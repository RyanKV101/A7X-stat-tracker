/**
 * Loads `supabase/seed/discography.json` into the albums and songs tables.
 *
 *   npm run db:seed              # insert/update albums + songs
 *   npm run db:seed -- --dry-run # only show what would change
 *   npm run db:seed -- --prune   # also delete songs of seeded albums that are no longer in the JSON
 *
 * Safe to re-run: albums upsert on `slug`; songs are matched on Spotify URI (or position + title),
 * so nothing is duplicated and existing song ids (and the plays pointing at them) stay the same.
 * Uses the service role (SUPABASE_SECRET_KEY) because albums/songs are read-only for everyone else.
 * Point it at the local stack by overriding NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.
 *
 * Self-contained on purpose: Node runs this file directly (type stripping), so no local imports.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(import.meta.dirname, "../..");
const DATA_PATH = resolve(ROOT, "supabase/seed/discography.json");

type AlbumType = "studio" | "live" | "ep" | "single" | "compilation";
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
  songs: SeedSong[];
};
type SeedFile = { albums: SeedAlbum[] };

type SongRow = {
  id: number;
  album_id: number;
  title: string;
  disc_number: number;
  track_number: number;
  duration_ms: number;
  spotify_uri: string | null;
  release_year: number;
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const prune = args.has("--prune");

function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

type SongValues = Omit<SongRow, "id" | "album_id">;

function normalize(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Works out which existing rows are the same song, so their ids (and the plays that point at
 * them) survive a re-seed. A song is the same row when the Spotify URI matches, or else when
 * the disc/track position and title match (Spotify sometimes swaps URIs for the same track).
 */
function planSongs(songs: SeedSong[], existing: SongRow[]) {
  const pos = (disc: number, track: number) => `${disc}-${track}`;
  const byUri = new Map(existing.filter((r) => r.spotify_uri).map((r) => [r.spotify_uri, r]));
  const byPosTitle = new Map(
    existing.map((r) => [`${pos(r.disc_number, r.track_number)}|${normalize(r.title)}`, r]),
  );
  const claimed = new Set<number>();

  const inserts: SongValues[] = [];
  const updates: { id: number; values: Partial<SongValues> }[] = [];
  const moving: SongRow[] = [];
  let unchanged = 0;

  for (const song of songs) {
    const values: SongValues = {
      title: song.title,
      disc_number: song.discNumber,
      track_number: song.trackNumber,
      duration_ms: song.durationMs,
      spotify_uri: song.spotifyUri,
      release_year: song.releaseYear,
    };
    let match = byUri.get(song.spotifyUri);
    if (!match || claimed.has(match.id)) {
      match = byPosTitle.get(`${pos(song.discNumber, song.trackNumber)}|${normalize(song.title)}`);
    }
    if (!match || claimed.has(match.id)) {
      inserts.push(values);
      continue;
    }
    claimed.add(match.id);
    const changed = (Object.keys(values) as (keyof SongValues)[]).filter(
      (k) => values[k] !== match[k],
    );
    if (changed.length === 0) {
      unchanged++;
      continue;
    }
    updates.push({ id: match.id, values: Object.fromEntries(changed.map((k) => [k, values[k]])) });
    if (match.disc_number !== song.discNumber || match.track_number !== song.trackNumber) {
      moving.push(match);
    }
  }

  const stale = existing.filter((r) => !claimed.has(r.id));
  const wanted = new Set(songs.map((s) => pos(s.discNumber, s.trackNumber)));
  const inTheWay = stale.filter((r) => wanted.has(pos(r.disc_number, r.track_number)));
  let free = Math.max(999, ...existing.map((r) => r.track_number));
  const parks = [...moving, ...inTheWay].map((r) => ({ id: r.id, parkAt: ++free }));

  return { inserts, updates, parks, stale, unchanged };
}

/** Catches mistakes in the JSON before anything is written. */
function validate(data: SeedFile): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const uris = new Set<string>();
  for (const album of data.albums) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(album.slug)) errors.push(`bad slug "${album.slug}"`);
    if (slugs.has(album.slug)) errors.push(`duplicate slug "${album.slug}"`);
    slugs.add(album.slug);
    if (uris.has(album.spotifyUri)) errors.push(`duplicate album uri ${album.spotifyUri}`);
    uris.add(album.spotifyUri);
    if (album.releaseYear < 1999 || album.releaseYear > 2100) {
      errors.push(`${album.slug}: release year ${album.releaseYear}`);
    }
    const positions = new Set<string>();
    for (const song of album.songs) {
      const pos = `${song.discNumber}-${song.trackNumber}`;
      if (positions.has(pos)) errors.push(`${album.slug}: two songs on disc/track ${pos}`);
      positions.add(pos);
      if (uris.has(song.spotifyUri)) errors.push(`duplicate song uri ${song.spotifyUri}`);
      uris.add(song.spotifyUri);
      if (!(song.durationMs > 0)) errors.push(`${album.slug}: "${song.title}" has no duration`);
      if (!song.title.trim()) errors.push(`${album.slug}: empty title at ${pos}`);
    }
  }
  return errors;
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8")) as SeedFile;
  const errors = validate(data);
  if (errors.length) fail(`discography.json is invalid:\n  - ${errors.join("\n  - ")}`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) fail("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set.");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log(`${dryRun ? "[dry run] " : ""}Seeding ${data.albums.length} albums into ${url}`);

  const { data: existingAlbums, error: albumsError } = await supabase
    .from("albums")
    .select("id, slug");
  if (albumsError) fail(`Reading albums failed: ${albumsError.message}`);
  const albumIds = new Map(existingAlbums.map((a) => [a.slug as string, a.id as number]));

  let added = 0;
  let updated = 0;
  let unchanged = 0;
  let removed = 0;

  for (const album of data.albums) {
    const albumRow = {
      slug: album.slug,
      title: album.title,
      album_type: album.albumType,
      release_year: album.releaseYear,
      cover_url: album.coverUrl,
      spotify_uri: album.spotifyUri,
    };

    let albumId = albumIds.get(album.slug);
    if (!dryRun) {
      const { data: saved, error } = await supabase
        .from("albums")
        .upsert(albumRow, { onConflict: "slug" })
        .select("id")
        .single();
      if (error) fail(`Saving album ${album.slug} failed: ${error.message}`);
      albumId = saved.id as number;
    }

    const existing: SongRow[] = [];
    if (albumId !== undefined) {
      const { data: rows, error } = await supabase
        .from("songs")
        .select(
          "id, album_id, title, disc_number, track_number, duration_ms, spotify_uri, release_year",
        )
        .eq("album_id", albumId);
      if (error) fail(`Reading songs of ${album.slug} failed: ${error.message}`);
      existing.push(...(rows as SongRow[]));
    }

    const plan = planSongs(album.songs, existing);
    added += plan.inserts.length;
    updated += plan.updates.length;
    unchanged += plan.unchanged;
    if (prune) removed += plan.stale.length;

    if (!dryRun) {
      const sb = supabase;
      const update = async (id: number, values: Record<string, unknown>) => {
        const { error } = await sb.from("songs").update(values).eq("id", id);
        if (error) fail(`Updating song ${id} of ${album.slug} failed: ${error.message}`);
      };

      if (prune && plan.stale.length) {
        const { error } = await sb
          .from("songs")
          .delete()
          .in(
            "id",
            plan.stale.map((s) => s.id),
          );
        if (error) fail(`Pruning songs of ${album.slug} failed: ${error.message}`);
      }
      // Rows that change position (and stale rows sitting on a position that is needed) are first
      // parked on a free track number, so (album, disc, track) stays unique at every step.
      for (const { id, parkAt } of plan.parks) {
        if (!prune || !plan.stale.some((s) => s.id === id))
          await update(id, { track_number: parkAt });
      }
      for (const { id, values } of plan.updates) await update(id, values);
      if (plan.inserts.length) {
        const { error } = await sb
          .from("songs")
          .insert(plan.inserts.map((row) => ({ ...row, album_id: albumId as number })));
        if (error) fail(`Inserting songs of ${album.slug} failed: ${error.message}`);
      }
    }

    const notes = [
      plan.inserts.length && `${plan.inserts.length} new`,
      plan.updates.length && `${plan.updates.length} updated`,
      plan.stale.length && `${plan.stale.length} no longer in JSON${prune ? " (deleted)" : ""}`,
    ].filter(Boolean);
    console.log(
      `  ${albumIds.has(album.slug) ? "·" : "+"} ${album.title.padEnd(32)} ${String(album.songs.length).padStart(3)} songs${notes.length ? `  (${notes.join(", ")})` : ""}`,
    );
    for (const s of plan.stale) {
      console.log(`      stale: ${s.title} (disc ${s.disc_number}, #${s.track_number})`);
    }
  }

  console.log(
    `\n${dryRun ? "Would add" : "Added"} ${added}, ${dryRun ? "update" : "updated"} ${updated}, ` +
      `${unchanged} unchanged${prune ? `, ${dryRun ? "delete" : "deleted"} ${removed}` : ""}.`,
  );
  if (!prune && !dryRun) {
    console.log(
      "Songs no longer in the JSON are kept (plays may point at them); use --prune to delete.",
    );
  }
}

await main();
