import React, { useState } from 'react';
import { PlusCircle, Send, Sparkles, Building2 } from 'lucide-react';
import type { JobRequisition, PriorityLevel } from '../types/recruitment';

interface RequisitionFormProps {
  onSubmit: (requisitionData: Omit<JobRequisition, 'id' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
}

const DEFAULT_UNITS = [
  'UDH',
  'SAC',
  'EHU',
  'CKU',
  'Ginza Corporate Office',
  'Unit 1 - Main Manufacturing Plant',
  'Unit 2 - Production & Assembly Division',
  'Unit 3 - Textile & Garment Division',
  'R&D Hub',
  'Warehouse & Logistics',
  'Other / Custom Branch'
] as const;

export const RequisitionForm: React.FC<RequisitionFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('UDH');
  const [customUnit, setCustomUnit] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time' as JobRequisition['employmentType'],
    experienceYears: '',
    highestQualification: '',
    budgetSalary: '',
    expectedJoiningDate: '',
    preferredGender: 'Any',
    vacancies: 1,
    priority: 'High' as PriorityLevel,
    requestedBy: '',
    requesterEmail: '',
    reasonForRequisition: 'New Position / Team Expansion',
    responsibilities: '',
    requiredSkillsStr: '',
    jobTiming: '',
    attachJd: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnit = selectedUnit === 'Other / Custom Branch' ? customUnit : selectedUnit;
    const skillsArray = formData.requiredSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSubmit({
      title: formData.title,
      unitBranch: finalUnit,
      department: formData.department,
      location: formData.location,
      employmentType: formData.employmentType,
      experienceYears: formData.experienceYears,
      highestQualification: formData.highestQualification,
      budgetSalary: formData.budgetSalary,
      expectedJoiningDate: formData.expectedJoiningDate,
      preferredGender: formData.preferredGender,
      vacancies: Number(formData.vacancies),
      priority: formData.priority,
      requestedBy: formData.requestedBy,
      requesterEmail: formData.requesterEmail,
      reasonForRequisition: formData.reasonForRequisition,
      responsibilities: formData.responsibilities,
      requiredSkills: skillsArray,
      jobTiming: formData.jobTiming,
      attachJd: formData.attachJd,
      description: formData.description || formData.responsibilities
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">MRF — Manpower Requisition Form</h2>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Ready For HR Review
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Position & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Required Position (Job Title) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Production Engineer"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {/* Unit / Branch Selector with preset list for user help */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Unit / Branch *</span>
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            </label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
            >
              {DEFAULT_UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            {selectedUnit === 'Other / Custom Branch' && (
              <input
                type="text"
                required
                placeholder="Enter custom Unit / Branch name..."
                value={customUnit}
                onChange={e => setCustomUnit(e.target.value)}
                className="w-full mt-2.5 bg-slate-950 border border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Name (Requester) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Sharma"
              value={formData.requestedBy}
              onChange={e => setFormData({ ...formData, requestedBy: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rajesh.s@ginzalimited.com"
              value={formData.requesterEmail}
              onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Section 2: Requisition Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Department *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Engineering, Manufacturing, General, Sales..."
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Reason for Requisition
            </label>
            <select
              value={formData.reasonForRequisition}
              onChange={e => setFormData({ ...formData, reasonForRequisition: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="New Position / Team Expansion">New Position / Team Expansion</option>
              <option value="Replacement for Resigned Employee">Replacement for Resigned Employee</option>
              <option value="Project Specific Hiring">Project Specific Hiring</option>
              <option value="Workload Increase">Workload Increase</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Experience (Required)
            </label>
            <input
              type="text"
              placeholder="e.g. 3 - 5 Years"
              value={formData.experienceYears}
              onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Highest Qualification
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech / B.E / MBA"
              value={formData.highestQualification}
              onChange={e => setFormData({ ...formData, highestQualification: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              CTC (Budget Salary Range)
            </label>
            <input
              type="text"
              placeholder="e.g. ₹8,00,000 - ₹12,00,000 / Year"
              value={formData.budgetSalary}
              onChange={e => setFormData({ ...formData, budgetSalary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Expected Joining Date
            </label>
            <input
              type="date"
              value={formData.expectedJoiningDate}
              onChange={e => setFormData({ ...formData, expectedJoiningDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Preferred Gender
            </label>
            <select
              value={formData.preferredGender}
              onChange={e => setFormData({ ...formData, preferredGender: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Any">Any / No Preference</option>
              <option value="Male">Male Preference</option>
              <option value="Female">Female Preference</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Vacancies Count
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.vacancies}
              onChange={e => setFormData({ ...formData, vacancies: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Job Timing / Shift
            </label>
            <input
              type="text"
              placeholder="e.g. General Shift (9 AM - 6 PM)"
              value={formData.jobTiming}
              onChange={e => setFormData({ ...formData, jobTiming: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Priority Status
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent / Immediate</option>
            </select>
          </div>
        </div>

        {/* Section 3: Work Address & Profile */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Work Address (Unit work address with street number and pin code) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Plot No. 42, Industrial Park, MIDC, Mumbai - 400072"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Required Skills (Comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PLC Automation, Quality Control, Manufacturing, Team Management"
              value={formData.requiredSkillsStr}
              onChange={e => setFormData({ ...formData, requiredSkillsStr: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Work Profile (Mention Key Roles & Responsibilities) *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe key roles, daily duties, and targets for this position..."
              value={formData.responsibilities}
              onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Attach JD Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://drive.google.com/file/d/xyz... or JD document link"
              value={formData.attachJd}
              onChange={e => setFormData({ ...formData, attachJd: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all font-display"
          >
            <Send className="w-4 h-4" />
            <span>Submit Blank MRF Requisition</span>
          </button>
        </div>
      </form>
    </div>
  );
};
