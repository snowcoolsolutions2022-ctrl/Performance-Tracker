"use client";

import { useState, useEffect, useCallback } from 'react';
import { Save, Calendar, Plus, Trash2 } from 'lucide-react';
import { saveServiceReport, getServiceReport, ServiceDataEntry, CategoryData } from '../../actions';

export const dynamic = 'force-dynamic';


const DEFAULT_SERVICE_TECHS = [
    { name: 'JERIN', designation: 'SERVICE TEAM' },
    { name: 'GOPINATH', designation: 'SERVICE TEAM' },
    { name: 'VISWAJITH', designation: 'SERVICE TEAM' },
    { name: 'SIVA', designation: 'MULTI' }
];

const INITIAL_SERVICE_DATA: ServiceDataEntry[] = DEFAULT_SERVICE_TECHS.map(t => ({
    techName: t.name,
    designation: t.designation,
    allocatedCalls: 0,
    week1: 0,
    week2: 0,
    week3: 0,
    week4: 0,
    week5: 0,
    totalCompleted: 0,
    workingDays: 0,
    completedAverage: 0,
    attendedAverage: 0,
}));

const DEFAULT_CATEGORIES = [
    'HOOPERWASH', 'GAS LEAK', 'SERVICE/BRK', 'WATER WASH'
];

const INITIAL_CATEGORY_DATA: CategoryData[] = DEFAULT_CATEGORIES.map(c => ({
    categoryName: c,
    inWarranty: 0,
    outWarranty: 0,
    total: 0
}));

