-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- IMPORTANT: This script is IDEMPOTENT (safe to run multiple times).

-- ============================================
-- 1) Enable RLS on all tables
-- ============================================
alter table public.clients enable row level security;
alter table public.users enable row level security;
alter table public.machines enable row level security;

-- ============================================
-- 2) Clean up existing policies (to avoid "already exists" errors)
-- ============================================

-- Clients
drop policy if exists "super_admin can read all clients" on public.clients;
drop policy if exists "client_admin can read own client" on public.clients;
drop policy if exists "client_admin can update own client" on public.clients;
drop policy if exists "super_admin can update any client" on public.clients;
drop policy if exists "Anyone can insert clients for registration" on public.clients;
drop policy if exists "authenticated can insert clients" on public.clients;

-- Users
drop policy if exists "super_admin can read all users" on public.users;
drop policy if exists "users can read own row" on public.users;
drop policy if exists "Anyone can insert users for registration" on public.users;
drop policy if exists "users can update own row" on public.users;
drop policy if exists "authenticated can insert users" on public.users;

-- Machines
drop policy if exists "super_admin can read all machines" on public.machines;
drop policy if exists "client_admin can read own machines" on public.machines;
drop policy if exists "client_admin can insert own machines" on public.machines;
drop policy if exists "client_admin can update own machines" on public.machines;
drop policy if exists "super_admin can update any machine" on public.machines;
drop policy if exists "super_admin can insert any machine" on public.machines;
drop policy if exists "client_admin can delete own machines" on public.machines;
drop policy if exists "super_admin can delete any machine" on public.machines;

-- ============================================
-- 3) Helper: Get current user's role
-- ============================================
create or replace function public.get_user_role()
returns text as $$
  select role from public.users where id = auth.uid();
$$ language sql security definer stable;

-- ============================================
-- 4) Helper: Get current user's client_id
-- ============================================
create or replace function public.get_user_client_id()
returns uuid as $$
  select client_id from public.users where id = auth.uid();
$$ language sql security definer stable;

-- ============================================
-- 5) CLIENTS table policies
-- ============================================

-- Super admin can read all clients
create policy "super_admin can read all clients"
  on public.clients for select
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- Client admin can read only their own client
create policy "client_admin can read own client"
  on public.clients for select
  to authenticated
  using (id = public.get_user_client_id());

-- Client admin can update only their own client (e.g., rotate API key)
create policy "client_admin can update own client"
  on public.clients for update
  to authenticated
  using (id = public.get_user_client_id())
  with check (id = public.get_user_client_id());

-- Super admin can update any client
create policy "super_admin can update any client"
  on public.clients for update
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- NEW: Allow insert for registration (more permissive)
create policy "Anyone can insert clients for registration"
  on public.clients for insert
  with check (true);

-- ============================================
-- 6) USERS table policies
-- ============================================

-- Super admin can read all users
create policy "super_admin can read all users"
  on public.users for select
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- Users can read their own row
create policy "users can read own row"
  on public.users for select
  to authenticated
  using (id = auth.uid());

-- NEW: Allow insert for registration (more permissive)
create policy "Anyone can insert users for registration"
  on public.users for insert
  with check (auth.uid() = id);

-- Users can update their own row
create policy "users can update own row"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================
-- 7) MACHINES table policies
-- ============================================

-- Super admin can read all machines
create policy "super_admin can read all machines"
  on public.machines for select
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- Client admin can read only their client's machines
create policy "client_admin can read own machines"
  on public.machines for select
  to authenticated
  using (client_id = public.get_user_client_id());

-- Client admin can insert machines for their client only
create policy "client_admin can insert own machines"
  on public.machines for insert
  to authenticated
  with check (client_id = public.get_user_client_id());

-- Client admin can update their own machines
create policy "client_admin can update own machines"
  on public.machines for update
  to authenticated
  using (client_id = public.get_user_client_id())
  with check (client_id = public.get_user_client_id());

-- Super admin can update any machine (including mode)
create policy "super_admin can update any machine"
  on public.machines for update
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- Super admin can insert machines for any client
create policy "super_admin can insert any machine"
  on public.machines for insert
  to authenticated
  with check (public.get_user_role() = 'super_admin');

-- Client admin can delete their own machines
create policy "client_admin can delete own machines"
  on public.machines for delete
  to authenticated
  using (client_id = public.get_user_client_id());

-- Super admin can delete any machine
create policy "super_admin can delete any machine"
  on public.machines for delete
  to authenticated
  using (public.get_user_role() = 'super_admin');

-- ============================================
-- 8) Trigger: Prevent client_admin from changing machine mode
-- ============================================
drop trigger if exists protect_machine_mode_trigger on public.machines;
create trigger protect_machine_mode_trigger
  before update on public.machines
  for each row
  execute function public.protect_machine_mode();
