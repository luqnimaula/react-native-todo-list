import { getAccessToken } from "@/utils/tokenStorage";
import { create, isAxiosError } from "axios";

/**
 * Auth behaviour is injected by the AuthProvider instead of imported here,
 * which keeps this module free of a circular import with services/auth.
 */
export type AuthHandlers = {
  /** Gets new tokens, saves them, and resolves with the new access token. */
  refreshAccessToken: () => Promise<string>;
  /** Called when the session can't be recovered (refresh failed). */
  onAuthFailure: () => void;
};

// Auth endpoints must not trigger a refresh (a failing refresh would loop)
const SKIP_REFRESH_URLS = ["/auth/login", "/auth/refresh"];

let authHandlers: AuthHandlers | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAuthHandlers = (handlers: AuthHandlers | null) => {
  authHandlers = handlers;
};

/** Concurrent 401s all await the same refresh call instead of starting their own. */
const refreshOnce = (refresh: () => Promise<string>) => {
  if (!refreshPromise) {
    refreshPromise = refresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const api = create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    const request = error.config;
    const handlers = authHandlers;
    const canRefresh =
      request &&
      handlers &&
      !request._retry &&
      !SKIP_REFRESH_URLS.includes(request.url ?? "");

    if (!canRefresh) {
      throw error;
    }

    request._retry = true;
    try {
      await refreshOnce(handlers.refreshAccessToken);
    } catch {
      handlers.onAuthFailure();
      throw error;
    }

    // Replay the original request; the request interceptor attaches the new token
    return api(request);
  },
);

export default api;
