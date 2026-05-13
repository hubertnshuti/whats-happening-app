# API Contract — What's Happening

> Single source of truth for the backend API.
> Generated from real controller code on 2026-05-13.
> **Update this file whenever the backend changes.** Frontend services must match.

## Conventions

- **Base URL**: `http://localhost:8082/api/v1` (dev)
- **Response envelope** (every endpoint): `{ success, message, data, errors }`
- **Pagination wrapper**: `{ content, page, size, totalElements, totalPages, first, last }`
- **Auth**: `Authorization: Bearer <accessToken>` header for protected routes
- **Refresh**: `POST /auth/refresh-token { refreshToken }`
- **Path IDs** are UUIDs unless noted; slugs are URL-safe strings

---

## Auth — `/auth`

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{ fullName, email, password, phoneNumber? }` | `AuthResponse` |
| POST | `/auth/login` | — | `{ email, password }` | `AuthResponse` |
| POST | `/auth/refresh-token` | — | `{ refreshToken }` | `AuthResponse` |
| POST | `/auth/logout` | yes | `{ refreshToken }` | `void` |
| GET | `/auth/me` | yes | — | `UserResponse` |

**`AuthResponse`**: `{ user: UserResponse, accessToken, refreshToken }`

**`UserResponse`**: `{ id, fullName, email, phoneNumber?, accountStatus, emailVerified, roles: string[], createdAt }`
- `roles` is a **Set of strings** like `["USER"]` or `["USER","ORGANIZER"]`
- `accountStatus`: `"ACTIVE" | "SUSPENDED" | "BANNED"`

---

## Events — `/events`

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/events` | optional | query: `EventQueryParams` | `Page<EventSummary>` |
| GET | `/events/{id}` | optional | — | `EventResponse` |
| GET | `/events/slug/{slug}` | optional | — | `EventResponse` (increments view count) |
| POST | `/events` | yes | `CreateEventRequest` | `EventResponse` (DRAFT) |
| PATCH | `/events/{id}` | yes (organizer/admin) | `UpdateEventRequest` | `EventResponse` |
| POST | `/events/{id}/publish` | yes (organizer/admin) | — | `EventResponse` |
| POST | `/events/{id}/cancel` | yes (organizer/admin) | — | `EventResponse` |
| DELETE | `/events/{id}` | yes (organizer/admin) | — | `void` |

**`EventQueryParams`** (query string): `{ page, size, sort, status?, ...(other filters TBD) }`

**`EventSummary`** (list view): `{ id, title, slug, shortDescription, coverImageUrl, category: CategorySummary, locationName, startAt, endAt, status, viewCount, free }`

**`EventResponse`** (detail view): All of `EventSummary` plus:
- `description, address, city, district, country, latitude, longitude`
- `customLocationText, externalUrl, capacity, priceInfo`
- `organizer: UserResponse`
- `createdAt, updatedAt`

**`CreateEventRequest`**:
```json
{
  "title": "string (required)",
  "shortDescription": "string?",
  "description": "string?",
  "categoryId": "UUID (required)",
  "locationId": "UUID? (saved location)",
  "customLocationText": "string? (free text location — provide this OR locationId)",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime",
  "isFree": "boolean?",
  "priceInfo": "string?",
  "capacity": "number?",
  "coverImageUrl": "string?",
  "externalUrl": "string?"
}
```

**`UpdateEventRequest`**: same fields as `CreateEventRequest`, all optional.

**`EventStatus`** enum: `DRAFT | PUBLISHED | ONGOING | COMPLETED | CANCELLED`

---

## Engagement — saves, likes, reports

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/events/{id}/save` | yes | — | `ToggleResponse` |
| POST | `/events/{id}/like` | yes | — | `ToggleResponse` |
| POST | `/events/{id}/report` | yes | `{ reason }` | `void` |
| GET | `/me/saved-events` | yes | query: `page, size` | `Page<EventSummary>` |

**`ToggleResponse`**: `{ active: boolean, totalCount: number }`
- `active = true` means now saved/liked
- `active = false` means now removed
- `totalCount` is the total count (always 0 for save since save is private)

**Save & like are TOGGLES**: same endpoint, no separate DELETE.

---

## Categories — `/categories`

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/categories` | — | `CategoryResponse[]` (active only, sorted by name) |

**`CategoryResponse`**: `{ id, name, slug, description, icon, active }`

---

## Forums — `/events/{eventId}/forum` and `/forum`

