import React, { useState } from 'react';
import { CheckCircle, Globe, Clock, AlertCircle, Plus, Filter, Building2, Search, Trash2 } from 'lucide-react';
import type { JobRequisition } from '../types/recruitment';
import { isWithinHierarchicalDateFilter, MONTH_NAMES, YEAR_OPTIONS, WEEK_OPTIONS } from '../services/dateUtils';

interface RequisitionListProps {
  requisitions: JobRequisition[];
  onUpdateStatus: (id: string, status: JobRequisition['status']) => void;
  onOpenNewForm: () => void;
  currentRole: 'manager' | 'hr' | 'candidate';
  onDeleteRequisition?: (id: string) => void;
}

export const RequisitionList: React.FC<RequisitionListProps> = ({
  requisitions,
  onUpdateStatus,
  onOpenNewForm,
  currentRole,
  onDeleteRequisition
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('All');
  
  // Hierarchical Date Filters for MRF Column C
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');

  // Extract unique Units / Branches from MRF Requisitions
  const uniqueUnits = Array.from(new Set(requisitions.map(r => r.unitBranch).filter(Boolean))) as string[];

  // Filter MRF Requisitions using Column C Timestamp (createdAt)
  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.requestedBy || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUnit = unitFilter === 'All' || req.unitBranch === unitFilter;
    // MRF Column C Timestamp Filter
    const matchesTime = isWithinHierarchicalDateFilter(req.createdAt, selectedYear, selectedMonth, selectedWeek);

    return matchesSearch && matchesUnit && matchesTime;
  });

  const getPriorityBadge = (priority: JobRequisition['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">Low</span>;
    }
  };

  const getStatusBadge = (status: JobRequisition['status']) => {
    switch (status) {
      case 'Published':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><Globe className="w-3 h-3 text-emerald-400" /><span>Published on Portal</span></span>;
      case 'Approved':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"><CheckCircle className="w-3 h-3 text-indigo-400" /><span>Approved by HR</span></span>;
      case 'Pending Approval':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"><Clock className="w-3 h-3 text-amber-400" /><span>Pending HR Review</span></span>;
      default:
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30"><AlertCircle className="w-3 h-3 text-slate-400" /><span>Draft</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-display">Job Requirement Requisitions (MRF)</h2>
          <p className="text-sm text-slate-400 mt-1">
            {currentRole === 'manager' 
              ? 'Submit and track manpower requirements created by department heads' 
              : 'Approve department job requisitions and publish them directly to candidate career portal'}
          </p>
        </div>

        <button
          onClick={onOpenNewForm}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all shrink-0 font-display"
        >
          <Plus className="w-4 h-4" />
          <span>New Requirement Template</span>
        </button>
      </div>

      {/* MRF Filters Bar (Column C Date Range & Unit/Branch) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search MRF position, department, skills, or requester..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* MRF Column C Hierarchical Date Filters */}
            <div className="flex flex-wrap items-center gap-2">
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

              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
              >
                {YEAR_OPTIONS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              {/* Month Selector */}
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
              >
                <option value="All">All</option>
                {MONTH_NAMES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Week Selector */}
              <select
                value={selectedWeek}
                onChange={e => setSelectedWeek(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
              >
                {WEEK_OPTIONS.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>

            {/* Unit / Branch Filter */}
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={unitFilter}
                onChange={e => setUnitFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Units / Branches ({requisitions.length})</option>
                {uniqueUnits.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* MRF List */}
      {filteredRequisitions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-200 font-display">No MRF Requisitions Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your date range filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredRequisitions.map(req => (
            <div
              key={req.id}
              className="glass-card rounded-3xl p-6 sm:p-7 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800/90"
            >
              <div className="space-y-3.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 font-bold">
                    {req.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-display">{req.title}</h3>
                  {req.unitBranch && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                      Unit: {req.unitBranch}
                    </span>
                  )}
                  {getPriorityBadge(req.priority)}
                  {getStatusBadge(req.status)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  <div><span className="text-slate-400">Department:</span> <strong className="text-white">{req.department}</strong></div>
                  <div><span className="text-slate-400">Work Address:</span> <strong className="text-white">{req.location}</strong></div>
                  <div><span className="text-slate-400">Experience:</span> <strong className="text-white">{req.experienceYears}</strong></div>
                  <div><span className="text-slate-400">Salary Budget (CTC):</span> <strong className="text-emerald-300 font-bold">{req.budgetSalary}</strong></div>
                </div>

                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{req.description}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-400 mr-2">Required Skills:</span>
                  {req.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 text-slate-200 text-xs font-semibold border border-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions for HR / Manager */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 gap-3 min-w-[200px]">
                <div className="text-xs text-slate-400 text-left md:text-right">
                  Requested by: <br />
                  <span className="text-white font-bold text-sm">{req.requestedBy}</span>
                  <div className="text-[11px] text-slate-400">{req.createdAt} (Col C)</div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {req.status === 'Pending Approval' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Approved')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                    >
                      Approve Requirement
                    </button>
                  )}

                  {req.status === 'Approved' && (
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Published')}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/30"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Publish to Portal</span>
                    </button>
                  )}

                  {req.status === 'Published' && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
                      Live on Career Portal
                    </span>
                  )}

                  {onDeleteRequisition && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to permanently delete MRF requirement '${req.title}'?`)) {
                          onDeleteRequisition(req.id);
                        }
                      }}
                      className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold transition-colors mt-2"
                      title="Permanently delete this MRF requirement record"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete Requirement</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
