import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL;

export const isEmailRegistered = async (reqBody) =>
  await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/check-email`,
    reqBody
  );

export const sendPasswordResetOtp = async (requestBody) => {};

// Register new user
export const register = async ({ username = "" }) => {
  if (!username) return null;

  // if (!Validator.isPasswordValid(password)) throw new Error("Invalid password");

  const data = {};

  if (!username) return Promise.reject("Bad details");
  data.username = username;
  // data.password = password;

  return await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/register`,
    data
  );
};

// Verify registration-otp
export const verifyEmail = async (otpData) => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/verify`,
      { otp: otpData }
    );
  } catch (error) {}
};

// Create password
export const createPassword = async (reqBody) => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/create-passwd`,
      reqBody,
      { withCredentials: true }
    );
  } catch (error) {}
};

// Resend registration otp
export const resendRegistrationOtp = async (username) => {
  try {
    if (!username || !Validator.isEmailValid(username))
      return Promise.reject("Invalid email");
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/resend-otp`,
      { username }
    );
  } catch (error) {}
};

export const login = async (loginRequest) =>
  await AxiosConfig.authAxiosInstance.post(
    `${AUTH_SERVICE_BASE_URL}/login`,
    loginRequest
  );

export const logoutBackendApi = async () => {
  try {
    return await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_URL}/logout`
    );
  } catch (error) {}
};

// Get CurrentAccount
export const getCurrentAccount = async () => {
  try {
    return await AxiosConfig.authAxiosInstance.get(
      `${AUTH_SERVICE_BASE_URL}/me`
    );
  } catch (error) {}
};

export const requestPasswordReset = async (email) => {
  try {
    // Replace with real API endpoint
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log("Password reset requested for:", email);
        resolve({ message: "Reset email sent" });
      }, 1200)
    );
  } catch (error) {}
};

export const resetPasswordApi = async (payload) => {
  try {
    console.log("Reset password API,", payload);
  } catch (error) {}
};

// src/services/auth.service.js
// import api from "./api";

// export const register = (data) => api.post("/auth/register", data);
// export const verifyEmail = (data) => api.post("/auth/verify-email", data);
// export const getCurrentAccount = () => api.get("/auth/current");
// export const logoutBackendApi = () => api.post("/auth/logout");
// export const requestPasswordReset = (email) => api.post("/auth/forgot-password", { email });
// export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);
