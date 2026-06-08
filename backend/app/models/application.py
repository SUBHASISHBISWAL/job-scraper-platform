from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    job_link = Column(String, nullable=False)

    status = Column(String, default="Applied")

    applied_date = Column(
        DateTime,
        default=datetime.utcnow
    )