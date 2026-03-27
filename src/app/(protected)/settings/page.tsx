"use client";

// ============================================
// Settings Page
// ============================================
// client_admin: view org name, email, generate/rotate client API key
// super_admin: minimal profile section

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { generateClientApiKey } from "@/lib/api-keys";
import type { Client } from "@/types/database";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Key } from "lucide-react";

export default function SettingsPage() {
  const { profile } = useAuth();
  const supabase = createClient();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch client info (for client_admin)
  const fetchClient = async () => {
    if (!profile?.client_id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("id", profile.client_id)
      .single();

    setClient(data);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Generate or rotate the client API key
  const handleRotateKey = async () => {
    if (!client) return;

    const newKey = generateClientApiKey();

    const { error } = await supabase
      .from("clients")
      .update({ client_api_key: newKey })
      .eq("id", client.id);

    if (error) {
      toast.error("Failed to update API key");
      return;
    }

    toast.success("Client API key updated");
    fetchClient();
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and API keys
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{profile?.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="outline" className="capitalize">
              {profile?.role?.replace("_", " ")}
            </Badge>
          </div>

          {client && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Organization</span>
              <span className="font-medium">{client.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Key Card (client_admin only) */}
      {profile?.role === "client_admin" && client && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Client API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Your client API key is used to authenticate API requests for
                your organization.
              </p>

              {client.client_api_key ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted px-3 py-2 rounded truncate">
                    {client.client_api_key}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(client.client_api_key!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No API key generated yet.
                </p>
              )}
            </div>

            <Button variant="outline" onClick={handleRotateKey}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {client.client_api_key ? "Rotate API Key" : "Generate API Key"}
            </Button>

            {client.client_api_key && (
              <p className="text-xs text-muted-foreground">
                ⚠️ Rotating the API key will invalidate the current key. Make
                sure to update any integrations using the old key.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Super Admin Info */}
      {profile?.role === "super_admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are logged in as a Super Admin. You have full access to all
              clients and machines across the platform.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
