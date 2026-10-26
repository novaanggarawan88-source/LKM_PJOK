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
  ChevronDown, 
  ChevronUp, 
  FileCheck2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  School,
  Share2,
  Printer
} from 'lucide-react';
import { SubmissionResult, StudentReflection } from '../types/lkm';
import { lkmEngine } from '../services/lkmEngine';
import { googleSheetsService } from '../services/googleSheetsService';

interface ResultScreenProps {
  submission: SubmissionResult;
  onRetake?: () => void;
  onBackToHome: () => void;
  onOpenPrintModal?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  submission,
  onRetake,
  onBackToHome,
  onOpenPrintModal
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(submission.refleksiTersimpan || false);
  const [isSavingRef, setIsSavingRef] = useState(false);
  const [refToast, setRefToast] = useState('');

  // 4 Reflection form answers
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');

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

    // Load previously saved reflection if existing
    const existingRef = lkmEngine.getReflectionBySubmissionId(submission.id);
    if (existingRef) {
      setQ1(existingRef.q1);
      setQ2(existingRef.q2);
      setQ3(existingRef.q3);
      setQ4(existingRef.q4);
      setReflectionSaved(true);
    }
  }, [submission.id, submission.nilaiAkhir]);

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim() && !q2.trim() && !q4.trim()) {
      alert('Silakan isi refleksi Anda sebelum menyimpan.');
      return;
    }

    setIsSavingRef(true);
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

    setIsSavingRef(false);
    setReflectionSaved(true);
    setRefToast('Refleksi Anda berhasil disimpan ke Google Spreadsheet!');
    setTimeout(() => setRefToast(''), 4000);
  };

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <School className="w-4 h-4 text-blue-700" />
          <span>SMA NEGERI 1 TEJAKULA • LKM PJOK</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          HASIL LKM DIGITAL PJOK
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
          Selamat, Anda telah menyelesaikan Lembar Kerja Murid secara digital! Berikut hasil asesmen terperinci dan umpan balik belajar Anda.
        </p>
      </div>

      {/* Main Score & Student Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Identitas Peserta Didik
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {submission.namaMurid}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-600 pt-1">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Kelas: {submission.kelas}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                NIS: {submission.nis}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {submission.tanggal} ({submission.waktuPengerjaan})
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Materi: <strong className="text-slate-800">{submission.materi}</strong>
            </p>
          </div>

          {/* Hero Score Badge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              NILAI AKHIR
            </div>
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white ring-4 ring-blue-50">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  {submission.nilaiAkhir}
                </span>
                <span className="text-[11px] font-semibold text-blue-200 mt-1">Skala 100</span>
              </div>
            </div>
            <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-extrabold border ${theme.lightBg} ${theme.text} ${theme.border}`}>
              Kategori: {submission.kategori}
            </div>
          </div>
        </div>

        {/* 4 Cards Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>JAWABAN BENAR</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
              {submission.benar} <span className="text-xs font-semibold text-emerald-700">Soal</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              {submission.persentaseBenar}% Akurasi
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-800 text-xs font-bold mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>JAWABAN SALAH</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-900">
              {submission.salah} <span className="text-xs font-semibold text-rose-700">Soal</span>
            </div>
            <div className="text-[11px] text-rose-600 mt-0.5 font-medium">
              Perlu dipelajari
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-bold mb-1">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>BELUM DIJAWAB</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {submission.kosong} <span className="text-xs font-semibold text-slate-500">Soal</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Kosong
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-blue-800 text-xs font-bold mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>TOTAL SOAL</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">
              {submission.totalSoal} <span className="text-xs font-semibold text-blue-700">Butir</span>
            </div>
            <div className="text-[11px] text-blue-600 mt-0.5 font-medium">
              LKM PJOK Fase F
            </div>
          </div>
        </div>

        {/* Action Buttons: Lihat Pembahasan & Cetak */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>LIHAT PEMBAHASAN SOAL LENGKAP</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenPrintModal && (
              <button
                type="button"
                onClick={onOpenPrintModal}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Lembar Hasil</span>
              </button>
            )}

            {onRetake && (
              <button
                type="button"
                onClick={onRetake}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Kerjakan Ulang</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Umpan Balik Otomatis Card (Fitur Utama) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Umpan Balik Pembelajaran Otomatis</h3>
            <p className="text-xs text-slate-500">Evaluasi deskriptif personal berdasarkan capaian skor Anda</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-blue-50/80 border border-emerald-200/60 text-slate-800 text-sm sm:text-base leading-relaxed">
          "{submission.umpanBalik}"
        </div>
      </div>

      {/* Analisis Jawaban Berdasarkan Indikator Pembelajaran */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Analisis Penguasaan Indikator Pembelajaran
            </h3>
            <p className="text-xs text-slate-500">
              Pemetaan ketuntasan konsep kebugaran jasmani per indikator kompetensi
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Fase F PJOK
          </span>
        </div>

        <div className="overflow-x-auto">
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
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Materi yang Perlu Diperkuat & Saran Belajar Mandiri
            </h3>
          </div>

          <div className="space-y-2.5">
            {submission.saranBelajarList.map((saran, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-amber-950 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{saran}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rekomendasi Tindak Lanjut Otomatis */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Rekomendasi Tindak Lanjut Pembelajaran
          </h3>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          {submission.rekomendasiTindakLanjut.map((rek, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></span>
              <span className="leading-relaxed">{rek}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form Refleksi Murid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Lembar Refleksi Diri Murid
            </h3>
            <p className="text-xs text-slate-500">
              Refleksikan hasil belajar Anda hari ini. Jawaban tersimpan otomatis ke Google Spreadsheet.
            </p>
          </div>
        </div>

        {refToast && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{refToast}</span>
          </div>
        )}

        <form onSubmit={handleSaveReflection} className="space-y-5">
          {/* Pertanyaan 1 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Apa hal baru yang kamu pelajari atau materi apa yang sudah kamu pahami dengan baik hari ini?
            </label>
            <textarea
              rows={2}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="Contoh: Saya memahami urutan pos circuit training dan rumus denyut nadi maksimal..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800"
            ></textarea>
          </div>

          {/* Pertanyaan 2 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              2. Bagian materi apa yang masih sulit atau perlu kamu pelajari kembali?
            </label>
            <textarea
              rows={2}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              placeholder="Contoh: Menghitung target training zone dan membedakan komponen power vs kekuatan..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800"
            ></textarea>
          </div>

          {/* Pertanyaan 3 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              3. Apa penyebab kamu kesulitan menjawab soal tersebut?
            </label>
            <textarea
              rows={2}
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              placeholder="Contoh: Kurang teliti membaca studi kasus atau belum hafal pembagian serabut otot..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800"
            ></textarea>
          </div>

          {/* Pertanyaan 4 */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              4. Apa rencana langkah konkret yang akan kamu lakukan untuk meningkatkan pemahamanmu?
            </label>
            <textarea
              rows={2}
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              placeholder="Contoh: Mencatat kembali di buku PJOK, mempraktikkan circuit training, dan bertanya ke guru..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-xs sm:text-sm text-slate-800"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 italic">
              {reflectionSaved ? '✓ Refleksi telah tersimpan ke sistem.' : '*Harap simpan refleksi sebelum keluar.'}
            </span>
            <button
              type="submit"
              disabled={isSavingRef}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSavingRef ? 'Menyimpan...' : 'SIMPAN REFLEKSI KE SPREADSHEET'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Back to Home Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors inline-flex items-center gap-2"
        >
          <span>Selesai & Kembali ke Beranda</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Review Modal: Full Question Explanations */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Pembahasan Soal Lengkap ({submission.materi})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Benar: {submission.benar} • Salah: {submission.salah} • Kosong: {submission.kosong}
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-5 pr-1">
              {submission.reviewQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
                    q.isBenar
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {q.nomor}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Indikator: {q.indikator}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold flex items-center gap-1 ${
                        q.isBenar
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.isBenar ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>BENAR</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>{q.isKosong ? 'KOSONG' : 'SALAH'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.pertanyaan}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold mb-0.5">Jawaban Anda:</span>
                      <span className={`font-bold ${q.isBenar ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {q.jawabanMurid}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold mb-0.5">Kunci Jawaban Benar:</span>
                      <span className="font-bold text-emerald-700">
                        {q.kunciJawaban}
                      </span>
                    </div>
                  </div>

                  {q.pembahasan && (
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-950 leading-relaxed">
                      <strong className="block text-blue-800 font-bold mb-1">Pembahasan:</strong>
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
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
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
