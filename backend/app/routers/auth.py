from fastapi import APIRouter, HTTPException, status
from app.models.schemas import UserRegister, UserLogin
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(payload: UserRegister):
    try:
        res = auth_service.register(
            email=payload.email,
            password=payload.password,
            full_name=payload.full_name or "",
            phone=payload.phone or "",
            business_name=payload.business_name or ""
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/login")
def login(payload: UserLogin):
    try:
        res = auth_service.login(email=payload.email, password=payload.password)
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
