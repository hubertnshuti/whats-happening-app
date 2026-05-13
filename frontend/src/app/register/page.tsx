"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Sparkles,
  Calendar,
  MessageSquare,
  Bell,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ApiException } from "@/lib/ApiException";
import { routes } from "@/config/routes";

const schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and _ only"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").max(100, "Too long"),
});

type FormValues = z.infer<typeof schema>;

const features = [
  {
    icon: Calendar,
    title: "Every event, one place",
    desc: "Workshops, talks, matches, registrations — all on one feed.",
  },
  {
    icon: MessageSquare,
    title: "Official event forums",
    desc: "Get updates straight from the organizer, not random WhatsApp groups.",
  },
  {
    icon: Bell,
    title: "Never miss what matters",
    desc: "Smart reminders before things start. Save what you care about.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", username: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await registerUser(values);
      router.push(routes.home);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors.length > 0) {
          for (const fe of err.errors) {
            if (fe.field) {
              setError(fe.field as keyof FormValues, { message: fe.message });
            }
          }
        }
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    }
  }

  return (
    <main className="min-h-dvh grid lg:grid-cols-[1.1fr_1fr]">
      {/* ═══════════════════════════════════════════════════════════════════
          LEFT — Editorial brand panel (hidden on mobile)
         ═══════════════════════════════════════════════════════════════════ */}
      <aside className="relative hidden overflow-hidden lg:flex flex-col bg-surface-2">
        {/* Decorative gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.17 35 / 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-32 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.67 0.20 32 / 0.35) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Brand mark */}
          <Link
            href={routes.home}
            className="flex items-center gap-2.5 font-display text-xl font-bold"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-md">
              <Sparkles className="size-5" strokeWidth={2.5} />
            </span>
            What&apos;s <span className="text-gradient-brand">Happening</span>
          </Link>

          {/* Main content */}
          <div className="space-y-10 py-12">
            <div className="space-y-5">
              <span className="anim-rise inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                <span className="size-1.5 rounded-full bg-brand anim-pulse-soft" />
                Built for CST
              </span>
              <h2 className="anim-rise delay-100 font-display text-4xl font-bold leading-[1.1] tracking-tight xl:text-5xl">
                Stop missing
                <br />
                what&apos;s{" "}
                <span className="text-gradient-brand">happening</span>{" "}
                around you.
              </h2>
              <p className="anim-rise delay-200 max-w-md text-lg leading-relaxed text-fg-tertiary">
                Discover events, follow organizers, and join the only platform
                built for the way campus actually moves.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-5">
              {features.map((f, i) => (
                <li
                  key={f.title}
                  className={`anim-rise delay-${
                    300 + i * 100
                  } flex items-start gap-4`}
                >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <f.icon className="size-5" strokeWidth={2.2} />
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-fg">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fg-tertiary">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <p className="text-sm text-fg-muted">
            © 2026 What&apos;s Happening · Made for CST students
          </p>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT — Form panel
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="flex items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
        <div className="w-full max-w-[440px]">
          {/* Mobile-only brand */}
          <Link
            href={routes.home}
            className="mb-10 flex items-center gap-2 font-display text-xl font-bold lg:hidden"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles className="size-5" strokeWidth={2.5} />
            </span>
            What&apos;s <span className="text-gradient-brand">Happening</span>
          </Link>

          <div className="anim-rise mb-8 space-y-2">
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Create account
            </h1>
            <p className="text-base text-fg-tertiary">
              It takes less than a minute.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="anim-rise delay-100 space-y-5"
            noValidate
          >
            {/* Full name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-fg-secondary"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                {...register("fullName")}
                className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-base text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 transition"
              />
              {errors.fullName && (
                <p className="text-sm text-danger">{errors.fullName.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-fg-secondary"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="janedoe"
                  {...register("username")}
                  className="h-12 w-full rounded-xl border border-line bg-surface pl-9 pr-4 text-base text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 transition"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-danger">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-fg-secondary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-base text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 transition"
              />
              {errors.email && (
                <p className="text-sm text-danger">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-fg-secondary"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register("password")}
                  className="h-12 w-full rounded-xl border border-line bg-surface px-4 pr-12 text-base text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-fg-muted hover:bg-surface-2 hover:text-fg-secondary transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-danger">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
                {serverError}
              </div>
            )}

            {/* Terms */}
            <p className="flex items-start gap-2 text-xs leading-relaxed text-fg-tertiary">
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              <span>
                By creating an account, you agree to our terms and acknowledge
                our privacy policy.
              </span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-fg-on-brand shadow-sm transition hover:bg-brand-hover hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="anim-rise delay-300 mt-8 text-center text-base text-fg-secondary">
            Already have an account?{" "}
            <Link
              href={routes.login}
              className="font-semibold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
