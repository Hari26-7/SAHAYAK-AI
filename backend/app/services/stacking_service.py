import uuid
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.database import db

class StackingService:
    def check_stacking(self, user_id: str, selected_schemes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates compatibility and rules for stacking multiple government MSME schemes.
        Rules:
        - PMEGP (capital subsidy) + Mudra (subsidized bank loan):
          Generally direct double margin subsidy cannot be drawn, but credit guarantee or post-repayment expansion is valid.
        - PMEGP / Mudra + CGTMSE (Credit Guarantee):
          Fully compatible! CGTMSE provides collateral-free risk coverage for loans.
        - Capital Subsidies + Tech / Quality Certifications (ZED / Champions):
          Fully compatible! ZED covers quality testing/certification, no conflict with term loans.
        - PM Vishwakarma + Mudra:
          Allowed sequentially after Vishwakarma Phase 1 successful repayment.
        """
        scheme_ids = [s.get("id", "").lower() for s in selected_schemes]
        scheme_names = [s.get("name", "") for s in selected_schemes]

        conflict_notes = []
        recommendations = []
        is_stackable = True
        status = "Compatible"
        total_benefit = 0.0

        all_schemes = db.find_all("schemes")
        scheme_map = {s["id"]: s for s in all_schemes}

        for s_item in selected_schemes:
            sid = s_item.get("id")
            s_obj = scheme_map.get(sid, {})
            total_benefit += float(s_obj.get("max_benefit_amount", 0.0))

        # Check: PMEGP + Mudra
        has_pmegp = any("pmegp" in sid for sid in scheme_ids)
        has_mudra = any("mudra" in sid for sid in scheme_ids)
        has_cgtmse = any("cgtmse" in sid for sid in scheme_ids)
        has_zed = any("zed" in sid for sid in scheme_ids)
        has_vishwakarma = any("vishwakarma" in sid for sid in scheme_ids)

        if has_pmegp and has_mudra:
            is_stackable = False
            status = "Conflict Detected"
            conflict_notes.append("Dual Credit Subsidy Rule: Government guidelines prohibit claiming simultaneous capital margin money subsidy under PMEGP and Mudra for the exact same project.")
            recommendations.append("Recommendation: Avail PMEGP for initial capital expenditure (up to 35% margin subsidy), and apply for Mudra working capital later once production commences.")

        if has_vishwakarma and has_mudra:
            status = "Partial Compatibility"
            conflict_notes.append("Sequential Eligibility: PM Vishwakarma provides concessional credit at 5%. Simultaneous borrowing under Mudra is restricted during the initial 18-month artisan loan phase.")
            recommendations.append("Recommendation: Complete Vishwakarma Tranche 1 repayment with good credit record to become eligible for Mudra Tarun enterprise expansion.")

        if (has_pmegp or has_mudra) and has_cgtmse:
            recommendations.append("Optimal Synergy: Combining loan assistance with CGTMSE provides up to 85% credit guarantee, enabling bank sanction without requiring third-party land or property collateral.")

        if has_zed:
            recommendations.append("Quality Incentive Synergy: ZED Certification can be stacked with any credit scheme to receive up to 80% reimbursement on quality and green manufacturing audits.")

        if is_stackable and not conflict_notes:
            recommendations.append("All selected schemes have zero policy conflicts and can be stacked seamlessly to maximize government incentives.")

        result = {
            "id": f"stack_{uuid.uuid4().hex[:8]}",
            "user_id": user_id,
            "is_stackable": is_stackable,
            "status": status,
            "total_potential_benefit": total_benefit,
            "selected_schemes": selected_schemes,
            "conflict_notes": conflict_notes,
            "recommendations": recommendations,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        # Store check in Google Sheets DB
        db.insert("stacking_checks", result)
        return result

    def get_stacking_checks(self, user_id: str) -> List[Dict[str, Any]]:
        return db.find_by("stacking_checks", "user_id", user_id)

stacking_service = StackingService()
