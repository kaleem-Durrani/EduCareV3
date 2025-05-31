import React from "react";
import SideBar from "./SideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F4F3F0" }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
