import { api } from "@/lib/api";
import type { PageResponse } from "@/types/api";
import type { CommentStatus, UserSummary } from "@/types/domain";

export interface Comment {
  id: string;
  content: string;
  status?: CommentStatus;
  createdAt: string;
  updatedAt?: string;
  author?: UserSummary;
  user?: UserSummary;
}

export const commentService = {
  list: (eventId: string, page = 0, size = 20) =>
    api.get<PageResponse<Comment>>(`/events/${eventId}/comments`, { page, size }),

  create: (eventId: string, content: string) =>
    api.post<Comment>(`/events/${eventId}/comments`, { content }),

  delete: (commentId: string) => api.delete<void>(`/comments/${commentId}`),

  report: (commentId: string, reason: string) =>
    api.post<void>(`/comments/${commentId}/report`, { reason }),
};