export default function ServiceEntryPage() {
    const [month, setMonth] = useState('December');
    const [year, setYear] = useState(2025);
    const [entries, setEntries] = useState<ServiceDataEntry[]>(INITIAL_SERVICE_DATA);
    const [categories, setCategories] = useState<CategoryData[]>(INITIAL_CATEGORY_DATA);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // --- EDITABLE STATE FOR HEADERS ---
    const [table1Title, setTable1Title] = useState('DECEMBER MONTH - SERVICE TEAM REPORT');
    const [categoryTitle, setCategoryTitle] = useState('CALL TYPE SUMMARY');
    const [t1Headers, setT1Headers] = useState([
        'Tech Name', 'ALLOCATED', '1 WEEK REPORT (1ST TO 7TH)', '2 WEEK REPORT (8TH TO 14TH)',
        '3 WEEK REPORT (15TH TO 21ST)', '4 TH WEEK (22ND TO 29TH)', '5TH WEEK (30TH TO 31ST)',
        'TOTAL', 'WORK DAYS', 'AVG COMP', 'DESIGNATION'
    ]);

    const loadReport = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getServiceReport(month, year);
            if (result.success && result.data) {
                setEntries(result.data);
                if (result.categories) {
                    setCategories(result.categories);
                } else {
                    setCategories(INITIAL_CATEGORY_DATA);
                }
                if (result.metadata) {
                    setTable1Title(result.metadata.table1Title || 'DECEMBER MONTH - SERVICE TEAM REPORT');
                    setCategoryTitle(result.metadata.categoryTitle || 'CALL TYPE SUMMARY');
                    // if (result.metadata.headers) setT1Headers(result.metadata.headers.t1);
                }
            } else {
                setEntries(INITIAL_SERVICE_DATA);
                setCategories(INITIAL_CATEGORY_DATA);
            }
        } catch (error) {
            console.error("Error loading service report:", error);
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

    const handleInputChange = (index: number, field: keyof ServiceDataEntry, value: string | number) => {
        const newEntries = [...entries];
        if (field === 'techName' || field === 'designation') {
            newEntries[index] = { ...newEntries[index], [field]: value };
        } else {
            const numValue = parseFloat(value.toString()) || 0;
            newEntries[index] = { ...newEntries[index], [field]: numValue };

            // Auto-calculate Total and Average
            if (['week1', 'week2', 'week3', 'week4', 'week5', 'workingDays'].includes(field)) {
                const e = newEntries[index];
                const totalComp = (e.week1 || 0) + (e.week2 || 0) + (e.week3 || 0) + (e.week4 || 0) + (e.week5 || 0);
                e.totalCompleted = parseFloat(totalComp.toFixed(1));
                e.attendedAverage = e.workingDays > 0 ? parseFloat((totalComp / e.workingDays).toFixed(1)) : 0;
                e.completedAverage = e.attendedAverage; // Auto-sync specific to Service logic if same
            }
        }
        setEntries(newEntries);
    };

    const handleCategoryChange = (index: number, field: 'inWarranty' | 'outWarranty', value: string) => {
        const newCats = [...categories];
        const numValue = parseInt(value) || 0;
        newCats[index] = { ...newCats[index], [field]: numValue };
        newCats[index].total = newCats[index].inWarranty + newCats[index].outWarranty;
        setCategories(newCats);
    };

    const handleAddRow = () => {
        setEntries(prev => [...prev, {
            techName: '',
            designation: 'SERVICE TEAM',
            allocatedCalls: 0,
            week1: 0,
            week2: 0,
            week3: 0,
            week4: 0,
            week5: 0,
            totalCompleted: 0,
            workingDays: 0,
            completedAverage: 0,
            attendedAverage: 0,
        }]);
    };

    const handleDeleteRow = (index: number) => {
        if (confirm('Are you sure you want to delete this technician?')) {
            setEntries(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddCategory = () => {
        setCategories(prev => [...prev, {
            categoryName: '',
            inWarranty: 0,
            outWarranty: 0,
            total: 0
        }]);
    };

    const handleDeleteCategory = (index: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveServiceReport(
                month,
                year,
                entries,
                categories,
                {
                    table1Title,
                    categoryTitle,
                    headers: { t1: t1Headers }
                }
            );
            if (result.success) {
                alert('Service Report Saved Successfully!');
            } else {
                alert('Failed to save: ' + result.error);
            }
        } catch (err) {
            alert('Error saving service report');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
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
                        disabled={isSaving || isLoading}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50"
                    >
                        <Save size={18} />
                        <span>{isSaving ? 'Saving...' : 'Save Report'}</span>
                    </button>
                </div>
            </header>

            {/* Service Team Report Table */}
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
                                {t1Headers.map((header, idx) => (
                                    <th key={idx} className={`p-1 border-r border-slate-800 ${idx === 0 ? 'min-w-[150px]' :
                                        idx >= 2 && idx <= 6 ? 'min-w-[220px]' :
                                            idx === 10 ? 'min-w-[150px]' :
                                                'min-w-[100px]'
                                        }`}>
                                        <input
                                            value={header}
                                            onChange={(e) => handleHeaderChange(setT1Headers, idx, e.target.value)}
                                            className="w-full bg-transparent text-center font-bold outline-none p-2 text-xs placeholder-orange-200/50"
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
                                    <td className="p-0 border-r border-slate-800">
                                        <input
                                            type="text"
                                            value={entry.techName}
                                            onChange={(e) => handleInputChange(idx, 'techName', e.target.value)}
                                            className="w-full h-full p-3 bg-transparent text-center font-semibold text-slate-200 outline-none focus:bg-slate-800"
                                        />
                                    </td>
                                    <InputCell value={entry.allocatedCalls} onChange={(v) => handleInputChange(idx, 'allocatedCalls', v)} />
                                    <InputCell value={entry.week1} onChange={(v) => handleInputChange(idx, 'week1', v)} />
                                    <InputCell value={entry.week2} onChange={(v) => handleInputChange(idx, 'week2', v)} />
                                    <InputCell value={entry.week3} onChange={(v) => handleInputChange(idx, 'week3', v)} />
                                    <InputCell value={entry.week4} onChange={(v) => handleInputChange(idx, 'week4', v)} />
                                    <InputCell value={entry.week5} onChange={(v) => handleInputChange(idx, 'week5', v)} />

                                    <td className="p-3 border-r border-slate-800 text-center font-bold text-blue-400 bg-slate-800/10">
                                        {entry.totalCompleted}
                                    </td>

                                    <InputCell value={entry.workingDays} onChange={(v) => handleInputChange(idx, 'workingDays', v)} />

                                    <td className="p-3 border-r border-slate-800 text-center font-bold text-emerald-400 bg-slate-800/10">
                                        {entry.attendedAverage}
                                    </td>

                                    <td className="p-0 border-r border-slate-800">
                                        <input
                                            type="text"
                                            value={entry.designation}
                                            onChange={(e) => handleInputChange(idx, 'designation', e.target.value)}
                                            className="w-full h-full p-3 bg-transparent text-center text-xs text-slate-400 outline-none focus:bg-slate-800 uppercase"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Category Breakdown Table */}
            <section className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden mt-8 max-w-3xl">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-4">
                    <input
                        value={categoryTitle}
                        onChange={(e) => setCategoryTitle(e.target.value)}
                        className="text-lg font-semibold font-outfit text-yellow-400 uppercase tracking-wider bg-transparent border-none outline-none flex-1"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 px-3 py-1.5 rounded-lg font-medium transition-colors border border-yellow-600/30 text-xs"
                    >
                        <Plus size={14} />
                        <span>Add Category</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-yellow-500/10 text-yellow-200">
                            <tr>
                                <th className="p-3 border-r border-slate-800 w-10 text-center">
                                    <Trash2 size={14} className="mx-auto text-slate-500" />
                                </th>
                                <th className="p-3 border-r border-slate-800 text-left min-w-[200px]">Category</th>
                                <th className="p-3 border-r border-slate-800 min-w-[120px]">In Warranty</th>
                                <th className="p-3 border-r border-slate-800 min-w-[120px]">Out Warranty</th>
                                <th className="p-3 bg-yellow-500/20 min-w-[120px]">Total Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {categories.map((cat, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-1 border-r border-slate-800 text-center w-10">
                                        <button
                                            onClick={() => handleDeleteCategory(idx)}
                                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                    <td className="p-0 border-r border-slate-800">
                                        <input
                                            value={cat.categoryName}
                                            onChange={(e) => {
                                                const newCats = [...categories];
                                                newCats[idx] = { ...newCats[idx], categoryName: e.target.value };
                                                setCategories(newCats);
                                            }}
                                            className="w-full h-full bg-transparent p-3 text-left outline-none focus:bg-slate-800 text-slate-200 font-medium"
                                            placeholder="Category Name"
                                        />
                                    </td>
                                    <td className="p-0 border-r border-slate-800">
                                        <input
                                            value={cat.inWarranty}
                                            onChange={(e) => handleCategoryChange(idx, 'inWarranty', e.target.value)}
                                            className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800 text-slate-200"
                                        />
                                    </td>
                                    <td className="p-0 border-r border-slate-800">
                                        <input
                                            value={cat.outWarranty}
                                            onChange={(e) => handleCategoryChange(idx, 'outWarranty', e.target.value)}
                                            className="w-full h-full bg-transparent p-3 text-center outline-none focus:bg-slate-800 text-slate-200"
                                        />
                                    </td>
                                    <td className="p-3 bg-slate-800/20 font-bold text-slate-200">{cat.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
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
