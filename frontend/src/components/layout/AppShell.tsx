"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Bookmark,
  Calendar,
  Bell,
  User,
  Plus,
  Settings,
} from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/cn";
import { routes } from "@/config/routes";

const primaryNav = [
  { href: routes.home, label: "Discover", icon: Home },
  { href: routes.events, label: "All events", icon: Calendar },
  { href: routes.search, label: "Search", icon: Search },
];

const personalNav = [
  { href: routes.savedEvents, label: "Saved", icon: Bookmark },
  { href: routes.myEvents, label: "My events", icon: Calendar },
  { href: routes.notifications, label: "Notifications", icon: Bell },
  { href: routes.profile, label: "Profile", icon: User },
  { href: routes.settings, label: "Settings", icon: Settings },
];

const mobileNav = [
  { href: routes.home, label: "Home", icon: Home },
  { href: routes.search, label: "Search", icon: Search },
  { href: routes.savedEvents, label: "Saved", icon: Bookmark },
  { href: routes.notifications, label: "Inbox", icon: Bell },
  { href: routes.profile, label: "You", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-app">
      {/* ─── Desktop sidebar ─────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center px-6">
          <Brand size="md" />
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                active={isActive(pathname, item.href)}
              />
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              You
            </p>
            {personalNav.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                active={isActive(pathname, item.href)}
              />
            ))}
          </div>
        </nav>

        <div className="border-t border-line p-4">
          <Link
            href={routes.createEvent}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-fg-on-brand shadow-sm transition hover:bg-brand-hover hover:shadow-md"
          >
            <Plus className="size-4" />
            Create event
          </Link>
        </div>
      </aside>

      {/* ─── Top bar (mobile + spacer for desktop) ───────────── */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur-md lg:pl-64">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="lg:hidden">
            <Brand size="md" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ─── Main content ────────────────────────────────────── */}
      <main className="lg:pl-64">
        <div className="pb-24 lg:pb-12">{children}</div>
      </main>

      {/* ─── Mobile bottom tab bar ───────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
          {mobileNav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition",
                  active ? "text-brand" : "text-fg-tertiary",
                )}
              >
                <Icon
                  className={cn("size-5", active && "stroke-[2.5]")}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-brand-soft text-brand"
          : "text-fg-secondary hover:bg-surface-2 hover:text-fg",
      )}
    >
      <Icon className={cn("size-5", active && "stroke-[2.5]")} />
      {label}
    </Link>
  );
}
