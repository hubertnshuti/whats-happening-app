import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * Example:
 *   cn("px-2 py-1", isLarge && "px-4 py-2") // "px-4 py-2" wins
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
