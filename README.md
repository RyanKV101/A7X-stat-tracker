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

| Command                       | What it does                                                     |
| ----------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                 | Start the dev server                                             |
| `npm run build`               | Production build                                                 |
| `npm run start`               | Run the production build                                         |
| `npm run lint`                | ESLint                                                           |
| `npm run typecheck`           | TypeScript check                                                 |
| `npm run format`              | Format all files with Prettier                                   |
| `npm run format:check`        | Check formatting                                                 |
| `npm run db:start`            | Start the local Supabase stack (needs Docker)                    |
| `npm run db:stop`             | Stop the local Supabase stack                                    |
| `npm run db:reset`            | Rebuild the local DB from migrations and seed                    |
| `npm run db:migration <name>` | Create a new migration file                                      |
| `npm run db:push`             | Apply migrations to the linked Supabase project                  |
| `npm run db:types`            | Regenerate `src/types/database.types.ts` from the linked project |

## Supabase

The hosted project runs in an EU region (Frankfurt). The Supabase CLI is installed as a dev dependency, so use it through `npx supabase`.

One-time setup:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>   # asks for the database password
```

Workflow for schema changes:

1. `npm run db:migration <name>` and write the SQL in `supabase/migrations/`
2. `npm run db:reset` to test it locally (optional, needs Docker)
3. `npm run db:push` to apply it to the hosted project
4. `npm run db:types` to update the TypeScript types

Clients live in `src/lib/supabase/`:

- `client.ts`: for Client Components
- `server.ts`: for Server Components, Server Actions and Route Handlers
- `proxy.ts`: refreshes the auth session on every request (wired up in `src/proxy.ts`)

## Project structure

```
src/
  app/          routes, layouts and pages
  components/   reusable UI components
  lib/          helpers, clients and shared logic
  types/        shared types, incl. generated database types
  proxy.ts      runs on every request (Supabase session refresh)
supabase/       config, migrations and seed data
```

## Branches

- `main`: production
- `Development`: integration branch, feature branches are merged here
- `feature/<issue>-<name>`: one branch per issue
