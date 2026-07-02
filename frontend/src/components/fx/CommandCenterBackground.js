import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Multi-layer animated command center background (fixed, behind everything).
export const CommandCenterBackground = () => {
    const canvasRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let w, h, dpr;
        let nodes = [];
        let raf;
        const mouse = { x: -9999, y: -9999 };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.width = window.innerWidth * dpr;
            h = canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25 * dpr,
                vy: (Math.random() - 0.5) * 0.25 * dpr,
                r: (Math.random() * 1.4 + 0.6) * dpr,
            }));
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e) => {
            mouse.x = e.clientX * dpr;
            mouse.y = e.clientY * dpr;
        };
        window.addEventListener("pointermove", onMove);

        const maxDist = 140 * dpr;
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
            }
            // connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        ctx.strokeStyle = `rgba(0,217,255,${alpha})`;
                        ctx.lineWidth = dpr * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
            // nodes + mouse glow
            for (const n of nodes) {
                const dmx = n.x - mouse.x, dmy = n.y - mouse.y;
                const md = Math.sqrt(dmx * dmx + dmy * dmy);
                const near = md < 160 * dpr;
                ctx.fillStyle = near ? "rgba(0,255,179,0.9)" : "rgba(0,217,255,0.55)";
                ctx.beginPath();
                ctx.arc(n.x, n.y, near ? n.r * 1.8 : n.r, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        if (!reduced) draw();
        else {
            // static single frame
            ctx.fillStyle = "rgba(0,217,255,0.4)";
            nodes.forEach((n) => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
        };
    }, [reduced]);

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
            {/* base */}
            <div className="absolute inset-0 bg-[#050816]" />
            {/* neon fog blobs */}
            <div
                className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[120px] opacity-25 animate-pulse-glow"
                style={{ background: "radial-gradient(circle, #00D9FF, transparent 70%)" }}
            />
            <div
                className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full blur-[130px] opacity-20"
                style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
            />
            <div
                className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full blur-[120px] opacity-[0.14]"
                style={{ background: "radial-gradient(circle, #00FFB3, transparent 70%)" }}
            />
            {/* animated grid */}
            <div
                className="absolute inset-0 cyber-grid opacity-[0.12]"
                style={{ maskImage: "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)" }}
            />
            {/* network nodes canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
            {/* vignette */}
            <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,8,22,0.6) 100%)" }}
            />
        </div>
    );
};
