import React, { useEffect, useState, useRef } from "react";
import { Loader2, Save, User, Link2, Search, KeyRound, FileText, UploadCloud, Check } from "lucide-react";
import { getSettings, updateSettings, changePassword } from "@/lib/api";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Resume-specific API helpers
const uploadResume = (payload) => api.post("/admin/resume-upload", payload).then((r) => r.data);
const getResumeInfo = () => api.get("/admin/resume-info").then((r) => r.data);

export default function SettingsPage() {
    const [settings, setSettings] = useState(null);
    const [saving, setSaving] = useState(false);
    const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
    const [pwSaving, setPwSaving] = useState(false);
    const [resumeInfo, setResumeInfo] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const resumeRef = useRef(null);

    useEffect(() => {
        getSettings().then(setSettings).catch(() => toast.error("Failed to load settings"));
        getResumeInfo().then(setResumeInfo).catch(() => {});
    }, []);

    const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
    const updateSeo = (key, value) => setSettings((s) => ({ ...s, seo: { ...(s.seo || {}), [key]: value } }));

    const save = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            toast.success("Settings saved");
        } catch {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        if (pw.new_password !== pw.confirm) return toast.error("Passwords do not match");
        if (pw.new_password.length < 8) return toast.error("Password must be at least 8 characters");
        setPwSaving(true);
        try {
            await changePassword(pw.current_password, pw.new_password);
            toast.success("Password updated");
            setPw({ current_password: "", new_password: "", confirm: "" });
        } catch {
            toast.error("Current password incorrect");
        } finally {
            setPwSaving(false);
        }
    };

    const handleResumeUpload = async (file) => {
        if (!file) return;
        if (file.type !== "application/pdf") return toast.error("Only PDF files are accepted for resume");
        if (file.size > 10_000_000) return toast.error("PDF too large (max 10MB)");
        setResumeUploading(true);
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const res = await uploadResume({ name: file.name, data: reader.result, content_type: "application/pdf" });
                setResumeInfo(res);
                toast.success("Resume uploaded! Download CV button will now serve this file.");
            } catch (err) {
                const msg = err?.response?.data?.detail || "Upload failed";
                toast.error("Upload failed", { description: msg });
            } finally {
                setResumeUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (!settings) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-400" /></div>;

    const Field = ({ label, k, seo }) => (
        <div>
            <label className="mb-1.5 block font-mono text-xs text-white/50">{label}</label>
            <input
                value={(seo ? settings.seo?.[k] : settings[k]) || ""}
                onChange={(e) => (seo ? updateSeo(k, e.target.value) : update(k, e.target.value))}
                data-testid={`settings-${seo ? "seo-" : ""}${k}`}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none"
            />
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
                <p className="text-sm text-white/50">Manage profile, social links, SEO and security.</p>
            </div>

            <section className="glass-panel p-6">
                <div className="mb-4 flex items-center gap-2"><User className="h-4 w-4 text-cyan-300" /><h2 className="font-display font-semibold text-white">Profile</h2></div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" k="name" />
                    <Field label="Title" k="title" />
                    <Field label="Email" k="email" />
                    <Field label="Phone" k="phone" />
                    <Field label="Location" k="location" />
                    <Field label="Quote" k="quote" />
                </div>
                <div className="mt-4">
                    <label className="mb-1.5 block font-mono text-xs text-white/50">Summary</label>
                    <textarea rows={4} value={settings.summary || ""} onChange={(e) => update("summary", e.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                </div>
            </section>

            <section className="glass-panel p-6">
                <div className="mb-4 flex items-center gap-2"><Link2 className="h-4 w-4 text-violet-300" /><h2 className="font-display font-semibold text-white">Social Links</h2></div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="LinkedIn" k="linkedin" />
                    <Field label="GitHub" k="github" />
                </div>
            </section>

            <section className="glass-panel p-6">
                <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-emerald-300" /><h2 className="font-display font-semibold text-white">SEO</h2></div>
                <div className="space-y-4">
                    <Field label="Meta Title" k="title" seo />
                    <Field label="Meta Description" k="description" seo />
                    <Field label="Keywords" k="keywords" seo />
                </div>
            </section>

            <button onClick={save} disabled={saving} data-testid="settings-save-button" className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-[#050816] hover:bg-cyan-300 disabled:opacity-70">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
            </button>

            {/* Resume Upload */}
            <section className="glass-panel p-6">
                <div className="mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-cyan-300" /><h2 className="font-display font-semibold text-white">Resume / CV</h2></div>
                <p className="mb-4 text-sm text-white/50">
                    Upload your resume PDF. The "Download CV" button on the portfolio will serve this file directly.
                </p>

                {resumeInfo?.name && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{resumeInfo.name}</div>
                            <div className="font-mono text-xs text-white/40">Uploaded resume is active</div>
                        </div>
                    </div>
                )}

                <div
                    onClick={() => resumeRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] py-8 transition-colors hover:border-cyan-400/30"
                >
                    <input
                        ref={resumeRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleResumeUpload(e.target.files[0])}
                    />
                    {resumeUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    ) : (
                        <>
                            <UploadCloud className="h-8 w-8 text-cyan-300" />
                            <p className="mt-2 text-sm text-white/70">Click to upload resume PDF</p>
                            <p className="mt-1 font-mono text-xs text-white/40">PDF only · max 10MB</p>
                        </>
                    )}
                </div>
            </section>

            <section className="glass-panel p-6">
                <div className="mb-4 flex items-center gap-2"><KeyRound className="h-4 w-4 text-yellow-300" /><h2 className="font-display font-semibold text-white">Change Password</h2></div>
                <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-3">
                    <input type="password" placeholder="Current" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} data-testid="settings-current-password" required className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                    <input type="password" placeholder="New (min 8)" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} data-testid="settings-new-password" required className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                    <input type="password" placeholder="Confirm" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                    <button type="submit" disabled={pwSaving} className="col-span-full flex w-fit items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:border-cyan-400/40 disabled:opacity-70">
                        {pwSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Update Password
                    </button>
                </form>
            </section>
        </div>
    );
}
