"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Bot, User, LogOut, Menu, X, Bell, MessageCircle, GraduationCap } from "lucide-react";
import AskManan from "../../components/AskNova";

export default function DashboardLayout({ children }) {
  const { user, loading, logout, profileName } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Career Agent", href: "/dashboard/career", icon: Bot },
    { name: "Placement Prep", href: "/dashboard/placement-prep", icon: GraduationCap },
    { name: "Doubt Solver", href: "/dashboard/doubt-solver", icon: MessageCircle },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const handleLogout = async () => {
      await logout();
  }

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col md:flex-row font-sans text-zinc-950">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-zinc-200 p-4 flex justify-between items-center z-40 shrink-0">
        <span className="font-heading font-bold text-xl uppercase tracking-tighter border-2 border-zinc-900 px-2 py-0.5">
          Manan AI
        </span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            {/* Logo */}
          <div className="mb-10 hidden md:block">
            <h1 className="font-heading font-bold text-2xl uppercase tracking-tighter border-l-4 border-zinc-900 pl-3">
              Manan AI
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 border border-transparent transition-all duration-200 group ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-200"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} className={isActive ? "" : "group-hover:translate-x-1 transition-transform"} />
                  <span className="font-heading font-medium tracking-wide text-sm uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold font-heading">
                {user?.email ? user.email[0].toUpperCase() : "U"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-zinc-900 font-heading tracking-tight">
                  {profileName || user?.displayName || "Student"}
                    </p>
                    <p className="text-xs text-zinc-500 truncate font-mono">
                  {user?.email || "guest@manan.ai"}
                    </p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-zinc-600 hover:text-white hover:bg-red-600 border border-zinc-200 hover:border-red-600 transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <LogOut size={16} />
                <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 md:px-8 shrink-0">
            <h2 className="font-heading text-lg font-bold uppercase tracking-tight text-zinc-900">
                Dashboard
            </h2>
            <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-zinc-50/30">
            <div className="w-full max-w-[1600px] mx-auto">
                {children}
            </div>
        </div>

        <AskManan />
      </main>
    </div>
  );
}
