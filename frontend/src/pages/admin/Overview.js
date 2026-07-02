import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Eye, MailOpen, Bug, MousePointerClick, TrendingUp, ArrowUpRight } from "lucide-react";
import { getStats, getAnalytics } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const tooltipStyle = {
    background: "rgba(10,14,35,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12,
};

export default function Overview() {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getStats().then(setStats).catch(() => {});
        getAnalytics(30).then(setAnalytics).catch(() => {});
    }, []);

    const cards = [
        { label: "Total Profile Views", value: stats?.total_views, icon: Eye, color: "text-cyan-300", bg: "bg-cyan-400/10" },
        { label: "New Messages", value: stats?.unread_messages, icon: MailOpen, color: "text-emerald-300", bg: "bg-emerald-400/10" },
        { label: "Vulnerabilities Found", value: stats?.vulnerabilities_found, icon: Bug, color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/10" },
        { label: "Project Clicks", value: stats?.project_clicks, icon: MousePointerClick, color: "text-violet-300", bg: "bg-violet-400/10" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Command Overview</h1>
                <p className="text-sm text-white/50">Real-time snapshot of your portfolio operations.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c, i) => (
                    <motion.div
                        key={c.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="glass-panel p-5"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.bg} ${c.color}`}>
                                <c.icon className="h-5 w-5" />
                            </span>
                            <TrendingUp className="h-4 w-4 text-white/20" />
                        </div>
                        <div className="mt-4 font-display text-3xl font-bold text-white">
                            {c.value === undefined ? <Skeleton className="h-8 w-16 bg-white/10" /> : c.value}
                        </div>
                        <div className="mt-1 text-xs text-white/50">{c.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="glass-panel p-5 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold text-white">Traffic (30 days)</h2>
                        <span className="font-mono text-xs text-white/40">views / day</span>
                    </div>
                    {analytics ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={analytics.daily_views}>
                                <defs>
                                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickFormatter={(d) => d?.slice(5)} />
                                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="views" stroke="#00D9FF" strokeWidth={2} fill="url(#viewsGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <Skeleton className="h-64 w-full bg-white/5" />
                    )}
                </div>

                <div className="glass-panel p-5">
                    <h2 className="mb-4 font-display text-lg font-semibold text-white">Recent Messages</h2>
                    <div className="space-y-3">
                        {stats?.recent_messages?.length ? (
                            stats.recent_messages.map((m) => (
                                <div key={m.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/85">{m.name}</span>
                                        {!m.read && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                                    </div>
                                    <p className="mt-1 line-clamp-1 text-xs text-white/50">{m.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/40">No messages yet.</p>
                        )}
                        <button
                            onClick={() => navigate("/admin/dashboard/inbox")}
                            className="flex w-full items-center justify-center gap-1 rounded-xl border border-white/10 py-2 text-sm text-cyan-300 hover:bg-white/5"
                        >
                            View all <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
