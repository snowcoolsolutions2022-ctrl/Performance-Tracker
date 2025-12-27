"use client";

import { useState } from 'react';
import { Save, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstallEntryPage() {
    const [month, setMonth] = useState('October');
    const [year, setYear] = useState(2025);

    return (
        <div className="space-y-6 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Installation Team Entry
                    </h1>
                    <p className="text-slate-400 mt-1">Daily performance and material tracking</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
                        <Calendar size={18} className="text-slate-400" />
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent border-none text-slate-200 focus:ring-0 outline-none"
                        >
                            <option>October</option>
                            <option>November</option>
                            <option>December</option>
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-transparent border-none text-slate-200 focus:ring-0 outline-none"
                        >
                            <option>2025</option>
                            <option>2026</option>
                        </select>
                    </div>

                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                        <Save size={18} />
                        <span>Save Report</span>
                    </button>
                </div>
            </header>

            {/* Call Completion Report Table */}
            <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                    <h2 className="text-lg font-semibold font-outfit text-orange-400 uppercase tracking-wider">
                        {month} Month - Installation Technician Call Completion Details
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-orange-500/10 text-orange-200">
                            <tr>
                                <th className="p-3 border-r border-slate-800 min-w-[150px]">Tech Name</th>
                                <th className="p-3 border-r border-slate-800 w-24">Allocated</th>
                                <th className="p-3 border-r border-slate-800 w-24">Week 1</th>
                                <th className="p-3 border-r border-slate-800 w-24">Week 2</th>
                                <th className="p-3 border-r border-slate-800 w-24">Week 3</th>
                                <th className="p-3 border-r border-slate-800 w-24">Week 4</th>
                                <th className="p-3 border-r border-slate-800 w-24">Week 5</th>
                                <th className="p-3 border-r border-slate-800 w-24">Total</th>
                                <th className="p-3 border-r border-slate-800 w-24">Work Days</th>
                                <th className="p-3 border-r border-slate-800 w-24">Avg Comp</th>
                                <th className="p-3">Designation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {/* Rows will go here - passing dummy data for UI Check */}
                            <Row techName="EDAMALIYAN" designation="INSTALL TEAM" />
                            <Row techName="SUDHAN" designation="INSTALL TEAM" />
                            <Row techName="JERIN" designation="INSTALL TEAM" />
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Material Details Table */}
            <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                    <h2 className="text-lg font-semibold font-outfit text-yellow-400 uppercase tracking-wider">
                        Install Technician Material Details
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-yellow-500/10 text-yellow-200">
                            <tr>
                                <th className="p-3 border-r border-slate-800 min-w-[150px]">Name</th>
                                <th className="p-3 border-r border-slate-800">Stand</th>
                                <th className="p-3 border-r border-slate-800">Fixing</th>
                                <th className="p-3 border-r border-slate-800">Copper (Mtr)</th>
                                <th className="p-3 border-r border-slate-800">W/Fixing</th>
                                <th className="p-3 border-r border-slate-800">Cotton Roll</th>
                                <th className="p-3 border-r border-slate-800">Stabilizer</th>
                                <th className="p-3 border-r border-slate-800">AMC Target</th>
                                <th className="p-3">Achieved</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <MaterialRow techName="SUDHAN" />
                            <MaterialRow techName="EDAMALIYAN" />
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function Row({ techName, designation }: { techName: string, designation: string }) {
    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-3 border-r border-slate-800 font-medium text-slate-200">{techName}</td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-3 border-r border-slate-800 text-center font-bold text-blue-400">0</td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-3 border-r border-slate-800 text-center">0.0</td>
            <td className="p-3 text-slate-400 text-xs">{designation}</td>
        </tr>
    )
}

function MaterialRow({ techName }: { techName: string }) {
    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-3 border-r border-slate-800 font-medium text-slate-200">{techName}</td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
        </tr>
    )
}
