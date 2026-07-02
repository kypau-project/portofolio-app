import React, { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Loader2, Eye, Globe } from "lucide-react";
import { getAnalytics } from "@/lib/api";

const tooltipStyle = {
    background: "rgba(10,14,35,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff", fontSize: 12,
};
const BAR_COLORS = ["#00D9FF", "#8B5CF6", "#00FFB3", "#FACC15", "#FF4D6D"];

export default function Analytics() {
    const [data, setData] = useState(null);
    const [days, setDays] = useState(30);

    useEffect(() => {
        setData(null);
        getAnalytics(days).then(setData).catch(() => {});
    }, [days]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">Visitor Analytics</h1>
                    <p className="text-sm text-white/50">Traffic and engagement metrics.</p>
                </div>
                <div className="flex gap-2">
                    {[7, 30, 90].map((d) => (
                        <button key={d} onClick={() => setDays(d)} className={`rounded-xl border px-3 py-1.5 text-sm ${days === d ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-white/60"}`}>
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {!data ? (
                <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="glass-panel p-5">
                            <Eye className="h-5 w-5 text-cyan-300" />
                            <div className="mt-3 font-display text-3xl font-bold text-white">{data.total_views}</div>
                            <div className="text-xs text-white/50">Total Views</div>
                        </div>
                        <div className="glass-panel p-5">
                            <Globe className="h-5 w-5 text-emerald-300" />
                            <div className="mt-3 font-display text-3xl font-bold text-white">{data.top_pages?.length || 0}</div>
                            <div className="text-xs text-white/50">Tracked Pages</div>
                        </div>
                        <div className="glass-panel col-span-2 p-5 sm:col-span-1">
                            <div className="font-mono text-xs text-white/50">// period</div>
                            <div className="mt-3 font-display text-3xl font-bold text-white">{days}d</div>
                            <div className="text-xs text-white/50">Window</div>
                        </div>
                    </div>

                    <div className="glass-panel p-5">
                        <h2 className="mb-4 font-display text-lg font-semibold text-white">Daily Views</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={data.daily_views}>
                                <defs>
                                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickFormatter={(d) => d?.slice(5)} />
                                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} fill="url(#aGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-panel p-5">
                        <h2 className="mb-4 font-display text-lg font-semibold text-white">Top Pages</h2>
                        {data.top_pages?.length ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={data.top_pages}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="page" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} allowDecimals={false} />
                                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                                    <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                                        {data.top_pages.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center font-mono text-sm text-white/40">// no page data yet</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
