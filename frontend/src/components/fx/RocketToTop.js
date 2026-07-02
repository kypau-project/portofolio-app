import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";

export const RocketToTop = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 800);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    data-testid="rocket-to-top"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ y: -4 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 left-6 z-[80] grid h-12 w-12 place-items-center rounded-full glass-panel text-cyan-300 hover:text-emerald-300 group"
                    aria-label="Back to top"
                >
                    <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};
