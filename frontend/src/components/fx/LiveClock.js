import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export const LiveClock = ({ className = "" }) => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const time = now.toLocaleTimeString("en-GB", { hour12: false });
    return (
        <div className={`flex items-center gap-1.5 font-mono text-xs text-white/60 ${className}`} data-testid="live-clock">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="tabular-nums">{time}</span>
            <span className="text-white/30">UTC{-now.getTimezoneOffset() / 60 >= 0 ? "+" : ""}{-now.getTimezoneOffset() / 60}</span>
        </div>
    );
};
