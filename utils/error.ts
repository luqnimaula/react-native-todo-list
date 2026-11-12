import { AppError } from "@/types/error";
import { isAxiosError } from "axios";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

// DummyJSON returns errors as `{ message: string }`
const getResponseMessage = (data: unknown): string | undefined => {
  if (typeof data === "object" && data !== null && "message" in data) {
    const { message } = data;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return undefined;
};

/**
 * Normalizes any thrown value into an AppError.
 * Never throws, so callers can safely use it inside `catch` blocks.
 */
export const getError = (error: unknown): AppError => {
  if (isAxiosError(error)) {
    return {
      message:
        getResponseMessage(error.response?.data) ??
        error.message ??
        DEFAULT_MESSAGE,
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message || DEFAULT_MESSAGE };
  }

  return { message: DEFAULT_MESSAGE };
};
