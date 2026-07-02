import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const SoundContext = createContext({ enabled: false, toggle: () => {}, play: () => {} });

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
    const [enabled, setEnabled] = useState(() => localStorage.getItem("kypau_sound") === "on");
    const ctxRef = useRef(null);

    const getCtx = useCallback(() => {
        if (!ctxRef.current) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (AC) ctxRef.current = new AC();
        }
        return ctxRef.current;
    }, []);

    const play = useCallback(
        (type = "hover") => {
            if (!enabled) return;
            const ctx = getCtx();
            if (!ctx) return;
            if (ctx.state === "suspended") ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;
            const config = {
                hover: { freq: 720, dur: 0.06, vol: 0.04, wave: "sine" },
                click: { freq: 420, dur: 0.09, vol: 0.06, wave: "triangle" },
                success: { freq: 880, dur: 0.18, vol: 0.07, wave: "sine" },
                notify: { freq: 560, dur: 0.12, vol: 0.05, wave: "square" },
            }[type] || { freq: 600, dur: 0.06, vol: 0.04, wave: "sine" };
            osc.type = config.wave;
            osc.frequency.setValueAtTime(config.freq, now);
            gain.gain.setValueAtTime(config.vol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + config.dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + config.dur);
        },
        [enabled, getCtx]
    );

    const toggle = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            localStorage.setItem("kypau_sound", next ? "on" : "off");
            if (next) getCtx()?.resume?.();
            return next;
        });
    }, [getCtx]);

    useEffect(() => {
        if (enabled) play("notify");
        // eslint-disable-next-line
    }, [enabled]);

    return <SoundContext.Provider value={{ enabled, toggle, play }}>{children}</SoundContext.Provider>;
};
