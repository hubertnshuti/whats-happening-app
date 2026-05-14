"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark, Heart, Share2, MapPin, Calendar, Clock, Globe, Check, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { formatEventDate, formatEventTime, isToday } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { engagementService } from "@/features/engagement/service";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import type { EventDetail } from "../types";

export function EventHero({ event }: { event: EventDetail }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [saved, setSaved] = useState(event.isSaved ?? false);
  const [liked, setLiked] = useState(event.isLiked ?? false);
  const [savesCount, setSavesCount] = useState(event.savesCount ?? 0);
  const [likesCount, setLikesCount] = useState(event.likesCount ?? 0);
  const [busy, setBusy] = useState<"save" | "like" | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    if (!user) { router.push(routes.login); return; }
    setBusy("save");
    try {
      const res = await engagementService.toggleSave(event.id);
      setSaved(res.active);
      setSavesCount((n) => res.active ? n + 1 : Math.max(0, n - 1));
    } catch { /* ignore */ }
    finally { setBusy(null); }
  }

  async function handleLike() {
    if (!user) { router.push(routes.login); return; }
    setBusy("like");
    try {
      const res = await engagementService.toggleLike(event.id);
      setLiked(res.active);
      setLikesCount(res.totalCount);
    } catch { /* ignore */ }
    finally { setBusy(null); }
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
    } catch { /* user cancelled */ }
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
          <div className="anim-rise relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-3">
            {event.coverImageUrl ? (
              <Image src={event.coverImageUrl} alt={event.title} fill priority
                sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-soft to-surface-2">
                <Sparkles className="size-20 text-brand/30" />
              </div>
            )}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {today && <Chip variant="brand" className="shadow-md"><span className="size-1.5 rounded-full bg-brand anim-pulse-soft" />Today</Chip>}
              {event.free && <Chip variant="success" className="shadow-md">Free</Chip>}
              {event.isOnline && <Chip variant="info" leftIcon={<Globe className="size-3" />} className="shadow-md">Online</Chip>}
            </div>
          </div>

          <div className="anim-rise delay-100 flex flex-col gap-5">
            {categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wider text-brand">{categoryName}</span>
            )}
            <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">{event.title}</h1>
            {event.shortDescription && (
              <p className="text-base leading-relaxed text-fg-tertiary">{event.shortDescription}</p>
            )}

            <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
              <Row icon={<Calendar className="size-4" />} text={dateStr} />
              <Row icon={<Clock className="size-4" />} text={endTimeStr ? `${timeStr} – ${endTimeStr}` : timeStr} />
              {event.locationName && (
                <Row icon={<MapPin className="size-4" />} text={
                  <><span className="font-medium text-fg">{event.locationName}</span>
                  {event.address && <span className="text-fg-tertiary"> · {event.address}</span>}</>
                } />
              )}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <Avatar src={organizerImg} name={organizerName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-fg-tertiary">Organized by</p>
                <p className="truncate font-semibold">{organizerName}</p>
                {organizerUsername && <p className="truncate text-xs text-fg-tertiary">@{organizerUsername}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleSave} loading={busy === "save"}
                variant={saved ? "primary" : "outline"} size="lg"
                leftIcon={<Bookmark className={cn("size-5", saved && "fill-current")} />}
                className="flex-1 min-w-[140px]">
                {saved ? "Saved" : "Save"} · {savesCount}
              </Button>
              <Button onClick={handleLike} loading={busy === "like"} variant="outline" size="lg"
                leftIcon={<Heart className={cn("size-5 transition", liked && "fill-danger text-danger")} />}>
                {likesCount}
              </Button>
              <Button onClick={share} variant="outline" size="lg"
                leftIcon={copied ? <Check className="size-5 text-success" /> : <Share2 className="size-5" />}>
                {copied ? "Copied" : "Share"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">{icon}</span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}
