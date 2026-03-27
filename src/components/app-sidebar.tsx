"use client";

// ============================================
// App Sidebar
// ============================================
// Main navigation sidebar for protected pages.
// Shows different links based on user role.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
  LayoutDashboard,
  Monitor,
  Shield,
  Settings,
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
  const { profile } = useAuth();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const filteredNavItems = navItems.filter((item) => {
    if (item.superAdminOnly && profile?.role !== "super_admin") return false;
    return true;
  });

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] bg-sidebar border-r border-border/50 transition-all duration-300 ease-in-out z-40 overflow-hidden",
        isHovered ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col flex-1 py-4">
        {/* Navigation Links */}
        <nav className="space-y-2 px-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md h-10 transition-all group overflow-hidden whitespace-nowrap outline-hidden",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isHovered ? "px-3 gap-4" : "justify-center gap-0"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0 invisible w-0"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
