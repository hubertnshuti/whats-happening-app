"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ApiException } from "@/lib/ApiException";
import { routes } from "@/config/routes";
import { isAdmin } from "@/lib/roles";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await login(values);
      const { user } = useAuthStore.getState();
      router.push(isAdmin(user) ? routes.admin.dashboard : routes.home);
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
    <main className="relative min-h-dvh flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Subtle decorative coral glow — top-right and bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.73 0.17 35 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.80 0.13 38 / 0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[440px]">
        {/* Brand mark */}
        <Link
          href={routes.home}
          className="anim-rise mb-12 flex items-center justify-center gap-2 font-display text-xl font-bold"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-md">
            <Sparkles className="size-5" strokeWidth={2.5} />
          </span>
          What&apos;s <span className="text-gradient-brand">Happening</span>
        </Link>

        {/* Header */}
        <div className="anim-rise delay-100 mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back
          </h1>
          <p className="mt-3 text-lg text-fg-tertiary">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="anim-rise delay-200 space-y-5"
          noValidate
        >
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-fg-secondary"
            >
              Email address
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-fg-secondary"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
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

          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-fg-on-brand shadow-sm transition hover:bg-brand-hover hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="anim-rise delay-300 my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-line" />
          <span className="text-sm text-fg-muted">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {/* Register CTA */}
        <p className="anim-rise delay-400 text-center text-base text-fg-secondary">
          New here?{" "}
          <Link
            href={routes.register}
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
