"use client";

// ============================================
// Auth Provider
// ============================================
// React context that provides user profile (role, client_id, etc.)
// to all protected pages. Wraps the protected layout.

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/database";

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// Hook to access auth context in any component
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch the user profile from public.users
  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data as UserProfile | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();

    // Listen for auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ profile, loading, signOut, refreshProfile: fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
