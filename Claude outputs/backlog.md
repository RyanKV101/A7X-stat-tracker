# A7X Stat Tracker - Backlog

Source of truth for all user stories and tasks. GitHub board: https://github.com/users/RyanKV101/projects/1 (repo `RyanKV101/A7X-stat-tracker`, private).

## Status overview

| # | Story | Milestone | Status |
|---|---|---|---|
| 1 | Project setup: Next.js, TypeScript, Tailwind | M0 - Foundation | ✅ Done (branch `feature/1-project-setup`, not pushed yet) |
| 2 | Supabase project + typed client | M0 - Foundation | ⏭️ Next (needs Supabase project from Ryan) |
| 3 | Database schema & migrations | M0 - Foundation | 🔜 Ready after #2 |
| 4 | CI: lint, typecheck and build on PRs | M0 - Foundation | Backlog |
| 5 | Deploy to Vercel | M0 - Foundation | Backlog |
| 6 | Deluxe dark theme | M0 - Foundation | 🔜 Ready (can be done in parallel) |
| 7 | Navigation and app layout | M0 - Foundation | Backlog |
| 8 | Seed discography data | M1 - Core features | Backlog |
| 9 | Browse all songs as cards | M1 - Core features | Backlog |
| 10 | Filter, search and sort songs | M1 - Core features | Backlog |
| 11 | Quiz question bank | M1 - Core features | Backlog |
| 12 | Questions generated from song data | M1 - Core features | Backlog |
| 13 | Play a random quiz question | M1 - Core features | Backlog |
| 14 | Track my quiz score | M1 - Core features | Backlog |
| 15 | Create an account | M1 - Core features | Backlog |
| 16 | Set up my profile | M1 - Core features | Backlog |
| 17 | View and edit my profile | M1 - Core features | Backlog |
| 18 | Manage my account | M1 - Core features | Backlog |
| 19 | Unlock my stats page | M2 - Listening stats | Backlog |
| 20 | Upload my Spotify listening history | M2 - Listening stats | Backlog |
| 21 | Upload a newer Spotify file | M2 - Listening stats | Backlog |
| 22 | Connect my Last.fm account | M2 - Listening stats | Backlog |
| 23 | Combine Spotify file and Last.fm data | M2 - Listening stats | Backlog |
| 24 | See my listening stats per time range | M2 - Listening stats | Backlog |
| 25 | See fun facts about my listening | M2 - Listening stats | Backlog |
| 26 | Get a listener title | M2 - Listening stats | Backlog |
| 27 | Spike: Spotify login for live top tracks | M2 - Listening stats | Backlog |
| 28 | Privacy policy and attribution | M2 - Listening stats | Backlog |
| 29 | Follow other fans | M3 - Social | Backlog |
| 30 | View someone else's profile | M3 - Social | Backlog |
| 31 | Search for users | M3 - Social | Backlog |
| 32 | Control who sees my stats | M3 - Social | Backlog |

## Decisions

- **Stack:** Next.js 16 (App Router, TS strict, `src/`), Tailwind 4, Supabase (auth, Postgres, storage), Vercel.
- **Branches:** `main` = production, `Development` = integration, one branch per story: `feature/<issue>-<name>` off `Development`.
- **Listening data:** Spotify Extended Streaming History upload (exact, any range) + optional Last.fm (automatic updates). File is leading up to its export end date, Last.fm after. Stats page is locked until there is data.
- **Spotify API login:** optional extra only (dev mode = max 5 users, owner needs Premium).
- **Quiz:** hand-checked question bank + questions generated from song data. No AI-generated facts.
- **Theme:** dark, crimson + antique gold, gothic headings. No official band logo/Deathbat as site branding.
- **GitHub access:** no standing access from Claude. Board updates via Chrome, a short-lived token, or Ryan moves cards.
- **Env:** `.env.local` only needs `NEXT_PUBLIC_SITE_URL` until #2 (Supabase keys) and #22 (Last.fm keys).

## Stories and acceptance criteria

### #1 Project setup: Next.js, TypeScript, Tailwind
*M0 - Foundation · labels: task, setup*

**Task**
Set up the base project so we can start building features.

**Acceptance criteria**
- [x] Next.js App Router + TypeScript (strict)
- [x] Tailwind CSS, ESLint and Prettier configured
- [x] Folder structure: `app/`, `components/`, `lib/`, `supabase/`
- [x] `.env.example` with all required variables
- [ ] `npm run dev`, `lint` and `build` run clean on `Development` (pass on the feature branch; merge pending)

### #2 Supabase project + typed client
*M0 - Foundation · labels: task, setup, backend*

