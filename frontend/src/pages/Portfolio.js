import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePortfolio } from "@/context/PortfolioContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Security } from "@/components/sections/Security";
import { BugBounty } from "@/components/sections/BugBounty";
import { Achievements } from "@/components/sections/Achievements";
import { Certifications } from "@/components/sections/Certifications";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { RocketToTop } from "@/components/fx/RocketToTop";
import { CommandPalette } from "@/components/fx/CommandPalette";
import { SoundToggle } from "@/components/fx/SoundToggle";
import { Loader2 } from "lucide-react";

export default function Portfolio({ ready }) {
    const { data, loading, error } = usePortfolio();
    const reduced = useReducedMotion();
    const lenisRef = useRef(null);

    // Always start at top of page on load
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
        if (reduced || !ready) return;
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
        lenisRef.current = lenis;
        let raf;
        const loop = (time) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, [reduced, ready]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="font-mono text-[#FF4D6D]">// connection error</div>
                <p className="text-white/60">Unable to establish a secure link to the server. Please refresh.</p>
            </div>
        );
    }

    const { profile, skills, projects, experiences, achievements, certifications, bug_bounty, blog_posts } = data;

    return (
        <div className="App relative">
            <Navbar />
            <CommandPalette />
            <SoundToggle />
            <RocketToTop />
            <main>
                <Hero profile={profile} ready={ready} />
                <About profile={profile} />
                <Skills skills={skills} />
                <Experience experiences={experiences} />
                <Projects projects={projects} />
                <Security bugBounty={bug_bounty} />
                <BugBounty bugBounty={bug_bounty} />
                <Achievements achievements={achievements} />
                <Certifications certifications={certifications} />
                <GitHubSection />
                <Blog posts={blog_posts} />
                <Contact profile={profile} />
            </main>
            <Footer profile={profile} />
        </div>
    );
}
