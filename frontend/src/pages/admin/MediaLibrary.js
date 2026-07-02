import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Trash2, ImageIcon, Loader2, Copy, Check } from "lucide-react";
import { listMedia, uploadMedia, deleteMedia } from "@/lib/api";
import { toast } from "sonner";

export default function MediaLibrary() {
    const [items, setItems] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [copied, setCopied] = useState(null);
    const inputRef = useRef(null);

    const load = () => listMedia().then((d) => setItems(d.items)).catch(() => toast.error("Failed to load media"));
    useEffect(load, []);

    const handleFiles = async (files) => {
        const file = files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Only images are supported");
        if (file.size > 2_000_000) return toast.error("Image too large (max 2MB)");
        setUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                await uploadMedia({ name: file.name, data: reader.result, content_type: file.type });
                toast.success("Uploaded");
                load();
            } catch {
                toast.error("Upload failed");
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Media Library</h1>
                <p className="text-sm text-white/50">Upload and manage images for projects & certificates.</p>
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
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} data-testid="media-file-input" />
                {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                ) : (
                    <>
                        <UploadCloud className="h-8 w-8 text-cyan-300" />
                        <p className="mt-3 text-sm text-white/70">Drag & drop an image, or click to browse</p>
                        <p className="mt-1 font-mono text-xs text-white/40">PNG, JPG, WEBP · max 2MB</p>
                    </>
                )}
            </div>

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
                            <img src={m.data} alt={m.name} className="aspect-video w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
                                <button onClick={() => copy(m.data, m.id)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-cyan-400/20">
                                    {copied === m.id ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button onClick={() => remove(m.id)} data-testid={`media-delete-${m.id}`} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-[#FF4D6D]/30">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="truncate px-2 py-1.5 font-mono text-[10px] text-white/50">{m.name}</div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
