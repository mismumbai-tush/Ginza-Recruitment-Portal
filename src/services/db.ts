import type { JobRequisition, Candidate, GoogleSheetConfig } from '../types/recruitment';

const REQUISITION_STORAGE_KEY = 'talentpulse_requisitions_v1';
const CANDIDATE_STORAGE_KEY = 'talentpulse_candidates_v1';
const GOOGLE_SHEET_CONFIG_KEY = 'talentpulse_gsheets_config_v1';



export const getRequisitions = (): JobRequisition[] => {
  const data = localStorage.getItem(REQUISITION_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  try {
    const parsed: JobRequisition[] = JSON.parse(data);
    const clean = parsed.filter(r => !['REQ-2026-001', 'REQ-2026-002', 'REQ-2026-003', 'REQ-2026-004'].includes(r.id));
    if (clean.length !== parsed.length) {
      localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify(clean));
    }
    return clean;
  } catch {
    return [];
  }
};

export const saveRequisition = (requisition: Partial<JobRequisition> & { title: string }): JobRequisition => {
  const reqs = getRequisitions();
  const newReq: JobRequisition = {
    department: 'General',
    location: 'Main Office',
    employmentType: 'Full-time',
    experienceYears: '1-3 Years',
    budgetSalary: 'Negotiable',
    vacancies: 1,
    priority: 'High',
    requestedBy: 'Manager',
    requesterEmail: 'hr@ginzalimited.com',
    responsibilities: requisition.title,
    requiredSkills: ['Communication'],
    description: requisition.title,
    ...requisition,
    id: requisition.id || `REQ-2026-${String(reqs.length + 1).padStart(3, '0')}`,
    status: requisition.status || 'Pending Approval',
    createdAt: requisition.createdAt || new Date().toISOString().split('T')[0]
  };
  const updated = [newReq, ...reqs];
  localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify(updated));
  return newReq;
};

export const updateRequisitionStatus = (id: string, status: JobRequisition['status']): void => {
  const reqs = getRequisitions();
  const updated = reqs.map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify(updated));
};

export const deleteRequisition = (id: string): void => {
  const reqs = getRequisitions();
  const updated = reqs.filter(r => r.id !== id);
  localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify(updated));
};

export const deleteCandidate = (id: string): void => {
  const cands = getCandidates();
  const updated = cands.filter(c => c.id !== id);
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(updated));
};

const CANDIDATE_DATE_MAP: Record<string, string> = {
  'SHALOMKUMAR RAJWADI': '15/05/2025',
  'VRUND PATEL': '15/05/2025',
  'YADAV NIPESH': '15/05/2025',
  'HARSH PATEL': '15/05/2025',
  'DEEPAK KAMBLE': '16/05/2025',
  'PIYUSH SINGH': '16/05/2025',
  'MAHESH BHONDE': '27/04/2026',
  'NITISH N. MIGLANI': '28/04/2026',
  'SHIVANGI DALMIA': '04/05/2026',
  'NEHA SAXENA': '17/06/2026'
};

export const getCandidates = (): Candidate[] => {
  const data = localStorage.getItem(CANDIDATE_STORAGE_KEY);
  let parsed: Candidate[] = [];
  if (!data) {
    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify([]));
    return [];
  } else {
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = [];
    }
  }

  const clean = parsed.filter(c => c && c.id && !c.id.startsWith('CAN-100'));
  if (clean.length !== parsed.length) {
    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(clean));
  }

  return clean.map(c => {
    let cleanEmail = c.email;
    if (!cleanEmail || cleanEmail.includes('candidate_') || cleanEmail.includes('applicant') || cleanEmail.toLowerCase() === 'n/a') {
      cleanEmail = 'NA';
    }

    let date = c.appliedDate;
    if (!date || date === 'NA' || date === 'N/A' || date === '') {
      const nameUpper = (c.fullName || '').toUpperCase().trim();
      date = CANDIDATE_DATE_MAP[nameUpper] || c.createdAt || '15/05/2025';
    }

    return {
      ...c,
      email: cleanEmail,
      appliedDate: date
    };
  });
};

