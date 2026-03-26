// ============================================
// Database types — matches the Supabase schema
// ============================================

export type UserRole = "super_admin" | "client_admin";

export type MachineMode = "Prepaid" | "Postpaid";

export type MachineStatus = "Active" | "Inactive" | "Error";

// Matches public.clients table
export interface Client {
  id: string;
  name: string;
  email: string;
  client_api_key: string | null;
  created_at: string;
}

// Matches public.users table
export interface UserProfile {
  id: string;
  email: string;
  client_id: string | null;
  role: UserRole;
  verified: boolean;
}

// Matches public.machines table
export interface Machine {
  id: string;
  machine_name: string;
  machine_api_key: string | null;
  client_id: string;
  mode: MachineMode;
  status: MachineStatus;
  created_at: string;
  last_active: string | null;
}
