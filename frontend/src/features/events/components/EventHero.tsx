"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { formatEventDate, formatEventTime, isToday } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { engagementService } from "@/features/engagement/service";
import type { EventDetail } from "../types";

interface EventHeroProps {
  event: EventDetail;
}

export function EventHero({ event }: EventHeroProps) {
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(event.isSaved ?? false);
  const [liked, setLiked] = useState(event.isLiked ?? false);
  const [savesCount, setSavesCount] = useState(event.savesCount ?? 0);
  const [likesCount, setLikesCount] = useState(event.likesCount ?? 0);
  const [busy, setBusy] = useState<"save" | "like" | null>(null);
  const [copied, setCopied] = useState(false);

  async function toggleSave() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusy("save");
    const next = !saved;
    setSaved(next);
    setSavesCount((n) => n + (next ? 1 : -1));
    try {
      if (next) await engagementService.save(event.id);
      else await engagementService.unsave(event.id);
    } catch {
      setSaved(!next);
      setSavesCount((n) => n + (next ? -1 : 1));
    } finally {
      setBusy(null);
    }
  }

  async function toggleLike() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusy("like");
    const next = !liked;
    setLiked(next);
    setLikesCount((n) => n + (next ? 1 : -1));
    try {
      if (next) await engagementService.like(event.id);
      else await engagementService.unlike(event.id);
    } catch {
      setLiked(!next);
      setLikesCount((n) => n + (next ? -1 : 1));
    } finally {
      setBusy(null);
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      engagementService.share(event.id).catch(() => {});
    } catch {
      /* user cancelled share */
    }
  }

  const today = event.startAt ? isToday(event.startAt) : false;
  const dateStr = event.startAt ? formatEventDate(event.startAt) : "TBA";
  const timeStr = event.startAt ? formatEventTime(event.startAt) : "Time TBA";
  const endTimeStr = event.endAt ? formatEventTime(event.endAt) : null;
  const categoryName = event.category?.name;
  const organizerName = event.organizer?.fullName ?? "Unknown organizer";
  const organizerImg = event.organizer?.profileImageUrl ?? null;
  const organizerUsername = event.organizer?.username;

  return (
    <section className="border-b border-line bg-surface-2">
      <div className="container-page py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* COVER */}
          <div className="anim-rise relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-3">
            {event.coverImageUrl ? (
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-soft to-surface-2">
                <Sparkles className="size-20 text-brand/30" />
              </div>
            )}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {today && (
                <Chip variant="brand" className="shadow-md">
                  <span className="size-1.5 rounded-full bg-brand anim-pulse-soft" />
                  Today
                </Chip>
              )}
              {event.free && (
                <Chip variant="success" className="shadow-md">
                  Free
                </Chip>
              )}
              {event.isOnline && (
                <Chip variant="info" leftIcon={<Globe className="size-3" />} className="shadow-md">
                  Online
                </Chip>
              )}
            </div>
          </div>

          {/* INFO PANEL */}
          <div className="anim-rise delay-100 flex flex-col gap-5">
            {categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                {categoryName}
              </span>
            )}

            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
              {event.title}
            </h1>

            {event.shortDescription && (
              <p className="text-base leading-relaxed text-fg-tertiary">
                {event.shortDescription}
              </p>
            )}

            <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <DetailRow icon={<Calendar className="size-4" />} text={dateStr} />
              <DetailRow
                icon={<Clock className="size-4" />}
                text={endTimeStr ? `${timeStr} – ${endTimeStr}` : timeStr}
              />
              {event.locationName && (
                <DetailRow
                  icon={<MapPin className="size-4" />}
                  text={
                    <>
                      <span className="font-medium text-fg">{event.locationName}</span>
                      {event.address && (
                        <span className="text-fg-tertiary"> · {event.address}</span>
                      )}
                    </>
                  }
                />
              )}
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <Avatar src={organizerImg} name={organizerName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-fg-tertiary">
                  Organized by
                </p>
                <p className="truncate font-semibold">{organizerName}</p>
                {organizerUsername && (
                  <p className="truncate text-xs text-fg-tertiary">@{organizerUsername}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={toggleSave}
                loading={busy === "save"}
                variant={saved ? "primary" : "outline"}
                size="lg"
                leftIcon={
                  <Bookmark className={cn("size-5", saved && "fill-current")} />
                }
                className="flex-1 min-w-[140px]"
              >
                {saved ? "Saved" : "Save"} · {savesCount}
              </Button>
              <Button
                onClick={toggleLike}
                loading={busy === "like"}
                variant="outline"
                size="lg"
                aria-label="Like"
                leftIcon={
                  <Heart
                    className={cn(
                      "size-5 transition",
                      liked && "fill-danger text-danger",
                    )}
                  />
                }
              >
                {likesCount}
              </Button>
              <Button
                onClick={share}
                variant="outline"
                size="lg"
                aria-label="Share"
                leftIcon={
                  copied ? <Check className="size-5 text-success" /> : <Share2 className="size-5" />
                }
              >
                {copied ? "Copied" : "Share"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailRow({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        {icon}
      </span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}
