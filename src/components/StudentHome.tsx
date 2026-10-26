import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Info, 
  HelpCircle, 
  Award, 
  RotateCcw,
  Sparkles,
  School,
  FileCheck2,
  Calendar,
  Clock
} from 'lucide-react';
import { lkmEngine } from '../services/lkmEngine';
import { Student, LKMInfo, SubmissionResult } from '../types/lkm';

interface StudentHomeProps {
  onStartExam: (data: {
    student: Student;
    lkm: LKMInfo;
  }) => void;
  onViewPreviousResult: (submission: SubmissionResult) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onStartExam,
  onViewPreviousResult
}) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [lkms, setLkms] = useState<LKMInfo[]>([]);
  const [selectedLKM, setSelectedLKM] = useState<LKMInfo | null>(null);

  const [existingSubmission, setExistingSubmission] = useState<SubmissionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const classList = lkmEngine.getClasses();
    setClasses(classList);
    if (classList.length > 0) {
      setSelectedClass(classList[0]);
    }

    const activeLkms = lkmEngine.getActiveLKMs();
    setLkms(activeLkms);
    if (activeLkms.length > 0) {
      setSelectedLKM(activeLkms[0]);
    }
  }, []);

  // Update students dropdown when class changes
  useEffect(() => {
    if (selectedClass) {
      const roster = lkmEngine.getStudentsByClass(selectedClass);
      setStudentsInClass(roster);
      setSelectedStudent(null);
      setExistingSubmission(null);
    }
  }, [selectedClass]);

  // Check for duplicate submission when student and LKM are selected
  useEffect(() => {
    if (selectedStudent && selectedLKM) {
      const previous = lkmEngine.checkExistingSubmission(
        selectedStudent.nama,
        selectedStudent.kelas,
        selectedLKM.id
      );
      setExistingSubmission(previous);
      setErrorMessage('');
    } else {
      setExistingSubmission(null);
    }
  }, [selectedStudent, selectedLKM]);

  const handleStart = (isRetake: boolean = false) => {
    setErrorMessage('');

    if (!selectedClass) {
      setErrorMessage('Silakan pilih kelas terlebih dahulu.');
      return;
    }
    if (!selectedStudent) {
      setErrorMessage('Silakan pilih nama murid sesuai daftar kelas.');
      return;
    }
    if (!selectedLKM) {
      setErrorMessage('Silakan pilih LKM yang akan dikerjakan.');
      return;
    }

    if (existingSubmission && !isRetake && !selectedLKM.allowRetake) {
      setErrorMessage('Anda sudah menyelesaikan LKM ini dan pengaturan tidak mengizinkan pengerjaan ulang.');
      return;
    }

    onStartExam({
      student: selectedStudent,
      lkm: selectedLKM
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8 animate-fadeIn overflow-x-hidden">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white p-4 sm:p-8 shadow-xl border border-blue-700/50">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-emerald-300">
            <School className="w-3.5 h-3.5 text-emerald-400" />
            <span>SMA Negeri 1 Tejakula • PJOK Fase F</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            LKM DIGITAL PJOK
          </h1>
          <p className="text-sm sm:text-lg md:text-xl font-medium text-emerald-300">
            "Belajar Aktif, Berpikir Kritis, dan Refleksi Diri"
          </p>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed pt-0.5">
            Selamat datang di media asesmen dan lembar kerja digital mata pelajaran Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK). Seluruh soal, identitas, dan hasil penilaian otomatis terintegrasi langsung dengan master Google Spreadsheet.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-blue-200">
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/10">
              <span className="font-semibold text-white">Guru:</span>
              <span>I Ketut Agus Nova Anggarawan, S.Pd.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/10">
              <span className="font-semibold text-white">Database:</span>
              <span className="text-emerald-300 font-medium">Google Spreadsheet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Identitas & Info LKM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        {/* Identitas Murid Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-2.5 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Form Identitas Murid</h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Pilih kelas dan nama Anda sesuai presensi resmi</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 1. Pilih Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Pilih Kelas
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="" disabled>-- Pilih Kelas Anda --</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    Kelas {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Pilih Nama Murid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Pilih Nama Murid
              </label>
              <select
                value={selectedStudent?.nis || ''}
                onChange={(e) => {
                  const s = studentsInClass.find((item) => item.nis === e.target.value);
                  setSelectedStudent(s || null);
                }}
                disabled={!selectedClass}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="">
                  {selectedClass ? '-- Pilih Nama Anda Sesuai Rombel --' : 'Pilih kelas terlebih dahulu'}
                </option>
                {studentsInClass.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                *Nama murid terdaftar otomatis dari Google Spreadsheet dan tidak dapat diketik bebas.
              </p>
            </div>

            {/* 3. Pilih Materi / LKM */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Pilih Materi / Lembar Kerja Murid (LKM)
              </label>
              <select
                value={selectedLKM?.id || ''}
                onChange={(e) => {
                  const l = lkms.find((item) => item.id === e.target.value);
                  setSelectedLKM(l || null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              >
                {lkms.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.judul} ({l.jumlahSoal} Butir Soal)
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message Notice */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Duplicate Submission Warning & Options */}
            {existingSubmission && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">
                      Anda Sudah Mengerjakan LKM Ini
                    </h4>
                    <p className="text-xs text-amber-800 mt-1">
                      Nama <strong className="text-slate-900">{existingSubmission.namaMurid}</strong> tercatat telah mengumpulkan pada tanggal <strong>{existingSubmission.tanggal}</strong> pukul <strong>{existingSubmission.waktuPengerjaan}</strong>.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-900">
                        Nilai Terakhir: {existingSubmission.nilaiAkhir}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {existingSubmission.kategori}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={() => onViewPreviousResult(existingSubmission)}
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>Lihat Hasil & Analisis</span>
                  </button>

                  {selectedLKM?.allowRetake && (
                    <button
                      type="button"
                      onClick={() => handleStart(true)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-700" />
                      <span>Kerjakan Ulang</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!existingSubmission && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStart(false)}
                  disabled={!selectedStudent || !selectedLKM}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span>MULAI MENGERJAKAN LKM</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LKM Details & Objectives Card */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {selectedLKM && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-4 sm:space-y-5">
              <div className="flex items-center space-x-2 pb-2.5 sm:pb-3 border-b border-slate-100">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                  Informasi Lembar Kerja
                </h3>
              </div>

              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {selectedLKM.fase}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1.5 sm:mt-2">
                  {selectedLKM.judul}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Materi: {selectedLKM.materi}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="block text-[11px] text-slate-500 font-medium">Jumlah Soal</span>
                  <span className="text-lg font-extrabold text-blue-700">{selectedLKM.jumlahSoal} Butir</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="block text-[11px] text-slate-500 font-medium">Batas Waktu</span>
                  <span className="text-lg font-extrabold text-teal-700">Fleksibel</span>
                </div>
              </div>

              {/* Tujuan Pembelajaran */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Tujuan Pembelajaran:
                </h5>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedLKM.tujuanPembelajaran.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Petunjuk Pengerjaan */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  Petunjuk Pengerjaan:
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {selectedLKM.petunjuk.slice(0, 3).map((p, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tips PJOK Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h5 className="text-xs font-bold uppercase tracking-wider">
                Refleksi & Penilaian Mandiri
              </h5>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Setelah menyelesaikan LKM, Anda akan langsung menerima umpan balik personal, analisis penguasaan indikator materi kebugaran jasmani, serta saran belajar mandiri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
