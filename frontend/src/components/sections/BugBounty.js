import React from "react";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie,
} from "recharts";
import { SectionHeader } from "@/components/fx/SectionHeader";

const tooltipStyle = {
    background: "rgba(10,14,35,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 12,
};

export const BugBounty = ({ bugBounty }) => {
    const bb = bugBounty || {};
    const dist = bb.severity_distribution || [];
    const levels = bb.severity_levels || [];
    const total = dist.reduce((a, b) => a + b.count, 0);

    return (
        <section id="bugbounty" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="06" meta="// vulnerability ledger" title="Bug Bounty Impact" subtitle={`${total}+ vulnerabilities discovered and responsibly disclosed across government, education and private-sector platforms.`} />

            <div className="grid gap-6 lg:grid-cols-5">
                {/* vulnerability types bar chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-panel p-5 lg:col-span-3"
                    data-cursor="card"
                >
                    <div className="mb-4 font-mono text-xs text-white/50">// findings by class</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dist} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" width={110} tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                {dist.map((d, i) => (
                                    <Cell key={i} fill={d.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* severity donut */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="glass-panel p-5 lg:col-span-2"
                    data-cursor="card"
                >
                    <div className="mb-4 font-mono text-xs text-white/50">// severity split</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={levels} dataKey="count" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                {levels.map((l, i) => (
                                    <Cell key={i} fill={l.color} stroke="rgba(5,8,22,0.6)" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {levels.map((l) => (
                            <div key={l.name} className="flex items-center gap-2 text-xs text-white/60">
                                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
                                {l.name} <span className="ml-auto font-mono text-white/40">{l.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
