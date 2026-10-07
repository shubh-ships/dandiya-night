-- Run once in Supabase Dashboard → SQL Editor.
-- Visitors (anon role) can only INSERT a name + phone. They cannot read, update or delete rows.
-- View registrations in Table Editor (dashboard bypasses RLS).

create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  phone text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

revoke all on public.registrations from anon, authenticated;
grant insert (name, phone) on public.registrations to anon;

drop policy if exists "Public can register" on public.registrations;
create policy "Public can register"
  on public.registrations
  for insert
  to anon
  with check (true);
