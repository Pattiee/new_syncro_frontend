import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../roles';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { FiUser, } from 'react-icons/fi'
import { toggleTheme } from '../slices/themeSlice';
import { SearchBar } from './SearchBar';
import Cookies from 'js-cookie'

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME

const Navbar = () => {
  const location = useLocation();
  const user = useSelector(state => state.auth?.user);
  const theme = useSelector(state => state?.theme?.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const refreshCookie = Cookies.get('refresh_token');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleOpenCloseMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleToggleTheme = () => dispatch(toggleTheme());

  return (
    <Fragment>
      <nav
        className={`transition-all duration-300 ease-in-out fixed top-0 left-0 right-0 z-50 
          ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
          ${theme === 'light' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-900 text-white shadow-lg'}
        `}
      >
          <div className="flex items-center justify-between px-10 py-4">
          {/* Logo */}
            <div className="">
              <Link to="/" className="text-3xl font-semibold transition hover:opacity-80">{ SHOP_NAME }</Link>
            </div>

            {/* Desktop Links */}
            <div className="flex-col">
              <div className='items-center hidden space-x-6 text-sm font-medium md:flex'>
                {location.pathname.includes("/") && <Link to="/" className="hover:underline">Home</Link>}
                {user?.roles?.includes(ROLES.FOUNDER) && (
                  <Link to="/admin" className="hover:underline">CEO</Link>
                )}
                {user?.roles?.includes(ROLES.ADMIN) && (
                  <Link to="/admin" className="hover:underline">Admin Panel</Link>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={handleToggleTheme}
                className={`p-2 rounded-full transition
                  ${theme === 'light' ? 'bg-white text-orange-600 hover:bg-orange-100' : 'bg-gray-800 text-white hover:bg-gray-700'}
                `}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* User or Login */}
              { user && user?.username ? (
                <div className='flex items-center'>
                <FiUser size={30} className='mx-2 rounded-full' allowReorder='yes' aria-describedby={user?.username} />
                <span className="text-sm font-bold">
                  <Link to={"/account"}>{ user?.name || user?.username }</Link>
                </span>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-semibold text-orange-600 transition bg-white rounded-full hover:bg-orange-100">
                  Account
                </Link>
            )}

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button onClick={handleOpenCloseMobileMenu}>
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div
              className={`fixed top-0 right-0 h-full w-2/3 max-w-xs z-40 md:hidden transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'}
              `}
            >
              <motion.div
                className="p-6 space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Link to="/" onClick={closeMobileMenu} className="block">Home</Link>
                <Link to="/products" onClick={closeMobileMenu} className="block">Products</Link>
                <Link to="/favourites" onClick={closeMobileMenu} className="block">Favourites</Link>
                <Link to="/categories" onClick={closeMobileMenu} className="block">Categories</Link>
                <Link to="/cart" onClick={closeMobileMenu} className="block">Cart</Link>
              </motion.div>
            </div>
        )}
      </nav>        
        {isMobileMenuOpen && (
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          />
        )}

      </Fragment>
  );
};

export default Navbar;
