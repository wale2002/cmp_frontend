import { toast } from "sonner";
import { ApiError } from "../lib/api-client";

export const handleApiError = (
  error: unknown,
  fallbackMessage = "An error occurred"
) => {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    toast.error(error.message);
    return error.message;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return error.message;
  }

  toast.error(fallbackMessage);
  return fallbackMessage;
};

export const handleNetworkError = () => {
  toast.error("Network error. Please check your connection and try again.");
};

export const handleUnauthorizedError = () => {
  toast.error("Your session has expired. Please log in again.");
  // Clear stored auth data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Redirect to login
  window.location.href = "/login";
};
