'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import FormInput from '@/components/forms/form-input';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔵 [SignUp] Начало регистрации:', data.email);
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
        console.error('❌ [SignUp] Сервер вернул не JSON:', text.substring(0, 200));
        setError('Server returned invalid response format. Please try again later.');
        return;
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ [SignUp] Ошибка парсинга JSON:', parseError);
        setError('Error processing server response');
        return;
      }
      
      console.log('🔵 [SignUp] Ответ сервера:', { status: response.status, success: result.success });

      if (!response.ok) {
        // Обработка ошибок от сервера
        const errorMessage = result.error || result.message || 'Registration failed';
        console.error('❌ [SignUp] Ошибка регистрации:', errorMessage);
        setError(errorMessage);
        return;
      }

      if (result.success) {
        console.log('✅ [SignUp] Регистрация успешна, ожидание синхронизации БД...');
        // Небольшая задержка для синхронизации БД
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🔵 [SignUp] Попытка входа в систему...');
        // Автоматически входим после регистрации
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        console.log('🔵 [SignUp] Результат signIn:', { 
          ok: signInResult?.ok, 
          error: signInResult?.error,
          status: signInResult?.status,
          url: signInResult?.url 
        });

        if (signInResult?.ok) {
          console.log('✅ [SignUp] Вход выполнен успешно, переход на главную');
          // Дополнительная проверка сессии
          const { getSession } = await import('next-auth/react');
          const session = await getSession();
          console.log('🔵 [SignUp] Проверка сессии:', session ? 'сессия создана' : 'сессия не найдена');
          router.push('/');
        } else {
          console.error('❌ [SignUp] Ошибка входа после регистрации:', signInResult?.error);
          console.error('❌ [SignUp] Детали ошибки:', {
            error: signInResult?.error,
            status: signInResult?.status,
            url: signInResult?.url
          });
          setError('Registration successful but sign in failed. Please try signing in manually.');
        }
      } else {
        const errorMessage = result.error || result.message || 'Registration failed';
        console.error('❌ [SignUp] Регистрация не удалась:', errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('❌ [SignUp] Исключение при регистрации:', error);
      setError(error?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Или{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              войдите в существующий аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              {...register('name')}
              label="Имя"
              type="text"
              placeholder="Ваше имя"
              required
              error={errors.name}
            />
            <FormInput
              {...register('email')}
              label="Email"
              type="email"
              placeholder="Email адрес"
              required
              error={errors.email}
            />
            <FormInput
              {...register('password')}
              label="Пароль"
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              required
              error={errors.password}
            />
            <FormInput
              {...register('confirmPassword')}
              label="Подтвердите пароль"
              type="password"
              placeholder="Подтвердите пароль"
              required
              error={errors.confirmPassword}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Или зарегистрируйтесь через</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => signIn('google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
