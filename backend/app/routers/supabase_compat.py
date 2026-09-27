from fastapi import APIRouter, Request, Response, Header
from fastapi.responses import JSONResponse
from typing import Dict, Any, List, Optional
import json
import uuid
from datetime import datetime, timezone

from app.database import db
from app.services.auth_service import auth_service, hash_password

router = APIRouter(tags=["Supabase Compatibility Bridge"])

# ================= AUTH ENDPOINTS (/auth/v1/*) =================

@router.post("/auth/v1/signup")
async def supabase_signup(request: Request):
    try:
        body = await request.json()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        
        if not email or not password:
            return JSONResponse(
                status_code=400,
                content={"error": "validation_failed", "error_description": "Email and password are required", "message": "Email and password are required"}
            )

        # Check if user already exists
        existing = db.find_one("users", "email", email)
        if existing:
            return JSONResponse(
                status_code=400,
                content={"error": "user_already_exists", "error_description": "User already registered with this email. Please log in.", "message": "User already registered with this email. Please log in."}
            )

        options = body.get("options") or {}
        user_data = options.get("data") or {}
        full_name = user_data.get("fullName") or user_data.get("full_name") or body.get("full_name", "")
        phone = user_data.get("phone") or body.get("phone", "")
        business_name = user_data.get("businessName") or user_data.get("business_name") or body.get("business_name", "")

        res = auth_service.register(
            email=email,
            password=password,
            full_name=full_name,
            phone=phone,
            business_name=business_name
        )
        user_id = res["user"]["id"]

        user_obj = {
            "id": user_id,
            "email": email,
            "aud": "authenticated",
            "role": "authenticated",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "user_metadata": {
                "full_name": full_name,
                "phone": phone,
                "business_name": business_name
            }
        }
        return {
            "access_token": res["token"],
            "token_type": "bearer",
            "expires_in": 3600 * 24 * 7,
            "refresh_token": f"refresh_{user_id}",
            "user": user_obj
        }
    except ValueError as ve:
        return JSONResponse(
            status_code=400,
            content={"error": "bad_request", "error_description": str(ve), "message": str(ve)}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "server_error", "error_description": "Failed to create account", "message": "Failed to create account"}
        )

@router.post("/auth/v1/token")
async def supabase_token(request: Request):
    try:
        body = await request.json()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return JSONResponse(
                status_code=400,
                content={"error": "invalid_grant", "error_description": "Invalid login credentials", "message": "Invalid login credentials"}
            )

        # Authenticate against database
        res = auth_service.login(email=email, password=password)
        u_id = res["user"]["id"]

        return {
            "access_token": res["token"],
            "token_type": "bearer",
            "expires_in": 3600 * 24 * 7,
            "refresh_token": f"refresh_{u_id}",
            "user": {
                "id": u_id,
                "email": email,
                "aud": "authenticated",
                "role": "authenticated"
            }
        }
    except ValueError:
        # Invalid email or password: STRICT REJECTION
        return JSONResponse(
            status_code=400,
            content={"error": "invalid_grant", "error_description": "Invalid login credentials", "message": "Invalid login credentials"}
        )
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"error": "invalid_grant", "error_description": "Invalid login credentials", "message": "Invalid login credentials"}
        )

@router.get("/auth/v1/user")
async def supabase_get_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})

    token_str = authorization.replace("Bearer ", "").strip()
    user_id = None
    if token_str.startswith("token_user_"):
        parts = token_str[len("token_"):].split("_")
        if len(parts) >= 2:
            user_id = f"{parts[0]}_{parts[1]}"
        elif len(parts) == 1:
            user_id = parts[0]

    user = db.find_one("users", "id", user_id) if user_id else None
    if not user:
        return JSONResponse(status_code=401, content={"message": "Unauthorized"})

    return {
        "id": user["id"],
        "email": user["email"],
        "aud": "authenticated",
        "role": "authenticated"
    }

@router.post("/auth/v1/logout")
async def supabase_logout():
    return {"message": "Logged out successfully"}

# ================= REST TABLE ENDPOINTS (/rest/v1/{table}) =================

@router.get("/rest/v1/{table}")
async def supabase_get_table(table: str, request: Request, response: Response):
    params = dict(request.query_params)
    all_rows = db.find_all(table)

    filtered = all_rows
    for k, v in params.items():
        if k in ["select", "order", "limit", "offset"]:
            continue
        if v.startswith("eq."):
            val = v[3:]
            filtered = [r for r in filtered if str(r.get(k, "")) == val]

    response.headers["content-range"] = f"0-{len(filtered)}/{len(filtered)}"
    return filtered

@router.post("/rest/v1/{table}", status_code=201)
async def supabase_post_table(table: str, request: Request, response: Response):
    try:
        payload = await request.json()
        prefer = request.headers.get("prefer", "")
        is_upsert = "resolution=merge-duplicates" in prefer

        items = payload if isinstance(payload, list) else [payload]
        results = []
        for item in items:
            if is_upsert and "user_id" in item:
                existing = db.find_one(table, "user_id", item["user_id"])
                if existing:
                    updated = db.update(table, "user_id", item["user_id"], item)
                    results.append(updated or item)
                    continue
            if "id" not in item or not item["id"]:
                item["id"] = f"{table[:4]}_{uuid.uuid4().hex[:8]}"
            results.append(db.insert(table, item))

        return results if isinstance(payload, list) else results[0]
    except Exception as e:
        return []

@router.patch("/rest/v1/{table}")
async def supabase_patch_table(table: str, request: Request):
    try:
        payload = await request.json()
        params = dict(request.query_params)
        for k, v in params.items():
            if v.startswith("eq."):
                val = v[3:]
                updated = db.update(table, k, val, payload)
                if not updated and table == "profiles" and k == "id":
                    db.update(table, "user_id", val, payload)
        return [payload]
    except Exception:
        return []

@router.delete("/rest/v1/{table}")
async def supabase_delete_table(table: str, request: Request):
    params = dict(request.query_params)
    for k, v in params.items():
        if v.startswith("eq."):
            val = v[3:]
            db.delete(table, k, val)
    return {"message": "deleted"}
