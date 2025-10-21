import { Routes, Route, useLocation, } from 'react-router-dom';
import { ROLES } from './roles'
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './utils/ProtectedRoute';
import FloatingCart from './components/FloatingCart'
import FloatingCheckoutButton from './components/FloatingCheckoutButton'

// Pages
import Home from './pages/Home';
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductDetailsPage from './pages/ProductDetailsPage';
import { AddCategory } from './pages/admin/AddCategory'
import AdminLayout from './layouts/AdminLayout'
import AddProduct from './pages/admin/AddProduct';
import UsersPage from './pages/admin/UsersPage';
import UserDetailsPage from './pages/admin/UserDetailsPage'
import { Categories } from './pages/admin/Categories';
import { ADMIN_LINKS_FRONTEND } from './links';
import { Branches } from './pages/admin/company_branches/Branches'
import { BranchDetails } from './pages/admin/company_branches/BranchDetails';
import { OrderDetails } from './pages/orders/OrderDetails'
import { AddBranch } from './pages/admin/company_branches/AddBranch'
import { useCart } from './hooks/useCart';
import { Register } from './pages/auth/Register';
import { Login } from './pages/auth/Login';
import { ContactsNavbar } from './components/nav/ContactsNavbar';
import Navbar from './components/nav/NavBar';
import Footer from './sections/Footer';
import CartSummary from './pages/CartSummary';
import Account from './pages/account/Account';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { CreatePassword } from './pages/auth/CreatePassword';
import { CheckoutPage } from './pages/CheckoutPage';
import { routes } from './routes';


const App = () => {
  const { pathname } = useLocation();
  const { cartItems } = useCart();

  const hideFooterOn = ['/auth', '/login', '/verify', '/create-password', '/register', '/checkout'];
  const hideCartOn = ['/auth', '/login', '/order', '/verify', '/create-password', '/account', '/manager', '/register', '/cart-summary', '/checkout'];
  const hideNavbarOn = ['/auth', '/staff', '/manager', '/verify', '/create-password', '/login', '/register', '/contact', '/account', '/cart-summary', '/checkout'];
  const hideFloatingCheckoutButton = ['/checkout', '/order', '/verify', '/create-password', '/login', '/manager', '/account', '/register', '/', '/product'];
  const hideContactsNavOn = ['/login', '/register'];

   // check if navbar should render
  const isFooterVisible = !hideFooterOn.includes(pathname);
  const isNavbarVisible = !hideNavbarOn.includes(pathname);
  const isContactNavVisible = !hideContactsNavOn.includes(pathname);
  const isFloatingCartVisible = !hideCartOn.includes(pathname) && cartItems?.length > 0;
  const isFloatingCheckoutBtnVisible = !hideFloatingCheckoutButton.includes(pathname);

  // contacts strip ~2rem (h-8), navbar ~4rem (h-16)
  const paddingTopClass = isNavbarVisible ? 'pt-24' : 'pt-0';

  return (
    <div className="flex flex-col relative min-h-screen text-gray-900 bg-white dark:bg-gray-900">
      <Toaster position="bottom-left" />

      {/* Contacts strip always pinned */}
      {isContactNavVisible && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ContactsNavbar />
        </div>
      )}

      {/* Main Navbar sits below contacts strip */}
      {isNavbarVisible && (
        <div className="fixed left-0 right-0 z-40 top-8 mb-24"> 
          <Navbar />
        </div>
      )}

      {/* Push content down so it’s not hidden behind header */}
      <div className={paddingTopClass}> 
        <div className="mx-auto min-h-screen">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart-summary" element={<CartSummary />} />
            <Route path="/order" element={<OrderDetails />} />
            <Route path="/account" element={<Account />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/create-password" element={<CreatePassword />} />

            {/* Protected Routes */}
            {routes.map(({ path, roles, children, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute roles={roles} layoutElement={element}/>}
              >
                {children?.map(({ path, element }) => (
                  <Route key={path} path={path} element={element}/>
                ))}
              </Route>
            ))}


            {/* <Route
              path={ADMIN_LINKS_FRONTEND.INDEX}
              element={
                <ProtectedRoute roles={[ROLES.MANAGER]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="add-products" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="branch" element={<BranchDetails />} />
              <Route path="branches" element={<Branches />} />
              <Route path="add-branch" element={<AddBranch />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="user" element={<UserDetailsPage />} />
            </Route> */}

            {/* Unknown routes */}
            {/* <Route path='*' element={<Home/>} /> */}
          </Routes>
        </div>
      </div>

      {isFloatingCartVisible && (
        <FloatingCart />
      )}
      {isFloatingCheckoutBtnVisible && (
        <FloatingCheckoutButton />
      )}

      {/* Footer */}
      {isFooterVisible && (
      <div className="mt-auto">
        <Footer/>
      </div>

      )}
    </div>
  );
};


export default App;
