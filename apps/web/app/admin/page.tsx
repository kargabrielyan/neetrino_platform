'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [activeTab, setActiveTab] = useState('demos');
  const [loading, setLoading] = useState(false);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tabs = [
    { id: 'demos', label: 'Demos', icon: Database },
    { id: 'orders', label: 'Orders', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
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
      }
    } catch (error) {
      console.error('Error fetching demos:', error);
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

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/orders/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, []);

  // Загружаем данные при изменении активной вкладки
  useEffect(() => {
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
  }, [activeTab, fetchDemos, fetchOrders, fetchVendors, fetchStatistics]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Manage demos, vendors, and settings</p>
        </div>

        {/* Вкладки */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-black'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
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
              <h2 className="text-xl font-semibold text-white">Demo Management</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Demo
                </button>
                <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                  Import
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search demos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              >
                <option value="" className="text-black">All Statuses</option>
                <option value="active" className="text-black">Active</option>
                <option value="draft" className="text-black">Drafts</option>
                <option value="deleted" className="text-black">Deleted</option>
              </select>
            </div>

            {/* Таблица демо */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-white/70 mt-4">Loading demos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Title</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Vendor</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Views</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demos.length > 0 ? (
                        demos.map((demo) => (
                          <tr key={demo.id} className="border-t border-white/10">
                            <td className="px-4 py-3 text-white">{demo.title}</td>
                            <td className="px-4 py-3 text-white/80">{demo.vendor?.name || 'Unknown'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                demo.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : demo.status === 'draft'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {demo.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/80">{demo.viewCount || 0}</td>
                            <td className="px-4 py-3 text-white/80">
                              {new Date(demo.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-white/50 hover:text-white transition-colors" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-white/50 hover:text-white transition-colors" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <a
                                  href={demo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-white/50 hover:text-white transition-colors"
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
                          <td colSpan={6} className="px-4 py-8 text-center text-white/70">
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
              <h2 className="text-xl font-semibold text-white">Order Management</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  New Order
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary/50"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              >
                <option value="" className="text-black">All Statuses</option>
                <option value="new" className="text-black">New</option>
                <option value="in_progress" className="text-black">In Progress</option>
                <option value="discussion" className="text-black">Discussion</option>
                <option value="in_work" className="text-black">In Work</option>
                <option value="ready" className="text-black">Ready</option>
                <option value="completed" className="text-black">Completed</option>
                <option value="cancelled" className="text-black">Cancelled</option>
              </select>
            </div>

            {/* Таблица заказов */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-white/70 mt-4">Loading orders...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Demo</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Budget</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="border-t border-white/10">
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-white font-medium">{order.customerName}</div>
                                <div className="text-white/60 text-sm flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {order.customerEmail}
                                </div>
                                {order.customerPhone && (
                                  <div className="text-white/60 text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {order.customerPhone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-white">{order.demo?.title || 'Unknown Demo'}</div>
                              <div className="text-white/60 text-sm">{order.demo?.vendor?.name || 'Unknown Vendor'}</div>
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
                            <td className="px-4 py-3 text-white/80">
                              {order.budget ? (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {order.budget.toLocaleString()}
                                </div>
                              ) : (
                                <span className="text-white/50">Not specified</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-white/80">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-white/50 hover:text-white transition-colors" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-white/50 hover:text-white transition-colors" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-white/70">
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
            <h2 className="text-xl font-semibold text-white mb-6">Vendor Management</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-white/70 mt-4">Loading vendors...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Website</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Demos</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Created</th>
                        <th className="px-4 py-3 text-left text-white/70 font-medium">Actions</th>
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
                                  <div className="text-white font-medium">{vendor.name}</div>
                                  <div className="text-white/60 text-sm">{vendor.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <a 
                                href={vendor.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Visit
                              </a>
                            </td>
                            <td className="px-4 py-3 text-white/80">{vendor.demoCount || 0}</td>
                            <td className="px-4 py-3 text-white/80">
                              {new Date(vendor.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-white/50 hover:text-white transition-colors" title="Edit">
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
            <h2 className="text-xl font-semibold text-white mb-6">Analytics</h2>
            
            {/* Статистика заказов */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white/70 text-sm mb-2">Total Orders</h3>
                  <p className="text-2xl font-bold text-white">{statistics.total}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white/70 text-sm mb-2">Recent (7 days)</h3>
                  <p className="text-2xl font-bold text-blue-400">{statistics.recent}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white/70 text-sm mb-2">Avg Budget</h3>
                  <p className="text-2xl font-bold text-green-400">
                    ${statistics.averageBudget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h3 className="text-white/70 text-sm mb-2">Completed</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {statistics.byStatus.completed || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Статистика по статусам */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white/70 text-sm mb-2">New Orders</h4>
                  <p className="text-xl font-bold text-blue-400">{statistics.byStatus.new || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white/70 text-sm mb-2">In Progress</h4>
                  <p className="text-xl font-bold text-yellow-400">{statistics.byStatus.in_progress || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white/70 text-sm mb-2">In Work</h4>
                  <p className="text-xl font-bold text-orange-400">{statistics.byStatus.in_work || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white/70 text-sm mb-2">Cancelled</h4>
                  <p className="text-xl font-bold text-red-400">{statistics.byStatus.cancelled || 0}</p>
                </div>
              </div>
            )}

            {/* Статистика демо */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Demos</h3>
                <p className="text-2xl font-bold text-white">{demos.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Active Demos</h3>
                <p className="text-2xl font-bold text-green-400">
                  {demos.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white/70 text-sm mb-2">Total Vendors</h3>
                <p className="text-2xl font-bold text-blue-400">{vendors.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <Settings className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Settings section in development</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}