import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiBook, FiSun, FiMoon } from "react-icons/fi";
import SPD_Logo from "./../assets/SPD.png";
import { useTheme } from "../contexts/ThemeContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: FiHome },
    { name: "School Transactions", href: "/school-transactions", icon: FiBook },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col lg:flex-row">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 lg:min-w-[16rem]
        flex flex-col
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-auto w-40 bg-[#00000000] rounded-2xl flex items-center justify-center">
              <img
                src={SPD_Logo}
                alt="SPD Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation (non-scrollable) */}
        <nav className="flex-1 px-3 mt-6 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.name}
                  className="animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md
                      ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#ffffff] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 h-16 flex items-center justify-between">
          {/* Logo for mobile view and menu button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="flex items-center lg:hidden">
              <div className="h-auto w-40 bg-[#00000000] rounded-2xl flex items-center justify-center">
                <img
                  src={SPD_Logo}
                  alt="SPD Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Theme toggle (right-aligned in desktop) */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "light" ? (
                <FiMoon className="h-5 w-5" />
              ) : (
                <FiSun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-3 lg:p-4 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
