from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil

from app.database import get_db
from app.models.user import User
from app.schemas.user import ProfileUpdate, ProfileResponse

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

UPLOAD_DIR = os.path.join("app", "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user

@router.put("/{user_id}")
def update_profile(
    user_id: int,
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db)
) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = profile_data.name
    user.phone = profile_data.phone
    user.location = profile_data.location
    user.skills = profile_data.skills
    
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully"}

@router.post("/{user_id}/image")
def upload_image(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    ext = os.path.splitext(file.filename or "")[1]
    filename = f"user_{user_id}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    user.profile_image = f"/static/uploads/{filename}"
    db.commit()
    return {"message": "Image uploaded successfully", "path": user.profile_image}

@router.delete("/{user_id}/image")
def delete_image(user_id: int, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.profile_image:
        filename = os.path.basename(user.profile_image)
        filepath = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            
    user.profile_image = None
    db.commit()
    return {"message": "Image deleted successfully"}