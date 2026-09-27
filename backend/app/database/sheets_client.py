import os
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
import gspread
from google.oauth2.service_account import Credentials

from app.config import settings
from app.database.seed_data import INITIAL_SCHEMES

logger = logging.getLogger("GoogleSheetsDB")
logging.basicConfig(level=logging.INFO)

# Define standardized schemas for Google Sheets tabs
TABLE_SCHEMAS: Dict[str, List[str]] = {
    "users": ["id", "email", "password_hash", "created_at"],
    "profiles": [
        "id", "user_id", "full_name", "phone", "business_name", "business_type",
        "sector", "sub_sector", "investment_amount", "annual_turnover",
        "employee_count", "state", "city", "pincode", "preferred_language", "updated_at"
    ],
    "schemes": [
        "id", "name", "description", "category", "ministry", "max_benefit_amount",
        "subsidy_percent", "eligibility_criteria", "required_documents",
        "application_link", "is_active"
    ],
    "applications": [
        "id", "user_id", "scheme_id", "scheme_name", "application_reference",
        "status", "applied_date", "applied_via", "business_name", "notes"
    ],
    "documents": [
        "id", "user_id", "document_name", "document_type", "file_path",
        "verification_status", "remarks", "uploaded_at"
    ],
    "credit_profiles": [
        "id", "user_id", "credit_score", "outstanding_loans", "loan_count",
        "annual_income", "existing_emis", "banking_partner", "gst_registered",
        "itr_filed", "credit_rating", "updated_at"
    ],
    "roadmaps": [
        "id", "user_id", "step_number", "title", "description",
        "status", "completed_at", "action_link"
    ],
    "notifications": [
        "id", "user_id", "type", "title", "message", "is_read", "created_at"
    ],
    "face_verifications": [
        "id", "user_id", "status", "confidence_score", "verified_at", "remarks"
    ],
    "stacking_checks": [
        "id", "user_id", "is_stackable", "status", "total_potential_benefit",
        "selected_schemes", "conflict_notes", "recommendations", "created_at"
    ]
}

