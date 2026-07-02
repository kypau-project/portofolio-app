import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { useSound } from "@/context/SoundContext";
import { LiveClock } from "@/components/fx/LiveClock";

const LINKS = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" },
];

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [active, setActive] = useState("hero");
    const [mobileOpen, setMobileOpen] = useState(false);
    const { play } = useSound();

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 40);
            setHidden(y > lastY && y > 300);
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const ids = LINKS.map((l) => l.id);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const go = (id) => {
        play("click");
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: hidden ? -100 : 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-[60] px-4 pt-3 md:pt-4"
            >
                <nav
                    className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 md:px-5 transition-colors duration-300 ${
                        scrolled ? "glass-panel-strong" : "border border-transparent"
                    }`}
                >
                    <button
                        onClick={() => go("hero")}
                        data-testid="navbar-logo"
                        className="flex items-center gap-2 font-display text-lg font-bold tracking-widest"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                            <Terminal className="h-4 w-4" />
                        </span>
                        <span className="text-gradient-cyber">KYPAU</span>
                    </button>

                    <div className="hidden items-center gap-1 lg:flex">
                        {LINKS.map((l) => (
                            <button
                                key={l.id}
                                data-testid={`navbar-${l.id}-link`}
                                onClick={() => go(l.id)}
                                onMouseEnter={() => play("hover")}
                                className="relative px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                {l.label}
                                {active === l.id && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute inset-x-2 -bottom-0.5 h-px bg-cyan-400"
                                        style={{ boxShadow: "0 0 8px rgba(0,217,255,0.8)" }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <LiveClock />
                        </div>
                        <button
                            data-testid="navbar-mobile-toggle"
                            onClick={() => setMobileOpen((o) => !o)}
                            className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white lg:hidden"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[55] bg-[#050816]/90 backdrop-blur-xl lg:hidden"
                    >
                        <div className="flex h-full flex-col items-center justify-center gap-2">
                            {LINKS.map((l, i) => (
                                <motion.button
                                    key={l.id}
                                    data-testid={`navbar-mobile-${l.id}-link`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => go(l.id)}
                                    className="font-display text-2xl font-semibold text-white/80 hover:text-cyan-300"
                                >
                                    {l.label}
                                </motion.button>
                            ))}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
