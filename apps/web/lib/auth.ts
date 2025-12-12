import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // Разрешаем NextAuth автоматически определять базовый URL
  providers: [
    // Email/Password провайдер с проверкой базы данных
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [AUTH] Отсутствуют учетные данные');
          return null;
        }

        const prisma = getPrismaClient();
        if (!prisma) {
          console.error('❌ [AUTH] Prisma client недоступен');
          return null;
        }

        try {
          // Маскируем email для логирования
          const maskedEmail = credentials.email?.replace(/(.{2})(.*)(@.*)/, (_, start, middle, domain) => {
            return start + '*'.repeat(Math.min(middle?.length || 0, 5)) + domain;
          }) || 'unknown';
          
          console.log('🔵 [AUTH] Попытка авторизации для:', maskedEmail);
          
          // Ищем пользователя в базе данных
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log('❌ [AUTH] Пользователь не найден:', maskedEmail);
            return null;
          }

          console.log('🔵 [AUTH] Пользователь найден:', { id: user.id, email: maskedEmail, hasPassword: !!user.password });

          // Проверяем пароль
          if (!user.password) {
            console.log('❌ [AUTH] У пользователя нет пароля');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            console.log('❌ [AUTH] Неверный пароль для:', maskedEmail);
            return null;
          }

          // Обновляем маскированный email из user.email (может отличаться от credentials.email)
          const userMaskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, (_, start, middle, domain) => {
            return start + '*'.repeat(Math.min(middle.length, 5)) + domain;
          });
          console.log('🔐 [AUTH] Успешный вход:', userMaskedEmail, 'Role:', user.role);

          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role || 'USER',
          };
        } catch (error) {
          console.error('❌ [AUTH] Ошибка при проверке учетных данных:', error);
          return null;
        }
      }
    }),
    // Google OAuth провайдер (только если настроены переменные окружения)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    // error page removed - credentials errors handled in sidebar, OAuth errors will show inline
  },
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('NEXTAUTH_SECRET must be set in production environment');
      }
      console.warn('⚠️ Using fallback secret for development. Set NEXTAUTH_SECRET in production!');
      return 'fallback-secret-for-development';
    }
    return secret;
  })(),
  debug: process.env.NODE_ENV === 'development',
});
