import { z } from 'zod';

// Схема для создания заказа
export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Имя клиента обязательно')
    .min(2, 'Имя клиента должно содержать минимум 2 символа')
    .max(255, 'Имя клиента не должно превышать 255 символов'),
  customerEmail: z
    .string()
    .min(1, 'Email клиента обязателен')
    .email('Неверный формат email клиента'),
  customerPhone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: 'Номер телефона должен содержать минимум 10 символов',
    })
    .refine((val) => !val || val.length <= 20, {
      message: 'Номер телефона не должен превышать 20 символов',
    }),
  demoId: z
    .string()
    .min(1, 'ID демо обязателен')
    .uuid('Неверный формат ID демо'),
  requirements: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, {
      message: 'Требования не должны превышать 2000 символов',
    }),
  budget: z
    .number()
    .positive('Бюджет должен быть положительным числом')
    .max(1000000, 'Бюджет не должен превышать 1,000,000')
    .optional(),
  notes: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: 'Заметки не должны превышать 1000 символов',
    }),
  deadline: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Неверный формат даты дедлайна',
    }),
});

// Схема для обновления заказа
export const updateOrderSchema = z.object({
  status: z
    .enum(['new', 'in_progress', 'discussion', 'in_work', 'cancelled', 'completed'])
    .optional(),
  assignedTo: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 255, {
      message: 'Имя исполнителя не должно превышать 255 символов',
    }),
  notes: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: 'Заметки не должны превышать 1000 символов',
    }),
  deadline: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Неверный формат даты дедлайна',
    }),
});

// Схема для поиска заказов
export const searchOrdersSchema = z.object({
  status: z
    .enum(['new', 'in_progress', 'discussion', 'in_work', 'cancelled', 'completed'])
    .optional(),
  assignedTo: z
    .string()
    .optional(),
  customerEmail: z
    .string()
    .email('Неверный формат email клиента')
    .optional(),
  demoId: z
    .string()
    .uuid('Неверный формат ID демо')
    .optional(),
  dateFrom: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Неверный формат даты начала',
    }),
  dateTo: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Неверный формат даты окончания',
    }),
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
    .enum(['createdAt', 'updatedAt', 'customerName', 'status'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

// Типы для TypeScript
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type SearchOrdersFormData = z.infer<typeof searchOrdersSchema>;
