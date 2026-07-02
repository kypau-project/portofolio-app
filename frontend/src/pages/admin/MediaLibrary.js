import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Trash2, ImageIcon, Loader2, Copy, Check, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// Direct API calls so we can catch & debug errors properly
const listMedia = () => api.get("/admin/media").then((r) => r.data);
const uploadMedia = (payload) => api.post("/admin/media", payload).then((r) => r.data);
const deleteMedia = (id) => api.delete(`/admin/media/${id}`).then((r) => r.data);

export default function MediaLibrary() {
    const [items, setItems] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [copied, setCopied] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const load = async () => {
        setError(null);
        try {
            const d = await listMedia();
            setItems(d.items || []);
        } catch (err) {
            const msg = err?.response?.data?.detail || err?.message || "Failed to load media";
            setError(msg);
            toast.error("Failed to load media", { description: msg });
            setItems([]);
        }
    };

    useEffect(() => { load(); }, []);

    const handleFiles = async (files) => {
        const file = files[0];
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";
        if (!isImage && !isPdf) return toast.error("Only images and PDFs are supported");
        const maxSize = isPdf ? 10_000_000 : 5_000_000;
        if (file.size > maxSize) return toast.error(`File too large (max ${isPdf ? "10MB" : "5MB"})`);
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                await uploadMedia({ name: file.name, data: reader.result, content_type: file.type });
                toast.success("Uploaded successfully");
                load();
            } catch (err) {
                const msg = err?.response?.data?.detail || "Upload failed";
                toast.error("Upload failed", { description: msg });
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const remove = async (id) => {
        try {
            await deleteMedia(id);
            toast.success("Deleted");
            load();
        } catch {
            toast.error("Delete failed");
        }
    };

    const copy = (data, id) => {
        navigator.clipboard.writeText(data);
        setCopied(id);
        setTimeout(() => setCopied(null), 1500);
    };

    const isImage = (item) => item.content_type?.startsWith("image/") || (!item.content_type && item.data?.startsWith("data:image"));
    const isPdf = (item) => item.content_type === "application/pdf" || item.data?.startsWith("data:application/pdf");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Media Library</h1>
                <p className="text-sm text-white/50">Upload and manage images for projects & certificates, and PDFs (e.g. resume).</p>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                data-testid="media-dropzone"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 transition-colors ${
                    dragOver ? "border-cyan-400/60 bg-cyan-400/5" : "border-white/15 bg-white/[0.02] hover:border-cyan-400/30"
                }`}
            >
                <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} data-testid="media-file-input" />
                {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                ) : (
                    <>
                        <UploadCloud className="h-8 w-8 text-cyan-300" />
                        <p className="mt-3 text-sm text-white/70">Drag & drop an image or PDF, or click to browse</p>
                        <p className="mt-1 font-mono text-xs text-white/40">PNG, JPG, WEBP · max 5MB &nbsp;|&nbsp; PDF · max 10MB</p>
                    </>
                )}
            </div>

            {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 font-mono text-sm text-red-300">
                    Error: {error} — check that you are logged in and the backend is running.
                </div>
            )}

            {items === null ? (
                <div className="grid place-items-center py-16"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-white/40">
                    <ImageIcon className="h-8 w-8" />
                    <p className="mt-2 font-mono text-sm">// media library empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((m) => (
                        <motion.div key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                            {isPdf(m) ? (
                                <div className="flex aspect-video w-full items-center justify-center bg-white/5">
                                    <FileText className="h-10 w-10 text-cyan-300/60" />
                                </div>
                            ) : (
                                <img src={m.data} alt={m.name} className="aspect-video w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
                                <button onClick={() => copy(m.data, m.id)} title="Copy data URL" className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-cyan-400/20">
                                    {copied === m.id ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button onClick={() => remove(m.id)} data-testid={`media-delete-${m.id}`} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-[#FF4D6D]/30">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="px-2 py-1.5">
                                <div className="truncate font-mono text-[10px] text-white/50">{m.name}</div>
                                {m.content_type && <div className="font-mono text-[9px] text-white/30">{m.content_type}</div>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
