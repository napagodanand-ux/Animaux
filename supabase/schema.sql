-- ============================================================
-- ANIMAUX — PASTE THIS IN: Supabase Dashboard → SQL Editor
-- Run this once to set up the entire database.
-- ============================================================

-- 1. Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 2. PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null,
  survey_submitted boolean not null default false,
  created_at       timestamptz not null default now()
);
alter table public.profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can view own profile') then
    create policy "Users can view own profile" on public.profiles
      for select using (auth.uid() = id);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can update own profile') then
    create policy "Users can update own profile" on public.profiles
      for update using (auth.uid() = id);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Service role can insert profiles') then
    create policy "Service role can insert profiles" on public.profiles
      for insert with check (true);
  end if;
end $$;

-- ============================================================
-- 3. SURVEY RESPONSES TABLE
-- ============================================================
create table if not exists public.survey_responses (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  pet_types            text[]  not null default '{}',
  pet_count            integer,
  ownership_duration   text,
  hours_per_day        numeric,
  play_frequency       text,
  talk_frequency       text,
  emotional_connection text,
  mood_improvement     text,
  pet_happiness        text,
  biggest_challenge    text,
  enjoy_most           text,
  experience_rating    integer check (experience_rating between 1 and 5),
  would_recommend      text,
  age_range            text,
  submitted_at         timestamptz not null default now(),
  constraint one_survey_per_user unique (user_id)
);
alter table public.survey_responses enable row level security;

-- Users can only insert their own response
do $$ begin
  if not exists (select 1 from pg_policies where tablename='survey_responses' and policyname='Users can insert own response') then
    create policy "Users can insert own response" on public.survey_responses
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

-- Users can view their own response
do $$ begin
  if not exists (select 1 from pg_policies where tablename='survey_responses' and policyname='Users can view own response') then
    create policy "Users can view own response" on public.survey_responses
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- Admin can view ALL responses (needed for Realtime + direct queries)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='survey_responses' and policyname='Admin can view all responses') then
    create policy "Admin can view all responses" on public.survey_responses
      for select using (
        (select email from public.profiles where id = auth.uid())
          = current_setting('app.admin_email', true)
        or
        (select email from public.profiles where id = auth.uid())
          = 'bloodyshaad@gmail.com'
      );
  end if;
end $$;

-- ============================================================
-- 4. Enable Realtime on survey_responses
-- ============================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'survey_responses'
  ) then
    alter publication supabase_realtime add table public.survey_responses;
  end if;
end $$;

-- ============================================================
-- 5. PUBLIC STATS FUNCTION (anonymous access, landing page)
-- ============================================================
create or replace function public.get_public_stats()
returns json language sql security definer stable as $$
  select json_build_object(
    'total_responses',  (select count(*)::int from public.survey_responses),
    'avg_rating',       (select round(coalesce(avg(experience_rating), 0)::numeric, 1) from public.survey_responses),
    'recommend_pct',    (select coalesce(round(100.0 * count(*) filter (where would_recommend = 'Yes') / nullif(count(*), 0))::int, 0) from public.survey_responses),
    'strong_bond_pct',  (select coalesce(round(100.0 * count(*) filter (where emotional_connection in ('Strong','Very Strong')) / nullif(count(*), 0))::int, 0) from public.survey_responses)
  );
$$;
grant execute on function public.get_public_stats() to anon;
grant execute on function public.get_public_stats() to authenticated;

-- ============================================================
-- 6. AUTO-CREATE PROFILE ON SIGN UP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Done! Tables: profiles, survey_responses
-- Functions: get_public_stats(), handle_new_user()
-- Realtime: survey_responses enabled
-- ============================================================
