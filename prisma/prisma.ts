import { PrismaClient } from '@prisma/client'
// import "dotenv/config";

console.log('[Prisma] Initializing client...');
console.log('[Prisma] DATABASE_URL exists:', !!process.env.DATABASE_URL);

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL;

    // Automatically fix connection string for Supabase Transaction Pooler (Port 6543)
    // Vercel/Prisma requires ?pgbouncer=true for 6543, but often users forget it.
    if (url && url.includes(':6543') && !url.includes('pgbouncer=true')) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}pgbouncer=true`;
        console.log('[Prisma] Auto-patched DATABASE_URL with pgbouncer=true');
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
