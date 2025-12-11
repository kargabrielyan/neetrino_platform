'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { CreditCard, Package, RefreshCw, User, ChevronRight, Mail, Heart } from 'lucide-react';

export default function MyAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    subscriptions: 0,
    payments: 0,
    orders: 0,
    wishlist: 0,
  });

  // Загружаем количество товаров в избранном
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist_ids');
    if (savedWishlist) {
      try {
        const ids = JSON.parse(savedWishlist);
        setStats(prev => ({ ...prev, wishlist: ids.length }));
      } catch (e) {
        console.error('Ошибка загрузки избранного:', e);
      }
    }
  }, []);

  // Если пользователь авторизован, загружаем статистику
  useEffect(() => {
    if (session?.user?.email) {
      fetchStats(session.user.email);
    }
  }, [session]);

  const fetchStats = async (userEmail: string) => {
    try {
      console.log('📊 Загрузка статистики для:', userEmail);
      
      const [subsRes, paymentsRes] = await Promise.all([
        fetch(`/api/subscriptions?email=${encodeURIComponent(userEmail)}`),
        fetch(`/api/payments?email=${encodeURIComponent(userEmail)}`),
      ]);

      const subsData = await subsRes.json();
      const paymentsData = await paymentsRes.json();

      setStats({
        subscriptions: subsData.total || 0,
        payments: paymentsData.total || 0,
        orders: 0, // TODO: Добавить orders endpoint
      });
    } catch (error) {
      console.error('❌ Ошибка загрузки статистики:', error);
    }
  };

  const handleEmailSearch = async () => {
    if (!email.trim() || !email.includes('@')) return;
    
    setIsSearching(true);
    await fetchStats(email);
    setIsSearching(false);
    
    // Сохраняем email в localStorage для использования на других страницах
    localStorage.setItem('guest_email', email);
  };

  const menuItems = [
    {
      title: 'Wishlist',
      description: 'Your favorite items',
      icon: Heart,
      href: '/my-account/wishlist',
      count: stats.wishlist,
      color: 'bg-red-500',
    },
    {
      title: 'My Subscriptions',
      description: 'Active and completed subscriptions',
      icon: RefreshCw,
      href: '/my-account/subscriptions',
      count: stats.subscriptions,
      color: 'bg-blue-500',
    },
    {
      title: 'Payment History',
      description: 'All subscription payments',
      icon: CreditCard,
      href: '/my-account/payments',
      count: stats.payments,
      color: 'bg-green-500',
    },
    {
      title: 'My Orders',
      description: 'Website development orders',
      icon: Package,
      href: '/my-account/orders',
      count: stats.orders,
      color: 'bg-purple-500',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Заголовок */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-a1/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-a1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">My Account</h1>
              {session?.user ? (
                <p className="text-ink/70">
                  {session.user.name || session.user.email}
                </p>
              ) : (
                <p className="text-ink/70">
                  Enter your email to view your subscriptions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Если пользователь не авторизован - форма поиска по email */}
        {!session?.user && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-a1" />
              Find My Subscriptions
            </h2>
            <p className="text-ink/60 text-sm mb-4">
              Enter the email you used when subscribing
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-4 py-3 glass-subtle rounded-xl text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleEmailSearch()}
              />
              <button
                onClick={handleEmailSearch}
                disabled={isSearching || !email.includes('@')}
                className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Find'}
              </button>
            </div>
          </div>
        )}

        {/* Меню */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                // Передаём email в URL если не авторизован
                const emailParam = !session?.user && email ? `?email=${encodeURIComponent(email)}` : '';
                router.push(item.href + emailParam);
              }}
              className="w-full glass rounded-2xl p-5 hover:glass-strong transition-all flex items-center gap-4 text-left group"
            >
              <div className={`w-12 h-12 ${item.color}/20 rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  {item.count > 0 && (
                    <span className="px-2 py-0.5 bg-a1/20 text-a1 text-xs font-medium rounded-full">
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="text-ink/60 text-sm">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-ink/30 group-hover:text-ink/60 transition-colors" />
            </button>
          ))}
        </div>

        {/* Sign in hint */}
        {!session?.user && (
          <div className="mt-8 text-center">
            <p className="text-ink/50 text-sm">
              <a href="/auth/signin" className="text-a1 hover:underline">Sign in</a>
              {' '}for full access to your account
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