export const saveCandidate = (candidateData: Partial<Candidate> & { fullName: string; jobId: string; jobTitle: string; email: string; phone: string }): Candidate => {
  const candidates = getCandidates();
  const newCandidate: Candidate = {
    currentCompany: candidateData.currentCompany || 'N/A',
    currentDesignation: candidateData.currentDesignation || 'Applicant',
    experienceYears: candidateData.experienceYears || '1 Year',
    expectedSalary: candidateData.expectedSalary || 'Negotiable',
    noticePeriod: candidateData.noticePeriod || 'Immediate',
    resumeFileName: candidateData.resumeFileName || `${candidateData.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
    resumeSummary: candidateData.resumeSummary || `Application for ${candidateData.jobTitle}`,
    ...candidateData,
    id: candidateData.id || `CAN-${String(candidates.length + 1001)}`,
    stage: candidateData.stage || 'Applied',
    appliedDate: candidateData.appliedDate || new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    evaluations: candidateData.evaluations || [],
    syncedToGoogleSheet: false
  };
  const updated = [newCandidate, ...candidates];
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(updated));
  return newCandidate;
};

export const updateCandidateStage = (id: string, stage: Candidate['stage'], joiningDetails?: { offeredSalary?: string; joiningDate?: string }): Candidate | null => {
  const candidates = getCandidates();
  let updatedCandidate: Candidate | null = null;
  const updated = candidates.map(c => {
    if (c.id === id) {
      updatedCandidate = {
        ...c,
        stage,
        lastUpdated: new Date().toISOString().split('T')[0],
        offeredSalary: joiningDetails?.offeredSalary || c.offeredSalary,
        joiningDate: joiningDetails?.joiningDate || c.joiningDate,
        syncedToGoogleSheet: false // trigger re-sync on stage update
      };
      return updatedCandidate;
    }
    return c;
  });
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(updated));
  return updatedCandidate;
};

export const addInterviewEvaluation = (candidateId: string, evaluation: Omit<Candidate['evaluations'][0], 'evaluatedAt'>): Candidate | null => {
  const candidates = getCandidates();
  let updatedCandidate: Candidate | null = null;
  const updated = candidates.map(c => {
    if (c.id === candidateId) {
      const newEval = {
        ...evaluation,
        evaluatedAt: new Date().toISOString().split('T')[0]
      };
      const existingEvals = c.evaluations.filter(e => e.roundName !== evaluation.roundName);
      updatedCandidate = {
        ...c,
        evaluations: [...existingEvals, newEval],
        lastUpdated: new Date().toISOString().split('T')[0],
        syncedToGoogleSheet: false
      };
      return updatedCandidate;
    }
    return c;
  });
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(updated));
  return updatedCandidate;
};

export const getGoogleSheetConfig = (): GoogleSheetConfig => {
  const data = localStorage.getItem(GOOGLE_SHEET_CONFIG_KEY);
  if (!data) {
    const defaultConfig: GoogleSheetConfig = {
      webhookUrl: 'https://script.google.com/macros/s/AKfycbwUrDnuL5XfaRfB6pd-tw2xGyFnjPDzQxr_yPV41f2xcsyu25VLfl9qG1MdVO1KSAjwww/exec',
      sheetId: '1vm0QcEvXniTJhLZEhegemqncddZgaExsyP6ONlJKyK8',
      autoSyncOnApply: true,
      autoSyncOnStageChange: true
    };
    localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
  const parsed = JSON.parse(data);
  if (!parsed.sheetId) parsed.sheetId = '1vm0QcEvXniTJhLZEhegemqncddZgaExsyP6ONlJKyK8';
  if (!parsed.webhookUrl) parsed.webhookUrl = 'https://script.google.com/macros/s/AKfycbwUrDnuL5XfaRfB6pd-tw2xGyFnjPDzQxr_yPV41f2xcsyu25VLfl9qG1MdVO1KSAjwww/exec';
  return parsed;
};

export const saveGoogleSheetConfig = (config: GoogleSheetConfig): void => {
  localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(config));
};

export const markCandidateSynced = (candidateId: string): void => {
  const candidates = getCandidates();
  const updated = candidates.map(c => c.id === candidateId ? { ...c, syncedToGoogleSheet: true } : c);
  localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(updated));
};
