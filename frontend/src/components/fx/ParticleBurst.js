import React, { useEffect } from "react";
import { useIsTouch, useReducedMotion } from "@/hooks/useReducedMotion";

// Particle explosion on click across the page.
export const ParticleBurst = () => {
    const touch = useIsTouch();
    const reduced = useReducedMotion();
    useEffect(() => {
        if (touch || reduced) return;
        const colors = ["#00D9FF", "#8B5CF6", "#00FFB3", "#FACC15"];
        const onClick = (e) => {
            if (e.target.closest("input, textarea, [data-no-burst]")) return;
            const count = 10;
            for (let i = 0; i < count; i++) {
                const p = document.createElement("div");
                const size = Math.random() * 4 + 2;
                p.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;z-index:10001;background:${colors[i % colors.length]};box-shadow:0 0 8px ${colors[i % colors.length]};`;
                document.body.appendChild(p);
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                const dist = Math.random() * 60 + 30;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist;
                p.animate(
                    [
                        { transform: "translate(0,0) scale(1)", opacity: 1 },
                        { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 },
                    ],
                    { duration: 600 + Math.random() * 200, easing: "cubic-bezier(0.16,1,0.3,1)" }
                ).onfinish = () => p.remove();
            }
        };
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [touch, reduced]);
    return null;
};
