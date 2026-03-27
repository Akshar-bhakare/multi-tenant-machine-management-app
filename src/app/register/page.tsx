"use client";

// ============================================
// Register Page
// ============================================
// Creates: auth user → client row → user profile row.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthForm, type AuthFormData } from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (data: AuthFormData) => {
    setError("");

    // Step 1: Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    if (!authData.user) {
      setError("Failed to create account. Please try again.");
      return;
    }

    // Step 2: Create the client (organization) row
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: data.organizationName,
        email: data.email,
      })
      .select()
      .single();

    if (clientError) {
      setError(`Failed to create organization: ${clientError.message}`);
      return;
    }

    // Step 3: Create the user profile row
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: data.email,
      client_id: clientData.id,
      role: "client_admin",
      verified: false,
    });

    if (profileError) {
      setError(`Failed to create profile: ${profileError.message}`);
      return;
    }

    // Show success message (email verification needed)
    setSuccess(true);
  };

  // Show success state — tell user to verify email
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0B0F14] px-4 font-inter">
        <div className="relative w-full max-w-md">
          <Card className="relative border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden text-center">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            
            <CardHeader className="space-y-4 pt-10 pb-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-emerald-500/80">
                  Multi Tenant App
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight text-foreground">Verify Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-10">
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                We&apos;ve sent a verification link to your email. Please
                check your inbox to complete the registration.
              </p>
              <div className="pt-6 border-t border-border/20">
                <p className="text-xs text-muted-foreground/60">
                  Once verified, you can{" "}
                  <a href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                    Login here
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0F14] px-4 font-inter relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <AuthForm mode="register" onSubmit={handleRegister} error={error} />
    </main>
  );
}