**Task**
Connect the app to Supabase for auth, database and storage.

**Acceptance criteria**
- [ ] Supabase project created in an EU region
- [ ] Supabase CLI set up for local dev and migrations
- [ ] Server and browser clients via `@supabase/ssr`
- [ ] Generated DB types (`supabase gen types`)

### #3 Database schema & migrations
*M0 - Foundation · labels: task, backend*

**Task**
Create the database schema as migrations, with RLS on every table.

**Tables**
- `profiles` (id -> auth.users, username unique, nickname, bio, avatar_url, banner_url)
- `albums`, `songs` (title, album_id, track_number, duration_ms, spotify_uri, release_year)
- `quiz_questions` (question, answers, correct_answer, difficulty, category, explanation, source)
- `quiz_attempts` (user_id, question_id, correct, difficulty, answered_at)
- `follows` (follower_id, following_id)
- `lastfm_connections` (user_id, username, session_key, last_synced_at)
- `listening_imports` (user_id, export_end_date, uploaded_at)
- `plays` (user_id, song_id, played_at, ms_played, skipped, source, is_estimate)

**Acceptance criteria**
- [ ] All tables created through migrations
- [ ] RLS policies: users can only write their own data

### #4 CI: lint, typecheck and build on PRs
*M0 - Foundation · labels: task, setup*

**Task**
GitHub Actions workflow that checks every PR.

**Acceptance criteria**
- [ ] Runs on PRs to `Development` and `main`
- [ ] Install, lint, typecheck and build steps
- [ ] PR can't be merged when the check fails

### #5 Deploy to Vercel
*M0 - Foundation · labels: task, setup*

**Task**
Hosting with automatic deploys.

**Acceptance criteria**
- [ ] `Development` deploys to a preview URL
- [ ] `main` deploys to production
- [ ] Env vars set per environment

### #6 Deluxe dark theme
*M0 - Foundation · labels: user story, design*

**User story**
As a fan, I want the site to look dark, heavy and premium, so that it feels like it belongs to Avenged Sevenfold.

**Acceptance criteria**
- [ ] Near-black backgrounds with deep crimson and antique gold accents
- [ ] Gothic serif for headings, clean sans-serif for body text
- [ ] Design tokens (colors, type scale, spacing, radius, shadows) in the Tailwind config
- [ ] Base components: Button, Card, Input, Select, Tabs, Badge, Modal, Avatar
- [ ] No official band logo or Deathbat used as site branding
- [ ] Passes WCAG AA contrast

### #7 Navigation and app layout
*M0 - Foundation · labels: user story, frontend, design*

**User story**
As a visitor, I want clear navigation on every page, so that I can easily go between songs, quiz, stats and my profile.

**Acceptance criteria**
- [ ] Header with Songs, Quiz, Stats, Profile (and Login when logged out)
- [ ] Mobile menu
- [ ] Footer with Last.fm / Spotify attribution
- [ ] Loading skeletons, empty states and error pages

### #8 Seed discography data
*M1 - Core features · labels: task, data, songs*

**Task**
Fill the database with all albums and songs.

**Acceptance criteria**
- [ ] All studio albums with title, release year and cover URL
- [ ] All tracks with title, album, track number, duration and Spotify URI
- [ ] Decision made on live albums, EPs, B-sides and singles
- [ ] Seed script can be re-run without creating duplicates

### #9 Browse all songs as cards
*M1 - Core features · labels: user story, frontend, songs*

**User story**
As a fan, I want to see every song as a card with the album cover, song title and album name, so that I can browse the full discography at a glance.

**Acceptance criteria**
- [ ] One card per song with album cover, title and album name
- [ ] Responsive grid (mobile, tablet, desktop)
- [ ] Covers lazy-load and have a fallback when missing
- [ ] Works without being logged in

### #10 Filter, search and sort songs
*M1 - Core features · labels: user story, frontend, songs*

**User story**
As a fan, I want to filter songs by album and search by title, so that I can quickly find the song I'm looking for.

**Acceptance criteria**
- [ ] Filter on one or more albums
- [ ] Search by song title
- [ ] Sort by release, title or duration
- [ ] Filters are kept in the URL so I can share the view

### #11 Quiz question bank
*M1 - Core features · labels: task, data, quiz*

**Task**
Write and seed a hand-checked set of quiz questions.

**Acceptance criteria**
- [ ] At least 150 questions
- [ ] Each question has a difficulty (easy / medium / hard) and a category (songs, albums, members, history, fun facts)
- [ ] 4 answer options, 1 correct, plus a short explanation
- [ ] Every fact has a source note

