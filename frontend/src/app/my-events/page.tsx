"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Plus, RefreshCw, MoreVertical } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";
import { Chip } from "@/components/ui/Chip";
import { EventCard, EventCardSkeleton } from "@/features/events/components/EventCard";
import { eventService } from "@/features/events/service";
import { ApiException } from "@/lib/ApiException";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { EVENT_STATUS_LABELS, type EventStatus } from "@/types/domain";
import type { EventSummary } from "@/features/events/types";

const FILTERS: { label: string; value: EventStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending review", value: "PENDING_REVIEW" },
  { label: "Completed", value: "COMPLETED" },
];

export default function MyEventsPage() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventStatus | "ALL">("ALL");

  useEffect(() => {
    if (isHydrated && !user) router.replace(routes.login);
  }, [isHydrated, user, router]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.myEvents({ size: 50 });
      setEvents(data.content);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Couldn't load your events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) void load();
  }, [user]);

  const filtered =
    filter === "ALL" ? events : events.filter((e) => e.status === filter);

  return (
    <AppShell>
      <div className="container-page py-8 md:py-10">
        <header className="anim-rise mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              My <span className="text-gradient-brand">events</span>
            </h1>
            <p className="mt-1.5 text-fg-tertiary">
              Everything you&apos;ve organized.
            </p>
          </div>
          <Link href={routes.createEvent}>
            <Button leftIcon={<Plus className="size-4" />}>Create event</Button>
          </Link>
        </header>

        {/* Filters */}
        {events.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f.value} type="button" onClick={() => setFilter(f.value)}>
                <Chip active={filter === f.value} className="h-9 px-4 cursor-pointer">
                  {f.label}
                  {f.value !== "ALL" && (
                    <span className="nums opacity-70">
                      {" · "}
                      {events.filter((e) => e.status === f.value).length}
                    </span>
                  )}
                </Chip>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={<Calendar className="size-7" />}
            title="Couldn't load your events"
            description={error}
            action={
              <Button onClick={load} leftIcon={<RefreshCw className="size-4" />}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Calendar className="size-7" />}
            title="You haven't organized any events yet"
            description="Create your first event in less than a minute."
            action={
              <Link href={routes.createEvent}>
                <Button leftIcon={<Plus className="size-4" />}>Create event</Button>
              </Link>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar className="size-7" />}
            title={`No ${EVENT_STATUS_LABELS[filter as EventStatus]?.toLowerCase() ?? ""} events`}
            description="Try a different filter."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((e, i) => (
              <div key={e.id} className="relative">
                <EventCard event={e} priority={i < 4} />
                <div className="absolute right-3 bottom-3 z-10">
                  <Chip
                    variant={
                      e.status === "PUBLISHED"
                        ? "success"
                        : e.status === "DRAFT"
                          ? "default"
                          : e.status === "PENDING_REVIEW"
                            ? "warning"
                            : e.status === "REJECTED" || e.status === "CANCELLED"
                              ? "danger"
                              : "default"
                    }
                    className="shadow-md"
                  >
                    {EVENT_STATUS_LABELS[e.status]}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
