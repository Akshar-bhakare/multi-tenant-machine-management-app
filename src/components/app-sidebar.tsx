"use client";

// ============================================
// App Sidebar
// ============================================
// Main navigation sidebar for protected pages.
// Shows different links based on user role.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Monitor,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/machines", label: "Machines", icon: Monitor },
  { href: "/admin", label: "Admin", icon: Shield, superAdminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) => {
    if (item.superAdminOnly && profile?.role !== "super_admin") return false;
    return true;
  });

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo / App Name */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <Monitor className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-sm font-bold tracking-tight">Machine Manager</h1>
      </div>

      <div className="px-3 py-2">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Platform
        </div>
        {/* Navigation Links */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all group",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        {/* User Info + Logout */}
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium truncate">{profile?.email}</p>
          <p className="text-[10px] text-muted-foreground capitalize">
            {profile?.role?.replace("_", " ")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg border bg-background p-2 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
        {sidebarContent}
      </aside>
    </>
  );
}
