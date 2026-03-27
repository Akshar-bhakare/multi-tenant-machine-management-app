"use client";

// ============================================
// Protected Client Wrapper
// ============================================
// Wraps all protected pages with the AuthProvider and sidebar.
// Users must be logged in to see these pages (enforced by middleware).

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg font-medium animate-pulse">Loading platform...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 relative">
        <AppSidebar />
        <main className="flex-1 overflow-auto pl-[68px]">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
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
