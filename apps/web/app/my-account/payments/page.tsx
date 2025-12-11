'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { CreditCard, ArrowLeft, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  monthNumber: number;
  paidAt: string | null;
  dueDate: string | null;
  paymentMethod: string | null;
  createdAt: string;
  subscription: {
    id: string;
    customerName: string;
    demo: {
      id: string;
      title: string;
      screenshotUrl: string;
    };
  };
}

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  SUCCESS: { label: 'Paid', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  FAILED: { label: 'Failed', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  REFUNDED: { label: 'Refunded', icon: RotateCcw, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export default function PaymentsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const emailFromUrl = searchParams.get('email');
  const userEmail = session?.user?.email || emailFromUrl || '';

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      fetchPayments();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      console.log('📥 Загрузка платежей для:', userEmail);

      const response = await fetch(`/api/payments/my?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.data) {
        setPayments(data.data);
        console.log('✅ Загружено платежей:', data.data.length);
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки платежей:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Общая сумма успешных платежей
  const totalPaid = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (!userEmail) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <CreditCard className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-ink mb-2">No Payments Found</h1>
            <p className="text-ink/60 mb-6">Sign in or enter your email on the account page</p>
            <button
              onClick={() => router.push('/my-account')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Account
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/my-account')}
            className="p-2 glass rounded-xl hover:glass-strong transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-ink">Payment History</h1>
            <p className="text-ink/60 text-sm">{userEmail}</p>
          </div>
        </div>

        {/* Статистика */}
        {!loading && payments.length > 0 && (
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ink/60 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-a1">{totalPaid.toLocaleString()} ֏</p>
              </div>
              <div className="text-right">
                <p className="text-ink/60 text-sm">Payments</p>
                <p className="text-2xl font-bold text-ink">{payments.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Загрузка */}
        {loading && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading payments...</p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* Список платежей */}
        {!loading && payments.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center">
            <CreditCard className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">No Payments</h2>
            <p className="text-ink/60 mb-6">Payment history is empty</p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Catalog
            </button>
          </div>
        )}

        {!loading && payments.length > 0 && (
          <div className="space-y-3">
            {payments.map((payment) => {
              const config = statusConfig[payment.status];
              const StatusIcon = config.icon;

              return (
                <div key={payment.id} className="glass rounded-2xl p-4 hover:glass-strong transition-all">
                  <div className="flex items-center gap-4">
                    {/* Иконка статуса */}
                    <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-ink truncate">
                          {payment.subscription.demo.title}
                        </span>
                        <span className="text-ink/50 text-sm">
                          Month {payment.monthNumber}
                        </span>
                      </div>
                      <div className="text-ink/50 text-sm">
                        {payment.paidAt ? (
                          <>
                            {formatDate(payment.paidAt)} в {formatTime(payment.paidAt)}
                          </>
                        ) : (
                          formatDate(payment.createdAt)
                        )}
                        {payment.paymentMethod && (
                          <span className="ml-2">• {payment.paymentMethod}</span>
                        )}
                      </div>
                    </div>

                    {/* Сумма и статус */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-ink text-lg">
                        {Number(payment.amount).toLocaleString()} {payment.currency}
                      </div>
                      <div className={`text-sm ${config.color}`}>
                        {config.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}











