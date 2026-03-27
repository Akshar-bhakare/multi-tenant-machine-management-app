"use client";

// ============================================
// Machine Detail Page
// ============================================
// Shows full details of a single machine.
// Actions based on role:
// - client_admin: reset machine key, disable
// - super_admin: reset key, disable, change mode

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { generateMachineApiKey } from "@/lib/api-keys";
import type { Machine, Client } from "@/types/database";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCw, Power } from "lucide-react";

export default function MachineDetailPage() {
  const { profile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const machineId = params.id as string;

  const [machine, setMachine] = useState<Machine | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch machine and its client details
  const fetchMachine = async () => {
    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .eq("id", machineId)
      .single();

    if (error || !data) {
      toast.error("Machine not found");
      router.push("/machines");
      return;
    }

    setMachine(data);

    // Fetch the client for this machine
    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("id", data.client_id)
      .single();

    setClient(clientData);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, machineId]);

  // Reset the machine API key
  const handleResetKey = async () => {
    const newKey = generateMachineApiKey();

    const { error } = await supabase
      .from("machines")
      .update({ machine_api_key: newKey })
      .eq("id", machineId);

    if (error) {
      toast.error("Failed to reset API key");
      return;
    }

    toast.success("Machine API key reset");
    fetchMachine();
  };

  // Enable context
  const handleEnable = async () => {
    const { error } = await supabase
      .from("machines")
      .update({ 
        status: "Active",
        last_active: new Date().toISOString()
      })
      .eq("id", machineId);

    if (error) {
      toast.error("Failed to enable machine");
      return;
    }

    toast.success("Machine set to Active");
    fetchMachine();
  };

  // Disable the machine
  const handleDisable = async () => {
    const { error } = await supabase
      .from("machines")
      .update({ status: "Inactive" })
      .eq("id", machineId);

    if (error) {
      toast.error("Failed to disable machine");
      return;
    }

    toast.success("Machine disabled");
    fetchMachine();
  };

  // Change machine mode (super_admin only)
  const handleModeChange = async (newMode: string) => {
    const { error } = await supabase
      .from("machines")
      .update({ mode: newMode })
      .eq("id", machineId);

    if (error) {
      toast.error(`Failed to change mode: ${error.message}`);
      return;
    }

    toast.success(`Mode changed to ${newMode}`);
    fetchMachine();
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-3 w-32 bg-muted rounded mb-4"></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-64 bg-muted rounded"></div>
              <div className="h-3 w-40 bg-muted rounded mt-3"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-28 bg-muted rounded"></div>
              <div className="h-8 w-28 bg-muted rounded"></div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-56 bg-muted/50 rounded-xl border border-border/50"></div>
          <div className="h-56 bg-muted/50 rounded-xl border border-border/50"></div>
        </div>
      </div>
    );
  }


  if (!machine) return null;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs + Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-4">
          <Link href="/machines" className="hover:text-foreground transition-colors">Machines</Link>
          <span>/</span>
          <span className="text-foreground">{machine.machine_name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {machine.machine_name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  machine.status === "Active" ? "bg-emerald-500" : machine.status === "Inactive" ? "bg-zinc-500" : "bg-red-500"
                )} />
                <span className="text-xs font-medium">{machine.status}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">ID: <code className="font-mono">{machine.id.slice(0, 8)}</code></span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs border-border/50" onClick={handleResetKey}>
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Reset API Key
            </Button>
            {machine.status === "Active" ? (
              <Button variant="outline" size="sm" className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/50" onClick={handleDisable}>
                <Power className="h-3.5 w-3.5 mr-2" />
                Set Inactive
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 text-xs text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10 border-border/50" onClick={handleEnable}>
                <Power className="h-3.5 w-3.5 mr-2" />
                Set Active
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Info */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-sm h-full flex flex-col">
          <CardHeader className="pb-4 pt-6 px-6 shrink-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">General Information</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 flex-1">
            <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
              <span className="text-[13px] text-muted-foreground font-medium">Mode</span>
              {profile?.role === "super_admin" ? (
                <Select
                  value={machine.mode}
                  onValueChange={(val) => {
                    if (val) handleModeChange(val);
                  }}
                >
                  <SelectTrigger className="h-8 w-28 text-xs font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                    <SelectItem value="Postpaid">Postpaid</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={cn(
                  "text-[11px] font-medium border-transparent",
                  machine.mode === "Prepaid" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                )}>{machine.mode}</Badge>
              )}
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
              <span className="text-[13px] text-muted-foreground font-medium">Created</span>
              <span className="text-[13px] text-foreground font-medium">{formatDate(machine.created_at)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
              <span className="text-[13px] text-muted-foreground font-medium">Last Active</span>
              <span className="text-[13px] text-foreground font-medium">
                {formatDate(machine.last_active)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-sm h-full flex flex-col">
          <CardHeader className="pb-4 pt-6 px-6 shrink-0">
            <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">API Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-6 flex-1">

            <div>
              <p className="text-[11px] font-bold text-foreground mb-2">
                Machine API Key
              </p>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50">
                <code className="flex-1 text-[13px] font-mono text-muted-foreground truncate">
                  {machine.machine_api_key || "Not generated"}
                </code>
                {machine.machine_api_key && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      copyToClipboard(machine.machine_api_key!, "Machine API Key")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {client && (
              <div>
                <p className="text-[11px] font-bold text-foreground mb-2">
                  Organization API Key
                </p>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50">
                  <code className="flex-1 text-[13px] font-mono text-muted-foreground truncate">
                    {client.client_api_key || "Not generated"}
                  </code>
                  {client.client_api_key && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        copyToClipboard(client.client_api_key!, "Organization API Key")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
