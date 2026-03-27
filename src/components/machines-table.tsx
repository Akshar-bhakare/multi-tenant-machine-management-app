"use client";

// ============================================
// Machines Table
// ============================================
// Reusable table component to display machines.
// Used on the machines page and admin page.

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Machine } from "@/types/database";
import { cn, formatDate } from "@/lib/utils";

interface MachinesTableProps {
  machines: Machine[];
  showActions?: boolean;
  onResetKey?: (machineId: string) => void;
  onStatusChange?: (machineId: string, newStatus: string) => void;
}

// Badge color based on machine status
function getStatusBadge(status: string) {
  const dotColor =
    status === "Active"
      ? "bg-emerald-500"
      : status === "Inactive" || status === "Offline"
      ? "bg-zinc-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]", dotColor)} />
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
}

// Badge for machine mode
function getModeBadge(mode: string) {
  const isPrepaid = mode.toLowerCase().includes("prepaid");
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold px-2.5 py-0.5 rounded-full border-0 transition-colors",
        isPrepaid
          ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
      )}
    >
      {mode}
    </Badge>
  );
}

export function MachinesTable({
  machines,
  showActions = true,
  onResetKey,
  onStatusChange,
}: MachinesTableProps) {
  const router = useRouter();

  if (machines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No machines found.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300">
      {/* Subtle Glow */}
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500 blur-[100px] opacity-10 pointer-events-none" />
      
      <Table className="relative z-10">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Machine Name</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Mode</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Status</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6">Last Active</TableHead>
            {showActions && <TableHead className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 h-11 px-6 text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((machine) => (
            <TableRow
              key={machine.id}
              className="border-border/40 hover:bg-muted/40 cursor-pointer group/row transition-colors"
              onClick={() => router.push(`/machines/${machine.id}`)}
            >
              <TableCell className="py-4 font-medium text-sm tracking-tight group-hover/row:text-primary transition-colors">
                {machine.machine_name}
              </TableCell>
              <TableCell className="py-4">{getModeBadge(machine.mode)}</TableCell>
              <TableCell className="py-4">{getStatusBadge(machine.status)}</TableCell>
              <TableCell className="py-4 text-[11px] text-muted-foreground font-mono">
                {formatDate(machine.last_active)}
              </TableCell>
              {showActions && (
                <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {onResetKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px] w-20 px-0 bg-transparent border-border/50 hover:bg-secondary/50 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          onResetKey(machine.id);
                        }}
                      >
                        Reset Key
                      </Button>
                    )}
                    {onStatusChange && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 text-[10px] w-24 px-0 transition-colors font-medium border border-transparent",
                          machine.status === "Active"
                            ? "text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20"
                            : "text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(
                            machine.id,
                            machine.status === "Active" ? "Inactive" : "Active"
                          );
                        }}
                      >
                        {machine.status === "Active" ? "Set Inactive" : "Set Active"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
