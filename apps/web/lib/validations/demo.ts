import { z } from 'zod';

// Схема для создания демо
export const createDemoSchema = z.object({
  title: z
    .string()
    .min(1, 'Название обязательно')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(255, 'Название не должно превышать 255 символов'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: 'Описание не должно превышать 1000 символов',
    }),
  url: z
    .string()
    .min(1, 'URL обязателен')
    .url('Неверный формат URL'),
  category: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Категория не должна превышать 100 символов',
    }),
  subcategory: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Подкатегория не должна превышать 100 символов',
    }),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Неверный формат URL изображения',
    }),
  screenshotUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Неверный формат URL скриншота',
    }),
  vendorId: z
    .string()
    .min(1, 'ID поставщика обязателен')
    .uuid('Неверный формат ID поставщика'),
});

// Схема для обновления демо
export const updateDemoSchema = createDemoSchema.partial();

// Схема для поиска демо
export const searchDemosSchema = z.object({
  query: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Поисковый запрос не должен превышать 100 символов',
    }),
  category: z
    .string()
    .optional(),
  subcategory: z
    .string()
    .optional(),
  vendorId: z
    .string()
    .uuid('Неверный формат ID поставщика')
    .optional(),
  status: z
    .enum(['active', 'draft', 'deleted'])
    .optional(),
  page: z
    .number()
    .int()
    .min(1, 'Страница должна быть больше 0')
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Лимит должен быть больше 0')
    .max(100, 'Лимит не должен превышать 100')
    .default(20),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'title', 'viewCount'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

// Схема для массовых операций
export const bulkOperationSchema = z.object({
  action: z
    .enum(['activate', 'deactivate', 'delete', 'restore']),
  demoIds: z
    .array(z.string().uuid('Неверный формат ID демо'))
    .min(1, 'Выберите хотя бы один демо')
    .max(100, 'Нельзя выбрать более 100 демо'),
});

// Типы для TypeScript
export type CreateDemoFormData = z.infer<typeof createDemoSchema>;
export type UpdateDemoFormData = z.infer<typeof updateDemoSchema>;
export type SearchDemosFormData = z.infer<typeof searchDemosSchema>;
export type BulkOperationFormData = z.infer<typeof bulkOperationSchema>;
