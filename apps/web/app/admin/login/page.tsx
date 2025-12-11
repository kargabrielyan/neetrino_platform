'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Layout from '../../../components/Layout';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Используем NextAuth для безопасной аутентификации
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        // Проверяем роль пользователя после входа
        router.push('/admin');
      }
    } catch (err) {
      setError('Login error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="glass p-6 rounded-3xl mb-8">
              <div className="w-16 h-16 bg-a1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-a1" />
              </div>
              <h2 className="text-3xl font-bold text-ink">Admin Login</h2>
              <p className="text-ink/70 mt-2">Sign in to access the admin panel</p>
              <div className="mt-4 p-4 glass-subtle rounded-2xl border border-a3/30">
                <p className="text-sm text-a3 text-center">
                  <strong>DEMO MODE:</strong> Click the button below to access the admin panel
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="glass p-8 rounded-3xl opacity-50">
              {error && (
                <div className="mb-4 p-3 glass-subtle rounded-2xl border border-a3/30">
                  <p className="text-sm text-a3">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
                      placeholder="admin@neetrino.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      disabled
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors focus-ring rounded disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 glass-strong text-ink rounded-lg font-semibold hover:glass transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center space-y-4">
            <div className="glass p-4 rounded-2xl">
              <p className="text-sm text-ink/60">
                Test credentials:
              </p>
              <p className="text-xs text-ink/50 mt-2">
                Email: <span className="font-medium text-ink">admin@neetrino.com</span>
              </p>
              <p className="text-xs text-ink/50">
                Password: <span className="font-medium text-ink">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


