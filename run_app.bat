@echo off
echo ========================================================
echo   Starting MSME Sahayak AI (SIH 2026 Model)
echo   Unified Production Server: React Frontend + Python Backend + Google Sheets
echo ========================================================
echo.
echo Starting Unified App on http://localhost:8000 ...
cd /d "e:\sih model\backend"
python run_backend.py
pause
