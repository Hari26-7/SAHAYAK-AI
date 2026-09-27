from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, Optional
from app.services.schemes_service import schemes_service

router = APIRouter(prefix="/schemes", tags=["Schemes"])

@router.get("")
def get_all_schemes():
    return schemes_service.get_all_schemes()

@router.get("/{scheme_id}")
def get_scheme(scheme_id: str):
    scheme = schemes_service.get_scheme(scheme_id)
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    return scheme

@router.post("/match")
def match_schemes(payload: Dict[str, Any]):
    profile = payload.get("profile", {})
    return schemes_service.match_schemes(profile)
