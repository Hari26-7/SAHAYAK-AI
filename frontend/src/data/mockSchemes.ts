export interface SchemeData {
  id: string;
  name: string;
  shortCode: string;
  hindiName: string;
  tamilName: string;
  category: 'Credit & Finance' | 'Capital Subsidy' | 'Quality & Technology' | 'Rural & Traditional' | 'Incentive & Growth' | 'Innovation & Cluster';
  ministry: string;
  nodalAgency: string;
  matchPercentage: number;
  maxSubsidy: string;
  maxLoanAmount?: string;
  keyEligibility: string[];
  description: string;
  targetBeneficiaries: string;
  portalUrl: string;
  tags: string[];
}

export const MOCK_GOV_SCHEMES: SchemeData[] = [
  {
    id: 'pmegp-001',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    shortCode: 'PMEGP',
    hindiName: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
    tamilName: 'பிரதமரின் வேலைவாய்ப்பு உருவாக்கும் திட்டம் (PMEGP)',
    category: 'Capital Subsidy',
    ministry: 'Ministry of MSME, Govt. of India',
    nodalAgency: 'Khadi and Village Industries Commission (KVIC)',
    matchPercentage: 98,
    maxSubsidy: 'Up to 35% of project cost (Max ₹50 Lakhs for Mfg, ₹20 Lakhs for Service)',
    maxLoanAmount: 'Up to ₹50,00,000',
    keyEligibility: [
      'Individuals aged 18+ years (No upper age limit)',
      'Minimum 8th standard pass for project cost exceeding ₹10L (Mfg) / ₹5L (Service)',
      'Self-Help Groups (SHGs) not availing other govt subsidies',
      'New micro-enterprises in manufacturing or service sectors'
    ],
    description: 'Credit-linked subsidy programme to generate continuous and sustainable employment opportunities in rural and urban areas through setup of new micro-enterprises.',
    targetBeneficiaries: 'Rural & Urban Micro Entrepreneurs, SC/ST, Women, Ex-Servicemen, Differently-Abled',
    portalUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    tags: ['Subsidy', '35% Margin Money', 'KVIC', 'New Enterprise', 'Manufacturing', 'Services']
  },
  {
    id: 'cgtmse-002',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    shortCode: 'CGTMSE',
    hindiName: 'सूक्ष्म और लघु उद्यम क्रेडिट गारंटी फंड ट्रस्ट (CGTMSE)',
    tamilName: 'குறு மற்றும் சிறு வணிக கடன் உத்தரவாத நிதி அறக்கட்டளை (CGTMSE)',
    category: 'Credit & Finance',
    ministry: 'Ministry of MSME & SIDBI',
    nodalAgency: 'CGTMSE Trust / Member Lending Institutions',
    matchPercentage: 95,
    maxSubsidy: '100% Collateral-Free Guarantee Coverage up to ₹5 Crore (85% for Women/Micro)',
    maxLoanAmount: 'Up to ₹5,00,00,000',
    keyEligibility: [
      'New and existing Micro and Small Enterprises (MSEs)',
      'Viable business model with clean financial track record',
      'No third-party guarantee or collateral security required',
      'Applicable across all scheduled commercial banks & NBFCs'
    ],
    description: 'Enables collateral-free credit delivery to micro and small enterprise sector, assuring lenders of credit guarantee in case of loan default.',
    targetBeneficiaries: 'Micro & Small Enterprises, Women Entrepreneurs, SC/ST, Aspirational Districts',
    portalUrl: 'https://www.cgtmse.in/',
    tags: ['Collateral Free', '₹5 Cr Guarantee', 'SIDBI', 'Bank Loan', 'Working Capital']
  },
  {
    id: 'pmfme-003',
    name: 'PM Formalisation of Micro food processing Enterprises Scheme (PMFME)',
    shortCode: 'PMFME',
    hindiName: 'पीएम सूक्ष्म खाद्य उद्योग उन्नयन योजना (PMFME)',
    tamilName: 'பிரதமரின் குறு உணவு பதப்படுத்தும் தொழில் முறைப்படுத்தல் திட்டம் (PMFME)',
    category: 'Capital Subsidy',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    nodalAgency: 'State Nodal Agencies (SNA) / MoFPI',
    matchPercentage: 92,
    maxSubsidy: '35% Credit-Linked Capital Subsidy (Max ₹10 Lakhs) + ₹40,000 Seed Capital per member',
    maxLoanAmount: 'Up to ₹30,00,000',
    keyEligibility: [
      'Existing individual micro food processing units',
      'Farmer Producer Organizations (FPOs), Self Help Groups (SHGs) and Producer Co-operatives',
      'Focus on One District One Product (ODOP) raw material processing',
      'Willingness to achieve FSSAI standards and formal enterprise status'
    ],
    description: 'Centrally sponsored scheme providing financial, technical, and business support for upgrading and formalising individual micro food processing enterprises.',
    targetBeneficiaries: 'Micro Food Processors, SHG Women, FPOs, Agri-preneurs',
    portalUrl: 'https://pmfme.mofpi.gov.in/',
    tags: ['Food Processing', 'ODOP', 'FSSAI', '35% Subsidy', 'Seed Capital', 'SHG']
  },
  {
    id: 'mudra-004',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY) - Shishu, Kishore, Tarun',
    shortCode: 'MUDRA',
    hindiName: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
    tamilName: 'பிரதமரின் முத்ரா திட்டம் (PMMY)',
    category: 'Credit & Finance',
    ministry: 'Ministry of Finance & Ministry of MSME',
    nodalAgency: 'MUDRA Ltd. / Public & Private Sector Banks',
    matchPercentage: 96,
    maxSubsidy: 'Nil Processing Fee, Collateral-Free Institutional Credit up to ₹10 Lakhs (Now up to ₹20L for Tarun Plus)',
    maxLoanAmount: 'Shishu (≤₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L)',
    keyEligibility: [
      'Non-Corporate Small Business Segment (NCSB) in rural & urban areas',
      'Small manufacturing units, shopkeepers, fruit/vegetable vendors, artisans',
      'Valid Aadhaar, PAN, and Udyam Registration (Udyam Assist eligible)',
      'No past defaults with any banking institution'
    ],
    description: 'Refinancing support providing formal micro-credit to non-corporate, non-farm small/micro enterprises across three growth tiers: Shishu, Kishore, and Tarun.',
    targetBeneficiaries: 'Artisans, Street Vendors, Small Retailers, Service Providers, Micro Startups',
    portalUrl: 'https://www.mudra.org.in/',
    tags: ['No Collateral', 'Low Interest', 'Quick Disbursal', 'Micro Credit', 'Tarun']
  },
  {
    id: 'standup-005',
    name: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    shortCode: 'Stand-Up India',
    hindiName: 'स्टैंड-अप इंडिया योजना (अनुसूचित जाति/जनजाति एवं महिला उद्यमी)',
    tamilName: 'ஸ்டாண்ட்-அப் இந்தியா திட்டம் (மகளிர் மற்றும் பட்டியலினத்தவர்)',
    category: 'Credit & Finance',
    ministry: 'Department of Financial Services (DFS), MoF & MoMSME',
    nodalAgency: 'SIDBI & Commercial Banks',
    matchPercentage: 89,
    maxSubsidy: 'Composite Bank Loan between ₹10 Lakhs and ₹1 Crore (up to 85% of project cost) with Margin Money convergence',
    maxLoanAmount: '₹10,00,000 to ₹1,00,00,000',
    keyEligibility: [
      'SC/ST and/or Woman entrepreneur aged 18+ years',
      'Greenfield enterprise (first-time venture) in manufacturing, services, agri-allied or trading',
      'For non-individual enterprises, 51% shareholding & controlling stake must be held by SC/ST or Woman',
      'Borrower should not be in default to any bank or financial institution'
    ],
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    targetBeneficiaries: 'Women Entrepreneurs, Scheduled Caste (SC) & Scheduled Tribe (ST) Promoters',
    portalUrl: 'https://www.standupmitra.in/',
    tags: ['Women Led', 'SC/ST Priority', '₹1 Crore Loan', 'Greenfield Project', 'SIDBI']
  },
  {
    id: 'zed-006',
    name: 'MSME Sustainable (ZED) Certification Scheme',
    shortCode: 'MSME ZED',
    hindiName: 'एमएसएमई सतत (ZED - ज़ीरो डिफेक्ट ज़ीरो इफ़ेक्ट) प्रमाणन योजना',
    tamilName: 'குறு சிறு நிறுவனங்களின் நீடித்த ZED தரச்சான்றிதழ் திட்டம்',
    category: 'Quality & Technology',
    ministry: 'Ministry of MSME, Govt. of India',
    nodalAgency: 'Quality Council of India (QCI) & MSME-DI',
    matchPercentage: 94,
    maxSubsidy: 'Up to 80% Certification Subsidy (Micro 80%, Small 60%, Medium 50%) + ₹5L Handholding Support',
    maxLoanAmount: 'Grants up to ₹5,00,000 + Concessional Bank Interest (up to 0.5% rebate)',
    keyEligibility: [
      'All manufacturing MSMEs registered with valid Udyam Registration',
      'Taking the official ZED Pledge on the MSME portal',
      'Commitment to Zero Defect manufacturing with Zero Environmental Effect',
      'Additional 10% subsidy for Women / SC / ST / NER entrepreneurs'
    ],
    description: 'Promotes Zero Defect Zero Effect manufacturing practices among MSMEs, reducing environmental footprint while boosting global competitiveness and quality certification.',
    targetBeneficiaries: 'All Manufacturing MSMEs seeking ISO/ZED Bronze, Silver, or Gold Standards',
    portalUrl: 'https://zed.msme.gov.in/',
    tags: ['Quality', 'Zero Defect', '80% Subsidy', 'QCI', 'Clean Energy', 'Interest Rebate']
  },
  {
    id: 'pli-007',
    name: 'Production Linked Incentive (PLI) Scheme for Food Processing',
    shortCode: 'PLI-FPI',
    hindiName: 'खाद्य प्रसंस्करण उद्योग हेतु उत्पादन से जुड़ी प्रोत्साहन योजना (PLI)',
    tamilName: 'உணவு பதப்படுத்துதலுக்கான உற்பத்தி சார்ந்த ஊக்கத்தொகை திட்டம் (PLI)',
    category: 'Incentive & Growth',
    ministry: 'Ministry of Food Processing Industries (MoFPI)',
    nodalAgency: 'Project Management Agency (PMA) / IFCI Ltd.',
    matchPercentage: 86,
    maxSubsidy: 'Financial outlay of ₹10,900 Crore; 4% to 10% Cash Incentive on Incremental Sales',
    maxLoanAmount: 'Incentives up to ₹50 Crore based on turnover slabs',
    keyEligibility: [
      'Enterprises producing Ready-to-Cook / Ready-to-Eat (RTC/RTE) products, processed fruits & vegetables, marine foods',
      'MSMEs with committed minimum annual CAGR sales growth',
      'Entities having valid FSSAI, GST, and Udyam certification',
      'Support for branding and marketing abroad for Indian products'
    ],
    description: 'Creation of global food manufacturing champions, supporting Indian brands in international markets through direct financial incentives on incremental sales.',
    targetBeneficiaries: 'Fast-growing Food Processing MSMEs, Agro-processing Exporters',
    portalUrl: 'https://www.mofpi.gov.in/pli-scheme',
    tags: ['PLI', '10% Cash Incentive', 'Food Processing', 'Export Promotion', 'High Growth']
  },
  {
    id: 'udyam-assist-008',
    name: 'Udyam Assist Platform (UAP) Priority Benefits',
    shortCode: 'UAP Assist',
    hindiName: 'उद्यम असिस्ट प्लेटफॉर्म (UAP) लाभ',
    tamilName: 'உத்யம் அசிஸ்ட் பிளாட்பார்ம் (UAP) முன்னுரிமை சலுகைகள்',
    category: 'Credit & Finance',
    ministry: 'Ministry of MSME, Govt. of India',
    nodalAgency: 'SIDBI & Designated Designated Intermediary Banks',
    matchPercentage: 97,
    maxSubsidy: 'Instant Priority Sector Lending (PSL) classification without mandatory GSTIN requirement',
    maxLoanAmount: 'Priority Credit access up to ₹10 Lakhs',
    keyEligibility: [
      'Informal Micro Enterprises (IMEs) not covered under formal GST regime',
      'Assisted digital onboarding through banks, NBFCs, and SHG federations',
      'Valid Aadhaar card and active bank account',
      'Exempted from mandatory GSTIN for priority sector credit'
    ],
    description: 'Formalises informal micro enterprises (IMEs) digitally, providing a recognized Udyam Assist Certificate that grants Priority Sector Lending benefits.',
    targetBeneficiaries: 'Street Vendors, Rural Artisans, Cottage Units, Informal Micro Enterprises',
    portalUrl: 'https://udyamassist.gov.in/',
    tags: ['Zero GST Needed', 'Priority Sector', 'Instant Udyam', 'Financial Inclusion']
  },
  {
    id: 'aspire-009',
    name: 'ASPIRE - Scheme for Promotion of Innovation, Rural Industry & Entrepreneurship',
    shortCode: 'ASPIRE',
    hindiName: 'एस्पायर - नवाचार, ग्रामीण उद्योग और उद्यमिता संवर्धन योजना',
    tamilName: 'அஸ்பயர் - ஊரக தொழில் மற்றும் கண்டுபிடிப்பு ஊக்குவிப்பு திட்டம்',
    category: 'Innovation & Cluster',
    ministry: 'Ministry of MSME, Govt. of India',
    nodalAgency: 'SIDBI & Khadi Village Industries Commission',
    matchPercentage: 88,
    maxSubsidy: 'Up to ₹1 Crore for Livelihood Business Incubators (LBI) & ₹100 Crore Fund-of-Funds support',
    maxLoanAmount: 'Grant up to ₹1,00,00,000 for Incubator infrastructure',
    keyEligibility: [
      'Rural youth, grassroots innovators, and agritech entrepreneurs',
      'Technical institutions, universities, R&D centers, and NGOs in rural areas',
      'Projects focusing on agro-rural manufacturing, automation, and value addition',
      'Entities offering hands-on skilling and incubation support'
    ],
    description: 'Sets up a network of technology centers and incubation centers to accelerate entrepreneurship, promote innovation for rural livelihood, and create jobs.',
    targetBeneficiaries: 'Grassroots Innovators, Agritech Startups, Rural Technical Incubators',
    portalUrl: 'https://aspire.msme.gov.in/',
    tags: ['Rural Tech', 'Innovation', '₹1 Cr Incubation Grant', 'Agritech', 'SIDBI Fund']
  },
  {
    id: 'sfurti-010',
    name: 'SFURTI - Scheme of Fund for Regeneration of Traditional Industries',
    shortCode: 'SFURTI',
    hindiName: 'स्फूर्ति - पारंपरिक उद्योगों के पुनरुद्धार हेतु निधि योजना (SFURTI)',
    tamilName: 'பாரம்பரிய தொழில்களை மறுமலர்ச்சி செய்வதற்கான நிதி திட்டம் (SFURTI)',
    category: 'Rural & Traditional',
    ministry: 'Ministry of MSME, Govt. of India',
    nodalAgency: 'KVIC, Coir Board, and Technical Agencies (Nodal Agencies)',
    matchPercentage: 91,
    maxSubsidy: 'Grant of ₹2.5 Crore for Regular Clusters (up to 500 artisans) and ₹5 Crore for Major Clusters (500+ artisans)',
    maxLoanAmount: 'Grant up to ₹5,00,00,000 (95% Govt Contribution)',
    keyEligibility: [
      'Clusters of traditional artisans, weavers, handlooms, and village craftspersons',
      'Implementing Agencies: NGOs, Co-operative Societies, Panchayati Raj Institutions (PRIs)',
      'Commitment to establish Common Facility Centers (CFCs) with modern equipment',
      'Minimum 500 traditional artisans organized in an active cluster'
    ],
    description: 'Organizes traditional artisans and crafts into competitive clusters, providing modern tools, common facility centers, design intervention, and market access.',
    targetBeneficiaries: 'Handicraft Artisans, Khadi Weavers, Bamboo & Coir Clusters, Pottery Workers',
    portalUrl: 'https://sfurti.msme.gov.in/',
    tags: ['Traditional Crafts', '₹5 Cr Cluster Grant', 'KVIC', 'Common Facility Center', 'Artisans']
  }
];
