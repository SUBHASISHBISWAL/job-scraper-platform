from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import validates
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    skills = Column(String, nullable=True)

    profile_image = Column(String, nullable=True)
    
    # @validates("email")
    # def validate_email(self, key, email):
    #     pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    #     if not re.fullmatch(pattern, email ):
    #         raise ValueError("Invalid email address.")
    #     return email.lower()