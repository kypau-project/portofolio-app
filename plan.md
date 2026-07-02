# plan.md — Cinematic Cyberpunk Portfolio (React + FastAPI + MongoDB)

## 1. Objectives
- Deliver an Awwwards-quality “cyberpunk operating system” portfolio for **MUHAMMAD DZAKY FAUZAN** with cinematic motion, 3D hero (R3F), smooth scroll (Lenis), and premium UI polish.
- Provide a **secure Admin dashboard** (JWT) to manage content + inbox, with seeded credentials **admin / Kypau@2025** (changeable).
- Implement a robust **data layer** (MongoDB) for messages, projects, certifications, achievements, skills, analytics, media, settings, logs.
- Integrate **live GitHub org data** via backend proxy + caching to avoid rate limits.
- Ensure responsive, accessible interactions, reduced-motion support, and solid performance (lazy 3D, code-splitting).

## 2. Implementation Steps

### Phase 1 — Core POC (isolation) 
Goal: prove the **core end-to-end workflow** and the only external dependency (GitHub API) before building the cinematic shell.

**POC Scope (MVP, no UI polish yet):**
1) Backend endpoints (FastAPI + MongoDB):
- `POST /api/contact` (public) → stores message
- `POST /api/auth/login` (admin) → returns JWT
- `GET /api/admin/messages` (admin) → lists messages
- `GET /api/github/org/kypau-org/repos` (public) → fetch + in-memory/DB cached
2) Minimal frontend pages:
- `/` simple page with “Send test message” form
- `/admin` login
- `/admin/inbox` table showing stored messages
- `/github` render fetched repos

**Web research (best practices):**
- Confirm GitHub API caching strategy + ETags/rate limits; validate R3F v9 + React 19 compatibility.

**Exit criteria:**
- Visitor submits contact → appears in admin inbox after login.
- GitHub proxy returns repo list reliably with caching.

**User stories (Phase 1):**
1. As a visitor, I can submit a message and see a success state.
2. As an admin, I can log in with username/password and receive a token.
3. As an admin, I can view the message I just received in an inbox list.
4. As a visitor, I can load live repo data for kypau-org without errors.
5. As a developer, I can restart backend and still see persisted messages in MongoDB.

---

### Phase 2 — V1 App Development (public portfolio + admin, cinematic baseline)
Goal: build the full app around the proven core; prioritize **working navigation + content + data flows**.

**2.1 Design system + foundations (frontend):**
- Apply `Space Grotesk / Inter / JetBrains Mono`, Tailwind theme tokens (colors provided), glassmorphism primitives.
- Global layout: multi-layer animated background, scroll progress bar, reduced motion handling.
- Routing (react-router-dom): Public routes + `/admin/*`.

**2.2 Backend (complete API set):**
- Auth: JWT, bcrypt hash, seed admin on startup; password change endpoint.
- CRUD collections: projects, certificates, achievements, skills, experiences/education (seed CV data).
- Contact messages: mark read, delete, search/pagination.
- Analytics: page view tracking endpoint + aggregation for dashboard charts.
- Media library: base64 upload + list + delete (with size limits).
- GitHub proxy: cached fetch + TTL, optional ETag.
- Activity logs: record admin actions.

**2.3 Public portfolio (all sections, V1 quality):**
- Loader sequence (KYPAU → “Loading Secure Environment…”).
- Navbar (glass, active section, mobile menu).
- Hero: R3F cyber core (nodes/lines/particles + postprocessing bloom), mouse-reactive camera.
- About: summary + animated counters.
- Skills: interactive categories + radar chart.
- Experience/Education: neon timeline.
- Projects: bento grid + modal (data from backend).
- Cybersecurity showcase + Bug bounty charts (Recharts).
- Achievements + Certifications (carousel/cards).
- Globe (3D) with pings.
- GitHub section from proxy.
- Blog placeholder (premium cards + filters).
- Contact terminal: `connect` reveals validated form; submit → “Secure message transmitted.”
- Footer: quote + animated grid.

