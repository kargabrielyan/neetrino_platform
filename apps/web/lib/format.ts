/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(num: number): string {
  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch {
    // Fallback для случаев, когда Intl недоступен
    return num.toLocaleString('en-US');
  }
}

/**
 * Форматирует процент
 */
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

/**
 * Форматирует валюту (армянский драм)
 */
export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback для случаев, когда Intl недоступен
    return `$${amount.toLocaleString('en-US')}`;
  }
}

/**
 * Форматирует время
 */
export function formatTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleTimeString('en-US');
  }
}

/**
 * Форматирует дату
 */
export function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('en-US');
  }
}
