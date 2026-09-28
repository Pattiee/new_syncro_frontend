import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL || "";

// Interfaces for service method parameters
interface RegisterParams {
  username: string;
}

// ==========================================================
// Explicit Structural Type Contracts For Authentication Payloads
// ==========================================================

export interface LoginRequest {
  username?: string;
  email?: string;
  password?: string;
  [key: string]: unknown;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password?: string;
  givenName?: string;
  familyName?: string;
  [key: string]: unknown; // Secure fallback mapping for dynamic parameters
}



interface ResetPasswordPayload {
  token?: string;
  password?: string;
  [key: string]: unknown; // Dynamic properties fallback
}

export const isEmailRegistered = async (reqBody: unknown) =>
  await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/check-email`,
    reqBody
  );

export const sendPasswordResetOtp = async (requestBody: unknown): Promise<void> => {
  // Implementation placeholder
};

// Register new user
export const register = async ({ username = "" }: RegisterParams) => {
  if (!username) {
    return Promise.reject(new Error("Bad details: Username is required"));
  }

  const data: Record<string, string> = {
    username: username
  };

  return await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/register`,
    data
  );
};

// Verify registration-otp
export const verifyEmail = async (otpData: string | number) => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/verify`,
      { otp: otpData }
    );
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
};

// Create password
export const createPassword = async (reqBody: unknown) => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/create-passwd`,
      reqBody,
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Password creation failed:", error);
    throw error;
  }
};

// Resend registration otp
export const resendRegistrationOtp = async (username: string) => {
  try {
    if (!username || !Validator.isEmailValid(username)) {
      return Promise.reject(new Error("Invalid email"));
    }
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/resend-otp`,
      { username }
    );
  } catch (error) {
    console.error("Failed to resend OTP:", error);
    throw error;
  }
};

export const login = async (loginRequest: unknown) =>
  await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/login`,
    loginRequest
  );

export const logoutBackendApi = async () => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/logout`
    );
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Get CurrentAccount
export const getCurrentAccount = async () => {
  try {
    return await AxiosConfig.authAxiosInstance.get(
      `${AUTH_SERVICE_BASE_URL}/me`
    );
  } catch (error) {
    console.error("Failed to fetch current account:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log("Password reset requested for:", email);
        resolve({ message: "Reset email sent" });
      }, 1200)
    );
  } catch (error) {
    console.error("Password reset request failed:", error);
    throw error;
  }
};

export const resetPasswordApi = async (payload: ResetPasswordPayload): Promise<void> => {
  try {
    console.log("Reset password API,", payload);
  } catch (error) {
    console.error("Reset password execution failed:", error);
    throw error;
  }
};