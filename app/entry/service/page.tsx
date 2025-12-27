"use client";

import { useState } from 'react';
import { Save, Calendar } from 'lucide-react';

export default function ServiceEntryPage() {
    const [month, setMonth] = useState('December');
    const [year, setYear] = useState(2025);

    return (
        <div className="space-y-6 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                        Service Team Entry
                    </h1>
                    <p className="text-slate-400 mt-1">Service calls, warranty tracking, and category analysis</p>
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

                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20">
                        <Save size={18} />
                        <span>Save Report</span>
                    </button>
                </div>
            </header>

            {/* Service Team Report Table */}
            <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                    <h2 className="text-lg font-semibold font-outfit text-orange-400 uppercase tracking-wider">
                        {month} Month - Service Team Report
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
                            <Row techName="JERIN" designation="SERVICE TEAM" />
                            <Row techName="GOPINATH" designation="SERVICE TEAM" />
                            <Row techName="VISWAJITH" designation="SERVICE TEAM" />
                            <Row techName="SIVA" designation="MULTI" />
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Category Breakdown Table */}
            <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden mt-8 max-w-2xl">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                    <h2 className="text-lg font-semibold font-outfit text-yellow-400 uppercase tracking-wider">
                        Category Breakdown
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-yellow-500/10 text-yellow-200">
                            <tr>
                                <th className="p-3 border-r border-slate-800 text-left">Category</th>
                                <th className="p-3 border-r border-slate-800">In Warranty</th>
                                <th className="p-3 border-r border-slate-800">Out Warranty</th>
                                <th className="p-3 bg-yellow-500/20">Total Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <CategoryRow name="HOOPERWASH" />
                            <CategoryRow name="WATERWASH" />
                            <CategoryRow name="GAS LEAK" />
                            <CategoryRow name="SERVICE/BRK" />
                            <CategoryRow name="INSPECTION" />
                            <tr className="bg-slate-800/50 font-bold">
                                <td className="p-3 border-r border-slate-800 text-left">TOTAL</td>
                                <td className="p-3 border-r border-slate-800">269</td>
                                <td className="p-3 border-r border-slate-800">59</td>
                                <td className="p-3 bg-yellow-500/10">328</td>
                            </tr>
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

function CategoryRow({ name }: { name: string }) {
    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-3 border-r border-slate-800 text-left font-medium text-slate-200">{name}</td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-0 border-r border-slate-800"><input className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800" placeholder="0" /></td>
            <td className="p-3 bg-slate-800/20 font-bold">0</td>
        </tr>
    )
}
