import React, { useState, useEffect, Fragment } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../components/nav/ThemeToggle';
import { AuthStatus } from '../components/auth/AuthStatus';
import { ROLES } from '../roles';
import { ADMIN_LINKS_FRONTEND } from '../links';
import { useAuth } from '../hooks/useAuth';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "MyShop";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, loading } = useAuth();
  const theme = useSelector(state => state?.theme || 'light');

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY < lastScrollY);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const adminLinks = [
    { label: 'Dashboard', to: '/admin', roles: [ROLES.MANAGER, ROLES.MODERATOR] },
    { label: 'Add Products', to: ADMIN_LINKS_FRONTEND.ADD_PRODUCTS, roles: [ROLES.MANAGER] },
    { label: 'Categories', to: ADMIN_LINKS_FRONTEND.CATEGORIES, roles: [ROLES.MANAGER] },
    { label: 'Branches', to: ADMIN_LINKS_FRONTEND.BRANCHES, roles: [ROLES.MANAGER] },
    { label: 'Users', to: ADMIN_LINKS_FRONTEND.USERS, roles: [ROLES.MANAGER, ROLES.SUPER_MANAGER] },
  ];

  return (
    <Fragment>
      <main className="">
        <Outlet />
      </main>
    </Fragment>
  );
};

export default AdminLayout;
