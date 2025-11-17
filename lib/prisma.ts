// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// PrismaClient harus diinisialisasi secara global untuk menghindari
// banyak instance di lingkungan development Next.js (hot-reloading)

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// Catatan: Pastikan Anda telah menjalankan 'npx prisma generate' setelah
// mengubah file schema.prisma Anda.