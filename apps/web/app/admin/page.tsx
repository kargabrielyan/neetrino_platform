'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Database, 
  ShoppingCart, 
  CreditCard, 
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalDemos: number;
  totalOrders: number;
  totalSubscriptions: number;
  totalPayments: number;
  totalRevenue: number;
  pendingOrders: number;
  activeSubscriptions: number;
  pendingPayments: number;
}

interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  amount?: number;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDemos: 0,
    totalOrders: 0,
    totalSubscriptions: 0,
    totalPayments: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeSubscriptions: 0,
    pendingPayments: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentItem[]>([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Загрузка данных dashboard...');

      // Получаем статистику
      const [demosRes, ordersRes, subscriptionsRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/demos').catch(() => null),
        fetch('/api/admin/orders').catch(() => null),
        fetch('/api/admin/subscriptions').catch(() => null),
        fetch('/api/admin/payments').catch(() => null)
      ]);

      let demos: any[] = [];
      let orders: any[] = [];
      let subscriptions: any[] = [];
      let payments: any[] = [];

      if (demosRes?.ok) {
        const data = await demosRes.json();
        demos = data.data || [];
      }
      if (ordersRes?.ok) {
        const data = await ordersRes.json();
        orders = data.data || [];
      }
      if (subscriptionsRes?.ok) {
        const data = await subscriptionsRes.json();
        subscriptions = data.data || [];
      }
      if (paymentsRes?.ok) {
        const data = await paymentsRes.json();
        payments = data.data || [];
      }

      // Подсчёт статистики
      const totalRevenue = payments
        .filter((p: any) => p.status === 'SUCCESS')
        .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

      setStats({
        totalDemos: demos.length,
        totalOrders: orders.length,
        totalSubscriptions: subscriptions.length,
        totalPayments: payments.length,
        totalRevenue,
        pendingOrders: orders.filter((o: any) => o.status === 'NEW').length,
        activeSubscriptions: subscriptions.filter((s: any) => s.status === 'ACTIVE').length,
        pendingPayments: payments.filter((p: any) => p.status === 'PENDING').length
      });

      // Последние заказы
      setRecentOrders(orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        title: order.customerName,
        subtitle: order.demo?.title || 'Без демо',
        status: order.status,
        amount: parseFloat(order.budget) || 0,
        date: new Date(order.createdAt).toLocaleDateString('ru-RU')
      })));

      // Последние подписки
      setRecentSubscriptions(subscriptions.slice(0, 5).map((sub: any) => ({
        id: sub.id,
        title: sub.customerName,
        subtitle: sub.demo?.title || 'Без демо',
        status: sub.status,
        amount: parseFloat(sub.monthlyPrice) || 0,
        date: new Date(sub.createdAt).toLocaleDateString('ru-RU')
      })));

      console.log('✅ Данные dashboard загружены');
    } catch (error) {
      console.error('❌ Ошибка загрузки dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      NEW: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: <AlertCircle className="w-3 h-3" /> },
      IN_PROGRESS: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <Clock className="w-3 h-3" /> },
      COMPLETED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle className="w-3 h-3" /> },
      ACTIVE: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle className="w-3 h-3" /> },
      PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <Clock className="w-3 h-3" /> },
      CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
      SUCCESS: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <CheckCircle className="w-3 h-3" /> }
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Обзор вашей платформы</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Demos */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Всего демо</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalDemos}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Заказы</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalOrders}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{stats.pendingOrders} ожидают</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Подписки</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSubscriptions}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stats.activeSubscriptions} активных</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Доход</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalRevenue.toLocaleString()} ֏
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{stats.totalPayments} платежей</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Последние заказы</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{order.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.subtitle}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Нет заказов
                </div>
              )}
            </div>
          </div>

          {/* Recent Subscriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Последние подписки</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentSubscriptions.length > 0 ? (
                recentSubscriptions.map((sub) => (
                  <div key={sub.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{sub.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{sub.subtitle}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(sub.status)}
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {sub.amount?.toLocaleString()} ֏/мес
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Нет подписок
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
