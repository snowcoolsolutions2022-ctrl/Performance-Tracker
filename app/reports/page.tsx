"use client";

import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

export default function ReportsPage() {
    const [year, setYear] = useState(2025);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-white">
                        Annual Performance Reports
                    </h1>
                    <p className="text-slate-400 mt-1">Consolidated analytics for {year}</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="appearance-none bg-slate-900 border border-slate-700 text-white pl-4 pr-10 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                        >
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>

                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
                        <Download size={18} />
                        <span>Export Excel</span>
                    </button>
                </div>
            </header>

            {/* Annual Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title="Total Calls Attended" value="4,281" label="Yearly Accumulation" color="bg-blue-500" />
                <SummaryCard title="Average Efficiency" value="92.4%" label="Across all teams" color="bg-purple-500" />
                <SummaryCard title="Pending Backlog" value="12" label="Current Status" color="bg-orange-500" />
            </div>

            {/* Technician Performance Table */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold font-outfit text-white">Technician Performance Consolidation</h3>
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">Jan - Dec {year}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wilder font-semibold">
                            <tr>
                                <th className="p-4 border-b border-slate-800">Technician</th>
                                <th className="p-4 border-b border-slate-800">Team</th>
                                <th className="p-4 border-b border-slate-800 text-right">Total Calls</th>
                                <th className="p-4 border-b border-slate-800 text-right">Working Days</th>
                                <th className="p-4 border-b border-slate-800 text-right">Avg / Day</th>
                                <th className="p-4 border-b border-slate-800 text-right">Pending</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <ReportRow name="Sudhan" team="INSTALL" calls="412" days="230" avg="1.8" pending="2" />
                            <ReportRow name="Jerin" team="SERVICE" calls="1,102" days="245" avg="4.5" pending="0" />
                            <ReportRow name="Gopinath" team="SERVICE" calls="988" days="240" avg="4.1" pending="5" />
                            <ReportRow name="Edamaliyan" team="INSTALL" calls="390" days="220" avg="1.7" pending="1" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, label, color }: { title: string, value: string, label: string, color: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
            <h3 className="text-slate-400 font-medium">{title}</h3>
            <div className="text-4xl font-bold text-white mt-2 font-outfit">{value}</div>
            <div className="text-sm text-slate-500 mt-2">{label}</div>
        </div>
    )
}

function ReportRow({ name, team, calls, days, avg, pending }: any) {
    return (
        <tr className="hover:bg-slate-800/20 transition-colors">
            <td className="p-4 font-medium text-white">{name}</td>
            <td className="p-4">
                <span className={`text-xs px-2 py-1 rounded font-medium ${team === 'INSTALL' ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {team} TEAM
                </span>
            </td>
            <td className="p-4 text-right text-slate-300">{calls}</td>
            <td className="p-4 text-right text-slate-300">{days}</td>
            <td className="p-4 text-right text-slate-300">{avg}</td>
            <td className="p-4 text-right text-slate-300">{pending}</td>
        </tr>
    )
}
