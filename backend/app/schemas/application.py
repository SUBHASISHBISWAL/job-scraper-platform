from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApplyJob(BaseModel):
    job_title: str
    company: str
    platform: str
    job_link: str
    status: Optional[str] = "Applied"

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_title: str
    company: str
    platform: str
    job_link: str
    status: str
    applied_date: datetime

    class Config:
        from_attributes = True