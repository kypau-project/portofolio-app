import React, { useEffect, useRef, useState } from "react";
import { useIsTouch, useReducedMotion } from "@/hooks/useReducedMotion";

export const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [variant, setVariant] = useState("default");
    const touch = useIsTouch();
    const reduced = useReducedMotion();

    useEffect(() => {
        if (touch || reduced) return;
        document.body.classList.add("custom-cursor-active");
        const dot = dotRef.current;
        const ring = ringRef.current;
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ring_pos = { ...pos };
        let raf;

        const onMove = (e) => {
            pos.x = e.clientX;
            pos.y = e.clientY;
            if (dot) {
                dot.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
            }
            const el = e.target.closest("a, button, [data-cursor]");
            if (el) {
                const type = el.getAttribute("data-cursor");
                setVariant(type || (el.tagName === "A" ? "link" : "button"));
            } else {
                setVariant("default");
            }
        };
        const loop = () => {
            ring_pos.x += (pos.x - ring_pos.x) * 0.18;
            ring_pos.y += (pos.y - ring_pos.y) * 0.18;
            if (ring) ring.style.transform = `translate3d(${ring_pos.x - 18}px, ${ring_pos.y - 18}px, 0)`;
            raf = requestAnimationFrame(loop);
        };
        window.addEventListener("pointermove", onMove);
        loop();
        return () => {
            document.body.classList.remove("custom-cursor-active");
            window.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [touch, reduced]);

    if (touch || reduced) return null;

    const ringSize =
        variant === "button" || variant === "card" ? "scale-[1.8]" : variant === "link" ? "scale-[1.4]" : "scale-100";
    const ringColor =
        variant === "button" ? "border-emerald-400/80" : variant === "link" ? "border-violet-400/80" : "border-cyan-400/70";

    return (
        <>
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[10000] h-1.5 w-1.5 rounded-full bg-cyan-300 pointer-events-none"
                style={{ boxShadow: "0 0 10px rgba(0,217,255,0.9)" }}
            />
            <div
                ref={ringRef}
                className={`fixed top-0 left-0 z-[10000] h-9 w-9 rounded-full border pointer-events-none transition-transform duration-200 ${ringSize} ${ringColor}`}
            />
        </>
    );
};
