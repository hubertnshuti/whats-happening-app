import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type {
  EventDetail,
  EventListParams,
  EventSummary,
} from "./types";

export interface CreateEventBody {
  title: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  locationName?: string;
  address?: string;
  city?: string;
  startAt: string;
  endAt: string;
  isOnline?: boolean;
  onlineLink?: string;
  free?: boolean;
  maxAttendees?: number;
  coverImageUrl?: string;
  tags?: string[];
}

export const eventService = {
  list: (params?: EventListParams) =>
    api.get<PageResponse<EventSummary>>("/events", params),

  bySlug: (slug: string) => api.get<EventDetail>(`/events/slug/${slug}`),

  byId: (id: string) => api.get<EventDetail>(`/events/${id}`),

  create: (body: CreateEventBody) =>
    api.post<EventDetail>("/events", body),

  update: (id: string, body: Partial<CreateEventBody>) =>
    api.put<EventDetail>(`/events/${id}`, body),

  delete: (id: string) => api.delete<void>(`/events/${id}`),

  myEvents: (params?: { page?: number; size?: number }) =>
    api.get<PageResponse<EventSummary>>("/events/mine", params),

  savedEvents: (params?: { page?: number; size?: number }) =>
    api.get<PageResponse<EventSummary>>("/events/saved", params),
};
