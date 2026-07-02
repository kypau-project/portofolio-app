import React from "react";
import { motion } from "framer-motion";
import { Search, Map, Crosshair, FileText, Send, Terminal } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

const STEP_ICONS = { Reconnaissance: Search, Mapping: Map, Exploitation: Crosshair, Reporting: FileText, Disclosure: Send };

export const Security = ({ bugBounty }) => {
    const bb = bugBounty || {};
    const methodology = bb.methodology || [];
    const tools = bb.tools || [];

    return (
        <section id="security" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="05" meta="// offensive ops" title="Security Methodology" subtitle="A repeatable pipeline from reconnaissance to responsible disclosure — aligned with the OWASP Top 10." />

            {/* methodology pipeline */}
            <div className="relative grid gap-4 md:grid-cols-5">
                {methodology.map((m, i) => {
                    const Icon = STEP_ICONS[m.step] || Terminal;
                    return (
                        <motion.div
                            key={m.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            data-cursor="card"
                            className="glass-panel relative p-5"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                            </div>
                            <h3 className="font-display text-base font-semibold text-white">{m.step}</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-white/55">{m.description}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* arsenal */}
            <div className="mt-14">
                <div className="mb-5 font-mono text-sm text-white/50">// arsenal.load()</div>
                <div className="flex flex-wrap gap-3">
                    {tools.map((t, i) => (
                        <motion.div
                            key={t}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            whileHover={{ y: -4, scale: 1.05 }}
                            data-cursor="card"
                            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 hover:border-emerald-400/40"
                        >
                            <span className="h-2 w-2 rounded-full bg-emerald-400 transition-all group-hover:shadow-[0_0_10px_#00FFB3]" />
                            <span className="font-mono text-sm text-white/80">{t}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
