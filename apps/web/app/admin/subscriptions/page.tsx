'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  Search, 
  Eye,
  X,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  demoId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  fullPrice: number;
  monthlyPrice: number;
  currency: string;
  totalMonths: number;
  paidMonths: number;
  status: string;
  startDate?: string;
  nextBillingDate?: string;
  cancelledAt?: string;
  completedAt?: string;
  notes?: string;
  demo?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SUBSCRIPTION_STATUSES = [
  { value: 'PENDING', label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  { value: 'ACTIVE', label: 'Активная', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  { value: 'PAST_DUE', label: 'Просрочена', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  { value: 'CANCELLED', label: 'Отменена', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  { value: 'COMPLETED', label: 'Завершена', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle }
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📦 Загрузка подписок...');
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/subscriptions?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSubscriptions(result.data || []);
        console.log('✅ Загружено подписок:', result.data?.length || 0);
      } else {
        console.error('❌ Ошибка загрузки:', result.error);
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const openModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubscription(null);
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Вы уверены, что хотите отменить эту подписку?')) return;

    try {
      console.log('🚫 Отмена подписки:', id);
      
      const response = await fetch(`/api/admin/subscriptions/${id}/cancel`, {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Подписка отменена');
        await fetchSubscriptions();
        closeModal();
      } else {
        console.error('❌ Ошибка:', result.error);
        alert('Ошибка: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      alert('Произошла ошибка');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = SUBSCRIPTION_STATUSES.find(s => s.value === status);
    const Icon = statusConfig?.icon || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon className="w-3 h-3" />
        {statusConfig?.label || status}
      </span>
    );
  };

  const getProgressBar = (paid: number, total: number) => {
    const percentage = (paid / total) * 100;
    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{paid} из {total} мес</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Управление подписками</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все статусы</option>
              {SUBSCRIPTION_STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Загрузка...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Клиент</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Демо</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Прогресс</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Цена</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subscriptions.length > 0 ? (
                    subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{sub.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              {sub.customerEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {sub.demo?.title || 'Без демо'}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(sub.status)}
                        </td>
                        <td className="px-6 py-4 min-w-[150px]">
                          {getProgressBar(sub.paidMonths, sub.totalMonths)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {Number(sub.monthlyPrice).toLocaleString()} ֏/мес
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Всего: {Number(sub.fullPrice).toLocaleString()} ֏
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(sub)}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                              title="Подробнее"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Подписки не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Подписка #{selectedSubscription.id.slice(0, 8)}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Статус:</span>
                {getStatusBadge(selectedSubscription.status)}
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Клиент
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Имя:</span> {selectedSubscription.customerName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {selectedSubscription.customerEmail}
                  </p>
                  {selectedSubscription.customerPhone && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Телефон:</span> {selectedSubscription.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Детали подписки
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Демо:</span> {selectedSubscription.demo?.title || 'Без демо'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Ежемесячный платёж:</span> {Number(selectedSubscription.monthlyPrice).toLocaleString()} ֏
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Полная стоимость:</span> {Number(selectedSubscription.fullPrice).toLocaleString()} ֏
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Срок:</span> {selectedSubscription.totalMonths} месяцев
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Прогресс оплаты</h3>
                {getProgressBar(selectedSubscription.paidMonths, selectedSubscription.totalMonths)}
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Даты
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Создана:</span> {new Date(selectedSubscription.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  {selectedSubscription.startDate && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Начало:</span> {new Date(selectedSubscription.startDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                  {selectedSubscription.nextBillingDate && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Следующий платёж:</span> {new Date(selectedSubscription.nextBillingDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedSubscription.notes && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Заметки</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedSubscription.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              {selectedSubscription.status === 'ACTIVE' && (
                <button
                  onClick={() => handleCancelSubscription(selectedSubscription.id)}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  Отменить подписку
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}




