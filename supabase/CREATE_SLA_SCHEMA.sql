-- SLA Schema: tiers, targets, escalation rules, breaches, metrics
create extension if not exists pgcrypto;

create table if not exists public.sla_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  customer_segments text[] not null default '{}',
  contract_types text[] not null default '{}',
  support_plans text[] not null default '{}',
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sla_targets (
  id uuid primary key default gen_random_uuid(),
  sla_id uuid not null references public.sla_tiers(id) on delete cascade,
  priority text not null check (priority in ('low','medium','high','critical')),
  first_response_time integer not null,
  resolution_time integer not null,
  follow_up_time integer,
  business_hours_only boolean not null default false
);

create table if not exists public.escalation_rules (
  id uuid primary key default gen_random_uuid(),
  sla_id uuid references public.sla_tiers(id) on delete cascade,
  name text not null,
  trigger_type text not null check (trigger_type in ('time-based','priority-based','breach-imminent')),
  trigger_condition text,
  escalation_level integer not null default 1,
  escalate_to text not null,
  notification_methods text[] not null default '{}',
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.sla_breaches (
  id uuid primary key default gen_random_uuid(),
  case_id text not null,
  sla_id uuid references public.sla_tiers(id) on delete set null,
  breach_type text not null check (breach_type in ('response','resolution','milestone')),
  expected_time timestamptz,
  actual_time timestamptz,
  severity text not null check (severity in ('minor','major','critical')),
  root_cause text,
  is_resolved boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.sla_metrics (
  id uuid primary key default gen_random_uuid(),
  sla_id uuid references public.sla_tiers(id) on delete cascade,
  period text not null check (period in ('day','week','month','quarter')),
  total_cases integer not null default 0,
  breached_cases integer not null default 0,
  compliance_rate numeric not null default 0,
  avg_response_time integer not null default 0,
  avg_resolution_time integer not null default 0,
  escalated_cases integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.sla_tiers enable row level security;
alter table public.sla_targets enable row level security;
alter table public.escalation_rules enable row level security;
alter table public.sla_breaches enable row level security;
alter table public.sla_metrics enable row level security;

create policy sla_tiers_select on public.sla_tiers for select using (created_by = auth.uid());
create policy sla_tiers_modify on public.sla_tiers for all using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy sla_targets_select on public.sla_targets for select using (exists (select 1 from public.sla_tiers t where t.id = sla_id and t.created_by = auth.uid()));
create policy sla_targets_modify on public.sla_targets for all using (exists (select 1 from public.sla_tiers t where t.id = sla_id and t.created_by = auth.uid())) with check (exists (select 1 from public.sla_tiers t where t.id = sla_id and t.created_by = auth.uid()));

create policy escalation_select on public.escalation_rules for select using (created_by = auth.uid());
create policy escalation_modify on public.escalation_rules for all using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy breaches_select on public.sla_breaches for select using (created_by = auth.uid());
create policy breaches_insert on public.sla_breaches for insert with check (created_by = auth.uid());

create policy metrics_select on public.sla_metrics for select using (created_by = auth.uid());
create policy metrics_insert on public.sla_metrics for insert with check (created_by = auth.uid());

-- helpful indexes
create index if not exists idx_sla_targets_sla on public.sla_targets(sla_id);
create index if not exists idx_escalation_rules_sla on public.escalation_rules(sla_id);
create index if not exists idx_breaches_sla on public.sla_breaches(sla_id);
create index if not exists idx_metrics_sla on public.sla_metrics(sla_id);

