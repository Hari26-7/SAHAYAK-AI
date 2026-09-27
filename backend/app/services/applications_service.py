import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from app.database import db

class ApplicationsService:
    def get_applications(self, user_id: str) -> List[Dict[str, Any]]:
        apps = db.find_by("applications", "user_id", user_id)
        apps.sort(key=lambda a: a.get("applied_date", ""), reverse=True)
        return apps

    def create_application(self, user_id: str, scheme_id: str, scheme_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        ref_code = f"MSME-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
        app_record = {
            "id": f"app_{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "scheme_id": scheme_id,
            "scheme_name": scheme_name,
            "application_reference": ref_code,
            "status": "Submitted",
            "applied_date": datetime.now(timezone.utc).isoformat(),
            "applied_via": data.get("applied_via", "MSME Sahayak AI"),
            "business_name": data.get("business_name", ""),
            "notes": data.get("notes", "Digital application queued for ministry verification.")
        }
        db.insert("applications", app_record)
        return app_record

    def delete_application(self, application_id: str) -> bool:
        return db.delete("applications", "id", application_id)

applications_service = ApplicationsService()
