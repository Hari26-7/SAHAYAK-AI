import json

INITIAL_SCHEMES = [
    {
        "id": "pmegp-001",
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "description": "Credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of MSME / KVIC",
        "max_benefit_amount": 5000000.0,
        "subsidy_percent": 35.0,
        "eligibility_criteria": [
            "Any individual above 18 years of age",
            "At least VIII standard pass for projects costing above Rs.10 lakh in manufacturing and Rs.5 lakh in services",
            "Only for new micro enterprise projects",
            "Self Help Groups (SHGs) not availing other benefits"
        ],
        "required_documents": [
            "Aadhaar Card",
            "PAN Card",
            "Project Report (DPR)",
            "Educational Qualification Certificate",
            "Caste/Special Category Certificate (if applicable)",
            "Rural Area Certificate (if applicable)"
        ],
        "application_link": "https://www.kviconline.gov.in/pmegpeportal/",
        "is_active": True
    },
    {
        "id": "mudra-002",
        "name": "Pradhan Mantri Mudra Yojana (PMMY)",
        "description": "Collateral-free institutional credit up to Rs. 10 Lakhs to micro/small business enterprises in manufacturing, trading, and services.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of Finance / MSME",
        "max_benefit_amount": 1000000.0,
        "subsidy_percent": 0.0,
        "eligibility_criteria": [
            "Non-corporate, non-farm small/micro enterprises",
            "Valid business plan for manufacturing, processing, trading, or service activities",
            "No default record in any bank/financial institution",
            "Shishu (up to 50k), Kishore (50k - 5L), Tarun (5L - 10L)"
        ],
        "required_documents": [
            "Identity Proof (Aadhaar / Voter ID / Passport)",
            "Residence Proof",
            "Business Address Proof",
            "Bank Statement (last 6 months)",
            "Quotation / Machinery purchase estimate"
        ],
        "application_link": "https://www.mudra.org.in/",
        "is_active": True
    },
    {
        "id": "cgtmse-003",
        "name": "Credit Guarantee Scheme (CGTMSE)",
        "description": "Credit guarantee coverage up to Rs. 500 Lakhs (5 Crore) to enable collateral-free credit flow to Micro and Small Enterprises.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of MSME / SIDBI",
        "max_benefit_amount": 50000000.0,
        "subsidy_percent": 85.0,
        "eligibility_criteria": [
            "New and existing Micro and Small Enterprises",
            "Manufacturing and Service sectors including retail trade and educational institutions",
            "Borrower should have viable business model without third-party collateral"
        ],
        "required_documents": [
            "Udyam Registration Certificate",
            "ITR Documents for last 2 years",
            "Audited Balance Sheet & P&L Statement",
            "Detailed Project Report (DPR)",
            "GST Returns"
        ],
        "application_link": "https://www.cgtmse.in/",
        "is_active": True
    },
    {
        "id": "pm-vishwakarma-004",
        "name": "PM Vishwakarma Scheme",
        "description": "Holistic support to traditional artisans and craftspeople with toolkit incentives, training stipend, and low-interest collateral-free loans.",
        "category": "Skill & Training",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 300000.0,
        "subsidy_percent": 100.0,
        "eligibility_criteria": [
            "Artisans working with hands and tools in 18 identified traditional trades (Carpenters, Blacksmiths, Potters, Tailors, etc.)",
            "Minimum age of 18 years on the date of registration",
            "Beneficiary should be engaged in the trade on the date of application",
            "One member per family eligible"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Mobile Number linked with Aadhaar",
            "Bank Account Details",
            "Ration Card (mandatory for family verification)"
        ],
        "application_link": "https://pmvishwakarma.gov.in/",
        "is_active": True
    },
    {
        "id": "zed-005",
        "name": "MSME Sustainable (ZED) Certification Scheme",
        "description": "Financial assistance on cost of Zero Defect Zero Effect (ZED) assessment and certification to promote quality manufacturing and environmental standards.",
        "category": "Infrastructure & Tech",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 500000.0,
        "subsidy_percent": 80.0,
        "eligibility_criteria": [
            "All Manufacturing MSMEs with valid Udyam Registration",
            "Subsidy structure: Micro (80%), Small (60%), Medium (50%)",
            "Additional 10% subsidy for Women / SC / ST / NER entrepreneurs"
        ],
        "required_documents": [
            "Udyam Registration Certificate",
            "Plant & Machinery Investment Undertaking",
            "Electricity Bill / Factory License",
            "Bank Statement"
        ],
        "application_link": "https://zed.msme.gov.in/",
        "is_active": True
    },
    {
        "id": "standup-006",
        "name": "Stand-Up India Scheme",
        "description": "Bank loans between Rs. 10 Lakhs and Rs. 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of Finance",
        "max_benefit_amount": 10000000.0,
        "subsidy_percent": 15.0,
        "eligibility_criteria": [
            "SC/ST and/or Woman entrepreneurs above 18 years of age",
            "Only for Greenfield (first-time venture) projects",
            "In non-individual enterprises, 51% shareholding should be held by SC/ST and/or women",
            "Manufacturing, services, agri-allied or trading sectors"
        ],
        "required_documents": [
            "Identity & Address Proof",
            "Caste Certificate (for SC/ST)",
            "Project Report",
            "Partnership Deed / MoA / AoA (if corporate)",
            "Pollution clearance / licenses if applicable"
        ],
        "application_link": "https://www.standupmitra.in/",
        "is_active": True
    },
    {
        "id": "sfurti-007",
        "name": "SFURTI (Fund for Regeneration of Traditional Industries)",
        "description": "Cluster development grant to make traditional industries more productive, competitive, and sustainable through modern equipment and Common Facility Centres.",
        "category": "Infrastructure & Tech",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 50000000.0,
        "subsidy_percent": 90.0,
        "eligibility_criteria": [
            "Non-Government Organizations (NGOs), Institutions of Central/State Govt, SHGs, Panchayati Raj Institutions",
            "Artisan clusters with minimum 500 artisans for regular clusters and 2500 for major clusters"
        ],
        "required_documents": [
            "Detailed Project Report (DPR)",
            "Registration Documents of Nodal Agency / Implementing Agency",
            "Land Availability Proof for Common Facility Centre (CFC)",
            "Artisan baseline survey list"
        ],
        "application_link": "https://sfurti.msme.gov.in/",
        "is_active": True
    }
]

