import hashlib
import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.database import db

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

class AuthService:
    def register(self, email: str, password: str, full_name: str = "", phone: str = "", business_name: str = "") -> Dict[str, Any]:
        email = email.strip().lower()
        existing_user = db.find_one("users", "email", email)
        if existing_user:
            raise ValueError("User with this email already exists.")

        user_id = f"user_{uuid.uuid4().hex[:10]}"
        now = datetime.now(timezone.utc).isoformat()

        user_record = {
            "id": user_id,
            "email": email,
            "password_hash": hash_password(password),
            "created_at": now
        }
        db.insert("users", user_record)

        # Create linked profile
        profile_record = {
            "id": f"prof_{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "full_name": full_name,
            "phone": phone,
            "business_name": business_name,
            "business_type": "Micro",
            "sector": "Manufacturing",
            "sub_sector": "",
            "investment_amount": 500000.0,
            "annual_turnover": 1500000.0,
            "employee_count": 5,
            "state": "Tamil Nadu",
            "city": "Chennai",
            "pincode": "600001",
            "preferred_language": "en",
            "updated_at": now
        }
        db.insert("profiles", profile_record)

        return {
            "user": {
                "id": user_id,
                "email": email
            },
            "profile": profile_record,
            "token": f"token_{user_id}_{uuid.uuid4().hex[:12]}"
        }

    def login(self, email: str, password: str) -> Dict[str, Any]:
        email = email.strip().lower()
        user = db.find_one("users", "email", email)
        if not user or not verify_password(password, user.get("password_hash", "")):
            raise ValueError("Invalid email or password.")

        profile = db.find_one("profiles", "user_id", user["id"])
        return {
            "user": {
                "id": user["id"],
                "email": user["email"]
            },
            "profile": profile,
            "token": f"token_{user['id']}_{uuid.uuid4().hex[:12]}"
        }

    def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return db.find_one("profiles", "user_id", user_id)

    def update_profile(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        existing = db.find_one("profiles", "user_id", user_id)
        now = datetime.now(timezone.utc).isoformat()
        updates = {**data, "updated_at": now}

        if existing:
            db.update("profiles", "user_id", user_id, updates)
            return {**existing, **updates}
        else:
            profile_record = {
                "id": f"prof_{uuid.uuid4().hex[:8]}",
                "user_id": user_id,
                **updates
            }
            db.insert("profiles", profile_record)
            return profile_record

auth_service = AuthService()
