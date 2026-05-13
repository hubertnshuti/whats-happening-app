"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import { AppShell } from "@/components/layout/AppShell";
import { Spinner } from "@/components/ui/feedback";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) { router.replace(routes.login); return; }
    router.replace(routes.organizer.events);
  }, [isHydrated, user, router]);

  return (
    <AppShell>
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    </AppShell>
  );
}
