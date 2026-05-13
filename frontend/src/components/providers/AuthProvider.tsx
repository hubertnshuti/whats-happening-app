"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Wraps the app. On mount, attempts to restore the user session from
 * stored tokens by calling /auth/me. Children render immediately —
 * components that need auth state read from useAuthStore directly.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
