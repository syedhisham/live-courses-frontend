"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Define tabs for different user roles
const instructorTabs = [
  {
    label: "Add Course",
    href: "/dashboard/instructor/addcourse",
    icon: Plus,
  },
  {
    label: "My Courses",
    href: "/dashboard/instructor/courses",
    icon: BookOpen,
  },
];

const studentTabs = [
  {
    label: "My Courses",
    href: "/dashboard/student/courses",
    icon: BookOpen,
  },
  {
    label: "Browse Courses",
    href: "/dashboard/student/browse",
    icon: Search,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ isOpen, onClose, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get user role from Redux store
  const userRole =
    useSelector((state: RootState) => state.user.role) || "student";

  // Select appropriate tabs based on user role
  const tabs = userRole === "instructor" ? instructorTabs : studentTabs;

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const toggleCollapse = () => {
    if (!isMobile) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onCollapse?.(newCollapsed);
    }
  };

  const sidebarWidth = isCollapsed && !isMobile ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen shadow-xl border-r transition-all duration-300 ease-in-out z-50
          ${sidebarWidth}
          ${isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:flex-shrink-0 lg:h-screen
          bg-white dark:bg-zinc-900 
          text-gray-900 dark:text-white 
          border-gray-200 dark:border-zinc-800
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-zinc-800">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <GraduationCap
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {userRole === "instructor" ? "Instructor" : "Student"}
              </h2>
            </div>
          )}

          {/* Theme toggle and collapse button */}
          <div className="flex items-center gap-1">
            {/* Collapse button for desktop */}
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                ) : (
                  <ChevronLeft
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-1 flex-1">
          {tabs.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard/instructor" &&
                href !== "/dashboard/student" &&
                pathname?.startsWith(href));

            return (
              <Link
                href={href}
                key={href}
                onClick={() => isMobile && onClose()}
                className={`
                  group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white"
                  }
                  ${isCollapsed && !isMobile ? "justify-center" : ""}
                `}
                title={isCollapsed && !isMobile ? label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}
                />
                {(!isCollapsed || isMobile) && (
                  <span className="ml-3 truncate">{label}</span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div
                    className={`${
                      isCollapsed ? "hidden" : "block"
                    } ml-auto w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full opacity-100`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Dashboard v1.0
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
