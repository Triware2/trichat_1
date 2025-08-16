-- Data Sources Schema for Admin Dashboard
-- Creates tables for external data sources and their sync logs

-- Enable required extensions (no-op if already enabled)
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('crm','database','api','file','custom')),
  status text not null default 'disconnected' check (status in ('connected','syncing','error','disconnected')),
  last_sync timestamptz,
  records_count integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_source_sync_logs (
  id uuid primary key default gen_random_uuid(),
  data_source_id uuid not null references public.data_sources(id) on delete cascade,
  timestamp timestamptz not null default now(),
  status text not null check (status in ('success','partial','error')),
  records_processed integer not null default 0,
  records_success integer not null default 0,
  records_error integer not null default 0,
  error_message text,
  created_by uuid not null references auth.users(id) on delete cascade
);

-- Row Level Security
alter table public.data_sources enable row level security;
alter table public.data_source_sync_logs enable row level security;

-- Policies: each user can only access their own rows
drop policy if exists data_sources_select on public.data_sources;
create policy data_sources_select on public.data_sources for select using (created_by = auth.uid());

drop policy if exists data_sources_insert on public.data_sources;
create policy data_sources_insert on public.data_sources for insert with check (auth.uid() is not null);

drop policy if exists data_sources_update on public.data_sources;
create policy data_sources_update on public.data_sources for update using (created_by = auth.uid());

drop policy if exists data_sources_delete on public.data_sources;
create policy data_sources_delete on public.data_sources for delete using (created_by = auth.uid());

drop policy if exists data_source_sync_logs_select on public.data_source_sync_logs;
create policy data_source_sync_logs_select on public.data_source_sync_logs for select using (created_by = auth.uid());

drop policy if exists data_source_sync_logs_insert on public.data_source_sync_logs;
create policy data_source_sync_logs_insert on public.data_source_sync_logs for insert with check (auth.uid() is not null);

-- Helpful indexes
create index if not exists idx_data_sources_created_by on public.data_sources(created_by);
create index if not exists idx_data_sources_status on public.data_sources(status);
create index if not exists idx_data_source_sync_logs_ds on public.data_source_sync_logs(data_source_id);

-- Auto-populate created_by from auth.uid()
drop function if exists public.set_created_by_data_sources cascade;
create or replace function public.set_created_by_data_sources()
returns trigger as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_set_created_by_data_sources on public.data_sources;
create trigger trg_set_created_by_data_sources
before insert or update on public.data_sources
for each row execute function public.set_created_by_data_sources();

drop function if exists public.set_created_by_sync_logs cascade;
create or replace function public.set_created_by_sync_logs()
returns trigger as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_set_created_by_sync_logs on public.data_source_sync_logs;
create trigger trg_set_created_by_sync_logs
before insert on public.data_source_sync_logs
for each row execute function public.set_created_by_sync_logs();

