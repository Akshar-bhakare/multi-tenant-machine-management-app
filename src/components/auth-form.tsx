"use client";

// ============================================
// Auth Form
// ============================================
// Shared form component used by login and register pages.

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: AuthFormData) => Promise<void>;
  error?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  organizationName?: string;
}

export function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    organizationName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="relative w-full max-w-md">
      <Card className="relative border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardHeader className="space-y-4 pt-10 pb-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary/80">
              Multi Tenant App
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {isRegister ? "Register" : "Login"}
            </CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8">
            {error && (
              <div className="rounded-xl bg-rose-500/10 p-3 text-xs font-medium text-rose-400 border border-rose-500/20 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            {isRegister && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11 bg-secondary/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="organizationName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Organization</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Acme Corp"
                    className="h-11 bg-secondary/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({ ...formData, organizationName: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-11 bg-secondary/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 bg-secondary/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 p-8">
            <Button type="submit" className="h-11 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-tight rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98]" disabled={loading}>
              {loading
                ? isRegister
                  ? "Registering..."
                  : "Logging in..."
                : isRegister
                ? "Register"
                : "Login"}
            </Button>

            <p className="text-xs text-center text-muted-foreground/60">
              {isRegister ? (
                <>
                  Already registered?{" "}
                  <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                    Register
                  </Link>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
