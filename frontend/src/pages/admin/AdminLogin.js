import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react";
import { login } from "@/lib/api";
import { toast } from "sonner";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // If already authed, skip to dashboard
    React.useEffect(() => {
        if (localStorage.getItem("kypau_token")) navigate("/admin/dashboard", { replace: true });
    }, [navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(username, password);
            localStorage.setItem("kypau_token", res.access_token);
            toast.success("Access granted", { description: `Welcome back, ${res.username}` });
            setTimeout(() => navigate("/admin/dashboard", { replace: true }), 400);
        } catch (err) {
            toast.error("Access denied", { description: "Invalid credentials. Try again." });
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4">
            <button
                onClick={() => navigate("/")}
                className="absolute left-6 top-6 flex items-center gap-1.5 text-sm text-white/50 hover:text-cyan-300"
            >
                <ArrowLeft className="h-4 w-4" /> Back to portfolio
            </button>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel-strong neon-border relative w-full max-w-md overflow-hidden p-8"
            >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="relative">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                            <ShieldCheck className="h-7 w-7" />
                        </span>
                        <h1 className="mt-4 font-display text-2xl font-bold text-white">Secure Access</h1>
                        <p className="mt-1 font-mono text-xs text-white/50">KYPAU command center // authentication required</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block font-mono text-xs text-white/50">USERNAME</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    data-testid="admin-username-input"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                                    placeholder="admin"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block font-mono text-xs text-white/50">PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    data-testid="admin-password-input"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="admin-login-button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-semibold text-[#050816] transition-all hover:bg-cyan-300 disabled:opacity-70"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</>
                            ) : (
                                <><KeyRound className="h-4 w-4" /> Authenticate</>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-center font-mono text-[11px] text-white/40">
                        demo // user: <span className="text-cyan-300">admin</span> · pass: <span className="text-cyan-300">Kypau@2025</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
