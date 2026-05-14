"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Sparkles, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { routes } from "@/config/routes";

import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <PublicShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.17 35 / 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="container-page relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <Chip variant="brand" leftIcon={<Sparkles className="size-3.5" />}>
              <span className="anim-pulse-soft">New · Built for CST students</span>
            </Chip>

            <h1 className="anim-rise font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Discover everything{" "}
              <span className="text-gradient-brand">happening</span> around you.
            </h1>

            <p className="anim-rise delay-100 max-w-2xl text-lg leading-relaxed text-fg-tertiary md:text-xl">
              Workshops, talks, matches, registrations — all in one place, on
              time. Stop missing what matters.
            </p>

            <div className="anim-rise delay-200 flex flex-wrap items-center gap-3 pt-4">
              <Link href={routes.events}>
                <Button size="lg" rightIcon={<ArrowRight className="size-5" />}>
                  Browse events
                </Button>
              </Link>
              {!user && (<Link href={routes.register}>
                <Button size="lg" variant="outline">
                  Create account
                </Button>
              </Link>)}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS / SOCIAL PROOF placeholder */}
      <section className="container-page pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <Card hoverable>
            <Calendar className="size-8 text-brand" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Every event, one feed
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-tertiary">
              No more scrolling through six WhatsApp groups to find one workshop.
            </p>
          </Card>
          <Card hoverable>
            <Users className="size-8 text-brand" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Official forums
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-tertiary">
              Updates straight from the organizer. Venue changes, reminders,
              resources.
            </p>
          </Card>
          <Card hoverable>
            <Sparkles className="size-8 text-brand" />
            <h3 className="mt-4 font-display text-xl font-semibold">
              Built for campus
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-tertiary">
              Made for the way CST actually moves. Real events, real students.
            </p>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
