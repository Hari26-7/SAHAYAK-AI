import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
import uvicorn
from app.config import settings

def main():
    print("=" * 60)
    print(f"🚀 Starting {settings.APP_NAME}")
    print(f"📡 API Server: http://localhost:{settings.PORT}")
    print(f"📖 Swagger Docs: http://localhost:{settings.PORT}/docs")
    print(f"📊 Sheets Status: http://localhost:{settings.PORT}/api/sheets/status")
    print("=" * 60)
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)

if __name__ == "__main__":
    main()
