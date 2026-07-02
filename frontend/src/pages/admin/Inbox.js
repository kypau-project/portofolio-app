import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Eye, Mail, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getMessages, markMessageRead, deleteMessage, bulkDeleteMessages } from "@/lib/api";
import { toast } from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InboxPage() {
    const [data, setData] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [checked, setChecked] = useState([]);
    const [confirm, setConfirm] = useState(null); // {type, id}
    const [loading, setLoading] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        getMessages({ search, page, limit: 8 })
            .then(setData)
            .catch(() => toast.error("Failed to load messages"))
            .finally(() => setLoading(false));
    }, [search, page]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    const openMessage = async (m) => {
        setSelected(m);
        if (!m.read) {
            await markMessageRead(m.id).catch(() => {});
            load();
        }
    };

    const doDelete = async () => {
        if (!confirm) return;
        try {
            if (confirm.type === "single") {
                await deleteMessage(confirm.id);
                toast.success("Message deleted");
            } else {
                await bulkDeleteMessages(checked);
                toast.success(`${checked.length} messages deleted`);
                setChecked([]);
            }
            setConfirm(null);
            setSelected(null);
            load();
        } catch {
            toast.error("Delete failed");
        }
    };

    const toggleCheck = (id) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

    const messages = data?.messages || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">Inbox</h1>
                    <p className="text-sm text-white/50">{data?.total ?? 0} total transmissions received.</p>
                </div>
                <div className="flex items-center gap-3">
                    {checked.length > 0 && (
                        <button
                            onClick={() => setConfirm({ type: "bulk" })}
                            data-testid="inbox-bulk-delete"
                            className="flex items-center gap-1.5 rounded-xl border border-[#FF4D6D]/30 bg-[#FF4D6D]/10 px-3 py-2 text-sm text-[#FF4D6D]"
                        >
                            <Trash2 className="h-4 w-4" /> Delete ({checked.length})
                        </button>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            data-testid="admin-inbox-search-input"
                            placeholder="Search messages..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/40 focus:outline-none sm:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-white/10 text-xs uppercase text-white/40">
                            <tr>
                                <th className="w-10 px-4 py-3"></th>
                                <th className="px-4 py-3">Name</th>
                                <th className="hidden px-4 py-3 md:table-cell">Email</th>
                                <th className="hidden px-4 py-3 lg:table-cell">Message</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && messages.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-white/40"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
                            )}
                            {!loading && messages.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-12 text-center font-mono text-sm text-white/40">// inbox empty — no transmissions</td></tr>
                            )}
                            {messages.map((m) => (
                                <tr key={m.id} className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${!m.read ? "bg-cyan-400/[0.03]" : ""}`}>
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={checked.includes(m.id)} onChange={() => toggleCheck(m.id)} className="accent-cyan-400" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {!m.read && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                                            <span className="font-medium text-white/85">{m.name}</span>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 text-white/60 md:table-cell">{m.email}</td>
                                    <td className="hidden max-w-xs truncate px-4 py-3 text-white/50 lg:table-cell">{m.message}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-white/40">{new Date(m.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openMessage(m)} data-testid={`inbox-view-${m.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-cyan-300">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setConfirm({ type: "single", id: m.id })} data-testid={`inbox-delete-${m.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D]">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data && data.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                        <span className="text-xs text-white/40">Page {data.page} of {data.pages}</span>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/5">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/5">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* view modal */}
            {selected && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="glass-panel-strong relative w-full max-w-lg p-6">
                        <button onClick={() => setSelected(null)} className="absolute right-4 top-4 text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
                        <div className="flex items-center gap-3">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-cyan-400/10 text-cyan-300"><Mail className="h-5 w-5" /></span>
                            <div>
                                <div className="font-display text-lg font-semibold text-white">{selected.name}</div>
                                <a href={`mailto:${selected.email}`} className="text-sm text-cyan-300">{selected.email}</a>
                            </div>
                        </div>
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/75">{selected.message}</div>
                        <div className="mt-3 font-mono text-xs text-white/40">received {new Date(selected.created_at).toLocaleString()}</div>
                        <div className="mt-5 flex gap-3">
                            <a href={`mailto:${selected.email}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-2.5 text-sm font-semibold text-[#050816]"><Mail className="h-4 w-4" /> Reply</a>
                            <button onClick={() => setConfirm({ type: "single", id: selected.id })} className="flex items-center gap-2 rounded-xl border border-[#FF4D6D]/30 px-4 py-2.5 text-sm text-[#FF4D6D]"><Trash2 className="h-4 w-4" /> Delete</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
                <AlertDialogContent className="glass-panel-strong border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete message{confirm?.type === "bulk" ? "s" : ""}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-white/70">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={doDelete} data-testid="confirm-delete" className="bg-[#FF4D6D] text-white hover:bg-[#FF4D6D]/80">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
