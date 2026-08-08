from fastapi import FastAPI, APIRouter, HTTPException, Query, Response, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from database import supabase as db

ROOT_DIR = Path(__file__).parent
import resend
load_dotenv(ROOT_DIR / '.env')
import asyncio
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")


app = FastAPI(title="A2Z Plant Nutrient API")
api_router = APIRouter(prefix="/api")
class EmailRequest(BaseModel):
    recipient_email: str
    subject: str
    html_content: str

@api_router.post("/send-email")
async def send_email(request: EmailRequest):
    params = {
        "from": SENDER_EMAIL,
        "to": [request.recipient_email],
        "subject": request.subject,
        "html": request.html_content
    }

    try:
        # Run sync SDK in thread to keep FastAPI non-blocking
        email = await asyncio.to_thread(resend.Emails.send, params)
        return {
            "status": "success",
            "message": f"Email sent to {request.recipient_email}",
            "email_id": email.get("id")
        }
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")



# ===================== Helpers =====================
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    text = (text or "").lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-") or str(uuid.uuid4())[:8]


# ===================== Models =====================
class BlogBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    excerpt: str = ""
    content: str
    author: str = "Admin"
    category: str = "General"
    tags: List[str] = []
    cover_image: str = ""  # URL or base64 data URI


class BlogCreate(BlogBase):
    slug: Optional[str] = None


