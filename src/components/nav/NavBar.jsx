import { useState, useEffect, useRef, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthStatus } from "../auth/AuthStatus";
import { ThemeToggle } from "./ThemeToggle";
import { useSelector } from "react-redux";
import { ContactsNavbar } from "./ContactsNavbar";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { ceoLinks, managerLinks, vendorLinks } from "../../links";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "MyShop";

const Navbar = () => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const theme = useSelector((state) => state?.theme || "light");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'vendor' | 'manager' | 'ceo' | null
  const dropdownRef = useRef(null);
  const [publicLinks, setPublicLinks] = useState([]);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowNavbar(currentY < lastScrollY);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter role-based links
  const getLinksByRole = (links) => {
    if (!user || loading) return [];
    const userRoles = user.roles || [];
    return links.filter((link) =>
      link.roles.some((role) => userRoles.includes(role))
    );
  };

  const roleMenus = [
    { id: "vendor", label: "My Shop", links: getLinksByRole(vendorLinks) },
    { id: "manager", label: "Manager", links: getLinksByRole(managerLinks) },
    { id: "ceo", label: "CEO", links: getLinksByRole(ceoLinks) },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderDropdown = (menu) => (
    <div
      className="relative px-4 py-2"
      ref={dropdownRef}
      onMouseEnter={() => setDropdownOpen(menu.id)}
      onMouseLeave={() => setDropdownOpen(null)}
    >
      <span className="font-medium cursor-pointer">{menu.label}</span>
      <AnimatePresence>
        {dropdownOpen === menu.id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-48 rounded-md shadow py-2 ${
              theme === "light"
                ? "bg-white text-gray-900"
                : "bg-gray-800 text-white"
            }`}
          >
            {menu.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setDropdownOpen(null)}
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <Fragment>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNavbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        } ${
          theme === "light"
            ? "bg-white text-gray-900 shadow-sm"
            : "bg-gray-900 text-white shadow"
        } font-serif`}
      >
        <ContactsNavbar />

        <div className="flex items-center justify-between px-6 sm:px-10 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-serif font-semibold text-gray-800 dark:text-gray-200"
          >
            {SHOP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm relative">
            {pathname !== "/" && (
              <Link to="/" className="hover:underline font-semibold text-base">
                Home
              </Link>
            )}

            {publicLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:underline">
                {link.label}
              </Link>
            ))}

            {roleMenus
              .filter((menu) => menu.links.length > 0)
              .map((menu) => renderDropdown(menu))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} />
            <AuthStatus />

            {/* Mobile Toggle */}
            <button className="md:hidden" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className={`fixed top-0 right-0 h-full w-2/3 max-w-xs z-40 md:hidden ${
                theme === "light"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-gray-800 text-white"
              } font-serif p-6 space-y-4 shadow-lg`}
            >
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="block"
                >
                  {link.label}
                </Link>
              ))}

              {roleMenus.map(
                (menu) =>
                  menu.links.length > 0 && (
                    <div key={menu.id} className="mt-4">
                      <p className="font-semibold mb-2">{menu.label}</p>
                      {menu.links.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={closeMobileMenu}
                          className="block py-1"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
