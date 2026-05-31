import toast from "react-hot-toast";

export type AppError = {
  message: string;
  code?: string;
  status?: number;
};

export const parseAuthError = (error: any): string => {
  if (!error) return "An unexpected error occurred. Please try again.";

  // Log for debugging
  console.error("Auth Error Object:", error);

  // Handle network/connection errors
  if (typeof window !== "undefined" && !navigator.onLine) {
    return "Check your internet connection and try again.";
  }

  const msg = error.message?.toLowerCase() || "";

  // Supabase specific error messages mapping
  if (msg.includes("invalid login credentials") || msg.includes("invalid_grant")) {
    return "Invalid email, phone, or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email address before logging in.";
  }
  if (msg.includes("invalid otp") || msg.includes("token expired")) {
    return "The code entered is incorrect or has expired.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit")) {
    return "Too many attempts. Please try again later.";
  }
  if (msg.includes("phone number")) {
    return "Please enter a valid phone number.";
  }
  if (msg.includes("user not found")) {
    return "User account not found. Please register first.";
  }
  if (msg.includes("session expired")) {
    return "Your session has expired. Please sign in again.";
  }

  // Fallback for technical errors
  if (error.code || error.status) {
    return "Something went wrong on our end. Please try again.";
  }

  return "An unexpected error occurred. Please try again.";
};

export const handleAuthError = (error: any, setFormError?: (msg: string) => void) => {
  const friendlyMessage = parseAuthError(error);
  
  if (setFormError) {
    setFormError(friendlyMessage);
  }
  
  toast.error(friendlyMessage, {
    id: "auth-error", // Prevents duplicate toasts
    duration: 4000,
  });
};
