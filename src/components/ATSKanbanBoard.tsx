import React, { useState } from 'react';
import { Star, Search, Filter, CheckCircle2, UserCheck, Award, Briefcase, FileSpreadsheet, Calendar, LayoutGrid, Table as TableIcon, Eye, Trash2 } from 'lucide-react';
import type { Candidate, CandidateStage } from '../types/recruitment';
import { isWithinHierarchicalDateFilter, formatDisplayDate, MONTH_NAMES, YEAR_OPTIONS, WEEK_OPTIONS } from '../services/dateUtils';

interface ATSKanbanBoardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onUpdateStage: (id: string, stage: CandidateStage) => void;
  onDeleteCandidate?: (id: string) => void;
}

const PIPELINE_STAGES: CandidateStage[] = [
  'Applied',
  'Screening',
  'Round 1 (Technical)',
  'Round 2 (Managerial)',
  'Round 3 (HR & Culture)',
  'Offer Sent',
  'Joined',
  'Rejected'
];

export const ATSKanbanBoard: React.FC<ATSKanbanBoardProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateStage,
  onDeleteCandidate
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [unitFilter, setUnitFilter] = useState('All');

  // Hierarchical Date Filters: All Data, Year, Month, Week
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');

  // Extract unique job titles & Unit/Branches for filter dropdowns
  const uniqueJobTitles = Array.from(new Set(candidates.map(c => c.jobTitle)));
  const uniqueUnits = Array.from(new Set(candidates.map(c => c.unit).filter(Boolean))) as string[];

  // Filter candidates based on search, job filter, stage filter, unit filter & Candidate Sheet Column A timestamp
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.skills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesJob = jobFilter === 'All' || c.jobTitle === jobFilter;
    const matchesStage = stageFilter === 'All' || c.stage === stageFilter;
    const matchesUnit = unitFilter === 'All' || c.unit === unitFilter;
    // Candidate Sheet Column A Date Hierarchical Filter
    const matchesTime = isWithinHierarchicalDateFilter(c.appliedDate, selectedYear, selectedMonth, selectedWeek);

    return matchesSearch && matchesJob && matchesStage && matchesUnit && matchesTime;
  });

  const getStageHeaderStyle = (stage: CandidateStage) => {
    switch (stage) {
      case 'Applied': return { color: 'border-t-blue-500 bg-blue-500/10 text-blue-400', badge: 'bg-blue-500/20 text-blue-300' };
      case 'Screening': return { color: 'border-t-sky-500 bg-sky-500/10 text-sky-400', badge: 'bg-sky-500/20 text-sky-300' };
      case 'Round 1 (Technical)': return { color: 'border-t-indigo-500 bg-indigo-500/10 text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' };
      case 'Round 2 (Managerial)': return { color: 'border-t-purple-500 bg-purple-500/10 text-purple-400', badge: 'bg-purple-500/20 text-purple-300' };
      case 'Round 3 (HR & Culture)': return { color: 'border-t-amber-500 bg-amber-500/10 text-amber-400', badge: 'bg-amber-500/20 text-amber-300' };
      case 'Offer Sent': return { color: 'border-t-teal-500 bg-teal-500/10 text-teal-400', badge: 'bg-teal-500/20 text-teal-300' };
      case 'Joined': return { color: 'border-t-emerald-500 bg-emerald-500/10 text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' };
      case 'Rejected': return { color: 'border-t-slate-600 bg-slate-800/40 text-slate-400', badge: 'bg-slate-800 text-slate-400' };
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Executive Overview Banner & Stats */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Recruitment ATS Pipeline
            </h1>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-left min-w-[130px]">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Applications</span>
              </div>
              <div className="text-xl font-extrabold text-white mt-1 font-display">{filteredCandidates.length}</div>
            </div>

            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-left min-w-[130px]">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>In Interview Rounds</span>
              </div>
              <div className="text-xl font-extrabold text-amber-400 mt-1 font-display">
                {filteredCandidates.filter(c => c.stage.includes('Round')).length}
              </div>
            </div>

            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-left min-w-[130px]">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Offers Sent</span>
              </div>
              <div className="text-xl font-extrabold text-teal-400 mt-1 font-display">
                {filteredCandidates.filter(c => c.stage === 'Offer Sent').length}
              </div>
            </div>

            <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-left min-w-[130px]">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Joined Onboarded</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1 font-display">
                {filteredCandidates.filter(c => c.stage === 'Joined').length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & View Mode Switcher Toolbar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* View Mode Toggle: Kanban vs Table */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-750 text-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table Data View</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
            {/* Hierarchical Date Filters: All Data, Year, Month, Week */}
            <button
              onClick={() => { setSelectedYear('All'); setSelectedMonth('All'); setSelectedWeek('All'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === 'All' && selectedMonth === 'All' && selectedWeek === 'All'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Data
            </button>

            {/* Year Selector (All, 2021, 2022, 2023, 2024, 2025, 2026, 2027) */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
            >
              {YEAR_OPTIONS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Month Selector (All, Jan, Feb, Mar... Dec) */}
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
            >
              <option value="All">All</option>
              {MONTH_NAMES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Week Selector (All, Week 1, Week 2, Week 3, Week 4, Week 5) */}
            <select
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
            >
              {WEEK_OPTIONS.map(w => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>

            {/* Position Filter */}
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={jobFilter}
                onChange={e => setJobFilter(e.target.value)}
                className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Roles ({candidates.length})</option>
                {uniqueJobTitles.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Stage Filter */}
              <select
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
                className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Stages</option>
                {PIPELINE_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Unit / Branch Filter */}
              <select
                value={unitFilter}
                onChange={e => setUnitFilter(e.target.value)}
                className="bg-slate-950 border border-slate-750 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Units / Branches</option>
                {uniqueUnits.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 w-full snap-x">
          {PIPELINE_STAGES.map(stage => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
            const style = getStageHeaderStyle(stage);

            return (
              <div
                key={stage}
                className={`bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col w-[320px] shrink-0 min-h-[580px] shadow-xl border-t-4 ${style.color} snap-start`}
              >
                {/* Lane Header */}
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">{stage}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                      {stageCandidates.length}
                    </span>
                  </div>
                </div>

                {/* Candidate Cards Column List */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[700px] scrollbar-thin">
                  {stageCandidates.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-500 italic border-2 border-dashed border-slate-800/60 rounded-2xl">
                      No candidates in {stage}
                    </div>
                  ) : (
                    stageCandidates.map(candidate => {
                      const latestEval = candidate.evaluations && candidate.evaluations.length > 0
                        ? candidate.evaluations[candidate.evaluations.length - 1]
                        : null;

                      return (
                        <div
                          key={candidate.id}
                          onClick={() => onSelectCandidate(candidate)}
                          className="bg-slate-950 border border-slate-800 hover:border-indigo-500/70 rounded-2xl p-4 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer space-y-3 group relative"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono text-indigo-400 block">{candidate.id}</span>
                              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors font-display">
                                {candidate.fullName}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">{candidate.jobTitle}</p>
                              {candidate.appliedDate && (
                                <div className="flex items-center space-x-1 text-[11px] text-indigo-300 font-mono mt-1 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 w-fit">
                                  <Calendar className="w-3 h-3 text-indigo-400" />
                                  <span>Applied: <strong>{formatDisplayDate(candidate.appliedDate)}</strong></span>
                                </div>
                              )}
                            </div>
                            {candidate.syncedToGoogleSheet ? (
                              <span className="flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20" title="Synced with Google Sheet">
                                <FileSpreadsheet className="w-3 h-3" />
                                <span>Sheet</span>
                              </span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-700" title="Local storage" />
                            )}
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                            <div className="col-span-2 text-indigo-300 font-mono flex items-center space-x-1.5 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>Applied Date: <strong className="text-white">{formatDisplayDate(candidate.appliedDate)}</strong></span>
                            </div>
                            <div>Exp: <strong className="text-slate-200">{candidate.experienceYears || 'NA'}</strong></div>
                            <div>Notice: <strong className="text-slate-200">{candidate.noticePeriod || 'NA'}</strong></div>
                            <div className="col-span-2 text-[10px] text-slate-400 truncate">
                              Salary: <strong className="text-slate-200">{candidate.expectedSalary || 'NA'}</strong>
                            </div>
                            <div className="col-span-2 text-[10px] text-slate-400 truncate">
                              Email: <strong className="text-slate-200">{candidate.email && candidate.email !== 'N/A' && candidate.email !== 'NA' && !candidate.email.includes('applicant') ? candidate.email : 'NA'}</strong>
                            </div>
                          </div>

                          {/* Interview Rating Preview */}
                          {latestEval ? (
                            <div className="flex items-center justify-between text-xs bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-indigo-300">
                              <span className="font-semibold text-[11px] truncate max-w-[140px]">{latestEval.roundName}</span>
                              <span className="font-bold flex items-center bg-amber-400/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/20">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                                {latestEval.rating}/5
                              </span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 italic bg-slate-900/40 p-2 rounded-xl border border-slate-800/40 text-center">
                              Pending Evaluation
                            </div>
                          )}

                          {/* Quick Stage Move Dropdown */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="text-slate-400 text-[10px] font-medium">Stage:</span>
                            <select
                              value={candidate.stage}
                              onClick={e => e.stopPropagation()}
                              onChange={e => {
                                e.stopPropagation();
                                onUpdateStage(candidate.id, e.target.value as CandidateStage);
                              }}
                              className="bg-slate-900 border border-slate-700 text-[11px] text-indigo-300 font-semibold rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>

                          {onDeleteCandidate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to permanently delete candidate '${candidate.fullName}'?`)) {
                                  onDeleteCandidate(candidate.id);
                                }
                              }}
                              className="w-full flex items-center justify-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-semibold transition-colors mt-2"
                              title="Permanently delete candidate record"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Delete Candidate</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: FULL ENTERPRISE SPREADSHEET TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Candidate & ID</th>
                  <th className="px-5 py-4">Applied Date (Col A)</th>
                  <th className="px-5 py-4">Position Applying For</th>
                  <th className="px-5 py-4">Contact Info</th>
                  <th className="px-5 py-4">Exp & Notice</th>
                  <th className="px-5 py-4">Salary Expectation</th>
                  <th className="px-5 py-4">Current Hiring Stage</th>
                  <th className="px-5 py-4">Latest Interview Score</th>
                  <th className="px-5 py-4">Google Sheet Sync</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-500 italic">
                      No candidates match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map(candidate => {
                    const latestEval = candidate.evaluations && candidate.evaluations.length > 0
                      ? candidate.evaluations[candidate.evaluations.length - 1]
                      : null;
                    const style = getStageHeaderStyle(candidate.stage);

                    return (
                      <tr 
                        key={candidate.id}
                        onClick={() => onSelectCandidate(candidate)}
                        className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <span className="text-[10px] font-mono text-indigo-400 block">{candidate.id}</span>
                            <span className="font-bold text-white group-hover:text-indigo-300 text-sm transition-colors font-display block">
                              {candidate.fullName}
                            </span>
                            {candidate.appliedDate && (
                              <span className="text-[11px] font-mono text-indigo-300 flex items-center space-x-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span>Applied: <strong>{candidate.appliedDate}</strong></span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {formatDisplayDate(candidate.appliedDate) ? (
                            <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                              {formatDisplayDate(candidate.appliedDate)}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs italic">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-200">{candidate.jobTitle}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div>{candidate.email}</div>
                          <div className="text-slate-500 text-[11px]">{candidate.phone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div><strong className="text-slate-200">{candidate.experienceYears}</strong> Yrs</div>
                          <div className="text-slate-400 text-[11px]">Notice: {candidate.noticePeriod}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-medium text-emerald-400">{candidate.expectedSalary}</span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={candidate.stage}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              e.stopPropagation();
                              onUpdateStage(candidate.id, e.target.value as CandidateStage);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${style.badge} bg-slate-950 focus:outline-none cursor-pointer`}
                          >
                            {PIPELINE_STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          {latestEval ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20 text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{latestEval.rating}/5</span>
                              <span className="text-[10px] text-slate-400 ml-1">({latestEval.recommendation})</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Pending</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {candidate.syncedToGoogleSheet ? (
                            <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Synced</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                              <span>Local</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onSelectCandidate(candidate);
                              }}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors shadow-md"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            {onDeleteCandidate && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to permanently delete candidate '${candidate.fullName}'?`)) {
                                    onDeleteCandidate(candidate.id);
                                  }
                                }}
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 font-semibold text-xs transition-colors"
                                title="Delete Candidate"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
