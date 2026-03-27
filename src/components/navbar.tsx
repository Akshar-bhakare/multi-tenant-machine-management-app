"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/50 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center">
        <h2 className="text-sm font-bold tracking-tight uppercase">Multi Tenant App</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium leading-none">{profile?.email}</span>
          <span className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider">
            {profile?.role?.replace("_", " ")}
          </span>
        </div>

        <div className="h-4 w-px bg-border/50" />

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="h-8 gap-2 text-xs font-medium text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
