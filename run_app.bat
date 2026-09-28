@echo off
echo ========================================================
echo   Starting MSME Sahayak AI (SIH 2026 Model)
echo   Unified Production Server: React Frontend + Python Backend + Google Sheets
echo ========================================================
echo.
echo Building latest frontend...
cd /d "%~dp0frontend"
call npm run build

echo.
echo Starting Unified App on http://localhost:8000 ...
cd /d "%~dp0backend"
set PYTHONIOENCODING=utf-8
start http://localhost:8000
python run_backend.py
pause
