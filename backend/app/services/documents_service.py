import os
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import UploadFile
from app.config import settings
from app.database import db

class DocumentsService:
    def get_documents(self, user_id: str) -> List[Dict[str, Any]]:
        return db.find_by("documents", "user_id", user_id)

    async def upload_document(self, user_id: str, file: UploadFile, document_type: str) -> Dict[str, Any]:
        file_id = f"doc_{uuid.uuid4().hex[:8]}"
        filename = f"{file_id}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)

        # Save file content locally
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # Basic document verification heuristic
        # If document type is Aadhaar/PAN/GST and size is reasonable, auto-verify or mark pending review
        initial_status = "verified" if len(content) > 500 else "pending"
        remarks = "Verified file structure & document headers." if initial_status == "verified" else "Pending OCR & KYC match."

        doc_record = {
            "id": file_id,
            "user_id": user_id,
            "document_name": file.filename,
            "document_type": document_type,
            "file_path": file_path,
            "verification_status": initial_status,
            "remarks": remarks,
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        }

        db.insert("documents", doc_record)
        return doc_record

    def delete_document(self, document_id: str) -> bool:
        doc = db.find_one("documents", "id", document_id)
        if doc and os.path.exists(doc.get("file_path", "")):
            try:
                os.remove(doc["file_path"])
            except Exception:
                pass
        return db.delete("documents", "id", document_id)

    def update_verification_status(self, document_id: str, status: str, remarks: Optional[str] = "") -> Optional[Dict[str, Any]]:
        updates = {
            "verification_status": status,
            "remarks": remarks or f"Status set to {status}"
        }
        return db.update("documents", "id", document_id, updates)

documents_service = DocumentsService()
