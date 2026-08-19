import type { JobRequisition, Candidate, GoogleSheetConfig } from '../types/recruitment';

const REQUISITION_STORAGE_KEY = 'talentpulse_requisitions_v1';
const CANDIDATE_STORAGE_KEY = 'talentpulse_candidates_v1';
const GOOGLE_SHEET_CONFIG_KEY = 'talentpulse_gsheets_config_v1';

const INITIAL_REQUISITIONS: JobRequisition[] = [
  {
    id: 'REQ-2026-001',
    companyName: 'Ginza Industries Ltd.',
    companyLogo: 'https://www.ginzalimited.com/cdn/shop/files/Ginza_logo.jpg?v=1668509673&width=500',
    title: 'Senior Full Stack Software Engineer',
    department: 'Engineering',
    location: 'Mumbai / Remote',
    employmentType: 'Full-time',
    experienceYears: '4 - 7 Years',
    budgetSalary: '₹22,000,000 - ₹32,000,000 / Year',
    vacancies: 3,
    priority: 'Urgent',
    requestedBy: 'Rajesh Sharma (VP Engineering)',
    requesterEmail: 'rajesh.s@ginzalimited.com',
    responsibilities: 'Design and deploy scalable React, Node.js microservices & IoT manufacturing telemetry software. Oversee AWS cloud infrastructure.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    description: 'Lead engineering initiatives for Ginza Industries smart factory automation and digital HR portals.',
    status: 'Published',
    createdAt: '2026-08-01'
  },
  {
    id: 'REQ-2026-002',
    companyName: 'Meta',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    title: 'Senior AI System Architect (Reality Labs)',
    department: 'Engineering',
    location: 'Menlo Park, CA (Hybrid)',
    employmentType: 'Full-time',
    experienceYears: '5+ Years',
    budgetSalary: '$220,000 - $310,000 / Year',
    vacancies: 2,
    priority: 'Urgent',
    requestedBy: 'Mark Z. (Engineering Lead)',
    requesterEmail: 'careers@meta.com',
    responsibilities: 'Build real-time neural rendering and AI spatial compute models for next-gen Metaverse platforms.',
    requiredSkills: ['PyTorch', 'C++', 'CUDA', 'Spatial AI', 'Computer Vision'],
    description: 'Shape the future of immersive computing at Meta Reality Labs.',
    status: 'Published',
    createdAt: '2026-08-02'
  },
  {
    id: 'REQ-2026-003',
    companyName: 'Google',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    title: 'Staff Cloud Infrastructure Engineer (Google Cloud)',
    department: 'Engineering',
    location: 'Mountain View, CA',
    employmentType: 'Full-time',
    experienceYears: '6+ Years',
    budgetSalary: '$240,000 - $340,000 / Year',
    vacancies: 4,
    priority: 'High',
    requestedBy: 'Sundar P. (Cloud Lead)',
    requesterEmail: 'cloud-hiring@google.com',
    responsibilities: 'Architect ultra-low latency distributed Kubernetes clusters and AI TPU infrastructure for enterprise cloud.',
    requiredSkills: ['Go', 'Kubernetes', 'GCP', 'Distributed Systems', 'Linux Kernel'],
    description: 'Power massive global enterprise workloads on Google Cloud Platform.',
    status: 'Published',
    createdAt: '2026-08-03'
  },
  {
    id: 'REQ-2026-004',
    companyName: 'Amazon',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    title: 'Principal Distributed Systems Engineer (AWS)',
    department: 'Engineering',
    location: 'Seattle, WA (Hybrid)',
    employmentType: 'Full-time',
    experienceYears: '7+ Years',
    budgetSalary: '$230,000 - $325,000 / Year',
    vacancies: 2,
    priority: 'Urgent',
    requestedBy: 'Andy J. (AWS Lead)',
    requesterEmail: 'aws-careers@amazon.com',
    responsibilities: 'Design multi-region DynamoDB & S3 core engine protocols with 99.999% availability SLAs.',
    requiredSkills: ['Java', 'Rust', 'AWS DynamoDB', 'Distributed Consensus', 'System Design'],
    description: 'Build mission-critical AWS cloud services powering top Fortune 500 enterprises.',
    status: 'Published',
    createdAt: '2026-08-04'
  }
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-1001',
    jobId: 'REQ-2026-001',
    jobTitle: 'Senior Full Stack Software Engineer',
    fullName: 'Alex Vance',
    email: 'alex.vance@techmail.com',
    phone: '+1 (555) 234-8901',
    currentCompany: 'CloudNative Inc.',
    currentDesignation: 'Senior Frontend Developer',
    experienceYears: 5,
    expectedSalary: '$145,000',
    noticePeriod: '30 Days',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL'],
    resumeFileName: 'Alex_Vance_Resume_2026.pdf',
    resumeSummary: 'Full-Stack Developer with 5 years experience building enterprise SaaS applications. Expert in React state management, backend API architecture, and CI/CD pipelines.',
    coverLetter: 'I am passionate about building scalable, high-performance web applications and would love to contribute to your engineering team.',
    stage: 'Round 1 (Technical)',
    appliedDate: '2026-08-02',
    lastUpdated: '2026-08-04',
    evaluations: [
      {
        roundName: 'Round 1 (Technical)',
        interviewerName: 'David Miller',
        rating: 4.5,
        technicalSkillsScore: 5,
        communicationScore: 4,
        culturalFitScore: 4.5,
        notes: 'Demonstrated exceptional understanding of React performance optimization, custom hooks, and distributed system design. Solved live coding challenge smoothly.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-04'
      }
    ],
    syncedToGoogleSheet: true
  },
  {
    id: 'CAN-1002',
    jobId: 'REQ-2026-001',
    jobTitle: 'Senior Full Stack Software Engineer',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@devhub.org',
    phone: '+1 (555) 456-7890',
    currentCompany: 'FinTech Solutions',
    currentDesignation: 'Lead Software Engineer',
    experienceYears: 6,
    expectedSalary: '$155,000',
    noticePeriod: '15 Days',
    skills: ['TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'Redis'],
    resumeFileName: 'Priya_Sharma_CV.pdf',
    resumeSummary: 'Backend & Systems Architect with 6+ years experience. Led microservices migration resulting in 40% speed optimization.',
    coverLetter: 'Seeking senior technical role where I can drive platform architecture and mentor junior developers.',
    stage: 'Round 2 (Managerial)',
    appliedDate: '2026-08-01',
    lastUpdated: '2026-08-05',
    evaluations: [
      {
        roundName: 'Round 1 (Technical)',
        interviewerName: 'David Miller',
        rating: 5,
        technicalSkillsScore: 5,
        communicationScore: 5,
        culturalFitScore: 5,
        notes: 'Top tier technical skills. Excellent architectural clarity and problem solving.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-03'
      },
      {
        roundName: 'Round 2 (Managerial)',
        interviewerName: 'Sarah Jenkins',
        rating: 4.8,
        technicalSkillsScore: 4.5,
        communicationScore: 5,
        culturalFitScore: 5,
        notes: 'Strong leadership traits, clear product mindset, and great alignment with team vision.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-05'
      }
    ],
    syncedToGoogleSheet: true
  },
  {
    id: 'CAN-1003',
    jobId: 'REQ-2026-002',
    jobTitle: 'Lead Product Designer (UI/UX)',
    fullName: 'Elena Rostova',
    email: 'elena.design@studio.io',
    phone: '+1 (555) 789-0123',
    currentCompany: 'Creative Design Lab',
    currentDesignation: 'Senior UI/UX Specialist',
    experienceYears: 7,
    expectedSalary: '$130,000',
    noticePeriod: 'Immediate',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    resumeFileName: 'Elena_Rostova_Portfolio.pdf',
    resumeSummary: 'Award-winning Product Designer with 7 years experience designing multi-platform mobile & web applications used by 2M+ active users.',
    stage: 'Round 3 (HR & Culture)',
    appliedDate: '2026-08-02',
    lastUpdated: '2026-08-05',
    evaluations: [
      {
        roundName: 'Round 1 (Technical)',
        interviewerName: 'Sarah Jenkins',
        rating: 4.7,
        technicalSkillsScore: 5,
        communicationScore: 4.5,
        culturalFitScore: 4.5,
        notes: 'Stunning Figma design portfolio walkthrough. Showcased robust design system methodology.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-03'
      },
      {
        roundName: 'Round 2 (Managerial)',
        interviewerName: 'Mark Thompson (VP Product)',
        rating: 4.9,
        technicalSkillsScore: 5,
        communicationScore: 4.8,
        culturalFitScore: 4.9,
        notes: 'Exceptional strategic design vision. Great team collaborator.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-04'
      }
    ],
    syncedToGoogleSheet: true
  },
  {
    id: 'CAN-1004',
    jobId: 'REQ-2026-001',
    jobTitle: 'Senior Full Stack Software Engineer',
    fullName: 'Michael Chen',
    email: 'm.chen@innovate.co',
    phone: '+1 (555) 890-1234',
    currentCompany: 'DataPulse',
    currentDesignation: 'Full Stack Engineer',
    experienceYears: 4,
    expectedSalary: '$140,000',
    noticePeriod: '30 Days',
    skills: ['React', 'Python', 'PostgreSQL', 'Docker'],
    resumeFileName: 'Michael_Chen_Resume.pdf',
    resumeSummary: 'Full stack engineer with expertise in data visualization dashboards and RESTful API engineering.',
    stage: 'Offer Sent',
    appliedDate: '2026-07-28',
    lastUpdated: '2026-08-05',
    offeredSalary: '$142,000',
    joiningDate: '2026-09-01',
    evaluations: [
      {
        roundName: 'Round 1 (Technical)',
        interviewerName: 'David Miller',
        rating: 4.5,
        notes: 'Solid engineering fundamentals.',
        recommendation: 'Advance',
        evaluatedAt: '2026-07-30'
      },
      {
        roundName: 'Round 2 (Managerial)',
        interviewerName: 'Sarah Jenkins',
        rating: 4.7,
        notes: 'Strong alignment with product goals.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-01'
      },
      {
        roundName: 'Round 3 (HR & Culture)',
        interviewerName: 'Rachel Green (HR Lead)',
        rating: 5,
        notes: 'Salary expectation aligned. Approved for Offer.',
        recommendation: 'Advance',
        evaluatedAt: '2026-08-03'
      }
    ],
    syncedToGoogleSheet: true
  },
  {
    id: 'CAN-1005',
    jobId: 'REQ-2026-003',
    jobTitle: 'Data Platform Engineer',
    fullName: 'Marcus Brody',
    email: 'marcus.brody@analytics.com',
    phone: '+1 (555) 321-6547',
    currentCompany: 'BigData Inc.',
    currentDesignation: 'Junior Data Engineer',
    experienceYears: 2,
    expectedSalary: '$110,000',
    noticePeriod: 'Immediate',
    skills: ['Python', 'SQL', 'Pandas'],
    resumeFileName: 'Marcus_Brody_Resume.pdf',
    resumeSummary: 'Data analyst transitioning to data engineering with hands-on experience in SQL ETL scripts.',
    stage: 'Screening',
    appliedDate: '2026-08-04',
    lastUpdated: '2026-08-04',
    evaluations: [],
    syncedToGoogleSheet: false
  }
];

export const getRequisitions = (): JobRequisition[] => {
  const data = localStorage.getItem(REQUISITION_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(REQUISITION_STORAGE_KEY, JSON.stringify(INITIAL_REQUISITIONS));
    return INITIAL_REQUISITIONS;
  }
  return JSON.parse(data);
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
    parsed = INITIAL_CANDIDATES;
    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
  } else {
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = INITIAL_CANDIDATES;
    }
  }

  return parsed.map(c => {
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
