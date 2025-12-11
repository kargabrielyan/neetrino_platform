'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { CheckCircle, ArrowLeft, CreditCard, Calendar, Shield } from 'lucide-react';
import CountryCodeSelect from '../../../components/CountryCodeSelect';

interface Demo {
  id: string; // SKU для отображения
  uuid: string; // UUID для API
  title: string;
  description: string;
  url: string;
  category: string;
  imageUrl: string;
  screenshotUrl: string;
  regularPrice: number;
  salePrice?: number;
  vendor: {
    id: string;
    name: string;
    logoUrl: string;
  };
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  phoneCountryCode: string;
  notes: string;
}

export default function SubscribePage() {
  const params = useParams();
  const router = useRouter();
  const demoId = params?.id as string;

  const [demo, setDemo] = useState<Demo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    phoneCountryCode: '+374', // По умолчанию Армения
    notes: '',
  });

  // Загружаем данные о продукте
  useEffect(() => {
    const fetchDemo = async () => {
      if (!demoId) return;

      try {
        setLoading(true);
        setError(null);
        console.log('📥 [Subscribe] Загрузка демо по ID:', demoId);

        // Используем прямой API endpoint для получения демо по ID/SKU
        const demoResponse = await fetch(`/api/demos/${encodeURIComponent(demoId)}`);
        
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          
          if (demoData && demoData.id) {
            // Преобразуем данные в формат Demo
            const formattedDemo: Demo = {
              id: demoData.sku || demoData.id, // SKU для отображения
              uuid: demoData.id, // UUID для API (настоящий ID из базы)
              title: demoData.title,
              description: demoData.description || '',
              url: demoData.url,
              category: demoData.category || '',
              imageUrl: demoData.imageUrl || '',
              screenshotUrl: demoData.screenshotUrl || demoData.imageUrl || '',
              regularPrice: demoData.regularPrice ? Number(demoData.regularPrice) : 0,
              salePrice: demoData.salePrice ? Number(demoData.salePrice) : undefined,
              vendor: demoData.vendor ? {
                id: demoData.vendor.id,
                name: demoData.vendor.name,
                logoUrl: demoData.vendor.logoUrl || '',
              } : {
                id: '',
                name: '',
                logoUrl: '',
              },
            };
            
            setDemo(formattedDemo);
            console.log('✅ [Subscribe] Демо найдено:', formattedDemo.title, 'UUID:', formattedDemo.uuid);
          } else {
            console.error('❌ [Subscribe] Демо не найдено в ответе API');
            setError('Продукт не найден');
          }
        } else {
          const errorData = await demoResponse.json().catch(() => ({}));
          console.error('❌ [Subscribe] Ошибка API:', demoResponse.status, errorData);
          setError(errorData.message || 'Ошибка загрузки продукта');
        }
      } catch (err) {
        console.error('❌ [Subscribe] Исключение при загрузке демо:', err);
        setError('Ошибка загрузки продукта');
      } finally {
        setLoading(false);
      }
    };

    fetchDemo();
  }, [demoId]);

  // Расчёт цен
  const fullPrice = demo ? (demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice) : 0;
  const monthlyPrice = Math.round(fullPrice / 10);

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demo) return;

    // Валидация
    if (!formData.customerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      console.log('📤 Создание подписки:', { demoId, ...formData });

      // Формируем полный номер телефона
      let fullPhone: string | undefined = undefined;
      if (formData.customerPhone.trim()) {
        const phone = formData.customerPhone.trim();
        // Если номер уже начинается с +, используем его как есть
        if (phone.startsWith('+')) {
          fullPhone = phone;
        } else {
          // Иначе добавляем выбранный код страны
          // Убираем код страны из начала номера, если он уже есть
          const cleanPhone = phone.replace(/^\+?\d{1,4}\s*/, '');
          fullPhone = `${formData.phoneCountryCode}${cleanPhone}`;
        }
      }

      // Используем UUID из загруженного демо, а не SKU из URL
      const demoUuid = demo?.uuid || demoId;
      
      console.log('📤 [Subscribe] Создание подписки:', { 
        demoUuid, 
        demoId, 
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: fullPhone 
      });

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          demoId: demoUuid, // Используем UUID, а не SKU
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          customerPhone: fullPhone,
          notes: formData.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      console.log('✅ Подписка создана:', data.id);
      setSuccess(true);
    } catch (err: any) {
      console.error('❌ Ошибка создания подписки:', err);
      setError(err.message || 'Error creating subscription');
    } finally {
      setSubmitting(false);
    }
  };

  // Показ успешного сообщения
  if (success) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-4">Subscription Created!</h1>
            <p className="text-ink/70 mb-6">
              Thank you for subscribing to <strong>{demo?.title}</strong>.
              <br />
              We sent a confirmation to <strong>{formData.customerEmail}</strong>.
            </p>
            <div className="glass-subtle rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-ink/60">Monthly payment:</span>
                <span className="text-xl font-bold text-a1">{monthlyPrice.toLocaleString()} ֏</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink/60">Subscription period:</span>
                <span className="text-ink font-medium">10 months</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/my-account/subscriptions')}
                className="flex-1 px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
              >
                My Subscriptions
              </button>
              <button
                onClick={() => router.push('/catalog')}
                className="flex-1 px-6 py-3 glass text-ink rounded-xl font-medium hover:glass-strong transition-all"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Загрузка
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Продукт не найден
  if (!demo) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
          <div className="glass rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">Product Not Found</h1>
            <p className="text-ink/70 mb-6">Sorry, the requested product does not exist.</p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-ink mb-6">Checkout</h1>
        
        {/* Кнопка назад */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-ink/70 hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Левая колонка - информация о продукте */}
          <div>
            <div className="glass rounded-3xl overflow-hidden mb-6">
              {/* Изображение */}
              <div className="aspect-video bg-a1/10 relative">
                {demo.screenshotUrl ? (
                  <img
                    src={demo.screenshotUrl}
                    alt={demo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-a1/50">Нет превью</span>
                  </div>
                )}
              </div>
              
              {/* Информация о продукте */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-ink mb-2">{demo.title}</h1>
                {demo.description && (
                  <p className="text-ink/70 mb-4">{demo.description}</p>
                )}
                <div className="flex items-center gap-2 text-ink/50 text-sm">
                  <span>{demo.category}</span>
                  {demo.vendor && (
                    <>
                      <span>•</span>
                      <span>{demo.vendor.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Benefits */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-ink mb-4">Subscription Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-a1 mt-0.5" />
                  <div>
                    <div className="text-ink font-medium">Convenient Payment</div>
                    <div className="text-ink/60 text-sm">Pay in installments — only {monthlyPrice.toLocaleString()} ֏ per month</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-a1 mt-0.5" />
                  <div>
                    <div className="text-ink font-medium">10 Months</div>
                    <div className="text-ink/60 text-sm">Fixed subscription period with no hidden fees</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-a1 mt-0.5" />
                  <div>
                    <div className="text-ink font-medium">Quality Guarantee</div>
                    <div className="text-ink/60 text-sm">Cancel anytime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - форма */}
          <div>
            <div className="glass rounded-3xl p-6 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-ink/10">
                <div className="text-ink/60 text-sm mb-1">Monthly Payment</div>
                <div className="text-4xl font-bold text-a1 mb-1">
                  {monthlyPrice.toLocaleString()} ֏
                  <span className="text-lg font-normal text-ink/60">/mo</span>
                </div>
                <div className="text-ink/50 text-sm">
                  × 10 months = {fullPrice.toLocaleString()} ֏
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold text-ink mb-4">Your Details</h2>

                {/* Name */}
                <div>
                  <label className="block text-ink/70 text-sm mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 glass-subtle rounded-xl text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-ink/70 text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 glass-subtle rounded-xl text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none transition-all"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-ink/70 text-sm mb-1">Phone</label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <CountryCodeSelect
                      value={formData.phoneCountryCode}
                      onChange={(code) => setFormData({ ...formData, phoneCountryCode: code })}
                    />
                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => {
                        // Allow only digits, spaces, dashes and plus
                        const value = e.target.value.replace(/[^\d\s\-+]/g, '');
                        setFormData({ ...formData, customerPhone: value });
                      }}
                      placeholder="XX XXX XXX"
                      className="flex-1 px-4 py-3 glass-subtle rounded-xl text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-ink/70 text-sm mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional information..."
                    rows={3}
                    className="w-full px-4 py-3 glass-subtle rounded-xl text-ink placeholder-ink/40 focus:ring-2 focus:ring-a1 outline-none transition-all resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-a1 text-white rounded-xl font-bold text-lg hover:bg-a1/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Subscribe — {monthlyPrice.toLocaleString()} ֏/mo
                    </>
                  )}
                </button>

                <p className="text-ink/50 text-xs text-center">
                  By clicking the button, you agree to the terms of service
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

