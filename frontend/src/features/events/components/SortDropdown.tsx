"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, ArrowUpDown } from "lucide-react";
import type { EventSort } from "@/features/events/types";
import { cn } from "@/lib/cn";

const options: { value: EventSort; label: string }[] = [
  { value: "upcoming", label: "Upcoming soon" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "most-saved", label: "Most saved" },
];

interface SortDropdownProps {
  value: EventSort;
  onChange: (value: EventSort) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium text-fg-secondary transition hover:bg-surface-2 hover:text-fg"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <ArrowUpDown className="size-4 text-fg-muted" />
        <span className="hidden sm:inline">Sort:</span>
        <span className="text-fg">{current.label}</span>
        <ChevronDown
          className={cn(
            "size-4 text-fg-muted transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="anim-scale-in absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-lg"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition",
                o.value === value
                  ? "bg-brand-soft text-brand"
                  : "text-fg-secondary hover:bg-surface-2 hover:text-fg",
              )}
            >
              {o.label}
              {o.value === value && <Check className="size-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
