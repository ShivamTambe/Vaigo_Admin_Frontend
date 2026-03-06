import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    Package,
    Map,
    PlaneTakeoff,
    BarChart3,
    HelpCircle,
    Inbox
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Submissions', icon: Inbox, path: '/submissions' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Drones', icon: PlaneTakeoff, path: '/drones' },
    { name: 'Operations', icon: Map, path: '/operations' },
    { name: 'Inventory', icon: Package, path: '/inventory' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center">
                        <PlaneTakeoff className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">VAIGO Admin</span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                            isActive
                                ? "bg-primary-50 text-primary-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", "opacity-80")} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 space-y-1">
                <NavLink
                    to="/support"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <HelpCircle className="w-5 h-5 opacity-80" />
                    Support
                </NavLink>
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <Settings className="w-5 h-5 opacity-80" />
                    Settings
                </NavLink>
            </div>
        </aside>
    );
}
