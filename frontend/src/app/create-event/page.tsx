"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  MapPin,
  Globe,
  Tag,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { eventService } from "@/features/events/service";
import { categoryService } from "@/features/categories/service";
import { ApiException } from "@/lib/ApiException";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import type { CategorySummary } from "@/features/events/types";

const schema = z
  .object({
    title: z.string().min(4, "Title is too short").max(150),
    shortDescription: z.string().max(280).optional().or(z.literal("")),
    description: z.string().max(5000).optional().or(z.literal("")),
    categoryId: z.string().min(1, "Pick a category"),
    locationName: z.string().max(150).optional().or(z.literal("")),
    address: z.string().max(255).optional().or(z.literal("")),
    city: z.string().max(80).optional().or(z.literal("")),
    startAt: z.string().min(1, "Start date is required"),
    endAt: z.string().min(1, "End date is required"),
    isOnline: z.boolean().optional(),
    onlineLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    free: z.boolean().optional(),
    maxAttendees: z.coerce.number().int().positive().optional().or(z.literal("")),
    coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tagsInput: z.string().optional().or(z.literal("")),
  })
  .refine((d) => new Date(d.endAt) > new Date(d.startAt), {
    message: "End must be after start",
    path: ["endAt"],
  });

type FormValues = z.infer<typeof schema>;

export default function CreateEventPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      locationName: "",
      address: "",
      city: "",
      startAt: "",
      endAt: "",
      isOnline: false,
      onlineLink: "",
      free: true,
      coverImageUrl: "",
      tagsInput: "",
    },
  });

  const isOnline = watch("isOnline");
  const isFree = watch("free");
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (isHydrated && !user) router.replace(routes.login);
  }, [isHydrated, user, router]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await categoryService.list();
        setCategories(cats);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const tags = (values.tagsInput ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const result = await eventService.create({
        title: values.title,
        shortDescription: values.shortDescription || undefined,
        description: values.description || undefined,
        categoryId: values.categoryId,
        locationName: values.locationName || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
        isOnline: !!values.isOnline,
        onlineLink: values.onlineLink || undefined,
        free: !!values.free,
        maxAttendees:
          typeof values.maxAttendees === "number" ? values.maxAttendees : undefined,
        coverImageUrl: values.coverImageUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      router.push(routes.event(result.slug));
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors.length > 0) {
          for (const fe of err.errors) {
            if (fe.field)
              setError(fe.field as keyof FormValues, { message: fe.message });
          }
        }
        setServerError(err.message);
      } else {
        setServerError("Couldn't create event. Try again.");
      }
    }
  }

  return (
    <AppShell>
      <div className="container-page max-w-3xl py-8 md:py-10">
        <Link
          href={routes.home}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-fg-tertiary transition hover:text-fg"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <div className="anim-rise mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Create an{" "}
            <span className="text-gradient-brand">event</span>
          </h1>
          <p className="mt-2 text-fg-tertiary">
            Fill in the basics. You can always edit details later.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* BASICS */}
          <Card>
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles className="size-5 text-brand" />
              The basics
            </h2>
            <div className="space-y-4">
              <Input
                label="Event title"
                placeholder="e.g. AI Workshop at CST"
                {...register("title")}
                error={errors.title?.message}
              />
              <Input
                label="Short description"
                hint="One-line teaser shown on cards (optional)"
                placeholder="Intro AI workshop, bring your laptop"
                {...register("shortDescription")}
                error={errors.shortDescription?.message}
              />
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-fg-secondary">
                  Full description
                </label>
                <textarea
                  rows={6}
                  placeholder="What is it about? What should attendees expect?"
                  {...register("description")}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
                {errors.description && (
                  <p className="text-sm text-danger">{errors.description.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-fg-secondary">
                  Category
                </label>
                {categories.length === 0 ? (
                  <p className="text-sm text-fg-muted">Loading categories…</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setValue("categoryId", c.id, { shouldValidate: true })}
                      >
                        <Chip active={categoryId === c.id} className="h-9 px-4 cursor-pointer">
                          {c.name}
                        </Chip>
                      </button>
                    ))}
                  </div>
                )}
                {errors.categoryId && (
                  <p className="text-sm text-danger">{errors.categoryId.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* WHEN */}
          <Card>
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
              <Calendar className="size-5 text-brand" />
              When
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="datetime-local"
                label="Starts"
                {...register("startAt")}
                error={errors.startAt?.message}
              />
              <Input
                type="datetime-local"
                label="Ends"
                {...register("endAt")}
                error={errors.endAt?.message}
              />
            </div>
          </Card>

          {/* WHERE */}
          <Card>
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
              <MapPin className="size-5 text-brand" />
              Where
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isOnline")}
                  className="size-4 accent-[var(--color-brand-500)]"
                />
                <Globe className="size-4 text-fg-tertiary" />
                <span className="text-sm font-medium">This is an online event</span>
              </label>

              {isOnline ? (
                <Input
                  type="url"
                  label="Online link"
                  placeholder="https://meet.google.com/…"
                  {...register("onlineLink")}
                  error={errors.onlineLink?.message}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Venue name"
                    placeholder="Muhabura 2R01"
                    {...register("locationName")}
                    error={errors.locationName?.message}
                  />
                  <Input
                    label="City"
                    placeholder="Kigali"
                    {...register("city")}
                    error={errors.city?.message}
                  />
                  <Input
                    label="Address"
                    placeholder="Optional"
                    containerClassName="md:col-span-2"
                    {...register("address")}
                    error={errors.address?.message}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* EXTRAS */}
          <Card>
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold">
              <Tag className="size-5 text-brand" />
              Extras
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("free")}
                  className="size-4 accent-[var(--color-brand-500)]"
                />
                <span className="text-sm font-medium">
                  {isFree ? "Free to attend" : "Paid event"}
                </span>
              </label>

              <Input
                label="Cover image URL"
                placeholder="https://res.cloudinary.com/…"
                leftIcon={<ImageIcon className="size-4" />}
                {...register("coverImageUrl")}
                error={errors.coverImageUrl?.message}
                hint="Paste a public image URL for now (upload coming soon)"
              />

              <Input
                type="number"
                label="Capacity"
                placeholder="e.g. 100"
                leftIcon={<Users className="size-4" />}
                {...register("maxAttendees")}
                error={errors.maxAttendees?.message}
                hint="Max number of attendees (optional)"
              />

              <Input
                label="Tags"
                hint="Comma-separated. e.g. ai, workshop, beginners"
                placeholder="ai, workshop, beginners"
                {...register("tagsInput")}
              />
            </div>
          </Card>

          {serverError && (
            <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link href={routes.home}>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="lg" loading={isSubmitting}>
              Create event
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
