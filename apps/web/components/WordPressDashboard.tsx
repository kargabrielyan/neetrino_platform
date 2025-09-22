'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Database, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';

interface DashboardStats {
  totalDemos: number;
  totalOrders: number;
  totalVendors: number;
  totalRevenue: number;
  recentOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  demoTitle: string;
  status: string;
  amount: number;
  date: string;
}

export default function WordPressDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDemos: 0,
    totalOrders: 0,
    totalVendors: 0,
    totalRevenue: 0,
    recentOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'fallback' | 'error'>('fallback');

  useEffect(() => {
    // Fetch dashboard data with better error handling
    const fetchDashboardData = async () => {
      try {
        // Try to fetch statistics with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
          const statsResponse = await fetch('http://localhost:3002/orders/statistics', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats({
              totalDemos: 150, // Mock data
              totalOrders: statsData.total || 0,
              totalVendors: 25, // Mock data
              totalRevenue: statsData.averageBudget * statsData.total || 0,
              recentOrders: statsData.recent || 0,
              pendingOrders: statsData.byStatus?.new || 0,
              completedOrders: statsData.byStatus?.completed || 0,
              averageOrderValue: statsData.averageBudget || 0
            });
            setApiStatus('connected');
          } else {
            throw new Error('Stats API not available');
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw new Error('API connection failed');
        }

        // Try to fetch recent orders
        try {
          const ordersController = new AbortController();
          const ordersTimeoutId = setTimeout(() => ordersController.abort(), 5000);
          
          const ordersResponse = await fetch('http://localhost:3002/orders', {
            signal: ordersController.signal
          });
          clearTimeout(ordersTimeoutId);
          
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setRecentOrders(ordersData.slice(0, 5).map((order: any) => ({
              id: order.id,
              customerName: order.customerName,
              demoTitle: order.demo?.title || 'Unknown Demo',
              status: order.status,
              amount: order.budget || 0,
              date: new Date(order.createdAt).toLocaleDateString()
            })));
          }
        } catch (ordersError) {
          console.log('Orders API not available, using fallback data');
        }

      } catch (error) {
        console.log('Using fallback dashboard data - API not available');
        setApiStatus('fallback');
        // Set fallback data immediately
        setStats({
          totalDemos: 150,
          totalOrders: 45,
          totalVendors: 25,
          totalRevenue: 125000,
          recentOrders: 8,
          pendingOrders: 12,
          completedOrders: 28,
          averageOrderValue: 2800
        });
        setRecentOrders([
          {
            id: '1',
            customerName: 'John Doe',
            demoTitle: 'E-commerce Store',
            status: 'new',
            amount: 2500,
            date: '2024-01-15'
          },
          {
            id: '2',
            customerName: 'Jane Smith',
            demoTitle: 'Restaurant Website',
            status: 'in_progress',
            amount: 1800,
            date: '2024-01-14'
          },
          {
            id: '3',
            customerName: 'Mike Johnson',
            demoTitle: 'Portfolio Site',
            status: 'completed',
            amount: 3200,
            date: '2024-01-13'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Welcome to Neetrino Admin</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex items-center gap-2">
            {apiStatus === 'connected' && (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">API Connected</span>
              </div>
            )}
            {apiStatus === 'fallback' && (
              <div className="flex items-center gap-2 text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Demo Data</span>
              </div>
            )}
            {apiStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">API Error</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Total Demos */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30 hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
          {/* Animated background */}
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Demos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalDemos}</p>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <Database className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-medium">+12%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-green-500/10 border border-white/30 dark:border-gray-700/30 hover:shadow-3xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalOrders}</p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-medium">+8%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-yellow-500/10 border border-white/30 dark:border-gray-700/30 hover:shadow-3xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <DollarSign className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-600 dark:text-green-400 font-medium">+15%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl shadow-purple-500/10 border border-white/30 dark:border-gray-700/30 hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${stats.averageOrderValue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/20">
              <BarChart3 className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm relative z-10">
            <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-600 dark:text-red-400 font-medium">-2%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Orders */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/30 dark:border-gray-700/30 overflow-hidden relative group">
          {/* Animated background */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="p-8 border-b border-white/20 dark:border-gray-700/20 relative z-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.demoTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${order.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                View all orders →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Demo</p>
              </button>
              <button className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Vendor</p>
              </button>
              <button className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">View Analytics</p>
              </button>
              <button className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm hover:shadow-md">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Settings</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
