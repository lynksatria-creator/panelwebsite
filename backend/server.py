from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import logging
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Setia Digital Creative API")

api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=1800, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email")})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return {"email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@setiadigital.id")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin Setia",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })


# ---------- Models ----------

class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    whatsapp: str
    wedding_date: str = ""
    package: str = ""
    message: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactInquiryCreate(BaseModel):
    name: str
    whatsapp: str
    wedding_date: str = ""
    package: str = ""
    message: str = ""


class AdminLogin(BaseModel):
    email: str
    password: str


class RsvpCreate(BaseModel):
    name: str
    attends: str
    guests: int = 1


class WishCreate(BaseModel):
    name: str
    message: str


# ---------- Core ----------

@api_router.get("/")
async def root():
    return {"message": "Setia Digital Creative API is running"}


@api_router.post("/contact", response_model=ContactInquiry)
async def create_contact_inquiry(input: ContactInquiryCreate):
    if not input.name.strip() or not input.whatsapp.strip():
        raise HTTPException(status_code=400, detail="Nama dan nomor WhatsApp wajib diisi")
    inquiry = ContactInquiry(**input.model_dump())
    doc = inquiry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_inquiries.insert_one(doc)
    return inquiry


@api_router.get("/contact", response_model=List[ContactInquiry])
async def list_contact_inquiries():
    items = await db.contact_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items


# ---------- Auth ----------

@api_router.post("/auth/login")
async def admin_login(input: AdminLogin, request: Request, response: Response):
    email = input.email.strip().lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    now = datetime.now(timezone.utc)

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = attempt["locked_until"]
        if isinstance(locked_until, str):
            locked_until = datetime.fromisoformat(locked_until)
        if locked_until > now:
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan. Coba lagi dalam 15 menit.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user.get("password_hash", "")):
        failed = (attempt.get("failed", 0) if attempt else 0) + 1
        update = {"failed": failed, "identifier": identifier}
        if failed >= MAX_ATTEMPTS:
            update["locked_until"] = (now + timedelta(minutes=LOCK_MINUTES)).isoformat()
            update["failed"] = 0
        await db.login_attempts.replace_one({"identifier": identifier}, update, upsert=True)
        raise HTTPException(status_code=401, detail="Email atau password salah")

    await db.login_attempts.delete_one({"identifier": identifier})
    access = create_access_token(user["id"], user["email"])
    refresh = create_refresh_token(user["id"], user["email"])
    set_auth_cookies(response, access, refresh)
    return {"user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}}


@api_router.post("/auth/refresh")
async def refresh_session(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email")})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    access = create_access_token(user["id"], user["email"])
    refresh = create_refresh_token(user["id"], user["email"])
    set_auth_cookies(response, access, refresh)
    return {"user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]}}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"ok": True}


# ---------- Admin inquiries ----------

@api_router.get("/admin/inquiries")
async def admin_list_inquiries(admin: dict = Depends(get_current_admin)):
    items = await db.contact_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.delete("/admin/inquiries/{inquiry_id}")
async def admin_delete_inquiry(inquiry_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.contact_inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Permintaan tidak ditemukan")
    return {"ok": True}


# ---------- Demo invitation RSVP & wishes ----------

@api_router.post("/demo/{theme_id}/rsvp")
async def create_rsvp(theme_id: str, input: RsvpCreate):
    if not input.name.strip():
        raise HTTPException(status_code=400, detail="Nama wajib diisi")
    if input.attends not in ("hadir", "tidak"):
        raise HTTPException(status_code=400, detail="Nilai kehadiran tidak valid")
    guests = max(1, min(20, int(input.guests))) if input.attends == "hadir" else 0
    doc = {
        "id": str(uuid.uuid4()),
        "theme_id": theme_id,
        "name": input.name.strip(),
        "attends": input.attends,
        "guests": guests,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.demo_rsvps.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/demo/{theme_id}/rsvp")
async def list_rsvp(theme_id: str):
    items = await db.demo_rsvps.find({"theme_id": theme_id}, {"_id": 0}).sort("created_at", -1).to_list(500)
    hadir = [i for i in items if i["attends"] == "hadir"]
    return {"items": items, "hadir_count": len(hadir), "total_guests": sum(i.get("guests", 0) for i in hadir)}


@api_router.post("/demo/{theme_id}/wishes")
async def create_wish(theme_id: str, input: WishCreate):
    if not input.name.strip() or not input.message.strip():
        raise HTTPException(status_code=400, detail="Nama dan ucapan wajib diisi")
    doc = {
        "id": str(uuid.uuid4()),
        "theme_id": theme_id,
        "name": input.name.strip(),
        "message": input.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.demo_wishes.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/demo/{theme_id}/wishes")
async def list_wishes(theme_id: str):
    items = await db.demo_wishes.find({"theme_id": theme_id}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"items": items}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
