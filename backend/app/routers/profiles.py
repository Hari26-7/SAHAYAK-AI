from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.auth_service import auth_service

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("/{user_id}")
def get_profile(user_id: str):
    profile = auth_service.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile

@router.put("/{user_id}")
def update_profile(user_id: str, data: Dict[str, Any]):
    return auth_service.update_profile(user_id, data)

@router.post("/upsert")
def upsert_profile(data: Dict[str, Any]):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id is required")
    return auth_service.update_profile(user_id, data)
