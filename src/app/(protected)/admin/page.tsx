"use client";

// ============================================
// Admin Page (Super Admin Only)
// ============================================
// Lists all clients and their machines.
// Allows changing machine mode (Prepaid/Postpaid).

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { RoleGuard } from "@/components/role-guard";
import { createClient } from "@/lib/supabase/client";
import type { Client, Machine } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { generateClientApiKey } from "@/lib/api-keys";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <AdminContent />
    </RoleGuard>
  );
}

const ITEMS_PER_PAGE = 10;

function AdminContent() {
  const { profile } = useAuth();
  const supabase = createClient();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientMachines, setClientMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all clients
  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load clients");
      return;
    }

    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Pagination logic
  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClients = clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page if search/filter or data change reduces page count
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [clients.length, totalPages, currentPage]);

  // Rotate client API key
  const handleRotateApiKey = async (clientId: string) => {
    const newKey = generateClientApiKey();
    const { error } = await supabase
      .from("clients")
      .update({ client_api_key: newKey })
      .eq("id", clientId);

    if (error) {
      toast.error("Failed to rotate API key");
      return;
    }

    toast.success("Client API key rotated successfully");
    fetchClients();
  };

  // View machines for a specific client
  const handleViewMachines = async (client: Client) => {
    setSelectedClient(client);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load machines");
      return;
    }

    setClientMachines(data || []);
    setDialogOpen(true);
  };

  // Change machine mode
  const handleModeChange = async (machineId: string, newMode: string) => {
    const { error } = await supabase
      .from("machines")
      .update({ mode: newMode })
      .eq("id", machineId);

    if (error) {
      toast.error(`Failed to change mode: ${error.message}`);
      return;
    }

    toast.success(`Mode changed to ${newMode}`);

    // Refresh the machines for the current client
    if (selectedClient) {
      handleViewMachines(selectedClient);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading admin panel...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Manage all clients and their machines
        </p>
      </div>

      {/* Clients Table */}
      <Card className="relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500 blur-[100px] opacity-10 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-border/40">
          <CardTitle className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">All Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          {clients.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No clients registered yet.
            </p>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Organization</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Email</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">API Key</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Created</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow key={client.id} className="border-border/40 hover:bg-muted/30 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground border border-border/50 shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">
                        {client.email}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {client.client_api_key ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {client.client_api_key.slice(0, 12)}...
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Not set
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">
                        {formatDate(client.created_at)}
                      </TableCell>
                      <TableCell className="text-right space-x-2 px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          title="Rotate API Key"
                          onClick={() => handleRotateApiKey(client.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => handleViewMachines(client)}
                        >
                          View Machines
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="border-t border-border/20 px-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Machines — {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>

          {clientMachines.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No machines for this client.
            </p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientMachines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">
                        {machine.machine_name}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={machine.mode}
                          onValueChange={(val) => {
                            if (val) handleModeChange(machine.id, val);
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Prepaid">Prepaid</SelectItem>
                            <SelectItem value="Postpaid">Postpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            machine.status === "Active"
                              ? "default"
                              : machine.status === "Error"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {machine.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(machine.last_active)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
