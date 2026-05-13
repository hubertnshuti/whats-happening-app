/**
 * Centralized route paths.
 *
 * Never hard-code routes in components — always import from here.
 * If a route changes, this file is the only edit.
 */

export const routes = {
  // Public
  home: "/",
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
  eventForum: (slug: string) => `/events/${slug}/forum`,
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  search: "/search",
  login: "/login",
  register: "/register",

  // Authenticated user
  profile: "/profile",
  profileEdit: "/profile/edit",
  savedEvents: "/saved-events",
  myEvents: "/organizer/events",
  createEvent: "/create-event",
  notifications: "/notifications",
  settings: "/settings",

  // Organizer
  organizer: {
    dashboard: "/organizer/dashboard",
    events: "/organizer/events",
    editEvent: (id: string) => `/organizer/events/${id}/edit`,
    eventForum: (id: string) => `/organizer/events/${id}/forum`,
    eventQuestions: (id: string) => `/organizer/events/${id}/questions`,
  },

  // Admin
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    events: "/admin/events",
    categories: "/admin/categories",
    reports: "/admin/reports",
    moderation: "/admin/moderation",
    activityLogs: "/admin/activity-logs",
  },
} as const;
