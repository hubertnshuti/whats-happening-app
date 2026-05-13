import { api } from "@/lib/api";

export interface ToggleResponse {
  active: boolean;
  totalCount: number;
}

export const engagementService = {
  /** Toggles save. Returns {active: true} when now saved, false when removed. */
  toggleSave: (eventId: string) =>
    api.post<ToggleResponse>(`/events/${eventId}/save`),

  /** Toggles like. */
  toggleLike: (eventId: string) =>
    api.post<ToggleResponse>(`/events/${eventId}/like`),

  report: (eventId: string, reason: string) =>
    api.post<void>(`/events/${eventId}/report`, { reason }),
};
