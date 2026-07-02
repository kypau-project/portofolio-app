import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Bug, Award, BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

function Counter({ value, suffix = "+" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const dur = 1400;
        let raf;
        const tick = (now) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setN(Math.floor(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
            else setN(value);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value]);
    return (
        <span ref={ref} className="tabular-nums">
            {n}
            {suffix}
        </span>
    );
}

export const About = ({ profile }) => {
    const p = profile || {};
    const stats = p.stats || {};
    const cards = [
        { icon: ShieldCheck, label: "Years Experience", value: stats.years_experience || 3, color: "text-cyan-300" },
        { icon: Bug, label: "Security Reports", value: stats.security_reports || 50, color: "text-emerald-300" },
        { icon: Award, label: "Recognitions", value: stats.recognitions || 20, color: "text-violet-300" },
        { icon: BadgeCheck, label: "Certifications", value: stats.certifications || 10, color: "text-yellow-300" },
    ];

    return (
        <section id="about" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="01" meta="// dossier" title="About the Operator" />
            <div className="grid gap-6 lg:grid-cols-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    data-cursor="card"
                    className="glass-panel neon-border relative overflow-hidden p-6 md:p-8 lg:col-span-3"
                >
                    <div className="mb-4 flex items-center gap-2 font-mono text-xs text-cyan-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> profile.md
                    </div>
                    <p className="text-base leading-relaxed text-white/75 md:text-lg">{p.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {["Penetration Testing", "Responsible Disclosure", "Secure Development", "OSINT"].map((t) => (
                            <span
                                key={t}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/60"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                    {cards.map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            data-cursor="card"
                            className="glass-panel flex flex-col justify-between p-5"
                        >
                            <c.icon className={`h-6 w-6 ${c.color}`} />
                            <div className="mt-6">
                                <div className={`font-display text-3xl font-bold ${c.color}`}>
                                    <Counter value={c.value} />
                                </div>
                                <div className="mt-1 text-xs text-white/50">{c.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
