import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, FolderGit2, Download } from "lucide-react";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { resumeUrl } from "@/lib/api";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroCore = lazy(() => import("@/components/three/HeroCore"));

function TypingRoles({ roles }) {
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!roles || roles.length === 0) return;
        const current = roles[idx % roles.length];
        let timeout;
        if (!deleting && text === current) {
            timeout = setTimeout(() => setDeleting(true), 1600);
        } else if (deleting && text === "") {
            setDeleting(false);
            setIdx((i) => (i + 1) % roles.length);
        } else {
            timeout = setTimeout(
                () => {
                    setText((t) =>
                        deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
                    );
                },
                deleting ? 45 : 90
            );
        }
        return () => clearTimeout(timeout);
    }, [text, deleting, idx, roles]);

    return (
        <span className="font-mono text-cyan-300">
            {text}
            <span className="ml-0.5 inline-block h-5 w-[8px] translate-y-0.5 bg-cyan-300 animate-pulse" />
        </span>
    );
}

export const Hero = ({ profile, ready = true }) => {
    const reduced = useReducedMotion();
    const p = profile || {};
    const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <section id="hero" className="relative min-h-screen w-full overflow-hidden">
            {/* 3D core */}
            {!reduced && ready && (
                <Suspense fallback={null}>
                    <HeroCore />
                </Suspense>
            )}

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 pt-24 text-center sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-4 py-1.5 font-mono text-xs text-cyan-300"
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    AVAILABLE FOR SECURITY ENGAGEMENTS
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                >
                    {p.name || "MUHAMMAD DZAKY FAUZAN"}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="mt-4 text-lg sm:text-2xl"
                >
                    <span className="text-white/50">$ whoami &gt; </span>
                    <TypingRoles roles={p.roles || ["Cybersecurity Specialist"]} />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="mt-6 max-w-xl text-sm text-white/60 sm:text-base"
                >
                    {p.title || "Cybersecurity Specialist | Web Developer | Bug Bounty Hunter"}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="mt-9 flex flex-wrap items-center justify-center gap-3"
                >
                    <MagneticButton
                        data-testid="hero-view-projects-button"
                        onClick={() => go("projects")}
                        className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#050816] glow-cyan"
                    >
                        <FolderGit2 className="h-4 w-4" /> View Projects
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="hero-resume-button"
                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:border-cyan-400/40"
                    >
                        <Download className="h-4 w-4" /> Download Resume
                    </MagneticButton>
                    <MagneticButton
                        data-testid="hero-contact-button"
                        onClick={() => go("contact")}
                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:border-emerald-400/40"
                    >
                        <Mail className="h-4 w-4" /> Contact Me
                    </MagneticButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="mt-8 flex items-center gap-4"
                >
                    {[
                        { icon: Linkedin, href: p.linkedin, label: "LinkedIn", tid: "hero-linkedin" },
                        { icon: Github, href: p.github, label: "GitHub", tid: "hero-github" },
                        { icon: Mail, href: `mailto:${p.email}`, label: "Email", tid: "hero-email" },
                    ].map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            target="_blank"
                            rel="noreferrer"
                            data-testid={s.tid}
                            aria-label={s.label}
                            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-xl transition-all hover:scale-110 hover:border-cyan-400/50 hover:text-cyan-300"
                        >
                            <s.icon className="h-5 w-5" />
                        </a>
                    ))}
                </motion.div>
            </div>

            <motion.button
                onClick={() => go("about")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }}
                className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40 hover:text-cyan-300"
                aria-label="Scroll down"
            >
                <ArrowDown className="h-5 w-5" />
            </motion.button>
        </section>
    );
};
