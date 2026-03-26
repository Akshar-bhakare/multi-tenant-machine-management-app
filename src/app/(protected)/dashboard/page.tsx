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
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  const activeMachines = machines.filter((m) => m.status === "Active").length;
  const offlineMachines = machines.filter((m) => m.status === "Inactive").length;
  const errorMachines = machines.filter((m) => m.status === "Error").length;
  const recentMachines = machines.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Overview</div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {profile?.role === "super_admin"
            ? "Monitoring all clients and machine systems"
            : "Managing your organization's machine performance"}
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardCards
        totalMachines={machines.length}
        activeMachines={activeMachines}
        offlineMachines={offlineMachines}
        errorMachines={errorMachines}
        totalClients={
          profile?.role === "super_admin" ? clients.length : undefined
        }
      />

      {/* Recent Clients (super_admin only) */}
      {profile?.role === "super_admin" && clients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(client.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Machines */}
      {recentMachines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <MachinesTable machines={recentMachines} showActions={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
