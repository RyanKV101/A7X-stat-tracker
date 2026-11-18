-- #3 Database schema & migrations
-- Initial schema for the A7X Stat Tracker. RLS is enabled on every table.

-- ---------------------------------------------------------------------------
-- Extensions & enums
-- ---------------------------------------------------------------------------

create extension if not exists citext with schema extensions;

create type public.album_type as enum ('studio', 'live', 'ep', 'single', 'compilation');
create type public.quiz_difficulty as enum ('easy', 'medium', 'hard');
create type public.quiz_category as enum ('songs', 'albums', 'members', 'history', 'fun_facts');
create type public.play_source as enum ('spotify_file', 'lastfm');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext not null unique
    check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  nickname text check (char_length(nickname) <= 40),
  bio text check (char_length(bio) <= 300),
  avatar_url text,
  banner_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- albums & songs
-- ---------------------------------------------------------------------------

create table public.albums (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  album_type public.album_type not null default 'studio',
  release_year smallint not null check (release_year between 1999 and 2100),
  cover_url text,
  spotify_uri text unique,
  created_at timestamptz not null default now()
);

create table public.songs (
  id bigint generated always as identity primary key,
  album_id bigint not null references public.albums (id) on delete cascade,
  title text not null,
  disc_number smallint not null default 1 check (disc_number > 0),
  track_number smallint not null check (track_number > 0),
  duration_ms integer not null check (duration_ms > 0),
  spotify_uri text unique,
  release_year smallint not null check (release_year between 1999 and 2100),
  created_at timestamptz not null default now(),
  unique (album_id, disc_number, track_number)
);

create index songs_album_id_idx on public.songs (album_id);
create index songs_title_idx on public.songs (lower(title));

-- ---------------------------------------------------------------------------
-- quiz
-- ---------------------------------------------------------------------------

create table public.quiz_questions (
  id bigint generated always as identity primary key,
  question text not null,
  answers text[] not null check (cardinality(answers) = 4),
  correct_answer text not null,
  difficulty public.quiz_difficulty not null,
  category public.quiz_category not null,
  explanation text,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (correct_answer = any (answers))
);

create index quiz_questions_difficulty_idx on public.quiz_questions (difficulty) where is_active;

-- question_id is nullable: questions generated from song data (#12) have no row.
create table public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id bigint references public.quiz_questions (id) on delete set null,
  correct boolean not null,
  difficulty public.quiz_difficulty not null,
  answered_at timestamptz not null default now()
);

create index quiz_attempts_user_answered_idx on public.quiz_attempts (user_id, answered_at desc);

-- ---------------------------------------------------------------------------
-- follows
-- ---------------------------------------------------------------------------

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index follows_following_id_idx on public.follows (following_id);

-- ---------------------------------------------------------------------------
-- listening data
-- ---------------------------------------------------------------------------

create table public.lastfm_connections (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  username text not null,
  session_key text not null,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.listening_imports (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  export_end_date timestamptz not null,
  plays_imported integer not null default 0 check (plays_imported >= 0),
  uploaded_at timestamptz not null default now()
);

create index listening_imports_user_idx on public.listening_imports (user_id, export_end_date desc);

create table public.plays (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  song_id bigint not null references public.songs (id) on delete cascade,
  played_at timestamptz not null,
  ms_played integer not null check (ms_played >= 0),
  skipped boolean, -- null when unknown (Last.fm)
  source public.play_source not null,
  is_estimate boolean not null default false,
  created_at timestamptz not null default now(),
  -- lets a re-upload (#21) or re-sync skip plays that already exist
  unique (user_id, source, song_id, played_at)
);

create index plays_user_played_at_idx on public.plays (user_id, played_at desc);
create index plays_song_id_idx on public.plays (song_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.albums enable row level security;
alter table public.songs enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.follows enable row level security;
alter table public.lastfm_connections enable row level security;
alter table public.listening_imports enable row level security;
alter table public.plays enable row level security;

-- profiles: public read, owner writes
create policy "Profiles are viewable by everyone"
  on public.profiles for select to anon, authenticated
  using (true);

create policy "Users can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- albums, songs, quiz_questions: public read, writes only via service role / migrations
create policy "Albums are viewable by everyone"
  on public.albums for select to anon, authenticated
  using (true);

create policy "Songs are viewable by everyone"
  on public.songs for select to anon, authenticated
  using (true);

create policy "Active quiz questions are viewable by everyone"
  on public.quiz_questions for select to anon, authenticated
  using (is_active);

-- quiz_attempts: owner only (visibility for others follows in #30 / #32)
create policy "Users can view their own quiz attempts"
  on public.quiz_attempts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own quiz attempts"
  on public.quiz_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- follows: public read, follower writes
create policy "Follows are viewable by everyone"
  on public.follows for select to anon, authenticated
  using (true);

create policy "Users can follow others"
  on public.follows for insert to authenticated
  with check ((select auth.uid()) = follower_id);

create policy "Users can unfollow others"
  on public.follows for delete to authenticated
  using ((select auth.uid()) = follower_id);

-- lastfm_connections: owner only
create policy "Users can view their own Last.fm connection"
  on public.lastfm_connections for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own Last.fm connection"
  on public.lastfm_connections for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own Last.fm connection"
  on public.lastfm_connections for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own Last.fm connection"
  on public.lastfm_connections for delete to authenticated
  using ((select auth.uid()) = user_id);

-- listening_imports: owner only
create policy "Users can view their own imports"
  on public.listening_imports for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own imports"
  on public.listening_imports for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own imports"
  on public.listening_imports for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own imports"
  on public.listening_imports for delete to authenticated
  using ((select auth.uid()) = user_id);

-- plays: owner only (visibility for others follows in #30 / #32)
create policy "Users can view their own plays"
  on public.plays for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own plays"
  on public.plays for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own plays"
  on public.plays for delete to authenticated
  using ((select auth.uid()) = user_id);
