import { create } from "zustand";
import { tokenStorage } from "@/lib/tokenStorage";
import { authService } from "@/features/auth/service";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types";

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
      const res = await authService.login(body);
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  async register(body) {
    set({ isLoading: true });
    try {
      const res = await authService.register(body);
      tokenStorage.setTokens(res.accessToken, res.refreshToken);
      set({ user: res.user });
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    try {
      await authService.logout();
    } catch {
      /* ignore — clear locally anyway */
    }
    tokenStorage.clear();
    set({ user: null });
  },

  /**
   * Called once on app startup. If a token exists, fetch /auth/me to
   * confirm it's still valid and load the user. If anything fails, clear.
   */
  async hydrate() {
    if (!tokenStorage.getAccess()) {
      set({ isHydrated: true });
      return;
    }
    try {
      const user = await authService.me();
      set({ user, isHydrated: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },
}));
