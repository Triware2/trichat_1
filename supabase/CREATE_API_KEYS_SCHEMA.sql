-- API Keys schema for Admin Dashboard

create extension if not exists pgcrypto;

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key text not null unique,
  status text not null default 'active' check (status in ('active','revoked')),
  permissions text[] not null default '{chat.read,chat.write}',
  domain text not null default '*',
  last_used timestamptz,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.api_keys enable row level security;

drop policy if exists api_keys_select on public.api_keys;
create policy api_keys_select on public.api_keys for select using (created_by = auth.uid());

drop policy if exists api_keys_insert on public.api_keys;
create policy api_keys_insert on public.api_keys for insert with check (created_by = auth.uid());

drop policy if exists api_keys_update on public.api_keys;
create policy api_keys_update on public.api_keys for update using (created_by = auth.uid());

drop policy if exists api_keys_delete on public.api_keys;
create policy api_keys_delete on public.api_keys for delete using (created_by = auth.uid());

create index if not exists idx_api_keys_created_by on public.api_keys(created_by);

-- Auto-populate created_by from auth.uid()
drop function if exists public.set_created_by_api_keys cascade;
create or replace function public.set_created_by_api_keys()
returns trigger as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_set_created_by_api_keys on public.api_keys;
create trigger trg_set_created_by_api_keys
before insert on public.api_keys
for each row execute function public.set_created_by_api_keys();

-- Loosen insert policy to allow any authenticated user to insert; trigger sets created_by
drop policy if exists api_keys_insert on public.api_keys;
create policy api_keys_insert on public.api_keys for insert with check (auth.uid() is not null);

