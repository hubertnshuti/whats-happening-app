import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type { EventDetail, EventListParams, EventSummary } from "./types";

/** Matches backend CreateEventRequest DTO exactly */
export interface CreateEventBody {
  title: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  locationId?: string;        // UUID of a saved Location (optional)
  customLocationText?: string; // OR free-text location
  startAt: string;             // ISO datetime
  endAt: string;
  isFree?: boolean;
  priceInfo?: string;
  capacity?: number;
  coverImageUrl?: string;
  externalUrl?: string;
}

function mapSort(sort?: string): string {
  switch (sort) {
    case "newest":    return "createdAt,desc";
    case "popular":   return "viewCount,desc";
    case "most-saved":return "viewCount,desc";
    default:          return "startAt,asc"; // "upcoming"
  }
}

export const eventService = {
  list: (params?: EventListParams) => {
    const { search, category, sort, status, ...rest } = params ?? {};
    return api.get<PageResponse<EventSummary>>("/events", {
      ...rest,
      ...(search ? { q: search } : {}),
      ...(category ? { categorySlug: category } : {}),
      sort: mapSort(sort),
    });
  },

  bySlug: (slug: string) => api.get<EventDetail>(`/events/slug/${slug}`),

  byId: (id: string) => api.get<EventDetail>(`/events/${id}`),

  create: (body: CreateEventBody) =>
    api.post<EventDetail>("/events", body),

  /** Backend uses PATCH, not PUT */
  update: (id: string, body: Partial<CreateEventBody>) =>
    api.patch<EventDetail>(`/events/${id}`, body),

  publish: (id: string) => api.post<EventDetail>(`/events/${id}/publish`),
  cancel: (id: string) => api.post<EventDetail>(`/events/${id}/cancel`),
  delete: (id: string) => api.delete<void>(`/events/${id}`),

  /** Real endpoint: GET /api/v1/me/saved-events */
  savedEvents: (params?: { page?: number; size?: number }) =>
    api.get<PageResponse<EventSummary>>("/me/saved-events", params),
};
