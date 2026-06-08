from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.application import Application
from app.models.user import User
from app.schemas.application import ApplyJob, ApplicationResponse
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

@router.post("/apply", response_model=ApplicationResponse)
def apply_job(
    job: ApplyJob,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Application:
    new_application = Application(
        user_id=current_user.id,
        job_title=job.job_title,
        company=job.company,
        platform=job.platform,
        job_link=job.job_link,
        status=job.status or "Applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

@router.get("/", response_model=List[ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    search: Optional[str] = Query(None, description="Search by title or company"),
    status: Optional[str] = Query(None, description="Filter by application status"),
    platform: Optional[str] = Query(None, description="Filter by job platform"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
) -> List[Application]:
    query = db.query(Application).filter(Application.user_id == current_user.id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Application.job_title.ilike(search_filter)) | 
            (Application.company.ilike(search_filter))
        )
        
    if status:
        query = query.filter(Application.status == status)
        
    if platform:
        query = query.filter(Application.platform == platform)
        
    return query.order_by(Application.applied_date.desc()).offset(offset).limit(limit).all()