import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileSpreadsheet, 
  ShieldCheck, 
  User, 
  BookOpen, 
  Sparkles,
  Lock,
  X,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

interface NavbarProps {
  currentTab: 'murid' | 'guru';
  onSelectTab: (tab: 'murid' | 'guru') => void;
  isTeacherAuthenticated: boolean;
  onTeacherLogin: (success: boolean) => void;
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isTeacherAuthenticated,
  onTeacherLogin,
  onRefreshData
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState('');

  const config = googleSheetsService.getConfig();

  const handleTeacherClick = () => {
    if (isTeacherAuthenticated) {
      onSelectTab('guru');
    } else {
      setShowPinModal(true);
      setPinInput('');
      setPinError('');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN for teacher access
    if (pinInput === '1234' || pinInput === 'guru123' || pinInput === 'pjok2026') {
      onTeacherLogin(true);
      setShowPinModal(false);
      onSelectTab('guru');
    } else {
      setPinError('PIN salah! Silakan coba lagi (PIN Default: 1234)');
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    const result = await googleSheetsService.syncFromSpreadsheet();
    setIsSyncing(false);
    setSyncToast(result.message);
    if (onRefreshData) onRefreshData();
    setTimeout(() => setSyncToast(''), 4000);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 text-white shadow-lg sticky top-0 z-40 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Logo & School Identity */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group shrink min-w-0"
              onClick={() => onSelectTab('murid')}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5 sm:p-2 border border-white/20 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h1 className="text-xs sm:text-xl font-bold tracking-tight text-white flex items-center gap-1 truncate">
                    LKM DIGITAL PJOK
                    <span className="hidden sm:inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Fase F
                    </span>
                  </h1>
                </div>
                <p className="text-[10px] sm:text-sm text-blue-100/90 font-medium truncate">
                  SMAN 1 Tejakula • Pak Agus Nova, S.Pd.
                </p>
              </div>
            </div>

            {/* Right Action & Role Switcher */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              {/* Google Sheets Sync Indicator */}
              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                title="Google Spreadsheet Single Source of Truth"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-blue-100 transition-colors"
              >
                <FileSpreadsheet className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden lg:inline">Spreadsheet:</span>
                <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Tersinkron
                </span>
              </button>

              {/* Navigation Mode Pill */}
              <div className="flex items-center bg-black/25 p-0.5 sm:p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                <button
                  onClick={() => onSelectTab('murid')}
                  className={`flex items-center space-x-1 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    currentTab === 'murid'
                      ? 'bg-white text-blue-900 shadow-md font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Murid</span>
                </button>

                <button
                  onClick={handleTeacherClick}
                  className={`flex items-center space-x-1 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    currentTab === 'guru'
                      ? 'bg-emerald-500 text-white shadow-md font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Guru</span>
                  {!isTeacherAuthenticated && <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300 ml-0.5 opacity-70" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Toast Notification */}
        {syncToast && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm px-4 py-2 text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncToast}</span>
          </div>
        )}
      </header>

      {/* PIN Verification Modal for Teacher Access */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Akses Khusus Guru</h3>
                  <p className="text-xs text-slate-500">I Ketut Agus Nova Anggarawan, S.Pd.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyPin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Masukkan PIN Guru
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Contoh: 1234"
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest font-mono"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{pinError}</p>
                )}
                <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    Untuk demonstrasi dan pengujian, gunakan PIN default: <strong className="font-mono bg-blue-100 px-1 py-0.5 rounded">1234</strong>
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
                >
                  Masuk Dashboard Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
