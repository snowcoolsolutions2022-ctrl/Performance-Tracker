'use client';

import { useState, useEffect } from 'react';
import { checkDatabaseConnection } from '../actions';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function DebugDBPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkConnection = async () => {
        setLoading(true);
        try {
            const result = await checkDatabaseConnection();
            setStatus(result);
        } catch (error) {
            setStatus({ success: false, message: 'Failed to execute check' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-white mb-2">Database Connection Status</h1>
                    <p className="text-slate-400">Diagnostic tool for live site database connectivity</p>
                </header>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Connection Test</h2>
                        <button
                            onClick={checkConnection}
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            <span>{loading ? 'Checking...' : 'Run Check'}</span>
                        </button>
                    </div>

                    {status ? (
                        <div className="space-y-6">
                            {/* Status Banner */}
                            <div className={`flex items-center gap-4 p-4 rounded-lg border ${status.success
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                {status.success ? <CheckCircle size={32} /> : <XCircle size={32} />}
                                <div>
                                    <div className="font-bold text-lg">
                                        {status.success ? 'Connected Successfully' : 'Connection Failed'}
                                    </div>
                                    <div className="text-sm opacity-90">{status.message}</div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Row Count</div>
                                    <div className="font-mono text-xl text-white">
                                        {status.technicianCount !== undefined ? status.technicianCount : 'N/A'}
                                    </div>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                    <div className="text-slate-500 text-xs uppercase font-bold mb-1">Error Code</div>
                                    <div className="font-mono text-xl text-white">
                                        {status.code || 'None'}
                                    </div>
                                </div>
                            </div>

                            {/* Config Details */}
                            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Configuration
                                </h3>
                                <div className="space-y-2 text-sm font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">DATABASE_URL Set:</span>
                                        <span className={status.envCheck?.hasDatabaseUrl ? "text-emerald-400" : "text-red-400"}>
                                            {status.envCheck?.hasDatabaseUrl ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">DIRECT_URL Set:</span>
                                        <span className={status.envCheck?.hasDirectUrl ? "text-emerald-400" : "text-red-400"}>
                                            {status.envCheck?.hasDirectUrl ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Node Environment:</span>
                                        <span className="text-blue-400">{status.envCheck?.nodeEnv || 'N/A'}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-800 mt-2">
                                        <div className="text-slate-500 mb-1">Detected URL (Masked):</div>
                                        <div className="break-all text-xs text-slate-300 bg-black p-2 rounded">
                                            {status.databaseUrl}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            Click "Run Check" to test database connection
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
