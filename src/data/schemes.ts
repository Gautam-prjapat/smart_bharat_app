import { GovScheme } from '../types';

export const INDIAN_GOV_SCHEMES: GovScheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    department: 'Ministry of Agriculture and Farmers Welfare',
    objective: 'To provide income support to all landholding farmer families across the country to enable them to take care of expenses related to agriculture and domestic needs.',
    benefitDetails: 'An income support of ₹6,000 per year is provided in three equal installments of ₹2,000 directly into the bank accounts of the beneficiaries.',
    eligibilityRules: [
      'Must be an Indian citizen.',
      'Must be a farmer family owning cultivable land in their name.',
      'Must NOT be an institutional landholder.',
      'Must NOT be a professional (Doctor, Engineer, Lawyer, CA) or income tax payer.',
      'Must NOT be a retired pensioner receiving ₹10,000 or more monthly.'
    ],
    documentsRequired: [
      'Aadhaar Card (Mandatory)',
      'Landholding Documentation / Jamabandi Copy',
      'Bank Account Passbook (Aadhaar-seeded)',
      'Mobile Number linked to Aadhaar'
    ],
    state: 'Central',
    category: 'Agriculture',
    applicationLink: 'https://pmkisan.gov.in/'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    department: 'Ministry of Health and Family Welfare',
    objective: 'To provide free health insurance coverage to low-income and vulnerable families for secondary and tertiary care hospitalization.',
    benefitDetails: 'Cashless health insurance cover of up to ₹5 Lakh per family per year, covering over 3 days of pre-hospitalization and 15 days post-hospitalization.',
    eligibilityRules: [
      'Families must be identified in the SECC-2011 database or hold an active Ration Card (NFSA list).',
      'Typically targets families living in kutcha houses, landless households, or daily-wage labourers.',
      'No earning adult member aged 16-59 in the household.',
      'No formal government employment or high-income markers.'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Ration Card / NFSA Proof',
      'Income Certificate',
      'Family Identification Card'
    ],
    state: 'Central',
    category: 'Healthcare',
    applicationLink: 'https://pmjay.gov.in/'
  },
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    department: 'Ministry of Finance',
    objective: 'To provide collateral-free micro-loans to non-corporate, non-farm small and micro enterprises to encourage entrepreneurship and self-employment.',
    benefitDetails: 'Offers loans in three categories: Shishu (up to ₹50,000), Kishor (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh) with competitive interest rates.',
    eligibilityRules: [
      'Must be an Indian citizen starting or expanding a business.',
      'Applies to proprietary concerns, partnership firms, or micro-manufacturing/service units.',
      'Business must be non-farm related (trading, manufacturing, services).',
      'Must have a clean credit history.'
    ],
    documentsRequired: [
      'Aadhaar Card & PAN Card',
      'Business Address Proof (Lease, Utility bills)',
      'Detailed Business Plan / Project Report',
      'Last 6 months Bank Statement',
      'Category Certificate (SC/ST/OBC) if applicable'
    ],
    state: 'Central',
    category: 'Finance',
    applicationLink: 'https://www.mudra.org.in/'
  },
  {
    id: 'pm-awas-yojana',
    name: 'Pradhan Mantri Awas Yojana (PMAY - Urban & Gramin)',
    department: 'Ministry of Housing and Urban Affairs / Ministry of Rural Development',
    objective: 'To provide affordable housing with water connection, toilet, and 24x7 electricity for the rural and urban poor.',
    benefitDetails: 'Provides a credit-linked interest subsidy up to 6.5% on home loans, or a direct financial grant of ₹1.2 Lakh (plains) to ₹1.3 Lakh (hilly areas) for house construction.',
    eligibilityRules: [
      'Must be an Indian citizen.',
      'Beneficiary family must NOT own a pucca house in any part of India.',
      'Annual family income must fall into: EWS (up to ₹3 Lakh), LIG (₹3 Lakh to ₹6 Lakh), or MIG (₹6 Lakh to ₹18 Lakh).',
      'Preference is given to female co-owners.'
    ],
    documentsRequired: [
      'Aadhaar Card of all family members',
      'Income Certificate / Form 16 / Salary Slips',
      'Non-Pucca House Affidavit (Self-Declaration)',
      'Bank Account details',
      'Land ownership documents (for Gramin grants)'
    ],
    state: 'Central',
    category: 'Welfare',
    applicationLink: 'https://pmaymis.gov.in/'
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    department: 'Ministry of Finance / India Post',
    objective: 'A small deposit scheme for the girl child, launched under the "Beti Bachao Beti Padhao" campaign, to meet education and marriage expenses.',
    benefitDetails: 'Offers high interest rates (currently ~8.2%) with full tax exemption under Section 80C. Can be opened with minimum ₹250 up to ₹1.5 Lakh per year.',
    eligibilityRules: [
      'Can be opened only by the natural or legal guardian in the name of a girl child.',
      'The girl child must be an Indian resident.',
      'The age of the girl child must be below 10 years at the time of opening.',
      'Maximum of two accounts per family (three in case of twins/triplets).'
    ],
    documentsRequired: [
      'Birth Certificate of the girl child (Mandatory)',
      'Aadhaar Card & PAN Card of the Parent/Guardian',
      'Address Proof of the Guardian',
      'Passport size photos of child and guardian'
    ],
    state: 'Central',
    category: 'Welfare',
    applicationLink: 'https://www.indiapost.gov.in/'
  },
  {
    id: 'pm-swanidhi',
    name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    department: 'Ministry of Housing and Urban Affairs',
    objective: 'To provide working capital loans to street vendors to resume their livelihoods post-pandemic.',
    benefitDetails: 'Provides collateral-free working capital loans of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and ₹50,000 (3rd tranche) with a 7% interest subsidy and cashback on digital transactions.',
    eligibilityRules: [
      'Must be an Indian citizen engaged in street vending in urban/semi-urban areas.',
      'Must possess a Certificate of Vending (CoV) / Identity Card issued by Urban Local Bodies (ULBs).',
      'Vendors who have been left out of the ULB identification but have recommendation letters can also apply.'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Voter Identity Card / Driver\'s License',
      'Certificate of Vending or Letter of Recommendation (LoR)',
      'Bank Account linked with Mobile Number'
    ],
    state: 'Central',
    category: 'Finance',
    applicationLink: 'https://pmsvanidhi.mohua.gov.in/'
  },
  {
    id: 'atal-pension',
    name: 'Atal Pension Yojana (APY)',
    department: 'Ministry of Finance / PFRDA',
    objective: 'To provide a secure social security net to the unorganised sector workers during their old age.',
    benefitDetails: 'Guaranteed minimum monthly pension ranging from ₹1,000 to ₹5,000 per month after the age of 60, depending on the contribution amount and entry age.',
    eligibilityRules: [
      'Must be an Indian citizen.',
      'Age must be between 18 and 40 years.',
      'Must have a savings bank account with auto-debit facility.',
      'Must NOT be a member of any statutory social security scheme (like EPFO) and must NOT be a taxpayer.'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Active Savings Bank Account with Auto-Debit active',
      'Mobile Number'
    ],
    state: 'Central',
    category: 'Finance',
    applicationLink: 'https://www.npscra.nsdl.co.in/'
  }
];
