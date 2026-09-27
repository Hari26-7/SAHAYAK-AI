import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.database import db

class CreditService:
    def calculate_rating(self, score: int) -> str:
        if score >= 750:
            return "Excellent"
        elif score >= 650:
            return "Good"
        elif score >= 550:
            return "Fair"
        else:
            return "Poor"

    def get_credit_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return db.find_one("credit_profiles", "user_id", user_id)

    def save_credit_profile(self, data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = data.get("user_id")
        score = int(data.get("credit_score", 650))
        rating = self.calculate_rating(score)

        existing = self.get_credit_profile(user_id)
        now = datetime.now(timezone.utc).isoformat()

        record = {
            "user_id": user_id,
            "credit_score": score,
            "outstanding_loans": float(data.get("outstanding_loans", 0.0)),
            "loan_count": int(data.get("loan_count", 0)),
            "annual_income": float(data.get("annual_income", 0.0)),
            "existing_emis": float(data.get("existing_emis", 0.0)),
            "banking_partner": data.get("banking_partner", ""),
            "gst_registered": bool(data.get("gst_registered", False)),
            "itr_filed": bool(data.get("itr_filed", False)),
            "credit_rating": rating,
            "updated_at": now
        }

        if existing:
            record["id"] = existing["id"]
            db.update("credit_profiles", "user_id", user_id, record)
        else:
            record["id"] = f"credit_{uuid.uuid4().hex[:8]}"
            db.insert("credit_profiles", record)

        return record

credit_service = CreditService()
