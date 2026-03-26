// ============================================
// Supabase Auth Callback Route
// ============================================
// Handles the redirect after email verification.
// Supabase sends users here with a code in the URL.
// This route exchanges the code for a session.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to verify page with error
  return NextResponse.redirect(`${origin}/verify?error=auth_error&error_description=Could+not+verify+email`);
}
