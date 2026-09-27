import uuid
from typing import List, Dict, Any, Optional
from app.database import db

class SchemesService:
    def get_all_schemes(self) -> List[Dict[str, Any]]:
        return db.find_all("schemes")

    def get_scheme(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        return db.find_one("schemes", "id", scheme_id)

    def match_schemes(self, profile: Dict[str, Any], schemes: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
        if schemes is None:
            schemes = self.get_all_schemes()

        if not profile:
            return [{"scheme": s, "score": 50, "reasons": ["Baseline profile match"]} for s in schemes]

        business_type = str(profile.get("business_type", "")).lower()
        sector = str(profile.get("sector", "")).lower()
        investment = float(profile.get("investment_amount") or 0.0)
        turnover = float(profile.get("annual_turnover") or 0.0)
        state = str(profile.get("state", "")).lower()

        results = []

        for scheme in schemes:
            score = 40  # base compatibility score
            reasons = []
            s_name = scheme.get("name", "").lower()
            s_desc = scheme.get("description", "").lower()
            s_cat = scheme.get("category", "").lower()
            criteria = scheme.get("eligibility_criteria", [])
            if isinstance(criteria, str):
                criteria_str = criteria.lower()
            else:
                criteria_str = " ".join(criteria).lower()

            # Sector-based matching
            if "manufacturing" in sector:
                if "manufacturing" in criteria_str or "manufacturing" in s_desc or "zed" in s_name or "pmegp" in s_name:
                    score += 25
                    reasons.append("High priority matching for Manufacturing sector enterprise")
            elif "service" in sector or "trade" in sector:
                if "service" in criteria_str or "mudra" in s_name or "cgtmse" in s_name:
                    score += 20
                    reasons.append("Eligible under Services & Trading credit priority")

            # MSME Enterprise Classification Matching (GoI Criteria)
            # Micro: Investment <= 1 Cr (10,000,000) & Turnover <= 5 Cr (50,000,000)
            # Small: Investment <= 10 Cr & Turnover <= 50 Cr
            if investment <= 10000000 and turnover <= 50000000:
                if "micro" in criteria_str or "pmegp" in s_name or "mudra" in s_name:
                    score += 20
                    reasons.append("Classified as Micro Enterprise: eligible for maximum 35% subsidy and priority lending")
            elif investment <= 100000000:
                if "small" in criteria_str or "cgtmse" in s_name or "zed" in s_name:
                    score += 15
                    reasons.append("Classified as Small Enterprise: eligible for collateral guarantee & ZED grants")

            # Traditional artisan check
            if any(k in sector for k in ["handicraft", "textile", "artisan"]) or any(k in business_type for k in ["self help", "proprietorship"]):
                if "vishwakarma" in s_name or "sfurti" in s_name:
                    score += 30
                    reasons.append("Strong fit for traditional craft & artisan cluster assistance")

            # Loan & guarantee requirements
            if "credit" in s_cat:
                if investment > 0 and investment <= 1000000:
                    if "mudra" in s_name:
                        score += 15
                        reasons.append("Requested investment is within Pradhan Mantri Mudra cap (up to ₹10 Lakhs)")
                elif investment > 1000000:
                    if "cgtmse" in s_name or "pmegp" in s_name:
                        score += 15
                        reasons.append("Investment requirements supported by high-cap guarantee coverage")

            if not reasons:
                reasons.append("General MSME eligibility criteria satisfied")

            final_score = min(score, 98)
            results.append({
                "scheme": scheme,
                "score": final_score,
                "reasons": reasons
            })

        # Sort results by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results

schemes_service = SchemesService()
