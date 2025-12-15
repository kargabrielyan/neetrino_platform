'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { RefreshCw, ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Subscription {
  id: string;
  customerName: string;
  customerEmail: string;
  fullPrice: number;
  monthlyPrice: number;
  currency: string;
  totalMonths: number;
  paidMonths: number;
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'COMPLETED';
  startDate: string;
  nextBillingDate: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  demo: {
    id: string;
    title: string;
    screenshotUrl: string;
    category: string;
    vendor?: {
      name: string;
    };
  };
}

const statusConfig = {
  PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ACTIVE: { label: 'Active', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  PAST_DUE: { label: 'Past Due', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

function SubscriptionsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const emailFromUrl = searchParams.get('email');
  const userEmail = session?.user?.email || emailFromUrl || '';

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      console.log('📥 Загрузка подписок для:', userEmail);

      const response = await fetch(`/api/subscriptions/my?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.data) {
        setSubscriptions(data.data);
        console.log('✅ Загружено подписок:', data.data.length);
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки подписок:', err);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      setCancellingId(subscriptionId);
      console.log('❌ Cancelling subscription:', subscriptionId);

      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      });

      if (response.ok) {
        console.log('✅ Subscription cancelled');
        fetchSubscriptions();
      } else {
        throw new Error('Cancel failed');
      }
    } catch (err) {
      console.error('❌ Error cancelling subscription:', err);
      alert('Failed to cancel subscription');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!userEmail) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <RefreshCw className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-ink mb-2">No Subscriptions Found</h1>
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
            <h1 className="text-2xl font-bold text-ink">My Subscriptions</h1>
            <p className="text-ink/60 text-sm">{userEmail}</p>
          </div>
        </div>

        {/* Загрузка */}
        {loading && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading subscriptions...</p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* Список подписок */}
        {!loading && subscriptions.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center">
            <RefreshCw className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">No Subscriptions</h2>
            <p className="text-ink/60 mb-6">You don't have any active subscriptions yet</p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Catalog
            </button>
          </div>
        )}

        {!loading && subscriptions.length > 0 && (
          <div className="space-y-4">
            {subscriptions.map((sub) => {
              const config = statusConfig[sub.status];
              const StatusIcon = config.icon;
              const paidAmount = Number(sub.monthlyPrice) * sub.paidMonths;
              const totalAmount = Number(sub.fullPrice);

              return (
                <div key={sub.id} className="glass rounded-2xl p-5 hover:glass-strong transition-all">
                  <div className="flex gap-4">
                    {/* Изображение */}
                    <div className="w-24 h-24 bg-a1/10 rounded-xl overflow-hidden flex-shrink-0">
                      {sub.demo.screenshotUrl ? (
                        <img
                          src={sub.demo.screenshotUrl}
                          alt={sub.demo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-a1/50 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-ink truncate">{sub.demo.title}</h3>
                          <p className="text-ink/50 text-sm">{sub.demo.category}</p>
                        </div>
                        <div className={`px-3 py-1 ${config.bg} rounded-full flex items-center gap-1.5`}>
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                        </div>
                      </div>

                      {/* Прогресс */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink/60">Paid: {sub.paidMonths} of {sub.totalMonths} months</span>
                          <span className="text-ink font-medium">{paidAmount.toLocaleString()} / {totalAmount.toLocaleString()} ֏</span>
                        </div>
                        <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-a1 rounded-full transition-all"
                            style={{ width: `${(sub.paidMonths / sub.totalMonths) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Детали */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
                        <span>Monthly: <strong className="text-ink">{Number(sub.monthlyPrice).toLocaleString()} ֏</strong></span>
                        {sub.nextBillingDate && sub.status === 'ACTIVE' && (
                          <span>Next payment: <strong className="text-ink">{formatDate(sub.nextBillingDate)}</strong></span>
                        )}
                        <span>Created: {formatDate(sub.createdAt)}</span>
                      </div>

                      {/* Кнопки */}
                      {sub.status === 'ACTIVE' && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleCancel(sub.id)}
                            disabled={cancellingId === sub.id}
                            className="px-4 py-2 glass text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-all disabled:opacity-50"
                          >
                            {cancellingId === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                          </button>
                        </div>
                      )}
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

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    }>
      <SubscriptionsContent />
    </Suspense>
  );
}











