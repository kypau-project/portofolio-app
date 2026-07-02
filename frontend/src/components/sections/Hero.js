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
        <span className="font-mono text-cyan-300" style={{ textShadow: "0 0 20px rgba(0,217,255,0.8), 0 0 40px rgba(0,217,255,0.4)" }}>
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

            {/* Dark radial overlay — dims the busy center so text is readable */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,8,22,0.72) 0%, rgba(5,8,22,0.45) 55%, transparent 100%)",
                }}
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 pt-24 text-center sm:px-6">

                {/* Status pill */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#050816]/70 px-4 py-1.5 font-mono text-xs text-cyan-300 backdrop-blur-md"
                    style={{ boxShadow: "0 0 20px rgba(0,217,255,0.15)" }}
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    AVAILABLE FOR SECURITY ENGAGEMENTS
                </motion.div>

                {/* Main name — glassmorphism backdrop + strong text shadow */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                    style={{
                        textShadow: "0 2px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.8)",
                    }}
                >
                    {p.name || "MUHAMMAD DZAKY FAUZAN"}
                </motion.h1>

                {/* Typing subtitle — dark pill backdrop */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="mt-4 rounded-xl px-4 py-2 text-lg sm:text-2xl"
                    style={{
                        background: "rgba(5,8,22,0.55)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <span className="text-white/70">$ whoami &gt; </span>
                    <TypingRoles roles={p.roles || ["Cybersecurity Specialist"]} />
                </motion.div>

                {/* Description — semi-opaque backdrop */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="mt-4 max-w-xl rounded-xl px-4 py-2 text-sm text-white/80 sm:text-base"
                    style={{
                        background: "rgba(5,8,22,0.45)",
                        backdropFilter: "blur(6px)",
                        textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                    }}
                >
                    {p.title || "Cybersecurity Specialist | Web Developer | Bug Bounty Hunter"}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="mt-9 flex flex-wrap items-center justify-center gap-3"
                >
                    <MagneticButton
                        data-testid="hero-view-projects-button"
                        onClick={() => go("projects")}
                        className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-[#050816] shadow-lg transition-all hover:bg-cyan-300 hover:scale-105"
                        style={{ boxShadow: "0 0 24px rgba(0,217,255,0.5), 0 4px 16px rgba(0,0,0,0.4)" }}
                    >
                        <FolderGit2 className="h-4 w-4" /> View Projects
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href={resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="hero-resume-button"
                        className="flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition-all hover:border-white/70 hover:bg-white/20 hover:scale-105"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                        <Download className="h-4 w-4" /> Download Resume
                    </MagneticButton>
                    <MagneticButton
                        data-testid="hero-contact-button"
                        onClick={() => go("contact")}
                        className="flex items-center gap-2 rounded-xl border-2 border-emerald-400/50 bg-emerald-400/10 px-6 py-3 text-sm font-bold text-emerald-300 shadow-lg backdrop-blur-xl transition-all hover:border-emerald-400/80 hover:bg-emerald-400/20 hover:scale-105"
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)", textShadow: "0 0 12px rgba(0,255,179,0.5)" }}
                    >
                        <Mail className="h-4 w-4" /> Contact Me
                    </MagneticButton>
                </motion.div>

                {/* Social icons */}
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
                            className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/25 bg-[#050816]/60 text-white/80 backdrop-blur-xl transition-all hover:scale-110 hover:border-cyan-400/70 hover:bg-cyan-400/10 hover:text-cyan-300"
                            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}
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
                className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50 hover:text-cyan-300"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
                aria-label="Scroll down"
            >
                <ArrowDown className="h-5 w-5" />
            </motion.button>
        </section>
    );
};
