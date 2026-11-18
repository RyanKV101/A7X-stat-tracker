#!/usr/bin/env bash
# Sets up labels, milestones, a GitHub Project board
# (Backlog / Todo / In Progress / In Review / Done) and the full issue backlog.
#
# Usage:   ./setup-board.sh [owner/repo]   (default: RyanKV101/A7X-stat-tracker)
# Needs:   gh logged in with project scope ->  gh auth refresh -s project
set -euo pipefail

REPO="${1:-RyanKV101/A7X-stat-tracker}"
OWNER="${REPO%%/*}"
PROJECT_TITLE="A7X Stat Tracker"

echo "==> labels"
label() { gh label create "$1" --repo "$REPO" --color "$2" --description "$3" --force >/dev/null; }
label "setup"     "5c5c5c" "Tooling, infra, CI/CD"
label "design"    "b8860b" "Theme, UI, UX"
label "frontend"  "1d76db" "Pages and components"
label "backend"   "0e8a16" "DB, API, server logic"
label "data"      "6f42c1" "Discography / quiz content"
label "songs"     "8b0000" "Song catalogue page"
label "quiz"      "d93f0b" "Quiz feature"
label "spotify"   "1db954" "Spotify integration & stats"
label "auth"      "fbca04" "Accounts & authentication"
label "profile"   "c5def5" "User profiles"
label "social"    "e99695" "Following & public profiles"
label "spike"     "ededed" "Research / proof of concept"
label "legal"     "000000" "Privacy, terms, attribution"

echo "==> milestones"
milestone() { gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null 2>&1 || true; }
milestone "M0 - Foundation"     "Project setup, schema, theme, app shell"
milestone "M1 - Core features"  "Songs page, quiz, accounts and profiles"
milestone "M2 - Spotify stats"  "Spotify connect, listening stats, listener titles"
milestone "M3 - Social"         "Following, public profiles, privacy"

echo "==> project board"
PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json --jq .number)
PROJECT_ID=$(gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq .id)
gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$REPO" >/dev/null
STATUS_FIELD_ID=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name=="Status") | .id')

gh api graphql >/dev/null -f field="$STATUS_FIELD_ID" -f query='
mutation($field: ID!) {
  updateProjectV2Field(input: {
    fieldId: $field,
    singleSelectOptions: [
      {name: "Backlog",     color: GRAY,   description: "Not planned yet"},
      {name: "Todo",        color: BLUE,   description: "Ready to pick up"},
      {name: "In Progress", color: YELLOW, description: "Being worked on"},
      {name: "In Review",   color: PURPLE, description: "PR open / testing"},
      {name: "Done",        color: GREEN,  description: "Merged into Development"}
    ]
  }) {
    projectV2Field { ... on ProjectV2SingleSelectField { options { id name } } }
  }
}'
opt_id() {
  gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
    --jq ".fields[] | select(.name==\"Status\") | .options[] | select(.name==\"$1\") | .id"
}
BACKLOG_ID=$(opt_id "Backlog")
TODO_ID=$(opt_id "Todo")

