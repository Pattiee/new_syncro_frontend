import React, { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  getCurrentAccount,
  register,
  login,
  verifyEmail,
  logoutBackendApi,
  requestPasswordReset,
  resetPasswordApi,
  isEmailRegistered,
  LoginRequest,
  RegisterRequest,
} from "../services/auth.service";
import { getUserProfile } from "../services/user.service";
import { clearCart } from "../slices/cartSlice";
import Validator from "../helpers/Validator";

// 1. Define explicit structure interfaces for User Profiles and Context Value Contracts
export interface UserProfileData {
  id?: string;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: any; 
}

export interface AuthContextType {
  user: UserProfileData | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
  loading: boolean;
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkEmailRegistration: (email: string) => Promise<void>;
  registerUser: (payload: RegisterRequest) => Promise<any>;
  loginUser: (payload: LoginRequest) => Promise<void>;
  verifyEmailCode: (payload: any) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<any>;
  resetPassword: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Initialize context with undefined to catch provider placement bugs early
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Load user session on mount or route change
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentAccount();
        if (res?.data) {
          setUser(res.data);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }

        if (pathname.includes("/account") && res?.data) {
          const { data } = await getUserProfile();
          if (data) setUser((prev) => (prev ? { ...prev, ...data } : data));
        }
      } catch (err) {
        console.error("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [pathname]);

  // Check if email is registered
  const checkEmailRegistration = async (email: string) => {
    try {
      setLoading(true);
      const res = await isEmailRegistered({ email });
      if (res?.data === true) {
        toast.error("Email already exists. Try logging in.");
        return;
      } else {
        navigate("/auth/verify-email");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const registerUser = async (payload: RegisterRequest) => {
    try {
      setLoading(true);
      const res = await register(payload);
      toast.success("Registration successful. Verify your email to continue.");
      navigate("/auth/verify-email", { replace: true });
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const loginUser = async (payload: LoginRequest) => {
    setLoading(true);
    try {
      const res = await login(payload);
      if (res?.data) {
        toast.success("Login successful");
        setUser(res.data);
        setAuthenticated(true);
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmailCode = async (payload: any) => {
    try {
      const res = await verifyEmail(payload);
      toast.success("Email verified successfully!");
      navigate("/auth/login", { replace: true });
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Verification failed";
      toast.error(message);
      throw err;
    }
  };

  // Forgot password
  const requestPasswordResetHandler = async (email: string) => {
    try {
      const res = await requestPasswordReset(email);
      toast.success("Password reset link sent to your email");
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Reset request failed";
      toast.error(message);
      throw err;
    }
  };

  // Reset password
  const resetPasswordHandler = async (payload: any) => {
    try {
      const res = await resetPasswordApi(payload);
      toast.success("Password successfully reset. You can log in now.");
      navigate("/auth/login", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Password reset failed";
      toast.error(message);
      throw err;
    }
  };

  // Optimistic Logout (Best practice: Frontend clears state regardless of API failure)
  const logout = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Logging out...");
    try {
      const res = await logoutBackendApi();
      if (res?.status === 200 || res?.statusText?.toLowerCase() === "ok") {
        toast.success(res.data || "Logged out successfully");
      }
    } catch (err) {
      console.warn("Backend session invalidation bypassed during logout:", err);
    } finally {
      // Guaranteed front-end memory wipe
      dispatch(clearCart());
      setUser(null);
      setAuthenticated(false);
      toast.dismiss(loadingToast);
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authenticated,
        setAuthenticated,
        checkEmailRegistration,
        registerUser,
        loginUser,
        verifyEmailCode,
        requestPasswordReset: requestPasswordResetHandler,
        resetPassword: resetPasswordHandler,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};