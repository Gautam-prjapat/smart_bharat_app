export type ComplaintCategory =
  | 'Roads & Potholes'
  | 'Waste Management'
  | 'Streetlights'
  | 'Water Supply'
  | 'Public Health'
  | 'Others';

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Submitted' | 'In Review' | 'In Progress' | 'Resolved';

export interface CivicComplaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  location: string;
  state: string;
  status: ComplaintStatus;
  createdAt: string;
  citizenName: string;
  upvotes: number;
  officialResponse?: string;
  aiGeneratedLetter?: string;
  aiGrievanceTags?: string[];
}

export interface GovScheme {
  id: string;
  name: string;
  department: string;
  objective: string;
  eligibilityRules: string[];
  documentsRequired: string[];
  benefitDetails: string;
  state: string; // "Central" or state name
  category: string; // e.g., Agriculture, Healthcare, Education, Finance, Welfare
  applicationLink?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface EligibilityProfile {
  age: number;
  state: string;
  annualIncome: number;
  occupation: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  gender: 'Male' | 'Female' | 'Other' | 'Any';
}

export interface SchemeMatchResult {
  schemeId: string;
  name: string;
  matchPercentage: number;
  reason: string;
  eligibilityChecklist: { condition: string; met: boolean }[];
  actionSteps: string[];
}
