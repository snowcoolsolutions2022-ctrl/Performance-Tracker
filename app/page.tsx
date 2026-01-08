"use client";

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Users, CheckCircle, AlertCircle, Wrench, Zap, Package, Activity } from 'lucide-react';
import { getDashboardStats } from './actions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = [2024, 2025, 2026, 2027];

type DashboardData = {
  kpi: {
    totalInstallCalls: number;
    totalServiceCalls: number;
    totalPending: number;
    efficiency: string;
    totalAMC: number;
    totalStabilizer: number;
    totalStand: number;
    totalCopperPipe: number;
  };
  charts: {
    weeklyData: { name: string, install: number, service: number }[];
  }
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('January'); // Default to current or specific
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getDashboardStats(selectedMonth, selectedYear);
    if (result.success && result.kpi && result.charts) {
      setData({
        kpi: result.kpi,
        charts: result.charts
      });
    }
    setLoading(false);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-2">Real-time performance metrics and insights.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
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
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center text-slate-400 animate-pulse">
          Loading dashboard data...
        </div>
      ) : data ? (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Installations"
              value={data.kpi.totalInstallCalls.toFixed(0)}
              subtext="Completed this month"
              icon={Wrench}
              color="text-emerald-400"
              bg="bg-emerald-400/10"
            />
            <KPICard
              title="Service Calls"
              value={data.kpi.totalServiceCalls.toFixed(0)}
              subtext="Completed this month"
              icon={Users}
              color="text-purple-400"
              bg="bg-purple-400/10"
            />
            <KPICard
              title="Pending Calls"
              value={data.kpi.totalPending.toFixed(0)}
              subtext="Across all teams"
              icon={AlertCircle}
              color="text-red-400"
              bg="bg-red-400/10"
            />
            <KPICard
              title="Efficiency Rate"
              value={`${data.kpi.efficiency}%`}
              subtext="Completion vs Allocation"
              icon={Activity}
              color="text-blue-400"
              bg="bg-blue-400/10"
            />
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="AMC Sold"
              value={data.kpi.totalAMC.toFixed(0)}
              subtext="Annual Maintenance"
              icon={CheckCircle}
              color="text-yellow-400"
              bg="bg-yellow-400/10"
            />
            <KPICard
              title="Stabilizers Sold"
              value={data.kpi.totalStabilizer.toFixed(0)}
              subtext="Unit Sales"
              icon={Zap}
              color="text-orange-400"
              bg="bg-orange-400/10"
            />
            <KPICard
              title="Copper Pipe (ft)"
              value={data.kpi.totalCopperPipe.toFixed(1)}
              subtext="Material Usage"
              icon={Package}
              color="text-cyan-400"
              bg="bg-cyan-400/10"
            />
            <KPICard
              title="Stands Fixed"
              value={data.kpi.totalStand.toFixed(0)}
              subtext="Material Usage"
              icon={Package}
              color="text-indigo-400"
              bg="bg-indigo-400/10"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Performance Chart */}
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 min-h-[400px]">
              <h3 className="text-xl font-semibold font-outfit mb-6 text-white">Weekly Team Performance</h3>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend />
                    <Bar dataKey="install" name="Install Team" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="service" name="Service Team" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Material Distribution (Simplified as another bar chart for readability) */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 min-h-[400px]">
              <h3 className="text-xl font-semibold font-outfit mb-6 text-white">Sales & Materials</h3>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'AMC', value: data.kpi.totalAMC, fill: '#facc15' },
                      { name: 'Stabilizer', value: data.kpi.totalStabilizer, fill: '#fb923c' },
                      { name: 'Stand', value: data.kpi.totalStand, fill: '#818cf8' },
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                    <Tooltip
                      cursor={{ fill: '#334155', opacity: 0.2 }}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {
                        [
                          { name: 'AMC', value: data.kpi.totalAMC, fill: '#facc15' },
                          { name: 'Stabilizer', value: data.kpi.totalStabilizer, fill: '#fb923c' },
                          { name: 'Stand', value: data.kpi.totalStand, fill: '#818cf8' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-slate-500">
          No data available for the selected period.
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, subtext, icon: Icon, color = "text-blue-400", bg = "bg-slate-800/50" }: any) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:-translate-y-1 duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold font-outfit mt-2 text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-slate-500">{subtext}</span>
      </div>
    </div>
  );
}
