
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  client_api_key text,
  created_at timestamptz default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  client_id uuid references public.clients(id) on delete cascade,
  role text not null check (role in ('super_admin', 'client_admin')),
  verified boolean default false
);

create table public.machines (
  id uuid primary key default gen_random_uuid(),
  machine_name text not null,
  machine_api_key text,
  client_id uuid references public.clients(id) on delete cascade,
  mode text not null default 'Postpaid' check (mode in ('Prepaid', 'Postpaid')),
  status text not null default 'Inactive' check (status in ('Active', 'Inactive', 'Error')),
  created_at timestamptz default now(),
  last_active timestamptz
);
