import { create } from "zustand";
import { tokenStorage } from "@/lib/tokenStorage";
import { api } from "@/lib/api";
import type { AuthUser, LoginRequest, RegisterRequest, AuthResponse } from "@/features/auth/types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isHydrated: false,

  async login(body) {
    set({ isLoading: true });
    try {
      const res = await api.post<AuthResponse>("/auth/login", body);
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  async register(body) {
    set({ isLoading: true });
    try {
      const res = await api.post<AuthResponse>("/auth/register", body);
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    const refreshToken = tokenStorage.getRefresh();
    try {
      // Backend requires the refresh token in the body
      if (refreshToken) {
        await api.post<void>("/auth/logout", { refreshToken });
      }
    } catch { /* ignore — clear locally anyway */ }
    tokenStorage.clear();
    set({ user: null });
  },

  async hydrate() {
    if (!tokenStorage.getAccess()) {
      set({ isHydrated: true });
      return;
    }
    try {
      const user = await api.get<AuthUser>("/auth/me");
      set({ user, isHydrated: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },
}));
