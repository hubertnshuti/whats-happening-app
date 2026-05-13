import { api } from "@/lib/api";
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "./types";

export const authService = {
  login: (body: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", body),

  register: (body: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", body),

  me: () => api.get<AuthUser>("/auth/me"),

  logout: () => api.post<void>("/auth/logout"),
};
