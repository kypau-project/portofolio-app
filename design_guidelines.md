{
  "brand": {
    "name": "MUHAMMAD DZAKY FAUZAN",
    "tagline": "Cybersecurity Specialist • Web Developer • Bug Bounty Hunter",
    "design_personality": [
      "cinematic command-center",
      "premium cyberpunk minimalism",
      "glass + holographic panels",
      "subtle neon accents (never noisy)",
      "Apple/Linear-level spacing + Vercel smoothness",
      "story-driven scroll (every section is a scene)"
    ],
    "success_actions": [
      "Recruiter instantly understands role + credibility",
      "Visitor explores projects + security methodology",
      "Visitor uses Ctrl+K command palette",
      "Visitor sends message via terminal contact",
      "Admin can manage content quickly (CRUD)"
    ]
  },

  "global_rules": {
    "default_mode": "dark",
    "performance_targets": {
      "fps": 60,
      "3d_lazy_load": true,
      "reduced_motion_support": true
    },
    "gradient_restriction_rule": {
      "prohibited": [
        "blue-500 to purple-600",
        "purple-500 to pink-500",
        "green-500 to blue-500",
        "red to pink",
        "any dark/saturated gradient combo that reduces readability"
      ],
      "limits": {
        "max_viewport_coverage": "20%",
        "no_text_heavy_areas": true,
        "no_small_elements_under_100px": true,
        "no_stacked_gradient_layers": true
      },
      "allowed_usage": [
        "hero background only (decorative)",
        "section background overlays (decorative)",
        "large ambient glows behind panels",
        "never on cards containing paragraphs"
      ],
      "enforcement": "IF gradient area exceeds 20% of viewport OR impacts readability THEN fallback to solid colors."
    },
    "testing": {
      "data_testid_required": true,
      "convention": "kebab-case describing role (not appearance)",
      "examples": [
        "data-testid=\"navbar-projects-link\"",
        "data-testid=\"hero-primary-cta-button\"",
        "data-testid=\"contact-terminal-submit-button\"",
        "data-testid=\"admin-inbox-search-input\""
      ]
    }
  },

  "design_tokens": {
    "colors": {
      "mandatory_user_palette": {
        "background": "#050816",
        "primary": "#00D9FF",
        "secondary": "#8B5CF6",
        "accent": "#00FFB3",
        "danger": "#FF4D6D",
        "warning": "#FACC15",
        "text": "#F5F5F5"
      },
      "extended_neutrals": {
        "bg_0": "#050816",
        "bg_1": "#070B1F",
        "panel": "rgba(255,255,255,0.06)",
        "panel_strong": "rgba(255,255,255,0.10)",
        "border": "rgba(255,255,255,0.10)",
        "border_strong": "rgba(0,217,255,0.35)",
        "text_primary": "#F5F5F5",
        "text_muted": "rgba(245,245,245,0.72)",
        "text_faint": "rgba(245,245,245,0.52)"
      },
      "semantic": {
        "surface": "rgba(255,255,255,0.06)",
        "surface_hover": "rgba(255,255,255,0.09)",
        "surface_active": "rgba(255,255,255,0.12)",
        "focus_ring": "rgba(0,217,255,0.55)",
        "success": "#00FFB3",
        "info": "#00D9FF",
        "warning": "#FACC15",
        "danger": "#FF4D6D"
      },
      "chart_palette": {
        "series_1": "#00D9FF",
        "series_2": "#8B5CF6",
        "series_3": "#00FFB3",
        "series_4": "#FACC15",
        "series_5": "#FF4D6D"
      }
    },

    "typography": {
      "fonts": {
        "display": "Space Grotesk",
        "body": "Inter",
        "mono": "JetBrains Mono"
      },
      "scale": {
        "h1": "text-4xl sm:text-5xl lg:text-6xl",
        "h2": "text-base md:text-lg",
        "body": "text-sm md:text-base",
        "small": "text-xs"
      },
      "tracking": {
        "display": "tracking-[-0.02em]",
        "mono": "tracking-[-0.01em]"
      },
      "usage_rules": [
        "Use Space Grotesk for hero headings, section titles, KPI numbers.",
        "Use Inter for paragraphs, labels, UI copy.",
        "Use JetBrains Mono for terminal, code snippets, timestamps, IDs, command palette hints."
      ]
    },

    "spacing": {
      "section_py": "py-16 md:py-24",
      "container": "max-w-6xl mx-auto px-4 sm:px-6",
      "card_padding": "p-5 md:p-6",
      "bento_gap": "gap-4 md:gap-6"
    },

    "radius": {
      "panel": "rounded-2xl",
      "button": "rounded-xl",
      "chip": "rounded-full"
    },

    "shadows_and_glow": {
      "panel_shadow": "shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
      "cyan_glow": "shadow-[0_0_0_1px_rgba(0,217,255,0.25),0_0_40px_rgba(0,217,255,0.12)]",
      "violet_glow": "shadow-[0_0_0_1px_rgba(139,92,246,0.22),0_0_40px_rgba(139,92,246,0.10)]",
      "green_glow": "shadow-[0_0_0_1px_rgba(0,255,179,0.22),0_0_40px_rgba(0,255,179,0.10)]"
    }
  },

  "css_custom_properties": {
    "where": "/app/frontend/src/index.css @layer base",
    "instructions": [
      "Replace current :root/.dark shadcn tokens with cyberpunk tokens (keep variable names, change values).",
      "Set body background to #050816 and ensure .dark is applied at app root.",
      "Add custom tokens for glow, noise, cursor, and motion durations.",
      "Do NOT add transition: all anywhere."
    ],
    "token_block": ":root {\n  --background: 230 67% 6%; /* #050816 */\n  --foreground: 0 0% 96%; /* #F5F5F5 */\n\n  --card: 230 60% 8%;\n  --card-foreground: 0 0% 96%;\n\n  --popover: 230 60% 8%;\n  --popover-foreground: 0 0% 96%;\n\n  --primary: 190 100% 50%; /* #00D9FF */\n  --primary-foreground: 230 67% 6%;\n\n  --secondary: 258 90% 66%; /* #8B5CF6 */\n  --secondary-foreground: 0 0% 96%;\n\n  --accent: 162 100% 50%; /* #00FFB3 */\n  --accent-foreground: 230 67% 6%;\n\n  --destructive: 348 100% 65%; /* #FF4D6D */\n  --destructive-foreground: 0 0% 96%;\n\n  --muted: 230 35% 14%;\n  --muted-foreground: 0 0% 72%;\n\n  --border: 0 0% 100% / 0.10;\n  --input: 0 0% 100% / 0.12;\n  --ring: 190 100% 50% / 0.55;\n\n  --radius: 1rem;\n\n  /* custom */\n  --glow-cyan: 0 217 255;\n  --glow-violet: 139 92 246;\n  --glow-green: 0 255 179;\n  --ease-out: cubic-bezier(.16,1,.3,1);\n  --ease-elastic: cubic-bezier(.34,1.56,.64,1);\n  --dur-1: 120ms;\n  --dur-2: 220ms;\n  --dur-3: 420ms;\n}\n"
  },

  "layout_system": {
    "public_single_page": {
      "pattern": "cinematic scenes",
      "scroll_story": [
        "Scene 0: Loader (scanner + decrypt)",
        "Scene 1: Hero (3D cyber core + role rotator)",
        "Scene 2: About (glass dossier + counters)",
        "Scene 3: Skills (radar + category bars)",
        "Scene 4: Timeline (experience/education)",
        "Scene 5: Projects (bento + filters + modal)",
        "Scene 6: Security Showcase (pipeline + tools)",
        "Scene 7: Bug Bounty (charts)",
        "Scene 8: Hall of Fame (flip cards)",
        "Scene 9: Certifications (3D carousel)",
        "Scene 10: Globe (pings)",
        "Scene 11: GitHub (stats + heatmap)",
        "Scene 12: Blog (placeholder)",
        "Scene 13: Contact Terminal (connect → form → encrypted send)",
        "Scene 14: Footer (grid + quote)"
      ],
      "grid": {
        "container": "max-w-6xl mx-auto px-4 sm:px-6",
        "columns": "12-col mental model",
        "bento": "Use CSS grid with auto-rows-[minmax(140px,auto)] and md:grid-cols-12",
        "section_header": "Left-aligned title + right-aligned meta (time, status, hint)"
      }
    },
    "admin_dashboard": {
      "pattern": "glass ops console",
      "shell": {
        "sidebar": "collapsible, icon-first at md, full labels at lg",
        "topbar": "search + cmdk hint + user menu + live clock",
        "content": "cards + tables + charts with consistent padding"
      }
    }
  },

  "background_and_fx_layers": {
    "principle": "multi-layer, slow, never overwhelming",
    "layers": [
      {
        "name": "starfield",
        "implementation": "canvas (lightweight) or CSS radial dots",
        "motion": "very slow drift + subtle parallax",
        "opacity": 0.25
      },
      {
        "name": "animated_grid",
        "implementation": "CSS repeating-linear-gradient + mask",
        "motion": "translateY loop 40-60s",
        "opacity": 0.18
      },
      {
        "name": "network_nodes",
        "implementation": "canvas particles with connecting lines",
        "motion": "slow float; connect on proximity",
        "opacity": 0.22
      },
      {
        "name": "neon_fog",
        "implementation": "two large blurred blobs behind hero only",
        "motion": "scale/rotate 30-50s",
        "opacity": 0.18,
        "gradient_coverage_note": "Keep blobs behind hero only; do not exceed 20% viewport as visible gradient."
      },
      {
        "name": "binary_rain",
        "implementation": "optional, only in loader + contact terminal",
        "motion": "slow; pause on reduced-motion",
        "opacity": 0.12
      }
    ],
    "mouse_reactive_lighting": {
      "implementation": "CSS radial-gradient spotlight following cursor on body::before",
      "constraints": "spotlight must be subtle; do not reduce text contrast"
    },
    "noise": {
      "implementation": "CSS noise overlay via base64 svg or tiny png",
      "opacity": 0.06,
      "blend": "overlay"
    }
  },

  "components": {
    "shadcn_primary_components": {
      "component_path": "/app/frontend/src/components/ui/",
      "use": [
        "button.jsx",
        "card.jsx",
        "badge.jsx",
        "tabs.jsx",
        "dialog.jsx",
        "sheet.jsx",
        "navigation-menu.jsx",
        "command.jsx",
        "table.jsx",
        "pagination.jsx",
        "input.jsx",
        "textarea.jsx",
        "form.jsx",
        "tooltip.jsx",
        "hover-card.jsx",
        "progress.jsx",
        "skeleton.jsx",
        "sonner.jsx",
        "alert-dialog.jsx",
        "calendar.jsx"
      ]
    },

    "custom_components_to_build": [
      {
        "name": "CinematicLoader",
        "purpose": "KYPAU wordmark → Loading Secure Environment… % + scanner line + decrypt text",
        "notes": "Use GSAP timeline; lock scroll until complete; respect reduced-motion"
      },
      {
        "name": "CommandCenterBackground",
        "purpose": "multi-layer background manager (stars/grid/nodes/noise/spotlight)",
        "notes": "Prefer canvas for nodes; CSS for grid + noise"
      },
      {
        "name": "CustomCursor",
        "purpose": "glow cursor with states (default/link/drag/text)",
        "notes": "Hide on touch devices; use requestAnimationFrame smoothing"
      },
      {
        "name": "MagneticButton",
        "purpose": "primary CTA + key actions",
        "notes": "GSAP quickTo elastic; fallback to normal button on reduced-motion"
      },
      {
        "name": "ScrollProgress",
        "purpose": "top progress bar + section markers",
        "notes": "Use CSS transform scaleX; no transition: all"
      },
      {
        "name": "HeroCyberCore3D",
        "purpose": "R3F glowing core + orbiting nodes + bloom",
        "notes": "Lazy-load; use drei + postprocessing; cap DPR on mobile"
      },
      {
        "name": "NeonTimeline",
        "purpose": "experience/education vertical timeline with glow",
        "notes": "Use intersection observer + GSAP stagger"
      },
      {
        "name": "BentoProjectGrid",
        "purpose": "projects with filters + 3D tilt cards + modal",
        "notes": "Tilt via pointermove; modal via shadcn Dialog"
      },
      {
        "name": "TerminalContact",
        "purpose": "type connect → validated form → encrypted send animation",
        "notes": "Use JetBrains Mono; show transmission progress; toast via sonner"
      },
      {
        "name": "AdminShell",
        "purpose": "sidebar + topbar + content layout",
        "notes": "Use shadcn Sheet for mobile sidebar"
      }
    ]
  },

  "component_styles_and_tailwind": {
    "glass_panel": {
      "className": "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
      "hover": "hover:bg-white/[0.09] hover:border-white/15",
      "focus": "focus-within:ring-2 focus-within:ring-cyan-400/40"
    },
    "neon_border": {
      "className": "relative before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:bg-[linear-gradient(90deg,rgba(0,217,255,0.55),rgba(139,92,246,0.35),rgba(0,255,179,0.35))] before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:xor] before:pointer-events-none",
      "note": "This is a 1px gradient border only (allowed). Keep it subtle; do not use on small chips."
    },
    "primary_button": {
      "base": "rounded-xl px-5 py-3 text-sm font-semibold text-[#050816] bg-[#00D9FF] shadow-[0_0_0_1px_rgba(0,217,255,0.35),0_12px_40px_rgba(0,217,255,0.18)]",
      "hover": "hover:bg-[#00E6FF]",
      "active": "active:scale-[0.98]",
      "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
      "transition": "transition-colors duration-200"
    },
    "secondary_button": {
      "base": "rounded-xl px-5 py-3 text-sm font-semibold text-white border border-white/15 bg-white/[0.06] backdrop-blur-xl",
      "hover": "hover:bg-white/[0.09] hover:border-white/25",
      "active": "active:scale-[0.98]",
      "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",
      "transition": "transition-colors duration-200"
    },
    "ghost_button": {
      "base": "rounded-xl px-4 py-2 text-sm text-white/80 hover:text-white border border-transparent hover:border-white/10",
      "transition": "transition-colors duration-200"
    },
    "terminal": {
      "container": "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl",
      "header": "flex items-center justify-between px-4 py-3 border-b border-white/10",
      "body": "p-4 font-mono text-[13px] leading-relaxed text-white/85",
      "prompt": "text-cyan-300",
      "caret": "inline-block w-[8px] h-[16px] bg-cyan-300/80 align-[-2px] animate-pulse"
    }
  },

  "motion_and_microinteractions": {
    "libraries": {
      "lenis": "smooth scroll",
      "gsap_scrolltrigger": "scene reveals + pinned sections",
      "framer_motion": "component-level micro-interactions",
      "r3f": "hero core + globe",
      "postprocessing": "bloom"
    },
    "principles": [
      "Everything moves subtly: idle float (2-6px), shimmer lines, breathing glow.",
      "Use staggered reveals (y: 12 → 0, opacity 0 → 1) with ease-out.",
      "Hover: depth shift (translateY -2), glow intensifies, border brightens.",
      "Press: scale 0.98 (only on buttons/cards).",
      "Scroll: pin hero for 1 viewport; reveal sections like system modules booting."
    ],
    "reduced_motion": {
      "behavior": "Disable Lenis smoothing, disable cursor, reduce parallax, keep simple fades",
      "implementation": "use prefers-reduced-motion media query + runtime flag"
    }
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast: ensure text on glass panels remains readable.",
      "Keyboard navigation: Cmd+K opens command palette; Esc closes dialogs/sheets.",
      "Visible focus rings: cyan ring with 2px thickness.",
      "Touch targets: min 44px height for primary actions.",
      "Do not rely on color alone for severity; add icons/labels."
    ]
  },

  "image_urls": {
    "background_textures": [
      {
        "category": "hero_ambient",
        "description": "Abstract neon grid / cyber ambience (use as very subtle overlay with opacity 0.08-0.14)",
        "url": "https://images.unsplash.com/photo-1664070719324-c0a6a02ce364?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
      },
      {
        "category": "section_divider",
        "description": "Light beams / futuristic corridor (use as masked divider behind section headers only)",
        "url": "https://images.unsplash.com/photo-1597848007618-54db4e82fe3a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
      },
      {
        "category": "abstract_pattern",
        "description": "Striped abstract wall (use for blog placeholder card background with heavy blur + low opacity)",
        "url": "https://images.unsplash.com/photo-1611494215598-da6d9486636b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
      }
    ]
  },

  "admin_ui_guidelines": {
    "login": {
      "layout": "center-left split: left is glass login card, right is animated grid + subtle nodes",
      "fields": [
        "email",
        "password"
      ],
      "microcopy": "Show 'Authenticating…' with progress bar + rotating key icon (lucide)"
    },
    "sidebar": {
      "active_state": "cyan underline + subtle glow",
      "collapsed": "icons only with tooltip",
      "mobile": "Sheet slide-over"
    },
    "tables": {
      "use": "shadcn Table + Pagination",
      "row_hover": "bg-white/[0.04]",
      "actions": "ghost buttons with tooltips",
      "empty_state": "terminal-style message + CTA"
    },
    "charts": {
      "library": "Recharts",
      "styling": "grid lines white/10, axis labels white/60, series colors from chart_palette",
      "interaction": "tooltip as glass panel"
    }
  },

  "libraries_and_install_notes": {
    "required": [
      {
        "name": "lenis",
        "install": "npm i @studio-freight/lenis",
        "usage": "Create Lenis instance in a ScrollProvider; sync with GSAP ScrollTrigger."
      },
      {
        "name": "gsap",
        "install": "npm i gsap",
        "usage": "Use ScrollTrigger for pinned hero + section reveals; avoid animating expensive box-shadows on scroll."
      },
      {
        "name": "@react-three/fiber + drei + @react-three/postprocessing",
        "install": "npm i three @react-three/fiber @react-three/drei @react-three/postprocessing",
        "usage": "Lazy-load Canvas; cap DPR; use EffectComposer Bloom."
      },
      {
        "name": "recharts",
        "install": "npm i recharts",
        "usage": "RadarChart for skills; Pie/Bar/Area for bug bounty + admin analytics."
      }
    ]
  },

  "instructions_to_main_agent": [
    "Apply .dark class at the root (e.g., <html> or <body> or top-level div) and replace shadcn tokens in index.css with the provided cyberpunk token block.",
    "Remove default CRA App.css centering patterns; do not use .App { text-align:center }.",
    "Implement CommandCenterBackground as a fixed, pointer-events-none layer behind everything; keep opacity low.",
    "Implement CinematicLoader first; block scroll until complete; then initialize Lenis + GSAP.",
    "All interactive elements must include data-testid attributes (buttons, links, inputs, tabs, dialogs, table actions).",
    "Use shadcn components from /src/components/ui only for dropdowns/dialogs/command/calendar/toasts.",
    "Keep gradients decorative and limited; rely on solid dark surfaces + neon glows for premium feel.",
    "Mobile-first: hide custom cursor on touch; reduce 3D complexity; ensure 44px touch targets.",
    "Admin: reuse same tokens; keep dashboard readable (less glow, more structure)."
  ],

  "append_general_ui_ux_design_guidelines": "<General UI UX Design Guidelines>\n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
