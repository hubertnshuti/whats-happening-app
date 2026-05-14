/**
 * Date helpers tuned for an events app.
 *
 * Backend sends ISO 8601 strings. We keep dates as strings on the wire and
 * only convert to Date at the formatting boundary.
 */

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;

/** "Sat, 14 Dec · 11:00 AM" */
export function formatEventDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

/** "Sat, 14 Dec" — date only */
export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** "11:00 AM" — time only */
export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** "DEC / 14" — for big calendar-tile date chips on cards */
export function formatDateChip(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
  };
}

/**
 * "in 3 hours" / "in 2 days" / "2 hours ago" / "Today" / "Tomorrow"
 *
 * Used for event card subtitles and notification timestamps.
 */
export function formatRelative(iso: string): string {
  const now = Date.now();
  const target = new Date(iso).getTime();
  const diff = target - now;
  const absDiff = Math.abs(diff);

  if (absDiff < MS_PER_MINUTE) {
    return diff >= 0 ? "Now" : "Just now";
  }
  if (absDiff < MS_PER_HOUR) {
    const mins = Math.round(absDiff / MS_PER_MINUTE);
    return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
  }
  if (absDiff < MS_PER_DAY) {
    const hrs = Math.round(absDiff / MS_PER_HOUR);
    return diff >= 0 ? `in ${hrs}h` : `${hrs}h ago`;
  }
  if (absDiff < 7 * MS_PER_DAY) {
    const days = Math.round(absDiff / MS_PER_DAY);
    if (days === 1) return diff >= 0 ? "Tomorrow" : "Yesterday";
    return diff >= 0 ? `in ${days} days` : `${days} days ago`;
  }
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Returns true if the date is today (local timezone). */
export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Returns true if the date is within the next 7 days. */
export function isThisWeek(iso: string): boolean {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const week = 7 * MS_PER_DAY;
  return target >= now && target - now <= week;
}

/** "1.2k" / "23k" / "1.5M" — compact number formatting for engagement counters. */
export function formatCount(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  const m = n / 1_000_000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
}