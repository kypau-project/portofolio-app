import React from "react";
import { motion } from "framer-motion";

export const SectionHeader = ({ index, title, subtitle, meta, align = "left" }) => {
    return (
        <div className={`mb-10 md:mb-14 flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""}`}>
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
            >
                {index && (
                    <span className="font-mono text-xs text-cyan-400/80 tracking-widest">{index}</span>
                )}
                <span className="h-px w-8 bg-gradient-to-r from-cyan-400/60 to-transparent" />
                {meta && <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">{meta}</span>}
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`max-w-2xl text-sm md:text-base text-white/60 ${align === "center" ? "mx-auto" : ""}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};