class Blog(BlogBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class MediaBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    description: str = ""
    category: str = "Gallery"
    media_type: str = "image"  # image | video
    data: str  # base64 data URI or external URL


class MediaCreate(MediaBase):
    pass


class Media(MediaBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class CareerBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    type: str = "Full-time"
    location: str = "Varanasi, UP"
    desc: str


class CareerCreate(CareerBase):
    pass


class Career(CareerBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class ApplicationCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: str
    phone: str
    role: Optional[str] = ""
    message: str
    resume: str  # Will hold base64 string

class Application(ApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)

class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: str
    phone: Optional[str] = ""
    subject: Optional[str] = ""
    message: str


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


class ProfileRequestCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    organization: Optional[str] = ""
    designation: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    tender_ref: Optional[str] = ""
    message: Optional[str] = ""


class ProfileRequest(ProfileRequestCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


# ===================== Routes =====================
@api_router.get("/")
async def root():
    return {"message": "A2Z Plant Nutrient API is running", "ok": True}


# ---------- Blog ----------
@api_router.post("/blogs", response_model=Blog)
async def create_blog(payload: BlogCreate):
    slug = (payload.slug or slugify(payload.title))
    # ensure unique slug
    if await db.blogs.find_one({"slug": slug}):
        slug = f"{slug}-{str(uuid.uuid4())[:6]}"
    blog = Blog(**payload.model_dump(exclude={"slug"}), slug=slug)
    await db.blogs.insert_one(blog.model_dump())
    return blog


@api_router.get("/blogs", response_model=List[Blog])
async def list_blogs(category: Optional[str] = None, q: Optional[str] = None, limit: int = 100):
    query = {}
    if category:
        query["category"] = category
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.blogs.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api_router.get("/blogs/{slug}", response_model=Blog)
async def get_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return doc


@api_router.put("/blogs/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, payload: BlogCreate):
    existing = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")
    update_data = payload.model_dump(exclude_unset=True, exclude={"slug"})
    update_data["updated_at"] = now_iso()
    if payload.slug and payload.slug != existing.get("slug"):
        update_data["slug"] = payload.slug
    await db.blogs.update_one({"id": blog_id}, {"$set": update_data})
    doc = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    return doc


@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str):
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True, "deleted": blog_id}


# ---------- Media ----------
@api_router.post("/media", response_model=Media)
async def create_media(payload: MediaCreate):
    media = Media(**payload.model_dump())
    await db.media.insert_one(media.model_dump())
    return media


@api_router.get("/media", response_model=List[Media])
async def list_media(category: Optional[str] = None, media_type: Optional[str] = None, limit: int = 500):
    query = {}
    if category:
        query["category"] = category
    if media_type:
        query["media_type"] = media_type
    docs = await db.media.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str):
    result = await db.media.delete_one({"id": media_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"ok": True, "deleted": media_id}


# ---------- Careers ----------
@api_router.post("/careers", response_model=Career)
async def create_career(payload: CareerCreate):
    career = Career(**payload.model_dump())
    await db.careers.insert_one(career.model_dump())
    return career


@api_router.get("/careers", response_model=List[Career])
async def list_careers():
    docs = await db.careers.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs


@api_router.delete("/careers/{career_id}")
async def delete_career(career_id: str):
    result = await db.careers.delete_one({"id": career_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Career not found")
    return {"ok": True, "deleted": career_id}


@api_router.post("/apply")
async def create_application(payload: ApplicationCreate):
    app = Application(**payload.model_dump())
    await db.applications.insert_one(app.model_dump())
    
    # Try sending an email to site admin
    if resend.api_key:
        try:
            admin_email_html = f"""
            <h2>New Job Application</h2>
            <p><strong>Role:</strong> {payload.role}</p>
            <p><strong>Name:</strong> {payload.name}</p>
            <p><strong>Email:</strong> {payload.email}</p>
            <p><strong>Phone:</strong> {payload.phone}</p>
            <p><strong>Message:</strong></p>
            <p>{payload.message}</p>
            <p><i>Resume attached below.</i></p>
            """
            
            attachments = []
            if payload.resume.startswith("data:"):
                # parse base64
                header, b64_data = payload.resume.split(",", 1)
                mime_type = header.split(":")[1].split(";")[0]
                ext = "pdf" if "pdf" in mime_type else "doc"
                
                attachments.append({
                    "filename": f"resume_{payload.name.replace(' ', '_')}.{ext}",
                    "content": b64_data
                })
            
            # Send notification to admin
            params = {
                "from": SENDER_EMAIL,
                "to": ["info@a2zplantnutrient.com"],
                "subject": f"New Job Application: {payload.name} for {payload.role}",
                "html": admin_email_html,
                "attachments": attachments
            }
            asyncio.create_task(asyncio.to_thread(resend.Emails.send, params))
        except Exception as e:
            logger.error(f"Failed to send application notification email: {e}")
            
    return app

# ---------- Contact ----------
@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    msg = Contact(**payload.model_dump())
    await db.contacts.insert_one(msg.model_dump())
    
    # Try sending an email to site admin
    if resend.api_key:
        try:
            admin_email_html = f"""
            <h2>New Contact Us Message</h2>
            <p><strong>Name:</strong> {payload.name}</p>
            <p><strong>Email:</strong> {payload.email}</p>
            <p><strong>Phone:</strong> {payload.phone}</p>
            <p><strong>Subject:</strong> {payload.subject}</p>
            <p><strong>Message:</strong></p>
            <p>{payload.message}</p>
            """
            
            # Send notification to admin
            params = {
                "from": SENDER_EMAIL,
                "to": ["info@a2zplantnutrient.com"],
                "subject": f"Contact Form Submission: {payload.subject}",
                "html": admin_email_html
            }
            asyncio.create_task(asyncio.to_thread(resend.Emails.send, params))
        except Exception as e:
            logger.error(f"Failed to send contact notification email: {e}")
            
    return msg


# ---------- Company Profile Requests ----------
@api_router.post("/profile-requests", response_model=ProfileRequest)
async def create_profile_request(payload: ProfileRequestCreate):
    req = ProfileRequest(**payload.model_dump())
    await db.profile_requests.insert_one(req.model_dump())
    
    if resend.api_key:
        try:
            admin_email_html = f"""
            <h2>New Profile Request</h2>
            <p><strong>Name:</strong> {payload.name}</p>
            <p><strong>Email:</strong> {payload.email}</p>
            <p><strong>Organization:</strong> {payload.organization}</p>
            <p><strong>Designation:</strong> {payload.designation}</p>
            <p><strong>Phone:</strong> {payload.phone}</p>
            <p><strong>Message:</strong> {payload.message}</p>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": ["info@a2zplantnutrient.com"],
                "subject": "A2Z Plant Nutrient: Company Profile Request Received",
                "html": admin_email_html
            }
            asyncio.create_task(asyncio.to_thread(resend.Emails.send, params))
        except Exception as e:
            logger.error(f"Failed to send profile request notification email: {e}")

    return req


@api_router.get("/profile-requests", response_model=List[ProfileRequest])
async def list_profile_requests():
    docs = await db.profile_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


# ---------- Admin auth (shared password, session cookie) ----------
class AdminLoginPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    password: str


import bcrypt

@api_router.post("/admin-auth")
async def admin_login(payload: AdminLoginPayload, response: Response):
    stored_hash_str = os.environ.get("ADMIN_PASSWORD_HASH", "")
    stored_hash_str = stored_hash_str.strip("'\"")
    
    if not stored_hash_str:
        raise HTTPException(status_code=500, detail="admin-not-configured")
        
    if not payload.password:
        raise HTTPException(status_code=401, detail="invalid-credentials")
        
    try:
        if not bcrypt.checkpw(payload.password.encode('utf-8'), stored_hash_str.encode('utf-8')):
            raise ValueError("Invalid password")
    except Exception:
        raise HTTPException(status_code=401, detail="invalid-credentials")

    # Set HttpOnly cookie that the Next.js middleware verifies.
    response.set_cookie(
        key="a2z_admin",
        value="authenticated",
        max_age=60 * 60 * 8,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
    )
    return {"ok": True}


@api_router.delete("/admin-auth")
async def admin_logout(response: Response):
    response.delete_cookie("a2z_admin", path="/")
    return {"ok": True}


# ---------- Seed (idempotent) ----------
@api_router.post("/seed")
async def seed():
    """Idempotent seed of initial blogs, careers, and gallery media."""
    seeded = {"blogs": 0, "careers": 0, "media": 0}

    initial_blogs = [
        {
            "title": "What Makes a Horticulture Tender Bid Actually Compliant",
            "excerpt": "Before your bid gets scored on price, it gets scored on paperwork. A field-tested checklist from an EPC Partner.",
            "content": "Every horticulture tender we bid on begins the same way — with a compliance stack, not a species list. Over hundreds of proposals to NHAI, NTPC, PSUs and municipal bodies, we've distilled the non-negotiables that decide whether your bid even reaches technical evaluation.\n\n**1. Registration & Statutory Documents**\nCIN, GSTIN, Udyam / MSME, PAN, EPFO & ESIC codes, income-tax returns for the last three years and audited financials. Missing even one is grounds for automatic rejection under most CPWD and PSU norms.\n\n**2. Certifications**\nISO 9001 (Quality) and ISO 14001 (Environmental Management) are increasingly the floor, not a differentiator. DPIIT recognition unlocks specific reservations under Startup India, and CII / carbon-footprint certifications add technical marks in ESG-linked tenders.\n\n**3. Past Performance Certificates**\nWe recommend maintaining a live folder of PO copies, completion certificates and client satisfaction letters organised by client type — NHAI, PSU, corporate campus, ULB. Match this to the tender's minimum experience threshold on Day 1.\n\n**4. Workforce Affidavit**\nMany PSUs require a declaration of in-house horticulturists, agronomists and field staff. This is where a captive 100+ workforce shows its worth over sub-contracted models.\n\n**5. Species & Maintenance Plan**\nOnly after the paperwork clears does the actual proposal — species list, phased timeline, AMC schedule — get read. Design it around the site's climate, soil profile and the client's ESG targets.\n\nGet the paperwork right and the horticulture takes care of itself.",
            "author": "A2Z Team",
            "category": "EPC Insights",
            "tags": ["tender", "compliance", "epc"],
            "cover_image": "/real-township-avenue-install.jpg",
        },
        {
            "title": "Compensatory Afforestation Done Right — Lessons from Highway Corridors",
            "excerpt": "Compensatory plantation is only as good as the survival rate three years later. Here's what really moves the needle.",
            "content": "On paper, compensatory afforestation looks simple — plant N trees, submit the geotag report, close the file. In practice, it's a five-year survival problem that most contracts underprice.\n\n**Site preparation matters more than species selection**\nAlong highway corridors, the top-layer soil is compacted by construction traffic and stripped of nutrients. Without proper de-compaction, sub-soil aeration and organic amendment, even native species struggle. We build 30–60 days of site preparation into every corridor plantation plan.\n\n**Species must be locally sourced, not just locally suitable**\nNative species from a distant nursery arrive stressed and often carry pathogens. Wherever possible we build feeder nurseries near the project site — this alone lifts one-year survival rates by 20–30%.\n\n**Maintenance is the project**\n70% of budget effort in the first two years is watering, tree guards, weeding and pest control. Contracts that back-load these payments incentivise the wrong behaviour — we prefer front-loaded maintenance milestones tied to third-party survival audits.\n\n**Digital reporting builds trust**\nEvery A2Z corridor plantation ships with geotagged plant data, monthly photos and a dashboard the client's engineer can access anytime. This is the future of compensatory afforestation.",
            "author": "A2Z Team",
            "category": "Sustainability",
            "tags": ["afforestation", "nhai", "esg"],
            "cover_image": "/real-iocl-odisha-maintenance.jpg",
        },
        {
            "title": "Multi-Year AMC for PSU Townships: A Playbook",
            "excerpt": "How we structure horticulture Annual Maintenance Contracts for PSU residential and administrative townships.",
            "content": "A PSU township is a small city — and its greenery is the first thing residents, visitors and inspection teams notice. A well-run horticulture AMC is a mix of operational discipline, agronomy and public-facing service design.\n\n**Zone the campus**\nWe split every township into administrative, residential, guest-house, sports and boundary zones. Each has its own service intensity — a guest-house lawn needs weekly precision cuts, a boundary green belt only monthly attention.\n\n**Right-size the workforce**\nA typical 100-acre PSU township requires 20–25 gardeners, 2 horticulturists and 1 site supervisor working on rotational shifts. We staff up during the pre-monsoon plantation drive and re-baseline through peak summer.\n\n**Digitise the reports**\nWe issue monthly reports covering pruning cycles, fertigation, pest incidents, replacement plantings and any deviations from the scope. This makes AMC review meetings 15 minutes long, not 90.\n\n**Plan for the surprise inspection**\nEvery two weeks, a senior horticulturist walks the site with a simple checklist that mirrors what a PSU HR head would look for. This is what turns a good AMC into an invisible-but-obvious one.",
            "author": "A2Z Team",
            "category": "EPC Insights",
            "tags": ["amc", "psu", "operations"],
            "cover_image": "/real-nursery-delivery.jpg",
        },
    ]
    for b in initial_blogs:
        exists = await db.blogs.find_one({"title": b["title"]})
        if not exists:
            slug = slugify(b["title"])
            doc = Blog(**b, slug=slug).model_dump()
            await db.blogs.insert_one(doc)
            seeded["blogs"] += 1

    initial_careers = [
        {"title": "Landscape Designer", "type": "Full-time", "location": "Varanasi, UP · Pan-India travel",
         "desc": "Design large-scale landscapes for government and corporate EPC projects."},
        {"title": "Site Supervisor — EPC Projects", "type": "Full-time", "location": "Multi-state · UP / MP / Odisha / Delhi",
         "desc": "Lead ground execution and quality control at PSU / govt project sites across states."},
        {"title": "Agronomist / Horticulturist", "type": "Full-time", "location": "Varanasi, UP + Project sites",
         "desc": "Species selection, soil health, pest management and multi-year maintenance planning."},
        {"title": "Mural Artist", "type": "Contract", "location": "Pan India · Project-based",
         "desc": "Design and execute large-format murals integrated with our landscape projects."},
        {"title": "Project Manager — Delhi / NCR", "type": "Full-time", "location": "New Delhi",
         "desc": "Own NBCC / WTC and related institutional projects end-to-end — planning, procurement and handover."},
        {"title": "Regional Coordinator — Odisha", "type": "Full-time", "location": "Odisha (IOCL Sites)",
         "desc": "Coordinate landscape maintenance operations across IOCL, Odisha facilities."},
    ]
    for c in initial_careers:
        exists = await db.careers.find_one({"title": c["title"]})
        if not exists:
            doc = Career(**c).model_dump()
            await db.careers.insert_one(doc)
            seeded["careers"] += 1

    initial_media = [
    {"title": "A2Z Project Execution 1", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_001.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 2", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_002.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 3", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_003.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 4", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_004.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 5", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_005.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 6", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_006.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 7", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_007.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 8", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_008.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 9", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_009.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 10", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_010.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 11", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_011.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 12", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_012.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 13", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_013.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 14", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_014.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 15", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_015.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 16", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_016.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 17", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_017.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 18", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_018.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 19", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_019.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 20", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_020.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 21", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_021.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 22", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_022.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 23", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_023.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 24", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_024.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 25", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_025.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 26", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_026.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 27", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_027.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 28", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_028.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 29", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_029.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 30", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_030.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 31", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_031.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 32", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_032.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 33", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_033.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 34", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_034.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 35", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_035.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 36", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_036.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 37", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_037.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 38", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_038.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 39", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_039.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 40", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_040.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 41", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_041.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 42", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_042.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 43", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_043.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 44", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_044.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 45", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_045.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 46", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_046.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 47", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_047.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 48", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_048.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 49", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_049.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 50", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_050.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 51", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_051.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 52", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_052.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 53", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_053.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 54", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_054.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 55", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_055.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 56", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_056.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 57", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_057.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 58", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_058.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 59", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_059.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 60", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_060.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 61", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_061.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 62", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_062.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 63", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_063.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 64", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_064.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 65", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_065.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 66", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_066.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 67", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_067.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 68", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_068.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 69", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_069.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 70", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_070.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 71", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_071.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 72", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_072.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 73", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_073.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 74", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_074.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 75", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_075.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 76", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_076.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 77", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_077.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 78", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_078.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 79", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_079.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 80", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_080.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 81", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_081.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 82", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_082.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 83", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_083.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 84", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_084.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 85", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_085.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 86", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_086.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 87", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_087.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 88", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_088.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 89", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_089.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 90", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_090.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 91", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_091.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 92", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_092.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 93", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_093.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 94", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_094.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 95", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_095.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 96", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_096.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 97", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_097.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 98", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_098.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 99", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_099.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 100", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_100.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 101", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_101.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 102", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_102.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 103", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_103.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 104", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_104.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 105", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_105.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 106", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_106.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 107", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_107.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 108", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_108.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 109", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_109.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 110", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_110.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 111", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_111.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 112", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_112.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 113", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_113.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 114", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_114.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 115", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_115.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 116", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_116.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 117", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_117.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 118", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_118.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 119", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_119.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 120", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_120.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 121", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_121.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 122", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_122.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 123", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_123.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 124", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_124.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 125", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_125.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 126", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_126.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 127", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_127.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 128", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_128.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 129", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_129.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 130", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_130.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 131", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_131.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 132", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_132.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 133", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_133.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 134", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_134.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 135", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_135.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 136", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_136.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 137", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_137.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 138", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_138.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 139", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_139.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 140", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_140.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 141", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_141.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 142", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_142.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 143", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_143.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 144", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_144.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 145", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_145.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 146", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_146.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 147", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_147.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 148", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_148.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 149", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_149.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 150", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_150.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 151", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_151.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 152", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_152.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 153", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_153.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 154", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_154.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 155", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_155.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 156", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_156.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 157", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_157.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 158", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_158.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 159", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_159.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 160", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_160.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 161", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_161.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 162", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_162.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 163", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_163.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 164", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_164.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 165", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_165.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
    {"title": "A2Z Project Execution 166", "category": "Project Work", "media_type": "image", "data": "/gallery/proj_166.jpeg", "description": "On-ground execution and landscape maintenance by A2Z Plant Nutrient."},
]
    for m in initial_media:
        exists = await db.media.find_one({"title": m["title"]})
        if not exists:
            doc = Media(**m).model_dump()
            await db.media.insert_one(doc)
            seeded["media"] += 1

    return {"ok": True, "seeded": seeded}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_seed():
    """Auto-seed initial content on startup if collections are empty."""
    try:
        if await db.blogs.count_documents({}) == 0:
            from fastapi import Request  # noqa
            await seed()
            logger.info("Auto-seed completed.")
    except Exception as e:
        logger.error(f"Auto-seed failed: {e}")

