from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.credit_service import credit_service

router = APIRouter(prefix="/credit", tags=["Credit Score"])

@router.get("/{user_id}")
def get_credit_profile(user_id: str):
    profile = credit_service.get_credit_profile(user_id)
    return profile or {}

@router.post("/save")
def save_credit_profile(payload: Dict[str, Any]):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id is required")
    return credit_service.save_credit_profile(payload)

@router.get("/rating/{score}")
def get_rating(score: int):
    return {"score": score, "rating": credit_service.calculate_rating(score)}
