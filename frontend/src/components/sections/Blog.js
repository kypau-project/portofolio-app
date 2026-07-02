import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Tag, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";

export const Blog = ({ posts = [] }) => {
    const [query, setQuery] = useState("");
    const [cat, setCat] = useState("All");
    const categories = useMemo(() => ["All", ...new Set(posts.map((p) => p.category))], [posts]);

    const filtered = posts.filter(
        (p) =>
            (cat === "All" || p.category === cat) &&
            (p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase()))
    );
    const featured = filtered.find((p) => p.featured) || filtered[0];
    const rest = filtered.filter((p) => p.id !== featured?.id);

    return (
        <section id="blog" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="11" meta="// knowledge base" title="Research & Writing" subtitle="Deep dives on offensive security, tooling and secure development. Coming soon." />

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                                cat === c ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                        data-testid="blog-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/40 focus:outline-none sm:w-64"
                    />
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                {featured && (
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group glass-panel neon-border relative flex flex-col justify-end overflow-hidden p-6 lg:col-span-2 lg:min-h-[280px]"
                        data-cursor="card"
                    >
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                        <span className="mb-3 w-fit rounded-full bg-cyan-400/10 px-3 py-1 font-mono text-[11px] text-cyan-300">FEATURED · {featured.category}</span>
                        <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{featured.title}</h3>
                        <p className="mt-2 max-w-xl text-sm text-white/60">{featured.excerpt}</p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-white/45">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.reading_time} min read</span>
                            <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> {(featured.tags || []).join(", ")}</span>
                        </div>
                        <span className="mt-4 flex items-center gap-1 font-mono text-xs text-white/40">Coming soon <ArrowRight className="h-3.5 w-3.5" /></span>
                    </motion.article>
                )}

                <div className="space-y-4">
                    {rest.slice(0, 3).map((p, i) => (
                        <motion.article
                            key={p.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group glass-panel p-4 transition-colors hover:border-cyan-400/30"
                            data-cursor="card"
                        >
                            <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
                                <span className="text-violet-300">{p.category}</span> · <span>{p.reading_time} min</span>
                            </div>
                            <h4 className="mt-1 font-display text-base font-semibold text-white group-hover:text-cyan-300">{p.title}</h4>
                            <p className="mt-1 line-clamp-2 text-xs text-white/55">{p.excerpt}</p>
                        </motion.article>
                    ))}
                    {filtered.length === 0 && <div className="text-sm text-white/50">No articles match your search.</div>}
                </div>
            </div>
        </section>
    );
};
