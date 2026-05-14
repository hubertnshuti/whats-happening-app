"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { routes } from "@/config/routes";

const navLinks = [
  { href: routes.events, label: "Events" },
  { href: routes.categories, label: "Categories" },
  { href: routes.search, label: "Search" },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-app">
      {/* ─── Top nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Brand size="md" />
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg-secondary transition hover:bg-surface-2 hover:text-fg"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={routes.search}
              className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 text-sm text-fg-tertiary transition hover:bg-surface-3 md:flex md:w-56 lg:w-64"
            >
              <Search className="size-4" />
              <span className="flex-1 text-left">Search events…</span>
              <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-fg-muted">
                ⌘K
              </kbd>
            </Link>
            <Link
              href={routes.search}
              className="flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-fg-secondary transition hover:bg-surface-2 md:hidden"
              aria-label="Search"
            >
              <Search className="size-5" />
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ─── Main ──────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface">
        <div className="container-page py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <Brand size="sm" />
              <p className="text-sm text-fg-tertiary">
                © 2026 What&apos;s Happening · Built for CST
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link href="#" className="text-fg-tertiary transition hover:text-fg">
                About
              </Link>
              <Link href="#" className="text-fg-tertiary transition hover:text-fg">
                For organizers
              </Link>
              <Link href="#" className="text-fg-tertiary transition hover:text-fg">
                Privacy
              </Link>
              <Link href="#" className="text-fg-tertiary transition hover:text-fg">
                Terms
              </Link>
              <Link href="#" className="text-fg-tertiary transition hover:text-fg">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
