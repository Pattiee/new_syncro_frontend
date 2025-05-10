// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:underline">Dashboard</Link>
          <Link to="/admin/add-products" className="hover:underline">Add Products</Link>
          <Link to="/admin/users" className="hover:underline">Users</Link>
          <Link to="/admin/update-user" className="hover:underline">Update User</Link>
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
  );
};

export default AdminLayout;
