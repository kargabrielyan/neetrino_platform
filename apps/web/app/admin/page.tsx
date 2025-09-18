'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { 
  Users, 
  Database, 
  Settings, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  Mail,
  Phone
} from 'lucide-react';

// Интерфейсы для типизации
interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'active' | 'draft' | 'deleted';
  category: string;
  subcategory: string;
  imageUrl: string;
  screenshotUrl: string;
  viewCount: number;
  isAccessible: boolean;
  vendor: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  demo: Demo;
  requirements?: string;
  budget?: number;
  status: 'new' | 'in_progress' | 'discussion' | 'in_work' | 'ready' | 'cancelled' | 'completed';
  notes?: string;
  assignedTo?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: string;
  name: string;
  website: string;
  description: string;
  logoUrl: string;
  demoCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  total: number;
  byStatus: Record<string, number>;
  recent: number;
  averageBudget: number;
}

export default function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('demos');
  const [loading, setLoading] = useState(false);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  const tabs = [
    { id: 'demos', label: 'Demos', icon: Database },
    { id: 'orders', label: 'Orders', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Fallback данные для демо
  const fallbackDemos: Demo[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce platform with advanced features',
      url: 'https://example-store.com',
      status: 'active',
      category: 'E-commerce',
      subcategory: 'Online Store',
      imageUrl: 'https://api.placeholder.com/400/300',
      screenshotUrl: 'https://api.placeholder.com/800/600',
      viewCount: 150,
      isAccessible: true,
      vendor: {
        id: '1',
        name: 'Shopify',
        website: 'https://shopify.com',
        logoUrl: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-logo.png',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Portfolio Website',
      description: 'Creative portfolio website with modern design',
      url: 'https://example-portfolio.com',
      status: 'draft',
      category: 'Portfolio',
      subcategory: 'Creative',
      imageUrl: 'https://api.placeholder.com/400/300',
      screenshotUrl: 'https://api.placeholder.com/800/600',
      viewCount: 89,
      isAccessible: true,
      vendor: {
        id: '2',
        name: 'Webflow',
        website: 'https://webflow.com',
        logoUrl: 'https://uploads-ssl.webflow.com/5d3e265ac8bcb6bc2f86b3c6/5d5595354c65721b5a0b8e0c_webflow-logo.png',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Blog Platform',
      description: 'Content management system for bloggers',
      url: 'https://example-blog.com',
      status: 'active',
      category: 'Blog',
      subcategory: 'CMS',
      imageUrl: 'https://api.placeholder.com/400/300',
      screenshotUrl: 'https://api.placeholder.com/800/600',
      viewCount: 234,
      isAccessible: true,
      vendor: {
        id: '3',
        name: 'WordPress',
        website: 'https://wordpress.org',
        logoUrl: 'https://s.w.org/images/wmark.png',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Функции для загрузки данных
  const fetchDemos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`http://localhost:3001/demos?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDemos(data.data || []);
      } else {
        // Fallback к тестовым данным
        let filteredDemos = fallbackDemos;
        
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.toLowerCase();
          filteredDemos = filteredDemos.filter(demo => 
            demo.title.toLowerCase().includes(searchTerm) ||
            demo.description.toLowerCase().includes(searchTerm) ||
            demo.vendor.name.toLowerCase().includes(searchTerm)
          );
        }
        
        if (statusFilter) {
          filteredDemos = filteredDemos.filter(demo => demo.status === statusFilter);
        }
        
        setDemos(filteredDemos);
      }
    } catch (error) {
      console.error('Error fetching demos:', error);
      // Fallback к тестовым данным при ошибке
      let filteredDemos = fallbackDemos;
      
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase();
        filteredDemos = filteredDemos.filter(demo => 
          demo.title.toLowerCase().includes(searchTerm) ||
          demo.description.toLowerCase().includes(searchTerm) ||
          demo.vendor.name.toLowerCase().includes(searchTerm)
        );
      }
      
      if (statusFilter) {
        filteredDemos = filteredDemos.filter(demo => demo.status === statusFilter);
      }
      
      setDemos(filteredDemos);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`http://localhost:3001/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Fallback данные для вендоров
  const fallbackVendors: Vendor[] = [
    {
      id: '1',
      name: 'Shopify',
      website: 'https://shopify.com',
      description: 'E-commerce platform for online stores',
      logoUrl: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-logo.png',
      demoCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Webflow',
      website: 'https://webflow.com',
      description: 'Visual web design platform',
      logoUrl: 'https://uploads-ssl.webflow.com/5d3e265ac8bcb6bc2f86b3c6/5d5595354c65721b5a0b8e0c_webflow-logo.png',
      demoCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'WordPress',
      website: 'https://wordpress.org',
      description: 'Open source content management system',
      logoUrl: 'https://s.w.org/images/wmark.png',
      demoCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.data || []);
      } else {
        // Fallback к тестовым данным
        setVendors(fallbackVendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Fallback к тестовым данным при ошибке
      setVendors(fallbackVendors);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fallback данные для статистики
  const fallbackStatistics: Statistics = {
    total: 0,
    byStatus: {
      new: 0,
      in_progress: 0,
      discussion: 0,
      in_work: 0,
      ready: 0,
      cancelled: 0,
      completed: 0,
    },
    recent: 0,
    averageBudget: 0,
  };

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3002/orders/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        // Fallback к тестовым данным
        setStatistics(fallbackStatistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback к тестовым данным при ошибке
      setStatistics(fallbackStatistics);
    }
  }, []);

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setAdminUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // Загружаем данные при изменении активной вкладки
  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch (activeTab) {
      case 'demos':
        fetchDemos();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'vendors':
        fetchVendors();
        break;
      case 'analytics':
        fetchStatistics();
        break;
    }
  }, [activeTab, fetchDemos, fetchOrders, fetchVendors, fetchStatistics, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Checking authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="glass p-6 rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-ink mb-2">Admin Panel</h1>
                <p className="text-ink/70">Manage demos, vendors, and settings</p>
                {adminUser && (
                  <p className="text-sm text-ink/60 mt-1">
                    Welcome, <span className="font-medium text-ink">{adminUser.name}</span>
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 glass-subtle text-ink rounded-lg hover:glass-strong transition-colors focus-ring"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus-ring ${
                  activeTab === tab.id
                    ? 'glass-strong text-ink'
                    : 'glass text-ink/70 hover:text-ink hover:glass-strong'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'demos' && (
          <div>
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-ink">Demo Management</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 glass-strong text-ink rounded-lg font-medium hover:glass transition-colors focus-ring">
                  <Plus className="w-4 h-4" />
                  Add Demo
                </button>
                <button className="px-4 py-2 glass text-ink rounded-lg hover:glass-strong transition-colors focus-ring">
                  Import
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                <input
                  type="text"
                  placeholder="Search demos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-subtle rounded-lg text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 glass-subtle rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Drafts</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            {/* Таблица демо */}
            <div className="glass rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
                  <p className="text-ink/70 mt-4">Loading demos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="glass-subtle">
                      <tr>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Title</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Vendor</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Views</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demos.length > 0 ? (
                        demos.map((demo) => (
                          <tr key={demo.id} className="border-t border-ink/10">
                            <td className="px-4 py-3 text-ink">{demo.title}</td>
                            <td className="px-4 py-3 text-ink/80">{demo.vendor?.name || 'Unknown'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                demo.status === 'active' 
                                  ? 'bg-green-500/20 text-green-600' 
                                  : demo.status === 'draft'
                                  ? 'bg-yellow-500/20 text-yellow-600'
                                  : 'bg-red-500/20 text-red-600'
                              }`}>
                                {demo.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ink/80">{demo.viewCount || 0}</td>
                            <td className="px-4 py-3 text-ink/80">
                              {new Date(demo.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <a
                                  href={demo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded"
                                  title="Open Demo"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-ink/70">
                            No demos found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-ink">Order Management</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 glass-strong text-ink rounded-lg font-medium hover:glass transition-colors focus-ring">
                  <Plus className="w-4 h-4" />
                  New Order
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 glass-subtle rounded-lg text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 glass-subtle rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="discussion">Discussion</option>
                <option value="in_work">In Work</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Таблица заказов */}
            <div className="glass rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
                  <p className="text-ink/70 mt-4">Loading orders...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="glass-subtle">
                      <tr>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Demo</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Budget</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="border-t border-ink/10">
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-ink font-medium">{order.customerName}</div>
                                <div className="text-ink/60 text-sm flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {order.customerEmail}
                                </div>
                                {order.customerPhone && (
                                  <div className="text-ink/60 text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {order.customerPhone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-ink">{order.demo?.title || 'Unknown Demo'}</div>
                              <div className="text-ink/60 text-sm">{order.demo?.vendor?.name || 'Unknown Vendor'}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'new' 
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : order.status === 'in_progress'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : order.status === 'completed'
                                  ? 'bg-green-500/20 text-green-400'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-ink/80">
                              {order.budget ? (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {order.budget.toLocaleString()}
                                </div>
                              ) : (
                                <span className="text-ink/50">Not specified</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-ink/80">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-ink/70">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-6">Vendor Management</h2>
            <div className="glass rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
                  <p className="text-ink/70 mt-4">Loading vendors...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="glass-subtle">
                      <tr>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Website</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Demos</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-ink/70 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.length > 0 ? (
                        vendors.map((vendor) => (
                          <tr key={vendor.id} className="border-t border-white/10">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {vendor.logoUrl && (
                                  <img 
                                    src={vendor.logoUrl} 
                                    alt={vendor.name}
                                    className="w-8 h-8 rounded object-contain"
                                  />
                                )}
                                <div>
                                  <div className="text-ink font-medium">{vendor.name}</div>
                                  <div className="text-ink/60 text-sm">{vendor.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <a 
                                href={vendor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-a1 hover:text-a1/80 transition-colors flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Visit
                              </a>
                            </td>
                            <td className="px-4 py-3 text-ink/80">{vendor.demoCount || 0}</td>
                            <td className="px-4 py-3 text-ink/80">
                              {new Date(vendor.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-ink/50 hover:text-ink transition-colors focus-ring rounded" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-white/70">
                            No vendors found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-6">Analytics</h2>
            
            {/* Статистика заказов */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass rounded-lg p-6">
                  <h3 className="text-ink/70 text-sm mb-2">Total Orders</h3>
                  <p className="text-2xl font-bold text-ink">{statistics.total}</p>
                </div>
                <div className="glass rounded-lg p-6">
                  <h3 className="text-ink/70 text-sm mb-2">Recent (7 days)</h3>
                  <p className="text-2xl font-bold text-a1">{statistics.recent}</p>
                </div>
                <div className="glass rounded-lg p-6">
                  <h3 className="text-ink/70 text-sm mb-2">Avg Budget</h3>
                  <p className="text-2xl font-bold text-a1">
                    ${statistics.averageBudget.toLocaleString()}
                  </p>
                </div>
                <div className="glass rounded-lg p-6">
                  <h3 className="text-ink/70 text-sm mb-2">Completed</h3>
                  <p className="text-2xl font-bold text-a1">
                    {statistics.byStatus.completed || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Статистика по статусам */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-ink/70 text-sm mb-2">New Orders</h4>
                  <p className="text-xl font-bold text-a1">{statistics.byStatus.new || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-ink/70 text-sm mb-2">In Progress</h4>
                  <p className="text-xl font-bold text-a4">{statistics.byStatus.in_progress || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-ink/70 text-sm mb-2">In Work</h4>
                  <p className="text-xl font-bold text-a3">{statistics.byStatus.in_work || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-ink/70 text-sm mb-2">Cancelled</h4>
                  <p className="text-xl font-bold text-a3">{statistics.byStatus.cancelled || 0}</p>
                </div>
              </div>
            )}

            {/* Статистика демо */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Demos</h3>
                <p className="text-2xl font-bold text-ink">{demos.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Active Demos</h3>
                <p className="text-2xl font-bold text-a1">
                  {demos.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Vendors</h3>
                <p className="text-2xl font-bold text-a1">{vendors.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-6">Settings</h2>
            <div className="glass rounded-lg p-8 text-center">
              <Settings className="w-12 h-12 text-ink/30 mx-auto mb-4" />
              <p className="text-ink/70">Settings section in development</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}