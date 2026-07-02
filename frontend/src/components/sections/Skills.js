import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";
import { SectionHeader } from "@/components/fx/SectionHeader";

const CATEGORY_META = {
    "Cybersecurity & OSINT": { color: "#00D9FF" },
    Development: { color: "#8B5CF6" },
    "Soft Skills": { color: "#00FFB3" },
};

export const Skills = ({ skills = [] }) => {
    const categories = useMemo(() => [...new Set(skills.map((s) => s.category))], [skills]);
    const [active, setActive] = useState(categories[0]);
    const current = active || categories[0];

    const filtered = skills.filter((s) => s.category === current);
    const radarData = filtered.map((s) => ({ subject: s.name.split(" ").slice(0, 2).join(" "), value: s.level }));

    return (
        <section id="skills" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="02" meta="// capability matrix" title="Core Skills" subtitle="An arsenal spanning offensive security, full-stack development and the mindset that ties them together." />

            <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        data-testid={`skills-tab-${cat.replace(/[^a-z]/gi, "-").toLowerCase()}`}
                        onClick={() => setActive(cat)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all ${
                            current === cat
                                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* animated bars */}
                <div className="space-y-4">
                    {filtered.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="group"
                            data-cursor="card"
                        >
                            <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-sm font-medium text-white/85">{s.name}</span>
                                <span className="font-mono text-xs text-cyan-300">{s.level}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${s.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${CATEGORY_META[current]?.color || "#00D9FF"}, #8B5CF6)`,
                                        boxShadow: `0 0 12px ${CATEGORY_META[current]?.color || "#00D9FF"}66`,
                                    }}
                                />
                            </div>
                            <p className="mt-1 max-h-0 overflow-hidden text-xs text-white/40 opacity-0 transition-all duration-300 group-hover:max-h-10 group-hover:opacity-100">
                                {s.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* radar chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-panel flex items-center justify-center p-4"
                    data-cursor="card"
                >
                    <ResponsiveContainer width="100%" height={340}>
                        <RadarChart data={radarData} outerRadius="75%">
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
                            <Radar
                                dataKey="value"
                                stroke={CATEGORY_META[current]?.color || "#00D9FF"}
                                fill={CATEGORY_META[current]?.color || "#00D9FF"}
                                fillOpacity={0.35}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "rgba(10,14,35,0.95)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 12,
                                    color: "#fff",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </section>
    );
};
