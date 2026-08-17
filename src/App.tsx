import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RequisitionForm } from './components/RequisitionForm';
import { RequisitionList } from './components/RequisitionList';
import { PublicJobPortal } from './components/PublicJobPortal';
import { CandidateApplicationModal } from './components/CandidateApplicationModal';
import { ATSKanbanBoard } from './components/ATSKanbanBoard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';

import {
  getRequisitions,
  saveRequisition,
  updateRequisitionStatus,
  deleteRequisition,
  getCandidates,
  saveCandidate,
  updateCandidateStage,
  deleteCandidate,
  addInterviewEvaluation,
  getGoogleSheetConfig,
  saveGoogleSheetConfig
} from './services/db';

import {
  syncCandidateToGoogleSheet,
  syncRequisitionToGoogleSheet,
  getValueByFlexibleKey,
  exportCandidatesToCSV
} from './services/googleSheets';

import type { JobRequisition, Candidate, CandidateStage, GoogleSheetConfig, InterviewEvaluation } from './types/recruitment';

export function App() {
  const [currentRole, setCurrentRole] = useState<'manager' | 'hr' | 'candidate'>('hr');
  const [activeTab, setActiveTab] = useState<string>('ats');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('talentpulse_theme_v1') as 'dark' | 'light') || 'dark';
  });

  const [requisitions, setRequisitions] = useState<JobRequisition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [gsheetConfig, setGsheetConfig] = useState<GoogleSheetConfig>({
    webhookUrl: '',
    sheetId: '',
    autoSyncOnApply: true,
    autoSyncOnStageChange: true
  });

  // Modal Controls
  const [showReqForm, setShowReqForm] = useState(false);
  const [applyingJob, setApplyingJob] = useState<JobRequisition | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showGSheetsModal, setShowGSheetsModal] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.body.className = `theme-${themeMode}`;
    localStorage.setItem('talentpulse_theme_v1', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const reqs = getRequisitions();
    setRequisitions(reqs);
    setCandidates(getCandidates());
    setGsheetConfig(getGoogleSheetConfig());

    // Check for direct shareable job application link (e.g. ?apply=REQ-2026-001 or ?job=REQ-2026-001)
    const urlParams = new URLSearchParams(window.location.search);
    const applyJobId = urlParams.get('apply') || urlParams.get('job');
    if (applyJobId) {
      const targetJob = reqs.find(r => r.id === applyJobId);
      if (targetJob) {
        setApplyingJob(targetJob);
        setActiveTab('portal');
        setCurrentRole('candidate');
      }
    }
  }, []);

  const handleToggleTheme = () => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      triggerToast(`Switched to ${next === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}`);
      return next;
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Requisition Handlers
  const handleSaveRequisition = async (reqData: Omit<JobRequisition, 'id' | 'createdAt' | 'status'>) => {
    const newReq = saveRequisition(reqData);
    setRequisitions(getRequisitions());
    setShowReqForm(false);
    triggerToast(`Job requirement template '${newReq.title}' created & sent for HR approval!`);

    if (gsheetConfig.webhookUrl) {
      await syncRequisitionToGoogleSheet(newReq, gsheetConfig);
      triggerToast(`Synced MRF requirement '${newReq.title}' to Google Sheet!`);
    }
  };

  const handleUpdateReqStatus = async (id: string, status: JobRequisition['status']) => {
    updateRequisitionStatus(id, status);
    const updatedList = getRequisitions();
    setRequisitions(updatedList);
    triggerToast(`Requisition updated status to ${status}!`);

    const targetReq = updatedList.find(r => r.id === id);
    if (targetReq && gsheetConfig.webhookUrl) {
      await syncRequisitionToGoogleSheet(targetReq, gsheetConfig);
    }
  };

  // Handle data pulled live from Google Sheets (MRF and Candidates tabs)
  const handleImportSheetData = (mrfRows: Record<string, any>[], candidateRows: Record<string, any>[]) => {
    let mrfImportedCount = 0;
    let candidateImportedCount = 0;

    // Process MRF Rows matching user's exact columns
    if (mrfRows && mrfRows.length > 0) {
      const existingReqs = getRequisitions();
      mrfRows.forEach((row, idx) => {
        const title = getValueByFlexibleKey(row, ['Required Position', 'Title', 'Job Title', 'Position', 'Requirement', 'MRF Title', 'Role']);
        if (title) {
          const reqId = getValueByFlexibleKey(row, ['MRF ID', 'ID', 'Requisition ID', 'MRF No']) || `MRF-GS-${idx + 1}`;
          const existing = existingReqs.find(r => r.id === reqId || r.title === title);
          if (!existing) {
            saveRequisition({
              title,
              unitBranch: getValueByFlexibleKey(row, ['Unit/ Branch', 'Unit', 'Branch']),
              department: getValueByFlexibleKey(row, ['Department', 'Dept', 'Team']) || 'General',
              location: getValueByFlexibleKey(row, ['Work Address (Unit work address with street number and pin code)', 'Work Address', 'Location', 'City']) || 'Main Branch',
              employmentType: 'Full-time',
              experienceYears: getValueByFlexibleKey(row, ['Experience (Select all that apply)', 'Experience', 'Exp Required']) || '2 - 5 Years',
              highestQualification: getValueByFlexibleKey(row, ['Highest Qualification', 'Qualification']),
              budgetSalary: getValueByFlexibleKey(row, ['CTC', 'Budget Salary', 'Budget', 'Package']) || 'As per industry standards',
              expectedJoiningDate: getValueByFlexibleKey(row, ['Expected Joining Date', 'Joining Date']),
              preferredGender: getValueByFlexibleKey(row, ['Preferred Gender', 'Gender']),
              vacancies: Number(getValueByFlexibleKey(row, ['Vacancies', 'Headcount', 'No of Positions'])) || 1,
              priority: (getValueByFlexibleKey(row, ['Priority', 'Importance']) as any) || 'High',
              requestedBy: getValueByFlexibleKey(row, ['Your Name', 'Requested By', 'Requester', 'Hiring Manager']) || 'Department Manager',
              requesterEmail: getValueByFlexibleKey(row, ['Email Address', 'Email', 'Requester Email']) || 'hr@company.com',
              reasonForRequisition: getValueByFlexibleKey(row, ['Reason for Requisition', 'Reason']),
              responsibilities: getValueByFlexibleKey(row, ['Work Profile (Mention Key Roles)', 'Work Profile', 'Responsibilities']) || 'Key role requirements as specified in MRF.',
              requiredSkills: (getValueByFlexibleKey(row, ['Required Skills', 'Skills', 'Tech Stack']) || 'Communication, Relevant Skills').split(',').map(s => s.trim()),
              jobTiming: getValueByFlexibleKey(row, ['Job Timing', 'Timing', 'Shift']),
              attachJd: getValueByFlexibleKey(row, ['Attach JD (if any)', 'JD']),
              description: getValueByFlexibleKey(row, ['Remarks', 'Description', 'Notes']) || `MRF Requirement for ${title}`,
              platformsPostedOn: getValueByFlexibleKey(row, ['Platforms Posted On', 'Platforms']),
              cvReceived: Number(getValueByFlexibleKey(row, ['CV Received'])) || 0,
              cvScreened: Number(getValueByFlexibleKey(row, ['CV Screened'])) || 0,
              round1Count: Number(getValueByFlexibleKey(row, ['1st Round Interview'])) || 0,
              round2Count: Number(getValueByFlexibleKey(row, ['2nd Round Interview'])) || 0,
              round3Count: Number(getValueByFlexibleKey(row, ['3rd Round Interview'])) || 0,
              tat: getValueByFlexibleKey(row, ['TAT']),
            });
            mrfImportedCount++;
          }
        }
      });
      setRequisitions(getRequisitions());
    }

    // Process Candidate Rows matching user's exact columns
    if (candidateRows && candidateRows.length > 0) {
      // Purge default sample mock candidates if sheet candidates exist to keep counts exact
      let existingCandidates = getCandidates().filter(c => !c.id.startsWith('CAN-100'));

      candidateRows.forEach((row, idx) => {
        const fullName = getValueByFlexibleKey(row, ['Name', 'Full Name', 'Candidate Name', 'Applicant Name']);
        if (fullName) {
          const candId = getValueByFlexibleKey(row, ['Candidate ID', 'ID', 'App ID', 'Ref ID']) || `CAND-GS-${idx + 1}`;
          const existing = existingCandidates.find(c => c.id === candId || (c.fullName === fullName && c.email === getValueByFlexibleKey(row, ['Email', 'Email Address'])));
          if (!existing) {
            // Determine candidate stage dynamically from interview statuses
            let derivedStage: CandidateStage = 'Applied';
            const screeningStatus = getValueByFlexibleKey(row, ['Screening Status']);
            const r1Status = getValueByFlexibleKey(row, ['1st Interview Status']);
            const r2Status = getValueByFlexibleKey(row, ['2nd Interview Status']);
            const r3Status = getValueByFlexibleKey(row, ['3rd Interview Status']);
            const offerStatus = getValueByFlexibleKey(row, ['Offer Letter (Status)', 'Offer negotiation Status']);
            const joiningStatus = getValueByFlexibleKey(row, ['Joining Status']);

            if (joiningStatus && joiningStatus.toLowerCase().includes('joined')) derivedStage = 'Joined';
            else if (offerStatus && offerStatus.toLowerCase().includes('offer')) derivedStage = 'Offer Sent';
            else if (r3Status) derivedStage = 'Round 3 (HR & Culture)';
            else if (r2Status) derivedStage = 'Round 2 (Managerial)';
            else if (r1Status) derivedStage = 'Round 1 (Technical)';
            else if (screeningStatus) derivedStage = 'Screening';

            // Build evaluations from interview rounds
            const evaluations: any[] = [];
            const r1Name = getValueByFlexibleKey(row, ['1st Interviewer Name']);
            const r1Rem = getValueByFlexibleKey(row, ['1st Interview Remarks']);
            if (r1Name || r1Rem || r1Status) {
              evaluations.push({
                roundName: 'Round 1 (Technical)',
                interviewerName: r1Name || 'Round 1 Panel',
                rating: 4,
                notes: r1Rem || `Status: ${r1Status || 'Completed'}`,
                recommendation: (r1Status && r1Status.toLowerCase().includes('reject')) ? 'Reject' : 'Advance',
                evaluatedAt: getValueByFlexibleKey(row, ['1st Interview Date']) || new Date().toISOString()
              });
            }

            const r2Name = getValueByFlexibleKey(row, ['2nd Interviewer Name', '2nd Interview Name']);
            const r2Rem = getValueByFlexibleKey(row, ['2nd Interview Remarks']);
            if (r2Name || r2Rem || r2Status) {
              evaluations.push({
                roundName: 'Round 2 (Managerial)',
                interviewerName: r2Name || 'Round 2 Panel',
                rating: 4,
                notes: r2Rem || `Status: ${r2Status || 'Completed'}`,
                recommendation: (r2Status && r2Status.toLowerCase().includes('reject')) ? 'Reject' : 'Advance',
                evaluatedAt: getValueByFlexibleKey(row, ['2nd Interview Date']) || new Date().toISOString()
              });
            }

            const r3Name = getValueByFlexibleKey(row, ['3rd Interviewer Name']);
            const r3Rem = getValueByFlexibleKey(row, ['3rd Interview Remarks']);
            if (r3Name || r3Rem || r3Status) {
              evaluations.push({
                roundName: 'Round 3 (HR & Culture)',
                interviewerName: r3Name || 'HR Panel',
                rating: 4,
                notes: r3Rem || `Status: ${r3Status || 'Completed'}`,
                recommendation: (r3Status && r3Status.toLowerCase().includes('reject')) ? 'Reject' : 'Advance',
                evaluatedAt: getValueByFlexibleKey(row, ['3rd Interview Date']) || new Date().toISOString()
              });
            }

            const rawEmail = getValueByFlexibleKey(row, ['Email', 'Email Address', 'EmailId', 'Mail']);
            const emailClean = rawEmail && rawEmail.toLowerCase() !== 'n/a' && rawEmail.toLowerCase() !== 'na' && !rawEmail.includes('applicant') && !rawEmail.includes('candidate_') ? rawEmail : 'NA';

            const newCand: Candidate = {
              id: candId,
              jobId: 'REQ-2026-001',
              jobTitle: getValueByFlexibleKey(row, ['Position Applying For', 'Position', 'Applied Role', 'Role']) || 'General Applicant',
              fullName,
              email: emailClean,
              phone: getValueByFlexibleKey(row, ['Contact No.', 'Contact No', 'Phone', 'Mobile']) || 'NA',
              educationQualification: getValueByFlexibleKey(row, ['Education Qualification', 'Qualification']),
              currentCompany: getValueByFlexibleKey(row, ['Current/ Last Company Name', 'Current Company', 'Company']) || 'N/A',
              currentDesignation: getValueByFlexibleKey(row, ['Position Month-Year', 'Current Designation', 'Designation']) || 'Applicant',
              noticePeriod: getValueByFlexibleKey(row, ['Notice Period', 'Notice']) || 'N/A',
              experienceYears: getValueByFlexibleKey(row, ['Total Experience', 'Total Experience ', 'Experience']) || 'N/A',
              currentSalary: getValueByFlexibleKey(row, ['Current/ Last Salary/ CTC', 'Current Salary']),
              expectedSalary: getValueByFlexibleKey(row, ['Expected Salary/ CTC', 'Expected Salary']) || 'N/A',
              whyLookingToSwitch: getValueByFlexibleKey(row, ['Why looking to switch?']),
              source: getValueByFlexibleKey(row, ['Source', 'Source Category']) || 'Google Sheet Import',
              resumeFileName: getValueByFlexibleKey(row, ['Resume (Attach)', 'Resume']) || `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
              resumeSummary: `Imported from Google Sheet Candidates Tab.`,
              location: getValueByFlexibleKey(row, ['Current Location (City, State)', 'Location', 'City']),
              sourceCategory: getValueByFlexibleKey(row, ['Source Category']),
              unit: getValueByFlexibleKey(row, ['Unit', 'Branch']),
              screeningStatus: getValueByFlexibleKey(row, ['Screening Status']),
              screeningRemarks: getValueByFlexibleKey(row, ['Screening Remarks']),
              sendMessageToUnreachable: getValueByFlexibleKey(row, ['Send Message to Unreachable']),
              messageSent: getValueByFlexibleKey(row, ['Message Sent']),
              positionMonthYear: getValueByFlexibleKey(row, ['Position Month-Year']),
              joiningDate: getValueByFlexibleKey(row, ['Joining Date', 'Date of Joining']),
              offeredSalary: getValueByFlexibleKey(row, ['Offered Salary /  CTC', 'Offered Salary / CTC']),
              offerNegotiationDate: getValueByFlexibleKey(row, ['Offer Negotiation Date']),
              offerNegotiationStatus: getValueByFlexibleKey(row, ['Offer negotiation Status']),
              hrDiscussionDate: getValueByFlexibleKey(row, ['HR Discussion (Date)']),
              hrRemarksStatus: getValueByFlexibleKey(row, ['HR Remarks Status']),
              offerLetterShareDate: getValueByFlexibleKey(row, ['Offer Letter Share (Date)']),
              offerLetterAcceptanceDate: getValueByFlexibleKey(row, ['Offer Letter Acceptance (Date)']),
              offerLetterStatus: getValueByFlexibleKey(row, ['Offer Letter (Status)']),
              monthOfJoining: getValueByFlexibleKey(row, ['Month of joining']),
              joiningStatus: getValueByFlexibleKey(row, ['Joining Status']),
              remarks: getValueByFlexibleKey(row, ['Remarks']),
              hiringAgencyCharges: getValueByFlexibleKey(row, ['Hiring/ Agency Charges']),
              stage: derivedStage,
              appliedDate: String(row['Timestamp'] || row['appliedDate'] || (Object.keys(row).length > 0 ? row[Object.keys(row)[0]] : '') || getValueByFlexibleKey(row, ['Timestamp', 'Applied Date', 'Date']) || '15/05/2025').trim(),
              lastUpdated: new Date().toISOString().split('T')[0],
              evaluations,
              syncedToGoogleSheet: true
            };

            existingCandidates.push(newCand);
            candidateImportedCount++;
          }
        }
      });
      localStorage.setItem('talentpulse_candidates_v1', JSON.stringify(existingCandidates));
      setCandidates(existingCandidates);
    }

    triggerToast(`📊 Imported ${mrfImportedCount} new MRFs and ${candidateImportedCount} candidates from your Google Sheet! Total candidate count: ${getCandidates().length}`);
  };

  const handlePurgeMockData = () => {
    const currentCands = getCandidates();
    const filtered = currentCands.filter(c => !c.id.startsWith('CAN-100'));
    localStorage.setItem('talentpulse_candidates_v1', JSON.stringify(filtered));
    setCandidates(filtered);
    triggerToast(`🧹 Removed mock demo applicants! Total real sheet candidates count: ${filtered.length}`);
  };

  // Candidate Application Submission
  const handleSubmitApplication = async (candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'lastUpdated' | 'stage' | 'evaluations'>) => {
    const newCandidate = saveCandidate(candidateData);
    setCandidates(getCandidates());
    setApplyingJob(null);
    triggerToast(`Application submitted successfully for ${newCandidate.fullName}!`);

    // Auto sync to Google Sheets if configured
    if (gsheetConfig.webhookUrl && gsheetConfig.autoSyncOnApply) {
      const res = await syncCandidateToGoogleSheet(newCandidate, gsheetConfig);
      if (res.success) {
        setCandidates(getCandidates());
        triggerToast(`Synced ${newCandidate.fullName} directly to Google Sheet!`);
      }
    }
  };

  // ATS Stage Change
  const handleUpdateStage = async (id: string, stage: CandidateStage, joiningDetails?: { offeredSalary?: string; joiningDate?: string }) => {
    const updated = updateCandidateStage(id, stage, joiningDetails);
    setCandidates(getCandidates());
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate(updated);
    }
    triggerToast(`Candidate stage changed to '${stage}'`);

    if (updated && gsheetConfig.webhookUrl && gsheetConfig.autoSyncOnStageChange) {
      await syncCandidateToGoogleSheet(updated, gsheetConfig);
      setCandidates(getCandidates());
    }
  };

  // Interview Evaluation
  const handleAddEvaluation = async (candidateId: string, evalData: Omit<InterviewEvaluation, 'evaluatedAt'>) => {
    const updated = addInterviewEvaluation(candidateId, evalData);
    setCandidates(getCandidates());
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(updated);
    }
    triggerToast(`Added ${evalData.roundName} evaluation scorecard!`);

    if (updated && gsheetConfig.webhookUrl) {
      await syncCandidateToGoogleSheet(updated, gsheetConfig);
      setCandidates(getCandidates());
    }
  };

  // Single Candidate Sync
  const handleSyncSingle = async (candidate: Candidate) => {
    if (!gsheetConfig.webhookUrl) {
      setShowGSheetsModal(true);
      return;
    }
    const res = await syncCandidateToGoogleSheet(candidate, gsheetConfig);
    setCandidates(getCandidates());
    triggerToast(res.message);
  };

  // Save Google Sheets Config
  const handleSaveGSheetConfig = (config: GoogleSheetConfig) => {
    saveGoogleSheetConfig(config);
    setGsheetConfig(config);
    triggerToast('✅ Google Sheets configuration saved!');
  };

  const handleDeleteRequisition = (id: string) => {
    deleteRequisition(id);
    const updated = getRequisitions();
    setRequisitions(updated);
    triggerToast(`🗑️ Permanently deleted requirement record.`);
  };

  const handleDeleteCandidate = (id: string) => {
    deleteCandidate(id);
    const updated = getCandidates();
    setCandidates(updated);
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate(null);
    }
    triggerToast(`🗑️ Permanently deleted candidate record.`);
  };

  const publishedJobs = requisitions.filter(r => r.status === 'Published');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gsheetConfig={gsheetConfig}
        onOpenGSheetsModal={() => setShowGSheetsModal(true)}
        onExportCSV={() => exportCandidatesToCSV(candidates)}
        onPurgeMockData={handlePurgeMockData}
        candidateCount={candidates.length}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm" style={{animation: 'slideUp 0.3s ease-out'}}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* View 1: ATS Pipeline */}
        {activeTab === 'ats' && (
          <ATSKanbanBoard
            candidates={candidates}
            onSelectCandidate={candidate => setSelectedCandidate(candidate)}
            onUpdateStage={handleUpdateStage}
            onDeleteCandidate={handleDeleteCandidate}
          />
        )}

        {/* View 2: Requisition Templates */}
        {activeTab === 'requisitions' && (
          showReqForm ? (
            <RequisitionForm
              onSubmit={handleSaveRequisition}
              onCancel={() => setShowReqForm(false)}
            />
          ) : (
            <RequisitionList
              requisitions={requisitions}
              onUpdateStatus={handleUpdateReqStatus}
              onOpenNewForm={() => setShowReqForm(true)}
              currentRole={currentRole}
              onDeleteRequisition={handleDeleteRequisition}
            />
          )
        )}

        {/* View 3: Candidate Public Job Portal */}
        {activeTab === 'portal' && (
          <PublicJobPortal
            publishedJobs={publishedJobs}
            onApplyJob={job => setApplyingJob(job)}
            onCopyJobLink={job => triggerToast(`🔗 Direct Application link copied for '${job.title}'! You can paste this on LinkedIn, Naukri, or WhatsApp.`)}
            onDeleteJob={handleDeleteRequisition}
          />
        )}
      </main>

      {/* Modals */}
      {applyingJob && (
        <CandidateApplicationModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStage={handleUpdateStage}
          onAddEvaluation={handleAddEvaluation}
          onSyncSingle={handleSyncSingle}
        />
      )}

      {showGSheetsModal && (
        <GoogleSheetsModal
          config={gsheetConfig}
          onClose={() => setShowGSheetsModal(false)}
          onSaveConfig={handleSaveGSheetConfig}
          onImportData={handleImportSheetData}
        />
      )}
    </div>
  );
}

export default App;
