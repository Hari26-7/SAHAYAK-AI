from fastapi import APIRouter
from app.database import db

router = APIRouter(prefix="/sheets", tags=["Google Sheets Database Admin"])

@router.get("/status")
def get_sheets_status():
    return db.get_status()

@router.post("/sync")
def sync_sheets():
    db.sync_all_from_google_sheets()
    return {"message": "Sync completed successfully.", "status": db.get_status()}

@router.post("/test-connection")
def test_connection():
    db._connect_google_sheets()
    return db.get_status()
