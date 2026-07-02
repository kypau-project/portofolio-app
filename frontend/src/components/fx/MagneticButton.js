import React, { useRef } from "react";
import { useIsTouch, useReducedMotion } from "@/hooks/useReducedMotion";
import { useSound } from "@/context/SoundContext";

export const MagneticButton = ({ children, as = "button", className = "", strength = 0.4, ...props }) => {
    const ref = useRef(null);
    const touch = useIsTouch();
    const reduced = useReducedMotion();
    const { play } = useSound();
    const Comp = as;

    const onMove = (e) => {
        if (touch || reduced) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
        const el = ref.current;
        if (el) el.style.transform = "translate(0,0)";
    };

    return (
        <Comp
            ref={ref}
            className={className}
            onMouseMove={onMove}
            onMouseEnter={() => play("hover")}
            onMouseLeave={onLeave}
            onClick={(e) => {
                play("click");
                props.onClick?.(e);
            }}
            style={{ transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)", ...(props.style || {}) }}
            {...props}
        >
            {children}
        </Comp>
    );
};
