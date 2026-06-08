from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.ai import extract_text_from_pdf, parse_resume_skills, calculate_match_score, rank_jobs_by_resume
from app.scraper.scraper_engine import scrape_jobs_from_web

router = APIRouter(
    prefix="/ai",
    tags=["AI Features"]
)

@router.post("/parse-resume")
async def parse_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")
        
    pdf_bytes = await file.read()
    text = extract_text_from_pdf(pdf_bytes)
    skills = parse_resume_skills(text)
    
    # Save parsed skills to user profile
    current_user.skills = ", ".join(skills)
    db.commit()
    
    return {
        "text": text,
        "skills": skills,
        "message": "Resume parsed and skills updated successfully"
    }

@router.post("/recommend")
def recommend_jobs(
    payload: dict,
    current_user: User = Depends(get_current_user)
) -> List[dict]:
    # Payload accepts search keyword and location to fetch jobs first
    keyword = payload.get("keyword", "Developer")
    location = payload.get("location", "India")
    resume_text = payload.get("resume_text", current_user.skills or "")
    
    # Scrape jobs
    jobs = scrape_jobs_from_web(keyword, location)
    
    # Rank jobs
    ranked = rank_jobs_by_resume(resume_text, jobs)
    return ranked

@router.post("/chat")
def chat_ai(
    payload: dict,
    current_user: User = Depends(get_current_user)
) -> dict:
    from app.services.ai import chat_with_advisor
    message = payload.get("message", "")
    skills = current_user.skills or ""
    reply = chat_with_advisor(message, skills)
    return {"reply": reply}

