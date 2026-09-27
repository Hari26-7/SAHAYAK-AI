from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.stacking_service import stacking_service

router = APIRouter(prefix="/stacking", tags=["Scheme Stacking"])

@router.get("/{user_id}")
def get_user_stacking_history(user_id: str):
    return stacking_service.get_stacking_checks(user_id)

@router.post("/check")
def check_stacking(payload: Dict[str, Any]):
    user_id = payload.get("user_id", "anonymous")
    schemes = payload.get("schemes", [])
    if len(schemes) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least 2 schemes are required to check stacking compatibility."
        )
    return stacking_service.check_stacking(user_id, schemes)
