from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.services.notifications_service import notifications_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/user/{user_id}")
def get_user_notifications(user_id: str):
    return notifications_service.get_notifications(user_id)

@router.post("")
def create_notification(payload: Dict[str, Any]):
    user_id = payload.get("user_id")
    n_type = payload.get("type", "info")
    title = payload.get("title", "Notification")
    message = payload.get("message", "")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="user_id is required")
    return notifications_service.create_notification(user_id, n_type, title, message)

@router.put("/{notif_id}/read")
def mark_read(notif_id: str):
    return {"success": notifications_service.mark_as_read(notif_id)}

@router.put("/user/{user_id}/read-all")
def mark_all_read(user_id: str):
    return {"success": notifications_service.mark_all_as_read(user_id)}

@router.delete("/{notif_id}")
def delete_notification(notif_id: str):
    return {"success": notifications_service.delete_notification(notif_id)}
