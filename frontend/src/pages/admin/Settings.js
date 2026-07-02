import React, { useEffect, useState } from "react";
import { Loader2, Save, User, Link2, Search, KeyRound } from "lucide-react";
import { getSettings, updateSettings, changePassword } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
    const [settings, setSettings] = useState(null);
    const [saving, setSaving] = useState(false);
    const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
    const [pwSaving, setPwSaving] = useState(false);

    useEffect(() => {
        getSettings().then(setSettings).catch(() => toast.error("Failed to load settings"));
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
