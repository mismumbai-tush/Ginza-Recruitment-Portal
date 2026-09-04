import React from 'react';
import { Users, FileText, Globe, Table, Settings, Sun, Moon, Trash } from 'lucide-react';
import type { GoogleSheetConfig } from '../types/recruitment';

interface NavbarProps {
  currentRole: 'manager' | 'hr' | 'candidate';
  setCurrentRole: (role: 'manager' | 'hr' | 'candidate') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gsheetConfig: GoogleSheetConfig;
  onOpenGSheetsModal: () => void;
  onExportCSV: () => void;
  onPurgeMockData?: () => void;
  candidateCount?: number;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const GINZA_LOGO_URL = "https://www.ginzalimited.com/cdn/shop/files/Ginza_logo.jpg?v=1668509673&width=500";

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  gsheetConfig,
  onOpenGSheetsModal,
  onExportCSV,
  onPurgeMockData,
  candidateCount,
  themeMode,
  onToggleTheme
}) => {
  const isDark = themeMode === 'dark';

  return (
    <header className={`sticky top-0 z-40 shadow-2xl transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 text-white' 
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Company Branding & Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab(currentRole === 'candidate' ? 'portal' : 'ats')}
          >
            <div className="bg-white p-1.5 rounded-xl border border-slate-300 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img 
                src={GINZA_LOGO_URL} 
                alt="Ginza Industries Ltd. Logo" 
                className="h-7 sm:h-9 object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-lg sm:text-xl font-extrabold tracking-tight font-display ${
                  isDark ? 'bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent' : 'text-slate-900'
                }`}>
                  Ginza Industries Ltd.
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                  ATS & MRF Suite
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Recruitment Automation & Google Sheets Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs based on role */}
          <div className={`hidden lg:flex items-center space-x-2 p-1.5 rounded-2xl border ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {currentRole !== 'candidate' && (
              <>
                <button
                  onClick={() => setActiveTab('ats')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'ats'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Recruitment</span>
                </button>

                <button
                  onClick={() => setActiveTab('requisitions')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'requisitions'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Public Career Portal</span>
            </button>
          </div>

          {/* Controls: Dark/Light Mode, Sheets Sync & Role Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* DARK / LIGHT MODE TOGGLE BUTTON */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isDark 
                  ? 'bg-slate-950 text-amber-300 border-amber-500/30 hover:bg-slate-800 shadow'
                  : 'bg-slate-100 text-indigo-700 border-indigo-300 hover:bg-slate-200 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {currentRole !== 'candidate' && (
              <>
                {onPurgeMockData && (
                  <button
                    onClick={() => {
                      if (window.confirm('Purge mock sample applicants and keep only your Google Sheet candidate rows?')) {
                        onPurgeMockData();
                      }
                    }}
                    className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border shadow ${
                      isDark 
                        ? 'bg-slate-950 text-rose-300 border-rose-500/30 hover:bg-rose-950'
                        : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                    }`}
                    title="Clean initial sample demo candidates to keep exact count of your Google Sheet candidates"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span>Clean Demo Applicants ({candidateCount || 0})</span>
                  </button>
                )}

                <button
                  onClick={onExportCSV}
                  className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border shadow ${
                    isDark 
                      ? 'bg-slate-950 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  }`}
                  title="Download candidate pipeline in Google Sheets compatible CSV format"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={onOpenGSheetsModal}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    gsheetConfig.webhookUrl
                      ? isDark 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : isDark
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${gsheetConfig.webhookUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="hidden sm:inline">{gsheetConfig.webhookUrl ? 'Sheets Live' : 'Connect Sheet'}</span>
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </>
            )}

            {/* Mode Switcher */}
            <div className={`flex items-center rounded-2xl p-1 border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => { setCurrentRole('hr'); setActiveTab('ats'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'hr' ? 'bg-indigo-600 text-white shadow-md' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HR Admin
              </button>
              <button
                onClick={() => { setCurrentRole('manager'); setActiveTab('requisitions'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'manager' ? 'bg-purple-600 text-white shadow-md' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MRF Lead
              </button>
              <button
                onClick={() => { setCurrentRole('candidate'); setActiveTab('portal'); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  currentRole === 'candidate' ? 'bg-teal-600 text-white shadow-md' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
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
