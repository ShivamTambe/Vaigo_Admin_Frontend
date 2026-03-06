import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, PlaneTakeoff, Wallet, TrendingUp } from 'lucide-react';
import { cn } from './Sidebar';

// Mock Data
const revenueData = [
    { name: 'Jan', revenue: 4000, inquiries: 2400 },
    { name: 'Feb', revenue: 3000, inquiries: 1398 },
    { name: 'Mar', revenue: 2000, inquiries: 9800 },
    { name: 'Apr', revenue: 2780, inquiries: 3908 },
    { name: 'May', revenue: 1890, inquiries: 4800 },
    { name: 'Jun', revenue: 2390, inquiries: 3800 },
    { name: 'Jul', revenue: 3490, inquiries: 4300 },
];

const trafficSources = [
    { name: 'Direct', value: 400 },
    { name: 'Franchise Leads', value: 300 },
    { name: 'Social', value: 300 },
    { name: 'Organic', value: 200 },
];

const droneDeployment = [
    { name: 'Agri Spraying', active: 40, idle: 12 },
    { name: 'Inspection', active: 30, idle: 5 },
    { name: 'Delivery', active: 20, idle: 2 },
    { name: 'Surveillance', active: 27, idle: 8 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function Dashboard() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back. Here's what's happening with the VAIGO ecosystem today.</p>
            </div>

            {/* Summary Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Widget
                    title="Total Revenue"
                    value="$128,430"
                    trend="+12.5%"
                    isPositive={true}
                    icon={Wallet}
                />
                <Widget
                    title="Active Drones"
                    value="117"
                    trend="+5.2%"
                    isPositive={true}
                    icon={PlaneTakeoff}
                />
                <Widget
                    title="New Franchises"
                    value="24"
                    trend="-2.4%"
                    isPositive={false}
                    icon={TrendingUp}
                />
                <Widget
                    title="Total Users"
                    value="3,842"
                    trend="+18.2%"
                    isPositive={true}
                    icon={Users}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Revenue vs Inquiries</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Performance over the last 7 months</p>
                        </div>
                        <select className="text-sm border-slate-200 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-slate-50 text-slate-700 font-medium py-1.5 pl-3 pr-8">
                            <option>Last 7 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="inquiries" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInquiries)" />
                                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources Pie Chart */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Traffic Sources</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Where your leads are coming from</p>
                    </div>
                    <div className="h-[250px] flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficSources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {trafficSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {trafficSources.map((source, idx) => (
                            <div key={source.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                <span className="text-xs font-medium text-slate-600">{source.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drone Deployment Bar Chart */}
                <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-base font-semibold text-slate-800">Drone Deployments by Sector</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Current active vs idle units across sectors</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={droneDeployment}
                                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                barSize={32}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                                <Bar dataKey="active" name="Active Drones" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="idle" name="Idle / Maintenance" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Reusable Widget Component
function Widget({ title, value, trend, isPositive, icon: Icon }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {trend}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
            </div>
        </div>
    );
}
