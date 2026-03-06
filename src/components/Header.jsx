import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:flex">
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                        placeholder="Search dashboards, metrics, users..."
                    />
                </div>
            </div>

            {/* Mobile Menu Icon */}
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="h-5 w-5" />
            </button>

            {/* Right Side Icons & Profile */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* Profile Dropdown */}
                <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-400 flex items-center justify-center shadow-inner">
                        <span className="text-white text-xs font-bold leading-none">V</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-start pr-2">
                        <span className="text-sm font-semibold text-slate-800 leading-tight">Admin User</span>
                        <span className="text-xs text-slate-500 leading-tight">Super Admin</span>
                    </div>
                </button>
            </div>
        </header>
    );
}
