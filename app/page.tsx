import { ArrowUpRight, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-outfit tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-400 mt-2">Welcome back. Here's what's happening this month.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Installations" value="142" change="+12.5%" icon={CheckCircle} />
        <KPICard title="Service Calls" value="328" change="+8.2%" icon={Users} color="text-purple-400" />
        <KPICard title="Pending Calls" value="5" change="-2.4%" icon={AlertCircle} color="text-orange-400" />
        <KPICard title="Efficiency Rate" value="94%" change="+1.1%" icon={ArrowUpRight} color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Charts */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-lg font-semibold font-outfit mb-4">Weekly Performance</h3>
          <div className="h-full flex items-center justify-center text-slate-500">
            Chart Component Placeholder
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 min-h-[300px]">
          <h3 className="text-lg font-semibold font-outfit mb-4">Team Distribution</h3>
          <div className="h-full flex items-center justify-center text-slate-500">
            Pie Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon: Icon, color = "text-blue-400" }: { title: string, value: string, change: string, icon: any, color?: string }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold font-outfit mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/50 ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full font-medium">{change}</span>
        <span className="text-slate-500">from last month</span>
      </div>
    </div>
  );
}
