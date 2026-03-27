"use client";

import { useAuth } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

function StatsCard({ title, value, icon, color = "blue" }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/50 hover:border-primary/20 group">
      {/* Subtle Glow Background */}
      <div className={cn(
        "absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[80px] transition-opacity opacity-20 group-hover:opacity-40",
        color === "blue" ? "bg-blue-500" : color === "green" ? "bg-emerald-500" : "bg-indigo-500"
      )} />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
              {title}
            </p>
            <div className="text-[36px] font-bold tracking-tight leading-none text-foreground">
              {value}
            </div>
          </div>
          
          <div className={cn(
            "p-2.5 rounded-xl border border-border/50 bg-secondary/30 transition-all duration-500 group-hover:scale-110 group-hover:border-primary/30",
            color === "blue" ? "text-blue-400 group-hover:text-blue-300" : color === "green" ? "text-emerald-400 group-hover:text-emerald-300" : "text-indigo-400 group-hover:text-indigo-300"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Machine } from "@/types/database";
import { cn } from "@/lib/utils";

interface DashboardCardsProps {
  machines: Machine[];
  clientsCount?: number;
}

export function DashboardCards({ machines, clientsCount }: DashboardCardsProps) {
  const { profile } = useAuth();

  const totalMachines = machines.length;
  const activeMachines = machines.filter((m) => m.status === "Active").length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profile?.role === "super_admin" && (
        <StatsCard
          title="Total Clients"
          value={clientsCount || 0}
          icon={<Users className="w-5 h-5" />}
          color="indigo"
        />
      )}
      <StatsCard
        title="Total Machines"
        value={totalMachines}
        icon={<Monitor className="w-5 h-5" />}
        color="blue"
      />
      <StatsCard
        title="Active Machines"
        value={activeMachines}
        icon={<Activity className="w-5 h-5" />}
        color="green"
      />
    </div>
  );
}
