'use client';

import { useMounted } from '../lib/use-mounted';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Компонент для предотвращения проблем с гидратацией
 * Рендерит children только на клиенте
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const mounted = useMounted();

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
