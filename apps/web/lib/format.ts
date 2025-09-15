/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('hy-AM').format(num);
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
  return new Intl.NumberFormat('hy-AM', {
    style: 'currency',
    currency: 'AMD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирует время
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('hy-AM', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Форматирует дату
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('hy-AM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
