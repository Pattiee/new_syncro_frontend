import { useState, lazy, Suspense, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CustomLoader2 } from "../../components/loaders/CustomLoader2";
import { clearCart } from "../../slices/cartSlice";
import { selectCurrentUser, selectAuthStatus, clearAuth } from "../../store/authSlice"; // Adjust paths to match your auth slice location
import { logoutBackendApi } from "../../services/auth.service";
import toast from "react-hot-toast";

const SHOP_NAME = (process.env.REACT_APP_SHOP_NAME as string) || "Your Online Shop";

// Lazy imports typed automatically by React.lazy
const Profile = lazy(() => import("./tabs/Profile"));
const Orders = lazy(() => import("./tabs/Orders"));
const Transactions = lazy(() => import("./tabs/Transactions"));
const SettingsTab = lazy(() => import("./tabs/SettingsTab"));

// 1. Enforce specific string limits for allowed tabs
type AllowedTabs = "profile" | "orders" | "transactions" | "settings";

const Account: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const authStatus = useSelector(selectAuthStatus);
  const loading = authStatus === "loading";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect users out if their session drops
  useEffect(() => {
    if (!user && !loading) {
      dispatch(clearCart());
      navigate("/", { replace: true });
    }
  }, [user, loading, dispatch, navigate]);

  // Load saved tab from localStorage or default strictly to "profile"
  const [activeTab, setActiveTab] = useState<AllowedTabs>(() => {
    const saved = localStorage.getItem("activeTab");
    return (saved as AllowedTabs) || "profile";
  });

  // Persist active tab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Robust fallback-based logout handler adhering to our best-practice discussion
  const handleLogout = async () => {
    if (!user || loading) return;
    const loadingToast = toast.loading("Logging out...");
    
    try {
      await logoutBackendApi();
    } catch (err) {
      console.warn("Backend session invalidation bypassed:", err);
    } finally {
      dispatch(clearAuth());
      dispatch(clearCart());
      toast.dismiss(loadingToast);
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "transactions":
        return <Transactions />;
      case "settings":
        return <SettingsTab />;
      default:
        return <Profile />;
    }
  };

  const tabList: AllowedTabs[] = ["profile", "orders", "transactions", "settings"];

  return (
    <div className="min-h-screen font-sans bg-transparent">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md rounded-b-2xl">
        <div className="flex w-full mx-auto px-6 py-4 justify-between items-center">
          {/* Brand and Tabs */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xl font-semibold text-orange-500 hover:underline"
            >
              {SHOP_NAME}
            </Link>

            {tabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-gray-900 dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Logout section using our snake_case email user metrics */}
          {user && !loading && (
            <div className="flex gap-3 items-center">
              <span className="font-medium text-gray-800 dark:text-white">
                {user.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-transparent text-red-500 text-sm hover:bg-red-100 transition"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
        <Suspense fallback={<CustomLoader2 />}>{renderTabContent()}</Suspense>
      </div>
    </div>
  );
};

export default Account;