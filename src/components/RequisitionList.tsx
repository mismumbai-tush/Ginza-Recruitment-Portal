import React from 'react';
import { CheckCircle, Globe, Clock, AlertCircle, Plus } from 'lucide-react';
import type { JobRequisition } from '../types/recruitment';

interface RequisitionListProps {
  requisitions: JobRequisition[];
  onUpdateStatus: (id: string, status: JobRequisition['status']) => void;
  onOpenNewForm: () => void;
  currentRole: 'manager' | 'hr' | 'candidate';
}

export const RequisitionList: React.FC<RequisitionListProps> = ({
  requisitions,
  onUpdateStatus,
  onOpenNewForm,
  currentRole
}) => {
  const getPriorityBadge = (priority: JobRequisition['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'High':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Medium</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">Low</span>;
    }
  };

  const getStatusBadge = (status: JobRequisition['status']) => {
    switch (status) {
      case 'Published':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><Globe className="w-3 h-3" /><span>Published on Portal</span></span>;
      case 'Approved':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"><CheckCircle className="w-3 h-3" /><span>Approved by HR</span></span>;
      case 'Pending Approval':
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30"><Clock className="w-3 h-3" /><span>Pending HR Review</span></span>;
      default:
        return <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30"><AlertCircle className="w-3 h-3" /><span>Draft</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white">Job Requirement Requisitions</h2>
          <p className="text-sm text-slate-400">
            {currentRole === 'manager' 
              ? 'Submit and track job requirements created by department leaders' 
              : 'Approve department job requisitions and publish them directly to candidate career portal'}
          </p>
        </div>

        <button
          onClick={onOpenNewForm}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Requirement Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requisitions.map(req => (
          <div
            key={req.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {req.id}
                </span>
                <h3 className="text-lg font-bold text-white">{req.title}</h3>
                {getPriorityBadge(req.priority)}
                {getStatusBadge(req.status)}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                <div><span className="text-slate-500">Department:</span> <strong className="text-slate-200">{req.department}</strong></div>
                <div><span className="text-slate-500">Location:</span> <strong className="text-slate-200">{req.location}</strong></div>
                <div><span className="text-slate-500">Experience:</span> <strong className="text-slate-200">{req.experienceYears}</strong></div>
                <div><span className="text-slate-500">Salary Budget:</span> <strong className="text-slate-200">{req.budgetSalary}</strong></div>
              </div>

              <p className="text-sm text-slate-300 line-clamp-2">{req.description}</p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-400 mr-2">Required Skills:</span>
                {req.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions for HR / Manager */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 gap-3">
              <div className="text-xs text-slate-400 text-left md:text-right">
                Requested by: <br />
                <span className="text-slate-200 font-semibold">{req.requestedBy}</span>
              </div>

              <div className="flex items-center space-x-2">
                {req.status === 'Pending Approval' && (
                  <button
                    onClick={() => onUpdateStatus(req.id, 'Approved')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600/90 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-md"
                  >
                    Approve Requirement
                  </button>
                )}

                {req.status === 'Approved' && (
                  <button
                    onClick={() => onUpdateStatus(req.id, 'Published')}
                    className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publish to Portal</span>
                  </button>
                )}

                {req.status === 'Published' && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-medium">
                    Live on Portal
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
