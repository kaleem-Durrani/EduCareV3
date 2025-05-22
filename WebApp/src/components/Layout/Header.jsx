import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CONFIG } from '../../constants/config';
import { Menu, X, User, LogOut, Settings, Bell } from 'lucide-react';

/**
 * Header component for the admin layout
 * @param {Object} props - Component props
 * @param {Function} props.onMenuToggle - Function to toggle sidebar
 * @param {boolean} props.isSidebarOpen - Whether sidebar is open
 * @returns {JSX.Element} Header component
 */
const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              {CONFIG.APP_NAME}
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 relative">
            <Bell className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'admin'}
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'admin'}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
