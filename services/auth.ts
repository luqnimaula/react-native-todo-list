import { AuthLoginPayload, AuthLoginResponse } from "@/types/auth";
import api from "@/utils/api";

const expiresInMins = 120;

export const login = async (payload: AuthLoginPayload) => {
  try {
    const response = await api.post<AuthLoginResponse>("/auth/login", {
      ...payload,
      expiresInMins,
    });
    return response.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const response = await api.post("/auth/refresh", {
      refreshToken,
      expiresInMins,
    });
    return response.data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const fetchAuthProfile = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
