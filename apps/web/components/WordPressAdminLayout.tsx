'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  MessageSquare
} from 'lucide-react';

interface WordPressAdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function WordPressAdminLayout({ children, currentPage = 'dashboard' }: WordPressAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Neetrino Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
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

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 min-h-screen`}>
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                  
                  {/* Submenu */}
                  {sidebarOpen && item.children.length > 0 && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleMenuClick(child.href)}
                            className="w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
