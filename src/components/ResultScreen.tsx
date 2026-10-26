import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  RotateCcw, 
  MessageSquare, 
  Send, 
  FileCheck2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  School,
  Printer,
  ChevronRight
} from 'lucide-react';
import { SubmissionResult } from '../types/lkm';
import { lkmEngine } from '../services/lkmEngine';

interface ResultScreenProps {
  submission: SubmissionResult;
  onRetake?: () => void;
  onBackToHome: () => void;
  onOpenPrintModal?: () => void;
  onOpenReflectionSidebar: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  submission,
  onRetake,
  onBackToHome,
  onOpenPrintModal,
  onOpenReflectionSidebar
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasReflection, setHasReflection] = useState(submission.refleksiTersimpan || false);

  // Confetti effect on load if score >= 70
  useEffect(() => {
    if (submission.nilaiAkhir >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore if confetti not supported
      }
    }

    const ref = lkmEngine.getReflectionBySubmissionId(submission.id);
    if (ref) {
      setHasReflection(true);
    }
  }, [submission.id, submission.nilaiAkhir]);

  // Determine badge styling based on category
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Sangat Baik':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-800',
          lightBg: 'bg-emerald-50',
          border: 'border-emerald-300'
        };
      case 'Baik':
        return {
          bg: 'bg-blue-600',
          text: 'text-blue-800',
          lightBg: 'bg-blue-50',
          border: 'border-blue-300'
        };
      case 'Cukup Baik':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-800',
          lightBg: 'bg-amber-50',
          border: 'border-amber-300'
        };
      case 'Perlu Peningkatan':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-800',
          lightBg: 'bg-orange-50',
          border: 'border-orange-300'
        };
      default:
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-800',
          lightBg: 'bg-rose-50',
          border: 'border-rose-300'
        };
    }
  };

  const theme = getCategoryTheme(submission.kategori);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn pb-24 overflow-x-hidden">
      {/* Celebration Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] sm:text-xs font-bold">
          <School className="w-3.5 h-3.5 text-blue-700" />
          <span>SMA NEGERI 1 TEJAKULA • LKM PJOK</span>
        </div>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          HASIL LKM DIGITAL PJOK
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto px-2">
          Selamat, Anda telah menyelesaikan Lembar Kerja Murid secara digital! Berikut hasil asesmen terperinci dan umpan balik belajar Anda.
        </p>
      </div>

      {/* Main Score & Student Identity Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-52 h-52 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-slate-100">
          <div className="space-y-1.5 text-center md:text-left w-full md:w-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Identitas Peserta Didik
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
              {submission.namaMurid}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-xs text-slate-600 pt-1">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-[11px] sm:text-xs">
                Kelas: {submission.kelas}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 text-[11px] sm:text-xs">
                NIS: {submission.nis}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 flex items-center gap-1 text-[11px] sm:text-xs">
                <Calendar className="w-3 h-3 text-slate-400" />
                {submission.tanggal} ({submission.waktuPengerjaan})
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Materi: <strong className="text-slate-800">{submission.materi}</strong>
            </p>
          </div>

          {/* Hero Score Badge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              NILAI AKHIR
            </div>
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white ring-4 ring-blue-50">
                <span className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                  {submission.nilaiAkhir}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-blue-200 mt-1">Skala 100</span>
              </div>
            </div>
            <div className={`mt-2.5 px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-extrabold border ${theme.lightBg} ${theme.text} ${theme.border}`}>
              {submission.kategori}
            </div>
          </div>
        </div>

        {/* 4 Cards Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-5 sm:pt-6">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-800 text-[10px] sm:text-xs font-bold mb-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>BENAR</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-emerald-900">
              {submission.benar} <span className="text-[10px] sm:text-xs font-semibold text-emerald-700">Soal</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600 mt-0.5 font-medium">
              {submission.persentaseBenar}% Akurasi
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-800 text-[10px] sm:text-xs font-bold mb-0.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>SALAH</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-rose-900">
              {submission.salah} <span className="text-[10px] sm:text-xs font-semibold text-rose-700">Soal</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-rose-600 mt-0.5 font-medium">
              Pelajari lagi
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-700 text-[10px] sm:text-xs font-bold mb-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>KOSONG</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-slate-800">
              {submission.kosong} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Soal</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 font-medium">
              Tidak dijawab
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-800 text-[10px] sm:text-xs font-bold mb-0.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>TOTAL</span>
            </div>
            <div className="text-xl sm:text-3xl font-extrabold text-blue-900">
              {submission.totalSoal} <span className="text-[10px] sm:text-xs font-semibold text-blue-700">Butir</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-blue-600 mt-0.5 font-medium">
              LKM PJOK
            </div>
          </div>
        </div>

        {/* Action Buttons: Lihat Pembahasan & Cetak */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>LIHAT PEMBAHASAN SOAL LENGKAP</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Lembar</span>
              </button>
            )}

            {onRetake && (
              <button
                type="button"
                onClick={onRetake}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Ulang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DEDICATED REFLECTION BANNER -> OPENS SIDEBAR */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border border-teal-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Lembar Refleksi Diri Murid (Sidebar)
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              hasReflection ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
            }`}>
              {hasReflection ? '✓ Tersimpan' : 'Wajib Diisi'}
            </span>
          </div>
          <p className="text-xs text-teal-100/90 leading-relaxed max-w-xl">
            Lengkapi 4 pertanyaan refleksi belajar di sidebar khusus untuk dikirimkan langsung ke Google Spreadsheet guru.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenReflectionSidebar}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <span>Buka Lembar Refleksi</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Umpan Balik Otomatis Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Umpan Balik Pembelajaran Otomatis</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Evaluasi deskriptif personal berdasarkan capaian skor Anda</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50/80 to-blue-50/80 border border-emerald-200/60 text-slate-800 text-xs sm:text-sm sm:leading-relaxed">
          "{submission.umpanBalik}"
        </div>
      </div>

      {/* Analisis Jawaban Berdasarkan Indikator Pembelajaran (Responsive Mobile Layout) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Analisis Penguasaan Indikator
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Pemetaan ketuntasan konsep kebugaran jasmani per indikator kompetensi
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Fase F PJOK
          </span>
        </div>

        {/* Mobile View: Cards */}
        <div className="space-y-2.5 sm:hidden">
          {submission.analisisIndikator.map((item, idx) => {
            const pct = item.total > 0 ? Math.round((item.benar / item.total) * 100) : 0;
            const isMastered = pct >= 75;
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-xs text-slate-900 leading-snug">
                    {item.indikator}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${isMastered ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Total: <strong>{item.total} Soal</strong></span>
                  <span className="text-emerald-700">Benar: <strong>{item.benar}</strong></span>
                  <span className="text-rose-700">Salah: <strong>{item.total - item.benar}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-2.5 px-3">Indikator Pembelajaran</th>
                <th className="py-2.5 px-3 text-center">Jumlah Soal</th>
                <th className="py-2.5 px-3 text-center">Benar</th>
                <th className="py-2.5 px-3 text-center">Salah / Kosong</th>
                <th className="py-2.5 px-3">Tingkat Penguasaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submission.analisisIndikator.map((item, idx) => {
                const pct = item.total > 0 ? Math.round((item.benar / item.total) * 100) : 0;
                const isMastered = pct >= 75;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {item.indikator}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {item.total}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {item.benar}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">
                      {item.total - item.benar}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              isMastered ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-bold ${isMastered ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saran Belajar Khusus Berdasarkan Indikator yang Lemah */}
      {submission.saranBelajarList.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 pb-2 sm:pb-3 border-b border-slate-100">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Materi yang Perlu Diperkuat & Saran Belajar Mandiri
            </h3>
          </div>

          <div className="space-y-2">
            {submission.saranBelajarList.map((saran, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 sm:gap-3"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-200/80 text-amber-800 text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{saran}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rekomendasi Tindak Lanjut Otomatis */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2 pb-2 sm:pb-3 border-b border-slate-100">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Rekomendasi Tindak Lanjut Pembelajaran
          </h3>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          {submission.rekomendasiTindakLanjut.map((rek, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></span>
              <span className="leading-relaxed">{rek}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back to Home Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Selesai & Kembali ke Beranda</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Action Button for Reflection Sidebar */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={onOpenReflectionSidebar}
          className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold text-white transition-all transform hover:scale-105 cursor-pointer ${
            hasReflection 
              ? 'bg-teal-700 hover:bg-teal-800' 
              : 'bg-gradient-to-r from-teal-600 to-emerald-600 animate-bounce'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{hasReflection ? 'Lihat Refleksi Saya' : '💬 Isi Lembar Refleksi'}</span>
        </button>
      </div>

      {/* Review Modal: Full Question Explanations */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span>Pembahasan Soal Lengkap</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Benar: {submission.benar} • Salah: {submission.salah} • Kosong: {submission.kosong}
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="overflow-y-auto py-3 sm:py-4 space-y-4 pr-1">
              {submission.reviewQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 space-y-2.5 sm:space-y-3 ${
                    q.isBenar
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {q.nomor}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 line-clamp-1">
                        Indikator: {q.indikator}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold flex items-center gap-1 shrink-0 ${
                        q.isBenar
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.isBenar ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>BENAR</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>{q.isKosong ? 'KOSONG' : 'SALAH'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.pertanyaan}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold text-[10px] mb-0.5">Jawaban Anda:</span>
                      <span className={`font-bold ${q.isBenar ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {q.jawabanMurid}
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold text-[10px] mb-0.5">Kunci Jawaban Benar:</span>
                      <span className="font-bold text-emerald-700">
                        {q.kunciJawaban}
                      </span>
                    </div>
                  </div>

                  {q.pembahasan && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-950 leading-relaxed">
                      <strong className="block text-blue-800 font-bold mb-0.5">Pembahasan:</strong>
                      {q.pembahasan}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                Tutup Pembahasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
