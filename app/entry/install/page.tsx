"use client";

import { useState, useEffect, useCallback } from 'react';
import { Save, Calendar, Plus, Trash2 } from 'lucide-react';
import { saveInstallReport, getInstallReport, InstallDataEntry } from '../../actions';

export const dynamic = 'force-dynamic';


interface ReportHeaders {
    t1?: string[];
    t2?: string[];
    t3?: string[];
    t3Rows?: string[];
}

const INITIAL_ROWS = 3;
const DEFAULT_TECHS = ['EDAMALIYAN', 'SUDHAN', 'JAFFER'];

const INITIAL_DATA: InstallDataEntry[] = Array.from({ length: INITIAL_ROWS }).map((_, i) => ({
    techName: DEFAULT_TECHS[i] || '',
    designation: i === 2 ? 'INSTALL TEAM & HELPER' : 'INSTALL TEAM',
    allocatedCalls: 0,
    week1: 0,
    week2: 0,
    week3: 0,
    week4: 0,
    week5: 0,
    totalCompleted: 0,
    workingDays: 0,
    completedAverage: 0,
    pendingCalls: 0,
    stand: 0,
    standFixing: 0,
    copperPipe: 0,
    copperPipeFixing: 0,
    cottonRoll: 0,
    stabilizer: 0,
    amc: 0,
    noInstall: 0,
    dismantling: 0,
}));

