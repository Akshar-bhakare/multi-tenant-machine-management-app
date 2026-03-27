-- ============================================
-- Seed Data
-- ============================================
-- IMPORTANT: Before running this, you must:
-- 1. Create a super_admin user via Supabase Auth Dashboard:
--    Go to Authentication > Users > Add User
--    Email: admin@example.com, Password: admin123456
--    Copy the UUID that Supabase generates for this user
-- 2. Replace 'YOUR_SUPER_ADMIN_AUTH_UUID' below with that UUID

-- ============================================
-- Step 1: Insert super_admin user profile
-- ============================================
-- Replace the UUID below with the actual auth user UUID from step above
insert into public.users (id, email, role, client_id, verified)
values (
  '716f5396-7a47-4d97-96e4-dd2c5828ec05',  -- ← Replace with actual UUID
  'aksharbhakare@gmail.com',
  'super_admin',
  null,  -- super_admin has no client
  true
);

-- ============================================
-- Step 2: Insert a sample client for testing
-- ============================================
insert into public.clients (id, name, email, client_api_key)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Acme Corporation',
  'contact@acme.com',
  'cl_sample_api_key_12345'
);

-- ============================================
-- Step 3: Insert sample machines for the test client
-- ============================================
insert into public.machines (machine_name, machine_api_key, client_id, mode, status, last_active)
values
  ('Machine Alpha', 'mc_alpha_key_001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Postpaid', 'Active', now()),
  ('Machine Beta', 'mc_beta_key_002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Prepaid', 'Offline', null),
  ('Machine Gamma', 'mc_gamma_key_003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Postpaid', 'Error', now() - interval '2 days');
