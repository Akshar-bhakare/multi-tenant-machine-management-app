"use client";

// ============================================
// Machine Form (Add New Machine)
// ============================================
// Dialog form to add a new machine.

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface MachineFormProps {
  onSubmit: (machineName: string) => Promise<void>;
}

export function MachineForm({ onSubmit }: MachineFormProps) {
  const [open, setOpen] = useState(false);
  const [machineName, setMachineName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineName.trim()) return;

    setLoading(true);
    try {
      await onSubmit(machineName.trim());
      setMachineName("");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Machine
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Machine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="machine-name">Machine Name</Label>
            <Input
              id="machine-name"
              placeholder="Enter machine name"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Machine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
