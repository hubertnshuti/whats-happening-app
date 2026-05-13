"use client";

import { Sparkles } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/feedback";
import type { CategorySummary } from "@/features/events/types";

interface CategoryChipsProps {
  categories: CategorySummary[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  loading?: boolean;
}

export function CategoryChips({
  categories,
  activeSlug,
  onSelect,
  loading,
}: CategoryChipsProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-pill" />
        ))}
      </div>
    );
  }

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="shrink-0"
      >
        <Chip
          active={activeSlug === null}
          leftIcon={<Sparkles className="size-3.5" />}
          className="h-9 px-4 cursor-pointer"
        >
          All
        </Chip>
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.slug)}
          className="shrink-0"
        >
          <Chip
            active={activeSlug === c.slug}
            className="h-9 px-4 cursor-pointer"
          >
            {c.name}
          </Chip>
        </button>
      ))}
    </div>
  );
}
