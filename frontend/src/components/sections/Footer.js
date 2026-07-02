import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export const Footer = ({ profile }) => {
    const p = profile || {};
    const year = new Date().getFullYear();
    return (
        <footer className="relative overflow-hidden border-t border-white/10 py-14">
            <div className="absolute inset-0 cyber-grid opacity-[0.08] animate-grid-move" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="font-display text-3xl font-bold text-gradient-cyber md:text-5xl">
                        “{p.quote || "No System Is Safe."}”
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        {[
                            { icon: Linkedin, href: p.linkedin, label: "LinkedIn" },
                            { icon: Github, href: p.github, label: "GitHub" },
                            { icon: Mail, href: `mailto:${p.email}`, label: "Email" },
                        ].map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={s.label}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-all hover:scale-110 hover:border-cyan-400/50 hover:text-cyan-300"
                            >
                                <s.icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row">
                    <div className="flex items-center gap-1.5">
                        Designed &amp; Developed by
                        <span className="font-medium text-white/70">Muhammad Dzaky Fauzan</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                        © {year} KYPAU · built with <Heart className="h-3 w-3 text-[#FF4D6D]" /> &amp; caffeine
                    </div>
                </div>
            </div>
        </footer>
    );
};
