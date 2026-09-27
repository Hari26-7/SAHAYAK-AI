# MSME Sahayak AI - Python Backend with Google Sheets Database

An enterprise-grade **FastAPI Python Backend** engineered for the **Smart India Hackathon (SIH) MSME Sahayak AI** platform, featuring **Google Sheets as a persistent cloud database**, intelligent scheme matching, multi-scheme policy stacking validation, and document/biometric verification.

---

## 🏛️ Architecture Overview

```
                          ┌─────────────────────────────┐
                          │   React / Vite / Next.js    │
                          │ (14 SIH TSX UI Components)  │
                          └──────────────┬──────────────┘
                                         │ REST APIs / JSON
                                         ▼
                          ┌─────────────────────────────┐
                          │       FastAPI Backend       │
                          │   (Uvicorn ASGI @ :8000)    │
                          └──────────────┬──────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│ Schemes & AI    │             │ Scheme Stacking │             │ Document / Face │
│ Matching Engine │             │ Conflict Rules  │             │ Biometrics      │
└─────────────────┘             └─────────────────┘             └─────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │     Google Sheets Database Engine     │
                     │  (gspread + OAuth2 Service Account)   │
                     └───────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    ┌───────────────────────────┐                   ┌───────────────────────────┐
    │    Google Sheets Cloud    │                   │   High-Performance Local  │
    │  (Auto-created Worksheets)│                   │   Persistent Mirror Cache │
    └───────────────────────────┘                   └───────────────────────────┘
```

---

## 🚀 Key Capabilities

1. **Google Sheets as a Database**:
   - Stores all application entities in dedicated Google Sheets tabs (`users`, `profiles`, `schemes`, `applications`, `documents`, `credit_profiles`, `roadmaps`, `notifications`, `face_verifications`, `stacking_checks`).
   - Automatically initializes any missing tabs and header rows on connection.
   - **Zero-Friction Offline Fallback**: If Google credentials are not yet supplied, the system immediately runs in local mirror mode (`local_sheets_db.json`) so development and demos work without blocking.

2. **AI Scheme Matching**:
   - Matches MSME business profiles (Sector, Turnover, Investment, Enterprise Class, Artisan status) against official GoI schemes (PMEGP, Mudra, CGTMSE, PM Vishwakarma, ZED, Stand-Up India, SFURTI).
   - Generates exact percentage match scores and explanations.

3. **Multi-Scheme Stacking Intelligence**:
   - Evaluates whether multiple government subsidies can be legally combined.
   - Flags double-subsidy conflicts (e.g. simultaneous PMEGP + Mudra margin money) and recommends optimal synergy (e.g. Mudra + CGTMSE credit guarantee + ZED green certification).

4. **MSME Credit Health Scoring**:
   - Financial appraisal, debt-to-income checks, GST & ITR compliance bonuses, and CIBIL rating tiers (`Excellent`, `Good`, `Fair`, `Poor`).

5. **Milestone Roadmap Tracker**:
   - 5-stage automated roadmap guiding entrepreneurs from Udyam registration to final loan sanction.

---

## 📋 Google Sheets Setup Guide

Follow these steps to connect your live Google Sheet:

### 1. Create a Google Cloud Service Account
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `MSME-Sahayak-SIH`).
3. Enable the **Google Sheets API** and **Google Drive API** in *APIs & Services > Library*.
4. Navigate to *APIs & Services > Credentials > Create Credentials > Service Account*.
5. Go to the created service account > *Keys* tab > *Add Key* > *Create new key* > Select **JSON**.
6. Save this JSON file as `credentials.json` in `backend/credentials.json`.

### 2. Share Your Google Sheet with the Service Account
1. Create a new Google Spreadsheet at [sheets.google.com](https://sheets.google.com).
2. Note the service account email (e.g., `msme-db@msme-sahayak.iam.gserviceaccount.com`).
3. Click the green **Share** button on your Google Sheet, paste the service account email, and grant **Editor** access.
4. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/<GOOGLE_SHEET_ID>/edit`

### 3. Configure `.env`
Create a `.env` file in the `backend/` directory:
```env
GOOGLE_SERVICE_ACCOUNT_FILE=credentials.json
GOOGLE_SHEET_ID=your_spreadsheet_id_here
PORT=8000
DEBUG=True
```

*(Note: If you leave `GOOGLE_SHEET_ID` empty, the backend runs seamlessly on its local sheets database mirror).*

---

## 🛠️ Quickstart & Running

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Backend
```bash
python run_backend.py
```
Or with Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Database Status**: [http://localhost:8000/api/sheets/status](http://localhost:8000/api/sheets/status)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🧪 Running Automated Tests

Run the test suite verifying all 8 core services and Google Sheets status:
```bash
python test_api.py
```

---

## 🔌 Frontend Wiring (`client_adapter/`)

The 14 UI component files in `e:/sih model/` (`Dashboard.tsx`, `Applications.tsx`, `Schemes.tsx`, `SchemeMatching.tsx`, `SchemeStacking.tsx`, `CreditScore.tsx`, `EligibilityRoadmap.tsx`, `Documents.tsx`, `Notifications.tsx`, `FaceVerification.tsx`, `Profile.tsx`, `Login.tsx`, `Register.tsx`) connect directly via:
- `client_adapter/services.ts` (drop-in replacement for `../lib/services`)
- `client_adapter/supabase.ts` (drop-in auth adapter for `../lib/supabase`)
