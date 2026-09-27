from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.face_service import face_verification_service

router = APIRouter(prefix="/face", tags=["Face Biometrics"])

@router.get("/verifications/{user_id}")
def get_user_verifications(user_id: str):
    return face_verification_service.get_verifications(user_id)

@router.post("/verify")
def verify_face(payload: Dict[str, Any]):
    user_id = payload.get("user_id")
    image_data = payload.get("image_data", "")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id is required")
    return face_verification_service.verify_face(user_id, image_data)
