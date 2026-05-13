"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizes: Record<AvatarSize, { box: string; text: string; px: number }> = {
  xs: { box: "size-6", text: "text-[10px]", px: 24 },
  sm: { box: "size-8", text: "text-xs", px: 32 },
  md: { box: "size-10", text: "text-sm", px: 40 },
  lg: { box: "size-14", text: "text-base", px: 56 },
  xl: { box: "size-20", text: "text-xl", px: 80 },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const config = sizes[size];
  const initials = getInitials(name);

  if (!src || errored) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand",
          config.box,
          config.text,
          className,
        )}
        aria-label={name}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-surface-2",
        config.box,
        className,
      )}
    >
      <Image
        src={src}
        alt={name}
        width={config.px}
        height={config.px}
        className="size-full object-cover"
        onError={() => setErrored(true)}
        unoptimized
      />
    </span>
  );
}
