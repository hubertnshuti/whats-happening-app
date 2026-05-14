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
  Bell,
} from "lucide-react";
import { notificationService } from "@/features/notifications/service";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { routes } from "@/config/routes";
import { isAdmin, isOrganizerOrAbove } from "@/lib/roles";

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

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationService.unreadCount()
      .then(d => setUnread(Number(d.count ?? 0)))
      .catch(() => {});
  }, [user?.id]);

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

  const userIsAdmin = isAdmin(user);
  const userIsOrganizerOrAbove = isOrganizerOrAbove(user);

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
            {user.username && <p className="truncate text-xs text-fg-tertiary">@{user.username}</p>}
          </div>

          <div className="py-1.5">
            <MenuLink href={routes.profile} icon={<User className="size-4" />}>
              Profile
            </MenuLink>
            <MenuLink href={routes.notifications} icon={<Bell className="size-4" />}>
              <span className="flex items-center justify-between w-full">
                Notifications
                {unread > 0 && (
                  <span className="ml-auto rounded-pill bg-brand px-1.5 py-0.5 text-[10px] font-bold text-fg-on-brand">
                    {unread}
                  </span>
                )}
              </span>
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

          {(userIsOrganizerOrAbove || userIsAdmin) && (
            <div className="border-t border-line-subtle py-1.5">
              {userIsOrganizerOrAbove && (
                <MenuLink
                  href={routes.organizer.dashboard}
                  icon={<Calendar className="size-4" />}
                >
                  Organizer dashboard
                </MenuLink>
              )}
              {userIsAdmin && (
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
