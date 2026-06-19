import { isAxiosError } from "axios";

export const getError = (error: unknown) => {
  if (isAxiosError(error)) {
    return {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    };
  } else {
    console.error("Unexpected Error:", error);
  }

  throw error;
};
