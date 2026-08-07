import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, AlertCircle, CheckCircle2, ArrowDownToLine, Link, Zap, BookOpen, Settings } from 'lucide-react';
import type { GoogleSheetConfig } from '../types/recruitment';
import { generateGoogleAppsScriptCode, pullGoogleSheetData } from '../services/googleSheets';

interface GoogleSheetsModalProps {
  config: GoogleSheetConfig;
  onClose: () => void;
  onSaveConfig: (config: GoogleSheetConfig) => void;
  onImportData?: (mrfRows: Record<string, any>[], candidateRows: Record<string, any>[]) => void;
}

const STEP_TABS = ['1. Your Sheet ID & Webhook', '2. Apps Script Setup (MRF & Candidates)', '3. Sync Settings'] as const;
type Tab = typeof STEP_TABS[number];

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  config,
  onClose,
  onSaveConfig,
  onImportData
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('1. Your Sheet ID & Webhook');
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl);
  const [sheetId, setSheetId] = useState(config.sheetId || '');
  const [autoSyncOnApply, setAutoSyncOnApply] = useState(config.autoSyncOnApply);
  const [autoSyncOnStageChange, setAutoSyncOnStageChange] = useState(config.autoSyncOnStageChange);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pullStatus, setPullStatus] = useState<{ loading: boolean; message: string; type: 'idle' | 'success' | 'error' }>({
    loading: false, message: '', type: 'idle'
  });

  const appScriptCode = generateGoogleAppsScriptCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSave = () => {
    onSaveConfig({
      webhookUrl: webhookUrl.trim(),
      sheetId: sheetId.trim(),
      autoSyncOnApply,
      autoSyncOnStageChange,
      lastSyncedAt: new Date().toISOString()
    });
    onClose();
  };

  const handlePullFromSheet = async () => {
    setPullStatus({ loading: true, message: 'Pulling live MRF and Candidates data from your Google Sheet…', type: 'idle' });
    const result = await pullGoogleSheetData({ ...config, webhookUrl: webhookUrl.trim() });
    if (result.success) {
      setPullStatus({ loading: false, message: result.message, type: 'success' });
      if (onImportData && (result.mrfRows || result.candidateRows)) {
        onImportData(result.mrfRows || [], result.candidateRows || []);
      }
    } else {
      setPullStatus({ loading: false, message: result.message, type: 'error' });
    }
  };

  const sheetUrl = sheetId
    ? `https://docs.google.com/spreadsheets/d/${sheetId}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-0 max-w-4xl w-full text-white shadow-2xl my-8 relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/60">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="15" y2="21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Google Sheets Integration (MRF & Candidates Tabs)</h2>
              <p className="text-sm text-slate-400">Connect your sheet — data from both <strong>MRF</strong> and <strong>Candidates</strong> tabs reflects in this application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center space-x-1 px-8 pt-5 pb-0 overflow-x-auto">
          {STEP_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-6">

          {/* ── TAB 1: Sheet ID & Webhook ── */}
          {activeTab === '1. Your Sheet ID & Webhook' && (
            <div className="space-y-6">
              {/* Info banner */}
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Supports your "MRF" and "Candidates" Google Sheet Tabs</span>
                </div>
                <p className="text-xs text-slate-300">
                  Your Google Sheet can have two tabs: <strong>MRF</strong> (for job requirement requisitions) and <strong>Candidates</strong> (for candidate tracking & round scores). The app matches flexible column names automatically!
                </p>
              </div>

              {/* Sheet ID Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your Google Sheet ID
                </label>
                <div className="relative">
                  <Link className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                    value={sheetId}
                    onChange={e => setSheetId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                {sheetId && (
                  <a
                    href={sheetUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Open this Google Sheet in browser</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Web App URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Google Apps Script Web App URL
                  <span className="ml-2 normal-case font-normal text-slate-500">(from Step 2 deployment)</span>
                </label>
                <div className="relative">
                  <Zap className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Pull from Sheet Action */}
              {webhookUrl && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Pull & Sync Live Data From Sheet</p>
                      <p className="text-xs text-slate-400 mt-0.5">Fetch all MRF requirements and Candidate rows from your Google Sheet so they reflect directly in this app.</p>
                    </div>
                    <button
                      onClick={handlePullFromSheet}
                      disabled={pullStatus.loading}
                      className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ml-4"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>{pullStatus.loading ? 'Fetching...' : 'Pull Live Sheet Data'}</span>
                    </button>
                  </div>
                  {pullStatus.type !== 'idle' && (
                    <div className={`flex items-start space-x-2 text-xs p-3 rounded-xl border ${
                      pullStatus.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      {pullStatus.type === 'success'
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      }
                      <span>{pullStatus.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: Apps Script Setup ── */}
          {activeTab === '2. Apps Script Setup (MRF & Candidates)' && (
            <div className="space-y-5">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white flex items-center space-x-2 text-sm">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Setup Guide for MRF & Candidates Tabs</span>
                </h4>
                <ol className="space-y-3">
                  {[
                    { num: '1', text: 'Open your Google Sheet (with MRF & Candidates tabs).', highlight: false },
                    { num: '2', text: 'Go to Extensions → Apps Script.', highlight: true },
                    { num: '3', text: 'Delete any existing script code, then copy & paste the code block below.', highlight: false },
                    { num: '4', text: 'Click Deploy → New deployment. Select type: Web App.', highlight: true },
                    { num: '5', text: 'Set "Execute as": Me  |  "Who has access": Anyone. Click Deploy.', highlight: false },
                    { num: '6', text: 'Copy the Web App URL and paste it in Step 1.', highlight: true },
                  ].map(step => (
                    <li key={step.num} className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{step.num}</span>
                      <span className={`text-xs leading-relaxed ${step.highlight ? 'text-slate-200' : 'text-slate-400'}`}>{step.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Code Block */}
              <div>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 border-b-0 px-4 py-3 rounded-t-2xl">
                  <span className="text-xs text-slate-400 font-mono">TalentPulse_MRF_Candidate_Sync.gs</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-b-2xl p-5 font-mono text-[11px] text-emerald-400 overflow-x-auto overflow-y-auto max-h-72 leading-relaxed whitespace-pre-wrap">
                  {appScriptCode}
                </pre>
              </div>
            </div>
          )}

          {/* ── TAB 3: Sync Settings ── */}
          {activeTab === '3. Sync Settings' && (
            <div className="space-y-5">
              <div className="space-y-4 bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white">Automatic Sheet Sync Triggers</h4>

                <label className="flex items-start space-x-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoSyncOnApply}
                    onChange={e => setAutoSyncOnApply(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Sync on new applicant submission</p>
                    <p className="text-xs text-slate-500 mt-0.5">Appends new candidate rows automatically to the 'Candidates' tab in Google Sheets.</p>
                  </div>
                </label>

                <div className="border-t border-slate-800" />

                <label className="flex items-start space-x-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoSyncOnStageChange}
                    onChange={e => setAutoSyncOnStageChange(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Sync on interview stage changes & evaluations</p>
                    <p className="text-xs text-slate-500 mt-0.5">Updates stage, Round 1, Round 2, Round 3 score ratings, and joining date in Google Sheets.</p>
                  </div>
                </label>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-300 space-y-1.5">
                <p className="font-semibold text-sm text-white">💡 How MRF & Candidate Data Syncs</p>
                <p>🟢 <strong>MRF Tab:</strong> Stores Job Requisition requirements created by employees/managers.</p>
                <p>🔵 <strong>Candidates Tab:</strong> Stores applicant profiles, interview round scores, and hiring stages.</p>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              {webhookUrl ? (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Google Sheets Webhook Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Webhook URL not set</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
