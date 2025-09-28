import { useEffect, useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/order.service';
import { MapPinIcon, Settings, TruckIcon, User } from 'lucide-react';
import { OrdersArticle } from '../articles/OrdersArticle';
import { Loader } from '../components/Loader'
import { ProfileArticle } from '../articles/ProfileArticle'
import { AddressArticle } from '../articles/AddressArticle'
import { TabButton } from '../components/TabButton';
import { MAIN_LINKS_FRONTEND } from '../links';
import { useKeycloak } from '@react-keycloak/web';


const SHOP_NAME = process.env.REACT_APP_SHOP_NAME
const year = new Date().getFullYear();

const AccountInfo = () => {

  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [orders, setOrders] = useState([]);  

  // Separate logout handler
  const handleLogout = () => keycloak.logout();

  // Fetch orders
  useEffect(() => {
    if (!keycloak.authenticated) return navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
    
    (async () => {
      setOrdersLoading(true);
      try {
        const res = await getOrders({ username: keycloak.tokenParsed?.preferred_username || undefined });
        setOrders(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [keycloak, navigate]);

  // Initialize auth state
  if (!initialized) return <Loader message='Loading current user'/>

  /* ───────────────── UI ──────────────────── */
  return (
    <Suspense fallback={<Loader/>}>
      <main className="min-h-screen text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        <header className="flex bg-orange-500 shadow border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="flex p-1 items-center px-2">
            <div className="flex items-center justify-center m-2 w-12 h-12 text-lg font-semibold dark:text-gray-700 text-orange-500 bg-white rounded-full">
              {keycloak.tokenParsed?.email[0]?.toUpperCase()}
            </div>
            <div className='p-1'>
              <p className="font-medium text-lg text-gray-100">{keycloak.tokenParsed?.given_name}</p>
            </div>
          </div>

          {/* Navigation bar */}
          <nav className="flex items-center flex-1 justify-center px-4 py-3 mx-auto">
            <div className=''>
              <ul className='flex px-2 py-4'>
                <li className='flex items-center text-base font-light px-2 text-white dark:text-gray-100 dark:hover:text-gray-50 hover:text-pretty hover:text-gray-700 transition'>
                  <Link to={'/'}>Home</Link>
                </li>
                <li className='flex items-center text-base font-light px-2 text-white dark:text-gray-100 dark:hover:text-gray-50 hover:text-pretty hover:text-gray-700 transition'>
                  <Link to={'/'}>Contact us</Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* InquerySection */}
          <div className='flex flex-row items-center px-4 py-3 mx-auto'>
            <span className='flex text-lg text-white font-medium'>Inquery?:</span>
            <span className='flex text-gray-50 font-light px-2'>+254103877620</span>
          </div>
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
            </nav>
          </aside>

          <div className="md:col-span-4">
            {activeTab === 'profile' && <ProfileArticle />}
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
