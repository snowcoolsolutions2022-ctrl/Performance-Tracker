import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const technicianCount = await prisma.technician.count()
        console.log('Successfully connected!')
        console.log(`Technician count: ${technicianCount}`)
    } catch (e) {
        console.error('Connection failed:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
