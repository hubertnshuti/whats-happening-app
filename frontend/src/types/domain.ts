/**
 * Domain enums and shared types.
 *
 * These mirror the backend Java enums exactly. If backend renames a value
 * (e.g. PUBLISHED → LIVE) update both at the same time.
 */

// ── Roles ────────────────────────────────────────────────────────────────────
export type Role =
  | "USER"
  | "ORGANIZER"
  | "MODERATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

export const ROLE_LABELS: Record<Role, string> = {
  USER: "User",
  ORGANIZER: "Organizer",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

// ── Account status ───────────────────────────────────────────────────────────
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED";

// ── Event status ─────────────────────────────────────────────────────────────
export type EventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "CANCELLED"
  | "COMPLETED"
  | "REJECTED"
  | "ARCHIVED";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending review",
  PUBLISHED: "Published",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

export type EventVisibility = "PUBLIC" | "UNLISTED" | "PRIVATE";

export type PriceType = "FREE" | "PAID" | "DONATION";

// ── Forum ────────────────────────────────────────────────────────────────────
export type ForumMode = "ANNOUNCEMENT_ONLY" | "DISCUSSION";

export type ForumStatus = "ACTIVE" | "READ_ONLY" | "ARCHIVED" | "DISABLED";

export type ForumMemberRole = "ADMIN" | "MODERATOR" | "MEMBER";

export type ForumMessageType =
  | "GENERAL"
  | "IMPORTANT"
  | "REMINDER"
  | "UPDATE"
  | "VENUE_CHANGE"
  | "TIME_CHANGE"
  | "CANCELLED"
  | "RESOURCE"
  | "POST_EVENT";

export const FORUM_MESSAGE_TYPE_LABELS: Record<ForumMessageType, string> = {
  GENERAL: "General",
  IMPORTANT: "Important",
  REMINDER: "Reminder",
  UPDATE: "Update",
  VENUE_CHANGE: "Venue change",
  TIME_CHANGE: "Time change",
  CANCELLED: "Cancelled",
  RESOURCE: "Resource",
  POST_EVENT: "Post-event",
};

// ── Comment status ───────────────────────────────────────────────────────────
export type CommentStatus = "VISIBLE" | "HIDDEN" | "DELETED" | "REPORTED";

// ── Notification ─────────────────────────────────────────────────────────────
export type NotificationType =
  | "EVENT_PUBLISHED"
  | "EVENT_REMINDER"
  | "EVENT_UPDATED"
  | "EVENT_CANCELLED"
  | "FORUM_MESSAGE"
  | "FORUM_QUESTION_ANSWERED";

// ── Reaction ─────────────────────────────────────────────────────────────────
export type ReactionType = "LIKE" | "LOVE" | "FIRE" | "CLAP" | "WOW";

// ── Report ───────────────────────────────────────────────────────────────────
export type ReportTargetType = "EVENT" | "COMMENT" | "USER" | "FORUM_MESSAGE";
export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED" | "ESCALATED";

// ── Reusable subshapes that appear in many responses ────────────────────────
export interface UserSummary {
  id: string;
  username: string;
  fullName: string;
  profileImageUrl: string | null;
  role: Role;
}
