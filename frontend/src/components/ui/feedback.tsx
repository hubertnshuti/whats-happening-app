import { type HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/* ── Skeleton ─────────────────────────────────────────────────────── */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-3",
        className,
      )}
      {...props}
    />
  );
}

/* ── Spinner ──────────────────────────────────────────────────────── */
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-fg-muted",
        spinnerSizes[size],
        className,
      )}
    />
  );
}

/* ── EmptyState ───────────────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          {icon}
        </span>
      )}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-fg-tertiary">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
