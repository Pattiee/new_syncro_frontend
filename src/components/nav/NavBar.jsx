import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthStatus } from '../auth/AuthStatus';
import { ThemeToggle } from './ThemeToggle';
import { useSelector } from 'react-redux';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const theme = useSelector(state => state?.theme || 'light');

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

  return (
    <Fragment>
      <nav
        className={`transition-all duration-300 ease-in-out fixed top-0 left-0 right-0 z-50 
          ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
          ${theme === 'light' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-900 text-white shadow-lg'}
        `}
      >
          <div className="flex items-center justify-between px-10 py-4">
          {/* Logo */}
            <div className="">
              <Link to="/" className="text-3xl font-semibold transition hover:opacity-80">{ SHOP_NAME }</Link>
            </div>

            {/* Desktop Links */}
            <div className="flex-col">
              {/* <div className='items-center hidden space-x-6 text-sm font-medium md:flex'>
                {keycloak.tokenParsed.realm_access.roles.some?.includes(ROLES.FOUNDER) && (
                  <Link to="/admin" className="hover:underline">CEO</Link>
                )}
                {keycloak.tokenParsed.realm_access.roles.some?.includes(ROLES.ADMIN) && (
                  <Link to="/admin" className="hover:underline">Admin Panel</Link>
                )}
              </div> */}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle theme={theme}/>

              {/* User or Login */}
                <div className='flex items-center'>
                  <span className="text-sm font-bold">
                    <AuthStatus/>
                  </span>
                </div>

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
