import React, { useState } from 'react';
import { PlusCircle, Send, Sparkles } from 'lucide-react';
import type { JobRequisition, PriorityLevel } from '../types/recruitment';

interface RequisitionFormProps {
  onSubmit: (requisitionData: Omit<JobRequisition, 'id' | 'createdAt' | 'status'>) => void;
  onCancel: () => void;
}

export const RequisitionForm: React.FC<RequisitionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    employmentType: 'Full-time' as JobRequisition['employmentType'],
    experienceYears: '3 - 5 Years',
    budgetSalary: '$120,000 - $140,000 / Year',
    vacancies: 1,
    priority: 'Medium' as PriorityLevel,
    requestedBy: 'David Miller (Tech Lead)',
    requesterEmail: 'david.m@company.com',
    responsibilities: '',
    requiredSkillsStr: 'React, TypeScript, Node.js',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSubmit({
      title: formData.title,
      department: formData.department,
      location: formData.location,
      employmentType: formData.employmentType,
      experienceYears: formData.experienceYears,
      budgetSalary: formData.budgetSalary,
      vacancies: Number(formData.vacancies),
      priority: formData.priority,
      requestedBy: formData.requestedBy,
      requesterEmail: formData.requesterEmail,
      responsibilities: formData.responsibilities,
      requiredSkills: skillsArray,
      description: formData.description
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl max-w-3xl mx-auto text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Job Requirement Requisition Template</h2>
            <p className="text-sm text-slate-400">Fill details to request a new position opening for HR team approval</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Template V2.4
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales & Business">Sales & Business</option>
              <option value="Finance & Operations">Finance & Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Location & Work Mode *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. San Francisco, CA (Hybrid) or Remote"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={e => setFormData({ ...formData, employmentType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Required Experience
            </label>
            <input
              type="text"
              placeholder="e.g. 3 - 5 Years"
              value={formData.experienceYears}
              onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Approved Salary Budget Range
            </label>
            <input
              type="text"
              placeholder="e.g. $120,000 - $140,000 / Year"
              value={formData.budgetSalary}
              onChange={e => setFormData({ ...formData, budgetSalary: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Number of Vacancies
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.vacancies}
              onChange={e => setFormData({ ...formData, vacancies: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Hiring Urgency Priority
            </label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent / Immediate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Requester Name
            </label>
            <input
              type="text"
              required
              value={formData.requestedBy}
              onChange={e => setFormData({ ...formData, requestedBy: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Requester Email
            </label>
            <input
              type="email"
              required
              value={formData.requesterEmail}
              onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Required Core Skills (Comma-separated) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. React, TypeScript, GraphQL, AWS"
            value={formData.requiredSkillsStr}
            onChange={e => setFormData({ ...formData, requiredSkillsStr: e.target.value })}
            className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Key Responsibilities & Deliverables
          </label>
          <textarea
            rows={3}
            required
            placeholder="List key job responsibilities..."
            value={formData.responsibilities}
            onChange={e => setFormData({ ...formData, responsibilities: e.target.value })}
            className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Job Description
          </label>
          <textarea
            rows={4}
            required
            placeholder="Detailed description of the role for candidate portal..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
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
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Requisition for HR Approval</span>
          </button>
        </div>
      </form>
    </div>
  );
};
