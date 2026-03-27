"use client";

import { useAuth } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="border-border/50 bg-card/40 shadow-none hover:bg-card/60 transition-colors group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-4xl font-bold tracking-tighter mb-1 leading-none group-hover:text-primary transition-colors">
            {value}
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {title}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-primary/80 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

import { Machine } from "@/types/database";

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
          icon={<Users className="h-6 w-6" />}
        />
      )}
      <StatsCard
        title="Total Machines"
        value={totalMachines}
        icon={<Monitor className="h-6 w-6" />}
      />
      <StatsCard
        title="Active Machines"
        value={activeMachines}
        icon={<Activity className="h-6 w-6" />}
      />
    </div>
  );
}
