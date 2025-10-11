import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAccount, logoutBackendApi } from "../services/auth.service";
import { getUserProfile } from "../services/user.service";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AuthContext = createContext({
  user: null,
  loading: true,
  setAuthenticated: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      setLoading(true);
      try {
        const fullProfileNeeded = pathname.includes("/account") && user?.emailVerified;

        if (fullProfileNeeded) {
          const { data } = await getUserProfile();
          if (data) {
            setUser(data);
            setAuthenticated(true);
          }
        } else {
          await loadBasicProfile();
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [authenticated, pathname]);

  useEffect(() => {
    if (!user && !loading) navigate("/", { replace: true });
  }, []);

  const loadBasicProfile = async () => {
    const res = await getCurrentAccount();
    if (res?.data) {
      setUser(res.data);
      setAuthenticated(true);
    } else {
      setUser(null);
      setAuthenticated(false);
    }
  };

  const logout = async () => {
    if (!loading) setLoading(true);
    await logoutBackendApi().then(res => {
      toast.success(res?.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      dispatch(clearCart());
      setUser(null);
      setAuthenticated(false);
      navigate("/", { replace: true });
      setLoading(false);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;