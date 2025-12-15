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
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Payment {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  monthNumber: number;
  paidAt?: string;
  dueDate?: string;
  paymentMethod?: string;
  notes?: string;
  subscription?: {
    id: string;
    customerName: string;
    customerEmail: string;
    demo?: {
      id: string;
      title: string;
    };
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  { value: 'SUCCESS', label: 'Оплачен', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  { value: 'FAILED', label: 'Ошибка', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  { value: 'REFUNDED', label: 'Возврат', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: RefreshCw }
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    totalAmount: 0
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📦 Загрузка платежей...');
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data || [];
        setPayments(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          success: data.filter((p: Payment) => p.status === 'SUCCESS').length,
          pending: data.filter((p: Payment) => p.status === 'PENDING').length,
          totalAmount: data
            .filter((p: Payment) => p.status === 'SUCCESS')
            .reduce((sum: number, p: Payment) => sum + (parseFloat(String(p.amount)) || 0), 0)
        });
        
        console.log('✅ Загружено платежей:', data.length);
      } else {
        console.error('❌ Ошибка загрузки:', result.error);
        setPayments([]);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const openModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = PAYMENT_STATUSES.find(s => s.value === status);
    const Icon = statusConfig?.icon || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon className="w-3 h-3" />
        {statusConfig?.label || status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">История платежей</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Всего платежей</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Успешных</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.success}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ожидают</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Общая сумма</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.totalAmount.toLocaleString()} ֏</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по клиенту..."
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
              {PAYMENT_STATUSES.map(status => (
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Месяц</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Сумма</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {payment.subscription?.customerName || payment.user?.name || 'Неизвестно'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {payment.subscription?.customerEmail || payment.user?.email || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {payment.subscription?.demo?.title || 'Без демо'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          #{payment.monthNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {Number(payment.amount).toLocaleString()} {payment.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {payment.paidAt 
                            ? new Date(payment.paidAt).toLocaleDateString('ru-RU')
                            : new Date(payment.createdAt).toLocaleDateString('ru-RU')
                          }
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(payment)}
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
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Платежи не найдены
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
      {showModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Платёж #{selectedPayment.id.slice(0, 8)}
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
                {getStatusBadge(selectedPayment.status)}
              </div>

              {/* Amount */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center">
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Сумма платежа</p>
                <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                  {Number(selectedPayment.amount).toLocaleString()} {selectedPayment.currency}
                </p>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Клиент
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Имя:</span> {selectedPayment.subscription?.customerName || selectedPayment.user?.name || 'Неизвестно'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {selectedPayment.subscription?.customerEmail || selectedPayment.user?.email || '-'}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Детали платежа
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Демо:</span> {selectedPayment.subscription?.demo?.title || 'Без демо'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Месяц подписки:</span> #{selectedPayment.monthNumber}
                  </p>
                  {selectedPayment.paymentMethod && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Способ оплаты:</span> {selectedPayment.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Даты
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Создан:</span> {new Date(selectedPayment.createdAt).toLocaleString('ru-RU')}
                  </p>
                  {selectedPayment.paidAt && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Оплачен:</span> {new Date(selectedPayment.paidAt).toLocaleString('ru-RU')}
                    </p>
                  )}
                  {selectedPayment.dueDate && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Срок оплаты:</span> {new Date(selectedPayment.dueDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Заметки</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedPayment.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
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



