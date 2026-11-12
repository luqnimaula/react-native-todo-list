import { create } from "axios";

const api = create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // centralized error handling
    return Promise.reject(error);
  },
);

export default api;
