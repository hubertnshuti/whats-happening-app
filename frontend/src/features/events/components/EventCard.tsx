"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Eye, Sparkles } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { formatDateChip, formatEventTime, isToday, formatCount } from "@/lib/format";
import { routes } from "@/config/routes";
import type { EventSummary } from "../types";

interface EventCardProps {
  event: EventSummary;
  className?: string;
  priority?: boolean;
}

export function EventCard({ event, className, priority }: EventCardProps) {
  const startAt = event.startAt;
  const chip = startAt ? formatDateChip(startAt) : { month: "TBA", day: "—" };
  const time = startAt ? formatEventTime(startAt) : "Time TBA";
  const today = startAt ? isToday(startAt) : false;

  const categoryName = event.category?.name ?? "Event";

  return (
    <Link
      href={routes.event(event.slug)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-lg",
        className,
      )}
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-soft to-surface-2">
            <Sparkles className="size-12 text-brand/40" />
          </div>
        )}

        {/* Date chip */}
        <div className="absolute left-3 top-3 flex flex-col items-center justify-center rounded-xl bg-surface px-3 py-1.5 shadow-md backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
            {chip.month}
          </span>
          <span className="font-display text-xl font-bold leading-none nums">
            {chip.day}
          </span>
        </div>

        {/* Status chips */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {today && (
            <Chip variant="brand" className="shadow-sm">
              <span className="size-1.5 rounded-full bg-brand anim-pulse-soft" />
              Today
            </Chip>
          )}
          {event.free && (
            <Chip variant="success" className="shadow-sm">
              Free
            </Chip>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-brand">
            {categoryName}
          </span>
          <span className="text-fg-muted">·</span>
          <span className="text-fg-tertiary nums">{time}</span>
        </div>

        <h3 className="line-clamp-2 font-display text-lg font-bold leading-tight tracking-tight text-fg">
          {event.title}
        </h3>

        {event.shortDescription && (
          <p className="line-clamp-2 text-sm leading-relaxed text-fg-tertiary">
            {event.shortDescription}
          </p>
        )}

        <div className="mt-auto space-y-2 pt-2">
          {event.locationName && (
            <div className="flex items-center gap-1.5 text-xs text-fg-tertiary">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{event.locationName}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-fg-tertiary">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {chip.month} {chip.day}
            </span>
            {typeof event.viewCount === "number" && (
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" />
                <span className="nums">{formatCount(event.viewCount)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="aspect-[4/3] w-full animate-pulse bg-surface-2" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
          <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
