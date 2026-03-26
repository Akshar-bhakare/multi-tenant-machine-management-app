"use client";

// ============================================
// Machines Table
// ============================================
// Reusable table component to display machines.
// Used on the machines page and admin page.

import Link from "next/link";
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
  onDisable?: (machineId: string) => void;
}

// Badge color based on machine status
function getStatusBadge(status: string) {
  const dotColor =
    status === "Active"
      ? "bg-emerald-500"
      : status === "Inactive"
      ? "bg-zinc-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
}

// Badge for machine mode
function getModeBadge(mode: string) {
  return (
    <Badge variant="outline" className="font-normal">
      {mode}
    </Badge>
  );
}

export function MachinesTable({
  machines,
  showActions = true,
  onResetKey,
  onDisable,
}: MachinesTableProps) {
  if (machines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No machines found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/30 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-10">Machine Name</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-10">Mode</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-10">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-10">Last Active</TableHead>
            {showActions && <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground h-10 text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id} className="border-border/40 hover:bg-muted/30">
              <TableCell className="py-4 font-medium text-sm tracking-tight">{machine.machine_name}</TableCell>
              <TableCell className="py-4">{getModeBadge(machine.mode)}</TableCell>
              <TableCell className="py-4">{getStatusBadge(machine.status)}</TableCell>
              <TableCell className="py-4 text-[11px] text-muted-foreground font-mono">
                {formatDate(machine.last_active)}
              </TableCell>
              {showActions && (
                <TableCell className="py-4 text-right space-x-2">
                  <Link href={`/machines/${machine.id}`}>
                    <Button variant="secondary" size="sm" className="h-7 text-[11px] px-3">
                      View
                    </Button>
                  </Link>
                  {onResetKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] px-3 bg-transparent border-border/50"
                      onClick={() => onResetKey(machine.id)}
                    >
                      Reset Key
                    </Button>
                  )}
                  {onDisable && machine.status !== "Inactive" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDisable(machine.id)}
                    >
                      Set Inactive
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
