// ============================================
// Supabase Browser Client
// ============================================
// Use this in "use client" components to talk to Supabase.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client during build to avoid crashing
    return createBrowserClient(
      "https://placeholder-url.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient(url, key);
}
