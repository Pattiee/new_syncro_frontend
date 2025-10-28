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


  return (
    <Fragment>
      <main className="">
        <Outlet />
      </main>
    </Fragment>
  );
};

export default AdminLayout;
