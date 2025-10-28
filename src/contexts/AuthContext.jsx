// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getCurrentAccount, logoutBackendApi } from "../services/auth.service";
import { getUserProfile } from "../services/user.service";
import { clearCart } from "../slices/cartSlice";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start true for initial fetch
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch current user on mount or route change
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await getCurrentAccount(); // backend checks cookie session
        if (res?.data) {
          setUser(res.data);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }

        // Load full profile if necessary
        if (pathname.includes("/account") && res?.data) {
          const { data } = await getUserProfile();
          if (data) setUser(prev => ({ ...prev, ...data }));
        }

      } catch (err) {
        console.error("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [pathname]);

  // Logout and cleanup
  const logout = async () => {
    setLoading(true);
    try {
      const { data, status, statusText } = await logoutBackendApi(); // backend clears cookie

      if (statusText === "OK" || status.toString().startsWith("2")) {
        toast.success("Logged out successfully");
        dispatch(clearCart());
        setUser(null);
        setAuthenticated(false);
      } else {
        throw new Error(data?.message || "Logout failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/", { replace: true });
      setLoading(false);
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
