"use client";

// ============================================
// Email Verification Page
// ============================================
// Handles the email verification callback from Supabase.
// When user clicks the verification link in their email,
// Supabase redirects them here with tokens in the URL.

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function VerifyContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleVerification = async () => {
      // Check if there's an error in the URL params
      const errorParam = searchParams.get("error");
      if (errorParam) {
        setStatus("error");
        setMessage(searchParams.get("error_description") || "Verification failed.");
        return;
      }

      // Try to get the current session (Supabase handles the token exchange)
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        setStatus("error");
        setMessage("Could not verify your email. The link may have expired.");
        return;
      }

      // Update verified status in public.users
      await supabase
        .from("users")
        .update({ verified: true })
        .eq("id", user.id);

      setStatus("success");
      setMessage("Your email has been verified successfully!");
    };

    handleVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{message}</p>
          {status === "success" && (
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          )}
          {status === "error" && (
            <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-muted/30">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
