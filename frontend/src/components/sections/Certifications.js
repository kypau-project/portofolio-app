import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BadgeCheck, X, ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

const COLORS = {
    cyan: "#00D9FF", violet: "#8B5CF6", emerald: "#00FFB3", yellow: "#FACC15", pink: "#FF4D6D",
};

export const Certifications = ({ certifications = [] }) => {
    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(null);
    const n = certifications.length;
    if (n === 0) return null;

    const go = (dir) => setIndex((i) => (i + dir + n) % n);

    return (
        <section id="certifications" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="08" meta="// credentials" title="Certifications" subtitle="Continuous learning across offensive security, development and AI. Click a card to expand." />

            {/* carousel */}
            <div className="relative flex items-center justify-center" style={{ perspective: 1200 }}>
                <button
                    onClick={() => go(-1)}
                    data-testid="cert-prev"
                    className="absolute left-0 z-20 grid h-11 w-11 place-items-center rounded-full glass-panel text-white/70 hover:text-cyan-300"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative h-64 w-full max-w-md">
                    {certifications.map((c, i) => {
                        const offset = (i - index + n) % n;
                        const adj = offset > n / 2 ? offset - n : offset;
                        const isCenter = adj === 0;
                        const abs = Math.abs(adj);
                        if (abs > 2) return null;
                        const color = COLORS[c.color] || COLORS.cyan;
                        return (
                            <motion.button
                                key={c.id}
                                onClick={() => (isCenter ? setExpanded(c) : setIndex(i))}
                                animate={{
                                    x: adj * 90,
                                    scale: isCenter ? 1 : 0.82 - abs * 0.05,
                                    rotateY: adj * -18,
                                    opacity: abs > 1 ? 0.35 : 1,
                                    zIndex: 10 - abs,
                                }}
                                transition={{ type: "spring", damping: 22, stiffness: 220 }}
                                data-testid={isCenter ? "cert-center-card" : undefined}
                                className="absolute inset-0 mx-auto flex h-full w-72 flex-col justify-between rounded-2xl border p-6 text-left"
                                style={{
                                    borderColor: `${color}55`,
                                    background: "rgba(10,14,35,0.85)",
                                    backdropFilter: "blur(16px)",
                                    boxShadow: isCenter ? `0 0 40px ${color}33` : "none",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <BadgeCheck className="h-7 w-7" style={{ color }} />
                                    <div className="flex items-center gap-2">
                                        {c.image_url && (
                                            <ImageIcon className="h-4 w-4 opacity-50" style={{ color }} />
                                        )}
                                        <span className="font-mono text-xs text-white/40">{c.year}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{c.category}</div>
                                    <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-white">{c.title}</h3>
                                    <p className="mt-1 text-xs text-white/55">{c.issuer}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <button
                    onClick={() => go(1)}
                    data-testid="cert-next"
                    className="absolute right-0 z-20 grid h-11 w-11 place-items-center rounded-full glass-panel text-white/70 hover:text-cyan-300"
                    aria-label="Next"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-8 flex justify-center gap-2">
                {certifications.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-cyan-400" : "w-1.5 bg-white/20"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpanded(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel-strong relative w-full max-w-lg overflow-y-auto rounded-2xl text-center"
                            style={{
                                boxShadow: `0 0 60px ${COLORS[expanded.color] || COLORS.cyan}44`,
                                maxHeight: "90dvh",
                            }}
                        >
                            {/* sticky close button */}
                            <button
                                onClick={() => setExpanded(null)}
                                className="sticky top-0 z-10 ml-auto flex justify-end p-3"
                            >
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white">
                                    <X className="h-4 w-4" />
                                </span>
                            </button>

                            {/* scrollable content */}
                            <div className="px-6 pb-8 pt-0 text-center">
                                <BadgeCheck className="mx-auto h-12 w-12 sm:h-14 sm:w-14" style={{ color: COLORS[expanded.color] || COLORS.cyan }} />
                                <h3 className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">{expanded.title}</h3>
                                <p className="mt-2 text-sm text-white/60 sm:text-base">{expanded.issuer}</p>
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 font-mono text-sm text-cyan-300">
                                    {expanded.category} · {expanded.year}
                                </div>

                                {/* Certificate image */}
                                {expanded.image_url && (
                                    <div className="mt-6">
                                        <img
                                            src={expanded.image_url}
                                            alt={`${expanded.title} certificate`}
                                            className="mx-auto w-full rounded-xl border border-white/10 object-contain shadow-lg"
                                            style={{ maxHeight: "50vh" }}
                                            onError={(e) => { e.target.style.display = "none"; }}
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
