import React, { useEffect } from 'react';
import { Routes, Route, useLocation, } from 'react-router-dom';
import { ROLES } from './roles'
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './utils/ProtectedRoute';
import FloatingCart from './components/FloatingCart'
import FloatingCheckoutButton from './components/FloatingCheckoutButton'

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard'
import AccountInfo from './pages/AccountInfo'
import ProductDetailsPage from './pages/ProductDetailsPage';
import Cart from './pages/Cart';
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


const App = () => {
  // Uncomment this line for important usage
  // const { user } = useAuth();
  const { pathname } = useLocation();
  const hideCartOn = ['/auth', '/cart', '/checkout', '/admin/*'];
  const showFloatingCheckoutButton = ['/cart', '/checkout', '/', '/product'];
  const cartItems = useSelector(state => state?.cart?.items ?? []); 
                                                                                                                                                                                                                                                                                                                                                                                                          

  return (
    <div className="relative min-h-screen text-gray-900 bg-gray-100 dark:bg-gray-900">
      <Toaster position='bottom-left' />      
      <Routes>
        <Route index element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        <Route path='/checkout' element={ <Checkout/> } />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<OrderDetails />} />
        <Route path='/account' element={<AccountInfo/> } />
        
        {/* Protected routes */}
        {/* <Route path='/admin/users' element={ <ProtectedRoute children={<UsersPage/>} roles={[ROLES.ADMIN]}/> } /> */}

        {/* ROLES.ADMIN NOT USER */}
        <Route path={ADMIN_LINKS_FRONTEND.INDEX} element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminLayout/>
            </ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path='categories' element={<Categories />} />
          <Route path='add-category' element={<AddCategory />} />
          <Route path="branch" element={<BranchDetails />} />
          <Route path="branches" element={<Branches />} />
          <Route path="add-branch" element={<AddBranch />} />
          <Route path="users" element={<UsersPage />} />
          <Route path='user' element={ <UserDetailsPage/> } />
        </Route>

        <Route path={"/"} element={ <Home/> } />
        
      </Routes> 
      
      {!hideCartOn.includes(pathname) && cartItems?.length > 0 && <FloatingCart />}
      {!showFloatingCheckoutButton.includes(pathname) && <FloatingCheckoutButton/>}
    </div>
  );
};

export default App;
