import { useEffect, useState } from 'react';

/**
 * Хук для проверки монтирования компонента
 * Помогает избежать проблем с гидратацией в Next.js
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
