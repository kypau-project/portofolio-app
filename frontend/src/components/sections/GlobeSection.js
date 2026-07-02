import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/fx/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const GlobeScene = lazy(() => import("@/components/three/GlobeScene"));

export const GlobeSection = ({ bugBounty }) => {
    const reduced = useReducedMotion();
    const disclosures = bugBounty?.disclosures || [];

    return (
        <section id="globe" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="09" meta="// global reach" title="Disclosure Map" subtitle="Responsible disclosures submitted to institutions across the globe. Hover a node for details." align="center" />
            <div className="grid items-center gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    {reduced ? (
                        <div className="grid h-[400px] place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/40">
                            Interactive globe disabled (reduced motion)
                        </div>
                    ) : (
                        <Suspense fallback={<div className="h-[420px] rounded-2xl border border-white/10 bg-white/[0.03]" />}>
                            <GlobeScene disclosures={disclosures} />
                        </Suspense>
                    )}
                </div>
                <div className="space-y-3 lg:col-span-2">
                    {disclosures.map((d, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.04 }}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                            data-cursor="card"
                        >
                            <div>
                                <div className="text-sm font-medium text-white/85">{d.institution}</div>
                                <div className="font-mono text-[11px] text-white/45">{d.country}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-xs text-emerald-300">{d.status}</div>
                                <div className="font-mono text-[10px] text-white/40">{d.year}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
