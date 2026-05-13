import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "./tokenStorage";
import { ApiException } from "./ApiException";
import type { ApiResponse } from "@/types/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

/* Attach access token to every request */
axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Refresh-token rotation: shared single promise so concurrent 401s share it */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) throw new Error("No refresh token");

  const { data } = await axios.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >(
    `${env.API_URL}/auth/refresh-token`,
    { refreshToken: refresh },
    { headers: { "Content-Type": "application/json" } },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message || "Refresh failed");
  }
  tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.accessToken;
}

/* Response interceptor: refresh on 401, unwrap envelope errors */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    if (!error.response) {
      return Promise.reject(
        new ApiException("Network error. Please check your connection.", 0, []),
      );
    }

    const { status, data } = error.response;

    if (
      status === 401 &&
      !original._retried &&
      !original.url?.includes("/auth/")
    ) {
      original._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        if (original.headers) {
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(original);
      } catch {
        tokenStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(
          new ApiException("Session expired. Please log in again.", 401, []),
        );
      }
    }

    const message = data?.message ?? error.message ?? "Request failed";
    const fieldErrors = data?.errors ?? [];
    return Promise.reject(new ApiException(message, status, fieldErrors));
  },
);

/* Typed helpers — feature code calls these, not axios directly */
async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await p;
  if (!data.success) {
    throw new ApiException(data.message, 0, data.errors ?? []);
  }
  return data.data as T;
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    unwrap<T>(axiosInstance.get(url, { params })),

  post: <T>(url: string, body?: unknown) =>
    unwrap<T>(axiosInstance.post(url, body)),

  put: <T>(url: string, body?: unknown) =>
    unwrap<T>(axiosInstance.put(url, body)),

  patch: <T>(url: string, body?: unknown) =>
    unwrap<T>(axiosInstance.patch(url, body)),

  delete: <T = void>(url: string) => unwrap<T>(axiosInstance.delete(url)),

  upload: <T>(url: string, formData: FormData) =>
    unwrap<T>(
      axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    ),
};

export { axiosInstance };

export default axiosInstance;