import React from "react";
import { motion } from "framer-motion";
import { Rocket, Globe, GraduationCap, Shield, Newspaper, Building2, Award } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

const ICONS = { rocket: Rocket, globe: Globe, graduation: GraduationCap, shield: Shield, newspaper: Newspaper, building: Building2 };
const TIER = {
    legendary: { ring: "border-yellow-400/50", glow: "0 0 30px rgba(250,204,21,0.25)", text: "text-yellow-300", label: "LEGENDARY" },
    epic: { ring: "border-violet-400/50", glow: "0 0 30px rgba(139,92,246,0.22)", text: "text-violet-300", label: "EPIC" },
    rare: { ring: "border-cyan-400/40", glow: "0 0 26px rgba(0,217,255,0.18)", text: "text-cyan-300", label: "RARE" },
};

function FlipCard({ item }) {
    const Icon = ICONS[item.icon] || Award;
    const tier = TIER[item.tier] || TIER.rare;
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="group h-52 [perspective:1200px]"
            data-cursor="card"
            data-testid={`achievement-${item.id}`}
        >
            <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* front */}
                <div
                    className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-white/[0.04] p-5 text-center [backface-visibility:hidden] ${tier.ring}`}
                    style={{ boxShadow: tier.glow }}
                >
                    <span className={`mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white/5 ${tier.text}`}>
                        <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-white/50">{item.subtitle}</p>
                    <span className={`mt-3 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-widest ${tier.ring} ${tier.text}`}>
                        {tier.label}
                    </span>
                </div>
                {/* back */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#070B1F]/90 p-5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="text-xs leading-relaxed text-white/70">{item.description}</p>
                    <span className="mt-3 font-mono text-xs text-cyan-300">{item.year}</span>
                </div>
            </div>
        </motion.div>
    );
}

export const Achievements = ({ achievements = [] }) => {
    return (
        <section id="achievements" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="07" meta="// hall of fame" title="Recognitions & Hall of Fame" subtitle="Acknowledged by leading organizations for responsible security disclosures. Hover a card to reveal details." />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {achievements.map((a) => (
                    <FlipCard key={a.id} item={a} />
                ))}
            </div>
        </section>
    );
};