**2.4 Admin dashboard (V1 functional + polished UI):**
- `/admin` login (animated, glass).
- Sidebar layout + pages: Overview, Inbox, Projects, Certificates, Achievements, Skills, Media, Analytics, Settings, Logs.
- Recharts for trends; tables with search/pagination; modals + confirmations; skeleton loaders/toasts.

**End of Phase 2:** 1 round of end-to-end testing with `testing_agent_v3` (key flows + API + routing).

**User stories (Phase 2):**
1. As a visitor, I see a cinematic loader that transitions into an interactive 3D hero.
2. As a visitor, I can smoothly scroll and each section reveals with motion without stutter.
3. As a visitor, I can open a project modal and navigate between projects.
4. As a visitor, I can type `connect` in the terminal and send a validated message.
5. As an admin, I can log in and immediately see overview stats and recent messages.
6. As an admin, I can CRUD projects/certificates/skills and see changes reflect on the public site.

---

### Phase 3 — Cinematic polish + advanced interactions (production feel)
Goal: upgrade from functional V1 to “Awwwards-level” delight while keeping performance.

**Enhancements:**
- Advanced background layers (grid/fog/binary rain/network nodes) with parallax separation.
- Custom cursor (states, magnetic hover, subtle trail) + click particle burst.
- GSAP ScrollTrigger: pinned hero moments, section timelines, depth/blur transitions.
- Page transitions (route-level fade/blur/scale).
- Command palette (cmdk, Ctrl+K) + shortcuts + live clock.
- Back-to-top rocket + section minimap indicator.
- Sound toggle (Web Audio minimal UI SFX) with user preference saved.
- GitHub extras: language stats + generated heatmap.

**End of Phase 3:** run `testing_agent_v3` again focusing on regressions (forms, admin CRUD, nav, GitHub).

**User stories (Phase 3):**
1. As a visitor, I get subtle cursor feedback that makes the UI feel “alive”.
2. As a visitor, I can use Ctrl+K to jump to any section instantly.
3. As a visitor, I can toggle sound and the preference persists.
4. As a visitor, GitHub stats load quickly and don’t flicker due to caching.
5. As an admin, I can manage media assets and reuse them in projects/certifications.

---

### Phase 4 — Hardening, performance, accessibility, SEO
- Performance: lazy-load heavy sections/3D, memoization, asset compression, avoid layout shift.
- Accessibility: keyboard navigation, focus rings, ARIA labels, reduced motion variants.
- Security: JWT expiry/refresh strategy (if needed), input validation, rate limit contact endpoint.
- SEO: meta tags, OpenGraph, sitemap-like static hints in `index.html`.
- Final QA + bugfix loop with `testing_agent_v3`.

**User stories (Phase 4):**
1. As a motion-sensitive visitor, I can enable reduced motion and still enjoy the site.
2. As a keyboard user, I can navigate all interactive elements and modals.
3. As a recruiter, the site loads quickly and stays smooth on mid-tier devices.
4. As an admin, I feel confident actions are logged and undo mistakes via confirmations.
5. As the owner, I can change the admin password in Settings without breaking login.

## 3. Next Actions (immediate)
1. Call `design_agent` to lock UI rules: tokens, glass components, motion guidelines, and section composition.
2. Implement Phase 1 POC backend endpoints + seed admin.
3. Implement Phase 1 minimal frontend routes (public contact, admin login/inbox, GitHub page).
4. Run `testing_agent_v3` to validate POC end-to-end; fix until stable.

## 4. Success Criteria
- Core flow works: contact submission persists + visible in admin inbox; admin auth secure; GitHub proxy cached.
- Public portfolio contains all specified sections, responsive, cinematic motion, and 3D hero runs smoothly.
- Admin dashboard supports CRUD for core content + analytics + settings + logs.
- No critical console/API errors; graceful loading/error states everywhere.
- Meets performance baseline (smooth scrolling, lazy 3D) and accessibility (keyboard + reduced motion).