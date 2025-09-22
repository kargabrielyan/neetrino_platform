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
  Calendar
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

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await fetch('http://localhost:3002/orders/statistics');
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
        }

        // Fetch recent orders
        const ordersResponse = await fetch('http://localhost:3002/orders');
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
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Neetrino Admin</h1>
        <p className="text-gray-600">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Demos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Demos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDemos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${stats.averageOrderValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">-2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
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
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.demoTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${order.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all orders →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Database className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Demo</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Vendor</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">View Analytics</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Settings</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
