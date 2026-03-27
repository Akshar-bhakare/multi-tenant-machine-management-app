"use client";

// ============================================
// Dashboard Page
// ============================================
// Shows stats and recent data.
// client_admin sees their own machine stats.
// super_admin sees all clients + all machines stats.

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { DashboardCards } from "@/components/dashboard-cards";
import { MachinesTable } from "@/components/machines-table";
import type { Machine, Client } from "@/types/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { profile } = useAuth();
  const supabase = createClient();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      // Fetch machines (RLS handles filtering by client_id)
      const { data: machineData } = await supabase
        .from("machines")
        .select("*")
        .order("created_at", { ascending: false });

      setMachines(machineData || []);

      // If super_admin, also fetch clients
      if (profile.role === "super_admin") {
        const { data: clientData } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        setClients(clientData || []);
      }

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted/50 rounded-xl border border-border/50"></div>
          ))}
        </div>
        <div className="h-64 bg-muted/30 rounded-xl border border-border/50"></div>
        <div className="h-64 bg-muted/30 rounded-xl border border-border/50"></div>
      </div>
    );
  }

  const recentMachines = machines.slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <DashboardCards
        machines={machines}
        clientsCount={
          profile?.role === "super_admin" ? clients.length : undefined
        }
      />

      {/* Recent Clients (super_admin only) */}
      {profile?.role === "super_admin" && clients.length > 0 && (
        <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500 blur-[100px] opacity-10" />
          <CardHeader className="relative z-10 border-b border-border/40">
            <CardTitle className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            <div className="flex flex-col">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground border border-border/50 shrink-0">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-foreground leading-tight">
                        {client.name}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Placeholder for status badge if needed later */}
                    <p className="text-[12px] text-muted-foreground">
                      {formatDate(client.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Machines */}
      {recentMachines.length > 0 && (
        <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500 blur-[100px] opacity-10" />
          <CardHeader className="relative z-10 border-b border-border/40">
            <CardTitle className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Recent Machines</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-0">
            <MachinesTable machines={recentMachines} showActions={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
