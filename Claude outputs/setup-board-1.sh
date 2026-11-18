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
label "songs"     "a0522d" "Song catalogue page"
label "quiz"      "d93f0b" "Quiz feature"
label "spotify"   "1db954" "Spotify export / API"
label "lastfm"    "d51007" "Last.fm integration"
label "stats"     "8b0000" "Listening stats page"
label "auth"      "fbca04" "Accounts & authentication"
label "profile"   "c5def5" "User profiles"
label "social"    "e99695" "Following & public profiles"
label "spike"     "ededed" "Research / proof of concept"
label "legal"     "000000" "Privacy, terms, attribution"

echo "==> milestones"
milestone() { gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null 2>&1 || true; }
milestone "M0 - Foundation"     "Project setup, schema, theme, app shell"
milestone "M1 - Core features"  "Songs page, quiz, accounts and profiles"
milestone "M2 - Listening stats" "Spotify history upload, Last.fm, stats page, listener titles"
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
- `lastfm_connections` (user_id, username, session key, last_synced_at)
- `listening_imports` (user_id, export_end_date, uploaded_at)
- `plays` (user_id, song_id, played_at, ms_played, skipped, source: spotify_export | lastfm, is_estimate)
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
- Footer incl. Last.fm / Spotify attribution
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

# ---------------------------------------------------------------- M2 listening stats
issue "Stats page: locked state + unlock onboarding" "stats,frontend" "M2 - Listening stats" Todo <<'EOF'
Stats page is locked until the user has data. The locked state shows an "Unlock your stats" screen with two options:
1. **Upload Spotify history** - step-by-step guide to request the Extended Streaming History in Spotify's privacy settings (can take up to 30 days) + upload button
2. **Connect Last.fm** - for automatic updates

Also show a "waiting for your Spotify export" state with a reminder to come back.
EOF

issue "Upload + parse Spotify Extended Streaming History" "stats,spotify,frontend,backend" "M2 - Listening stats" Backlog <<'EOF'
- Accept the ZIP or the `Streaming_History_Audio_*.json` files
- Parse in the browser; keep only Avenged Sevenfold plays
- Strip personal fields (IP address, country, platform) before anything is sent to the server
- Store per play: `played_at`, `ms_played`, `skipped`, `reason_end`, song match, `source = spotify_export`
- Match plays to our songs table (by Spotify track URI, fallback on title)
- Save the export end date (latest timestamp) per user
EOF

issue "Re-upload with deduplication" "stats,backend" "M2 - Listening stats" Backlog <<'EOF'
Users can upload a newer export at any time. Only plays that don't exist yet are added (unique on user + played_at + track). Export end date gets updated.
EOF

issue "Connect Last.fm account" "stats,lastfm,backend,frontend" "M2 - Listening stats" Backlog <<'EOF'
- Last.fm web auth (or username for public profiles)
- Short explainer for users how to link Spotify to Last.fm (scrobbling)
- Disconnect option that removes Last.fm plays
EOF

issue "Last.fm sync job" "stats,lastfm,backend" "M2 - Listening stats" Backlog <<'EOF'
- Scheduled job pulls `user.getRecentTracks` (paginated, `from` = last sync)
- Keep only Avenged Sevenfold plays, match to songs table
- Minutes = play x song duration from our songs table (marked as estimate)
- First sync backfills full Last.fm history
EOF

issue "Merge data sources without double counting" "stats,backend" "M2 - Listening stats" Backlog <<'EOF'
- Spotify export is leading up to the export end date
- Last.fm plays are only counted after that date
- Without an export, Last.fm covers everything
- Every number carries a flag: exact (export) or estimate (Last.fm)
EOF

issue "Stats page: minutes + top songs per range" "stats,frontend" "M2 - Listening stats" Backlog <<'EOF'
Range filter: last month / 6 months / last year / lifetime.
- Minutes listened, play count, top songs, top albums
- "Exact" / "estimate" indicator and "data up to <date>" notice when the export is getting old (+ nudge to re-upload or connect Last.fm)
EOF

issue "Stats page: fun facts" "stats,frontend" "M2 - Listening stats" Backlog <<'EOF'
- Favourite hour of the day / day of the week
- Longest listening streak (days in a row)
- First ever Avenged Sevenfold play
- Most replayed song in one day
- Most skipped song (export data only)
EOF

issue "Listener titles per time range" "stats,frontend" "M2 - Listening stats" Backlog <<'EOF'
Tier system based on minutes, with separate thresholds per range (month / 6 months / year / lifetime).
Example tiers: "Waking the Fallen" -> "City of Evil Resident" -> "Deathbat Devotee" -> "Hail to the King".
Title + badge shown on the stats page and profile.
EOF

issue "Optional: Spotify login for live top tracks" "spotify,spike" "M2 - Listening stats" Backlog <<'EOF'
Nice-to-have. Spotify dev mode allows max 5 users and the app owner needs Premium, so only for a small group.
Could show live top tracks (`/me/top/tracks`, short/medium/long term) filtered on the band.
EOF

issue "Legal: privacy policy + attribution" "legal" "M2 - Listening stats" Backlog <<'EOF'
- Privacy policy (GDPR): what we store from uploads and Last.fm, how to delete it
- Delete all listening data on request / account deletion
- Last.fm (and Spotify, if used) attribution where their data is shown
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
