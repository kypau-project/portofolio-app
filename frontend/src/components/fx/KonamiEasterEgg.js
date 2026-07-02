import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Konami code -> triggers a fun matrix-rain easter egg overlay.
const SEQUENCE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

export const KonamiEasterEgg = () => {
    const [active, setActive] = useState(false);
    useEffect(() => {
        let idx = 0;
        const onKey = (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === SEQUENCE[idx]) {
                idx++;
                if (idx === SEQUENCE.length) {
                    setActive(true);
                    idx = 0;
                    setTimeout(() => setActive(false), 5000);
                }
            } else {
                idx = key === SEQUENCE[0] ? 1 : 0;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                    <MatrixRain />
                    <div className="relative z-10 text-center">
                        <div className="font-display text-4xl md:text-6xl font-bold text-emerald-400 text-shadow-cyan">
                            ACCESS GRANTED
                        </div>
                        <div className="mt-2 font-mono text-sm text-cyan-300">// root@kypau: welcome, operator //</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function MatrixRain() {
    const cols = 40;
    return (
        <div className="absolute inset-0 overflow-hidden opacity-60">
            {Array.from({ length: cols }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-0 font-mono text-xs text-emerald-400"
                    style={{ left: `${(i / cols) * 100}%` }}
                    initial={{ y: "-100%" }}
                    animate={{ y: "120%" }}
                    transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
                >
                    {Array.from({ length: 20 }).map((__, j) => (
                        <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
}
