"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number; // 0-indexed (backend)
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const current = page + 1; // display as 1-indexed
  const pages = buildPageList(current, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <PageButton
        disabled={current === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </PageButton>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="px-2 text-sm text-fg-muted"
          >
            …
          </span>
        ) : (
          <PageButton
            key={p}
            active={p === current}
            onClick={() => onChange(p - 1)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        disabled={current === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </PageButton>
    </nav>
  );
}

function PageButton({
  active,
  disabled,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-semibold transition",
        active
          ? "bg-brand text-fg-on-brand shadow-sm"
          : "text-fg-secondary hover:bg-surface-2 hover:text-fg",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Build pagination list with ellipsis: [1, "…", 4, 5, 6, "…", 20] */
function buildPageList(
  current: number,
  total: number,
): (number | "…")[] {
  const delta = 1; // pages on each side of current
  const range: (number | "…")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  if (total > 1) range.push(total);

  return range;
}
