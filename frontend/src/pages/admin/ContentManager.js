import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Save } from "lucide-react";
import { listContent, createContent, updateContent, deleteContent } from "@/lib/api";
import { toast } from "sonner";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// field schema per collection
const SCHEMAS = {
    projects: {
        title: "Projects",
        titleKey: "title",
        subtitleKey: "subtitle",
        fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subtitle", label: "Subtitle", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "status", label: "Status", type: "select", options: ["Live", "Completed", "In Progress"] },
            { key: "description", label: "Description", type: "textarea" },
            { key: "tech_stack", label: "Tech Stack (comma separated)", type: "list" },
            { key: "features", label: "Features (comma separated)", type: "list" },
            { key: "live_url", label: "Live URL", type: "text" },
            { key: "github_url", label: "GitHub URL", type: "text" },
            { key: "gradient", label: "Accent", type: "select", options: ["cyan", "violet", "emerald", "pink"] },
            { key: "size", label: "Card Size", type: "select", options: ["small", "medium", "large"] },
            { key: "order", label: "Order", type: "number" },
        ],
    },
    certifications: {
        title: "Certifications",
        titleKey: "title",
        subtitleKey: "issuer",
        fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "issuer", label: "Issuer", type: "text" },
            { key: "year", label: "Year", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "color", label: "Accent", type: "select", options: ["cyan", "violet", "emerald", "yellow", "pink"] },
            { key: "order", label: "Order", type: "number" },
        ],
    },
    achievements: {
        title: "Achievements",
        titleKey: "title",
        subtitleKey: "subtitle",
        fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "subtitle", label: "Subtitle", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "year", label: "Year", type: "text" },
            { key: "tier", label: "Tier", type: "select", options: ["legendary", "epic", "rare"] },
            { key: "icon", label: "Icon", type: "select", options: ["rocket", "globe", "graduation", "shield", "newspaper", "building"] },
            { key: "order", label: "Order", type: "number" },
        ],
    },
    skills: {
        title: "Skills",
        titleKey: "name",
        subtitleKey: "category",
        fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "level", label: "Level (0-100)", type: "number" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "order", label: "Order", type: "number" },
        ],
    },
};

function emptyItem(schema) {
    const obj = {};
    schema.fields.forEach((f) => {
        obj[f.key] = f.type === "number" ? 0 : f.type === "list" ? [] : "";
    });
    return obj;
}

export const ContentManager = ({ collection }) => {
    const schema = SCHEMAS[collection];
    const [items, setItems] = useState(null);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    const load = () => {
        setItems(null);
        listContent(collection).then((d) => setItems(d.items)).catch(() => toast.error("Failed to load"));
    };
    useEffect(load, [collection]);

    const openNew = () => setEditing({ __new: true, ...emptyItem(schema) });
    const openEdit = (item) => {
        const copy = { ...item };
        schema.fields.forEach((f) => {
            if (f.type === "list" && Array.isArray(copy[f.key])) copy[f.key] = copy[f.key].join(", ");
        });
        setEditing(copy);
    };

    const save = async () => {
        setSaving(true);
        const payload = { ...editing };
        delete payload.__new;
        schema.fields.forEach((f) => {
            if (f.type === "list") {
                payload[f.key] = String(payload[f.key] || "").split(",").map((s) => s.trim()).filter(Boolean);
            }
            if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
        });
        try {
            if (editing.__new) {
                await createContent(collection, payload);
                toast.success("Created successfully");
            } else {
                await updateContent(collection, editing.id, payload);
                toast.success("Updated successfully");
            }
            setEditing(null);
            load();
        } catch {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    const doDelete = async () => {
        try {
            await deleteContent(collection, confirmId);
            toast.success("Deleted");
            setConfirmId(null);
            load();
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">{schema.title}</h1>
                    <p className="text-sm text-white/50">{items?.length ?? 0} items · changes reflect on the live site.</p>
                </div>
                <button onClick={openNew} data-testid={`${collection}-add-button`} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#050816] hover:bg-cyan-300">
                    <Plus className="h-4 w-4" /> Add New
                </button>
            </div>

            {items === null ? (
                <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel flex flex-col justify-between p-4">
                            <div>
                                <div className="font-display text-base font-semibold text-white">{item[schema.titleKey]}</div>
                                <div className="mt-0.5 text-xs text-white/50">{item[schema.subtitleKey]}</div>
                            </div>
                            <div className="mt-4 flex justify-end gap-1">
                                <button onClick={() => openEdit(item)} data-testid={`${collection}-edit-${item.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-cyan-300"><Pencil className="h-4 w-4" /></button>
                                <button onClick={() => setConfirmId(item.id)} data-testid={`${collection}-delete-${item.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D]"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </motion.div>
                    ))}
                    {items.length === 0 && <div className="col-span-full py-12 text-center font-mono text-sm text-white/40">// no items yet</div>}
                </div>
            )}

            {/* editor drawer */}
            {editing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setEditing(null)} className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ type: "spring", damping: 28, stiffness: 260 }} onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#070B1F] p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-display text-lg font-semibold text-white">{editing.__new ? "Create" : "Edit"} {schema.title.slice(0, -1)}</h2>
                            <button onClick={() => setEditing(null)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-4">
                            {schema.fields.map((f) => (
                                <div key={f.key}>
                                    <label className="mb-1.5 block font-mono text-xs text-white/50">{f.label}</label>
                                    {f.type === "textarea" ? (
                                        <textarea rows={3} value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                                    ) : f.type === "select" ? (
                                        <select value={editing[f.key] || ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none">
                                            <option value="" className="bg-[#070B1F]">Select...</option>
                                            {f.options.map((o) => <option key={o} value={o} className="bg-[#070B1F]">{o}</option>)}
                                        </select>
                                    ) : (
                                        <input type={f.type === "number" ? "number" : "text"} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} data-testid={`${collection}-field-${f.key}`} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={save} disabled={saving} data-testid="content-save-button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-semibold text-[#050816] hover:bg-cyan-300 disabled:opacity-70">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                        </button>
                    </motion.div>
                </motion.div>
            )}

            <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
                <AlertDialogContent className="glass-panel-strong border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete this item?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">This will remove it from the live portfolio.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-white/70">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={doDelete} className="bg-[#FF4D6D] text-white hover:bg-[#FF4D6D]/80">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
