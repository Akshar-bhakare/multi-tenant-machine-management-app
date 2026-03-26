// ============================================
// Auth Helper
// ============================================
// Fetches the current logged-in user's profile (role, client_id, etc.)
// from the public.users table.

import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/database";

// Get the current user's profile from public.users
// Returns null if not logged in or profile not found
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient();

  // 1. Get the auth user (from Supabase Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 2. Get the profile from public.users
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;

  return profile as UserProfile;
}
