"""Seed data for Muhammad Dzaky Fauzan's portfolio - real CV content."""
import uuid


def uid():
    return str(uuid.uuid4())


PROFILE = {
    "id": "profile",
    "name": "MUHAMMAD DZAKY FAUZAN",
    "title": "Cybersecurity Specialist | Web Developer | Bug Bounty Hunter",
    "roles": [
        "Web Pentester", "Security Researcher", "Python Developer",
        "Laravel Developer", "Flutter Developer", "OSINT Researcher", "Ethical Hacker"
    ],
    "summary": "Cybersecurity Specialist, Web Developer, and Bug Hunter with 3+ years of experience in penetration testing, software engineering, and web development. Passionate about building modern websites, identifying security vulnerabilities, and creating tools that enhance both functionality and system protection. Proven track record of discovering high-impact security issues, developing secure web applications, and contributing to responsible disclosure programs across government, education, and private-sector organizations.",
    "email": "dfauzan661@gmail.com",
    "phone": "+62 851-6198-7474",
    "location": "Gunung Putri Selatan, Indonesia",
    "linkedin": "https://linkedin.com/in/muhammad-dzaky-fauzan-a97884371",
    "github": "https://github.com/orgs/kypau-org",
    "github_org": "kypau-org",
    "quote": "No System Is Safe.",
    "stats": {
        "years_experience": 3,
        "security_reports": 50,
        "recognitions": 20,
        "certifications": 10
    },
    "seo": {
        "title": "Muhammad Dzaky Fauzan | Cybersecurity Specialist",
        "description": "Cybersecurity Specialist, Web Developer & Bug Bounty Hunter. 3+ years in penetration testing, secure web development and responsible disclosure.",
        "keywords": "cybersecurity, bug bounty, penetration testing, web developer, OSINT"
    }
}

SKILLS = [
    # Cybersecurity & OSINT
    {"id": uid(), "name": "Web App Penetration Testing", "category": "Cybersecurity & OSINT", "level": 92, "description": "OWASP Top 10, XSS, SQLi, IDOR, auth bypass testing on production systems.", "order": 1},
    {"id": uid(), "name": "Vulnerability Assessment", "category": "Cybersecurity & OSINT", "level": 90, "description": "Systematic discovery, triage and CVSS scoring of security weaknesses.", "order": 2},
    {"id": uid(), "name": "Bug Hunting", "category": "Cybersecurity & OSINT", "level": 88, "description": "Responsible disclosure across government, education & private platforms.", "order": 3},
    {"id": uid(), "name": "Network Security", "category": "Cybersecurity & OSINT", "level": 82, "description": "Network recon, port scanning, service enumeration and hardening.", "order": 4},
    {"id": uid(), "name": "OSINT Research", "category": "Cybersecurity & OSINT", "level": 90, "description": "Open-source intelligence gathering, footprinting & data correlation.", "order": 5},
    # Development
    {"id": uid(), "name": "Python", "category": "Development", "level": 90, "description": "Security tooling, automation, Flask APIs and scripting.", "order": 6},
    {"id": uid(), "name": "Laravel", "category": "Development", "level": 88, "description": "Full-stack PHP applications with secure architecture.", "order": 7},
    {"id": uid(), "name": "JavaScript", "category": "Development", "level": 85, "description": "Interactive frontends, DOM security & modern ES features.", "order": 8},
    {"id": uid(), "name": "HTML5 / CSS3", "category": "Development", "level": 92, "description": "Semantic, responsive and accessible interfaces.", "order": 9},
    {"id": uid(), "name": "Flask", "category": "Development", "level": 82, "description": "Lightweight Python web services and REST APIs.", "order": 10},
    {"id": uid(), "name": "REST API Testing & Development", "category": "Development", "level": 86, "description": "Designing, building and security-testing REST APIs.", "order": 11},
    {"id": uid(), "name": "Flutter", "category": "Development", "level": 75, "description": "Cross-platform mobile apps with Dart.", "order": 12},
    # Soft skills
    {"id": uid(), "name": "Analytical & Critical Thinking", "category": "Soft Skills", "level": 95, "description": "Breaking complex systems down to find what others miss.", "order": 13},
    {"id": uid(), "name": "Problem Solving", "category": "Soft Skills", "level": 92, "description": "Creative exploit chains and pragmatic engineering fixes.", "order": 14},
    {"id": uid(), "name": "Fast Learner", "category": "Soft Skills", "level": 94, "description": "Rapidly adopting new stacks, tools and attack surfaces.", "order": 15},
]

