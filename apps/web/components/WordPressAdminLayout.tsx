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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/10">
      {/* Top Bar */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors backdrop-blur-sm"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">Neetrino Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors backdrop-blur-sm"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors relative backdrop-blur-sm">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
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
        } bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 min-h-screen z-50 shadow-xl md:shadow-none`}>
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                      currentPage === item.id
                        ? 'bg-blue-500/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:shadow-md hover:shadow-gray-500/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                  
                  {/* Submenu with hover delay */}
                  {item.children.length > 0 && (
                    <div 
                      className={`absolute left-full top-0 ml-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl py-2 min-w-48 z-50 transition-all duration-300 ${
                        hoveredMenu === item.id ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                      }`}
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleMenuClick(child.href)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-lg mx-2"
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
        <div className="flex-1 p-4 md:p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
