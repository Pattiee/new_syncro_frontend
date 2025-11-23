import { useState, lazy, Suspense, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CustomLoader2 } from "../../components/loaders/CustomLoader2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../slices/cartSlice";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Your Online Shop";

// Lazy imports
const Profile = lazy(() => import("./tabs/Profile"));
const Orders = lazy(() => import("./tabs/Orders"));
const Transactions = lazy(() => import("./tabs/Transactions"));
const SettingsTab = lazy(() => import("./tabs/SettingsTab"));

const Account = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !loading) {
      dispatch(clearCart());
      navigate("/", { replace: true });
    }
  }, [user, loading]);

  // Load saved tab from localStorage or default to "profile"
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || "profile"
  );

  // Persist active tab
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    if (user && !loading) await logout();
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

            {["profile", "orders", "transactions", "settings"].map((tab) => (
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

          {/* Logout */}
          {user && !loading && (
            <div className="flex gap-3 items-center">
              <span className="font-medium text-gray-800 dark:text-white">
                {user.username}
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
