// Layout.js
import React from "react";
import { useLocation } from "react-router-dom";

// Import sidebars
import Sidebar from "../components/Sidebar"; // Default shared sidebar
import AdminSidebar from "../components/AdminSidebar";
import UserSidebar from "../components/UserSidebar";

const Layout = ({ children }) => {
  const location = useLocation();

  let SidebarComponent = null;

  // Show sidebars based on route
  if (location.pathname.startsWith("/admin") || location.pathname === "/settings" ) {
    SidebarComponent = AdminSidebar;
  } else if (
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/courses") ||
    location.pathname === "/settings" ||
    location.pathname === "/certificates"
  ) {
    SidebarComponent = UserSidebar;
  } else {
    SidebarComponent = Sidebar; // No sidebar for homepage or other routes
  }

  return (
    <div className="flex">
      {SidebarComponent && <SidebarComponent />}
      <main className="flex-grow bg-gray-50 min-h-screen p-6">{children}</main>
    </div>
  );
};

export default Layout;
