import { useState, Suspense, useEffect } from 'react';
import { User, TruckIcon, MapPinIcon, Settings, LogOut } from 'lucide-react';
import { TabButton } from '../../components/TabButton';
import { getOrders } from '../../services/order.service';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Profile } from './tabs/Profile';
import { Orders } from './tabs/Orders';
import { Transactions } from './tabs/Transactions';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Your online shop";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
    const handleLogout = () => logout();
  
    const renderTabContent = () => {
      switch (activeTab) {
        case "orders":
          return <Orders/>
        case "settings":
          return <Settings/>
        case "transactions":
          return <Transactions/>
        case "profile":
          return <Profile/>
        default: return <Profile/>
      }
    };
  
    return (
      <div className="min-h-screen pt-8 bg-white dark:bg-gray-900 font-sans">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-md rounded-b-2xl">
          <div className="flex w-full mx-auto px-6 py-4 justify-between items-center">
            {/* Left: Brand + Tabs */}
            <div className="flex items-center space-x-4">
              <Link to='/' className="text-xl font-semibold text-orange-500 hover:underline">
                {SHOP_NAME}
              </Link>
              {["profile", "orders", "transactions", "settings"].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-transparent text-gray-700 dark:text-white font-semibold"
                      : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
  
            {/* Right: Logout */}
            {user && !loading && (
              <div className='flex gap-3 items-center'>
                <span className='font-medium text-gray-800 dark:text-white'>{user?.username}</span>

                <button
                  onClick={handleLogout}
                  disabled={!user || loading}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-transparent text-red-500 text-sm hover:bg-red-100 transition"
                >
                  <LogOut size={15}/>
                </button>
              </div>
            )}
          </div>
        </nav>
  
        {/* Page Content */}
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
          {renderTabContent()}
        </div>
      </div>
    );
};

export default Account;
