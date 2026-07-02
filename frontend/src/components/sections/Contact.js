import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Terminal, Send, Check, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";
import { submitContact } from "@/lib/api";
import { useSound } from "@/context/SoundContext";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    message: z.string().min(5, "Message must be at least 5 characters"),
});

const BOOT = [
    "KYPAU secure channel v2.4.1",
    "Establishing encrypted tunnel... [OK]",
    "Type 'connect' to open a transmission line.",
];

export const Contact = ({ profile }) => {
    const p = profile || {};
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [phase, setPhase] = useState("idle"); // idle | sending | done
    const { play } = useSound();
    const bodyRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

    const bootedRef = useRef(false);
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;
        BOOT.forEach((l, i) => setTimeout(() => setLines((prev) => [...prev, { type: "sys", text: l }]), i * 400));
    }, []);

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [lines, connected]);

    const handleCommand = (e) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        setLines((prev) => [...prev, { type: "user", text: input }]);
        setInput("");
        play("click");
        if (cmd === "connect") {
            setLines((prev) => [...prev, { type: "ok", text: "Connection established. Rendering secure form..." }]);
            setTimeout(() => setConnected(true), 500);
        } else if (cmd === "help") {
            setLines((prev) => [...prev, { type: "sys", text: "Available: connect, help, whoami, clear" }]);
        } else if (cmd === "whoami") {
            setLines((prev) => [...prev, { type: "sys", text: `guest@kypau — contacting ${p.name || "operator"}` }]);
        } else if (cmd === "clear") {
            setLines([]);
        } else if (cmd) {
            setLines((prev) => [...prev, { type: "err", text: `command not found: ${cmd}. Try 'connect' or 'help'.` }]);
        }
    };

    const onSubmit = async (data) => {
        setPhase("sending");
        try {
            await submitContact(data);
            play("success");
            setTimeout(() => {
                setPhase("done");
                toast.success("Secure message transmitted.", { description: "I'll get back to you shortly." });
                reset();
            }, 1600);
        } catch (err) {
            setPhase("idle");
            toast.error("Transmission failed", { description: "Please try again in a moment." });
        }
    };

    const lineColor = { sys: "text-white/50", user: "text-cyan-300", ok: "text-emerald-300", err: "text-[#FF4D6D]" };

    return (
        <section id="contact" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="12" meta="// secure channel" title="Establish Contact" subtitle="Open a transmission line through the terminal below, or reach out directly." />

            <div className="grid gap-6 lg:grid-cols-5">
                {/* terminal */}
                <div className="lg:col-span-3">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl" data-testid="contact-terminal">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#FF4D6D]/70" />
                                <span className="h-3 w-3 rounded-full bg-[#FACC15]/70" />
                                <span className="h-3 w-3 rounded-full bg-[#00FFB3]/70" />
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-xs text-white/50">
                                <Terminal className="h-3.5 w-3.5" /> secure_channel.sh
                            </div>
                        </div>

                        <div ref={bodyRef} className="h-[360px] overflow-y-auto no-scrollbar p-4 font-mono text-[13px] leading-relaxed">
                            {lines.map((l, i) => (
                                <div key={i} className={lineColor[l.type]}>
                                    {l.type === "user" ? <span className="text-emerald-400">guest@kypau:~$ </span> : ""}
                                    {l.text}
                                </div>
                            ))}

                            <AnimatePresence>
                                {connected && phase !== "done" && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="mt-4 space-y-3"
                                        data-testid="contact-form"
                                    >
                                        <div>
                                            <label className="text-white/40">$ enter name:</label>
                                            <input
                                                {...register("name")}
                                                data-testid="contact-name-input"
                                                data-no-burst
                                                disabled={phase === "sending"}
                                                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-cyan-200 outline-none focus:border-cyan-400/50"
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="mt-1 text-[11px] text-[#FF4D6D]">{errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label className="text-white/40">$ enter email:</label>
                                            <input
                                                {...register("email")}
                                                data-testid="contact-email-input"
                                                data-no-burst
                                                disabled={phase === "sending"}
                                                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-cyan-200 outline-none focus:border-cyan-400/50"
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="mt-1 text-[11px] text-[#FF4D6D]">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className="text-white/40">$ enter message:</label>
                                            <textarea
                                                {...register("message")}
                                                data-testid="contact-message-input"
                                                data-no-burst
                                                disabled={phase === "sending"}
                                                rows={3}
                                                className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-cyan-200 outline-none focus:border-cyan-400/50"
                                                placeholder="Your secure message..."
                                            />
                                            {errors.message && <p className="mt-1 text-[11px] text-[#FF4D6D]">{errors.message.message}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            data-testid="contact-submit-button"
                                            disabled={phase === "sending"}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 py-2.5 font-semibold text-[#050816] transition-all hover:bg-cyan-300 disabled:opacity-70"
                                        >
                                            {phase === "sending" ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Encrypting &amp; transmitting...</>
                                            ) : (
                                                <><Send className="h-4 w-4" /> Transmit Message</>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {phase === "done" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 py-6"
                                    data-testid="contact-success"
                                >
                                    <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                                        <Check className="h-6 w-6" />
                                    </span>
                                    <div className="font-mono text-emerald-300">Secure message transmitted.</div>
                                    <div className="font-mono text-[11px] text-white/40">packet encrypted · delivered · awaiting response</div>
                                </motion.div>
                            )}

                            {!connected && (
                                <form onSubmit={handleCommand} className="mt-2 flex items-center gap-2">
                                    <span className="text-emerald-400">guest@kypau:~$</span>
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        data-testid="contact-terminal-input"
                                        data-no-burst
                                        className="flex-1 bg-transparent text-cyan-200 outline-none"
                                        placeholder="type 'connect'..."
                                    />
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* direct contact */}
                <div className="space-y-3 lg:col-span-2">
                    {[
                        { icon: Mail, label: "Email", value: p.email, href: `mailto:${p.email}` },
                        { icon: Phone, label: "Phone", value: p.phone, href: `tel:${(p.phone || "").replace(/\s/g, "")}` },
                        { icon: MapPin, label: "Location", value: p.location, href: null },
                    ].map((c) => (
                        <a
                            key={c.label}
                            href={c.href || undefined}
                            className="glass-panel flex items-center gap-4 p-4 transition-colors hover:border-cyan-400/30"
                            data-cursor="card"
                        >
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                                <c.icon className="h-5 w-5" />
                            </span>
                            <div>
                                <div className="text-xs text-white/40">{c.label}</div>
                                <div className="text-sm text-white/85">{c.value}</div>
                            </div>
                        </a>
                    ))}
                    <div className="glass-panel neon-border relative p-5">
                        <div className="font-mono text-xs text-white/50">// response time</div>
                        <div className="mt-2 font-display text-2xl font-bold text-emerald-300">&lt; 24 hours</div>
                        <p className="mt-1 text-xs text-white/50">All transmissions are reviewed personally.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
