import { api } from '@/lib/api';
import type { PageResponse } from '@/types/api';
import type { ForumResponse, MessageResponse, QuestionResponse, MessageType } from './types';

export const forumService = {
  getForum: (eventId: string) =>
    api.get<ForumResponse>(`/events/${eventId}/forum`),

  joinForum: (eventId: string) =>
    api.post<ForumResponse>(`/events/${eventId}/forum/join`),

  leaveForum: (eventId: string) =>
    api.post<void>(`/events/${eventId}/forum/leave`),

  getMessages: (eventId: string, page = 0, size = 50) =>
    api.get<PageResponse<MessageResponse>>(`/events/${eventId}/forum/messages`, { page, size }),

  postMessage: (eventId: string, content: string, messageType: MessageType = 'GENERAL') =>
    api.post<MessageResponse>(`/events/${eventId}/forum/messages`, { content, messageType }),

  deleteMessage: (messageId: string) =>
    api.delete<void>(`/forum/messages/${messageId}`),

  reactToMessage: (messageId: string, emoji: string) =>
    api.post<Record<string, number>>(`/forum/messages/${messageId}/reactions`, { emoji }),

  getQuestions: (eventId: string, page = 0, size = 50) =>
    api.get<PageResponse<QuestionResponse>>(`/events/${eventId}/forum/questions`, { page, size }),

  askQuestion: (eventId: string, question: string) =>
    api.post<QuestionResponse>(`/events/${eventId}/forum/questions`, { question }),

  answerQuestion: (questionId: string, answer: string) =>
    api.post<QuestionResponse>(`/forum/questions/${questionId}/answer`, { answer }),
};