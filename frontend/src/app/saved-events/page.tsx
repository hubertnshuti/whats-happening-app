"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, RefreshCw, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";
import { EventCard, EventCardSkeleton } from "@/features/events/components/EventCard";
import { eventService } from "@/features/events/service";
import { ApiException } from "@/lib/ApiException";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import type { EventSummary } from "@/features/events/types";

export default function SavedEventsPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !user) router.replace(routes.login);
  }, [isHydrated, user, router]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.savedEvents({ size: 24 });
      setEvents(data.content);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Couldn't load saved events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) void load();
  }, [user]);

  return (
    <AppShell>
      <div className="container-page py-8 md:py-10">
        <header className="anim-rise mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Saved <span className="text-gradient-brand">events</span>
            </h1>
            <p className="mt-1.5 text-fg-tertiary">
              Events you&apos;ve bookmarked to come back to.
            </p>
          </div>
          {!loading && events.length > 0 && (
            <span className="hidden text-sm text-fg-tertiary md:block">
              <span className="font-semibold text-fg nums">{events.length}</span> saved
            </span>
          )}
        </header>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<Bookmark className="size-7" />}
            title="Couldn't load saved events"
            description={error}
            action={
              <Button onClick={load} leftIcon={<RefreshCw className="size-4" />}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="size-7" />}
            title="No saved events yet"
            description="Tap the bookmark icon on any event to keep it here for later."
            action={
              <Link href={routes.events}>
                <Button leftIcon={<Search className="size-4" />}>Browse events</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((e, i) => (
              <EventCard key={e.id} event={e} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
