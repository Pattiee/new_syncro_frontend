import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { logoutBackendApi } from '../services/auth.service';
import toast from 'react-hot-toast';
import { getOrders } from '../services/order.service';
import { ChevronRight, MapPinIcon, Settings, TruckIcon, User } from 'lucide-react';
import { OrdersArticle } from '../articles/OrdersArticle';
import { Loader } from '../components/Loader'
import { ProfileArticle } from '../articles/ProfileArticle'
import { AddressArticle } from '../articles/AddressArticle'
import { TabButton } from '../components/TabButton';
import { MAIN_LINKS_FRONTEND } from '../links';


const SHOP_NAME = process.env.REACT_APP_SHOP_NAME
const year = new Date().getFullYear();

const AccountInfo = () => {
  const user = useSelector(s => s.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  

  // Separate logout handler
  const handleLogout = useCallback(async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      const res = await logoutBackendApi();
      dispatch(logout());
      localStorage.removeItem('authState');
      toast.success(res.data);
      navigate(MAIN_LINKS_FRONTEND.HOME);
    } catch (err) {
      console.error(err);
    } finally {
      setLogoutLoading(false);
    }
  }, [dispatch, navigate, logoutLoading]);

  // Fetch orders
  useEffect(() => {
    if (!user || !user?.username) navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
    (async () => {
      setOrdersLoading(true);
      try {
        const res = await getOrders({ username: user?.username || undefined });
        setOrders(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [user, navigate]);


  /* ───────────────── UI ──────────────────── */
  return (
    <Suspense fallback={<Loader/>}>
      <main className="min-h-screen text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white bg-orange-500 rounded-full">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">Welcome,</p>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.name || user?.username}</p>
            </div>
          </div>
          <nav className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto"></nav>
        </header>

        <section className="max-w-6xl px-4 py-8 mx-auto md:grid md:grid-cols-5 md:gap-8">
          {/* Action panel */}
          <aside className="sticky mb-10 md:mb-0 top-4 md:static">
            <nav className="space-y-4">
              {/* Profile */}
              <TabButton icon={User} isActive={activeTab === "profile"} label={"Profile"} onClick={() => setActiveTab('profile')} />
              <TabButton icon={TruckIcon} isActive={activeTab === "orders"} label={"Orders"} onClick={() => setActiveTab('orders')} />
              <TabButton icon={MapPinIcon} isActive={activeTab === "address"} label={"Address"} onClick={() => setActiveTab('address')} />
              <TabButton icon={Settings} isActive={activeTab === "settings"} label={"Settings"} onClick={() => setActiveTab('settings')} />
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition border border-red-400 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-60 focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
                <span className="flex-1 text-left">
                  {logoutLoading ? 'Logging out…' : 'Logout'}
                </span>
              </button>
            </nav>
          </aside>

          <div className="md:col-span-4">
            {activeTab === 'profile' && <ProfileArticle user={user} />}
            {activeTab === 'orders' && <OrdersArticle loading={ordersLoading} orders={orders} />}
            {activeTab === 'address' && <AddressArticle />}
            {activeTab === 'settings' && <p>Settings coming soon...</p>}
          </div>
        </section>
      </main>
      
      <footer className="py-6 text-sm text-center text-gray-500 dark:text-gray-400">
        &copy; { year } { SHOP_NAME }. All rights reserved.
      </footer>

    </Suspense>
  );
};

export default AccountInfo;
