import React, { useState } from 'react';
import { X, Star, FileText, CheckCircle, Calendar, DollarSign, RefreshCw, Mail, Phone, Building } from 'lucide-react';
import type { Candidate, CandidateStage, InterviewEvaluation } from '../types/recruitment';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdateStage: (id: string, stage: CandidateStage, joiningDetails?: { offeredSalary?: string; joiningDate?: string }) => void;
  onAddEvaluation: (candidateId: string, evaluation: Omit<InterviewEvaluation, 'evaluatedAt'>) => void;
  onSyncSingle: (candidate: Candidate) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onUpdateStage,
  onAddEvaluation,
  onSyncSingle
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'evaluations' | 'joining'>('profile');

  // Evaluation Form State
  const [evalRound, setEvalRound] = useState<'Round 1 (Technical)' | 'Round 2 (Managerial)' | 'Round 3 (HR & Culture)'>('Round 1 (Technical)');
  const [interviewerName, setInterviewerName] = useState('David Miller');
  const [rating, setRating] = useState(4);
  const [techScore, setTechScore] = useState(4);
  const [commScore, setCommScore] = useState(4);
  const [cultureScore, setCultureScore] = useState(4);
  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState<'Advance' | 'Hold' | 'Reject'>('Advance');

  // Joining Form State
  const [offeredSalary, setOfferedSalary] = useState(candidate.offeredSalary || candidate.expectedSalary);
  const [joiningDate, setJoiningDate] = useState(candidate.joiningDate || '2026-09-01');

  const handleAddEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvaluation(candidate.id, {
      roundName: evalRound,
      interviewerName,
      rating,
      technicalSkillsScore: techScore,
      communicationScore: commScore,
      culturalFitScore: cultureScore,
      notes,
      recommendation
    });
    setNotes('');
  };

  const handleJoiningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStage(candidate.id, 'Joined', { offeredSalary, joiningDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full text-white shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-600/30">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-white">{candidate.fullName}</h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {candidate.id}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Applied for <strong className="text-slate-200">{candidate.jobTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSyncSingle(candidate)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
              title="Sync candidate details to Google Sheet"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync to Sheet</span>
            </button>

            <select
              value={candidate.stage}
              onChange={e => onUpdateStage(candidate.id, e.target.value as CandidateStage)}
              className="bg-indigo-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="Applied">Stage: Applied</option>
              <option value="Screening">Stage: Screening</option>
              <option value="Round 1 (Technical)">Stage: Round 1 (Technical)</option>
              <option value="Round 2 (Managerial)">Stage: Round 2 (Managerial)</option>
              <option value="Round 3 (HR & Culture)">Stage: Round 3 (HR & Culture)</option>
              <option value="Offer Sent">Stage: Offer Sent</option>
              <option value="Joined">Stage: Joined</option>
              <option value="Rejected">Stage: Rejected</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Candidate Profile & Resume
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'evaluations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Interview Rounds Scorecard ({candidate.evaluations.length})
          </button>
          <button
            onClick={() => setActiveTab('joining')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'joining' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Offer & Joining Process
          </button>
        </div>

        {/* Tab 1: Profile & Resume */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <div><span className="text-slate-400">Email:</span> <strong className="text-white">{candidate.email}</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <div><span className="text-slate-400">Phone:</span> <strong className="text-white">{candidate.phone}</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <div><span className="text-slate-400">Company:</span> <strong className="text-white">{candidate.currentCompany || 'N/A'}</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <div><span className="text-slate-400">Experience:</span> <strong className="text-white">{candidate.experienceYears} Years</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div><span className="text-slate-400">Expected Sal:</span> <strong className="text-emerald-300">{candidate.expectedSalary}</strong></div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <div><span className="text-slate-400">Notice Period:</span> <strong className="text-white">{candidate.noticePeriod}</strong></div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(candidate.skills || []).map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Viewer Simulation */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-bold text-white">{candidate.resumeFileName}</span>
                </div>
                <span className="text-xs text-slate-400">Attached Resume File</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-850 italic">
                "{candidate.resumeSummary}"
              </p>

              {candidate.coverLetter && (
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400">Cover Letter Notes:</span>
                  <p className="text-xs text-slate-300 mt-1">{candidate.coverLetter}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Interview Evaluations (Round 1, Round 2, Round 3) */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            {/* Existing Evaluations */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Round Reviews</h4>

              {candidate.evaluations.length === 0 ? (
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  No interview feedback recorded yet. Use the form below to rate Round 1, 2, or 3.
                </div>
              ) : (
                candidate.evaluations.map((evalItem, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                          {evalItem.roundName}
                        </span>
                        <span className="text-xs text-slate-400">Interviewer: <strong className="text-white">{evalItem.interviewerName}</strong></span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1 text-amber-400 font-bold text-sm bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{evalItem.rating} / 5</span>
                        </span>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          evalItem.recommendation === 'Advance' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {evalItem.recommendation}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {evalItem.notes}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Evaluation Form */}
            <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Submit New Interview Evaluation Scorecard</span>
              </h4>

              <form onSubmit={handleAddEvalSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Select Interview Round</label>
                    <select
                      value={evalRound}
                      onChange={e => setEvalRound(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Round 1 (Technical)">Round 1 (Technical)</option>
                      <option value="Round 2 (Managerial)">Round 2 (Managerial)</option>
                      <option value="Round 3 (HR & Culture)">Round 3 (HR & Culture)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Interviewer Name</label>
                    <input
                      type="text"
                      required
                      value={interviewerName}
                      onChange={e => setInterviewerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Overall Rating (1 - 5 Stars)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={rating}
                      onChange={e => setRating(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1">Technical Skills (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={techScore}
                      onChange={e => setTechScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Communication (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={commScore}
                      onChange={e => setCommScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Cultural Fit (1 - 5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={cultureScore}
                      onChange={e => setCultureScore(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Detailed Interviewer Feedback & Evaluation Notes *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter detailed technical feedback, strengths, and areas of improvement..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400">Recommendation:</span>
                    <select
                      value={recommendation}
                      onChange={e => setRecommendation(e.target.value as any)}
                      className="bg-slate-900 border border-slate-750 text-white rounded px-2.5 py-1.5"
                    >
                      <option value="Advance">Advance to Next Round</option>
                      <option value="Hold">On Hold</option>
                      <option value="Reject">Reject Application</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow hover:bg-indigo-500 transition-colors"
                  >
                    Save Interview Scorecard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Offer & Joining */}
        {activeTab === 'joining' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Final Offer & Joining Details</span>
              </h4>

              <form onSubmit={handleJoiningSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Final Offered Salary Package
                    </label>
                    <input
                      type="text"
                      required
                      value={offeredSalary}
                      onChange={e => setOfferedSalary(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirmed Joining Date
                    </label>
                    <input
                      type="date"
                      required
                      value={joiningDate}
                      onChange={e => setJoiningDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
                  >
                    Mark Candidate as Joined & Confirm Onboarding
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
