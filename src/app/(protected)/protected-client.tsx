"use client";

// ============================================
// Protected Client Wrapper
// ============================================
// Wraps all protected pages with the AuthProvider and sidebar.
// Users must be logged in to see these pages (enforced by middleware).

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { AppSidebar } from "@/components/app-sidebar";

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export function ProtectedClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </AuthProvider>
  );
}
