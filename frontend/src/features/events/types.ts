import type { EventStatus, EventVisibility, PriceType, UserSummary } from "@/types/domain";

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
}

/** Event LIST response (lighter, flat fields) */
export interface EventSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  coverImageUrl?: string | null;
  category?: CategorySummary;
  locationName?: string | null;
  startAt: string;
  endAt?: string | null;
  status: EventStatus;
  viewCount?: number;
  free?: boolean;
}

/** Event DETAIL response (heavier, includes organizer/forum/etc) */
export interface EventDetail extends EventSummary {
  description?: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isOnline?: boolean;
  onlineLink?: string | null;
  visibility?: EventVisibility;
  priceType?: PriceType;
  maxAttendees?: number | null;
  tags?: string[];
  organizer?: UserSummary;
  savesCount?: number;
  likesCount?: number;
  commentsCount?: number;
  isSaved?: boolean;
  isLiked?: boolean;
  hasForum?: boolean;
  forumId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type EventSort = "upcoming" | "newest" | "popular" | "most-saved";

export interface EventListParams extends Record<string, unknown> {
  page?: number;
  size?: number;
  sort?: EventSort;
  category?: string;
  city?: string;
  date?: "today" | "this-week" | "this-month";
  search?: string;
  status?: EventStatus;
}
