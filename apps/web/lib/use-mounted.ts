import { useEffect, useState } from 'react';

/**
 * Хук для проверки монтирования компонента
 * Помогает избежать проблем с гидратацией в Next.js
 * Всегда возвращает false на сервере, true на клиенте после монтирования
 */
export function useMounted() {
  // Всегда начинаем с false, чтобы сервер и клиент рендерили одинаково
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Устанавливаем true только после монтирования на клиенте
    setIsMounted(true);
  }, []);

  return isMounted;
}
