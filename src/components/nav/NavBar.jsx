import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthStatus } from '../auth/AuthStatus';
import { ThemeToggle } from './ThemeToggle';
import { useSelector } from 'react-redux';
import { ContactsNavbar } from './ContactsNavbar';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../roles';
import { motion, AnimatePresence } from 'framer-motion';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "MyShop";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, loading } = useAuth();
  const theme = useSelector(state => state?.theme || 'light');
  const dropdownRef = useRef(null);

  // Hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => setShowNavbar(window.scrollY < lastScrollY) || setLastScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "Favourites", to: "/favourites" },
    { label: "Categories", to: "/categories" },
    { label: "Cart", to: "/cart" },
  ];

  const adminLinks = [
    { label: "Admin Panel", to: "/admin", roles: [ROLES.ADMIN] },
    { label: "Add Products", to: "/admin/add-products", roles: [ROLES.ADMIN] },
    { label: "Categories", to: "/admin/categories", roles: [ROLES.ADMIN] },
    { label: "Branches", to: "/admin/branches", roles: [ROLES.ADMIN] },
    { label: "Users", to: "/admin/users", roles: [ROLES.ADMIN] },
    { label: "CEO Dashboard", to: "/admin", roles: [ROLES.FOUNDER] },
  ];

  const filteredAdminLinks = user
    ? adminLinks.filter(link => link.roles.some(role => user.roles?.includes(role)))
    : [];

  return (
    <Fragment>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
        ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-900 text-white shadow'}
        font-serif
      `}>
        <ContactsNavbar />
        <div className="flex items-center justify-between px-6 sm:px-10 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-xl font-serif font-semibold text-gray-800 dark:text-gray-200">
            <Link to="/">{SHOP_NAME}</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-serif relative">
            {publicLinks.map(link => (
              <Link key={link.to} to={link.to} className="hover:underline">{link.label}</Link>
            ))}

            {/* User Dropdown */}
            {user && !loading && filteredAdminLinks.length > 0 && (
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-serif font-bold">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow py-2
                        ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}
                        font-serif
                      `}
                    >
                      {filteredAdminLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} />
            <div className="flex items-center font-serif">
              <AuthStatus />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`fixed top-0 right-0 h-full w-2/3 max-w-xs z-40 md:hidden transition-transform duration-300
              ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-white'}
              font-serif
            `}>
            <div className="p-6 space-y-4">
              {publicLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={closeMobileMenu} className="block">{link.label}</Link>
              ))}

              {filteredAdminLinks.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Admin Links</p>
                  {filteredAdminLinks.map(link => (
                    <Link key={link.to} to={link.to} onClick={closeMobileMenu} className="block py-1">{link.label}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {isMobileMenuOpen && <div onClick={closeMobileMenu} className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden" />}
    </Fragment>
  );
};

export default Navbar;
