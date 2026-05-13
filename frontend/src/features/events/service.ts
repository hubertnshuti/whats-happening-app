import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type {
  EventDetail,
  EventListParams,
  EventSummary,
} from "./types";

export const eventService = {
  list: (params?: EventListParams) =>
    api.get<PageResponse<EventSummary>>("/events", params),

  bySlug: (slug: string) => api.get<EventDetail>(`/events/slug/${slug}`),

  byId: (id: string) => api.get<EventDetail>(`/events/${id}`),
};
