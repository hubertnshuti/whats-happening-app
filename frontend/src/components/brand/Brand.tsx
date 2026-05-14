import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/config/routes";

interface BrandProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: "size-7", icon: "size-4", text: "text-base" },
  md: { box: "size-9", icon: "size-5", text: "text-lg" },
  lg: { box: "size-11", icon: "size-6", text: "text-xl" },
};

export function Brand({ size = "md", showText = true, className }: BrandProps) {
  const s = sizes[size];
  return (
    <Link
      href={routes.home}
      className={cn(
        "inline-flex items-center gap-2 font-display font-bold tracking-tight",
        s.text,
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm",
          s.box,
        )}
      >
        <Sparkles className={s.icon} strokeWidth={2.5} />
      </span>
      {showText && (
        <span className="hidden sm:inline">
          What&apos;s <span className="text-gradient-brand">Happening</span>
        </span>
      )}
    </Link>
  );
}
