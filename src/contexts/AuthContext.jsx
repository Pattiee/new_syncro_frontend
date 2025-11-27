// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
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
} from "../services/auth.service";
import { getUserProfile } from "../services/user.service";
import { clearCart } from "../slices/cartSlice";
import Validator from "../helpers/Validator";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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
          if (data) setUser((prev) => ({ ...prev, ...data }));
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
  const checkEmailRegistration = async (email) => {
    try {
      setLoading(true);
      console.log("Email: ", email);
      console.log(
        "Is valid email: ",
        email,
        " ",
        Validator.isEmailValid(email)
      );
      // if (!Validator.isEmailValid(email)) {
      //   return toast.error("Invalid email");
      // }
      const { data, status, statusText } = await isEmailRegistered(email);
      if (data === true) {
        toast.error("Email already exists. Try logging in.");
        return;
      } else {
        navigate("/auth/verify-email");
      }
    } catch (err) {
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
  const registerUser = async (payload) => {
    try {
      setLoading(true);
      const res = await register(payload);
      toast.success("Registration successful. Verify your email to continue.");
      navigate("/auth/verify-email", { replace: true });
      return res;
    } catch (err) {
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
  const loginUser = async (payload) => {
    setLoading(true);

    try {
      const res = await login(payload);

      if (res?.data) {
        toast.success("Login successful");
        setUser(res.data);
        setAuthenticated(true);
        navigate("/", { replace: true });
      }
    } catch (err) {
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
  const verifyEmailCode = async (payload) => {
    try {
      const res = await verifyEmail(payload);
      toast.success("Email verified successfully!");
      navigate("/auth/login", { replace: true });
      return res;
    } catch (err) {
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
  const requestPasswordResetHandler = async (email) => {
    try {
      const res = await requestPasswordReset(email);
      toast.success("Password reset link sent to your email");
      return res;
    } catch (err) {
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
  const resetPasswordHandler = async (payload) => {
    try {
      const res = await resetPasswordApi(payload);
      toast.success("Password successfully reset. You can log in now.");
      navigate("/auth/login", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Password reset failed";

      toast.error(message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    await logoutBackendApi()
      .then((res) => {
        if (res?.status === 200 || res?.statusText?.toLowerCase() === "ok") {
          toast.success(res.data);
          dispatch(clearCart());
          setUser(null);
          setAuthenticated(false);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
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
