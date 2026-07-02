"""KYPAU Portfolio API - FastAPI + MongoDB backend."""
import asyncio
import logging
import os
import time
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

import requests as http_requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

from auth import create_token, get_current_admin, hash_password, verify_password
from seed_data import (ACHIEVEMENTS, BLOG_POSTS, BUG_BOUNTY, CERTIFICATIONS,
                       EXPERIENCES, PROFILE, PROJECTS, SKILLS)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="KYPAU Portfolio API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

ADMIN_USERNAME = "admin"
ADMIN_DEFAULT_PASSWORD = "Kypau@2025"
GITHUB_ORG = "kypau-org"
GITHUB_CACHE_TTL = 600  # 10 minutes

_github_cache = {}

CONTENT_COLLECTIONS = {"projects", "certifications", "achievements", "skills", "experiences", "blog_posts"}


# ---------- helpers ----------

def now_iso():
    return datetime.now(timezone.utc).isoformat()


def clean(doc):
    """Remove Mongo _id from a document."""
    if doc and "_id" in doc:
        doc.pop("_id")
    return doc


def clean_list(docs):
    return [clean(d) for d in docs]


async def log_activity(action: str, detail: str, actor: str = "admin"):
    await db.activity_logs.insert_one({
        "id": str(uuid.uuid4()),
        "action": action,
        "detail": detail,
        "actor": actor,
        "timestamp": now_iso(),
    })


# ---------- models ----------

class LoginRequest(BaseModel):
    username: str
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(min_length=5, max_length=5000)


class TrackRequest(BaseModel):
    page: str = "/"
    referrer: str = ""


class MediaUpload(BaseModel):
    name: str
    data: str  # base64 data URL
    content_type: str = "image/png"
    category: str = "general"


class BulkDeleteRequest(BaseModel):
    ids: List[str]


# ---------- startup seeding ----------

async def seed_database():
    # Admin user
    existing = await db.users.find_one({"username": ADMIN_USERNAME})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "username": ADMIN_USERNAME,
            "password_hash": hash_password(ADMIN_DEFAULT_PASSWORD),
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user")

    # Profile / settings
    if not await db.settings.find_one({"id": "profile"}):
        await db.settings.insert_one(dict(PROFILE))
        logger.info("Seeded profile settings")

    # Content collections
    seeds = {
        "projects": PROJECTS,
        "certifications": CERTIFICATIONS,
        "achievements": ACHIEVEMENTS,
        "skills": SKILLS,
        "experiences": EXPERIENCES,
        "blog_posts": BLOG_POSTS,
    }
    for coll_name, data in seeds.items():
        if await db[coll_name].count_documents({}) == 0:
            await db[coll_name].insert_many([dict(d) for d in data])
            logger.info(f"Seeded {coll_name} ({len(data)} docs)")

    if not await db.bug_bounty.find_one({"id": "bugbounty"}):
        await db.bug_bounty.insert_one(dict(BUG_BOUNTY))
        logger.info("Seeded bug bounty data")


@app.on_event("startup")
async def startup_event():
    await seed_database()


# ---------- public routes ----------

@api_router.get("/")
async def root():
    return {"message": "KYPAU Portfolio API", "status": "operational"}


@api_router.get("/portfolio")
async def get_portfolio():
    profile = clean(await db.settings.find_one({"id": "profile"}))
    skills = clean_list(await db.skills.find().sort("order", 1).to_list(200))
    projects = clean_list(await db.projects.find().sort("order", 1).to_list(100))
    experiences = clean_list(await db.experiences.find().sort("order", 1).to_list(100))
    achievements = clean_list(await db.achievements.find().sort("order", 1).to_list(100))
    certifications = clean_list(await db.certifications.find().sort("order", 1).to_list(100))
    bug_bounty = clean(await db.bug_bounty.find_one({"id": "bugbounty"}))
    blog_posts = clean_list(await db.blog_posts.find().sort("date", -1).to_list(50))
    return {
        "profile": profile,
        "skills": skills,
        "projects": projects,
        "experiences": experiences,
        "achievements": achievements,
        "certifications": certifications,
        "bug_bounty": bug_bounty,
        "blog_posts": blog_posts,
    }


