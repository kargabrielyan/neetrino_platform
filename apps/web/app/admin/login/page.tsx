'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/Layout';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
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
      // Simulate login - in real app, this would call your API
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Store admin session
        localStorage.setItem('adminToken', 'demo-admin-token');
        localStorage.setItem('adminUser', JSON.stringify({
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }));
        
        router.push('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="glass p-8 rounded-3xl">
              {error && (
                <div className="mb-4 p-3 glass-subtle rounded-2xl border border-a3/30">
                  <p className="text-sm text-a3">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-ink/70 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-a1/50 focus-ring"
                      placeholder="Enter your username"
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
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors focus-ring rounded"
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
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ink"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <div className="glass p-4 rounded-2xl">
              <p className="text-sm text-ink/60">
                Demo credentials: <span className="font-medium text-ink">admin</span> / <span className="font-medium text-ink">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
