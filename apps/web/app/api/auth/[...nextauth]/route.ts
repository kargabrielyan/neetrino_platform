import { handlers } from '@/lib/auth';

// Используем Node.js runtime для Prisma и bcrypt
export const runtime = "nodejs";

export const { GET, POST } = handlers;
