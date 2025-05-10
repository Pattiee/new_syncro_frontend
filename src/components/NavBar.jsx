import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../roles';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { toggleTheme } from '../slices/themeSlice';

const Navbar = () => {
  const user = useSelector(state => state.auth?.user);
  const theme = useSelector(state => state?.theme?.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <>
      <nav
        className={`transition-all duration-300 ease-in-out fixed top-0 left-0 right-0 z-50 
          ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
          ${theme === 'light' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-900 text-white shadow-lg'}
        `}
      >
          <div className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link to="/" className="hover:opacity-80 transition">Metro</Link>
          </div>

          {/* Desktop Links */}
          <div className="flex-col">
            <div className='hidden md:flex items-center space-x-6 text-sm font-medium'>
              {user?.roles?.includes(ROLES.ADMIN) && (
                <Link to="/admin" className="hover:underline">Admin Panel</Link>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-full transition
                ${theme === 'light' ? 'bg-white text-orange-600 hover:bg-orange-100' : 'bg-gray-800 text-white hover:bg-gray-700'}
              `}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User or Login */}
            {user?.username ? (
              <span className="text-sm font-bold">{ user.username }</span>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-100 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block">Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block">Products</Link>
              <Link to="/favourites" onClick={() => setIsMobileMenuOpen(false)} className="block">Favourites</Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block">Categories</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block">Cart</Link>
            </motion.div>
          </div>
        )}
      </nav>
      
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}

      </>
  );
};

export default Navbar;
