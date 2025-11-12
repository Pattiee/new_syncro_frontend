import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { RolesTab } from "../roles/RolesTab";
import { AccountsTab } from "../AccountsTab";
import { Branches } from "../company_branches/Branches";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Your Online Shop";

export const CEO_Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Branches");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const tabsRef = useRef([]);
  const underlineRef = useRef(null);

  const tabs = ["Branches", "User Accounts", "Role Manager", "Finance"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Branches":
        return <Branches />;
      case "User Accounts":
        return <AccountsTab />;
      case "Role Manager":
        return <RolesTab />;
      case "Finance":
        return null;
      default:
        return null;
    }
  };

  // Animate floating underline with spring effect
  useEffect(() => {
    const currentIndex = tabs.indexOf(activeTab);
    const currentTabEl = tabsRef.current[currentIndex];
    if (currentTabEl && underlineRef.current) {
      underlineRef.current.style.width = `${currentTabEl.offsetWidth}px`;
      underlineRef.current.style.left = `${currentTabEl.offsetLeft}px`;
      underlineRef.current.style.top = `${currentTabEl.offsetHeight - 3}px`; // float above bottom by 6px
      underlineRef.current.style.transition =
        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }, [activeTab, tabs]);

  return (
    <div className="min-h-screen dark:bg-gray-900 font-sans">
      {/* Navbar / Tabs */}
      <nav className="bg-white dark:bg-gray-800 shadow-md rounded-b-2xl">
        <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 justify-between items-center md:items-end space-y-2 md:space-y-0">
          {/* Left: Brand + Tabs */}
          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
            <Link
              to="/"
              className="text-xl font-semibold text-orange-500 hover:underline mr-4 mb-2 md:mb-0"
            >
              CEO
            </Link>

            <div className="relative flex flex-wrap gap-2 w-full md:w-auto">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  ref={(el) => (tabsRef.current[idx] = el)}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${
                      activeTab === tab
                        ? "text-orange-600 dark:text-white font-semibold"
                        : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}

              {/* Floating Underline */}
              <span
                ref={underlineRef}
                className="absolute h-1.5 bg-orange-500 rounded-full shadow-lg"
                style={{ top: "100%" }}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {renderTabContent()}
      </div>
    </div>
  );
};
