# A7X Stat Tracker

Fan site for Avenged Sevenfold: browse every song, play the quiz, track your listening stats and follow other fans.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (auth, Postgres, storage)
- Spotify Extended Streaming History upload + [Last.fm](https://www.last.fm/api) for listening data

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | What it does                   |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start the dev server           |
| `npm run build`        | Production build               |
| `npm run start`        | Run the production build       |
| `npm run lint`         | ESLint                         |
| `npm run typecheck`    | TypeScript check               |
| `npm run format`       | Format all files with Prettier |
| `npm run format:check` | Check formatting               |

## Project structure

```
src/
  app/          routes, layouts and pages
  components/   reusable UI components
  lib/          helpers, clients and shared logic
supabase/       migrations and seed data
```

## Branches

- `main`: production
- `Development`: integration branch, feature branches are merged here
- `feature/<issue>-<name>`: one branch per issue
