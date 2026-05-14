import type { Role, AccountStatus } from "@/types/domain";

/* ── Request payloads ────────────────────────────────────────────────────── */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

/* ── Response shapes ─────────────────────────────────────────────────────── */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  username?: string;
  email: string;
  roles: Role[];
  /** Backend sends accountStatus — map defensively with (user as any).accountStatus ?? user.status */
  status?: AccountStatus;
  emailVerified: boolean;
  profileImageUrl?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