### #12 Questions generated from song data
*M1 - Core features · labels: task, quiz, backend*

**Task**
Generate extra questions from the songs and albums tables so the quiz never runs out.

**Acceptance criteria**
- [ ] Templates like "Which album is <song> on?", "In which year was <album> released?", "Which track number is <song>?"
- [ ] Wrong answers are picked from real data (other albums, years)
- [ ] Difficulty set per template

### #13 Play a random quiz question
*M1 - Core features · labels: user story, frontend, quiz*

**User story**
As a fan, I want to get random questions about Avenged Sevenfold at a difficulty I choose, so that I can test how well I know the band.

**Acceptance criteria**
- [ ] I can pick easy, medium, hard or mixed
- [ ] I get a random question and don't see the same one twice in a session
- [ ] After answering I see if I was right plus the explanation
- [ ] I can go to the next question
- [ ] Works without an account; scores are only saved when logged in

### #14 Track my quiz score
*M1 - Core features · labels: user story, backend, quiz*

**User story**
As a logged-in fan, I want my quiz results to be saved, so that I can see how I'm improving and show off my score.

**Acceptance criteria**
- [ ] Every answer is saved for logged-in users
- [ ] Stats: total answered, accuracy overall and per difficulty, best streak
- [ ] Stats are shown on my profile

### #15 Create an account
*M1 - Core features · labels: user story, auth*

**User story**
As a visitor, I want to create an account with my email, password and username, so that I can save my stats and get a profile.

**Acceptance criteria**
- [ ] Sign up with email, password and a unique username
- [ ] Email verification
- [ ] Login and logout
- [ ] Password reset via email
- [ ] Clear error messages (username taken, weak password, etc.)

### #16 Set up my profile
*M1 - Core features · labels: user story, profile, backend*

**User story**
As a new user, I want to add a nickname, bio, profile picture and banner, so that my profile feels like mine.

**Acceptance criteria**
- [ ] Nickname and bio with length limits
- [ ] Profile picture and banner upload (JPG/PNG/WebP, max size)
- [ ] Crop to the right ratio before uploading
- [ ] Images stored in Supabase Storage; only I can change mine

### #17 View and edit my profile
*M1 - Core features · labels: user story, frontend, profile*

**User story**
As a user, I want to see my own profile and edit it, so that I can keep it up to date.

**Acceptance criteria**
- [ ] Profile page shows banner, picture, nickname, username, bio, listener title, quiz stats and listening stats
- [ ] Edit form for all profile fields, including new pictures
- [ ] Changes are visible right after saving

### #18 Manage my account
*M1 - Core features · labels: user story, auth*

**User story**
As a user, I want to change my email or password and delete my account, so that I'm in control of my data.

**Acceptance criteria**
- [ ] Change email (with verification) and password
- [ ] Delete account removes all my data, plays and uploaded images
- [ ] Confirmation step before deleting

### #19 Unlock my stats page
*M2 - Listening stats · labels: user story, stats, frontend*

**User story**
As a user without listening data yet, I want a clear explanation of how to unlock my stats, so that I know exactly what to do.

**Acceptance criteria**
- [ ] Stats page is locked until I have data
- [ ] Unlock screen with two options: upload Spotify history or connect Last.fm
- [ ] Step-by-step guide to request the Extended Streaming History from Spotify (incl. "can take up to 30 days")
- [ ] "Waiting for your Spotify export" state with a reminder to come back

### #20 Upload my Spotify listening history
*M2 - Listening stats · labels: user story, stats, spotify*

**User story**
As a user, I want to upload my Spotify Extended Streaming History, so that I get exact stats for my whole listening history.

**Acceptance criteria**
- [ ] Accepts the ZIP or the `Streaming_History_Audio_*.json` files
- [ ] File is parsed in the browser; only Avenged Sevenfold plays are kept
- [ ] IP address, country and device info are removed before anything is sent
- [ ] Per play we store time, ms played, skipped and the matched song
- [ ] Progress indicator and a summary afterwards ("1.234 plays imported")
- [ ] The export end date is saved

### #21 Upload a newer Spotify file
*M2 - Listening stats · labels: user story, stats, backend*

**User story**
As a user, I want to upload a newer export later, so that my stats are up to date without being counted twice.

**Acceptance criteria**
- [ ] Only plays that don't exist yet are added
- [ ] Export end date is updated
- [ ] Summary shows how many new plays were added

### #22 Connect my Last.fm account
*M2 - Listening stats · labels: user story, stats, lastfm*

