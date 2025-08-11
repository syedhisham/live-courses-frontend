"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Close mobile sidebar when switching to desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Calculate margin based on sidebar state
  const getMainMargin = () => {
    if (isMobile) return 'lg:ml-0';
    if (sidebarCollapsed) return 'lg:ml-10';
    return 'lg:ml-4';
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onCollapse={handleSidebarCollapse}
      />
      
      {/* Main content area */}
      <div className={`
        flex flex-col flex-1 transition-all duration-300 ease-in-out
        ${getMainMargin()}
      `}>
        {/* Header */}
        <DashboardHeader 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={sidebarOpen}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}