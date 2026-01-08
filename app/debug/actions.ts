'use server'

import prisma from '../../prisma/prisma';

export async function checkDatabaseConnection() {
    try {
        console.log("Checking database connection...");

        // simple query to test connection
        const count = await prisma.technician.count();

        // Get masked URL for debugging purposes (never expose full credentials)
        const dbUrl = process.env.DATABASE_URL || 'NOT_DEFINED';
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

        return {
            success: true,
            message: 'Connected successfully',
            technicianCount: count,
            databaseUrl: maskedUrl,
            envCheck: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasDirectUrl: !!process.env.DIRECT_URL,
                nodeEnv: process.env.NODE_ENV
            }
        };
    } catch (error: any) {
        console.error("Database connection check failed:", error);

        const dbUrl = process.env.DATABASE_URL || 'NOT_DEFINED';
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

        return {
            success: false,
            message: error.message || 'Unknown error',
            code: error.code,
            databaseUrl: maskedUrl,
            envCheck: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasDirectUrl: !!process.env.DIRECT_URL,
                nodeEnv: process.env.NODE_ENV
            }
        };
    }
}
