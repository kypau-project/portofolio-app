import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

export const Experience = ({ experiences = [] }) => {
    return (
        <section id="experience" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="03" meta="// timeline" title="Experience & Education" subtitle="A trajectory forged across offensive security research, mentorship and engineering." />

            <div className="relative ml-2 md:ml-4">
                {/* vertical neon line */}
                <div
                    className="absolute left-3 top-0 h-full w-px md:left-4"
                    style={{ background: "linear-gradient(180deg, rgba(0,217,255,0.6), rgba(139,92,246,0.4), rgba(0,255,179,0.3), transparent)" }}
                />
                <div className="space-y-8">
                    {experiences.map((exp, i) => {
                        const isEdu = exp.type === "education";
                        return (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="relative pl-10 md:pl-14"
                                data-cursor="card"
                            >
                                {/* node */}
                                <div
                                    className={`absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border md:left-1 ${
                                        isEdu ? "border-violet-400/60 bg-violet-500/10 text-violet-300" : "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                                    }`}
                                    style={{ boxShadow: isEdu ? "0 0 14px rgba(139,92,246,0.5)" : "0 0 14px rgba(0,217,255,0.5)" }}
                                >
                                    {isEdu ? <GraduationCap className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                                </div>

                                <div className="glass-panel p-5 md:p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="font-display text-lg font-semibold text-white">{exp.role}</h3>
                                        <span className="font-mono text-xs text-cyan-300">{exp.period}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 text-sm text-white/60">
                                        <MapPin className="h-3.5 w-3.5" /> {exp.organization}
                                        {exp.current && (
                                            <span className="ml-2 rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-white/65">{exp.description}</p>
                                    {exp.highlights?.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {exp.highlights.map((h) => (
                                                <span
                                                    key={h}
                                                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-white/55"
                                                >
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
