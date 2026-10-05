-- SMH Book Archive / initial Supabase PostgreSQL schema
-- This file is a draft to execute manually as the trusted postgres database role.
-- It does not connect to Supabase, create Storage buckets, or register users.
-- Re-running this initial schema preserves rows. This is not a migration system:
-- CREATE TABLE IF NOT EXISTS does not upgrade an incompatible existing table.
-- Apply only to a new project or tables already created by this file. Unrelated
-- existing RLS policies must be reviewed separately (permissive policies combine).
-- RLS reference: https://supabase.com/docs/guides/database/postgres/row-level-security

begin;

create schema if not exists smh_private;
revoke all on schema smh_private from public, anon, authenticated;
grant usage on schema smh_private to authenticated;
-- Keep smh_private out of the API's exposed schemas.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(btrim(display_name)) > 0),
  role text not null check (role in ('owner', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- No signup trigger and no default role: ordinary auth users have no staff
-- privileges. Provision the FIRST owner manually via trusted SQL after creating
-- an auth user. Never bootstrap from user_metadata or let users self-register
-- profiles. Subsequent staff profiles and roles can be managed only by an owner.
-- Example (replace placeholders yourself; intentionally NOT executed):
-- insert into public.profiles (id, display_name, role)
-- values ('<existing-auth-user-uuid>', '<owner-name>', 'owner');

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  archive_number text not null unique check (length(btrim(archive_number)) > 0),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null check (length(btrim(title)) > 0),
  original_title text,
  author text,
  publisher text,
  publication_year integer check (publication_year between 1 and 9999),
  isbn text,
  pages integer check (pages > 0),
  size text,
  language text,
  price numeric(12, 0) check (price >= 0), -- KRW; no fractional won
  sale_status text not null default 'archive'
    check (sale_status in ('for_sale', 'reserved', 'sold', 'archive')),
  condition_grade text,
  condition_cover text,
  condition_spine text,
  condition_pages text,
  condition_writing text,
  description text,
  discovery_place text,
  discovery_date date,
  discovery_note text,
  created_by uuid default auth.uid() references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint books_sale_price_required
    check (sale_status not in ('for_sale', 'reserved') or price is not null)
);
-- description stores editorial plain text (paragraphs separated by newlines).
-- discovery_date uses a calendar date; for month-only records, store the first
-- of that month and render YYYY.MM. An unknown discovery date can remain NULL.

create table if not exists public.book_images (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  storage_path text not null check (
    length(btrim(storage_path)) > 0
    and storage_path !~ '^/'
    and storage_path !~ '(^|/)\.\.(/|$)'
    and position('://' in storage_path) = 0
  ),
  image_type text not null default 'other'
    check (image_type in ('cover', 'back', 'spine', 'inside', 'other')),
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  constraint book_images_book_path_unique unique (book_id, storage_path)
);
-- storage_path is a bucket-relative object key, e.g. <book-uuid>/cover.jpg,
-- for the future book-images bucket, NOT a public or expiring signed URL.
-- The bucket and storage.objects policies must be configured separately later.
-- Deleting a book removes image metadata, not the actual Storage objects.

create index if not exists books_category_id_idx on public.books(category_id);
create index if not exists books_created_by_idx on public.books(created_by);
create index if not exists books_sale_status_idx on public.books(sale_status);
create index if not exists book_images_book_sort_idx on public.book_images(book_id, sort_order);

-- Fixed, read-only role lookup avoids profiles policy recursion. No caller-
-- supplied UUID or role and no writes; always checks the signed-in auth.uid().
create or replace function smh_private.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles as p where p.id = auth.uid();
$$;
-- postgres must own the helper so its SELECT can bypass profiles RLS.
alter function smh_private.current_staff_role() owner to postgres;
revoke all on function smh_private.current_staff_role() from public, anon, authenticated;
grant execute on function smh_private.current_staff_role() to authenticated;

create or replace function smh_private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;
revoke all on function smh_private.touch_updated_at() from public, anon, authenticated;

drop trigger if exists smh_profiles_updated_at on public.profiles;
create trigger smh_profiles_updated_at before update on public.profiles
for each row execute function smh_private.touch_updated_at();
drop trigger if exists smh_books_updated_at on public.books;
create trigger smh_books_updated_at before update on public.books
for each row execute function smh_private.touch_updated_at();

alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_images enable row level security;

-- Explicit grants exclude TRUNCATE and other privileges that RLS cannot filter.
revoke all on table public.categories, public.profiles, public.books, public.book_images
from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.categories, public.books, public.book_images to anon;
grant select, insert, update, delete on table
public.categories, public.profiles, public.books, public.book_images to authenticated;

-- Recreate only this file's named policies, preserving data on repeat runs.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['categories', 'books', 'book_images'] loop
    execute format('drop policy if exists smh_public_read on public.%I', table_name);
    execute format('create policy smh_public_read on public.%I for select to anon, authenticated using (true)', table_name);

    execute format('drop policy if exists smh_staff_insert on public.%I', table_name);
    execute format('create policy smh_staff_insert on public.%I for insert to authenticated with check ((select smh_private.current_staff_role()) in (''owner'', ''editor''))', table_name);

    execute format('drop policy if exists smh_staff_update on public.%I', table_name);
    execute format('create policy smh_staff_update on public.%I for update to authenticated using ((select smh_private.current_staff_role()) in (''owner'', ''editor'')) with check ((select smh_private.current_staff_role()) in (''owner'', ''editor''))', table_name);

    execute format('drop policy if exists smh_owner_delete on public.%I', table_name);
    execute format('create policy smh_owner_delete on public.%I for delete to authenticated using ((select smh_private.current_staff_role()) = ''owner'')', table_name);
  end loop;
end;
$$;

-- Editors can see their own staff profile; owners can see the staff directory.
-- Profile writes (including role changes) are owner-only, even on one's own row.
drop policy if exists smh_profiles_read on public.profiles;
create policy smh_profiles_read on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select smh_private.current_staff_role()) = 'owner');

drop policy if exists smh_profiles_owner_insert on public.profiles;
create policy smh_profiles_owner_insert on public.profiles for insert to authenticated
with check ((select smh_private.current_staff_role()) = 'owner');

drop policy if exists smh_profiles_owner_update on public.profiles;
create policy smh_profiles_owner_update on public.profiles for update to authenticated
using ((select smh_private.current_staff_role()) = 'owner')
with check ((select smh_private.current_staff_role()) = 'owner');

drop policy if exists smh_profiles_owner_delete on public.profiles;
create policy smh_profiles_owner_delete on public.profiles for delete to authenticated
using ((select smh_private.current_staff_role()) = 'owner');
-- Owners should keep at least one owner profile. Trusted SQL is required to
-- recover if the last owner is deleted or demoted. No automatic role promotion.

insert into public.categories (name, slug, description, sort_order) values
  ('사진집', 'photography', '사진과 시각적 기록을 담은 책', 10),
  ('미술', 'art', '작품집과 미술에 관한 기록', 20),
  ('디자인', 'design', '그래픽, 활자, 사물의 디자인', 30),
  ('건축', 'architecture', '건축과 공간에 관한 책', 40),
  ('문학', 'literature', '시, 소설, 에세이와 문학의 기록', 50),
  ('고서', 'antiquarian', '오래된 판본과 서적', 60),
  ('잡지·인쇄물', 'magazines-printed-matter', '잡지, 소책자와 다양한 인쇄물', 70),
  ('기타', 'other', '분류의 경계를 넘는 수집물', 80)
on conflict (slug) do nothing;

commit;
