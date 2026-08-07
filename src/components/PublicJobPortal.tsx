import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Search, Link, Check, Clock, Zap, ChevronRight } from 'lucide-react';
import type { JobRequisition } from '../types/recruitment';
import { GINZA_LOGO_URL } from './Navbar';

interface PublicJobPortalProps {
  publishedJobs: JobRequisition[];
  onApplyJob: (job: JobRequisition) => void;
  onCopyJobLink?: (job: JobRequisition) => void;
}

const FEATURED_COMPANIES = [
  { name: 'All Companies', logo: null },
  { name: 'Ginza Industries Ltd.', logo: GINZA_LOGO_URL },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' }
] as const;

export const PublicJobPortal: React.FC<PublicJobPortalProps> = ({ publishedJobs, onApplyJob, onCopyJobLink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('All Companies');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  const filteredJobs = publishedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompany === 'All Companies' || (job.companyName || 'Ginza Industries Ltd.') === selectedCompany;
    const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;

    return matchesSearch && matchesCompany && matchesDept;
  });

  const handleCopyLink = (job: JobRequisition) => {
    const directLink = `${window.location.origin}${window.location.pathname}?apply=${job.id}`;
    navigator.clipboard.writeText(directLink);
    setCopiedJobId(job.id);
    setTimeout(() => setCopiedJobId(null), 3000);
    if (onCopyJobLink) onCopyJobLink(job);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* ── TECH-NOIR HERO SECTION WITH FUTURISTIC AI BACKGROUND ── */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl min-h-[480px] flex items-center justify-center text-center p-8 sm:p-14">
        {/* Futuristic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center -z-10 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/tech_noir_bg.jpg')` }}
        />
        {/* Glassmorphic Dark Tech-Noir Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950 -z-10 backdrop-blur-[4px]" />

        {/* Ambient Neon Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          
          {/* Tech-Noir Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 text-indigo-300 text-xs font-mono tracking-widest uppercase border border-indigo-500/40 shadow-xl backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI-POWERED ENTERPRISE RECRUITMENT SUITE</span>
          </div>

          {/* Futuristic Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent font-display uppercase leading-tight drop-shadow-md">
              Unlock Your Professional Destiny
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              Discover career opportunities across <strong className="text-white font-semibold">Ginza Industries Ltd.</strong>, Meta, Google, & Amazon.
            </p>
          </div>

          {/* GLASSMORPHIC SEARCH BAR */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="glass-panel p-2 sm:p-3 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search role, skills (e.g. React, C++, AI, Quality, Manufacturing)..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans shadow-inner placeholder-slate-500"
                />
              </div>

              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="w-full sm:w-48 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-bold uppercase tracking-wider"
              >
                {FEATURED_COMPANIES.map(comp => (
                  <option key={comp.name} value={comp.name}>{comp.name}</option>
                ))}
              </select>

              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full sm:w-44 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-bold uppercase tracking-wider"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Data & AI">Data & AI</option>
              </select>
            </div>
          </div>

          {/* Company Badges Quick Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {FEATURED_COMPANIES.map(comp => (
              <button
                key={comp.name}
                onClick={() => setSelectedCompany(comp.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  selectedCompany === comp.name
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {comp.logo && (
                  <div className="bg-white p-0.5 rounded-md flex items-center justify-center shrink-0">
                    <img src={comp.logo} alt={comp.name} className="h-3.5 object-contain" />
                  </div>
                )}
                <span>{comp.name}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── INTERACTIVE JOB CARDS LIST ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
              {selectedCompany === 'All Companies' ? 'Featured Opportunities' : `${selectedCompany} Opportunities`}
            </h2>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              {filteredJobs.length} Positions
            </span>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center text-slate-400">
            <Briefcase className="w-14 h-14 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold text-slate-200 font-display">No positions match your filter</h3>
            <p className="text-sm text-slate-400 mt-1">Try selecting "All Companies" or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map(job => {
              const compName = job.companyName || 'Ginza Industries Ltd.';
              const compLogo = job.companyLogo || GINZA_LOGO_URL;

              return (
                <div
                  key={job.id}
                  className="glass-card rounded-3xl p-6 sm:p-8 transition-all shadow-xl hover:shadow-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative group border border-slate-800/90"
                >
                  <div className="space-y-4 flex-1">
                    
                    {/* Company Branding & Role Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-700 flex items-center justify-center shadow-md">
                        <img src={compLogo} alt={compName} className="h-5 max-w-[90px] object-contain" />
                      </div>
                      <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                        {compName}
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {job.department}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors font-display">
                      {job.title}
                    </h3>

                    {/* Metadata Chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>Experience: <strong className="text-white">{job.experienceYears}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">{job.budgetSalary}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">{job.description}</p>

                    {/* Skills Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
                      {(job.requiredSkills || []).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 text-slate-200 text-xs font-semibold border border-slate-800 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Action Column */}
                  <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-8 gap-4 min-w-[240px]">
                    <div className="text-xs text-slate-400">
                      Vacancies: <strong className="text-white font-extrabold text-sm">{job.vacancies} Openings</strong>
                    </div>

                    {/* Direct Shareable Link */}
                    <button
                      onClick={() => handleCopyLink(job)}
                      className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-750 text-slate-300 hover:text-white text-xs font-semibold hover:border-indigo-500 transition-colors shadow-inner"
                      title="Copy direct shareable application URL to paste on LinkedIn, Naukri, or WhatsApp"
                    >
                      {copiedJobId === job.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4 text-indigo-400" />}
                      <span>{copiedJobId === job.id ? 'Direct Link Copied!' : 'Copy Job Link'}</span>
                    </button>

                    <button
                      onClick={() => onApplyJob(job)}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:brightness-110 transition-all font-display"
                    >
                      <span>Apply Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
