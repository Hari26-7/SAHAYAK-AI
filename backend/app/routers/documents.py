from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from typing import Dict, Any, Optional
from app.services.documents_service import documents_service

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/user/{user_id}")
def get_user_documents(user_id: str):
    return documents_service.get_documents(user_id)

@router.post("/upload")
async def upload_document(
    user_id: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        return await documents_service.upload_document(user_id, file, document_type)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{document_id}")
def delete_document(document_id: str):
    deleted = documents_service.delete_document(document_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {"message": "Document deleted successfully"}

@router.put("/{document_id}/status")
def update_status(document_id: str, payload: Dict[str, Any]):
    new_status = payload.get("status", "pending")
    remarks = payload.get("remarks", "")
    updated = documents_service.update_verification_status(document_id, new_status, remarks)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return updated
