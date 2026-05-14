export type ForumStatus = 'ACTIVE' | 'READ_ONLY' | 'ARCHIVED' | 'DISABLED';
export type MessageType = 'GENERAL' | 'IMPORTANT' | 'REMINDER' | 'UPDATE' | 'VENUE_CHANGE' | 'TIME_CHANGE' | 'CANCELLED' | 'RESOURCE' | 'POST_EVENT';

export interface ForumResponse {
  id: string;
  eventId: string;
  eventTitle: string;
  status: ForumStatus;
  member: boolean;      // Jackson strips "is" prefix: isMember -> "member"
  organizer: boolean;   // Jackson strips "is" prefix: isOrganizer -> "organizer"
  memberCount?: number;
}

export interface MessageResponse {
  id: string;
  content: string;
  messageType: MessageType;
  authorId: string;
  authorName: string;
  pinned: boolean;
  createdAt: string;
  reactions: Record<string, number>;
}

export interface QuestionResponse {
  id: string;
  question: string;
  askerName: string;
  answer?: string;
  answeredByName?: string;
  answeredAt?: string;
  status: string;
  createdAt: string;
}