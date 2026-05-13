"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, ShieldCheck, AtSign, BadgeCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import { formatRelative } from "@/lib/format";
import { ROLE_LABELS } from "@/types/domain";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isHydrated && !user) router.replace(routes.login);
  }, [isHydrated, user, router]);

  if (!user) return <AppShell><div /></AppShell>;

  async function handleLogout() {
    await logout();
    router.push(routes.home);
  }

  return (
    <AppShell>
      <div className="container-page max-w-3xl py-8 md:py-10">
        <div className="anim-rise mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Your <span className="text-gradient-brand">profile</span>
          </h1>
          <p className="mt-1.5 text-fg-tertiary">Account details and identity.</p>
        </div>

        {/* Hero card */}
        <Card className="anim-rise delay-100 relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.73 0.17 35 / 0.5) 0%, transparent 70%)" }}
          />
          <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center">
            <Avatar src={user.profileImageUrl} name={user.fullName} size="xl" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold">{user.fullName}</h2>
                {user.emailVerified && (
                  <BadgeCheck className="size-5 text-info" aria-label="Verified" />
                )}
              </div>
              <p className="flex items-center gap-1.5 text-sm text-fg-tertiary">
                <AtSign className="size-4" />
                {user.username}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Chip variant="brand">
                  <ShieldCheck className="size-3" /> {ROLE_LABELS[user.role]}
                </Chip>
                <Chip variant={user.status === "ACTIVE" ? "success" : "warning"}>
                  {user.status}
                </Chip>
              </div>
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className="anim-rise delay-200 mt-5">
          <h3 className="mb-4 font-display text-base font-bold">Account details</h3>
          <dl className="space-y-4">
            <DetailRow icon={<Mail className="size-4" />} label="Email" value={user.email} />
            <DetailRow icon={<AtSign className="size-4" />} label="Username" value={`@${user.username}`} />
            <DetailRow icon={<ShieldCheck className="size-4" />} label="Role" value={ROLE_LABELS[user.role]} />
            <DetailRow icon={<Calendar className="size-4" />} label="Joined" value={formatRelative(user.createdAt)} />
          </dl>
        </Card>

        <div className="anim-rise delay-300 mt-6 flex justify-end">
          <Button onClick={handleLogout} variant="outline">Sign out</Button>
        </div>
      </div>
    </AppShell>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line-subtle pb-3 last:border-0 last:pb-0">
      <dt className="flex items-center gap-2 text-sm text-fg-tertiary">
        <span className="text-fg-muted">{icon}</span>
        {label}
      </dt>
      <dd className="text-sm font-semibold text-fg">{value}</dd>
    </div>
  );
}
