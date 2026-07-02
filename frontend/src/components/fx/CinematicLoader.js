import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#";
const BOOT_LINES = [
    "> initializing secure kernel...",
    "> mounting encrypted volumes...",
    "> establishing neural uplink...",
    "> loading command center...",
];

function Scramble({ text }) {
    const [display, setDisplay] = useState("");
    useEffect(() => {
        let frame = 0;
        const total = text.length;
        const id = setInterval(() => {
            const revealed = Math.floor(frame / 2);
            let out = "";
            for (let i = 0; i < total; i++) {
                if (i < revealed) out += text[i];
                else out += CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            setDisplay(out);
            frame++;
            if (revealed > total) {
                setDisplay(text);
                clearInterval(id);
            }
        }, 45);
        return () => clearInterval(id);
    }, [text]);
    return <span>{display}</span>;
}

export const CinematicLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [line, setLine] = useState(0);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const DURATION = 2200;
        // Persist start across any remount so progress never resets.
        if (!window.__kypauLoaderStart) window.__kypauLoaderStart = Date.now();
        const start = window.__kypauLoaderStart;

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            setProgress(100);
            setTimeout(() => onCompleteRef.current?.(), 400);
        };

        // setInterval fires reliably even when requestAnimationFrame is throttled.
        const id = setInterval(() => {
            const elapsed = Date.now() - start;
            const t = Math.min(1, elapsed / DURATION);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(Math.floor(eased * 100));
            setLine(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));
            if (t >= 1) {
                clearInterval(id);
                finish();
            }
        }, 60);

        // Escape hatches: if the tab was suspended (timers frozen), finish the
        // moment it becomes visible or the user interacts.
        const onVisible = () => {
            if (document.visibilityState === "visible" && Date.now() - start > DURATION) finish();
        };
        const onInteract = () => {
            if (Date.now() - start > 600) finish();
        };
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("pointerdown", onInteract);
        window.addEventListener("keydown", onInteract);
        window.addEventListener("wheel", onInteract, { passive: true });

        // Absolute safety net.
        const safety = setTimeout(finish, DURATION + 1200);

        return () => {
            clearInterval(id);
            clearTimeout(safety);
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("pointerdown", onInteract);
            window.removeEventListener("keydown", onInteract);
            window.removeEventListener("wheel", onInteract);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <motion.div
            data-testid="cinematic-loader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816]"
            exit={{ opacity: 0, filter: "blur(12px)", scale: 1.08 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="absolute inset-0 cyber-grid opacity-30" />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(0,217,255,0.12), transparent 55%)",
                }}
            />

            {/* scanner line */}
            <motion.div
                className="absolute left-0 right-0 h-[2px] bg-cyan-400/60"
                style={{ boxShadow: "0 0 20px rgba(0,217,255,0.8)" }}
                animate={{ top: ["12%", "88%", "12%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex flex-col items-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-6xl md:text-8xl font-bold tracking-[0.2em] text-gradient-cyber"
                >
                    KYPAU
                </motion.div>
                <div className="mt-4 font-mono text-xs md:text-sm text-cyan-300/80 tracking-widest uppercase">
                    <Scramble text="Loading Secure Environment..." />
                </div>

                <div className="mt-10 w-[280px] md:w-[420px]">
                    <div className="flex items-center justify-between font-mono text-xs text-white/60 mb-2">
                        <span>SYS.INIT</span>
                        <span className="text-cyan-300 tabular-nums">{progress}%</span>
                    </div>
                    <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400"
                            style={{ width: `${progress}%`, boxShadow: "0 0 12px rgba(0,217,255,0.7)" }}
                        />
                    </div>
                    <div className="mt-4 h-5 font-mono text-[11px] text-emerald-300/80">
                        {BOOT_LINES[line]}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
