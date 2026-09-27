import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "MSME Sahayak AI Backend"
    API_PREFIX: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "sih-msme-sahayak-super-secret-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    # Google Sheets Integration
    # Path to service_account.json OR raw JSON string in env
    GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", str(BASE_DIR / "credentials.json"))
    GOOGLE_SERVICE_ACCOUNT_JSON: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")
    GOOGLE_SHEET_ID: str = os.getenv("GOOGLE_SHEET_ID", "1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY")
    GOOGLE_SHEET_URL: str = os.getenv("GOOGLE_SHEET_URL", "https://docs.google.com/spreadsheets/d/1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY/edit?usp=sharing")
    GOOGLE_SHEET_NAME: str = os.getenv("GOOGLE_SHEET_NAME", "MSME_Sahayak_Database")
    GOOGLE_APPS_SCRIPT_URL: str = os.getenv("GOOGLE_APPS_SCRIPT_URL", "")
    
    # Local Storage & Fallback
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    LOCAL_DB_FILE: str = str(BASE_DIR / "local_sheets_db.json")
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        extra = "allow"

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
