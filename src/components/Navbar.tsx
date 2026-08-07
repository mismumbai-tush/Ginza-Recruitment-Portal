import React from 'react';
import { Users, FileText, Globe, Table, Settings } from 'lucide-react';
import type { GoogleSheetConfig } from '../types/recruitment';

interface NavbarProps {
  currentRole: 'manager' | 'hr' | 'candidate';
  setCurrentRole: (role: 'manager' | 'hr' | 'candidate') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gsheetConfig: GoogleSheetConfig;
  onOpenGSheetsModal: () => void;
  onExportCSV: () => void;
}

export const GINZA_LOGO_URL = "https://www.ginzalimited.com/cdn/shop/files/Ginza_logo.jpg?v=1668509673&width=500";

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  gsheetConfig,
  onOpenGSheetsModal,
  onExportCSV
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 text-white sticky top-0 z-40 shadow-2xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Company Branding & Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab(currentRole === 'candidate' ? 'portal' : 'ats')}
          >
            <div className="bg-white p-1.5 rounded-xl border border-slate-700 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img 
                src={GINZA_LOGO_URL} 
                alt="Ginza Industries Ltd. Logo" 
                className="h-7 sm:h-9 object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent font-display">
                  Ginza Industries Ltd.
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ATS & MRF Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Recruitment Automation & Google Sheets Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs based on role */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/90">
            {currentRole !== 'candidate' && (
              <>
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'ats'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>ATS Candidate Pipeline</span>
                </button>

                <button
                  onClick={() => setActiveTab('requisitions')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'requisitions'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>MRF Requirements</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'portal'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Public Career Portal</span>
            </button>
          </div>

          {/* Controls: Google Sheets Sync & Role Switcher */}
          <div className="flex items-center space-x-3">
            {currentRole !== 'candidate' && (
              <>
                <button
                  onClick={onExportCSV}
                  className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950 transition-colors shadow"
                  title="Download candidate pipeline in Google Sheets compatible CSV format"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={onOpenGSheetsModal}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    gsheetConfig.webhookUrl
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${gsheetConfig.webhookUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{gsheetConfig.webhookUrl ? 'Google Sheets Connected' : 'Connect Sheet'}</span>
                  <Settings className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </button>
              </>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-950 rounded-2xl p-1 border border-slate-800">
              <button
                onClick={() => { setCurrentRole('hr'); setActiveTab('ats'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'hr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                HR Admin
              </button>
              <button
                onClick={() => { setCurrentRole('manager'); setActiveTab('requisitions'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'manager' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                MRF Lead
              </button>
              <button
                onClick={() => { setCurrentRole('candidate'); setActiveTab('portal'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'candidate' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Career Portal
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
