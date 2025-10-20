import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAccount, logoutBackendApi } from "../services/auth.service";
import { getUserProfile } from "../services/user.service";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ROLES } from "../roles";

const AuthContext = createContext({
  user: null,
  setUser: null,
  loading: false,
  setAuthenticated: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        if (!loading) setLoading(true);
        const fullProfileNeeded = pathname.includes("/account") && user?.roles?.length > 0;

        if (fullProfileNeeded) {
          const { data } = await getUserProfile();
          if (data) {
            setUser(data);
            setAuthenticated(true);
            console.log(data);
          }
        } else {
          await loadBasicProfile();
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [authenticated, pathname]);

  const loadBasicProfile = async () => {
    const res = await getCurrentAccount();
    console.log(res?.data);
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
    <AuthContext.Provider value={{ user, setUser, loading, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;