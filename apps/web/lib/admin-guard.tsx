'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Ждем загрузки

    if (status === 'unauthenticated') {
      // Перенаправляем на страницу входа
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      // Перенаправляем на главную страницу
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Показываем загрузку пока проверяем авторизацию
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a1 mx-auto"></div>
          <p className="text-ink/70 mt-4">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Если не авторизован или не админ, не показываем контент
  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  // Если админ, показываем контент
  return <>{children}</>;
}

