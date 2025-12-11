'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus, X } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  screenshotUrl: string;
  regularPrice: number;
  salePrice?: number;
  vendor?: {
    name: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [idMapping, setIdMapping] = useState<Record<string, string>>({}); // Maps cart ID to demo ID

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const savedCart = localStorage.getItem('cart');
      if (!savedCart) {
        setLoading(false);
        return;
      }

      try {
        const ids: string[] = JSON.parse(savedCart);
        setCartIds(ids);

        console.log('🛒 [Cart] Loading cart with IDs:', ids);

        if (ids.length === 0) {
          console.log('🛒 [Cart] Cart is empty');
          setLoading(false);
          return;
        }

        // Load demo data from API
        const response = await fetch(`/api/search?limit=1000`);
        const data = await response.json();

        console.log('🛒 [Cart] API response:', { 
          hasData: !!data.data, 
          dataLength: data.data?.length || 0 
        });

        if (data.data) {
          // Filter only items in cart - try to match by id, sku, or metadata.sku
          let cartDemos: Demo[] = [];
          
          for (const id of ids) {
            // Try to find by exact ID match
            let demo = data.data.find((d: Demo) => d.id === id);
            
            // If not found, try to find by SKU or other identifiers
            if (!demo) {
              demo = data.data.find((d: any) => 
                d.sku === id || 
                d.metadata?.sku === id ||
                d.id?.toLowerCase() === id?.toLowerCase()
              );
            }
            
            // If still not found, try to fetch individually
            if (!demo) {
              try {
                console.log('🔄 [Cart] Trying to fetch demo individually:', id);
                const individualResponse = await fetch(`/api/demos/${encodeURIComponent(id)}`);
                if (individualResponse.ok) {
                  const individualData = await individualResponse.json();
                  if (individualData && individualData.id) {
                    demo = {
                      id: individualData.sku || individualData.id,
                      title: individualData.title,
                      description: individualData.description || '',
                      url: individualData.url,
                      category: individualData.category || '',
                      imageUrl: individualData.imageUrl || '',
                      screenshotUrl: individualData.screenshotUrl || individualData.imageUrl || '',
                      regularPrice: individualData.regularPrice ? Number(individualData.regularPrice) : 0,
                      salePrice: individualData.salePrice ? Number(individualData.salePrice) : undefined,
                      vendor: individualData.vendor ? {
                        id: individualData.vendor.id,
                        name: individualData.vendor.name,
                        logoUrl: individualData.vendor.logoUrl || '',
                      } : undefined,
                    };
                    console.log('✅ [Cart] Fetched demo individually:', demo.title);
                  }
                }
              } catch (fetchErr) {
                console.warn('⚠️ [Cart] Failed to fetch demo individually:', id, fetchErr);
              }
            }
            
            if (demo) {
              console.log('✅ [Cart] Found demo for ID:', id, '→', demo.title);
              cartDemos.push(demo);
              // Store mapping from cart ID to demo ID
              idMapping[id] = demo.id;
            } else {
              console.warn('⚠️ [Cart] Demo not found for ID:', id);
            }
          }
          
          console.log('🛒 [Cart] Found demos:', cartDemos.length, 'out of', ids.length);
          console.log('🛒 [Cart] ID mapping:', idMapping);
          
          setIdMapping(idMapping);
          setDemos(cartDemos);
          
          // Initialize quantities - use cart ID as key
          const initialQuantities: Record<string, number> = {};
          ids.forEach(cartId => {
            if (idMapping[cartId]) {
              initialQuantities[cartId] = 1;
            }
          });
          setQuantities(initialQuantities);
        } else {
          console.error('❌ [Cart] No data in API response');
        }
      } catch (err) {
        console.error('❌ [Cart] Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Update cart in localStorage
  const updateCart = (newIds: string[]) => {
    setCartIds(newIds);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newIds));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  // Remove item from cart
  const removeFromCart = (cartId: string) => {
    const newIds = cartIds.filter(id => id !== cartId);
    updateCart(newIds);
    const demoId = idMapping[cartId];
    if (demoId) {
      setDemos(demos.filter(d => d.id !== demoId));
    }
    const newQuantities = { ...quantities };
    delete newQuantities[cartId];
    setQuantities(newQuantities);
  };

  // Clear entire cart
  const clearCart = () => {
    if (!confirm('Clear entire cart?')) return;
    updateCart([]);
    setDemos([]);
    setQuantities({});
  };

  // Update quantity
  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }
    setQuantities({ ...quantities, [cartId]: newQuantity });
  };

  // Calculate totals
  const calculateTotals = () => {
    let monthlySubtotal = 0;
    let fullSubtotal = 0;
    demos.forEach(demo => {
      // Find cart ID for this demo
      const cartId = Object.keys(idMapping).find(key => idMapping[key] === demo.id) || demo.id;
      const fullPrice = demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice;
      const monthlyPrice = Math.round(fullPrice / 10);
      const quantity = quantities[cartId] || 1;
      monthlySubtotal += monthlyPrice * quantity;
      fullSubtotal += fullPrice * quantity;
    });
    return {
      monthlySubtotal,
      fullSubtotal,
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
            <p className="text-ink/70 mt-4">Loading cart...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (demos.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 glass rounded-xl hover:glass-strong transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
            <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Shopping Cart
            </h1>
          </div>

          <div className="glass rounded-3xl p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-ink/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">Your cart is empty</h2>
            <p className="text-ink/60 mb-6">
              Add items to your cart by clicking the shopping cart icon
            </p>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-all"
            >
              Go to Catalog
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 glass rounded-xl hover:glass-strong transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
            <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Shopping Cart
            </h1>
            <span className="px-3 py-1 bg-a1/20 text-a1 text-sm font-medium rounded-full">
              {demos.length} {demos.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {demos.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 glass text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {demos.map((demo) => {
              // Find cart ID for this demo
              const cartId = Object.keys(idMapping).find(key => idMapping[key] === demo.id) || demo.id;
              const fullPrice = demo.salePrice && demo.salePrice > 0 ? demo.salePrice : demo.regularPrice;
              const monthlyPrice = Math.round(fullPrice / 10);
              const quantity = quantities[cartId] || 1;
              const monthlyTotal = monthlyPrice * quantity;
              const fullTotal = fullPrice * quantity;

              return (
                <div key={demo.id} className="glass rounded-2xl p-4 hover:glass-strong transition-all">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-a1/10 rounded-xl overflow-hidden flex-shrink-0">
                      {demo.screenshotUrl ? (
                        <img
                          src={demo.screenshotUrl}
                          alt={demo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-a1/50 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-ink truncate mb-1">{demo.title}</h3>
                          <p className="text-ink/50 text-sm">{demo.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartId)}
                          className="p-1 text-ink/40 hover:text-red-400 transition-colors flex-shrink-0"
                          title="Remove from cart"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-a1">
                            {monthlyPrice.toLocaleString()} ֏
                            <span className="text-sm font-normal text-ink/60">/mo</span>
                          </div>
                          <div className="text-sm text-ink/60">
                            {quantity > 1 && (
                              <span>{quantity} × {monthlyPrice.toLocaleString()} ֏/mo = {monthlyTotal.toLocaleString()} ֏/mo</span>
                            )}
                            {quantity === 1 && (
                              <span>× 10 months = {fullTotal.toLocaleString()} ֏</span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(cartId, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center glass-subtle rounded-lg hover:glass-strong transition-all text-ink"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-ink font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(cartId, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center glass-subtle rounded-lg hover:glass-strong transition-all text-ink"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="glass rounded-3xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-ink mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-ink/70">
                  <span>Monthly payment</span>
                  <span className="text-ink font-medium">{totals.monthlySubtotal.toLocaleString()} ֏/mo</span>
                </div>
                <div className="flex justify-between text-ink/60 text-sm">
                  <span>× 10 months</span>
                  <span>{totals.fullSubtotal.toLocaleString()} ֏</span>
                </div>
                <div className="border-t border-ink/10 pt-3 flex justify-between text-lg font-bold text-ink">
                  <span>Total</span>
                  <span className="text-a1">{totals.fullSubtotal.toLocaleString()} ֏</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (demos.length > 0) {
                    router.push(`/subscribe/${demos[0].id}`);
                  }
                }}
                className="w-full px-6 py-3 bg-a1 text-white rounded-xl font-bold text-lg hover:bg-a1/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={demos.length === 0}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/catalog')}
                className="w-full mt-3 px-6 py-3 glass text-ink rounded-xl font-medium hover:glass-strong transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

