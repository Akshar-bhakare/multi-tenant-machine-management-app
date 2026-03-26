// ============================================
// Root Page — Redirects to /dashboard
// ============================================
// If user is logged in, middleware sends them to /dashboard.
// If not logged in, middleware sends them to /login.

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