PROJECTS = [
    {
        "id": uid(),
        "title": "WebOSINT (KOT)",
        "subtitle": "Open Source Intelligence Platform",
        "description": "Web-based Open Source Intelligence platform built with Laravel. Aggregates reconnaissance data — domain intelligence, WHOIS records, subdomain enumeration and metadata analysis — into a single operator console for security researchers.",
        "tech_stack": ["Laravel", "PHP", "MySQL", "TailwindCSS", "REST API"],
        "features": ["Domain & subdomain reconnaissance", "WHOIS + DNS intelligence", "Metadata extraction engine", "Exportable intelligence reports", "Operator dashboard"],
        "category": "Cybersecurity",
        "status": "Live",
        "live_url": "https://webosint.kypau.my.id",
        "github_url": "https://github.com/orgs/kypau-org",
        "image": "",
        "gradient": "cyan",
        "featured": True,
        "size": "large",
        "order": 1,
        "clicks": 0
    },
    {
        "id": uid(),
        "title": "Volunteer Management System",
        "subtitle": "Community Operations Platform",
        "description": "Web-based system streamlining volunteer registration, QR attendance tracking and event coordination, with a full admin dashboard for organizers to monitor participation in real time.",
        "tech_stack": ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
        "features": ["Volunteer registration flows", "Attendance tracking", "Admin analytics dashboard", "Role-based access control"],
        "category": "Web Development",
        "status": "Completed",
        "live_url": "",
        "github_url": "https://github.com/orgs/kypau-org",
        "image": "",
        "gradient": "violet",
        "featured": True,
        "size": "medium",
        "order": 2,
        "clicks": 0
    },
    {
        "id": uid(),
        "title": "WaliSantri Mobile App",
        "subtitle": "Academic Monitoring for Parents",
        "description": "Flutter-based mobile application that lets parents monitor their child's academic information, attendance records and school announcements from anywhere.",
        "tech_stack": ["Flutter", "Dart", "Firebase", "REST API"],
        "features": ["Academic progress monitoring", "Attendance notifications", "Announcement feed", "Secure parent authentication"],
        "category": "Mobile",
        "status": "Completed",
        "live_url": "",
        "github_url": "https://github.com/orgs/kypau-org",
        "image": "",
        "gradient": "emerald",
        "featured": True,
        "size": "medium",
        "order": 3,
        "clicks": 0
    },
    {
        "id": uid(),
        "title": "Classified Project",
        "subtitle": "In Development",
        "description": "A new security tool is currently in stealth development. Details will be declassified soon.",
        "tech_stack": ["Python", "Flask", "Docker"],
        "features": ["Coming soon"],
        "category": "Cybersecurity",
        "status": "In Progress",
        "live_url": "",
        "github_url": "",
        "image": "",
        "gradient": "pink",
        "featured": False,
        "size": "small",
        "order": 4,
        "clicks": 0
    },
]

EXPERIENCES = [
    {
        "id": uid(),
        "type": "work",
        "role": "Cybersecurity Researcher & Bug Bounty Hunter",
        "organization": "Freelance",
        "period": "Feb 2024 — Present",
        "start": "2024-02",
        "end": "",
        "current": True,
        "description": "Conducting web application penetration testing focused on XSS, SQL Injection and access-control flaws. Performing responsible disclosure to government, education and private-sector organizations. Developing custom security tools and following OWASP methodology.",
        "highlights": ["XSS & SQL Injection research", "Responsible Disclosure programs", "Custom security tool development", "OWASP Top 10 methodology"],
        "order": 1
    },
    {
        "id": uid(),
        "type": "work",
        "role": "Online Mentor — Graphic Design Class",
        "organization": "KOLABORATIF Community",
        "period": "Aug 2021 — Feb 2022",
        "start": "2021-08",
        "end": "2022-02",
        "current": False,
        "description": "Mentored community members in graphic design fundamentals, guiding weekly online classes and providing feedback on student work.",
        "highlights": ["Weekly online mentoring", "Design fundamentals curriculum", "Community engagement"],
        "order": 2
    },
    {
        "id": uid(),
        "type": "education",
        "role": "Diploma in Software Engineering",
        "organization": "IDN Polytechnic",
        "period": "Jun 2025 — Jul 2029 (Expected)",
        "start": "2025-06",
        "end": "2029-07",
        "current": True,
        "description": "Pursuing a diploma in Software Engineering with focus on secure application development and modern software architecture.",
        "highlights": ["Software Engineering", "Secure Development"],
        "order": 3
    },
    {
        "id": uid(),
        "type": "education",
        "role": "Senior High School",
        "organization": "SMAIT Mutiara Islam",
        "period": "Jul 2022 — Jun 2025",
        "start": "2022-07",
        "end": "2025-06",
        "current": False,
        "description": "Graduated with the Model Student Award for outstanding character and academic performance.",
        "highlights": ["Model Student Award"],
        "order": 4
    },
]