export default function InstallEntryPage() {
    const [month, setMonth] = useState('December');
    const [year, setYear] = useState(2025);
    const [entries, setEntries] = useState<InstallDataEntry[]>(INITIAL_DATA);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Summary & Metadata State
    const [monthlySummary, setMonthlySummary] = useState({ install: 0, reinstall: 0, dismantling: 0 });
    const [summaryQtys, setSummaryQtys] = useState(['0', '0', '0']); // [Total, Target, Pending]

    const [table1Title, setTable1Title] = useState('DECEMBER MONTH - 2025 INSTALLATION TECHNICIAN CALL COMPLETION DETAILS');
    const [table2Title, setTable2Title] = useState('INSTALL TECHNICIAN MATERIAL DETAILS');
    const [table3Title, setTable3Title] = useState('CALL COMPLETED DETAILS DEC 2025');

    const [t1Headers, setT1Headers] = useState([
        'TECH NAME', 'ALLOCATED CALLS',
        '1 WEEK REPORT (1ST TO 7TH)', '2 WEEK REPORT (8TH TO 14TH)',
        '3 WEEK REPORT (15TH TO 21ST)', '4 TH WEEK (22ND TO 29TH)', '5TH WEEK (30TH TO 31ST)',
        'TOTAL COMPLETED', 'WORKING DAYS', 'COMPLETED AVERAGE',
        'PENDING CALLS', 'DESIGNATION'
    ]);

    const [t2Headers, setT2Headers] = useState([
        'NAME', 'STAND', 'STAND FIXING', 'COPPER PIPE', 'COPPER PIPE FIXING',
        'COTTON ROLL', 'STABILIZER', 'AMC ACHIEVED', 'NO INSTALL', 'DISMANTLING'
    ]);

    const [t3Headers, setT3Headers] = useState(['S.NO', 'CALL COMPLETION DETAILS', 'QTY']);
    const [t3Rows, setT3Rows] = useState(['TOTAL CALL COMPLETED', 'TARGET PER DAY', 'PENDING CALLS']);

    const loadReport = useCallback(async () => {
        setIsLoading(true);
        // Reset to initial state immediately to avoid stale data
        setEntries(INITIAL_DATA);
        setSummaryQtys(['0', '0', '0']);

        try {
            const result = await getInstallReport(month, year);
            if (result.success && result.data) {
                // Recalculate derived fields for loaded data to ensure formulas are up-to-date
                const updatedData = result.data.map(e => {
                    const totalComp = (e.week1 || 0) + (e.week2 || 0) + (e.week3 || 0) + (e.week4 || 0) + (e.week5 || 0);
                    // Ensure totalCompleted stays consistent with sum
                    const totalCompleted = parseFloat(totalComp.toFixed(1));


                    return {
                        ...e,
                        totalCompleted,
                    };
                });

                setEntries(updatedData);
                if (result.summary) {
                    setMonthlySummary(result.summary);
                    setSummaryQtys([
                        result.summary.install.toString(),
                        result.summary.reinstall.toString(),
                        result.summary.dismantling.toString()
                    ]);
                }
                if (result.metadata) {
                    setTable1Title(result.metadata.table1Title || 'DECEMBER MONTH - 2025 INSTALLATION TECHNICIAN CALL COMPLETION DETAILS');
                    setTable2Title(result.metadata.table2Title || 'INSTALL TECHNICIAN MATERIAL DETAILS');
                    setTable3Title(result.metadata.table3Title || 'CALL COMPLETED DETAILS DEC 2025');
                    if (result.metadata.headers) {
                        // Restore headers if they exist, carefully mapping types if needed
                        // For now assuming the structure matches. In a real app, add validation.
                        const headers = result.metadata.headers as unknown as ReportHeaders;
                        if (headers.t1) {
                            let t1 = headers.t1;
                            // Fix alignment for legacy saved reports (length 14) by removing the deleted columns
                            // Indices 10 (Attended Average) and 11 (Completed Conversion)
                            if (t1.length === 14) {
                                t1 = t1.filter((_, i) => i !== 10 && i !== 11);
                            }
                            // Also update legacy Week headers if they are simple "WEEK X"
                            const verboseWeeks = [
                                '1 WEEK REPORT (1ST TO 7TH)', '2 WEEK REPORT (8TH TO 14TH)',
                                '3 WEEK REPORT (15TH TO 21ST)', '4 TH WEEK (22ND TO 29TH)', '5TH WEEK (30TH TO 31ST)'
                            ];
                            // Indices 2 to 6 correspond to the 5 weeks
                            for (let i = 0; i < 5; i++) {
                                if (t1[i + 2] && t1[i + 2].toUpperCase().startsWith('WEEK ')) {
                                    t1[i + 2] = verboseWeeks[i];
                                }
                            }
                            setT1Headers(t1);
                        }
                        if (headers.t2) setT2Headers(headers.t2);
                        if (headers.t3) setT3Headers(headers.t3);
                        if (headers.t3Rows) setT3Rows(headers.t3Rows);
                    }
                }
            } else {
                setEntries(INITIAL_DATA);
                setMonthlySummary({ install: 0, reinstall: 0, dismantling: 0 });
                // Keep default titles if no data
            }
        } catch (error) {
            console.error("Error loading report:", error);
        } finally {
            setIsLoading(false);
        }
    }, [month, year]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const handleHeaderChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, val: string) => {
        setter(prev => {
            const newArr = [...prev];
            newArr[index] = val;
            return newArr;
        });
    };

    const handleMonthlySummaryChange = (field: keyof typeof monthlySummary, value: string) => {
        setMonthlySummary(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    const handleQtyChange = (index: number, val: string) => {
        const numVal = parseInt(val) || 0;
        setSummaryQtys(prev => {
            const newArr = [...prev];
            newArr[index] = val;
            return newArr;
        });

        // Sync with monthlySummary for saving
        setMonthlySummary(prev => {
            if (index === 0) return { ...prev, install: numVal };
            if (index === 1) return { ...prev, reinstall: numVal };
            if (index === 2) return { ...prev, dismantling: numVal };
            return prev;
        });
    };

    const handleInputChange = (index: number, field: keyof InstallDataEntry, value: string | number) => {
        const newEntries = [...entries];
        // Handle numeric fields vs string fields
        if (field === 'techName' || field === 'designation') {
            newEntries[index] = { ...newEntries[index], [field]: value };
        } else {
            const numValue = parseFloat(value.toString()) || 0;
            newEntries[index] = { ...newEntries[index], [field]: numValue };

            // Auto-calculate Completion Details
            if (['week1', 'week2', 'week3', 'week4', 'week5', 'allocatedCalls', 'workingDays'].includes(field)) {
                const e = newEntries[index];
                const totalComp = (e.week1 || 0) + (e.week2 || 0) + (e.week3 || 0) + (e.week4 || 0) + (e.week5 || 0);
                e.totalCompleted = parseFloat(totalComp.toFixed(1));

                e.pendingCalls = parseFloat(((e.allocatedCalls || 0) - totalComp).toFixed(1));
                e.completedAverage = e.workingDays > 0 ? parseFloat((totalComp / e.workingDays).toFixed(1)) : 0;
            }
        }
        setEntries(newEntries);
    };

    const handleAddRow = () => {
        setEntries(prev => [...prev, {
            techName: '',
            designation: 'INSTALL TEAM', // Default
            allocatedCalls: 0,
            week1: 0,
            week2: 0,
            week3: 0,
            week4: 0,
            week5: 0,
            totalCompleted: 0,
            workingDays: 0,
            completedAverage: 0,
            pendingCalls: 0,
            stand: 0,
            standFixing: 0,
            copperPipe: 0,
            copperPipeFixing: 0,
            cottonRoll: 0,
            stabilizer: 0,
            amc: 0,
            noInstall: 0,
            dismantling: 0,
        }]);
    };

    const handleDeleteRow = (index: number) => {
        if (confirm('Are you sure you want to delete this technician?')) {
            setEntries(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveInstallReport(
                month,
                year,
                entries,
                monthlySummary,
                {
                    table1Title,
                    table2Title,
                    table3Title,
                    headers: { t1: t1Headers, t2: t2Headers, t3: t3Headers, t3Rows: t3Rows }
                }
            );
            if (result.success) {
                alert('Report Saved Successfully!');
            } else {
                alert('Failed to save: ' + result.error);
            }
        } catch (err) {
            alert('Error saving report');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                        Installation Team Entry
                    </h1>
                    <p className="text-slate-400 mt-1">Track installations, materials, and technician performance</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
                        <Calendar size={18} className="text-slate-400" />
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent border-none text-slate-200 focus:ring-0 outline-none cursor-pointer"
                        >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <option key={m} value={m} className="bg-slate-900 text-slate-200">{m}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-transparent border-none text-slate-200 focus:ring-0 outline-none cursor-pointer"
                        >
                            {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(y => (
                                <option key={y} value={y} className="bg-slate-900 text-slate-200">{y}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddRow}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={18} />
                        <span>Add Tech</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-col gap-8">

                {/* TABLE 1: CALL COMPLETION DETAILS */}
                <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <input
                            value={table1Title}
                            onChange={(e) => setTable1Title(e.target.value)}
                            className="text-lg font-semibold font-outfit text-orange-400 uppercase tracking-wider bg-transparent border-none outline-none w-full"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-orange-500/10 text-orange-200">
                                <tr>
                                    <th className="p-1 border-r border-slate-800 w-10 text-center">
                                        <Trash2 size={14} className="mx-auto text-slate-500" />
                                    </th>
                                    <th className="p-1 border-r border-slate-800 w-10 text-center">#</th>
                                    {t1Headers.map((header, idx) => (
                                        <th key={idx} className={`p-1 border-r border-slate-800 ${idx === 0 ? 'min-w-[200px]' : // Tech Name
                                            (idx >= 2 && idx <= 6) || idx === 7 || (idx >= 9 && idx <= 11) ? 'min-w-[220px]' : // Weekly Reports & Metrics
                                                idx === 13 ? 'min-w-[180px]' : // Designation
                                                    'min-w-[140px]' // Others
                                            }`}>
                                            <input
                                                value={header}
                                                onChange={(e) => handleHeaderChange(setT1Headers, idx, e.target.value)}
                                                className="w-full bg-transparent text-center font-bold outline-none p-2 text-xs uppercase placeholder-orange-200/50 whitespace-nowrap overflow-hidden"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {entries.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-1 border-r border-slate-800 text-center w-10">
                                            <button
                                                onClick={() => handleDeleteRow(idx)}
                                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                title="Delete Technician"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                        <td className="p-2 border-r border-slate-800 text-center text-slate-500 text-xs w-8">
                                            {idx + 1}
                                        </td>
                                        <td className="p-0 border-r border-slate-800">
                                            <input
                                                type="text"
                                                value={entry.techName}
                                                onChange={(e) => handleInputChange(idx, 'techName', e.target.value)}
                                                className="w-full h-full p-3 bg-transparent text-center font-bold text-slate-200 outline-none focus:bg-slate-800"
                                                placeholder="Name"
                                            />
                                        </td>
                                        <InputCell value={entry.allocatedCalls} onChange={(v) => handleInputChange(idx, 'allocatedCalls', v)} />
                                        <InputCell value={entry.week1} onChange={(v) => handleInputChange(idx, 'week1', v)} />
                                        <InputCell value={entry.week2} onChange={(v) => handleInputChange(idx, 'week2', v)} />
                                        <InputCell value={entry.week3} onChange={(v) => handleInputChange(idx, 'week3', v)} />
                                        <InputCell value={entry.week4} onChange={(v) => handleInputChange(idx, 'week4', v)} />
                                        <InputCell value={entry.week5} onChange={(v) => handleInputChange(idx, 'week5', v)} />

                                        <td className="p-3 border-r border-slate-800 text-center font-bold text-orange-400">
                                            {entry.totalCompleted}
                                        </td>

                                        <InputCell value={entry.workingDays} onChange={(v) => handleInputChange(idx, 'workingDays', v)} />

                                        <td className="p-3 border-r border-slate-800 text-center text-slate-400">{entry.completedAverage}</td>



                                        <td className="p-3 border-r border-slate-800 text-center font-bold text-red-400">{entry.pendingCalls}</td>

                                        <td className="p-0 border-r border-slate-800">
                                            <input
                                                type="text"
                                                value={entry.designation}
                                                onChange={(e) => handleInputChange(idx, 'designation', e.target.value)}
                                                className="w-full h-full p-3 bg-transparent text-center text-xs text-slate-400 outline-none focus:bg-slate-800"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* TABLE 2: MATERIAL DETAILS */}
                <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <input
                            value={table2Title}
                            onChange={(e) => setTable2Title(e.target.value)}
                            className="text-lg font-semibold font-outfit text-yellow-400 uppercase tracking-wider bg-transparent border-none outline-none w-full"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-yellow-500/10 text-yellow-200">
                                <tr>
                                    <th className="p-1 border-r border-slate-800 w-10 text-center">#</th>
                                    {t2Headers.map((header, idx) => (
                                        <th key={idx} className={`p-1 border-r border-slate-800 ${idx === 0 ? 'min-w-[180px]' : // Name
                                            'min-w-[120px]'
                                            }`}>
                                            <input
                                                value={header}
                                                onChange={(e) => handleHeaderChange(setT2Headers, idx, e.target.value)}
                                                className="w-full bg-transparent text-center font-bold outline-none p-2 text-xs uppercase placeholder-yellow-200/50"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {entries.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-2 border-r border-slate-800 text-center text-slate-500 text-xs">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 border-r border-slate-800 font-medium text-slate-200 bg-slate-800/20">{entry.techName || '-'}</td>
                                        <InputCell value={entry.stand} onChange={(v) => handleInputChange(idx, 'stand', v)} />
                                        <InputCell value={entry.standFixing} onChange={(v) => handleInputChange(idx, 'standFixing', v)} />
                                        <InputCell value={entry.copperPipe} onChange={(v) => handleInputChange(idx, 'copperPipe', v)} />
                                        <InputCell value={entry.copperPipeFixing} onChange={(v) => handleInputChange(idx, 'copperPipeFixing', v)} />
                                        <InputCell value={entry.cottonRoll} onChange={(v) => handleInputChange(idx, 'cottonRoll', v)} />
                                        <InputCell value={entry.stabilizer} onChange={(v) => handleInputChange(idx, 'stabilizer', v)} />
                                        <InputCell value={entry.amc} onChange={(v) => handleInputChange(idx, 'amc', v)} />
                                        <InputCell value={entry.noInstall} onChange={(v) => handleInputChange(idx, 'noInstall', v)} />
                                        <InputCell value={entry.dismantling} onChange={(v) => handleInputChange(idx, 'dismantling', v)} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* TABLE 3: SUMMARY */}
                <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden self-start w-full max-w-2xl">
                    <div className="bg-emerald-500/10 text-emerald-200 border-b border-slate-800">
                        <div className="flex w-full">
                            {t3Headers.map((header, idx) => (
                                <div key={idx} className={`p-1 border-r border-slate-800 last:border-none flex items-center justify-center ${idx === 0 ? 'w-16 flex-none' :
                                    idx === 2 ? 'w-24 flex-none' :
                                        'flex-1'
                                    }`}>
                                    <input
                                        value={header}
                                        onChange={(e) => handleHeaderChange(setT3Headers, idx, e.target.value)}
                                        className="w-full bg-transparent text-center font-bold outline-none p-2 text-xs uppercase"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-slate-800">
                        <div className="flex w-full items-center hover:bg-slate-800/30">
                            <div className="p-3 border-r border-slate-800 w-16 flex-none text-center text-slate-400">1</div>
                            <div className="flex-1 border-r border-slate-800">
                                <input
                                    value={t3Rows[0]}
                                    onChange={(e) => handleHeaderChange(setT3Rows, 0, e.target.value)}
                                    className="w-full h-full p-3 bg-transparent text-left font-medium text-slate-200 outline-none"
                                />
                            </div>
                            <div className="w-24 flex-none p-0">
                                <input
                                    className="w-full h-full p-3 bg-transparent text-center font-bold text-emerald-400 outline-none focus:bg-slate-800"
                                    value={summaryQtys[0]}
                                    onChange={(e) => handleQtyChange(0, e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex w-full items-center hover:bg-slate-800/30">
                            <div className="p-3 border-r border-slate-800 w-16 flex-none text-center text-slate-400">2</div>
                            <div className="flex-1 border-r border-slate-800">
                                <input
                                    value={t3Rows[1]}
                                    onChange={(e) => handleHeaderChange(setT3Rows, 1, e.target.value)}
                                    className="w-full h-full p-3 bg-transparent text-left font-medium text-slate-200 outline-none"
                                />
                            </div>
                            <div className="w-24 flex-none p-0">
                                <input
                                    className="w-full h-full p-3 bg-transparent text-center font-bold text-emerald-400 outline-none focus:bg-slate-800"
                                    value={summaryQtys[1]}
                                    onChange={(e) => handleQtyChange(1, e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex w-full items-center hover:bg-slate-800/30">
                            <div className="p-3 border-r border-slate-800 w-16 flex-none text-center text-slate-400">3</div>
                            <div className="flex-1 border-r border-slate-800">
                                <input
                                    value={t3Rows[2]}
                                    onChange={(e) => handleHeaderChange(setT3Rows, 2, e.target.value)}
                                    className="w-full h-full p-3 bg-transparent text-left font-medium text-slate-200 outline-none"
                                />
                            </div>
                            <div className="w-24 flex-none p-0">
                                <input
                                    className="w-full h-full p-3 bg-transparent text-center font-bold text-emerald-400 outline-none focus:bg-slate-800"
                                    value={summaryQtys[2]}
                                    onChange={(e) => handleQtyChange(2, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function InputCell({ value, onChange }: { value: number, onChange: (val: string) => void }) {
    return (
        <td className="p-0 border-r border-slate-800 min-w-[80px]">
            <input
                type="number"
                value={value === 0 ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-3 bg-transparent text-center outline-none text-slate-300 focus:bg-slate-800 transition-colors"
                placeholder="0"
            />
        </td>
    )
}
