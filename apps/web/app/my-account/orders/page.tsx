'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Package, ArrowLeft, CheckCircle, Clock, XCircle, Hammer, MessageSquare } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  requirements: string | null;
  budget: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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

const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  NEW: { label: 'New', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  IN_PROGRESS: { label: 'Processing', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  DISCUSSION: { label: 'Discussion', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  IN_WORK: { label: 'In Progress', icon: Hammer, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const emailFromUrl = searchParams.get('email');
  const userEmail = session?.user?.email || emailFromUrl || '';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userEmail) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('📥 Загрузка заказов для:', userEmail);

      const response = await fetch(`/api/orders?customerEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      if (data.data) {
        setOrders(data.data);
        console.log('✅ Загружено заказов:', data.data.length);
      }
    } catch (err) {
      console.error('❌ Ошибка загрузки заказов:', err);
      setError('Failed to load orders');
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

  if (!userEmail) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <Package className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-ink mb-2">No Orders Found</h1>
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
            <h1 className="text-2xl font-bold text-ink">My Orders</h1>
            <p className="text-ink/60 text-sm">{userEmail}</p>
          </div>
        </div>

        {/* Загрузка */}
        {loading && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading orders...</p>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {/* Список заказов */}
        {!loading && orders.length === 0 && (
          <div className="glass rounded-3xl p-8 text-center">
            <Package className="w-12 h-12 text-ink/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">No Orders</h2>
            <p className="text-ink/60 mb-6">You don't have any development orders yet</p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Catalog
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.NEW;
              const StatusIcon = config.icon;

              return (
                <div key={order.id} className="glass rounded-2xl p-5 hover:glass-strong transition-all">
                  <div className="flex gap-4">
                    {/* Изображение */}
                    <div className="w-20 h-20 bg-a1/10 rounded-xl overflow-hidden flex-shrink-0">
                      {order.demo?.screenshotUrl ? (
                        <img
                          src={order.demo.screenshotUrl}
                          alt={order.demo.title}
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
                          <h3 className="font-semibold text-ink truncate">{order.demo?.title || 'Order'}</h3>
                          <p className="text-ink/50 text-sm">#{order.id.slice(0, 8)}</p>
                        </div>
                        <div className={`px-3 py-1 ${config.bg} rounded-full flex items-center gap-1.5 flex-shrink-0`}>
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                        </div>
                      </div>

                      {/* Детали */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
                        {order.budget && (
                          <span>Budget: <strong className="text-ink">{Number(order.budget).toLocaleString()} ֏</strong></span>
                        )}
                        <span>Created: {formatDate(order.createdAt)}</span>
                        {order.demo?.category && (
                          <span>{order.demo.category}</span>
                        )}
                      </div>

                      {/* Требования */}
                      {order.requirements && (
                        <p className="mt-2 text-ink/70 text-sm line-clamp-2">
                          {order.requirements}
                        </p>
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











