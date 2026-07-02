import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, ArrowUpRight, Layers } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";
import { trackProjectClick } from "@/lib/api";

const GRADIENTS = {
    cyan: "from-cyan-500/20 to-cyan-500/0",
    violet: "from-violet-500/20 to-violet-500/0",
    emerald: "from-emerald-500/20 to-emerald-500/0",
    pink: "from-pink-500/20 to-pink-500/0",
};
const STATUS_COLOR = {
    Live: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
    Completed: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
    "In Progress": "text-yellow-300 border-yellow-400/30 bg-yellow-400/10",
};

function TiltCard({ project, onOpen, spanClass }) {
    const ref = useRef(null);
    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
    };
    const reset = () => {
        if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    };
    return (
        <motion.button
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            onMouseMove={onMove}
            onMouseLeave={reset}
            onClick={() => onOpen(project)}
            data-testid={`project-card-${project.id}`}
            data-cursor="card"
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition-colors hover:border-cyan-400/30 ${spanClass}`}
            style={{ transition: "transform 0.2s ease-out, border-color 0.3s" }}
        >
            <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${GRADIENTS[project.gradient] || GRADIENTS.cyan} blur-2xl opacity-70`} />
            <div className="relative">
                <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${STATUS_COLOR[project.status] || STATUS_COLOR.Completed}`}>
                        {project.status}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-cyan-400/70">{project.category}</div>
                <h3 className="mt-1 font-display text-xl font-semibold text-white md:text-2xl">{project.title}</h3>
                <p className="mt-1 text-sm text-white/50">{project.subtitle}</p>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-1.5">
                {(project.tech_stack || []).slice(0, 4).map((t) => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/55">
                        {t}
                    </span>
                ))}
            </div>
        </motion.button>
    );
}

export const Projects = ({ projects = [] }) => {
    const categories = useMemo(() => ["All", ...new Set(projects.map((p) => p.category))], [projects]);
    const [filter, setFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    const visible = projects.filter((p) => filter === "All" || p.category === filter);

    const openProject = (p) => {
        setSelected(p);
        trackProjectClick(p.id).catch(() => {});
    };

    const spanFor = (p, i) => {
        if (p.size === "large") return "md:col-span-2 md:row-span-2 min-h-[300px]";
        return "md:col-span-1 min-h-[220px]";
    };

    return (
        <section id="projects" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="04" meta="// build log" title="Featured Projects" subtitle="Security tooling, full-stack platforms and mobile apps shipped to production." />

            <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((c) => (
                    <button
                        key={c}
                        data-testid={`project-filter-${c.replace(/\s+/g, "-").toLowerCase()}`}
                        onClick={() => setFilter(c)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                            filter === c ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <motion.div layout className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {visible.map((p, i) => (
                        <TiltCard key={p.id} project={p} onOpen={openProject} spanClass={spanFor(p, i)} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                        data-testid="project-modal"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", damping: 24, stiffness: 260 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel-strong relative max-h-[85vh] w-full max-w-2xl overflow-y-auto no-scrollbar p-6 md:p-8"
                        >
                            <button
                                onClick={() => setSelected(null)}
                                data-testid="project-modal-close"
                                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="font-mono text-[11px] uppercase tracking-widest text-cyan-400/80">{selected.category}</div>
                            <h3 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">{selected.title}</h3>
                            <p className="mt-1 text-sm text-white/50">{selected.subtitle}</p>
                            <p className="mt-4 text-sm leading-relaxed text-white/70">{selected.description}</p>

                            <div className="mt-6">
                                <div className="mb-2 flex items-center gap-2 font-mono text-xs text-white/50"><Layers className="h-3.5 w-3.5" /> TECH STACK</div>
                                <div className="flex flex-wrap gap-2">
                                    {(selected.tech_stack || []).map((t) => (
                                        <span key={t} className="rounded-md border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 font-mono text-xs text-cyan-200">{t}</span>
                                    ))}
                                </div>
                            </div>

                            {selected.features?.length > 0 && (
                                <div className="mt-6">
                                    <div className="mb-2 font-mono text-xs text-white/50">// KEY FEATURES</div>
                                    <ul className="space-y-1.5">
                                        {selected.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 flex flex-wrap gap-3">
                                {selected.live_url && (
                                    <a
                                        href={selected.live_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-testid="project-live-link"
                                        className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#050816] glow-cyan"
                                    >
                                        <ExternalLink className="h-4 w-4" /> Live Demo
                                    </a>
                                )}
                                {selected.github_url && (
                                    <a
                                        href={selected.github_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-testid="project-github-link"
                                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:border-white/30"
                                    >
                                        <Github className="h-4 w-4" /> Source
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