**User story**
As a user, I want to connect Last.fm next to (or instead of) the Spotify file, so that my stats update automatically.

**Acceptance criteria**
- [ ] Connect via Last.fm login
- [ ] Short explainer on linking Spotify to Last.fm
- [ ] First sync imports my full Last.fm history
- [ ] Scheduled sync pulls new plays (only Avenged Sevenfold)
- [ ] Minutes = plays x song duration, marked as estimate
- [ ] Disconnect removes Last.fm data

### #23 Combine Spotify file and Last.fm data
*M2 - Listening stats · labels: task, stats, backend*

**Task**
Merge both sources without counting plays twice.

**Acceptance criteria**
- [ ] Spotify file is leading up to its export end date
- [ ] Last.fm plays only count after that date
- [ ] Without a file, Last.fm covers everything
- [ ] Every number knows whether it's exact or an estimate

### #24 See my listening stats per time range
*M2 - Listening stats · labels: user story, stats, frontend*

**User story**
As a fan, I want to see how many minutes I listened to Avenged Sevenfold and my top songs for last month, 6 months, last year and lifetime, so that I know what kind of fan I am.

**Acceptance criteria**
- [ ] Range filter: last month / 6 months / last year / lifetime
- [ ] Minutes listened, play count, top songs, top albums
- [ ] "Exact" or "estimate" indicator
- [ ] Notice "data up to <date>" when the file is getting old, with a nudge to re-upload or connect Last.fm

### #25 See fun facts about my listening
*M2 - Listening stats · labels: user story, stats, frontend*

**User story**
As a fan, I want fun facts about my listening, so that the stats page is more than just numbers.

**Acceptance criteria**
- [ ] Favourite hour of the day and day of the week
- [ ] Longest listening streak in days
- [ ] My first ever Avenged Sevenfold play
- [ ] Most replayed song in one day
- [ ] Most skipped song (only with the Spotify file)
- [ ] Fun facts follow the selected time range

### #26 Get a listener title
*M2 - Listening stats · labels: user story, stats, frontend*

**User story**
As a fan, I want to get a title based on how much I listened in the selected time range, so that I can show what kind of listener I am.

**Acceptance criteria**
- [ ] Tiers based on minutes, with separate thresholds per range (month / 6 months / year / lifetime)
- [ ] Example tiers: "Waking the Fallen" -> "City of Evil Resident" -> "Deathbat Devotee" -> "Hail to the King"
- [ ] Title + badge changes when I switch the range
- [ ] Title is shown on my profile

### #27 Spike: Spotify login for live top tracks
*M2 - Listening stats · labels: spike, spotify*

**Spike**
Nice-to-have. Spotify dev mode allows max 5 users and the app owner needs Premium.

**Outcome**
- [ ] Decide if live top tracks via `/me/top/tracks` are worth it for a small group

### #28 Privacy policy and attribution
*M2 - Listening stats · labels: task, legal*

**Task**

**Acceptance criteria**
- [ ] Privacy policy (GDPR): what we store from uploads and Last.fm and how to delete it
- [ ] Listening data deleted on request or account deletion
- [ ] Last.fm (and Spotify, if used) attribution where their data is shown

### #29 Follow other fans
*M3 - Social · labels: user story, social*

**User story**
As a user, I want to follow other fans, so that I can keep track of their stats and compare with mine.

**Acceptance criteria**
- [ ] Follow / unfollow button on profiles
- [ ] Follower and following counts
- [ ] Lists of my followers and who I follow

### #30 View someone else's profile
*M3 - Social · labels: user story, social, frontend*

**User story**
As a user, I want to view other people's profiles with their listening and quiz stats, so that I can see how I compare.

**Acceptance criteria**
- [ ] `/u/<username>` shows banner, picture, nickname, bio and listener title
- [ ] Listening stats with the same range filter as my own stats page
- [ ] Quiz stats: answered, accuracy per difficulty, best streak
- [ ] Respects that user's privacy settings

### #31 Search for users
*M3 - Social · labels: user story, social, frontend*

**User story**
As a user, I want to search for other fans by username or nickname, so that I can find my friends.

**Acceptance criteria**
- [ ] Search on username and nickname
- [ ] Results show picture, nickname, username and follow button

### #32 Control who sees my stats
*M3 - Social · labels: user story, social, backend*

**User story**
As a user, I want to choose who can see my listening and quiz stats, so that I decide what I share.

**Acceptance criteria**
- [ ] Separate settings for listening stats and quiz stats
- [ ] Options: everyone / followers only / only me
- [ ] Enforced in the database (RLS), not just hidden in the UI
