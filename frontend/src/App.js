import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { SoundProvider } from "@/context/SoundContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { CommandCenterBackground } from "@/components/fx/CommandCenterBackground";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { ParticleBurst } from "@/components/fx/ParticleBurst";
import { KonamiEasterEgg } from "@/components/fx/KonamiEasterEgg";
import { CinematicLoader } from "@/components/fx/CinematicLoader";

const Portfolio = lazy(() => import("@/pages/Portfolio"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminApp = lazy(() => import("@/pages/admin/AdminApp"));

// Prevent browser from restoring scroll position on page reload
if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

function Shell() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const [loaded, setLoaded] = useState(() => sessionStorage.getItem("kypau_loaded") === "1");

    const handleComplete = useCallback(() => {
        sessionStorage.setItem("kypau_loaded", "1");
        setLoaded(true);
    }, []);

    // The cinematic loader plays only for the public portfolio, before it mounts.
    const showLoader = !isAdminRoute && !loaded;

    return (
        <>
            <CommandCenterBackground />
            <CustomCursor />
            <ParticleBurst />
            <KonamiEasterEgg />
            {!isAdminRoute && <ScrollProgress />}

            <AnimatePresence mode="wait">
                {showLoader && <CinematicLoader key="loader" onComplete={handleComplete} />}
            </AnimatePresence>

            {!showLoader && (
                <Suspense fallback={<div className="min-h-screen" />}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PortfolioProvider>
                                    <Portfolio ready={loaded} />
                                </PortfolioProvider>
                            }
                        />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin/dashboard/*" element={<AdminApp />} />
                    </Routes>
                </Suspense>
            )}
            <Toaster position="top-right" theme="dark" />
        </>
    );
}

function App() {
    return (
        <SoundProvider>
            <BrowserRouter>
                <Shell />
            </BrowserRouter>
        </SoundProvider>
    );
}

export default App;
