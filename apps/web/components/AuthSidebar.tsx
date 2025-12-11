'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { signInSchema, signUpSchema, type SignInFormData, type SignUpFormData } from '@/lib/validations/auth';

interface AuthSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthSidebar({ isOpen, onClose, initialMode = 'signin' }: AuthSidebarProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Sign in form
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Sign up form
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // Reset forms when mode changes
  useEffect(() => {
    setError('');
    signInForm.reset();
    signUpForm.reset();
  }, [mode]);

  // Handle sign in
  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔵 [AuthSidebar] Начало входа:', data.email);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/',
      });

      console.log('🔵 [AuthSidebar] Результат signIn:', { 
        ok: result?.ok, 
        error: result?.error,
        status: result?.status,
        url: result?.url,
        hasResult: !!result
      });

      // Проверяем, что результат существует
      if (!result) {
        console.error('❌ [AuthSidebar] signIn вернул undefined/null');
        setError('Sign in failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (result.error) {
        console.error('❌ [AuthSidebar] Ошибка входа:', result.error);
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }
      
      if (result.ok) {
        console.log('✅ [AuthSidebar] Вход успешен, проверка сессии...');
        // Небольшая задержка для создания сессии
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const session = await getSession();
        console.log('🔵 [AuthSidebar] Сессия:', session ? 'создана' : 'не найдена');
        console.log('🔵 [AuthSidebar] Данные сессии:', session ? {
          userId: session.user?.id,
          email: session.user?.email,
          role: session.user?.role
        } : 'нет сессии');
        
        if (session) {
          if (session.user?.role === 'ADMIN') {
            console.log('✅ [AuthSidebar] Переход в админ-панель');
            router.push('/admin');
          } else {
            console.log('✅ [AuthSidebar] Переход на главную');
            router.push('/');
          }
          // Закрываем форму только после успешного входа
          onClose();
        } else {
          console.error('❌ [AuthSidebar] Сессия не создана после успешного входа');
          setError('Sign in successful but session not created. Please refresh the page.');
        }
      } else {
        // Если нет ни ok, ни error - неожиданный результат
        console.error('❌ [AuthSidebar] Неожиданный результат входа:', result);
        setError('An error occurred during sign in. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ [AuthSidebar] Исключение при входе:', error);
      setError(error?.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔵 [AuthSidebar] Начало регистрации:', data.email);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      // Проверяем Content-Type ответа
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ [AuthSidebar] Сервер вернул не JSON:', text.substring(0, 200));
        setError('Server returned invalid response format. Please try again later.');
        return;
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ [AuthSidebar] Ошибка парсинга JSON:', parseError);
        setError('Error processing server response');
        return;
      }
      
      console.log('🔵 [AuthSidebar] Ответ сервера:', { status: response.status, success: result.success });

      if (!response.ok) {
        // Обработка ошибок от сервера
        const errorMessage = result.error || result.message || 'Ошибка при регистрации';
        console.error('❌ [AuthSidebar] Ошибка регистрации:', errorMessage);
        setError(errorMessage);
        return;
      }

      if (result.success) {
        console.log('✅ [AuthSidebar] Регистрация успешна, ожидание синхронизации БД...');
        // Небольшая задержка для синхронизации БД
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🔵 [AuthSidebar] Попытка входа в систему...');
        // Automatically sign in after registration
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        console.log('🔵 [AuthSidebar] Результат signIn:', { 
          ok: signInResult?.ok, 
          error: signInResult?.error,
          status: signInResult?.status,
          url: signInResult?.url 
        });

        if (signInResult?.error) {
          console.error('❌ [AuthSidebar] Ошибка входа после регистрации:', signInResult.error);
          console.error('❌ [AuthSidebar] Детали ошибки:', {
            error: signInResult?.error,
            status: signInResult?.status,
            url: signInResult?.url
          });
          setError('Registration successful but sign in failed. Please try signing in manually.');
        } else {
          console.log('✅ [AuthSidebar] Вход выполнен успешно, переход в личный кабинет');
          // Дополнительная проверка сессии
          const { getSession } = await import('next-auth/react');
          const session = await getSession();
          console.log('🔵 [AuthSidebar] Проверка сессии:', session ? 'сессия создана' : 'сессия не найдена');
          router.push('/my-account');
          onClose();
        }
      } else {
        const errorMessage = result.error || result.message || 'Ошибка при регистрации';
        console.error('❌ [AuthSidebar] Регистрация не удалась:', errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ [AuthSidebar] Исключение при регистрации:', error);
      setError(error?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social sign in
  const handleSocialSignIn = async (provider: 'google') => {
    setIsLoading(true);
    setError('');

    try {
      await signIn(provider, { callbackUrl: '/' });
      onClose();
    } catch (error) {
      setError('Social sign in error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={(e) => {
              // Закрываем только если клик не на форме и не идет загрузка
              if (e.target === e.currentTarget && !isLoading) {
                onClose();
              }
            }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-glass-strong backdrop-blur-xl border-l border-glass-border z-50 overflow-y-auto"
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-a1/20 rounded-xl flex items-center justify-center">
                    {mode === 'signin' ? (
                      <LogIn className="w-5 h-5 text-a1" />
                    ) : (
                      <UserPlus className="w-5 h-5 text-a1" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-ink">
                      {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-ink/70">
                      {mode === 'signin' ? 'Welcome back' : 'Join Neetrino'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 glass-subtle rounded-lg hover:glass-strong transition-all duration-200 focus-ring"
                >
                  <X className="w-5 h-5 text-ink" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex glass-subtle rounded-xl p-1 mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'signin'
                      ? 'bg-a1 text-white shadow-sm'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === 'signup'
                      ? 'bg-a1 text-white shadow-sm'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Forms */}
              <div className="flex-1">
                {mode === 'signin' ? (
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signInForm.register('email')}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {signInForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signInForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Your password"
                          className="w-full pl-10 pr-12 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signInForm.formState.errors.password && (
                        <p className="text-red-400 text-sm mt-1">
                          {signInForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-a1 text-white rounded-lg hover:bg-a1/90 transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signUpForm.register('name')}
                          type="text"
                          placeholder="Your name"
                          className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                      </div>
                      {signUpForm.formState.errors.name && (
                        <p className="text-red-400 text-sm mt-1">
                          {signUpForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signUpForm.register('email')}
                          type="email"
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                      </div>
                      {signUpForm.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {signUpForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signUpForm.register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-12 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signUpForm.formState.errors.password && (
                        <p className="text-red-400 text-sm mt-1">
                          {signUpForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink/70 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                        <input
                          {...signUpForm.register('confirmPassword')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          className="w-full pl-10 pr-12 py-3 glass-subtle rounded-lg text-ink placeholder-ink/50 focus-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {signUpForm.formState.errors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">
                          {signUpForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-a1 text-white rounded-lg hover:bg-a1/90 transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign Up
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-glass-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-glass-strong text-ink/50">Or sign in with</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleSocialSignIn('google')}
                      disabled={isLoading}
                      className="w-full flex justify-center items-center gap-2 py-2 px-4 glass-subtle rounded-lg text-ink hover:glass-strong transition-all duration-200 focus-ring disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
