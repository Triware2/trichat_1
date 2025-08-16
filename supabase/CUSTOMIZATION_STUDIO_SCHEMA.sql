-- Customization Studio schema (idempotent)

create table if not exists themes (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	primary_color text not null,
	secondary_color text not null,
	font_family text not null,
	logo_url text,
	favicon_url text,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

create table if not exists custom_forms (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	description text,
	status text default 'draft',
	responses integer default 0,
	last_modified timestamptz default now()
);

create table if not exists custom_objects (
	id uuid primary key default uuid_generate_v4(),
	name text not null unique,
	label text not null,
	description text,
	fields_count integer default 0,
	records_count integer default 0,
	permissions jsonb default '[]'::jsonb,
	relationships integer default 0,
	status text default 'active',
	updated_at timestamptz default now()
);

create table if not exists custom_fields (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	label text not null,
	type text not null,
	object text not null,
	required boolean default false,
	options jsonb default '[]'::jsonb,
	created_at timestamptz default now()
);

create table if not exists workflows (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	description text,
	trigger text not null,
	actions jsonb default '[]'::jsonb,
	status text default 'active',
	executions integer default 0,
	updated_at timestamptz default now()
);

create table if not exists integrations (
	id uuid primary key default uuid_generate_v4(),
	name text,
	provider text,
	category text,
	description text,
	status text default 'disconnected',
	updated_at timestamptz default now()
);

create table if not exists custom_scripts (
	id uuid primary key default uuid_generate_v4(),
	name text not null,
	description text,
	language text not null,
	trigger text not null,
	code text not null,
	environment text default 'production',
	status text default 'active',
	executions integer default 0,
	updated_at timestamptz default now()
);

-- Dispositions managed by customization studio
create table if not exists dispositions (
	id uuid primary key default uuid_generate_v4(),
	key text unique not null,
	name text not null,
	category text not null,
	description text,
	is_active boolean default true,
	created_at timestamptz default now()
);

create table if not exists disposition_fields (
	id uuid primary key default uuid_generate_v4(),
	disposition_key text not null references dispositions(key) on delete cascade,
	name text not null,
	type text not null,
	label text not null,
	required boolean default false,
	options jsonb default '[]'::jsonb,
	placeholder text,
	created_at timestamptz default now()
); 

-- Custom records for objects
create table if not exists custom_records (
	id uuid primary key default uuid_generate_v4(),
	object_id uuid not null references custom_objects(id) on delete cascade,
	data jsonb not null default '{}'::jsonb,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

-- Object relationships
create table if not exists object_relationships (
	id uuid primary key default uuid_generate_v4(),
	source_object_id uuid not null references custom_objects(id) on delete cascade,
	target_object_id uuid not null references custom_objects(id) on delete cascade,
	type text not null, -- 'one-to-one', 'one-to-many', 'many-to-many'
	name text not null,
	created_at timestamptz default now(),
	unique(source_object_id, target_object_id, name)
);

-- Indexes for performance
create index if not exists idx_custom_fields_object on custom_fields(object);
create index if not exists idx_custom_records_object_id on custom_records(object_id);
create index if not exists idx_object_relationships_source on object_relationships(source_object_id);
create index if not exists idx_object_relationships_target on object_relationships(target_object_id);
create index if not exists idx_disposition_fields_key on disposition_fields(disposition_key); 

-- Object placements: mount objects into UI destinations (e.g., contact panel)
create table if not exists object_placements (
	id uuid primary key default uuid_generate_v4(),
	object_id uuid not null references custom_objects(id) on delete cascade,
	destination text not null, -- e.g., 'contact_panel'
	section_label text not null,
	link_key text not null, -- 'customer_id' | 'email'
	include_fields jsonb default null, -- optional whitelist of field names
	sort_order integer default 0,
	is_active boolean default true,
	created_at timestamptz default now()
);

create index if not exists idx_object_placements_destination on object_placements(destination);
create index if not exists idx_object_placements_object on object_placements(object_id); 