/**
 * Token storage.
 *
 * Uses localStorage so tokens survive refresh. Single source of truth —
 * never read tokens from localStorage directly anywhere else.
 */

const ACCESS_KEY = "wh.access";
const REFRESH_KEY = "wh.refresh";

export const tokenStorage = {
  getAccess(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },

  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },

  setTokens(access: string, refresh: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_KEY, access);
    window.localStorage.setItem(REFRESH_KEY, refresh);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};