@api_router.post("/contact")
async def submit_contact(msg: ContactMessage):
    doc = {
        "id": str(uuid.uuid4()),
        "name": msg.name,
        "email": msg.email,
        "message": msg.message,
        "read": False,
        "created_at": now_iso(),
    }
    await db.messages.insert_one(dict(doc))
    return {"success": True, "message": "Secure message transmitted.", "id": doc["id"]}


@api_router.post("/analytics/track")
async def track_visit(req: TrackRequest):
    await db.page_views.insert_one({
        "id": str(uuid.uuid4()),
        "page": req.page,
        "referrer": req.referrer,
        "timestamp": now_iso(),
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    })
    total = await db.page_views.count_documents({})
    return {"success": True, "total_views": total}


@api_router.get("/analytics/visitor-count")
async def visitor_count():
    total = await db.page_views.count_documents({})
    return {"total_views": total}


@api_router.post("/projects/{project_id}/click")
async def project_click(project_id: str):
    result = await db.projects.update_one({"id": project_id}, {"$inc": {"clicks": 1}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}


# ---------- resume PDF ----------

@api_router.get("/resume")
async def download_resume():
    from io import BytesIO
    from fastapi.responses import Response
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas as pdf_canvas

    # Check if admin uploaded a custom resume
    custom_resume = await db.resume.find_one({"id": "resume"})
    if custom_resume and custom_resume.get("data"):
        import base64
        data_url = custom_resume["data"]
        # Strip the data URL prefix to get raw base64
        if "," in data_url:
            b64_data = data_url.split(",", 1)[1]
        else:
            b64_data = data_url
        pdf_bytes = base64.b64decode(b64_data)
        filename = custom_resume.get("name", "Resume.pdf")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    profile = await db.settings.find_one({"id": "profile"}) or PROFILE
    experiences = await db.experiences.find().sort("order", 1).to_list(20)
    skills = await db.skills.find().sort("order", 1).to_list(50)
    certs = await db.certifications.find().sort("order", 1).to_list(20)

    buf = BytesIO()
    c = pdf_canvas.Canvas(buf, pagesize=A4)
    w, h = A4
    dark = HexColor("#050816")
    cyan = HexColor("#00A8CC")
    gray = HexColor("#444455")

    y = h - 25 * mm
    c.setFillColor(dark)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(20 * mm, y, profile.get("name", ""))
    y -= 8 * mm
    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(20 * mm, y, profile.get("title", ""))
    y -= 6 * mm
    c.setFillColor(gray)
    c.setFont("Helvetica", 9)
    c.drawString(20 * mm, y, f"{profile.get('email','')}  |  {profile.get('phone','')}  |  {profile.get('location','')}")
    y -= 5 * mm
    c.drawString(20 * mm, y, f"LinkedIn: {profile.get('linkedin','')}  |  GitHub: {profile.get('github','')}")

    def section(title, yy):
        yy -= 10 * mm
        c.setFillColor(cyan)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(20 * mm, yy, title.upper())
        c.setStrokeColor(cyan)
        c.line(20 * mm, yy - 2 * mm, w - 20 * mm, yy - 2 * mm)
        return yy - 7 * mm

    def wrap_text(text, max_chars=105):
        words, lines, cur = text.split(), [], ""
        for word in words:
            if len(cur) + len(word) + 1 > max_chars:
                lines.append(cur)
                cur = word
            else:
                cur = f"{cur} {word}".strip()
        if cur:
            lines.append(cur)
        return lines

    y = section("Summary", y)
    c.setFillColor(dark)
    c.setFont("Helvetica", 9)
    for line in wrap_text(profile.get("summary", "")):
        c.drawString(20 * mm, y, line)
        y -= 4.5 * mm

    y = section("Experience & Education", y)
    for exp in experiences:
        c.setFillColor(dark)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(20 * mm, y, f"{exp['role']} — {exp['organization']}")
        c.setFont("Helvetica-Oblique", 8)
        c.setFillColor(gray)
        c.drawRightString(w - 20 * mm, y, exp["period"])
        y -= 4.5 * mm
        c.setFont("Helvetica", 8.5)
        for line in wrap_text(exp.get("description", ""), 115):
            c.drawString(22 * mm, y, line)
            y -= 4 * mm
        y -= 3 * mm

    y = section("Core Skills", y)
    c.setFillColor(dark)
    c.setFont("Helvetica", 9)
    by_cat = {}
    for s in skills:
        by_cat.setdefault(s["category"], []).append(s["name"])
    for cat, names in by_cat.items():
        c.setFont("Helvetica-Bold", 9)
        c.drawString(20 * mm, y, f"{cat}:")
        c.setFont("Helvetica", 8.5)
        for line in wrap_text(", ".join(names), 100):
            c.drawString(60 * mm, y, line)
            y -= 4.5 * mm

    y = section("Certifications", y)
    c.setFont("Helvetica", 8.5)
    for cert in certs:
        c.drawString(20 * mm, y, f"• {cert['title']} — {cert['issuer']} ({cert['year']})")
        y -= 4.5 * mm
        if y < 20 * mm:
            break

    c.save()
    buf.seek(0)
    return Response(
        content=buf.read(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Muhammad_Dzaky_Fauzan_Resume.pdf"},
    )


# ---------- GitHub events (activity heatmap) ----------

@api_router.get("/github/events")
async def github_events():
    try:
        data = await github_cached("events", f"https://api.github.com/orgs/{GITHUB_ORG}/events?per_page=100")
    except HTTPException:
        return {"days": []}
    counts = {}
    for ev in data:
        d = (ev.get("created_at") or "")[:10]
        if d:
            counts[d] = counts.get(d, 0) + 1
    return {"days": [{"date": k, "count": v} for k, v in sorted(counts.items())]}


# ---------- GitHub proxy ----------

def _fetch_github(url: str):
    resp = http_requests.get(url, timeout=15, headers={"Accept": "application/vnd.github+json", "User-Agent": "kypau-portfolio"})
    resp.raise_for_status()
    return resp.json()


async def github_cached(key: str, url: str):
    cached = _github_cache.get(key)
    if cached and cached[1] > time.time():
        return cached[0]
    try:
        data = await asyncio.to_thread(_fetch_github, url)
        _github_cache[key] = (data, time.time() + GITHUB_CACHE_TTL)
        # persist backup
        await db.github_cache.update_one(
            {"key": key}, {"$set": {"key": key, "data": data, "updated_at": now_iso()}}, upsert=True
        )
        return data
    except Exception as e:
        logger.warning(f"GitHub fetch failed for {key}: {e}")
        if cached:
            return cached[0]
        backup = await db.github_cache.find_one({"key": key})
        if backup:
            return backup["data"]
        raise HTTPException(status_code=502, detail="GitHub API unavailable")


@api_router.get("/github/org")
async def github_org():
    data = await github_cached("org", f"https://api.github.com/orgs/{GITHUB_ORG}")
    return data


@api_router.get("/github/repos")
async def github_repos():
    data = await github_cached("repos", f"https://api.github.com/orgs/{GITHUB_ORG}/repos?per_page=100&sort=updated")
    slim = [
        {
            "id": r.get("id"),
            "name": r.get("name"),
            "full_name": r.get("full_name"),
            "description": r.get("description"),
            "html_url": r.get("html_url"),
            "language": r.get("language"),
            "stargazers_count": r.get("stargazers_count", 0),
            "forks_count": r.get("forks_count", 0),
            "watchers_count": r.get("watchers_count", 0),
            "open_issues_count": r.get("open_issues_count", 0),
            "topics": r.get("topics", []),
            "updated_at": r.get("updated_at"),
            "created_at": r.get("created_at"),
            "fork": r.get("fork", False),
        }
        for r in data
    ]
    return {"repos": slim, "count": len(slim)}


# ---------- auth ----------

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    user = await db.users.find_one({"username": req.username})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user["username"])
    await log_activity("login", f"Admin '{req.username}' logged in", req.username)
    return {"access_token": token, "token_type": "bearer", "username": user["username"]}


@api_router.get("/auth/me")
async def me(username: str = Depends(get_current_admin)):
    return {"username": username, "role": "admin"}


@api_router.post("/auth/change-password")
async def change_password(req: ChangePasswordRequest, username: str = Depends(get_current_admin)):
    user = await db.users.find_one({"username": username})
    if not user or not verify_password(req.current_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    await db.users.update_one({"username": username}, {"$set": {"password_hash": hash_password(req.new_password)}})
    await log_activity("password_change", "Admin password updated", username)
    return {"success": True, "message": "Password updated"}


# ---------- admin: stats & analytics ----------

@api_router.get("/admin/stats")
async def admin_stats(username: str = Depends(get_current_admin)):
    total_views = await db.page_views.count_documents({})
    total_messages = await db.messages.count_documents({})
    unread_messages = await db.messages.count_documents({"read": False})
    total_projects = await db.projects.count_documents({})
    bug_bounty = await db.bug_bounty.find_one({"id": "bugbounty"})
    vulns = sum(s["count"] for s in bug_bounty.get("severity_distribution", [])) if bug_bounty else 0
    project_clicks = 0
    async for p in db.projects.find({}, {"clicks": 1}):
        project_clicks += p.get("clicks", 0)
    recent_messages = clean_list(await db.messages.find().sort("created_at", -1).to_list(5))
    return {
        "total_views": total_views,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "total_projects": total_projects,
        "vulnerabilities_found": vulns,
        "project_clicks": project_clicks,
        "recent_messages": recent_messages,
    }


@api_router.get("/admin/analytics")
async def admin_analytics(days: int = 30, username: str = Depends(get_current_admin)):
    start = datetime.now(timezone.utc) - timedelta(days=days)
    start_date = start.strftime("%Y-%m-%d")
    pipeline = [
        {"$match": {"date": {"$gte": start_date}}},
        {"$group": {"_id": "$date", "views": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    daily = await db.page_views.aggregate(pipeline).to_list(days + 1)
    series = [{"date": d["_id"], "views": d["views"]} for d in daily]
    top_pipeline = [
        {"$group": {"_id": "$page", "views": {"$sum": 1}}},
        {"$sort": {"views": -1}},
        {"$limit": 10},
    ]
    top_pages = await db.page_views.aggregate(top_pipeline).to_list(10)
    return {
        "daily_views": series,
        "top_pages": [{"page": t["_id"], "views": t["views"]} for t in top_pages],
        "total_views": await db.page_views.count_documents({}),
    }


# ---------- admin: messages ----------

@api_router.get("/admin/messages")
async def get_messages(
    search: str = "",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    username: str = Depends(get_current_admin),
):
    query = {}
    if search:
        query = {"$or": [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"message": {"$regex": search, "$options": "i"}},
        ]}
    total = await db.messages.count_documents(query)
    msgs = clean_list(
        await db.messages.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit).to_list(limit)
    )
    return {"messages": msgs, "total": total, "page": page, "pages": max(1, -(-total // limit))}


@api_router.patch("/admin/messages/{msg_id}/read")
async def mark_read(msg_id: str, username: str = Depends(get_current_admin)):
    result = await db.messages.update_one({"id": msg_id}, {"$set": {"read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"success": True}


@api_router.delete("/admin/messages/{msg_id}")
async def delete_message(msg_id: str, username: str = Depends(get_current_admin)):
    result = await db.messages.delete_one({"id": msg_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    await log_activity("delete_message", f"Deleted message {msg_id}", username)
    return {"success": True}


@api_router.post("/admin/messages/bulk-delete")
async def bulk_delete_messages(req: BulkDeleteRequest, username: str = Depends(get_current_admin)):
    result = await db.messages.delete_many({"id": {"$in": req.ids}})
    await log_activity("bulk_delete_messages", f"Deleted {result.deleted_count} messages", username)
    return {"success": True, "deleted": result.deleted_count}


# ---------- admin: generic content CRUD ----------

def _validate_collection(coll: str):
    if coll not in CONTENT_COLLECTIONS:
        raise HTTPException(status_code=404, detail=f"Unknown collection '{coll}'")


@api_router.get("/admin/content/{coll}")
async def list_content(coll: str, username: str = Depends(get_current_admin)):
    _validate_collection(coll)
    items = clean_list(await db[coll].find().sort("order", 1).to_list(500))
    return {"items": items, "total": len(items)}


@api_router.post("/admin/content/{coll}")
async def create_content(coll: str, item: dict, username: str = Depends(get_current_admin)):
    _validate_collection(coll)
    item.pop("_id", None)
    item["id"] = item.get("id") or str(uuid.uuid4())
    item["created_at"] = now_iso()
    await db[coll].insert_one(dict(item))
    await log_activity("create", f"Created item in {coll}: {item.get('title') or item.get('name') or item.get('role') or item['id']}", username)
    return clean(item)


@api_router.put("/admin/content/{coll}/{item_id}")
async def update_content(coll: str, item_id: str, item: dict, username: str = Depends(get_current_admin)):
    _validate_collection(coll)
    item.pop("_id", None)
    item.pop("id", None)
    item["updated_at"] = now_iso()
    result = await db[coll].update_one({"id": item_id}, {"$set": item})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    await log_activity("update", f"Updated item {item_id} in {coll}", username)
    updated = clean(await db[coll].find_one({"id": item_id}))
    return updated


@api_router.delete("/admin/content/{coll}/{item_id}")
async def delete_content(coll: str, item_id: str, username: str = Depends(get_current_admin)):
    _validate_collection(coll)
    result = await db[coll].delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    await log_activity("delete", f"Deleted item {item_id} from {coll}", username)
    return {"success": True}


# ---------- admin: media ----------

@api_router.post("/admin/media")
async def upload_media(media: MediaUpload, username: str = Depends(get_current_admin)):
    if len(media.data) > 15_000_000:
        raise HTTPException(status_code=413, detail="File too large (max ~10MB)")
    doc = {
        "id": str(uuid.uuid4()),
        "name": media.name,
        "data": media.data,
        "content_type": media.content_type,
        "category": media.category,
        "created_at": now_iso(),
    }
    await db.media.insert_one(dict(doc))
    await log_activity("upload_media", f"Uploaded media '{media.name}'", username)
    return clean(doc)


@api_router.get("/admin/media")
async def list_media(username: str = Depends(get_current_admin)):
    items = clean_list(await db.media.find().sort("created_at", -1).to_list(200))
    return {"items": items, "total": len(items)}


@api_router.delete("/admin/media/{media_id}")
async def delete_media(media_id: str, username: str = Depends(get_current_admin)):
    result = await db.media.delete_one({"id": media_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    await log_activity("delete_media", f"Deleted media {media_id}", username)
    return {"success": True}


# ---------- admin: settings & logs ----------

@api_router.get("/admin/settings")
async def get_settings(username: str = Depends(get_current_admin)):
    return clean(await db.settings.find_one({"id": "profile"}))


@api_router.put("/admin/settings")
async def update_settings(settings: dict, username: str = Depends(get_current_admin)):
    settings.pop("_id", None)
    settings.pop("id", None)
    settings["updated_at"] = now_iso()
    await db.settings.update_one({"id": "profile"}, {"$set": settings})
    await log_activity("update_settings", "Updated profile settings", username)
    return clean(await db.settings.find_one({"id": "profile"}))


@api_router.get("/admin/logs")
async def get_logs(limit: int = Query(50, ge=1, le=200), username: str = Depends(get_current_admin)):
    logs = clean_list(await db.activity_logs.find().sort("timestamp", -1).to_list(limit))
    return {"logs": logs, "total": len(logs)}


# ---------- admin: resume upload ----------

class ResumeUpload(BaseModel):
    name: str
    data: str  # base64 data URL
    content_type: str = "application/pdf"


@api_router.post("/admin/resume-upload")
async def upload_resume(resume: ResumeUpload, username: str = Depends(get_current_admin)):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    if len(resume.data) > 15_000_000:
        raise HTTPException(status_code=413, detail="File too large (max ~10MB)")
    doc = {
        "id": "resume",
        "name": resume.name,
        "data": resume.data,
        "content_type": resume.content_type,
        "updated_at": now_iso(),
    }
    await db.resume.replace_one({"id": "resume"}, doc, upsert=True)
    await log_activity("upload_resume", f"Uploaded resume '{resume.name}'", username)
    return {"name": resume.name, "updated_at": doc["updated_at"]}


@api_router.get("/admin/resume-info")
async def get_resume_info(username: str = Depends(get_current_admin)):
    doc = await db.resume.find_one({"id": "resume"})
    if not doc:
        return {"name": None}
    return {"name": doc.get("name"), "updated_at": doc.get("updated_at")}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
