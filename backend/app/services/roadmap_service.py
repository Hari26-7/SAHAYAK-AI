import uuid
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database import db
from app.database.seed_data import DEFAULT_ROADMAP_STEPS

class RoadmapService:
    def get_roadmap(self, user_id: str) -> List[Dict[str, Any]]:
        steps = db.find_by("roadmaps", "user_id", user_id)
        if not steps:
            steps = self.create_default_roadmap(user_id)
        # Sort by step number
        steps.sort(key=lambda s: int(s.get("step_number", 0)))
        return steps

    def create_default_roadmap(self, user_id: str) -> List[Dict[str, Any]]:
        # Remove any existing
        existing = db.find_by("roadmaps", "user_id", user_id)
        for e in existing:
            db.delete("roadmaps", "id", e["id"])

        created_steps = []
        for step_data in DEFAULT_ROADMAP_STEPS:
            step = {
                "id": f"step_{uuid.uuid4().hex[:8]}",
                "user_id": user_id,
                "step_number": step_data["step_number"],
                "title": step_data["title"],
                "description": step_data["description"],
                "status": step_data["status"],
                "completed_at": None,
                "action_link": step_data["action_link"]
            }
            db.insert("roadmaps", step)
            created_steps.append(step)

        return created_steps

    def update_step_status(self, step_id: str, status: str) -> Dict[str, Any]:
        completed_at = datetime.now(timezone.utc).isoformat() if status == "completed" else None
        updates = {
            "status": status,
            "completed_at": completed_at
        }
        res = db.update("roadmaps", "id", step_id, updates)
        return res or {}

roadmap_service = RoadmapService()
