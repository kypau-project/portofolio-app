import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Circle, ExternalLink, Users } from "lucide-react";
import { SectionHeader } from "@/components/fx/SectionHeader";
import { getGithubRepos, getGithubOrg, getGithubEvents } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", PHP: "#4F5D95",
    HTML: "#e34c26", CSS: "#563d7c", Dart: "#00B4AB", Java: "#b07219", Shell: "#89e051",
    Go: "#00ADD8", Vue: "#41b883", Blade: "#f7523f",
};

function Heatmap({ events }) {
    // Build a 7x18 grid (last ~126 days) from event day counts
    const map = useMemo(() => {
        const m = {};
        (events || []).forEach((e) => (m[e.date] = e.count));
        return m;
    }, [events]);
    const days = 7 * 18;
    const cells = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const c = map[key] || 0;
        cells.push({ key, c });
    }
    const level = (c) => (c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4);
    const bg = ["rgba(255,255,255,0.05)", "rgba(0,217,255,0.25)", "rgba(0,217,255,0.45)", "rgba(0,217,255,0.7)", "#00FFB3"];
    return (
        <div className="flex flex-wrap gap-1" style={{ maxWidth: 18 * 16 }}>
            {cells.map((cell, i) => (
                <div
                    key={cell.key}
                    title={`${cell.key}: ${cell.c} events`}
                    className="h-3 w-3 rounded-[3px]"
                    style={{ background: bg[level(cell.c)] }}
                />
            ))}
        </div>
    );
}

export const GitHubSection = () => {
    const [repos, setRepos] = useState(null);
    const [org, setOrg] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        Promise.all([getGithubRepos(), getGithubOrg().catch(() => null), getGithubEvents().catch(() => ({ days: [] }))])
            .then(([r, o, e]) => {
                setRepos(r.repos || []);
                setOrg(o);
                setEvents(e.days || []);
            })
            .catch(() => setError(true));
    }, []);

    const topRepos = (repos || [])
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 6);

    const languages = useMemo(() => {
        const counts = {};
        (repos || []).forEach((r) => {
            if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [repos]);

    const totalStars = (repos || []).reduce((a, r) => a + (r.stargazers_count || 0), 0);

    return (
        <section id="github" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <SectionHeader index="10" meta="// open source" title="GitHub Activity" subtitle="Live data pulled from the kypau-org organization." />

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                    { label: "Public Repos", value: repos ? repos.length : "—", icon: Github },
                    { label: "Total Stars", value: repos ? totalStars : "—", icon: Star },
                    { label: "Members", value: org?.members_count ?? (org ? "—" : "—"), icon: Users },
                    { label: "Languages", value: languages.length || "—", icon: Circle },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="glass-panel p-4"
                        data-cursor="card"
                    >
                        <s.icon className="h-5 w-5 text-cyan-300" />
                        <div className="mt-3 font-display text-2xl font-bold text-white">{s.value}</div>
                        <div className="text-xs text-white/50">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* repos */}
                <div className="lg:col-span-2">
                    <div className="mb-3 font-mono text-xs text-white/50">// pinned repositories</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {repos === null && !error &&
                            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />)}
                        {error && <div className="text-sm text-white/50">GitHub data temporarily unavailable.</div>}
                        {topRepos.map((r) => (
                            <a
                                key={r.id}
                                href={r.html_url}
                                target="_blank"
                                rel="noreferrer"
                                data-testid={`github-repo-${r.name}`}
                                className="group glass-panel flex flex-col p-4 transition-colors hover:border-cyan-400/30"
                                data-cursor="card"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm font-medium text-cyan-300">{r.name}</span>
                                    <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-cyan-300" />
                                </div>
                                <p className="mt-1 line-clamp-2 flex-1 text-xs text-white/55">{r.description || "No description provided."}</p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                                    {r.language && (
                                        <span className="flex items-center gap-1">
                                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || "#888" }} />
                                            {r.language}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {r.stargazers_count}</span>
                                    <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {r.forks_count}</span>
                                </div>
                            </a>
                        ))}
                        {repos && topRepos.length === 0 && !error && (
                            <div className="text-sm text-white/50">No public repositories yet.</div>
                        )}
                    </div>
                </div>

                {/* languages + heatmap */}
                <div className="space-y-6">
                    <div className="glass-panel p-5" data-cursor="card">
                        <div className="mb-3 font-mono text-xs text-white/50">// top languages</div>
                        <div className="space-y-2">
                            {languages.map(([lang, count]) => (
                                <div key={lang} className="flex items-center gap-2 text-sm">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[lang] || "#888" }} />
                                    <span className="text-white/75">{lang}</span>
                                    <span className="ml-auto font-mono text-xs text-white/40">{count}</span>
                                </div>
                            ))}
                            {languages.length === 0 && <div className="text-xs text-white/40">Loading languages...</div>}
                        </div>
                    </div>
                    <div className="glass-panel p-5" data-cursor="card">
                        <div className="mb-3 font-mono text-xs text-white/50">// contribution activity</div>
                        <Heatmap events={events} />
                    </div>
                </div>
            </div>
        </section>
    );
};
