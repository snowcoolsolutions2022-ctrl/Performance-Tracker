import { PrismaClient } from '@prisma/client'
// import "dotenv/config";

console.log('[Prisma] Initializing client...');
console.log('[Prisma] DATABASE_URL exists:', !!process.env.DATABASE_URL);

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
