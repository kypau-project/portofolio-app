import React, { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Home, User, Cpu, Briefcase, FolderGit2, ShieldCheck, Bug,
    Award, BadgeCheck, Globe2, Github, FileText, Terminal, Download, Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resumeUrl } from "@/lib/api";

const SECTIONS = [
    { id: "hero", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "security", label: "Security Showcase", icon: ShieldCheck },
    { id: "bugbounty", label: "Bug Bounty", icon: Bug },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "certifications", label: "Certifications", icon: BadgeCheck },
    { id: "globe", label: "Disclosure Map", icon: Globe2 },
    { id: "github", label: "GitHub", icon: Github },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "contact", label: "Contact", icon: Terminal },
];

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const go = (id) => {
        setOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search sections..." data-testid="command-palette-input" />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigate">
                    {SECTIONS.map((s) => (
                        <CommandItem key={s.id} value={s.label} onSelect={() => go(s.id)}>
                            <s.icon className="mr-2 h-4 w-4 text-cyan-400" />
                            <span>{s.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                    <CommandItem value="Download Resume" onSelect={() => { window.open(resumeUrl, "_blank"); setOpen(false); }}>
                        <Download className="mr-2 h-4 w-4 text-emerald-400" />
                        Download Resume
                    </CommandItem>
                    <CommandItem value="Admin Login" onSelect={() => { navigate("/admin"); setOpen(false); }}>
                        <Lock className="mr-2 h-4 w-4 text-violet-400" />
                        Admin Login
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