class GoogleSheetsDatabase:
    """
    Senior-Architected Google Sheets Database Engine
    - Direct Google Sheets API v4 (via gspread & service account)
    - Auto-generates missing worksheets and header columns
    - In-memory synchronization & caching layer
    - Automatic offline fallback to local JSON database when Google credentials are not set
    """
    def __init__(self):
        self.is_connected = False
        self.spreadsheet = None
        self.client = None
        self.cached_tables: Dict[str, List[Dict[str, Any]]] = {}
        self.last_sync_time: Optional[str] = None
        self.connection_status_msg = "Initialized"
        
        # Load local storage first as cache/fallback
        self._load_local_db()
        
        # Attempt Google Sheets connection
        self._connect_google_sheets()

    def _load_local_db(self):
        """Loads or creates local persistent JSON cache"""
        if os.path.exists(settings.LOCAL_DB_FILE):
            try:
                with open(settings.LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                    self.cached_tables = json.load(f)
                    logger.info(f"Loaded cached tables from {settings.LOCAL_DB_FILE}")
            except Exception as e:
                logger.warning(f"Could not load local DB file: {e}. Starting fresh.")
                self.cached_tables = {}
        
        # Ensure all tables exist in cache
        for table in TABLE_SCHEMAS.keys():
            if table not in self.cached_tables:
                self.cached_tables[table] = []
                
        # Seed initial schemes if empty
        if not self.cached_tables.get("schemes"):
            self.cached_tables["schemes"] = [s.copy() for s in INITIAL_SCHEMES]
            self._save_local_db()

    def _save_local_db(self):
        """Persists current in-memory data to local JSON file"""
        try:
            with open(settings.LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self.cached_tables, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Failed to persist local DB: {e}")

    def _connect_google_sheets(self):
        """Attempts connection to Google Sheets API using Apps Script or Service Account"""
        self.using_apps_script = False
        
        # 1. Check if Google Apps Script Webhook is configured
        if settings.GOOGLE_APPS_SCRIPT_URL:
            try:
                import requests
                res = requests.get(settings.GOOGLE_APPS_SCRIPT_URL, timeout=8)
                if res.status_code == 200:
                    self.is_connected = True
                    self.using_apps_script = True
                    self.connection_status_msg = f"Connected to Live Google Sheet via Apps Script Bridge (ID: {settings.GOOGLE_SHEET_ID})"
                    logger.info(f"[GoogleSheetsDB] {self.connection_status_msg}")
                    self.sync_all_from_google_sheets()
                    return
            except Exception as e:
                logger.warning(f"Could not reach GOOGLE_APPS_SCRIPT_URL: {e}. Falling back to Service Account check.")

        # 2. Try Google Cloud Service Account
        scopes = [
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        
        credentials = None
        
        if settings.GOOGLE_SERVICE_ACCOUNT_JSON:
            try:
                info = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_JSON)
                credentials = Credentials.from_service_account_info(info, scopes=scopes)
                logger.info("Using Google Service Account credentials from ENV variable.")
            except Exception as e:
                logger.error(f"Invalid GOOGLE_SERVICE_ACCOUNT_JSON: {e}")
                
        elif os.path.exists(settings.GOOGLE_SERVICE_ACCOUNT_FILE):
            try:
                credentials = Credentials.from_service_account_file(
                    settings.GOOGLE_SERVICE_ACCOUNT_FILE, scopes=scopes
                )
                logger.info(f"Using Google Service Account credentials from file: {settings.GOOGLE_SERVICE_ACCOUNT_FILE}")
            except Exception as e:
                logger.error(f"Failed to read GOOGLE_SERVICE_ACCOUNT_FILE: {e}")

        if not credentials:
            self.is_connected = False
            self.connection_status_msg = f"Configured Sheet ID: {settings.GOOGLE_SHEET_ID}. Running on Local Sheets Database Mirror. To write live, add credentials.json or deploy Apps Script bridge."
            logger.info(f"[GoogleSheetsDB] {self.connection_status_msg}")
            return

        try:
            self.client = gspread.authorize(credentials)
            
            # Open spreadsheet by ID or Name
            if settings.GOOGLE_SHEET_ID:
                self.spreadsheet = self.client.open_by_key(settings.GOOGLE_SHEET_ID)
                logger.info(f"Opened Google Sheet by ID: {settings.GOOGLE_SHEET_ID}")
            else:
                try:
                    self.spreadsheet = self.client.open(settings.GOOGLE_SHEET_NAME)
                    logger.info(f"Opened Google Sheet by title: '{settings.GOOGLE_SHEET_NAME}'")
                except gspread.SpreadsheetNotFound:
                    logger.info(f"Creating new Google Spreadsheet: '{settings.GOOGLE_SHEET_NAME}'")
                    self.spreadsheet = self.client.create(settings.GOOGLE_SHEET_NAME)
                    logger.info(f"Created Google Spreadsheet with ID: {self.spreadsheet.id}")
            
            self.is_connected = True
            self.connection_status_msg = f"Connected to Google Sheet: {self.spreadsheet.title} (ID: {self.spreadsheet.id})"
            self._initialize_worksheets()
            self.sync_all_from_google_sheets()
        except Exception as e:
            self.is_connected = False
            self.connection_status_msg = f"Failed to connect to Google Sheets: {str(e)}"
            logger.error(f"[GoogleSheetsDB Error] {self.connection_status_msg}")

    def _initialize_worksheets(self):
        """Ensures all required tabs exist in the Google Spreadsheet with headers"""
        if not self.is_connected or not self.spreadsheet:
            return
            
        existing_worksheets = {ws.title: ws for ws in self.spreadsheet.worksheets()}
        
        for table_name, headers in TABLE_SCHEMAS.items():
            if table_name not in existing_worksheets:
                try:
                    logger.info(f"Creating worksheet tab '{table_name}' in Google Sheets...")
                    ws = self.spreadsheet.add_worksheet(title=table_name, rows=200, cols=len(headers) + 2)
                    ws.append_row(headers)
                    existing_worksheets[table_name] = ws
                    
                    # If schemes tab was just created, seed it
                    if table_name == "schemes" and self.cached_tables.get("schemes"):
                        rows_to_insert = []
                        for s in self.cached_tables["schemes"]:
                            rows_to_insert.append(self._format_row_for_sheet(table_name, s))
                        ws.append_rows(rows_to_insert)
                except Exception as e:
                    logger.error(f"Error initializing worksheet {table_name}: {e}")

    def _format_row_for_sheet(self, table_name: str, record: Dict[str, Any]) -> List[Any]:
        """Converts dictionary to ordered values matching sheet headers"""
        headers = TABLE_SCHEMAS[table_name]
        row = []
        for h in headers:
            val = record.get(h, "")
            if isinstance(val, (dict, list)):
                row.append(json.dumps(val))
            elif isinstance(val, bool):
                row.append("TRUE" if val else "FALSE")
            elif val is None:
                row.append("")
            else:
                row.append(str(val))
        return row

    def _parse_row_from_sheet(self, table_name: str, headers: List[str], row_values: List[str]) -> Dict[str, Any]:
        """Converts raw sheet row list back into typed dictionary"""
        record: Dict[str, Any] = {}
        for i, h in enumerate(headers):
            val = row_values[i] if i < len(row_values) else ""
            if val.startswith("{") or val.startswith("["):
                try:
                    record[h] = json.loads(val)
                    continue
                except Exception:
                    pass
            if val.upper() == "TRUE":
                record[h] = True
            elif val.upper() == "FALSE":
                record[h] = False
            elif h in ["investment_amount", "annual_turnover", "existing_emis", "outstanding_loans", "max_benefit_amount", "subsidy_percent", "confidence_score", "total_potential_benefit"]:
                try:
                    record[h] = float(val) if val else 0.0
                except ValueError:
                    record[h] = 0.0
            elif h in ["employee_count", "credit_score", "loan_count", "step_number"]:
                try:
                    record[h] = int(val) if val else 0
                except ValueError:
                    record[h] = 0
            else:
                record[h] = val
        return record

    def sync_all_from_google_sheets(self):
        """Reads all worksheets from Google Sheets into local cache"""
        if not self.is_connected:
            return

        # 1. Using Google Apps Script Webhook
        if getattr(self, "using_apps_script", False) and settings.GOOGLE_APPS_SCRIPT_URL:
            try:
                import requests
                logger.info("Syncing tables via Google Apps Script Bridge...")
                for table_name in TABLE_SCHEMAS.keys():
                    try:
                        res = requests.get(f"{settings.GOOGLE_APPS_SCRIPT_URL}?table={table_name}", timeout=8)
                        if res.status_code == 200:
                            data = res.json()
                            if isinstance(data, list) and data:
                                self.cached_tables[table_name] = data
                    except Exception as ex:
                        logger.warning(f"Apps Script sync error for {table_name}: {ex}")
                self.last_sync_time = datetime.now(timezone.utc).isoformat()
                self._save_local_db()
                logger.info("Google Apps Script sync completed.")
            except Exception as e:
                logger.error(f"Error during Apps Script sync: {e}")
            return

        # 2. Using gspread Service Account
        if not self.spreadsheet:
            return
        try:
            logger.info("Syncing all tables from Google Sheets via gspread...")
            for table_name in TABLE_SCHEMAS.keys():
                try:
                    ws = self.spreadsheet.worksheet(table_name)
                    rows = ws.get_all_values()
                    if len(rows) > 1:
                        headers = rows[0]
                        records = []
                        for r in rows[1:]:
                            if any(r):  # Non-empty row
                                records.append(self._parse_row_from_sheet(table_name, headers, r))
                        self.cached_tables[table_name] = records
                except gspread.WorksheetNotFound:
                    pass
                except Exception as ex:
                    logger.warning(f"Could not sync worksheet {table_name}: {ex}")
            self.last_sync_time = datetime.now(timezone.utc).isoformat()
            self._save_local_db()
            logger.info("Google Sheets sync completed successfully.")
        except Exception as e:
            logger.error(f"Error during Google Sheets full sync: {e}")

    # ================= CRUD REPOSITORY OPERATIONS =================

    def find_all(self, table_name: str) -> List[Dict[str, Any]]:
        """Returns all records from table"""
        return list(self.cached_tables.get(table_name, []))

    def find_by(self, table_name: str, key: str, value: Any) -> List[Dict[str, Any]]:
        """Filters table by key == value"""
        records = self.cached_tables.get(table_name, [])
        return [r for r in records if str(r.get(key, "")) == str(value)]

    def find_one(self, table_name: str, key: str, value: Any) -> Optional[Dict[str, Any]]:
        """Returns first matching record or None"""
        records = self.find_by(table_name, key, value)
        return records[0] if records else None

    def insert(self, table_name: str, record: Dict[str, Any]) -> Dict[str, Any]:
        """Inserts record into table (cache + Google Sheet)"""
        if table_name not in self.cached_tables:
            self.cached_tables[table_name] = []
            
        self.cached_tables[table_name].append(record)
        self._save_local_db()

        # Write to Google Sheet via Apps Script
        if getattr(self, "using_apps_script", False) and settings.GOOGLE_APPS_SCRIPT_URL:
            try:
                import requests
                headers = TABLE_SCHEMAS.get(table_name, [])
                row_vals = self._format_row_for_sheet(table_name, record)
                requests.post(settings.GOOGLE_APPS_SCRIPT_URL, json={
                    "action": "insert",
                    "table": table_name,
                    "headers": headers,
                    "row": row_vals
                }, timeout=5)
            except Exception as e:
                logger.error(f"Apps Script append failed for {table_name}: {e}")

        # Write to Google Sheet via gspread
        elif self.is_connected and self.spreadsheet:
            try:
                ws = self.spreadsheet.worksheet(table_name)
                row = self._format_row_for_sheet(table_name, record)
                ws.append_row(row)
            except Exception as e:
                logger.error(f"Failed to append row to Google Sheet {table_name}: {e}")

        return record

    def update(self, table_name: str, key: str, value: Any, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates record identified by key == value"""
        records = self.cached_tables.get(table_name, [])
        target_idx = -1
        for idx, r in enumerate(records):
            if str(r.get(key, "")) == str(value):
                target_idx = idx
                break
                
        if target_idx == -1:
            return None

        # Update cache
        records[target_idx].update(updates)
        self._save_local_db()
        updated_record = records[target_idx]

        # Update Google Sheet via Apps Script
        if getattr(self, "using_apps_script", False) and settings.GOOGLE_APPS_SCRIPT_URL:
            try:
                import requests
                headers = TABLE_SCHEMAS.get(table_name, [])
                row_vals = self._format_row_for_sheet(table_name, updated_record)
                k_idx = headers.index(key) if key in headers else 0
                requests.post(settings.GOOGLE_APPS_SCRIPT_URL, json={
                    "action": "update",
                    "table": table_name,
                    "headers": headers,
                    "key_index": k_idx,
                    "key_value": str(value),
                    "row": row_vals
                }, timeout=5)
            except Exception as e:
                logger.error(f"Apps Script update failed for {table_name}: {e}")

        # Update Google Sheet via gspread
        elif self.is_connected and self.spreadsheet:
            try:
                ws = self.spreadsheet.worksheet(table_name)
                sheet_row_idx = target_idx + 2
                row_values = self._format_row_for_sheet(table_name, updated_record)
                ws.update(f"A{sheet_row_idx}", [row_values])
            except Exception as e:
                logger.error(f"Failed to update row {target_idx + 2} in Google Sheet {table_name}: {e}")

        return updated_record

    def delete(self, table_name: str, key: str, value: Any) -> bool:
        """Deletes record identified by key == value"""
        records = self.cached_tables.get(table_name, [])
        target_idx = -1
        for idx, r in enumerate(records):
            if str(r.get(key, "")) == str(value):
                target_idx = idx
                break
                
        if target_idx == -1:
            return False

        # Remove from cache
        records.pop(target_idx)
        self._save_local_db()

        # Delete from Google Sheet via Apps Script
        if getattr(self, "using_apps_script", False) and settings.GOOGLE_APPS_SCRIPT_URL:
            try:
                import requests
                headers = TABLE_SCHEMAS.get(table_name, [])
                k_idx = headers.index(key) if key in headers else 0
                requests.post(settings.GOOGLE_APPS_SCRIPT_URL, json={
                    "action": "delete",
                    "table": table_name,
                    "key_index": k_idx,
                    "key_value": str(value)
                }, timeout=5)
            except Exception as e:
                logger.error(f"Apps Script delete failed for {table_name}: {e}")

        # Delete from Google Sheet via gspread
        elif self.is_connected and self.spreadsheet:
            try:
                ws = self.spreadsheet.worksheet(table_name)
                sheet_row_idx = target_idx + 2
                ws.delete_rows(sheet_row_idx)
            except Exception as e:
                logger.error(f"Failed to delete row {target_idx + 2} in Google Sheet {table_name}: {e}")

        return True

    def get_status(self) -> Dict[str, Any]:
        """Returns real-time status of Google Sheets connectivity and table counts"""
        table_counts = {t: len(records) for t, records in self.cached_tables.items()}
        return {
            "is_connected": self.is_connected,
            "status_message": self.connection_status_msg,
            "sheet_id": self.spreadsheet.id if self.spreadsheet else None,
            "sheet_title": self.spreadsheet.title if self.spreadsheet else settings.GOOGLE_SHEET_NAME,
            "last_sync": self.last_sync_time,
            "table_counts": table_counts,
            "storage_mode": "Google Sheets (Live Cloud)" if self.is_connected else "Local Mirror (Automatic Cloud Sync Ready)"
        }

# Singleton instance
db = GoogleSheetsDatabase()
