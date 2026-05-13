"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  CheckCheck,
  Calendar,
  MessageSquare,
  AlertCircle,
  Megaphone,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";
import {
  notificationService,
  type Notification,
} from "@/features/notifications/service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { formatRelative } from "@/lib/format";
import { ApiException } from "@/lib/ApiException";
import { cn } from "@/lib/cn";
import type { NotificationType } from "@/types/domain";

const TYPE_META: Record<
  NotificationType,
  { icon: React.ReactNode; tone: string }
> = {
  EVENT_REMINDER:        { icon: <Calendar className="size-4" />,    tone: "bg-info-soft text-info" },
  FORUM_ANNOUNCEMENT:    { icon: <Megaphone className="size-4" />,   tone: "bg-brand-soft text-brand" },
  EVENT_UPDATE:          { icon: <AlertCircle className="size-4" />, tone: "bg-warning-soft text-warning" },
  EVENT_CANCELLED:       { icon: <AlertCircle className="size-4" />, tone: "bg-danger-soft text-danger" },
  QUESTION_ANSWERED:     { icon: <MessageSquare className="size-4" />,tone: "bg-success-soft text-success" },
  EVENT_APPROVED:        { icon: <CheckCheck className="size-4" />,  tone: "bg-success-soft text-success" },
  EVENT_REJECTED:        { icon: <AlertCircle className="size-4" />, tone: "bg-danger-soft text-danger" },
  FORUM_ARCHIVE_WARNING: { icon: <BellOff className="size-4" />,     tone: "bg-warning-soft text-warning" },
  COMMENT_REPLY:         { icon: <MessageSquare className="size-4" />,tone: "bg-info-soft text-info" },
};

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (isHydrated && !user) router.replace(routes.login);
  }, [isHydrated, user, router]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.list({ size: 50 });
      setItems(data.content);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Couldn't load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) void load();
  }, [user]);

  async function markAll() {
    setMarking(true);
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    } finally {
      setMarking(false);
    }
  }

  async function handleClick(n: Notification) {
    if (!n.read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      notificationService.markRead(n.id).catch(() => {});
    }
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell>
      <div className="container-page max-w-3xl py-8 md:py-10">
        <header className="anim-rise mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Notifications
              {unread > 0 && (
                <span className="rounded-pill bg-brand px-3 py-0.5 text-base font-bold text-fg-on-brand nums">
                  {unread}
                </span>
              )}
            </h1>
            <p className="mt-1.5 text-fg-tertiary">
              Reminders, updates, and forum announcements.
            </p>
          </div>
          {unread > 0 && (
            <Button
              onClick={markAll}
              loading={marking}
              variant="outline"
              leftIcon={<CheckCheck className="size-4" />}
            >
              Mark all read
            </Button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 animate-spin text-fg-muted" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Bell className="size-7" />}
            title="Couldn't load notifications"
            description={error}
            action={<Button onClick={load}>Try again</Button>}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Bell className="size-7" />}
            title="You're all caught up"
            description="Notifications about events you save and forums you follow will show here."
          />
        ) : (
          <ul className="space-y-2">
            {items.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.EVENT_UPDATE;
              const linkHref = n.eventSlug
                ? routes.event(n.eventSlug)
                : n.link ?? "#";
              return (
                <li key={n.id}>
                  <Link
                    href={linkHref}
                    onClick={() => handleClick(n)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 transition hover:border-line-strong",
                      n.read
                        ? "border-line bg-surface"
                        : "border-brand/30 bg-brand-soft/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                        meta.tone,
                      )}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="flex items-center gap-2 font-semibold">
                        {n.title}
                        {!n.read && (
                          <span className="size-2 rounded-full bg-brand" aria-label="Unread" />
                        )}
                      </p>
                      {n.message && (
                        <p className="text-sm leading-relaxed text-fg-secondary">
                          {n.message}
                        </p>
                      )}
                      <p className="text-xs text-fg-tertiary">{formatRelative(n.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
