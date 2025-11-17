import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Email/Password провайдер (упрощенная версия для тестирования)
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Тестовые аккаунты для восстановления
        const testUsers = [
          {
            email: 'admin@neetrino.com',
            password: 'admin123',
            user: {
              id: '1',
              email: 'admin@neetrino.com',
              name: 'Администратор',
              role: 'ADMIN',
            }
          },
          {
            email: 'test@example.com',
            password: 'password123',
            user: {
              id: '2',
              email: 'test@example.com',
              name: 'Тестовый пользователь',
              role: 'USER',
            }
          },
          {
            email: 'user@example.com',
            password: 'user123',
            user: {
              id: '3',
              email: 'user@example.com',
              name: 'Обычный пользователь',
              role: 'USER',
            }
          }
        ];

        const foundUser = testUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (foundUser) {
          console.log('🔐 Успешный вход:', foundUser.user.email, 'Role:', foundUser.user.role);
          return foundUser.user;
        }

        console.log('❌ Неверные данные для входа:', credentials.email);
        return null;
      }
    }),
    // Google OAuth провайдер (только если настроены переменные окружения)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    // GitHub OAuth провайдер (только если настроены переменные окружения)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
});
