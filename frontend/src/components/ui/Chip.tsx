import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ChipVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  active?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<ChipVariant, string> = {
  default: "bg-surface-2 text-fg-secondary border border-line",
  brand: "bg-brand-soft text-brand border border-transparent",
  success: "bg-success-soft text-success border border-transparent",
  warning: "bg-warning-soft text-warning border border-transparent",
  danger: "bg-danger-soft text-danger border border-transparent",
  info: "bg-info-soft text-info border border-transparent",
  outline: "bg-transparent text-fg-secondary border border-line",
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant = "default", active, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold whitespace-nowrap transition",
          active ? "bg-brand text-fg-on-brand border-transparent" : variants[variant],
          className,
        )}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </span>
    );
  },
);
Chip.displayName = "Chip";
