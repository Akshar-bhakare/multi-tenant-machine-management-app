"use client";

// ============================================
// Register Page
// ============================================
// Creates: auth user → client row → user profile row.

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthForm, type AuthFormData } from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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
      <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We&apos;ve sent a verification link to your email address. Please
              click the link to verify your account.
            </p>
            <p className="text-sm text-muted-foreground">
              After verification, you can{" "}
              <a href="/login" className="font-medium underline text-foreground">
                sign in
              </a>{" "}
              to your account.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <AuthForm mode="register" onSubmit={handleRegister} error={error} />
    </main>
  );
}