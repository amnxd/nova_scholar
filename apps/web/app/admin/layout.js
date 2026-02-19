"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Bell, Shield } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, userRole, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    // Enforce admin role — redirect students to their dashboard
    if (!loading && user && userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 from-gray-50 to-slate-50 bg-gradient-to-br">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!user || (userRole && userRole !== "admin")) {
    return null;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Curriculum", href: "/admin/curriculum", icon: BookOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
      await logout();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <Shield size={20} className="text-red-600" />
            <span className="font-bold text-xl text-slate-800 dark:text-white">
            Manan Admin
            </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Distinct Dark Theme for Admin */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6">
            {/* Logo */}
          <div className="mb-8 hidden md:flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
                <Shield size={20} className="text-white" />
            </div>
            <div>
                <h1 className="font-bold text-xl text-white tracking-tight">
                Manan AI
                </h1>
                <span className="text-xs font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded ml-[-1px]">ADMIN MODE</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} className={isActive ? "" : "group-hover:translate-x-1 transition-transform"} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                {user.email ? user.email[0].toUpperCase() : "A"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">
                  {user.displayName || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                  {user.email}
                    </p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-sm font-medium"
            >
                <LogOut size={18} />
                <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Dashboard Overview
            </h2>
            <div className="flex items-center gap-4">
                 <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-full transition relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="w-full max-w-[1600px] mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
