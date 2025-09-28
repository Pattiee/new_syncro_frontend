// src/layouts/AdminLayout.jsx
import React, { Fragment } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/nav/NavBar';
import { ADMIN_LINKS_FRONTEND } from '../links';

const AdminLayout = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="flex min-h-screen text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-white">      
        {/* Sidebar */}
        <aside className="w-64 p-4 bg-white shadow-lg dark:bg-gray-900">
          <h2 className="mb-6 text-2xl font-bold">Admin Panel</h2>
          <nav className="flex flex-col gap-4">
            <Link to={ADMIN_LINKS_FRONTEND.INDEX} className="hover:underline">Dashboard</Link>
            <Link to={ADMIN_LINKS_FRONTEND.ADD_PRODUCTS} className="hover:underline">Add Products</Link>
            <Link to={ADMIN_LINKS_FRONTEND.CATEGORIES} className="hover:underline">Product Categories</Link>
            <Link to={ADMIN_LINKS_FRONTEND.BRANCHES} className="hover:underline">Branches</Link>
            <Link to={ADMIN_LINKS_FRONTEND.USERS} className="hover:underline">Users</Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          </header>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
