import hy from '../locales/hy.json';
import ru from '../locales/ru.json';
import en from '../locales/en.json';

export type Locale = 'hy' | 'ru' | 'en';

export const locales: Locale[] = ['hy', 'ru', 'en'];

export const translations = {
  hy,
  ru,
  en,
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getNestedTranslation(translations: any, key: string): string {
  return key.split('.').reduce((obj, k) => obj?.[k], translations) || key;
}
