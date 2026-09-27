from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.roadmap_service import roadmap_service

router = APIRouter(prefix="/roadmap", tags=["Eligibility Roadmap"])

@router.get("/{user_id}")
def get_roadmap(user_id: str):
    return roadmap_service.get_roadmap(user_id)

@router.post("/default/{user_id}")
def create_default_roadmap(user_id: str):
    return roadmap_service.create_default_roadmap(user_id)

@router.put("/steps/{step_id}")
def update_step_status(step_id: str, payload: Dict[str, Any]):
    status_val = payload.get("status", "completed")
    updated = roadmap_service.update_step_status(step_id, status_val)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap step not found")
    return updated
