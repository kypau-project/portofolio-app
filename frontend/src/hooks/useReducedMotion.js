import { useEffect, useState } from "react";

export function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const handler = (e) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return reduced;
}

export function useIsTouch() {
    const [touch, setTouch] = useState(false);
    useEffect(() => {
        setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
    }, []);
    return touch;
}
