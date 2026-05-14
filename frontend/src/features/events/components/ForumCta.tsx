"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight, BellRing } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";
import type { EventDetail } from "../types";

export function ForumCta({ event }: { event: EventDetail }) {
  if (!event.hasForum && !event.forumId) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-brand/30 bg-brand-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-brand/20 blur-2xl"
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-fg-on-brand shadow-md">
            <BellRing className="size-6" />
          </span>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold">Official event forum</h3>
            <p className="max-w-md text-sm leading-relaxed text-fg-secondary">
              Get updates directly from the organizer — venue changes, reminders,
              resources, and post-event materials.
            </p>
          </div>
        </div>
        <Link href={routes.eventForum(event.slug)} className="shrink-0">
          <Button
            size="lg"
            leftIcon={<MessageSquare className="size-5" />}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Open forum
          </Button>
        </Link>
      </div>
    </Card>
  );
}
