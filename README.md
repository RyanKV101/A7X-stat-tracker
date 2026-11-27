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

| Command                       | What it does                                                               |
| ----------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                 | Start the dev server                                                       |
| `npm run build`               | Production build                                                           |
| `npm run start`               | Run the production build                                                   |
| `npm run lint`                | ESLint                                                                     |
| `npm run typecheck`           | TypeScript check                                                           |
| `npm run format`              | Format all files with Prettier                                             |
| `npm run format:check`        | Check formatting                                                           |
| `npm run db:start`            | Start the local Supabase stack (needs Docker)                              |
| `npm run db:stop`             | Stop the local Supabase stack                                              |
| `npm run db:reset`            | Rebuild the local DB from migrations and seed                              |
| `npm run db:migration <name>` | Create a new migration file                                                |
| `npm run db:push`             | Apply migrations to the linked Supabase project                            |
| `npm run db:types`            | Regenerate `src/types/database.types.ts` from the linked project           |
| `npm run discography:fetch`   | Fetch albums and tracks from Spotify into `supabase/seed/discography.json` |
| `npm run db:seed`             | Load `discography.json` into the albums and songs tables                   |

## Supabase

The hosted project runs in an EU region (West EU, Ireland). The Supabase CLI is installed as a dev dependency, so use it through `npx supabase`.

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

## Discography data

Albums and songs come from the Spotify Web API and are stored in `supabase/seed/discography.json`, which is committed, so seeding doesn't need Spotify access.

- **What's included** is set in `scripts/discography/releases.json`: the 8 studio albums, the EPs (Warmness on the Soul if it's on Spotify, Black Reign) and Diamonds in the Rough (B-sides). The studio bonus tracks of The Stage deluxe edition (Dose + covers) are stored as disc 2 of The Stage. Live albums and live tracks are left out. Release years are the original ones, not Spotify's reissue dates.
- **Fetch** (`npm run discography:fetch`) needs `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from an app on the [Spotify dashboard](https://developer.spotify.com/dashboard) (client credentials, no user login). It pins the chosen edition of every release in the JSON, so later runs pick the same one; use `-- --refresh` to resolve them again. At the end it lists Spotify releases that aren't in `releases.json`, so non-album singles can be added there.
- **Seed** (`npm run db:seed`) uses the service role key. Albums upsert on `slug`; songs are matched on Spotify URI (or position + title), so re-running never creates duplicates and song ids (and the plays pointing at them) stay the same. `-- --dry-run` shows what would change, `-- --prune` deletes songs that are no longer in the JSON.

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

## Theme

Dark, crimson and antique gold. Cinzel for headings (`font-display`), Inter for body text (`font-sans`), both via `next/font`.

- **Tokens** live in `src/app/globals.css` in the `@theme` block (Tailwind 4 has no `tailwind.config`). The default Tailwind palette is switched off, so only these colors exist: `ink`, `bone`, `crimson`, `gold`, plus semantic aliases (`background`, `surface`, `surface-raised`, `border`, `border-strong`, `foreground`, `muted`, `subtle`, `primary`, `accent`, `danger`, `success`). Also a type scale (`text-display`, `text-h1`-`text-h3`, `text-eyebrow`), radius, shadows (`shadow-card`, `shadow-raised`, `shadow-glow-crimson`, `shadow-glow-gold`) and two utilities (`text-gold-gradient`, `divider-ornament`).
- **Components** in `src/components/ui` (import from `@/components/ui`): Button (+ `buttonClasses` for links), Card, Input, Select, Tabs, Badge, Modal, Avatar.
- **Style guide:** `/design` shows every token and component. Only in `npm run dev`; it 404s in production.
- **Contrast:** all text pairings used by the components meet WCAG AA (4.5:1), borders and focus rings 3:1. Keep body text on `foreground`/`muted`/`subtle` and don't put `crimson-500` or darker text on dark backgrounds.
- **Branding:** no official band logo or Deathbat as site branding.

## Layout

Every page gets the header, footer and a skip link from `src/app/layout.tsx`. Page content renders inside `<main>`, so pages start with a `Container` (`@/components/layout/container`) and a `PageHeader` (the page's `h1`), not their own `<main>`.

- **Navigation:** sections are listed once in `src/lib/nav.ts` (header, mobile menu and footer all read from it). The current section gets `aria-current="page"`.
- **Header:** `src/components/layout/site-header.tsx`. Shows "Log in" when logged out and your avatar when logged in (`getCurrentUser()` in `src/lib/auth/current-user.ts`, cached per request). That part sits in a `<Suspense>` because `cacheComponents` is on: anything reading cookies must be inside a Suspense boundary (or a route with a `loading.tsx`).
- **Mobile menu:** below `md`. Closes on Escape, on navigation and when the window grows past `md`; locks page scroll while open.
- **States:** `Skeleton` and `EmptyState` in `@/components/ui`. Default page skeleton in `src/app/loading.tsx` (sections can add their own, see `songs/loading.tsx`), plus `error.tsx`, `global-error.tsx` and `not-found.tsx`.

## Branches

- `main`: production
- `Development`: integration branch, feature branches are merged here
- `feature/<issue>-<name>`: one branch per issue
