// src/schemas/auth.schema.js
import { z } from "zod";

export const validateEmailSchema = z.object({
  username: z
    .string()
    .min(5, "Email is too short")
    .max(50, "Email is too long")
    .email("Invalid email address"),
});

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(5, "Email is too short")
      .max(50, "Email is too long")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password can not exceed 50 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z
    .string()
    .min(5, "Email is too short")
    .max(50, "Email is too long")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password too long"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email too short")
    .max(50, "Email too long"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password can not exceed 50 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// src/services/auth.service.js
// import api from "./api";

// export const register = (data) => api.post("/auth/register", data);
// export const loginBackendApi = (data) => api.post("/auth/login", data);
// export const verifyEmail = (data) => api.post("/auth/verify-email", data);
// export const getCurrentAccount = () => api.get("/auth/current");
// export const logoutBackendApi = () => api.post("/auth/logout");
// export const requestPasswordReset = (email) => api.post("/auth/forgot-password", { email });
// export const resetPasswordApi = (data) => api.post("/auth/reset-password", data);
