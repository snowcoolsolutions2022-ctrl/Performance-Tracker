"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, Hammer, FileBarChart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Install Entry', href: '/entry/install', icon: Hammer },
    { name: 'Service Entry', href: '/entry/service', icon: Wrench },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b border-slate-800/50">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-outfit">
                    Snow Cool
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Performance Tracker</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className="relative group px-4 py-3 rounded-xl overflow-hidden cursor-pointer">
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <div className={clsx(
                                    "relative flex items-center gap-3 transition-colors duration-200",
                                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                                )}>
                                    <item.icon size={20} />
                                    <span className="font-medium font-outfit">{item.name}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-medium font-outfit">Settings</span>
                </button>
            </div>
        </aside>
    );
}
