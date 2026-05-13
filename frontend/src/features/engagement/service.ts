import { api } from "@/lib/api";

export const engagementService = {
  save:   (eventId: string) => api.post<void>(`/events/${eventId}/save`),
  unsave: (eventId: string) => api.delete<void>(`/events/${eventId}/save`),
  like:   (eventId: string) => api.post<void>(`/events/${eventId}/like`),
  unlike: (eventId: string) => api.delete<void>(`/events/${eventId}/like`),
  share:  (eventId: string) => api.post<void>(`/events/${eventId}/share`),
};
