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
        "hidden lg:flex flex-col fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-card border-r border-border/40 transition-all duration-300 ease-in-out z-40 overflow-hidden",
        isHovered ? "w-64" : "w-[68px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col flex-1 py-6">
        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl h-11 transition-all group overflow-hidden whitespace-nowrap outline-none relative",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent",
                  isHovered ? "px-3 gap-4" : "justify-center px-0"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-all",
                  isActive ? "text-primary scale-110" : "group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-[13px] font-bold uppercase tracking-widest transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0 invisible w-0"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Brand / Logo at bottom or footer area if needed, but keeping it simple for now */}
      </div>
    </aside>
  );
}
