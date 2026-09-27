import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import db
from app.routers import (
    auth, profiles, schemes, stacking, applications,
    documents, credit, roadmap, notifications, face, sheets, supabase_compat
)

app = FastAPI(
    title=settings.APP_NAME,
    description="Python Backend for Smart India Hackathon (SIH) MSME Sahayak AI with Google Sheets Database",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for seamless connection from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded files directory
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount Supabase Compatibility Router for Bolt.host Frontend
app.include_router(supabase_compat.router)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(profiles.router, prefix=settings.API_PREFIX)
app.include_router(schemes.router, prefix=settings.API_PREFIX)
app.include_router(stacking.router, prefix=settings.API_PREFIX)
app.include_router(applications.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(credit.router, prefix=settings.API_PREFIX)
app.include_router(roadmap.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)
app.include_router(face.router, prefix=settings.API_PREFIX)
app.include_router(sheets.router, prefix=settings.API_PREFIX)

from fastapi.responses import FileResponse

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

# Mount React static assets if built
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "google_sheets_connected": db.is_connected,
        "database_mode": "Google Sheets" if db.is_connected else "Local Mirror (Offline Ready)",
        "schemes_loaded": len(db.find_all("schemes"))
    }

# SPA Fallback: Serve React bundle for all other routes
@app.get("/{full_path:path}", response_class=FileResponse)
def serve_spa(full_path: str):
    if os.path.exists(FRONTEND_DIST):
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
