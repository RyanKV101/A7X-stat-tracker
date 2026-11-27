-- Explicit table grants for the Data API roles.
--
-- The hosted project doesn't expose new tables in `public` to anon / authenticated / service_role
-- automatically, so without these every API request got "permission denied". RLS still decides
-- which rows a role sees; these grants only mirror the operations the policies in
-- 20261118160000_initial_schema.sql allow. Every new table needs its own grants from now on.

grant usage on schema public to anon, authenticated, service_role;

-- service_role (server-side only: seeds, admin tasks) bypasses RLS and may do everything.
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

-- Public read
grant select on public.profiles, public.albums, public.songs, public.quiz_questions, public.follows
  to anon, authenticated;

-- Owner writes (rows are restricted by RLS)
grant insert, update on public.profiles to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant insert, delete on public.follows to authenticated;
grant select, insert, update, delete on public.lastfm_connections to authenticated;
grant select, insert, update, delete on public.listening_imports to authenticated;
grant select, insert, delete on public.plays to authenticated;
