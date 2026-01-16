"use client";

import { useState, useCallback } from 'react';
import { Download, Calendar, Search, FileDown } from 'lucide-react';
import { getConsolidatedReport } from '../actions';
import { InstallDataEntry, ServiceDataEntry, CategoryData, InstallSummary } from '../types';
import { exportToExcel } from '../utils/exportToExcel';

export const dynamic = 'force-dynamic';


const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportsPage() {
    // Filter State
    const [filterMode, setFilterMode] = useState<'month' | 'range'>('month');
    const [selectedMonth, setSelectedMonth] = useState('December');
    const [selectedYear, setSelectedYear] = useState(2025);

    // Range State
    const [startMonth, setStartMonth] = useState('January');
    const [startYear, setStartYear] = useState(2025);
    const [endMonth, setEndMonth] = useState('December');
    const [endYear, setEndYear] = useState(2025);

    // Data State
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState<ServiceDataEntry[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [installData, setInstallData] = useState<InstallDataEntry[]>([]);
    const [installSummary, setInstallSummary] = useState<InstallSummary | null>(null);

    const generateReport = async () => {
        setLoading(true);
        try {
            const pairs: { month: string, year: number }[] = [];

            if (filterMode === 'month') {
                pairs.push({ month: selectedMonth, year: selectedYear });
            } else {
                const startIndex = MONTHS.indexOf(startMonth);
                const endIndex = MONTHS.indexOf(endMonth);

                const startDate = new Date(startYear, startIndex, 1);
                const endDate = new Date(endYear, endIndex, 1);

                // Validate range
                if (startDate > endDate) {
                    alert('Start month must be before or equal to End month');
                    setLoading(false);
                    return;
                }

                // Iterate through months
                const current = new Date(startDate);
                while (current <= endDate) {
                    pairs.push({
                        month: MONTHS[current.getMonth()],
                        year: current.getFullYear()
                    });
                    current.setMonth(current.getMonth() + 1);
                }
            }

            const result = await getConsolidatedReport(pairs);

            if (result.success) {
                setServiceData(result.serviceData || []);
                setCategoryData(result.categories || []);
                setInstallData(result.installData || []);
                setInstallSummary(result.installSummary || null);
            } else {
                alert('Failed to load report: ' + result.error);
            }

        } catch (error) {
            console.error(error);
            alert('Error generating report');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (serviceData.length === 0 && installData.length === 0) return;

        let fileName = 'Performance_Report';
        if (filterMode === 'month') {
            fileName += `_${selectedMonth}_${selectedYear}`;
        } else {
            fileName += `_${startMonth.slice(0, 3)}${startYear}_to_${endMonth.slice(0, 3)}${endYear}`;
        }
        fileName += '.xlsx';

        exportToExcel({
            serviceData,
            installData,
            categoryData,
            installSummary,
            fileName
        });
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-white">
                        Consolidated Performance Reports
                    </h1>
                    <p className="text-slate-400 mt-1">View aggregated analytics for Service and Install teams</p>
                </div>

                <div className="flex flex-col gap-4 items-end">

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                        {/* Mode Toggle */}
                        <div className="flex bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setFilterMode('month')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterMode === 'month' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Single Month
                            </button>
                            <button
                                onClick={() => setFilterMode('range')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterMode === 'range' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Month Range
                            </button>
                        </div>

                        {filterMode === 'month' ? (
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 outline-none focus:border-blue-500"
                                >
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 outline-none focus:border-blue-500"
                                >
                                    {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold px-1">From</label>
                                    <div className="flex gap-1">
                                        <select
                                            value={startMonth}
                                            onChange={(e) => setStartMonth(e.target.value)}
                                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-1.5 outline-none focus:border-blue-500"
                                        >
                                            {MONTHS.map(m => <option key={m} value={m}>{m.slice(0, 3)}</option>)}
                                        </select>
                                        <select
                                            value={startYear}
                                            onChange={(e) => setStartYear(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-1.5 outline-none focus:border-blue-500"
                                        >
                                            {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold px-1">To</label>
                                    <div className="flex gap-1">
                                        <select
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-1.5 outline-none focus:border-blue-500"
                                        >
                                            {MONTHS.map(m => <option key={m} value={m}>{m.slice(0, 3)}</option>)}
                                        </select>
                                        <select
                                            value={endYear}
                                            onChange={(e) => setEndYear(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-1.5 outline-none focus:border-blue-500"
                                        >
                                            {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={generateReport}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                            title="Generate Report"
                        >
                            <Search size={20} />
                        </button>

                        <div className="w-px h-8 bg-slate-800 mx-2"></div>

                        <button
                            onClick={handleDownload}
                            disabled={loading || (serviceData.length === 0 && installData.length === 0)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-600"
                            title="Download Excel Report"
                        >
                            <FileDown size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {serviceData.length === 0 && installData.length === 0 && !loading && (
                <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-xl border border-slate-800 border-dashed">
                    Select a date range and click search to view reports
                </div>
            )}

            {loading && (
                <div className="text-center py-20 text-slate-400">
                    Generating consolidated report...
                </div>
            )}

            {/* SERVICE TABLE */}
            {!loading && serviceData.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-orange-400">Service Team Consolidated Data</h2>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-xs tracking-tight">
                                <tr>
                                    <th className="p-3 border border-slate-700 w-40 text-left">Tech Name</th>
                                    <th className="p-3 border border-slate-700">ALLOCATED</th>
                                    <th className="p-3 border border-slate-700">1 WEEK REPORT (1ST TO 7TH)</th>
                                    <th className="p-3 border border-slate-700">2 WEEK REPORT (8TH TO 14TH)</th>
                                    <th className="p-3 border border-slate-700">3 WEEK REPORT (15TH TO 21ST)</th>
                                    <th className="p-3 border border-slate-700">4 TH WEEK (22ND TO 29TH)</th>
                                    <th className="p-3 border border-slate-700">5TH WEEK (30TH TO 31ST)</th>
                                    <th className="p-3 border border-slate-700 font-bold bg-slate-900">Total</th>
                                    <th className="p-3 border border-slate-700">WORK DAYS</th>
                                    <th className="p-3 border border-slate-700">AVG COMP</th>
                                    <th className="p-3 border border-slate-700 text-left">DESIGNATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {serviceData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                        <td className="p-3 border border-slate-700 font-bold text-white text-left">{row.techName}</td>
                                        <td className="p-3 border border-slate-700">{row.allocatedCalls.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.week1.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.week2.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.week3.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.week4.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.week5.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700 font-bold text-orange-400 bg-slate-800/20">{row.totalCompleted.toFixed(0)}</td>
                                        <td className="p-3 border border-slate-700">{row.workingDays}</td>
                                        <td className="p-3 border border-slate-700">{row.completedAverage.toFixed(2)}</td>
                                        <td className="p-3 border border-slate-700 text-xs text-left text-slate-400">{row.designation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* CALL TYPE SUMMARY TABLE */}
                    {categoryData.length > 0 && (
                        <div className="max-w-3xl mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-yellow-400">Call Type Summary</h2>
                            </div>
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-xs tracking-tight">
                                        <tr>
                                            <th className="p-3 border border-slate-700 text-left">Category</th>
                                            <th className="p-3 border border-slate-700">In Warranty</th>
                                            <th className="p-3 border border-slate-700">Out Warranty</th>
                                            <th className="p-3 border border-slate-700 font-bold bg-slate-900 text-yellow-400">Total Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {categoryData.map((cat, idx) => (
                                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                                <td className="p-3 border border-slate-700 font-bold text-white text-left">{cat.categoryName}</td>
                                                <td className="p-3 border border-slate-700">{cat.inWarranty}</td>
                                                <td className="p-3 border border-slate-700">{cat.outWarranty}</td>
                                                <td className="p-3 border border-slate-700 font-bold text-yellow-400">{cat.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* INSTALL TABLE */}
            {!loading && installData.length > 0 && (
                <section className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-emerald-400">Install Team Consolidated Data</h2>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-xs tracking-tight">
                                    <tr>
                                        <th className="p-3 border border-slate-700 w-40 text-left">TECH NAME</th>
                                        <th className="p-3 border border-slate-700">ALLOCATED CALLS</th>
                                        <th className="p-3 border border-slate-700">1 WEEK REPORT (1ST TO 7TH)</th>
                                        <th className="p-3 border border-slate-700">2 WEEK REPORT (8TH TO 14TH)</th>
                                        <th className="p-3 border border-slate-700">3 WEEK REPORT (15TH TO 21ST)</th>
                                        <th className="p-3 border border-slate-700">4 TH WEEK (22ND TO 29TH)</th>
                                        <th className="p-3 border border-slate-700">5TH WEEK (30TH TO 31ST)</th>
                                        <th className="p-3 border border-slate-700 font-bold bg-slate-900">TOTAL COMPLETED</th>
                                        <th className="p-3 border border-slate-700">WORKING DAYS</th>
                                        <th className="p-3 border border-slate-700">COMPLETED AVERAGE</th>
                                        <th className="p-3 border border-slate-700">PENDING CALLS</th>
                                        <th className="p-3 border border-slate-700 text-left">DESIGNATION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {installData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                            <td className="p-3 border border-slate-700 font-bold text-white text-left">{row.techName}</td>
                                            <td className="p-3 border border-slate-700">{row.allocatedCalls.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.week1.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.week2.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.week3.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.week4.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.week5.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700 font-bold text-emerald-400 bg-slate-800/20">{row.totalCompleted.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700">{row.workingDays}</td>
                                            <td className="p-3 border border-slate-700">{row.completedAverage.toFixed(2)}</td>
                                            <td className="p-3 border border-slate-700 font-bold text-red-400">{row.pendingCalls.toFixed(0)}</td>
                                            <td className="p-3 border border-slate-700 text-xs text-left text-slate-400">{row.designation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* INSTALL MATERIALS TABLE */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-yellow-400">Install Materials Consolidated</h3>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-slate-950 text-slate-300 uppercase font-semibold text-xs tracking-tight">
                                    <tr>
                                        <th className="p-3 border border-slate-700 w-40 text-left">NAME</th>
                                        <th className="p-3 border border-slate-700">STAND</th>
                                        <th className="p-3 border border-slate-700">STAND FIXING</th>
                                        <th className="p-3 border border-slate-700">COPPER PIPE</th>
                                        <th className="p-3 border border-slate-700">COPPER PIPE FIXING</th>
                                        <th className="p-3 border border-slate-700">COTTON ROLL</th>
                                        <th className="p-3 border border-slate-700">STABILIZER</th>
                                        <th className="p-3 border border-slate-700">AMC ACHIEVED</th>
                                        <th className="p-3 border border-slate-700">NO INSTALL</th>
                                        <th className="p-3 border border-slate-700">DISMANTLING</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {installData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                                            <td className="p-3 border border-slate-700 font-bold text-white text-left">{row.techName}</td>
                                            <td className="p-3 border border-slate-700">{row.stand}</td>
                                            <td className="p-3 border border-slate-700">{row.standFixing}</td>
                                            <td className="p-3 border border-slate-700">{row.copperPipe.toFixed(1)}</td>
                                            <td className="p-3 border border-slate-700">{row.copperPipeFixing.toFixed(1)}</td>
                                            <td className="p-3 border border-slate-700">{row.cottonRoll}</td>
                                            <td className="p-3 border border-slate-700">{row.stabilizer}</td>
                                            <td className="p-3 border border-slate-700">{row.amc}</td>
                                            <td className="p-3 border border-slate-700">{row.noInstall}</td>
                                            <td className="p-3 border border-slate-700">{row.dismantling}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* CONSOLIDATED CALL COMPLETION DETAILS TABLE */}
            {!loading && installSummary && (
                <section className="max-w-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-cyan-400">Call Completion Details</h3>
                    </div>
                    <div className="bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-[#0b1120] text-emerald-400 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4 border-r border-slate-800 border-b border-slate-800 w-20 text-center">S.NO</th>
                                    <th className="p-4 border-r border-slate-800 border-b border-slate-800 text-center tracking-widest">CALL COMPLETION DETAILS</th>
                                    <th className="p-4 border-b border-slate-800 w-24 text-center">QTY</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-200">
                                <tr className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 border-r border-slate-800 text-center">1</td>
                                    <td className="p-4 border-r border-slate-800 font-bold tracking-wider">INSTALLATION</td>
                                    <td className="p-4 text-center font-bold text-emerald-400">{installSummary.installQty}</td>
                                </tr>
                                <tr className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 border-r border-slate-800 text-center">2</td>
                                    <td className="p-4 border-r border-slate-800 font-bold tracking-wider">RE-INSTALL</td>
                                    <td className="p-4 text-center font-bold text-emerald-400">{installSummary.reinstallQty}</td>
                                </tr>
                                <tr className="hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4 border-r border-slate-800 text-center">3</td>
                                    <td className="p-4 border-r border-slate-800 font-bold tracking-wider">DISMANTLING</td>
                                    <td className="p-4 text-center font-bold text-emerald-400">{installSummary.dismantleQty}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
