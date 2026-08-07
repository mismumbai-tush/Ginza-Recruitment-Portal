import React, { useState } from 'react';
import { X, Upload, Send } from 'lucide-react';
import type { JobRequisition, Candidate } from '../types/recruitment';

interface CandidateApplicationModalProps {
  job: JobRequisition;
  onClose: () => void;
  onSubmitApplication: (candidateData: Omit<Candidate, 'id' | 'appliedDate' | 'lastUpdated' | 'stage' | 'evaluations'>) => void;
}

export const CandidateApplicationModal: React.FC<CandidateApplicationModalProps> = ({
  job,
  onClose,
  onSubmitApplication
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentCompany: '',
    currentDesignation: '',
    experienceYears: 4,
    expectedSalary: '$140,000 / Year',
    noticePeriod: '30 Days',
    skillsStr: job.requiredSkills.join(', '),
    resumeFileName: 'Resume_2026.pdf',
    resumeSummary: '',
    coverLetter: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name,
        resumeSummary: `Uploaded candidate resume file (${(file.size / 1024).toFixed(1)} KB). Format: ${file.type || 'PDF/Doc'}.`
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    setTimeout(() => {
      onSubmitApplication({
        jobId: job.id,
        jobTitle: job.title,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        currentCompany: formData.currentCompany,
        currentDesignation: formData.currentDesignation,
        experienceYears: Number(formData.experienceYears),
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        skills: skillsArray,
        resumeFileName: formData.resumeFileName,
        resumeSummary: formData.resumeSummary || `${formData.fullName} is an experienced professional with ${formData.experienceYears} years of expertise in ${skillsArray.slice(0, 3).join(', ')}.`,
        coverLetter: formData.coverLetter
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-white shadow-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-800 pb-5 mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-white p-1 rounded-lg border border-slate-700">
                <img src="https://www.ginzalimited.com/cdn/shop/files/Ginza_logo.jpg?v=1668509673&width=500" alt="Ginza" className="h-5 object-contain" />
              </div>
              <span className="text-xs font-bold text-slate-300 font-display">Ginza Industries Ltd.</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Official Candidate Form
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">{job.title}</h2>
            <p className="text-sm text-slate-400">{job.department} • {job.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Vance"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="alex.vance@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="40"
                required
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Company
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.currentCompany}
                onChange={e => setFormData({ ...formData, currentCompany: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData.currentDesignation}
                onChange={e => setFormData({ ...formData, currentDesignation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expected Salary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. $135,000 / Year"
                value={formData.expectedSalary}
                onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Notice Period / Availability *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Immediate or 30 Days"
                value={formData.noticePeriod}
                onChange={e => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Key Skills (Comma-separated)
            </label>
            <input
              type="text"
              required
              value={formData.skillsStr}
              onChange={e => setFormData({ ...formData, skillsStr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Resume Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Attach Resume (PDF / DOCX) *
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-4 text-center bg-slate-950/60 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-indigo-400" />
                <p className="text-sm font-medium text-slate-200">
                  {uploadedFile ? uploadedFile.name : 'Click or drag resume file here'}
                </p>
                <p className="text-xs text-slate-400">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Brief Cover Letter / Pitch
            </label>
            <textarea
              rows={3}
              placeholder="Why are you a great fit for this role?"
              value={formData.coverLetter}
              onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
            >
              {isSubmitting ? (
                <span>Submitting & Syncing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
