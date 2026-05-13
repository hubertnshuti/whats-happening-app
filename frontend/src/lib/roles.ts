import type { AuthUser } from "@/features/auth/types";

export function hasRole(user: AuthUser | null, role: string): boolean {
  if (!user) return false;
  const roles: string[] = user.roles ?? [];
  return Array.isArray(roles) && roles.includes(role);
}

export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, "ADMIN") || hasRole(user, "SUPER_ADMIN");
}

export function isOrganizerOrAbove(user: AuthUser | null): boolean {
  return isAdmin(user) || hasRole(user, "ORGANIZER") || hasRole(user, "MODERATOR");
}
