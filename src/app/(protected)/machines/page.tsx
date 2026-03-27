"use client";

// ============================================
// Machines Page
// ============================================
// Lists all machines for the current user.
// client_admin sees only their own machines.
// super_admin sees all machines.
// Includes add machine button and table with actions.

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { MachinesTable } from "@/components/machines-table";
import { MachineForm } from "@/components/machine-form";
import { generateMachineApiKey } from "@/lib/api-keys";
import type { Machine } from "@/types/database";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function MachinesPage() {
  const { profile } = useAuth();
  const supabase = createClient();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch machines — RLS handles tenant filtering automatically
  const fetchMachines = async () => {
    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load machines");
      return;
    }

    setMachines(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchMachines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Add a new machine
  const handleAddMachine = async (machineName: string) => {
    if (!profile?.client_id) {
      toast.error("No client associated with your account");
      return;
    }

    const { error } = await supabase.from("machines").insert({
      machine_name: machineName,
      client_id: profile.client_id,
      machine_api_key: generateMachineApiKey(),
    });

    if (error) {
      toast.error(`Failed to add machine: ${error.message}`);
      return;
    }

    toast.success("Machine added successfully");
    fetchMachines();
  };

  // Reset a machine's API key
  const handleResetKey = async (machineId: string) => {
    const newKey = generateMachineApiKey();

    const { error } = await supabase
      .from("machines")
      .update({ machine_api_key: newKey })
      .eq("id", machineId);

    if (error) {
      toast.error("Failed to reset API key");
      return;
    }

    toast.success("Machine API key reset successfully");
    fetchMachines();
  };

  // Update machine status
  const handleStatusUpdate = async (machineId: string, newStatus: string) => {
    const { error } = await supabase
      .from("machines")
      .update({ status: newStatus })
      .eq("id", machineId);

    if (error) {
      toast.error(`Failed to update status to ${newStatus}`);
      return;
    }

    toast.success(`Machine status updated to ${newStatus}`);
    fetchMachines();
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading machines...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
        </div>

        {/* Only client_admin can add machines */}
        {profile?.role === "client_admin" && (
          <MachineForm onSubmit={handleAddMachine} />
        )}
      </div>

      {/* Machines Table */}
      <MachinesTable
        machines={machines}
        onResetKey={handleResetKey}
        onStatusChange={handleStatusUpdate}
      />
    </div>
  );
}
