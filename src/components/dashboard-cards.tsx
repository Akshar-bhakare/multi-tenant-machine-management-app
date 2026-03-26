"use client";

// ============================================
// Dashboard Cards
// ============================================
// Stats cards for the dashboard page.
// Shows different stats for super_admin vs client_admin.

import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Users, Activity, AlertTriangle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="border-border/50 bg-card/50 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-md bg-secondary/50 text-primary">
            {icon}
          </div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {title}
          </p>
        </div>
        <div>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary/50" />
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardCardsProps {
  totalMachines: number;
  activeMachines: number;
  offlineMachines: number;
  errorMachines: number;
  totalClients?: number; // only for super_admin
}

export function DashboardCards({
  totalMachines,
  activeMachines,
  offlineMachines,
  errorMachines,
  totalClients,
}: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {totalClients !== undefined && (
        <StatsCard
          title="Total Clients"
          value={totalClients}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Registered organizations"
        />
      )}
      <StatsCard
        title="Total Machines"
        value={totalMachines}
        icon={<Monitor className="h-4 w-4 text-muted-foreground" />}
        description="All registered machines"
      />
      <StatsCard
        title="Active"
        value={activeMachines}
        icon={<Activity className="h-4 w-4 text-green-500" />}
        description="Currently active"
      />
      <StatsCard
        title="Inactive"
        value={offlineMachines}
        icon={<Monitor className="h-4 w-4 text-gray-400" />}
        description="Currently inactive"
      />
      {totalClients === undefined && (
        <StatsCard
          title="Errors"
          value={errorMachines}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          description="Machines with errors"
        />
      )}
    </div>
  );
}
