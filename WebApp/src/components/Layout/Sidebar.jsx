import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ADMIN_MENU_ITEMS } from "../../constants/routes";
import { CONFIG } from "../../constants/config";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Utensils,
  CreditCard,
  BarChart3,
  Search,
  Calendar,
  X,
} from "lucide-react";

/**
 * Icon mapping for menu items
 */
const iconMap = {
  dashboard: LayoutDashboard,
  users: Users,
  "user-check": UserCheck,
  "book-open": BookOpen,
  utensils: Utensils,
  "credit-card": CreditCard,
  "bar-chart": BarChart3,
  search: Search,
  calendar: Calendar,
};

/**
 * Sidebar component for navigation
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open (mobile)
 * @param {Function} props.onClose - Function to close sidebar (mobile)
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = ({ isOpen = true, onClose }) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item) => {
    const IconComponent = iconMap[item.icon] || Users;
    const isActive = isActiveRoute(item.path);

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose} // Close mobile sidebar when item is clicked
        className={`
          flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
          ${
            isActive
              ? "bg-purple-100 text-purple-700 border-r-2 border-purple-700"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <IconComponent
          className={`w-5 h-5 mr-3 ${
            isActive ? "text-purple-700" : "text-gray-500"
          }`}
        />
        {item.label}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            {CONFIG.APP_NAME}
          </span>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {ADMIN_MENU_ITEMS.map(renderMenuItem)}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Version {CONFIG.APP_VERSION}</p>
          <p className="mt-1">© 2024 EduCare</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />

          {/* Sidebar */}
          <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
