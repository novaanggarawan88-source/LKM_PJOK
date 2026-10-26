import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  ListOrdered,
  X,
  FileCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { QuestionClient, Student, LKMInfo } from '../types/lkm';

interface ExamScreenProps {
  student: Student;
  lkm: LKMInfo;
  questions: QuestionClient[];
  onFinishExam: (answers: Record<string, string>) => void;
  onCancel: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  student,
  lkm,
  questions,
  onFinishExam,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Modals
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Restore saved draft answers during session if present
  useEffect(() => {
    const draftKey = `draft_ans_${student.nis}_${lkm.id}`;
    const saved = sessionStorage.getItem(draftKey);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed restoring draft', e);
      }
    }
  }, [student.nis, lkm.id]);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] && answers[k].trim() !== ''
  ).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (qId: string, val: string) => {
    const updated = { ...answers, [qId]: val };
    setAnswers(updated);
    // Persist draft in session
    sessionStorage.setItem(`draft_ans_${student.nis}_${lkm.id}`, JSON.stringify(updated));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAttempt = () => {
    if (unansweredCount > 0) {
      setShowIncompleteWarning(true);
    } else {
      setShowFinalConfirm(true);
    }
  };

  const handleFinalSubmit = () => {
    setShowIncompleteWarning(false);
    setShowFinalConfirm(false);
    sessionStorage.removeItem(`draft_ans_${student.nis}_${lkm.id}`);
    onFinishExam(answers);
  };

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-slate-600">
        <p>Soal belum tersedia untuk LKM ini. Silakan hubungi guru.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">
              {lkm.kelas} • {lkm.fase}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">{student.nama} ({student.kelas})</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {lkm.judul}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInstructionsModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Petunjuk</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNavDrawer(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-800 flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Nomor Soal ({answeredCount}/{totalQuestions})</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{answeredCount}</strong> dari {totalQuestions} soal telah dijawab
            </span>
          </div>
          <span className="text-blue-700 font-bold">{progressPercent}% Selesai</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Question Display Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        {/* Question Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
              {currentQ.nomor}
            </span>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Soal {currentQ.nomor} dari {totalQuestions}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                  Indikator: {currentQ.indikator}
                </span>
              </div>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Bobot: {currentQ.bobot} Poin
          </span>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
          {currentQ.pertanyaan}
        </div>

        {/* Options / Answer Input based on Type */}
        <div className="space-y-3 pt-2">
          {/* Pilihan Ganda (A - E) */}
          {currentQ.tipe === 'pilihan_ganda' && currentQ.opsi && (
            <div className="space-y-2.5">
              {currentQ.opsi.map((opsi) => {
                const isSelected = answers[currentQ.id] === opsi.key;
                return (
                  <div
                    key={opsi.key}
                    onClick={() => handleSelectOption(currentQ.id, opsi.key)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {opsi.key}
                    </div>
                    <span
                      className={`text-sm sm:text-base leading-snug ${
                        isSelected ? 'font-bold text-blue-950' : 'text-slate-800'
                      }`}
                    >
                      {opsi.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Benar atau Salah */}
          {currentQ.tipe === 'benar_salah' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {['BENAR', 'SALAH'].map((val) => {
                const isSelected = answers[currentQ.id] === val;
                const isBenarOption = val === 'BENAR';
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, val)}
                    className={`py-5 px-6 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-3 ${
                      isSelected
                        ? isBenarOption
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300 shadow-sm'
                          : 'border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-300 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">
                      {isSelected ? '✓' : ''}
                    </span>
                    <span>{val}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Isian Singkat */}
          {currentQ.tipe === 'isian' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Ketikkan Jawaban Singkat Anda:
              </label>
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                placeholder="Tulis istilah atau jawaban ringkas di sini..."
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium"
              />
              <p className="text-[11px] text-slate-400 italic">
                *Penulisan huruf besar atau kecil tidak mempengaruhi penilaian.
              </p>
            </div>
          )}

          {/* Uraian */}
          {currentQ.tipe === 'uraian' && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Tuliskan Jawaban Uraian Anda:
              </label>
              <textarea
                rows={4}
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                placeholder="Tuliskan analisis atau penjelasan Anda secara terstruktur..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium text-sm"
              ></textarea>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Soal uraian akan diverifikasi status penilaiannya oleh guru PJOK.</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>KUMPULKAN JAWABAN</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Sticky Bottom Bar for Quick Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="hidden sm:inline">Status Pengerjaan:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              {answeredCount}/{totalQuestions} Soal
            </span>
            {unansweredCount > 0 ? (
              <span className="text-amber-600 text-xs font-medium">({unansweredCount} belum)</span>
            ) : (
              <span className="text-emerald-600 text-xs font-bold">✓ Lengkap</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNavDrawer(true)}
              className="sm:hidden px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
            >
              Daftar Soal
            </button>
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Kumpulkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Question Navigator Drawer / Modal */}
      {showNavDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Navigasi Nomor Soal</h3>
              </div>
              <button
                onClick={() => setShowNavDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Sudah Dijawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  <span>Belum Dijawab ({unansweredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full ring-2 ring-blue-500 bg-white"></span>
                  <span>Soal Aktif</span>
                </div>
              </div>

              {/* Grid 1 - 20 */}
              <div className="grid grid-cols-5 gap-2.5 pt-1">
                {questions.map((q, idx) => {
                  const hasAns = answers[q.id] && answers[q.id].trim() !== '';
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowNavDrawer(false);
                      }}
                      className={`h-11 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        isActive
                          ? 'ring-2 ring-blue-600 bg-blue-600 text-white shadow-md'
                          : hasAns
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNavDrawer(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Navigasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning: Unanswered Questions Modal */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Peringatan: Soal Belum Lengkap!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Masih terdapat <strong className="text-amber-700 font-extrabold text-base">{unansweredCount} butir soal</strong> yang belum Anda jawab. Apakah Anda ingin memeriksa kembali?
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-snug">
              Soal yang tidak dijawab akan dihitung sebagai kosong dan mempengaruhi perolehan nilai akhir Anda.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteWarning(false);
                  setShowNavDrawer(true);
                }}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                PERIKSA KEMBALI
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowIncompleteWarning(false);
                  setShowFinalConfirm(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                TETAP KUMPULKAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submission Confirmation Dialog */}
      {showFinalConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <FileCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Konfirmasi Pengumpulan Jawaban
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin mengumpulkan jawaban? Jawaban yang telah dikumpulkan akan langsung dinilai oleh sistem backend dan tidak dapat diubah kembali.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Nama Murid:</span>
                <span className="font-bold text-slate-900">{student.nama}</span>
              </div>
              <div className="flex justify-between">
                <span>Kelas:</span>
                <span className="font-bold text-slate-900">{student.kelas}</span>
              </div>
              <div className="flex justify-between">
                <span>Soal Terjawab:</span>
                <span className="font-bold text-emerald-700">{answeredCount} dari {totalQuestions} Soal</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinalConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all"
              >
                YA, KUMPULKAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions & Objectives Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Petunjuk & Tujuan LKM</span>
              </h3>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tujuan Pembelajaran:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {lkm.tujuanPembelajaran.map((t, idx) => (
                  <li key={idx} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Petunjuk Pengerjaan:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
                {lkm.petunjuk.map((p, idx) => (
                  <li key={idx} className="leading-relaxed">{p}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Kembali Mengerjakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
