import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  ArrowRight,
  School
} from 'lucide-react';
import { SubmissionResult, StudentReflection } from '../types/lkm';
import { lkmEngine } from '../services/lkmEngine';
import { googleSheetsService } from '../services/googleSheetsService';

interface ReflectionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionResult | null;
  onSavedSuccess?: () => void;
}

export const ReflectionSidebar: React.FC<ReflectionSidebarProps> = ({
  isOpen,
  onClose,
  submission,
  onSavedSuccess
}) => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (submission) {
      const existing = lkmEngine.getReflectionBySubmissionId(submission.id);
      if (existing) {
        setQ1(existing.q1);
        setQ2(existing.q2);
        setQ3(existing.q3);
        setQ4(existing.q4);
        setSavedSuccess(true);
      } else {
        setSavedSuccess(submission.refleksiTersimpan || false);
      }
    }
  }, [submission]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    if (!q1.trim() && !q2.trim() && !q4.trim()) {
      alert('Silakan tuliskan refleksi Anda sebelum menyimpan.');
      return;
    }

    setIsSaving(true);
    const refData: StudentReflection = {
      submissionId: submission.id,
      namaMurid: submission.namaMurid,
      kelas: submission.kelas,
      materi: submission.materi,
      q1: q1.trim(),
      q2: q2.trim(),
      q3: q3.trim(),
      q4: q4.trim(),
      timestamp: new Date().toISOString()
    };

    lkmEngine.saveReflection(refData);
    await googleSheetsService.pushReflectionToGoogleSheet(refData);

    setIsSaving(false);
    setSavedSuccess(true);
    setToastMsg('Refleksi Anda berhasil disimpan ke Google Spreadsheet!');
    if (onSavedSuccess) onSavedSuccess();
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slideInRight border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 to-blue-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 border border-white/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  Sidebar Refleksi Murid
                </h3>
                <p className="text-[11px] text-teal-200 line-clamp-1">
                  SMA Negeri 1 Tejakula • PJOK
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Student Info */}
          {submission && (
            <div className="px-4 py-3 bg-teal-50 border-b border-teal-100 flex items-center justify-between text-xs shrink-0">
              <div>
                <strong className="text-teal-950 font-bold block">{submission.namaMurid}</strong>
                <span className="text-teal-700 font-medium">Kelas {submission.kelas} • NIS: {submission.nis}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                savedSuccess ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {savedSuccess ? '✓ Sudah Disimpan' : 'Belum Disimpan'}
              </span>
            </div>
          )}

          {/* Toast */}
          {toastMsg && (
            <div className="mx-4 mt-3 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fadeIn shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Form Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-slate-800">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                Panduan Refleksi Belajar PJOK:
              </p>
              <p className="leading-relaxed">
                Tuliskan evaluasi diri Anda secara jujur setelah mengerjakan LKM. Jawaban refleksi ini akan langsung dikirimkan ke guru PJOK (Pak Agus Nova) via Google Spreadsheet.
              </p>
            </div>

            <form id="reflection-form" onSubmit={handleSave} className="space-y-4">
              {/* Pertanyaan 1 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Apa hal baru yang kamu pelajari atau materi yang sudah dipahami dengan baik hari ini?</span>
                </label>
                <textarea
                  rows={3}
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  placeholder="Contoh: Saya memahami urutan pos circuit training dan rumus denyut nadi maksimal..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800 transition-all resize-none"
                ></textarea>
              </div>

              {/* Pertanyaan 2 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Bagian materi apa yang masih sulit atau perlu kamu pelajari kembali?</span>
                </label>
                <textarea
                  rows={3}
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  placeholder="Contoh: Menghitung target training zone dan membedakan komponen power vs kekuatan..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800 transition-all resize-none"
                ></textarea>
              </div>

              {/* Pertanyaan 3 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Apa penyebab kamu kesulitan saat menjawab soal tersebut?</span>
                </label>
                <textarea
                  rows={3}
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  placeholder="Contoh: Kurang teliti membaca studi kasus atau belum hafal pembagian serabut otot..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800 transition-all resize-none"
                ></textarea>
              </div>

              {/* Pertanyaan 4 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-snug">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Apa rencana langkah konkret yang akan kamu lakukan untuk meningkatkan pemahamanmu?</span>
                </label>
                <textarea
                  rows={3}
                  value={q4}
                  onChange={(e) => setQ4(e.target.value)}
                  placeholder="Contoh: Mempraktikkan circuit training di rumah, membaca modul, dan berdiskusi dengan teman..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800 transition-all resize-none"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
            <button
              type="submit"
              form="reflection-form"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan ke Spreadsheet...' : 'SIMPAN REFLEKSI KE SPREADSHEET'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium text-center"
            >
              Tutup Sidebar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
