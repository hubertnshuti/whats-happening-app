"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, CalendarX, RefreshCw } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/feedback";
import { EventCard, EventCardSkeleton } from "@/features/events/components/EventCard";
import { CategoryChips } from "@/features/events/components/CategoryChips";
import { SortDropdown } from "@/features/events/components/SortDropdown";
import { Pagination } from "@/features/events/components/Pagination";
import { eventService } from "@/features/events/service";
import { categoryService } from "@/features/categories/service";
import { ApiException } from "@/lib/ApiException";
import type {
  CategorySummary,
  EventSort,
  EventSummary,
} from "@/features/events/types";
import type { PageResponse } from "@/types/api";

const PAGE_SIZE = 12;

export default function EventsPage() {
  // Filters & paging state
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<EventSort>("upcoming");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Data state
  const [events, setEvents] = useState<PageResponse<EventSummary> | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Load categories once */
  useEffect(() => {
    (async () => {
      try {
        const cats = await categoryService.list();
        setCategories(cats);
      } catch {
        // non-fatal — page still works without categories
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  /* Load events whenever filters change */
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.list({
        page,
        size: PAGE_SIZE,
        sort,
        category: categorySlug ?? undefined,
        search: search || undefined,
        status: "PUBLISHED",
      });
      setEvents(data);
    } catch (err) {
      setError(
        err instanceof ApiException
          ? err.message
          : "Could not load events. Try again.",
      );
      setEvents(null);
    } finally {
      setLoading(false);
    }
  }, [page, sort, categorySlug, search]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  /* Reset to page 0 whenever filters change */
  function handleCategoryChange(slug: string | null) {
    setCategorySlug(slug);
    setPage(0);
  }
  function handleSortChange(s: EventSort) {
    setSort(s);
    setPage(0);
  }
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(0);
  }

  function handlePageChange(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PublicShell>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-surface-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.73 0.17 35 / 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="container-page relative py-12 md:py-16">
          <div className="max-w-2xl space-y-4">
            <h1 className="anim-rise font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Browse{" "}
              <span className="text-gradient-brand">all events</span>
            </h1>
            <p className="anim-rise delay-100 text-lg text-fg-tertiary">
              Find your next workshop, talk, match, or meetup.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="anim-rise delay-200 mt-8 max-w-2xl"
          >
            <Input
              type="search"
              placeholder="Search events by title, organizer, or place…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="size-5" />}
              className="h-14 text-base"
            />
          </form>
        </div>
      </section>

      {/* ─── Filters bar ──────────────────────────────────── */}
      <section className="sticky top-16 z-10 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="container-page flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
          <CategoryChips
            categories={categories}
            activeSlug={categorySlug}
            onSelect={handleCategoryChange}
            loading={loadingCategories}
          />
          <div className="shrink-0">
            <SortDropdown value={sort} onChange={handleSortChange} />
          </div>
        </div>
      </section>

      {/* ─── Events grid ──────────────────────────────────── */}
      <section className="container-page py-10">
        {/* Result count */}
        {events && !loading && (
          <p className="anim-fade-in mb-6 text-sm text-fg-tertiary">
            <span className="font-semibold text-fg nums">
              {events.totalElements}
            </span>{" "}
            event{events.totalElements !== 1 && "s"}
            {categorySlug && (
              <>
                {" "}in{" "}
                <span className="font-semibold text-fg">
                  {categories.find((c) => c.slug === categorySlug)?.name}
                </span>
              </>
            )}
            {search && (
              <>
                {" "}matching{" "}
                <span className="font-semibold text-fg">
                  &quot;{search}&quot;
                </span>
              </>
            )}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <EmptyState
            icon={<CalendarX className="size-7" />}
            title="Couldn't load events"
            description={error}
            action={
              <Button
                onClick={loadEvents}
                leftIcon={<RefreshCw className="size-4" />}
              >
                Try again
              </Button>
            }
          />
        )}

        {/* Empty */}
        {!loading && !error && events && events.content.length === 0 && (
          <EmptyState
            icon={<CalendarX className="size-7" />}
            title={
              search || categorySlug
                ? "No events match your filters"
                : "No events yet"
            }
            description={
              search || categorySlug
                ? "Try a different category or search term."
                : "Check back soon — new events are added every week."
            }
            action={
              (search || categorySlug) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setCategorySlug(null);
                    setPage(0);
                  }}
                >
                  Clear filters
                </Button>
              )
            }
          />
        )}

        {/* Grid */}
        {!loading && !error && events && events.content.length > 0 && (
          <>
            <div className="anim-fade-in grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.content.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  priority={i < 4}
                />
              ))}
            </div>

            <Pagination
              page={events.page}
              totalPages={events.totalPages}
              onChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}
      </section>
    </PublicShell>
  );
}
