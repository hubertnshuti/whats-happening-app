import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type { NotificationType } from "@/types/domain";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string | null;
  link?: string | null;
  read: boolean;
  createdAt: string;
  eventId?: string | null;
  eventSlug?: string | null;
}

export const notificationService = {
  list: (params?: { page?: number; size?: number; read?: boolean }) =>
    api.get<PageResponse<Notification>>("/notifications", params),

  unreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),

  markRead: (id: string) => api.post<void>(`/notifications/${id}/read`),

  markAllRead: () => api.post<void>("/notifications/read-all"),

  delete: (id: string) => api.delete<void>(`/notifications/${id}`),
};
