"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Bookmark,
  Calendar,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push(routes.home);
  }

  // Logged-out state — show sign in / sign up
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={routes.login} className="hidden sm:block">
          <Button variant="ghost" size="md" leftIcon={<LogIn className="size-4" />}>
            Sign in
          </Button>
        </Link>
        <Link href={routes.register}>
          <Button variant="primary" size="md" leftIcon={<UserPlus className="size-4" />}>
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  const isOrganizerOrAbove =
    user.role === "ORGANIZER" ||
    user.role === "ADMIN" ||
    user.role === "MODERATOR" ||
    user.role === "SUPER_ADMIN";
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1 pr-2 transition hover:bg-surface-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={user.profileImageUrl} name={user.fullName} size="sm" />
        <ChevronDown
          className={`size-4 text-fg-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="anim-scale-in absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-lg"
        >
          <div className="border-b border-line-subtle px-3 py-3">
            <p className="truncate text-sm font-semibold">{user.fullName}</p>
            <p className="truncate text-xs text-fg-tertiary">@{user.username}</p>
          </div>

          <div className="py-1.5">
            <MenuLink href={routes.profile} icon={<User className="size-4" />}>
              Profile
            </MenuLink>
            <MenuLink href={routes.savedEvents} icon={<Bookmark className="size-4" />}>
              Saved events
            </MenuLink>
            <MenuLink href={routes.myEvents} icon={<Calendar className="size-4" />}>
              My events
            </MenuLink>
            <MenuLink href={routes.settings} icon={<Settings className="size-4" />}>
              Settings
            </MenuLink>
          </div>

          {(isOrganizerOrAbove || isAdmin) && (
            <div className="border-t border-line-subtle py-1.5">
              {isOrganizerOrAbove && (
                <MenuLink
                  href={routes.organizer.dashboard}
                  icon={<Calendar className="size-4" />}
                >
                  Organizer dashboard
                </MenuLink>
              )}
              {isAdmin && (
                <MenuLink
                  href={routes.admin.dashboard}
                  icon={<Shield className="size-4" />}
                >
                  Admin
                </MenuLink>
              )}
            </div>
          )}

          <div className="border-t border-line-subtle py-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger-soft"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-secondary transition hover:bg-surface-2 hover:text-fg"
      role="menuitem"
    >
      <span className="text-fg-muted">{icon}</span>
      {children}
    </Link>
  );
}
