"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";
import { EventHero } from "@/features/events/components/EventHero";
import { ForumCta } from "@/features/events/components/ForumCta";
import { eventService } from "@/features/events/service";
import { ApiException } from "@/lib/ApiException";
import { routes } from "@/config/routes";
import type { EventDetail } from "@/features/events/types";

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await eventService.bySlug(slug);
        if (active) setEvent(data);
      } catch (err) {
        if (active) setError(err instanceof ApiException ? err.message : "Couldn't load this event.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <PublicShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-fg-muted" />
        </div>
      </PublicShell>
    );
  }

  if (error || !event) {
    return (
      <PublicShell>
        <div className="container-page py-20">
          <EmptyState
            icon={<AlertCircle className="size-7" />}
            title="Event not found"
            description={error ?? "This event may have been removed or is no longer public."}
            action={<Link href={routes.events}><Button leftIcon={<ArrowLeft className="size-4" />}>Back to events</Button></Link>}
          />
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="container-page pt-6">
        <Link href={routes.events} className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-tertiary transition hover:text-fg">
          <ArrowLeft className="size-4" /> All events
        </Link>
      </div>

      <EventHero event={event} />

      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8 min-w-0">
            <ForumCta event={event} />

            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold tracking-tight">About this event</h2>
              {event.description ? (
                <div className="whitespace-pre-wrap text-base leading-relaxed text-fg-secondary">{event.description}</div>
              ) : (
                <p className="text-sm text-fg-tertiary">The organizer hasn&apos;t added a longer description yet.</p>
              )}
            </section>

            {event.tags && event.tags.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-fg-tertiary">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((t) => (
                    <span key={t} className="rounded-pill bg-surface-2 px-3 py-1 text-xs font-medium text-fg-secondary">#{t}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-display text-base font-bold">Quick info</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {event.category && <InfoRow label="Category" value={event.category.name} />}
                <InfoRow label="Price" value={event.free ? "Free" : (event.priceType ?? "Paid")} />
                {event.maxAttendees && <InfoRow label="Capacity" value={`${event.maxAttendees} people`} />}
                {typeof event.viewCount === "number" && <InfoRow label="Views" value={event.viewCount.toString()} />}
                <InfoRow label="Status" value={event.status} />
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className="font-medium text-fg">{value}</dd>
    </div>
  );
}
