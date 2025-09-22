'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTheme } from '../lib/use-admin-theme';
import { 
  LayoutDashboard,
  Database,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  ShoppingCart,
  Tag,
  Image,
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';

interface WordPressAdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function WordPressAdminLayout({ children, currentPage = 'dashboard' }: WordPressAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
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
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      href: '/admin?tab=orders',
      children: [
        { id: 'all-orders', label: 'All Orders', href: '/admin?tab=orders' },
        { id: 'new-orders', label: 'New Orders', href: '/admin?tab=orders&status=new' },
        { id: 'in-progress', label: 'In Progress', href: '/admin?tab=orders&status=in_progress' }
      ]
    },
    {
      id: 'vendors',
      label: 'Vendors',
      icon: Users,
      href: '/admin?tab=vendors',
      children: [
        { id: 'all-vendors', label: 'All Vendors', href: '/admin?tab=vendors' },
        { id: 'add-vendor', label: 'Add New', href: '/admin?tab=vendors&action=add' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/admin?tab=analytics',
      children: []
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/admin?tab=settings',
      children: [
        { id: 'general', label: 'General', href: '/admin?tab=settings&section=general' },
        { id: 'users', label: 'Users', href: '/admin?tab=settings&section=users' },
        { id: 'api', label: 'API Settings', href: '/admin?tab=settings&section=api' }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  const handleMouseEnter = (menuId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredMenu(menuId);
    }, 300); // 300ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoveredMenu(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Top Bar */}
      <div className="relative backdrop-blur-2xl bg-white/70 dark:bg-gray-800/70 border-b border-white/20 dark:border-gray-700/30 px-4 py-3 flex items-center justify-between shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/5">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 bg-blue-500/80 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 backdrop-blur-sm border border-white/20">
              <span className="text-white font-bold text-sm drop-shadow-lg">N</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 hidden sm:block">Neetrino Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-12 pr-6 py-3 border border-white/30 dark:border-gray-600/30 bg-white/40 dark:bg-gray-700/40 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 backdrop-blur-xl shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-3 rounded-xl hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 relative backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500/80 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Home className="w-4 h-4" />
                  View Site
                </button>
                <button
                  onClick={() => router.push('/admin?tab=settings&section=profile')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } ${
          sidebarOpen ? 'fixed md:relative' : 'fixed md:relative'
        } bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl border-r border-white/20 dark:border-gray-700/30 transition-all duration-500 min-h-screen z-50 shadow-2xl shadow-blue-500/20 md:shadow-xl md:shadow-blue-500/10`}>
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-500 backdrop-blur-md border border-transparent ${
                      currentPage === item.id
                        ? 'bg-blue-500/30 dark:bg-blue-400/30 text-blue-800 dark:text-blue-200 border-r-4 border-blue-500 shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/40 hover:shadow-xl hover:shadow-blue-500/20 hover:border-white/30 dark:hover:border-gray-600/30'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                  
                  {/* Submenu with hover delay */}
                  {item.children.length > 0 && (
                    <div 
                      className={`absolute left-full top-0 ml-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-2xl shadow-blue-500/20 py-3 min-w-52 z-50 transition-all duration-500 ${
                        hoveredMenu === item.id ? 'opacity-100 visible scale-100 translate-x-0' : 'opacity-0 invisible scale-95 -translate-x-2'
                      }`}
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleMenuClick(child.href)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 rounded-xl mx-2 hover:shadow-lg hover:shadow-blue-500/10"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 min-h-screen relative">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-0 bg-white/20 dark:bg-gray-800/20 rounded-3xl backdrop-blur-sm"></div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
