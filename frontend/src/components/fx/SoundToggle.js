import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/context/SoundContext";

export const SoundToggle = () => {
    const { enabled, toggle } = useSound();
    return (
        <button
            onClick={toggle}
            data-testid="sound-toggle"
            aria-label={enabled ? "Mute sound" : "Enable sound"}
            className="fixed bottom-6 left-20 z-[80] grid h-12 w-12 place-items-center rounded-full glass-panel text-white/70 hover:text-cyan-300 transition-colors"
        >
            {enabled ? <Volume2 className="h-5 w-5 text-cyan-300" /> : <VolumeX className="h-5 w-5" />}
        </button>
    );
};
