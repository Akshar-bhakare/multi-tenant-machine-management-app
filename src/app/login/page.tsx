"use client";

// ============================================
// Login Page
// ============================================

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthForm, type AuthFormData } from "@/components/auth-form";

export const dynamic = "force-dynamic";

function LoginContent() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const supabase = createClient();

  const handleLogin = async (data: AuthFormData) => {
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(next);
  };

  return <AuthForm mode="login" onSubmit={handleLogin} error={error} />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B0F14] px-4 font-inter relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={<div className="text-muted-foreground animate-pulse">Loading login...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}