from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.applications_service import applications_service

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("/user/{user_id}")
def get_user_applications(user_id: str):
    return applications_service.get_applications(user_id)

@router.post("")
def create_application(payload: Dict[str, Any]):
    user_id = payload.get("user_id")
    scheme_id = payload.get("scheme_id")
    scheme_name = payload.get("scheme_name")
    
    if not user_id or not scheme_id or not scheme_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id, scheme_id, and scheme_name are required."
        )
    return applications_service.create_application(user_id, scheme_id, scheme_name, payload)

@router.delete("/{application_id}")
def delete_application(application_id: str):
    deleted = applications_service.delete_application(application_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return {"message": "Application withdrawn successfully"}