> Forums are auto-created when an event is published. The organizer is auto-added as a member.

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/events/{eventId}/forum` | optional | — | `ForumResponse` |
| POST | `/events/{eventId}/forum/join` | yes | — | `ForumResponse` |
| POST | `/events/{eventId}/forum/leave` | yes | — | `void` |
| GET | `/events/{eventId}/forum/messages` | optional | query: `page, size` | `Page<MessageResponse>` |
| POST | `/events/{eventId}/forum/messages` | yes (member) | `CreateMessageRequest` | `MessageResponse` |
| DELETE | `/forum/messages/{messageId}` | yes (author/admin) | — | `void` |
| POST | `/forum/messages/{messageId}/reactions` | yes | `{ emoji }` | `Map<emoji, count>` |
| GET | `/events/{eventId}/forum/questions` | optional | query: `page, size` | `Page<QuestionResponse>` |
| POST | `/events/{eventId}/forum/questions` | yes (member) | `{ content }` | `QuestionResponse` |
| POST | `/forum/questions/{questionId}/answer` | yes (organizer/admin) | `{ content }` | `QuestionResponse` |

**`ForumResponse`**: `{ id, eventId, eventTitle, status, isMember, memberCount? }`
- `status`: `"ACTIVE" | "READ_ONLY" | "ARCHIVED" | "DISABLED"`

**`MessageResponse`**: `{ id, content, messageType, author: UserResponse, createdAt, reactions: Map<emoji, count> }`
- `messageType`: `"GENERAL" | "IMPORTANT" | "REMINDER" | "UPDATE" | "VENUE_CHANGE" | "TIME_CHANGE" | "CANCELLED" | "RESOURCE" | "POST_EVENT"`

**`CreateMessageRequest`**: `{ content, messageType?: ForumMessageType (default GENERAL) }`

**`QuestionResponse`**: `{ id, content, asker: UserResponse, answer?, answeredBy?: UserResponse, answeredAt?, createdAt }`

---

## Notifications — `/notifications`

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/notifications` | yes | `Page<NotificationResponse>` |
| GET | `/notifications/unread-count` | yes | `{ count: number }` |
| POST | `/notifications/{id}/read` | yes | `void` |
| POST | `/notifications/read-all` | yes | `void` |

**`NotificationResponse`**: `{ id, type, title, body, linkUrl?, relatedEventId?, read, readAt?, createdAt }`
- `type`: `EVENT_PUBLISHED | EVENT_REMINDER | EVENT_UPDATED | EVENT_CANCELLED | FORUM_MESSAGE | QUESTION_ANSWERED | ...`
- ⚠ **Field is `relatedEventId`**, NOT `eventId` or `eventSlug`.

---

## Media — `/media`

| Method | Path | Auth | Form fields | Returns |
|---|---|---|---|---|
| POST | `/media/upload` | yes | `file` (multipart), `purpose` (default `event-covers`) | `{ url }` |

**Allowed `purpose`**: `event-covers`, `event-gallery`, `user-avatars`

---

## Admin — `/admin` (role: ADMIN / MODERATOR / SUPER_ADMIN)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/admin/stats` | — | `StatsResponse` |
| GET | `/admin/users` | query: `page, size` | `Page<UserResponse>` |
| PATCH | `/admin/users/{id}/status` | `{ status }` | `UserResponse` |
| PUT | `/admin/users/{id}/roles` | `{ roles: string[] }` | `UserResponse` (ADMIN/SUPER only) |
| GET | `/admin/reports` | query: `page, size` | `Page<ReportResponse>` |
| POST | `/admin/reports/{id}/action` | `{ status, note? }` | `ReportResponse` |

**`StatsResponse`**: `{ totalUsers, activeUsers, totalEvents, publishedEvents, upcomingEvents, pendingReports }`

---

## ❌ Endpoints that DO NOT exist (don't call these)

- ~~`/events/mine`~~ — no endpoint for organizer's own events. Use `/events?organizerId=X` if `EventQueryParams` supports it; otherwise skip "My events" page.
- ~~`/events/saved`~~ — wrong path. Real path is `/me/saved-events`.
- ~~`/events/{id}/comments`~~ — no event comments. Only **forum messages** under `/events/{eventId}/forum/messages`.
- ~~`PUT /events/{id}`~~ — backend uses `PATCH /events/{id}`.
- ~~`DELETE /events/{id}/save`~~ — save is a toggle, just `POST` again.

---

## Security notes

- All `GET /events/**` routes are **public** (no auth required), per `SecurityConfig`.
- Protected routes require `Authorization: Bearer <token>`.
- 401 from a protected route triggers automatic refresh-token rotation on the frontend.

---

## Update protocol

When backend changes:
1. Owner of the change updates this file.
2. Paste the diff (or affected controller) into the frontend chat.
3. Frontend services updated to match in one commit.
