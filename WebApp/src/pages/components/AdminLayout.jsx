import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Header from "../../components/layout/Header";
import ErrorBoundary from "../../components/common/ErrorBoundary";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>
            <div className="p-6">{children}</div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
