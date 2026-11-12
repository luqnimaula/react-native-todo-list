import {
  AuthLoginPayload,
  AuthLoginResponse,
  AuthTokens,
  AuthUser,
} from "@/types/auth";
import api from "@/utils/api";
import { getRefreshToken, saveTokens } from "@/utils/tokenStorage";

const expiresInMins = 120;

export const login = async (payload: AuthLoginPayload) => {
  const response = await api.post<AuthLoginResponse>("/auth/login", {
    ...payload,
    expiresInMins,
  });
  return response.data;
};

export const refreshAuthToken = async (refreshToken: string) => {
  const response = await api.post<AuthTokens>("/auth/refresh", {
    refreshToken,
    expiresInMins,
  });
  return response.data;
};

export const fetchAuthProfile = async () => {
  const response = await api.get<AuthUser>("/auth/me");
  return response.data;
};

/** Refreshes the session with the stored refresh token and saves the new tokens. */
export const refreshSession = async () => {
  const storedRefreshToken = await getRefreshToken();
  if (!storedRefreshToken) {
    throw new Error("No refresh token stored");
  }

  const tokens = await refreshAuthToken(storedRefreshToken);
  await saveTokens(tokens);
  return tokens.accessToken;
};
