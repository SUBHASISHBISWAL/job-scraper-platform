from fastapi import APIRouter, Query
from typing import List, Dict, Optional
from app.scraper.scraper_engine import scrape_jobs_from_web

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.get("/scrape", response_model=List[dict])
def scrape_jobs(
    keyword: Optional[str] = Query(None, description="Job title keyword"),
    location: Optional[str] = Query(None, description="Location to search in")
) -> List[dict]:
    kw = keyword or "Developer"
    loc = location or "India"
    jobs = scrape_jobs_from_web(kw, loc)
    return jobs