import { z } from 'zod';

// Схема для входа
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
});

// Схема для регистрации
export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль не должен превышать 100 символов'),
  confirmPassword: z
    .string()
    .min(1, 'Подтверждение пароля обязательно'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

// Схема для сброса пароля
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
});

// Схема для изменения пароля
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Текущий пароль обязателен'),
  newPassword: z
    .string()
    .min(1, 'Новый пароль обязателен')
    .min(6, 'Новый пароль должен содержать минимум 6 символов')
    .max(100, 'Новый пароль не должен превышать 100 символов'),
  confirmNewPassword: z
    .string()
    .min(1, 'Подтверждение нового пароля обязательно'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Новые пароли не совпадают',
  path: ['confirmNewPassword'],
});

// Типы для TypeScript
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
