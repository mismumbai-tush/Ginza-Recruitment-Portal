export type RequisitionStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Closed';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface JobRequisition {
  id: string;
  title: string; // Required Position
  unitBranch?: string; // Unit/ Branch
  department: string;
  location: string; // Work Address
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceYears: string; // Experience (Select all that apply)
  highestQualification?: string; // Highest Qualification
  budgetSalary: string; // CTC
  expectedJoiningDate?: string; // Expected Joining Date
  preferredGender?: string; // Preferred Gender
  vacancies: number;
  priority: PriorityLevel;
  requestedBy: string; // Your Name
  requesterEmail: string; // Email Address
  reasonForRequisition?: string; // Reason for Requisition
  responsibilities: string; // Work Profile (Mention Key Roles)
  requiredSkills: string[]; // Required Skills
  jobTiming?: string; // Job Timing
  attachJd?: string; // Attach JD (if any)
  description: string;
  status: RequisitionStatus;
  createdAt: string;
  platformsPostedOn?: string;
  cvReceived?: number;
  cvScreened?: number;
  round1Count?: number;
  round2Count?: number;
  round3Count?: number;
  companyName?: string;
  companyLogo?: string;
  tat?: string;
}

export type CandidateStage = 
  | 'Applied' 
  | 'Screening' 
  | 'Round 1 (Technical)' 
  | 'Round 2 (Managerial)' 
  | 'Round 3 (HR & Culture)' 
  | 'Offer Sent' 
  | 'Joined' 
  | 'Rejected';

export interface InterviewEvaluation {
  roundName: 'Round 1 (Technical)' | 'Round 2 (Managerial)' | 'Round 3 (HR & Culture)';
  interviewerName: string;
  rating: number; // 1 to 5
  technicalSkillsScore?: number;
  communicationScore?: number;
  culturalFitScore?: number;
  notes: string;
  recommendation: 'Advance' | 'Hold' | 'Reject';
  evaluatedAt: string;
  interviewDate?: string;
  interviewStatus?: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string; // Position Applying For
  fullName: string; // Name
  email: string;
  phone: string; // Contact No.
  education?: string; // Education Qualification
  currentCompany: string; // Current/ Last Company Name
  currentDesignation: string;
  experienceYears: number | string; // Total Experience
  currentSalary?: string; // Current/ Last Salary/ CTC
  expectedSalary: string; // Expected Salary/ CTC
  noticePeriod: string; // Notice Period
  switchReason?: string; // Why looking to switch?
  source?: string; // Source
  sourceCategory?: string; // Source Category
  resumeFileName: string; // Resume (Attach)
  resumeSummary: string;
  skills?: string[];
  location?: string; // Current Location (City, State)
  unit?: string; // Unit
  screeningStatus?: string; // Screening Status
  screeningRemarks?: string; // Screening Remarks
  coverLetter?: string;
  stage: CandidateStage;
  appliedDate: string;
  lastUpdated: string;
  evaluations: InterviewEvaluation[];
  joiningDate?: string; // Joining Date / Date of Joining
  offeredSalary?: string; // Offered Salary / CTC
  offerLetterStatus?: string; // Offer Letter (Status)
  joiningStatus?: string; // Joining Status
  remarks?: string; // Remarks
  syncedToGoogleSheet?: boolean;
}

export interface GoogleSheetConfig {
  webhookUrl: string;
  sheetId: string;
  autoSyncOnApply: boolean;
  autoSyncOnStageChange: boolean;
  lastSyncedAt?: string;
  lastPulledAt?: string;
}
