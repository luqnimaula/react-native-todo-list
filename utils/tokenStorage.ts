import { AuthTokens } from "@/types/auth";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

// SecureStore can reject (e.g. unsupported platform), so reads never throw
const readItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

export const getAccessToken = () => readItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => readItem(REFRESH_TOKEN_KEY);

export const saveTokens = async ({ accessToken, refreshToken }: AuthTokens) => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
};

export const clearTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
};
