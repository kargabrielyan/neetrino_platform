'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTheme } from '../lib/use-admin-theme';
import { 
  LayoutDashboard,
  Database,
  Download,
  X,
  Sun,
  Moon
} from 'lucide-react';

interface WordPressAdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function WordPressAdminLayout({ children, currentPage = 'dashboard' }: WordPressAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useAdminTheme();
  const router = useRouter();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      children: []
    },
    {
      id: 'demos',
      label: 'Demos',
      icon: Database,
      href: '/admin?tab=demos',
      children: [
        { id: 'all-demos', label: 'All Demos', href: '/admin?tab=demos' },
        { id: 'add-demo', label: 'Add New', href: '/admin?tab=demos&action=add' },
        { id: 'categories', label: 'Categories', href: '/admin?tab=demos&action=categories' }
      ]
    },
    {
      id: 'woocommerce',
      label: 'WooCommerce Import',
      icon: Download,
      href: '/admin?tab=woocommerce',
      children: []
    }
  ];

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Top Bar - Simplified */}
      <div className="relative backdrop-blur-2xl bg-white/70 dark:bg-gray-800/70 border-b border-white/20 dark:border-gray-700/30 px-4 py-3 flex items-center justify-between shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">NEETRINO</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={() => router.push('/')}
            className="p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
            title="Go to Home Page"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="flex relative">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-white/70 dark:bg-gray-800/70 backdrop-blur-3xl border-r border-white/30 dark:border-gray-700/30 transition-all duration-500 min-h-screen z-50 shadow-2xl shadow-blue-500/20 relative overflow-hidden`}>
          {/* Animated background elements for sidebar */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <nav className="p-6 relative z-10">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-sm font-semibold transition-all duration-500 backdrop-blur-md border border-transparent relative overflow-hidden group ${
                      currentPage === item.id
                        ? 'bg-blue-500/40 dark:bg-blue-400/40 text-blue-800 dark:text-blue-200 border-r-4 border-blue-500 shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 hover:scale-105'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:shadow-xl hover:shadow-blue-500/30 hover:border-white/40 dark:hover:border-gray-600/40 hover:scale-105'
                    }`}
                  >
                    {/* Animated background for active item */}
                    {currentPage === item.id && (
                      <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`p-3 rounded-2xl backdrop-blur-sm border border-white/20 ${
                        currentPage === item.id
                          ? 'bg-blue-500/30 dark:bg-blue-400/30 shadow-lg shadow-blue-500/30'
                          : 'bg-white/30 dark:bg-gray-700/30 shadow-lg shadow-blue-500/10'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          currentPage === item.id
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      {sidebarOpen && (
                        <span className={`font-semibold transition-all duration-300 ${
                          currentPage === item.id
                            ? 'text-blue-800 dark:text-blue-200'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}