import os
import sys
import unittest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.main import app
from app.database import db

client = TestClient(app)

class TestMSMESahayakBackend(unittest.TestCase):
    def setUp(self):
        self.test_email = "entrepreneur_test@example.com"
        self.test_password = "SecretPassword123"

    def test_01_health_and_root(self):
        res = client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("text/html", res.headers.get("content-type", ""))

        res_h = client.get("/api/health")
        self.assertEqual(res_h.status_code, 200)
        data = res_h.json()
        self.assertEqual(data["status"], "healthy")
        self.assertGreaterEqual(data["schemes_loaded"], 7)
        print("[PASS] Health & Root UI verified")

    def test_02_auth_register_and_login(self):
        # Register
        res = client.post("/api/auth/register", json={
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Ramesh Kumar",
            "phone": "+91 9876543210",
            "business_name": "Kumar Agro Innovations"
        })
        # Could be 200 (created) or 400 (already exists if re-run)
        if res.status_code == 200:
            data = res.json()
            self.assertIn("token", data)
            self.assertEqual(data["user"]["email"], self.test_email)
            print("[PASS] User Registration verified")
        else:
            self.assertEqual(res.status_code, 400)

        # Login
        res_l = client.post("/api/auth/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(res_l.status_code, 200)
        data_l = res_l.json()
        self.assertIn("token", data_l)
        self.assertEqual(data_l["user"]["email"], self.test_email)
        print("[PASS] User Login verified")

    def test_03_schemes_and_ai_matching(self):
        res = client.get("/api/schemes")
        self.assertEqual(res.status_code, 200)
        schemes = res.json()
        self.assertGreaterEqual(len(schemes), 7)

        # Test AI Matching
        sample_profile = {
            "business_type": "Micro",
            "sector": "Manufacturing",
            "investment_amount": 800000,
            "annual_turnover": 2500000
        }
        res_m = client.post("/api/schemes/match", json={"profile": sample_profile})
        self.assertEqual(res_m.status_code, 200)
        matches = res_m.json()
        self.assertGreater(len(matches), 0)
        top_match = matches[0]
        self.assertIn("score", top_match)
        self.assertIn("reasons", top_match)
        self.assertGreater(top_match["score"], 50)
        print(f"[PASS] AI Matching verified (Top match: {top_match['scheme']['name']}, Score: {top_match['score']}%)")

    def test_04_scheme_stacking_intelligence(self):
        # 1. Compatible combination: Mudra + CGTMSE
        comp_payload = {
            "user_id": "test_user_01",
            "schemes": [
                {"id": "mudra-002", "name": "Pradhan Mantri Mudra Yojana (PMMY)"},
                {"id": "cgtmse-003", "name": "Credit Guarantee Scheme (CGTMSE)"}
            ]
        }
        res_c = client.post("/api/stacking/check", json=comp_payload)
        self.assertEqual(res_c.status_code, 200)
        data_c = res_c.json()
        self.assertEqual(data_c["status"], "Compatible")
        self.assertTrue(data_c["is_stackable"])

        # 2. Conflicting combination: PMEGP + Mudra
        conf_payload = {
            "user_id": "test_user_01",
            "schemes": [
                {"id": "pmegp-001", "name": "Prime Minister's Employment Generation Programme (PMEGP)"},
                {"id": "mudra-002", "name": "Pradhan Mantri Mudra Yojana (PMMY)"}
            ]
        }
        res_cf = client.post("/api/stacking/check", json=conf_payload)
        self.assertEqual(res_cf.status_code, 200)
        data_cf = res_cf.json()
        self.assertEqual(data_cf["status"], "Conflict Detected")
        self.assertFalse(data_cf["is_stackable"])
        self.assertGreater(len(data_cf["conflict_notes"]), 0)
        print("[PASS] Scheme Stacking Intelligence & Conflict Engine verified")

    def test_05_credit_profile(self):
        payload = {
            "user_id": "test_user_01",
            "credit_score": 780,
            "outstanding_loans": 150000,
            "loan_count": 1,
            "annual_income": 1200000,
            "existing_emis": 12000,
            "banking_partner": "State Bank of India",
            "gst_registered": True,
            "itr_filed": True
        }
        res = client.post("/api/credit/save", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["credit_rating"], "Excellent")
        print("[PASS] Credit Score & Rating engine verified")

    def test_06_roadmap(self):
        res = client.get("/api/roadmap/test_user_01")
        self.assertEqual(res.status_code, 200)
        steps = res.json()
        self.assertEqual(len(steps), 5)
        step_id = steps[0]["id"]

        # Update step
        res_u = client.put(f"/api/roadmap/steps/{step_id}", json={"status": "completed"})
        self.assertEqual(res_u.status_code, 200)
        self.assertEqual(res_u.json()["status"], "completed")
        print("[PASS] Eligibility Roadmap & Milestones verified")

    def test_07_notifications(self):
        res = client.post("/api/notifications", json={
            "user_id": "test_user_01",
            "type": "success",
            "title": "Loan Pre-approved",
            "message": "Your Mudra Tarun application has been verified by the automated system."
        })
        self.assertEqual(res.status_code, 200)
        notif_id = res.json()["id"]

        res_read = client.put(f"/api/notifications/{notif_id}/read")
        self.assertEqual(res_read.status_code, 200)
        print("[PASS] Notifications dispatch & read status verified")

    def test_08_sheets_status(self):
        res = client.get("/api/sheets/status")
        self.assertEqual(res.status_code, 200)
        status = res.json()
        self.assertIn("storage_mode", status)
        self.assertIn("table_counts", status)
        print(f"[PASS] Google Sheets Database Engine verified ({status['storage_mode']})")

if __name__ == "__main__":
    unittest.main()
