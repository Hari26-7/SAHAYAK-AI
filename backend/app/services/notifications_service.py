import uuid
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database import db

class NotificationsService:
    def get_notifications(self, user_id: str) -> List[Dict[str, Any]]:
        notes = db.find_by("notifications", "user_id", user_id)
        # Sort newest first
        notes.sort(key=lambda n: n.get("created_at", ""), reverse=True)
        return notes

    def create_notification(self, user_id: str, n_type: str, title: str, message: str) -> Dict[str, Any]:
        record = {
            "id": f"notif_{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "type": n_type,
            "title": title,
            "message": message,
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db.insert("notifications", record)
        return record

    def mark_as_read(self, notif_id: str) -> bool:
        return bool(db.update("notifications", "id", notif_id, {"is_read": True}))

    def mark_all_as_read(self, user_id: str) -> bool:
        user_notes = db.find_by("notifications", "user_id", user_id)
        for n in user_notes:
            if not n.get("is_read"):
                db.update("notifications", "id", n["id"], {"is_read": True})
        return True

    def delete_notification(self, notif_id: str) -> bool:
        return db.delete("notifications", "id", notif_id)

notifications_service = NotificationsService()
