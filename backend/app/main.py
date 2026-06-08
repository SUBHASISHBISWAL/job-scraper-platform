from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base

from app.models.user import User
from app.models.job import Job
from app.models.application import Application

from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.applications import router as applications_router
from app.routes.profile import router as profile_router
from app.routes.ai import router as ai_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HireKarma Job Scraper API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static folder
static_dir = os.path.join("app", "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(profile_router)
app.include_router(ai_router)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "HireKarma FastAPI Backend Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }