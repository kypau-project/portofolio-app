import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Activity, LogIn, Plus, Pencil, Trash2, Upload, KeyRound, Settings } from "lucide-react";
import { getLogs } from "@/lib/api";

const ICONS = {
    login: LogIn, create: Plus, update: Pencil, delete: Trash2, delete_message: Trash2,
    bulk_delete_messages: Trash2, upload_media: Upload, delete_media: Trash2,
    password_change: KeyRound, update_settings: Settings,
};
const COLORS = {
    login: "text-emerald-300", create: "text-cyan-300", update: "text-violet-300",
    delete: "text-[#FF4D6D]", delete_message: "text-[#FF4D6D]", bulk_delete_messages: "text-[#FF4D6D]",
    delete_media: "text-[#FF4D6D]", upload_media: "text-cyan-300", password_change: "text-yellow-300",
    update_settings: "text-violet-300",
};

export default function Logs() {
    const [logs, setLogs] = useState(null);

    useEffect(() => {
        getLogs().then((d) => setLogs(d.logs)).catch(() => setLogs([]));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Activity Logs</h1>
                <p className="text-sm text-white/50">Audit trail of all administrative actions.</p>
            </div>

            {logs === null ? (
                <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-white/40"><Activity className="h-8 w-8" /><p className="mt-2 font-mono text-sm">// no activity recorded</p></div>
            ) : (
                <div className="glass-panel divide-y divide-white/5">
                    {logs.map((log, i) => {
                        const Icon = ICONS[log.action] || Activity;
                        return (
                            <motion.div key={log.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} className="flex items-center gap-4 px-5 py-3.5">
                                <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-white/5 ${COLORS[log.action] || "text-white/60"}`}>
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm text-white/80">{log.detail}</div>
                                    <div className="font-mono text-[11px] text-white/40">{log.actor} · {log.action}</div>
                                </div>
                                <div className="flex-shrink-0 font-mono text-xs text-white/40">{new Date(log.timestamp).toLocaleString()}</div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
