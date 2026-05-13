"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, Bell, User, LogOut, Shield } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";
import { routes } from "@/config/routes";
import { isAdmin } from "@/lib/roles";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme, mounted } = useTheme();

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
      <div className="container-page max-w-2xl py-8 md:py-10">
        <div className="anim-rise mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-gradient-brand">Settings</span>
          </h1>
          <p className="mt-1.5 text-fg-tertiary">Manage preferences and your account.</p>
        </div>

        {/* Appearance */}
        <Card className="anim-rise delay-100 space-y-5">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            <Moon className="size-5 text-brand" /> Appearance
          </h2>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-fg-secondary">Theme</p>
            {mounted && (
              <div className="grid grid-cols-2 gap-2">
                <ThemeOption
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                  icon={<Sun className="size-5" />}
                  label="Light"
                />
                <ThemeOption
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  icon={<Moon className="size-5" />}
                  label="Dark"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Account */}
        <Card className="anim-rise delay-200 mt-5 space-y-3">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            <User className="size-5 text-brand" /> Account
          </h2>
          <Link href={routes.profile} className="block">
            <SettingsRow icon={<User className="size-4" />} label="Profile" hint="Name, username, email" />
          </Link>
          <Link href={routes.notifications} className="block">
            <SettingsRow icon={<Bell className="size-4" />} label="Notifications" hint="Manage what you receive" />
          </Link>
          {isAdmin(user) && (
            <Link href={routes.admin.dashboard} className="block">
              <SettingsRow icon={<Shield className="size-4" />} label="Admin dashboard" hint="Platform management" />
            </Link>
          )}
        </Card>

        {/* Danger */}
        <Card className="anim-rise delay-300 mt-5 border-danger/20 bg-danger-soft/30">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-danger">
            <LogOut className="size-5" /> Sign out
          </h2>
          <p className="mb-4 text-sm text-fg-secondary">
            You&apos;ll need to sign in again to access your account.
          </p>
          <Button onClick={handleLogout} variant="outline" leftIcon={<LogOut className="size-4" />}>
            Sign out
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}

function ThemeOption({
  active, onClick, icon, label,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-brand bg-brand-soft text-brand"
          : "border-line text-fg-secondary hover:bg-surface-2 hover:text-fg"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function SettingsRow({ icon, label, hint }: { icon: React.ReactNode; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition hover:bg-surface-2">
      <div className="flex items-center gap-3">
        <span className="text-fg-muted">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-fg-tertiary">{hint}</p>
        </div>
      </div>
      <span className="text-fg-muted">→</span>
    </div>
  );
}
