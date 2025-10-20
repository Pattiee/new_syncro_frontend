import React, { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { RolesTab } from '../roles/RolesTab';
import { AccountsTab } from '../AccountsTab';
import { Branches } from '../company_branches/Branches';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Your online shop";

export const CEO_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Branches");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const renderTabContent = () => {
      switch (activeTab) {
        case "Branches":
          return <Branches/>;
        case "User Accounts":
          return <AccountsTab/>;
        case "Role Manager":
          return <RolesTab/>;
        case "Finance":
          return null;
        default: return null;
      }
    };
  
    return (
      <div className="min-h-screen dark:bg-gray-900 font-sans">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-md rounded-b-2xl">
          <div className="flex w-full mx-auto px-6 py-4 justify-between items-center">
            {/* Left: Brand + Tabs */}
            <div className="flex items-center space-x-4">
              <Link to='/' className="text-xl font-semibold text-orange-500 hover:underline">
                <span>CEO</span>
              </Link>
              {["Branches", "User Accounts", "Role Manager", "Finance"].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-transparent text-gray-700 dark:text-white font-semibold"
                      : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </nav>
  
        {/* Page Content */}
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
          {renderTabContent()}
        </div>
      </div>
    );
}
