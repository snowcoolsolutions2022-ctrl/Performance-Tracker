const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found' : 'Missing')

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
})

async function main() {
    try {
        console.log('Connecting to database...')
        const technicianCount = await prisma.technician.count()
        console.log('Successfully connected!')
        console.log(`Technician count: ${technicianCount}`)
    } catch (e) {
        console.error('Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
