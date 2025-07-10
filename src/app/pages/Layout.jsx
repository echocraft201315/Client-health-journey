import { Sidebar } from "../components/sidebar/Sidebar";
import TopBar from "../components/sidebar/TopBar";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: hidden on mobile, shown as drawer if open */}
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      {/* Overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 sm:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {Outlet}
        </main>
      </div>
    </div>
  );
};

export default Layout;
