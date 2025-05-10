import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROLES } from './roles'
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './slices/authSlice';
// import { fet };
import ProtectedRoute from './utils/ProtectedRoute';
import FloatingCart from './components/FloatingCart'
import FloatingCheckoutButton from './components/FloatingCheckoutButton'

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard'
import AccountInfo from './pages/AccountInfo'
import ProductDetailsPage from './pages/ProductDetailsPage';
import Cart from './pages/Cart';
import AdminLayout from './layouts/AdminLayout'
import AddProduct from './pages/admin/AddProduct';
import UsersPage from './pages/admin/UsersPage';
import UserDetailsPage from './pages/admin/UserDetailsPage'


const App = () => {
  // Uncomment this line for important usage
  // const { user } = useAuth();
  const { pathname } = useLocation();
  const hideCartOn = ['/auth', '/cart', '/checkout', '/admin/*'];
  const showFloatingCheckoutButton = ['/cart'];
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);                                                                                                                                                                                                                                                                                                                                                                                                           

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900">
      <Toaster position='top-center' />
      
      <Routes>
        <Route index element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        <Route path='/checkout' element={ <Checkout/> } />
        <Route path='/cart' element={<Cart />} />
        
        {/* Protected routes */}
        {/* <Route path='/admin/users' element={ <ProtectedRoute children={<UsersPage/>} roles={[ROLES.ADMIN]}/> } /> */}

        {/* ROLES.ADMIN NOT USER */}
        <Route path='/admin' element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminLayout/>
            </ProtectedRoute>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path="users" element={<UsersPage />} />
          <Route path='user' element={ <UserDetailsPage/> } />
        </Route>

        <Route path='*' element={ <NotFound/> } />
        
      </Routes> 
      
      {!hideCartOn.includes(pathname) && <FloatingCart />}
      {showFloatingCheckoutButton.includes(pathname) && <FloatingCheckoutButton/>}
    </div>
  );
};

export default App;
