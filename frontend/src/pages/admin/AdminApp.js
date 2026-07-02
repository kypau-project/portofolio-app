import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Inbox, FolderGit2, BadgeCheck, Award, Cpu, ImageIcon,
    BarChart3, Settings as SettingsIcon, ScrollText, LogOut, Menu, X, ShieldCheck, ChevronLeft,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { LiveClock } from "@/components/fx/LiveClock";
import { Loader2 } from "lucide-react";

import Overview from "@/pages/admin/Overview";
import InboxPage from "@/pages/admin/Inbox";
import { ContentManager } from "@/pages/admin/ContentManager";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import Analytics from "@/pages/admin/Analytics";
import SettingsPage from "@/pages/admin/Settings";
import Logs from "@/pages/admin/Logs";

const NAV = [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/dashboard/inbox", label: "Inbox", icon: Inbox },
    { to: "/admin/dashboard/projects", label: "Projects", icon: FolderGit2 },
    { to: "/admin/dashboard/certifications", label: "Certifications", icon: BadgeCheck },
    { to: "/admin/dashboard/achievements", label: "Achievements", icon: Award },
    { to: "/admin/dashboard/skills", label: "Skills", icon: Cpu },
    { to: "/admin/dashboard/media", label: "Media Library", icon: ImageIcon },
    { to: "/admin/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/dashboard/settings", label: "Settings", icon: SettingsIcon },
    { to: "/admin/dashboard/logs", label: "Activity Logs", icon: ScrollText },
];

export default function AdminApp() {
    const { loading, authed, username, logout } = useAdminAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
        );
    }
    if (!authed) return <Navigate to="/admin" replace />;

    const doLogout = () => {
        logout();
        navigate("/admin", { replace: true });
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 px-4 py-5">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                    <ShieldCheck className="h-5 w-5" />
                </span>
                {!collapsed && <span className="font-display text-lg font-bold text-gradient-cyber">KYPAU CMS</span>}
            </div>
            <nav className="flex-1 space-y-1 px-2">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        data-testid={`admin-nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                isActive
                                    ? "bg-cyan-400/10 text-cyan-300"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`
                        }
                        title={item.label}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                                {isActive && !collapsed && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 8px #00D9FF" }} />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            <button
                onClick={doLogout}
                data-testid="admin-logout-button"
                className="m-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D]"
            >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
    );

    return (
        <div className="flex min-h-screen">
            {/* desktop sidebar */}
            <aside
                className={`sticky top-0 hidden h-screen flex-shrink-0 border-r border-white/10 bg-[#070B1F]/70 backdrop-blur-xl transition-all md:block ${
                    collapsed ? "w-[72px]" : "w-64"
                }`}
            >
                <SidebarContent />
            </aside>

            {/* mobile sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 26, stiffness: 240 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#070B1F] md:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050816]/80 px-4 py-3 backdrop-blur-xl md:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 md:hidden"
                        >
                            <Menu className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setCollapsed((c) => !c)}
                            className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/70 hover:text-cyan-300 md:grid"
                        >
                            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                        </button>
                        <div className="font-mono text-sm text-white/50">
                            <span className="text-cyan-300">root@kypau</span>:~/admin
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block"><LiveClock /></div>
                        <div className="flex items-center gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-400/10 font-mono text-xs text-violet-300">
                                {(username || "A")[0].toUpperCase()}
                            </span>
                            <span className="hidden text-sm text-white/70 sm:block">{username}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    <Routes>
                        <Route index element={<Overview />} />
                        <Route path="inbox" element={<InboxPage />} />
                        <Route path="projects" element={<ContentManager collection="projects" />} />
                        <Route path="certifications" element={<ContentManager collection="certifications" />} />
                        <Route path="achievements" element={<ContentManager collection="achievements" />} />
                        <Route path="skills" element={<ContentManager collection="skills" />} />
                        <Route path="media" element={<MediaLibrary />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="logs" element={<Logs />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
