import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function DiagnosticsPage() {
    let dbStatus = 'Checking...';
    let techCount = -1;
    let errorMsg = '';
    let envCheck = {
        hasDbUrl: 'No',
        nodeEnv: process.env.NODE_ENV,
        directUrl: 'No'
    };

    try {
        // Check Environment Variables (safely)
        envCheck.hasDbUrl = process.env.DATABASE_URL ? 'Yes (Present)' : 'MISSING';
        envCheck.directUrl = process.env.DIRECT_URL ? 'Yes (Present)' : 'MISSING';

        // Test DB Connection
        techCount = await prisma.technician.count();
        dbStatus = 'Connected';
    } catch (error: any) {
        dbStatus = 'Failed';
        errorMsg = error.message;
    } finally {
        await prisma.$disconnect();
    }

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">System Diagnostics</h1>

            <div className="mb-6 p-4 border rounded bg-gray-50">
                <h2 className="font-bold mb-2">Environment</h2>
                <p>NODE_ENV: {envCheck.nodeEnv}</p>
                <p>DATABASE_URL: {envCheck.hasDbUrl}</p>
                <p>DIRECT_URL: {envCheck.directUrl}</p>
            </div>

            <div className={`p-4 border rounded ${dbStatus === 'Connected' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h2 className="font-bold mb-2">Database Connection</h2>
                <p>Status: <strong>{dbStatus}</strong></p>
                {dbStatus === 'Connected' && (
                    <p>Technician Count: {techCount}</p>
                )}
                {errorMsg && (
                    <div className="mt-2 text-red-600">
                        <p className="font-bold">Error Details:</p>
                        <pre className="whitespace-pre-wrap mt-1 text-xs">{errorMsg}</pre>
                    </div>
                )}
            </div>

            <div className="mt-8 text-gray-500 text-xs">
                <p>Generated at: {new Date().toISOString()}</p>
            </div>
        </div>
    );
}