ACHIEVEMENTS = [
    {"id": uid(), "title": "NASA", "subtitle": "Letter of Recognition", "description": "Received an official Letter of Recognition from NASA for responsibly disclosing a security vulnerability.", "year": "2024", "tier": "legendary", "icon": "rocket", "order": 1},
    {"id": uid(), "title": "UNESCO", "subtitle": "Hall of Fame", "description": "Listed in the UNESCO security Hall of Fame for responsible vulnerability disclosure.", "year": "2024", "tier": "legendary", "icon": "globe", "order": 2},
    {"id": uid(), "title": "Institut Teknologi Bandung", "subtitle": "Security Acknowledgement", "description": "Acknowledged by ITB for reporting security vulnerabilities in university systems.", "year": "2024", "tier": "epic", "icon": "graduation", "order": 3},
    {"id": uid(), "title": "Telkom University", "subtitle": "Security Acknowledgement", "description": "Recognized by Telkom University for responsible disclosure of security issues.", "year": "2024", "tier": "epic", "icon": "graduation", "order": 4},
    {"id": uid(), "title": "Kemenkes RI", "subtitle": "Ministry of Health Recognition", "description": "Recognized by the Indonesian Ministry of Health for strengthening national health platform security.", "year": "2024", "tier": "epic", "icon": "shield", "order": 5},
    {"id": uid(), "title": "detik.com", "subtitle": "Responsible Disclosure", "description": "Acknowledged by Indonesia's largest news portal for responsible vulnerability reporting.", "year": "2024", "tier": "rare", "icon": "newspaper", "order": 6},
    {"id": uid(), "title": "Diskominfo", "subtitle": "Multiple Regional Branches", "description": "Recognized by multiple regional Communication & Informatics Offices across Indonesia.", "year": "2023-2024", "tier": "rare", "icon": "building", "order": 7},
    {"id": uid(), "title": "Jakarta Provincial Government", "subtitle": "Security Recognition", "description": "Recognized for improving the security posture of Jakarta government platforms.", "year": "2024", "tier": "rare", "icon": "building", "order": 8},
    {"id": uid(), "title": "West Java Provincial Government", "subtitle": "Security Recognition", "description": "Acknowledged for responsible disclosure to West Java provincial systems.", "year": "2024", "tier": "rare", "icon": "building", "order": 9},
    {"id": uid(), "title": "Pekalongan City Government", "subtitle": "Security Recognition", "description": "Recognized for helping secure Pekalongan city digital services.", "year": "2023", "tier": "rare", "icon": "building", "order": 10},
]

CERTIFICATIONS = [
    {"id": uid(), "title": "Ethical Hacking Essentials (EHE)", "issuer": "EC-Council", "year": "2024", "category": "Cybersecurity", "color": "cyan", "order": 1},
    {"id": uid(), "title": "CCEP — Certified Cyber Entry Professional", "issuer": "Cyber Academy", "year": "2024", "category": "Cybersecurity", "color": "violet", "order": 2},
    {"id": uid(), "title": "Android Bug Bounty Hunting", "issuer": "EC-Council", "year": "2024", "category": "Cybersecurity", "color": "emerald", "order": 3},
    {"id": uid(), "title": "JavaScript Essentials", "issuer": "Cisco Networking Academy", "year": "2023", "category": "Development", "color": "yellow", "order": 4},
    {"id": uid(), "title": "Belajar Dasar AI", "issuer": "Dicoding Indonesia", "year": "2024", "category": "AI", "color": "pink", "order": 5},
    {"id": uid(), "title": "Java Programming", "issuer": "Programming Hub", "year": "2023", "category": "Development", "color": "cyan", "order": 6},
    {"id": uid(), "title": "Frontend Development", "issuer": "Programming Hub", "year": "2023", "category": "Development", "color": "violet", "order": 7},
    {"id": uid(), "title": "Programming Hub Certification", "issuer": "Programming Hub", "year": "2023", "category": "Development", "color": "emerald", "order": 8},
    {"id": uid(), "title": "IT Certification", "issuer": "Various Institutions", "year": "2023", "category": "IT", "color": "yellow", "order": 9},
]

