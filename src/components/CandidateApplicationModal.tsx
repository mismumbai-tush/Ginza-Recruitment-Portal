import React, { useState } from 'react';
import { X, Upload, Send, GraduationCap, DollarSign, HelpCircle, Share2, MapPin } from 'lucide-react';
import type { JobRequisition, Candidate } from '../types/recruitment';
import { GINZA_LOGO_URL } from './Navbar';

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
    educationQualification: '',
    currentCompany: '',
    currentDesignation: '',
    experienceYears: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    switchReason: '',
    sourceCategory: 'Job Portal',
    source: '',
    location: '',
    skillsStr: job.requiredSkills ? job.requiredSkills.join(', ') : '',
    resumeFileName: '',
    resumeSummary: '',
    coverLetter: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>('');
  const [resumeMimeType, setResumeMimeType] = useState<string>('');
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

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const base64Str = event.target.result.split(',')[1] || '';
          setResumeBase64(base64Str);
          setResumeMimeType(file.type || 'application/pdf');
        }
      };
      reader.readAsDataURL(file);
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
        educationQualification: formData.educationQualification,
        education: formData.educationQualification,
        currentCompany: formData.currentCompany || 'N/A',
        currentDesignation: formData.currentDesignation || 'Applicant',
        experienceYears: formData.experienceYears || '0',
        currentSalary: formData.currentSalary || 'N/A',
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        switchReason: formData.switchReason || 'Career Growth',
        whyLookingToSwitch: formData.switchReason || 'Career Growth',
        sourceCategory: formData.sourceCategory || 'Job Portal',
        source: formData.source || 'Web Portal',
        location: formData.location || 'N/A',
        skills: skillsArray,
        resumeFileName: formData.resumeFileName || `${formData.fullName.replace(/\s+/g, '_') || 'Candidate'}_Resume.pdf`,
        resumeBase64: resumeBase64 || undefined,
        resumeMimeType: resumeMimeType || undefined,
        resumeSummary: formData.resumeSummary || `${formData.fullName} applied for ${job.title}.`,
        coverLetter: formData.coverLetter
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full text-white shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Ginza Logo & Branding */}
        <div className="border-b border-slate-800 pb-5 mb-6 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-700 flex items-center justify-center shadow-md">
                <img src={GINZA_LOGO_URL} alt="Ginza Industries Ltd." className="h-6 object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase font-display">
                  Ginza Industries Ltd.
                </h3>
                <span className="text-[11px] font-bold text-indigo-400">
                  Official Recruitment Application Form
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display pt-1">{job.title}</h2>
            <p className="text-xs text-slate-400 font-medium">{job.department} • Work Address: {job.location}</p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Email Address */}
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Highest Education (Candidate Tab Col F) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Highest Education *</span>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech / B.E / MBA / BSC"
                value={formData.educationQualification}
                onChange={e => setFormData({ ...formData, educationQualification: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Total Experience (Years) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Experience (Years) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 4 Years"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Current Location (Candidate Tab Col O) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Current Location *</span>
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              </label>
              <input
                type="text"
                required
                placeholder="City, State (e.g. Mumbai, Maharashtra)"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Current Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Company
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.currentCompany}
                onChange={e => setFormData({ ...formData, currentCompany: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Current Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Current Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData.currentDesignation}
                onChange={e => setFormData({ ...formData, currentDesignation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Current CTC (Candidate Tab Col J) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Current CTC / Salary *</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ₹6,00,000 / Year or 6 LPA"
                value={formData.currentSalary}
                onChange={e => setFormData({ ...formData, currentSalary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Expected Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expected Salary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ₹10,00,000 / Year or 10 LPA"
                value={formData.expectedSalary}
                onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Notice Period / Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Notice Period / Availability *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Immediate / 30 Days"
                value={formData.noticePeriod}
                onChange={e => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Source Category (Candidate Tab Col P) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Source Category *</span>
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              </label>
              <select
                value={formData.sourceCategory}
                onChange={e => setFormData({ ...formData, sourceCategory: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
              >
                <option value="Consultancy">Consultancy</option>
                <option value="Internal Platform">Internal Platform</option>
                <option value="Job Portal">Job Portal</option>
                <option value="Social Media">Social Media</option>
              </select>
            </div>

            {/* Source Name (Candidate Tab Col M) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Source Name (Where did you find this opportunity?) *
              </label>
              <input
                type="text"
                required
                placeholder="Name where u find this opportunity (e.g. LinkedIn, Naukri, Employee Referral)"
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>

            {/* Why looking to Switch? (Candidate Tab Col L) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Why looking to Switch? *</span>
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Career Growth / Better Opportunity / Relocation"
                value={formData.switchReason}
                onChange={e => setFormData({ ...formData, switchReason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Key Skills (Comma-separated)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React, TypeScript, Node.js, Quality, Manufacturing"
              value={formData.skillsStr}
              onChange={e => setFormData({ ...formData, skillsStr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Resume Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Attach Resume (PDF / DOCX) *
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-4 text-center bg-slate-950/80 transition-colors cursor-pointer">
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
                <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Brief Cover Letter / Pitch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Brief Cover Letter / Pitch
            </label>
            <textarea
              rows={3}
              placeholder="Why are you a great fit for this role?"
              value={formData.coverLetter}
              onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:brightness-110 transition-all font-display"
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
