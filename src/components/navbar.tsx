"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
          M
        </div>
        <h2 className="text-[13px] font-bold tracking-widest uppercase text-foreground">Multi Tenant App</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border/50 text-foreground font-bold text-[13px] shrink-0">
            {profile?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[13px] font-bold text-foreground leading-[1]">{profile?.email}</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-500 leading-[1]">
              {profile?.role?.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-border/50" />

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="h-8 px-3 gap-2 text-[11px] font-bold uppercase tracking-wider text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