BUG_BOUNTY = {
    "id": "bugbounty",
    "severity_distribution": [
        {"name": "XSS", "count": 18, "color": "#00D9FF"},
        {"name": "SQLi", "count": 8, "color": "#FF4D6D"},
        {"name": "IDOR", "count": 7, "color": "#8B5CF6"},
        {"name": "Open Redirect", "count": 5, "color": "#FACC15"},
        {"name": "Misconfiguration", "count": 6, "color": "#00FFB3"},
        {"name": "CORS", "count": 4, "color": "#F97316"},
        {"name": "Authentication", "count": 2, "color": "#EC4899"}
    ],
    "severity_levels": [
        {"name": "Critical", "count": 6, "color": "#FF4D6D"},
        {"name": "High", "count": 14, "color": "#F97316"},
        {"name": "Medium", "count": 19, "color": "#FACC15"},
        {"name": "Low", "count": 11, "color": "#00FFB3"}
    ],
    "tools": ["Burp Suite", "Nmap", "ffuf", "Amass", "Subfinder", "httpx", "Katana", "Python", "Flask", "Laravel", "Git", "Docker"],
    "methodology": [
        {"step": "Reconnaissance", "description": "Subdomain enumeration, asset discovery, tech fingerprinting with Amass, Subfinder & httpx."},
        {"step": "Mapping", "description": "Crawling with Katana, endpoint discovery with ffuf, building the attack surface map."},
        {"step": "Exploitation", "description": "Manual testing with Burp Suite — XSS, SQLi, IDOR, auth flaws following OWASP Top 10."},
        {"step": "Reporting", "description": "Clear proof-of-concept, impact analysis, CVSS scoring and remediation guidance."},
        {"step": "Disclosure", "description": "Responsible coordination with organizations until issues are verified and fixed."}
    ],
    "disclosures": [
        {"institution": "NASA", "country": "United States", "lat": 28.5, "lng": -80.6, "status": "Recognized", "year": "2024"},
        {"institution": "UNESCO", "country": "France", "lat": 48.85, "lng": 2.35, "status": "Hall of Fame", "year": "2024"},
        {"institution": "Institut Teknologi Bandung", "country": "Indonesia", "lat": -6.89, "lng": 107.61, "status": "Acknowledged", "year": "2024"},
        {"institution": "Telkom University", "country": "Indonesia", "lat": -6.97, "lng": 107.63, "status": "Acknowledged", "year": "2024"},
        {"institution": "Kemenkes RI", "country": "Indonesia", "lat": -6.23, "lng": 106.83, "status": "Recognized", "year": "2024"},
        {"institution": "detik.com", "country": "Indonesia", "lat": -6.24, "lng": 106.78, "status": "Acknowledged", "year": "2024"},
        {"institution": "Jakarta Provincial Gov", "country": "Indonesia", "lat": -6.2, "lng": 106.85, "status": "Recognized", "year": "2024"},
        {"institution": "West Java Provincial Gov", "country": "Indonesia", "lat": -6.9, "lng": 107.6, "status": "Recognized", "year": "2024"},
        {"institution": "Pekalongan City Gov", "country": "Indonesia", "lat": -6.89, "lng": 109.68, "status": "Recognized", "year": "2023"}
    ]
}

BLOG_POSTS = [
    {"id": uid(), "title": "Hunting Stored XSS in Government Portals", "excerpt": "A walkthrough of my methodology for finding persistent cross-site scripting in large public-sector applications — from recon to responsible disclosure.", "category": "Cybersecurity", "tags": ["XSS", "Bug Bounty", "Methodology"], "reading_time": 8, "date": "2024-11-02", "featured": True, "published": False},
    {"id": uid(), "title": "Building WebOSINT: Lessons From Shipping a Recon Platform", "excerpt": "Architecture decisions, Laravel patterns and API design choices behind my open-source intelligence platform.", "category": "Development", "tags": ["Laravel", "OSINT", "Architecture"], "reading_time": 12, "date": "2024-09-15", "featured": False, "published": False},
    {"id": uid(), "title": "The Recon Pipeline: Amass to Katana", "excerpt": "My end-to-end reconnaissance automation — chaining Amass, Subfinder, httpx and Katana into a single pipeline.", "category": "Cybersecurity", "tags": ["Recon", "Automation", "Tools"], "reading_time": 6, "date": "2024-08-20", "featured": False, "published": False},
    {"id": uid(), "title": "SQL Injection in 2024: Still Alive", "excerpt": "Why SQLi keeps appearing in modern applications and how I found 8 of them across production systems this year.", "category": "Cybersecurity", "tags": ["SQLi", "Research"], "reading_time": 10, "date": "2024-07-10", "featured": False, "published": False},
]
