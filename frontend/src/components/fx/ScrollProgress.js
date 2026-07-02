import React, { useEffect, useState } from "react";

export const ScrollProgress = () => {
    const [scaleX, setScaleX] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            setScaleX(height > 0 ? scrollTop / height : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-transparent pointer-events-none" data-testid="scroll-progress">
            <div
                className="h-full origin-left bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400"
                style={{ transform: `scaleX(${scaleX})`, boxShadow: "0 0 10px rgba(0,217,255,0.6)" }}
            />
        </div>
    );
};
