"use client";

import { LogOut, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { clearUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { logoutApi } from "@/api/authApis";
import { useState } from "react";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function DashboardHeader({ onToggleSidebar, isSidebarOpen }: DashboardHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const userName = useSelector((state: RootState) => state.user.name) || "User";

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-700 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/95">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section with menu toggle and greeting */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Username greeting */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white sm:text-xl">
              Hi, {userName}
            </h1>
          </div>
        </div>

        {/* Right section with logout button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer text-blue-600 dark:text-blue-400"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="ml-2 hidden sm:inline-block text-sm font-medium">
              {loading ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}