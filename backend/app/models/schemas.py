from typing import Optional, Any, List
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

# ================= AUTH SCHEMAS =================
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = ""
    phone: Optional[str] = ""
    business_name: Optional[str] = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# ================= PROFILE SCHEMAS =================
class ProfileBase(BaseModel):
    full_name: Optional[str] = ""
    phone: Optional[str] = ""
    business_name: Optional[str] = ""
    business_type: Optional[str] = ""
    sector: Optional[str] = ""
    sub_sector: Optional[str] = ""
    investment_amount: Optional[float] = 0.0
    annual_turnover: Optional[float] = 0.0
    employee_count: Optional[int] = 0
    state: Optional[str] = ""
    city: Optional[str] = ""
    pincode: Optional[str] = ""
    preferred_language: Optional[str] = "en"

class ProfileCreate(ProfileBase):
    user_id: str

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    updated_at: str

# ================= SCHEME SCHEMAS =================
class SchemeBase(BaseModel):
    name: str
    description: str
    category: str
    ministry: Optional[str] = "Ministry of MSME"
    max_benefit_amount: Optional[float] = 0.0
    subsidy_percent: Optional[float] = 0.0
    eligibility_criteria: Optional[Any] = []
    required_documents: Optional[Any] = []
    application_link: Optional[str] = ""
    is_active: Optional[bool] = True

class SchemeCreate(SchemeBase):
    id: Optional[str] = None

class SchemeResponse(SchemeBase):
    id: str

class SchemeMatchRequest(BaseModel):
    profile: Optional[dict] = None

class SchemeMatchItem(BaseModel):
    scheme: SchemeResponse
    score: int
    reasons: List[str]

# ================= SCHEME STACKING SCHEMAS =================
class SelectedScheme(BaseModel):
    id: str
    name: str

class StackingCheckRequest(BaseModel):
    schemes: List[SelectedScheme]

class StackingCheckResponse(BaseModel):
    id: str
    user_id: str
    is_stackable: bool
    status: str  # "Compatible" | "Partial Compatibility" | "Conflict Detected"
    total_potential_benefit: float
    selected_schemes: List[dict]
    conflict_notes: List[str]
    recommendations: List[str]
    created_at: str

# ================= APPLICATION SCHEMAS =================
class ApplicationCreate(BaseModel):
    scheme_id: str
    scheme_name: str
    business_name: Optional[str] = ""
    applied_via: Optional[str] = "MSME Sahayak AI"
    notes: Optional[str] = ""

class ApplicationResponse(BaseModel):
    id: str
    user_id: str
    scheme_id: str
    scheme_name: str
    application_reference: str
    status: str
    applied_date: str
    applied_via: str
    business_name: Optional[str] = ""
    notes: Optional[str] = ""

# ================= DOCUMENT SCHEMAS =================
class DocumentResponse(BaseModel):
    id: str
    user_id: str
    document_name: str
    document_type: str
    file_path: Optional[str] = ""
    verification_status: str  # pending, verified, rejected
    remarks: Optional[str] = ""
    uploaded_at: str

class DocumentStatusUpdate(BaseModel):
    verification_status: str
    remarks: Optional[str] = ""

# ================= CREDIT PROFILE SCHEMAS =================
class CreditProfileSave(BaseModel):
    credit_score: int = Field(default=650, ge=300, le=900)
    outstanding_loans: Optional[float] = 0.0
    loan_count: Optional[int] = 0
    annual_income: Optional[float] = 0.0
    existing_emis: Optional[float] = 0.0
    banking_partner: Optional[str] = ""
    gst_registered: Optional[bool] = False
    itr_filed: Optional[bool] = False
    credit_rating: Optional[str] = ""

class CreditProfileResponse(CreditProfileSave):
    id: str
    user_id: str
    updated_at: str

# ================= ROADMAP SCHEMAS =================
class RoadmapStepResponse(BaseModel):
    id: str
    user_id: str
    step_number: int
    title: str
    description: str
    status: str  # pending, in_progress, completed
    completed_at: Optional[str] = None
    action_link: Optional[str] = ""

class RoadmapStepUpdate(BaseModel):
    status: str

# ================= NOTIFICATION SCHEMAS =================
class NotificationCreate(BaseModel):
    type: str = "info"  # info, success, warning, alert
    title: str
    message: str

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    is_read: bool
    created_at: str

# ================= FACE VERIFICATION SCHEMAS =================
class FaceVerifyRequest(BaseModel):
    image_data: str  # Base64 data URL

class FaceVerificationResponse(BaseModel):
    id: str
    user_id: str
    status: str  # verified, failed, pending
    confidence_score: float
    verified_at: str
    remarks: str
