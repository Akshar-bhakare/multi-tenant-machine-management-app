"use client";

// ============================================
// Role Guard
// ============================================
// Wraps content that should only be visible to certain roles.
// Shows loading state while checking, and "Unauthorized" for wrong roles.

import { useAuth } from "@/components/auth-provider";
import type { UserRole } from "@/types/database";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Unauthorized</h2>
            <p className="text-muted-foreground mt-2">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