# issue "<title>" "<labels>" "<milestone>" <Backlog|Todo>   (body via stdin)
issue() {
  local body url item status_id
  body=$(cat)
  url=$(gh issue create --repo "$REPO" --title "$1" --label "$2" --milestone "$3" --body "$body")
  item=$(gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$url" --format json --jq .id)
  [[ "$4" == "Todo" ]] && status_id="$TODO_ID" || status_id="$BACKLOG_ID"
  gh project item-edit --id "$item" --project-id "$PROJECT_ID" \
    --field-id "$STATUS_FIELD_ID" --single-select-option-id "$status_id" >/dev/null
  echo "   + $1"
}

echo "==> issues"
# ---------------------------------------------------------------- M0
issue "Project setup: Next.js (App Router, TypeScript, Tailwind)" "setup" "M0 - Foundation" Todo <<'EOF'
- Next.js App Router + TypeScript (strict)
- Tailwind CSS, ESLint, Prettier
- Folder structure: `app/`, `components/`, `lib/`, `supabase/`
- `.env.example` with all required variables

**Done when:** `npm run dev`, `lint` and `build` run clean on `Development`.
EOF

issue "Supabase project + typed client" "setup,backend" "M0 - Foundation" Todo <<'EOF'
- Create Supabase project (EU region)
- Supabase CLI for local dev + migrations
- Server and browser clients via `@supabase/ssr`
- Generated DB types (`supabase gen types`)
EOF

issue "Database schema & migrations" "backend" "M0 - Foundation" Todo <<'EOF'
Tables (with RLS on all of them):
- `profiles` (id → auth.users, username unique, nickname, bio, avatar_url, banner_url)
- `albums`, `songs` (title, album_id, track_number, duration_ms, spotify_id, release_year)
- `quiz_questions` (question, answers, correct_answer, difficulty, category, explanation)
- `quiz_attempts` (user_id, question_id, correct, difficulty, answered_at)
- `follows` (follower_id, following_id)
- `spotify_connections` (user_id, encrypted tokens, expires_at)
- `plays` (user_id, song_id, played_at, ms_played, source)
EOF

issue "CI: lint, typecheck and build on PRs" "setup" "M0 - Foundation" Backlog <<'EOF'
GitHub Actions workflow on PRs to `Development` and `main`: install, lint, typecheck, build.
EOF

issue "Deploy to Vercel (preview + production)" "setup" "M0 - Foundation" Backlog <<'EOF'
- `Development` → preview, `main` → production
- Env vars per environment
EOF

issue "Design system: deluxe dark theme" "design" "M0 - Foundation" Todo <<'EOF'
Direction: dark and premium. Near-black backgrounds, deep crimson and antique gold accents, subtle grain/metal textures, gothic serif for headings + clean sans for body.

- Design tokens (colors, type scale, spacing, radius, shadows) in Tailwind config
- Base components: Button, Card, Input, Select, Tabs, Badge, Modal, Avatar
- No official band logos/artwork in the UI chrome (only album covers on song cards)
EOF

issue "App shell: navigation, layout, states" "frontend,design" "M0 - Foundation" Backlog <<'EOF'
- Header nav (Songs, Quiz, Stats, Profile) + mobile menu
- Footer incl. Spotify attribution
- Reusable loading skeletons, empty states and error boundaries
EOF

# ---------------------------------------------------------------- M1 songs
issue "Seed discography data" "data,songs" "M1 - Core features" Backlog <<'EOF'
Seed all studio albums + tracks (title, album, track number, duration, release year, Spotify ID).
Source: MusicBrainz and/or Spotify single-album endpoint (batch endpoints were removed in Feb 2026).
Decide on scope for live albums, EPs, B-sides and singles.
EOF

issue "Album cover sourcing + caching" "data,songs" "M1 - Core features" Backlog <<'EOF'
- Get cover URLs from Spotify album objects or the Cover Art Archive
- Store URL per album, use `next/image` with remote patterns
- Fallback placeholder when a cover is missing
EOF

issue "Songs page: grid of song cards" "frontend,songs" "M1 - Core features" Backlog <<'EOF'
Card per song with album cover, song title and album name. Responsive grid, lazy-loaded images.
EOF

issue "Songs page: filter, search and sort" "frontend,songs" "M1 - Core features" Backlog <<'EOF'
- Filter by album
- Search by title
- Sort by album/release, title, duration
- Filters reflected in the URL (shareable)
EOF

# ---------------------------------------------------------------- M1 quiz
issue "Quiz question bank (curated)" "data,quiz" "M1 - Core features" Backlog <<'EOF'
Seed 150+ hand-checked questions, each with difficulty (easy / medium / hard), category (songs, albums, members, history, fun facts), 4 answers and a short explanation.
Every fact needs a source note so content stays correct.
EOF

issue "Generated questions from discography data" "quiz,backend" "M1 - Core features" Backlog <<'EOF'
Templates that build questions from the songs/albums tables, e.g.
- "Which album is <song> on?"
- "In which year was <album> released?"
- "Which track number is <song> on <album>?"
Difficulty derived from template + how well-known the song is.
EOF

issue "Quiz page: random question per difficulty" "frontend,quiz" "M1 - Core features" Backlog <<'EOF'
- Difficulty selector (easy / medium / hard / mixed)
- Random question, avoid repeats within a session
- Instant feedback + explanation, next-question button
- Works for guests; scores only saved when logged in
EOF

issue "Quiz sessions, scoring and stats" "backend,quiz" "M1 - Core features" Backlog <<'EOF'
Save attempts and compute per user: total answered, accuracy overall and per difficulty, best streak. Used on profile pages.
EOF

# ---------------------------------------------------------------- M1 auth/profile
issue "Auth: sign up / login with email + password" "auth" "M1 - Core features" Backlog <<'EOF'
Supabase Auth: sign up, login, logout, email verification, password reset. Protected routes via middleware.
EOF

issue "Profile model: username, nickname, bio" "backend,profile" "M1 - Core features" Backlog <<'EOF'
- Profile row created on sign up
- Unique, validated username (used in profile URL `/u/<username>`)
- Nickname (display name) and bio with length limits
EOF

issue "Avatar + banner upload" "profile,frontend" "M1 - Core features" Backlog <<'EOF'
- Supabase Storage buckets with RLS (users can only write their own files)
- Type/size validation, crop to correct ratio, compress before upload
EOF

issue "Own profile page + edit profile" "frontend,profile" "M1 - Core features" Backlog <<'EOF'
Profile page with banner, avatar, nickname, username, bio, quiz stats and listening stats. Edit form for all profile fields.
EOF

issue "Account settings: email, password, delete account" "auth" "M1 - Core features" Backlog <<'EOF'
Change email and password, disconnect Spotify, delete account incl. all data and uploaded images (GDPR).
EOF

# ---------------------------------------------------------------- M2 spotify
issue "Spike: Spotify API limits vs Last.fm" "spike,spotify" "M2 - Spotify stats" Todo <<'EOF'
Spotify dev mode (since Feb 2026): app owner needs Premium, max 5 users per app, extended quota only for larger organisations.
The API has no "minutes listened" endpoint: only top tracks per range and the last 50 recently played tracks.

Investigate:
- Is Spotify dev mode enough (personal / small group)?
- Last.fm as extra/alternative source (full scrobble history, no user cap)
- Spotify Extended Streaming History import for lifetime minutes

**Outcome:** decision on data sources for the stats page.
EOF

issue "Spotify connect / disconnect (OAuth)" "spotify,backend" "M2 - Spotify stats" Backlog <<'EOF'
Authorization Code + PKCE, scopes `user-top-read` and `user-read-recently-played`. Encrypted token storage, refresh handling, disconnect.
EOF

issue "Top Avenged Sevenfold tracks per time range" "spotify,backend" "M2 - Spotify stats" Backlog <<'EOF'
`/me/top/tracks` for `short_term` (~4 weeks), `medium_term` (~6 months) and `long_term` (~1 year), filtered on the band's artist ID. Also rank of the band in `/me/top/artists`.
EOF

issue "Recently-played sync job" "spotify,backend" "M2 - Spotify stats" Backlog <<'EOF'
Scheduled job (every 30-60 min) that pulls `/me/player/recently-played`, keeps only band tracks and stores them in `plays` (deduped on played_at).
This builds the user's own history from the moment they connect -> minutes per month / 6 months / year.
EOF

issue "Import Spotify Extended Streaming History" "spotify,backend,frontend" "M2 - Spotify stats" Backlog <<'EOF'
User uploads the JSON files from Spotify's privacy data export. Parse in the browser, keep only band tracks, store `ms_played` per play.
This is the only way to get real lifetime minutes.
EOF

issue "Stats page: minutes, top songs, fun facts" "frontend,spotify" "M2 - Spotify stats" Backlog <<'EOF'
Range filter: last month / 6 months / year / lifetime.
- Minutes listened, play count, top songs, top albums
- Fun facts: favourite hour/day, longest streak, most-replayed song, first play
- Clear notice which numbers are estimates vs exact
EOF

issue "Listener titles per time range" "spotify,frontend" "M2 - Spotify stats" Backlog <<'EOF'
Tier system based on minutes, with separate thresholds per range (month / 6 months / year / lifetime).
Example tiers: "Waking the Fallen" -> "City of Evil Resident" -> "Deathbat Devotee" -> "Hail to the King".
Title + badge shown on the stats page and profile.
EOF

issue "Legal: privacy policy + Spotify attribution" "legal" "M2 - Spotify stats" Backlog <<'EOF'
Privacy policy (GDPR), Spotify Developer Terms compliance, Spotify logo/attribution where Spotify data is shown, delete-on-disconnect.
EOF

# ---------------------------------------------------------------- M3 social
issue "Follow / unfollow users" "social,backend,frontend" "M3 - Social" Backlog <<'EOF'
Follow button, follower/following counts and lists.
EOF

issue "Public profile: listening + quiz stats" "social,frontend" "M3 - Social" Backlog <<'EOF'
`/u/<username>` with banner, avatar, bio, listener title, listening stats and quiz stats (respecting privacy settings).
EOF

issue "User search" "social,frontend" "M3 - Social" Backlog <<'EOF'
Search users by username or nickname.
EOF

issue "Privacy settings for stats" "social,backend" "M3 - Social" Backlog <<'EOF'
Per user: listening stats and quiz stats visible to everyone / followers only / only me. Enforced in RLS, not just in the UI.
EOF

echo
echo "Done. Project: https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
echo "Tip: open the project and switch the view layout to 'Board'."