DEFAULT_ROADMAP_STEPS = [
    {
        "step_number": 1,
        "title": "Udyam Registration & Document Preparation",
        "description": "Obtain your 19-digit Udyam Registration Number using Aadhaar and PAN. Ensure GST certificate and bank accounts are active.",
        "status": "pending",
        "action_link": "https://udyamregistration.gov.in/"
    },
    {
        "step_number": 2,
        "title": "Credit Profiling & CIBIL Readiness",
        "description": "Check MSME credit score, clear any overdue payments, and maintain regular bank cash-flow records.",
        "status": "pending",
        "action_link": "/credit-score"
    },
    {
        "step_number": 3,
        "title": "Detailed Project Report (DPR) Formulation",
        "description": "Draft complete financial appraisal, project cost, debt-equity ratio, machinery quotations, and break-even projection.",
        "status": "pending",
        "action_link": "/documents"
    },
    {
        "step_number": 4,
        "title": "AI Scheme Matching & Stacking Verification",
        "description": "Use MSME Sahayak to identify optimal non-conflicting subsidies and collateral guarantee combinations.",
        "status": "pending",
        "action_link": "/scheme-matching"
    },
    {
        "step_number": 5,
        "title": "Official Portal Application & Bank Sanction",
        "description": "Submit digital application on national portal (PMEGP / Mudra / CGTMSE) and track bank branch processing.",
        "status": "pending",
        "action_link": "/applications"
    }
]
