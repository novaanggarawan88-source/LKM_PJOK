import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Link as LinkIcon, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { googleSheetsService, extractSpreadsheetId } from '../services/googleSheetsService';
import { lkmEngine } from '../services/lkmEngine';

interface SpreadsheetConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SpreadsheetConnectModal: React.FC<SpreadsheetConnectModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const currentConfig = googleSheetsService.getConfig();
  const [sheetInput, setSheetInput] = useState(currentConfig.sheetId || '');
  const [webAppUrlInput, setWebAppUrlInput] = useState(currentConfig.webAppUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  if (!isOpen) return null;

  const detectedCleanId = extractSpreadsheetId(sheetInput);

  const handleTestAndSync = async () => {
    if (!sheetInput.trim() && !webAppUrlInput.trim()) {
      setSyncResult({
        success: false,
        message: 'Silakan masukkan Link/ID Google Spreadsheet atau URL Google Apps Script.'
      });
      return;
    }

    setIsLoading(true);
    setSyncResult(null);

    const result = await googleSheetsService.syncFromSpreadsheet({
      sheetId: detectedCleanId,
      webAppUrl: webAppUrlInput.trim()
    });

    setIsLoading(false);
    setSyncResult(result);

    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scaleIn max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-inner shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                Integrasi Single Source of Truth
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Hubungkan Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500">
                Sambungkan lembar kerja murid, bank soal, dan hasil ke spreadsheet Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Input 1: Sheet URL or ID */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              1. Link atau ID Google Spreadsheet Anda <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs.../edit atau ID-nya"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            {detectedCleanId && detectedCleanId !== sheetInput && (
              <p className="text-[11px] text-emerald-700 font-mono bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✓ ID Terdeteksi: <strong>{detectedCleanId}</strong>
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pastikan Spreadsheet Anda telah disetel: <strong>Bagikan ➔ Siapa saja yang memiliki link dapat melihat (Viewer)</strong>.
            </p>
          </div>

          {/* Input 2: Web App URL (Optional / for POST) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              2. URL Google Apps Script Web App <span className="text-slate-400 font-normal">(Opsional untuk simpan nilai langsung)</span>
            </label>
            <input
              type="text"
              value={webAppUrlInput}
              onChange={(e) => setWebAppUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Diperoleh setelah menerapkan Web App di menu <em>Terapkan &gt; Penerapan baru</em> dengan akses "Siapa saja (Anyone)".
            </p>
          </div>
        </div>

        {/* Sync / Test Results Alert */}
        {syncResult && (
          <div className={`p-4 rounded-2xl text-xs sm:text-sm border animate-fadeIn ${
            syncResult.success 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-start gap-2.5">
              {syncResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5">
                <div className="font-bold">{syncResult.message}</div>
                {syncResult.details && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                    <span className="p-1.5 rounded bg-white/70 border border-emerald-200">
                      ✓ Murid: {syncResult.details.studentCount} orang
                    </span>
                    <span className="p-1.5 rounded bg-white/70 border border-emerald-200">
                      ✓ Soal: {syncResult.details.questionCount} butir
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Petunjuk Praktis */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-2 text-xs text-blue-950">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Panduan Singkat Integrasi:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed pl-1 text-[11px]">
            <li>Buka spreadsheet Anda lalu klik tombol <strong>Bagikan</strong> di kanan atas.</li>
            <li>Ubah Akses Umum menjadi <strong>"Siapa saja yang memiliki link"</strong> dengan peran <strong>Pelihat (Viewer)</strong>.</li>
            <li>Salin link spreadsheet tersebut dan tempelkan pada kolom di atas.</li>
            <li>Klik tombol <strong>"Uji & Sinkronkan Sekarang"</strong> di bawah.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Status: {googleSheetsService.isCustomSheetConnected() ? (
              <span className="text-emerald-700 font-bold">🟢 Spreadsheet Kustom Aktif</span>
            ) : (
              <span className="text-amber-700 font-bold">🟡 Mode Standar SMAN 1 Tejakula</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleTestAndSync}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menguji & Membaca...' : '🧪 Uji & Sinkronkan Sekarang'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
