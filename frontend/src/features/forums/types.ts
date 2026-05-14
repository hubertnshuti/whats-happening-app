import { UserResponse } from '@/types/domain'; // Adjust import path if needed based on your project

export type ForumStatus = 'ACTIVE' | 'READ_ONLY' | 'ARCHIVED' | 'DISABLED';
export type MessageType = 'GENERAL' | 'IMPORTANT' | 'REMINDER' | 'UPDATE' | 'VENUE_CHANGE' | 'TIME_CHANGE' | 'CANCELLED' | 'RESOURCE' | 'POST_EVENT';

export interface ForumResponse {
  id: string;
  eventId: string;
  eventTitle: string;
  status: ForumStatus;
  isMember: boolean;
  memberCount?: number;
}

export interface MessageResponse {
  id: string;
  content: string;
  messageType: MessageType;
  author: UserResponse; 
  createdAt: string;
  reactions: Record<string, number>;
}

export interface QuestionResponse {
  id: string;
  content: string;
  asker: UserResponse;
  answer?: string;
  answeredBy?: UserResponse;
  answeredAt?: string;
  createdAt: string;
}