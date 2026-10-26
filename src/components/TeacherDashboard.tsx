import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  FileSpreadsheet, 
  Settings, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Award,
  Layers,
  HelpCircle,
  MessageSquare,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Trash2,
  Key,
  ShieldAlert
} from 'lucide-react';
import { lkmEngine } from '../services/lkmEngine';
import { googleSheetsService } from '../services/googleSheetsService';
import { SubmissionResult, StudentReflection, QuestionServer, FeedbackRule, LKMInfo } from '../types/lkm';
import { CODE_GS_CONTENT, SPREADSHEET_SCHEMA_DOCS } from '../data/gasTemplates';
import { PrintReportModal } from './PrintReportModal';

interface TeacherDashboardProps {
  onBackToStudent: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBackToStudent }) => {
  const [activeTab, setActiveTab] = useState<'analisis' | 'rekap' | 'banksoal' | 'pengaturan' | 'integrasi'>('analisis');
  
  // Filters for Submissions
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua Kelas');
  const [selectedMateri, setSelectedMateri] = useState<string>('Semua Materi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filters for Bank Soal
  const [questionSearch, setQuestionSearch] = useState<string>('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string>('semua');

  // Settings states
  const activeLkm = lkmEngine.getActiveLKMs()[0];
  const [allowRetake, setAllowRetake] = useState<boolean>(activeLkm ? activeLkm.allowRetake : true);
  const [lkmIsActive, setLkmIsActive] = useState<boolean>(activeLkm ? activeLkm.isActive : true);
  const [editableFeedbackRules, setEditableFeedbackRules] = useState<FeedbackRule[]>(lkmEngine.getFeedbackRules());
  const [settingSaveToast, setSettingSaveToast] = useState<string>('');

  // Selected detail modal
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] = useState<SubmissionResult | null>(null);
  const [selectedReflectionDetail, setSelectedReflectionDetail] = useState<StudentReflection | null>(null);

  // Print modal state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSingleSub, setPrintSingleSub] = useState<SubmissionResult | null>(null);

  // Copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDocs, setCopiedDocs] = useState(false);

  // Sync state
  const [webAppUrlInput, setWebAppUrlInput] = useState(googleSheetsService.getConfig().webAppUrl);
  const [sheetIdInput, setSheetIdInput] = useState(googleSheetsService.getConfig().sheetId);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch current data
  const classes = ['Semua Kelas', ...lkmEngine.getClasses()];
  const lkms = lkmEngine.getActiveLKMs();
  const rawSubmissions = lkmEngine.getSubmissions();
  const rawQuestions = lkmEngine.getRawQuestionsForTeacher();
  const feedbackRules = lkmEngine.getFeedbackRules();

  // Class analytics computed dynamically based on active filter
  const analytics = lkmEngine.getClassAnalytics(selectedKelas, selectedMateri);

  // Filtered submissions list
  const filteredSubmissions = rawSubmissions.filter((sub) => {
    const matchKelas = selectedKelas === 'Semua Kelas' || sub.kelas === selectedKelas;
    const matchMateri = selectedMateri === 'Semua Materi' || sub.lkmId === selectedMateri;
    const matchQuery =
      searchQuery.trim() === '' ||
      sub.namaMurid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.nis.includes(searchQuery);
    return matchKelas && matchMateri && matchQuery;
  });

  const handleOpenDetail = (sub: SubmissionResult) => {
    setSelectedSubmissionDetail(sub);
    const ref = lkmEngine.getReflectionBySubmissionId(sub.id);
    setSelectedReflectionDetail(ref || null);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID Pengerjaan',
      'Tanggal',
      'Waktu',
      'Nama Murid',
      'Kelas',
      'NIS',
      'Materi',
      'Total Soal',
      'Benar',
      'Salah',
      'Kosong',
      'Nilai Akhir',
      'Kategori',
      'Umpan Balik'
    ];

    const rows = filteredSubmissions.map((s) => [
      s.id,
      s.tanggal,
      s.waktuPengerjaan,
      `"${s.namaMurid}"`,
      s.kelas,
      s.nis,
      `"${s.materi}"`,
      s.totalSoal,
      s.benar,
      s.salah,
      s.kosong,
      s.nilaiAkhir,
      `"${s.kategori}"`,
      `"${s.umpanBalik.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_LKM_PJOK_SMAN1Tejakula_${selectedKelas.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSheetConfig = async () => {
    setIsSyncing(true);
    googleSheetsService.saveConfig({
      webAppUrl: webAppUrlInput.trim(),
      sheetId: sheetIdInput.trim()
    });
    const res = await googleSheetsService.syncFromSpreadsheet();
    setIsSyncing(false);
    setSyncStatusMsg(res.message);
    setTimeout(() => setSyncStatusMsg(''), 5000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_GS_CONTENT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadCodeGs = () => {
    const element = document.createElement('a');
    const file = new Blob([CODE_GS_CONTENT], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Top Banner / Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              PORTAL GURU PJOK
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">SMA Negeri 1 Tejakula</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Dashboard & Analisis Hasil LKM Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengampu: <strong>I Ketut Agus Nova Anggarawan, S.Pd.</strong> • Terintegrasi Google Spreadsheet
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter Rombel:
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white outline-none cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Filter LKM:
            </label>
            <select
              value={selectedMateri}
              onChange={(e) => setSelectedMateri(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white outline-none cursor-pointer"
            >
              <option value="Semua Materi">Semua Materi LKM</option>
              {lkms.map((l) => (
                <option key={l.id} value={l.id}>{l.judul}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-sm font-bold">
        <button
          onClick={() => setActiveTab('analisis')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'analisis'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis & Ringkasan Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('rekap')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'rekap'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rekap Nilai ({filteredSubmissions.length} Murid)</span>
        </button>

        <button
          onClick={() => setActiveTab('banksoal')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'banksoal'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bank Soal ({rawQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pengaturan'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Pengaturan LKM & Sistem</span>
        </button>

        <button
          onClick={() => setActiveTab('integrasi')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'integrasi'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Integrasi Spreadsheet & Code.gs</span>
        </button>
      </div>

      {/* TAB 1: ANALISIS & RINGKASAN KELAS */}
      {activeTab === 'analisis' && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Siswa Terdaftar</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {analytics.totalMuridTerdaftar}
              </div>
              <span className="text-[11px] text-slate-400">Total rombel</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Sudah Mengumpulkan</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">
                {analytics.totalSudahMengerjakan}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">{analytics.persentaseSelesai}% selesai</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Belum Mengumpulkan</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1">
                {analytics.totalBelumMengerjakan}
              </div>
              <span className="text-[11px] text-amber-700">Perlu diingatkan</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-blue-800 uppercase">Rata-rata Kelas</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">
                {analytics.nilaiRataRata}
              </div>
              <span className="text-[11px] text-blue-700">KKM: 70</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-teal-800 uppercase">Nilai Tertinggi</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-900 mt-1">
                {analytics.nilaiTertinggi}
              </div>
              <span className="text-[11px] text-teal-700">Capaian maksimal</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 shadow-sm">
              <span className="text-[11px] font-bold text-rose-800 uppercase">Nilai Terendah</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-1">
                {analytics.nilaiTerendah}
              </div>
              <span className="text-[11px] text-rose-700">Perlu pendampingan</span>
            </div>
          </div>

          {/* Distribusi Kategori Nilai */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Distribusi Kategori Pencapaian Murid</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 block">Sangat Baik (90-100)</span>
                <span className="text-2xl font-black text-emerald-900">{analytics.distribusiKategori.sangatBaik}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Pengayaan</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-800 block">Baik (80-89)</span>
                <span className="text-2xl font-black text-blue-900">{analytics.distribusiKategori.baik}</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">Pemantapan</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-800 block">Cukup Baik (70-79)</span>
                <span className="text-2xl font-black text-amber-900">{analytics.distribusiKategori.cukupBaik}</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Penguatan</span>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-center">
                <span className="text-[11px] font-bold text-orange-800 block">Perlu Peningkatan (60-69)</span>
                <span className="text-2xl font-black text-orange-900">{analytics.distribusiKategori.perluPeningkatan}</span>
                <span className="text-[10px] text-orange-600 block mt-0.5">Remedial Teori</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-rose-800 block">Perlu Pendampingan (&lt;60)</span>
                <span className="text-2xl font-black text-rose-900">{analytics.distribusiKategori.perluPendampingan}</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">Klinis Khusus</span>
              </div>
            </div>
          </div>

          {/* Indikator Paling Sulit vs Indikator Paling Dikuasai */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Indikator Sulit */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Indikator dengan Tingkat Kesalahan Terbanyak
                </h3>
              </div>

              <div className="space-y-3">
                {analytics.indikatorPalingSulit.length > 0 ? (
                  analytics.indikatorPalingSulit.map((ind, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{ind.indikator}</span>
                        <span className="font-bold text-rose-600">{ind.persentaseSalah}% Salah</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${ind.persentaseSalah}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">Belum ada data pengerjaan murid.</p>
                )}
              </div>
            </div>

            {/* Indikator Dikuasai */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Indikator yang Secara Umum Sudah Dikuasai
                </h3>
              </div>

              <div className="space-y-3">
                {analytics.indikatorPalingDikuasai.length > 0 ? (
                  analytics.indikatorPalingDikuasai.map((ind, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{ind.indikator}</span>
                        <span className="font-bold text-emerald-600">{ind.persentaseBenar}% Benar</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${ind.persentaseBenar}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-3 text-center">Belum ada data pengerjaan murid.</p>
                )}
              </div>
            </div>
          </div>

          {/* Rekomendasi Tindak Lanjut Guru PJOK */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Rekomendasi Tindak Lanjut Pembelajaran Guru
              </h3>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              Berdasarkan pemetaan otomatis respons murid SMAN 1 Tejakula, berikut strategi instruksional yang disarankan:
            </p>

            <ul className="space-y-2 pt-1 text-xs sm:text-sm text-blue-100">
              {analytics.rekomendasiGuru.map((rek, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{rek}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: REKAP HASIL & NILAI MURID */}
      {activeTab === 'rekap' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekap Hasil Pengerjaan LKM Digital
              </h2>
              <p className="text-xs text-slate-500">
                Daftar nilai, rincian benar/salah, dan refleksi murid per rombel
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama murid / NIS..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none w-48 sm:w-60"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh CSV</span>
              </button>

              <button
                onClick={() => {
                  setPrintSingleSub(null);
                  setShowPrintModal(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Rekap</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                  <th className="py-3 px-3 w-10 text-center">No</th>
                  <th className="py-3 px-3">Nama Murid</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">NIS</th>
                  <th className="py-3 px-3 text-center">Benar</th>
                  <th className="py-3 px-3 text-center">Salah</th>
                  <th className="py-3 px-3 text-center">Kosong</th>
                  <th className="py-3 px-3 text-center">Nilai</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {sub.namaMurid}
                        {sub.refleksiTersimpan && (
                          <span className="ml-1.5 inline-block text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-medium">
                            +Refleksi
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">{sub.kelas}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-500">{sub.nis}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-emerald-600">{sub.benar}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-rose-600">{sub.salah}</td>
                      <td className="py-3.5 px-3 text-center text-slate-400">{sub.kosong}</td>
                      <td className="py-3.5 px-3 text-center font-black text-blue-900 text-base">{sub.nilaiAkhir}</td>
                      <td className="py-3.5 px-3 font-medium">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {sub.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-xs whitespace-nowrap">
                        {sub.tanggal} {sub.waktuPengerjaan}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(sub)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400">
                      Tidak ada data pengerjaan yang cocok dengan filter yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER BANK SOAL PJOK */}
      {activeTab === 'banksoal' && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 animate-fadeIn">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold">
                  MASTER KURIKULUM PJOK
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">Fase F (Kelas XI)</span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-1">
                Bank Soal PJOK – Kebugaran Jasmani & Circuit Training
              </h2>
              <p className="text-xs text-slate-500">
                Dilengkapi kunci jawaban rahasia backend, indikator kompetensi, pembobotan, dan pembahasan
              </p>
            </div>

            <span className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
              Total: {rawQuestions.length} Butir Soal
            </span>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="Cari pertanyaan, indikator, atau materi..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600 shrink-0">Tipe:</label>
              <select
                value={questionTypeFilter}
                onChange={(e) => setQuestionTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="semua">Semua Tipe Soal</option>
                <option value="pilihan_ganda">Pilihan Ganda</option>
                <option value="benar_salah">Benar / Salah</option>
                <option value="isian">Isian Singkat</option>
                <option value="uraian">Uraian</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {rawQuestions
              .filter((q) => {
                const matchType = questionTypeFilter === 'semua' || q.tipe === questionTypeFilter;
                const matchSearch =
                  questionSearch.trim() === '' ||
                  q.pertanyaan.toLowerCase().includes(questionSearch.toLowerCase()) ||
                  q.indikator.toLowerCase().includes(questionSearch.toLowerCase()) ||
                  q.submateri.toLowerCase().includes(questionSearch.toLowerCase()) ||
                  q.kunciJawaban.toLowerCase().includes(questionSearch.toLowerCase());
                return matchType && matchSearch;
              })
              .map((q) => (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors space-y-3 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                        {q.nomor}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                        {q.tipe.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                        Indikator: {q.indikator}
                      </span>
                      {q.submateri && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {q.submateri}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Bobot: {q.bobot} Poin
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black shadow-sm">
                        Kunci: {q.kunciJawaban}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.pertanyaan}
                  </p>

                  {/* Options */}
                  {q.opsi && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                      {q.opsi.map((op) => {
                        const isKey = op.key === q.kunciJawaban;
                        return (
                          <div
                            key={op.key}
                            className={`p-2.5 rounded-xl border ${
                              isKey
                                ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 ring-1 ring-emerald-300'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{op.key}.</span> {op.text}
                            {isKey && (
                              <span className="ml-1 text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">
                                (KUNCI)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pembahasan & Saran Belajar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.pembahasan && (
                      <div className="p-3 rounded-xl bg-blue-50/70 text-blue-950 border border-blue-200/60 leading-relaxed">
                        <strong className="block text-blue-800 font-bold mb-0.5">Pembahasan Guru:</strong>
                        {q.pembahasan}
                      </div>
                    )}

                    {q.saranBelajar && (
                      <div className="p-3 rounded-xl bg-amber-50/70 text-amber-950 border border-amber-200/60 leading-relaxed">
                        <strong className="block text-amber-800 font-bold mb-0.5">Saran Belajar jika Salah:</strong>
                        {q.saranBelajar}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: PENGATURAN LKM & SISTEM (TERPISAH) */}
      {activeTab === 'pengaturan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Toast Notification */}
          {settingSaveToast && (
            <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-emerald-300 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{settingSaveToast}</span>
            </div>
          )}

          {/* Section 1: Pengaturan Akses & Kebijakan Pengerjaan LKM */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Pengaturan Akses & Kebijakan Lembar Kerja (LKM)
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola ketersediaan pengerjaan dan izin pengulangan pengerjaan bagi murid
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allow Retake */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Izin Pengerjaan Ulang (Retake)
                  </span>
                  <button
                    type="button"
                    onClick={() => setAllowRetake(!allowRetake)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      allowRetake ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jika diaktifkan, murid yang telah mengumpulkan jawaban dapat mengerjakan ulang untuk perbaikan nilai.
                </p>
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                  allowRetake ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  Status: {allowRetake ? 'Diizinkan (Murid dapat mengulang)' : 'Terkunci (Hanya 1 kali pengerjaan)'}
                </span>
              </div>

              {/* LKM Active Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Status Ketersediaan LKM
                  </span>
                  <button
                    type="button"
                    onClick={() => setLkmIsActive(!lkmIsActive)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      lkmIsActive ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mengontrol apakah lembar kerja aktif dan dapat diakses oleh murid di kelas.
                </p>
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                  lkmIsActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  Status: {lkmIsActive ? 'LKM Dibuka (Aktif)' : 'LKM Ditutup Sementara'}
                </span>
              </div>
            </div>

            {/* Identitas Pengampu */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-950 space-y-1">
              <span className="font-bold block uppercase text-[11px] text-blue-800">
                Informasi Satuan Pendidikan & Pengampu:
              </span>
              <p>Sekolah: <strong>SMA Negeri 1 Tejakula</strong> • Jenjang: <strong>Fase F (Kelas XI)</strong></p>
              <p>Guru PJOK: <strong>I Ketut Agus Nova Anggarawan, S.Pd.</strong></p>
            </div>
          </div>

          {/* Section 2: Pengaturan Rentang Nilai & Umpan Balik Otomatis */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Pengaturan Rentang Nilai & Teks Umpan Balik
                </h3>
                <p className="text-xs text-slate-500">
                  Teks evaluasi deskriptif otomatis yang diterima murid setelah pengumpulan LKM
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeLkm) {
                    lkmEngine.updateLKMSettings(activeLkm.id, {
                      allowRetake,
                      isActive: lkmIsActive
                    });
                  }
                  lkmEngine.updateFeedbackRules(editableFeedbackRules);
                  setSettingSaveToast('Pengaturan berhasil disimpan!');
                  setTimeout(() => setSettingSaveToast(''), 4000);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>

            <div className="space-y-4">
              {editableFeedbackRules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-mono font-bold text-xs">
                        {rule.minScore} – {rule.maxScore}
                      </span>
                      <strong className="text-xs sm:text-sm text-slate-900">
                        Kategori: {rule.kategori}
                      </strong>
                    </div>
                    <span className="text-[11px] text-slate-500 italic">
                      Arah: {rule.arah}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={rule.teks}
                    onChange={(e) => {
                      const updated = [...editableFeedbackRules];
                      updated[idx].teks = e.target.value;
                      setEditableFeedbackRules(updated);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs text-slate-800 bg-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (activeLkm) {
                    lkmEngine.updateLKMSettings(activeLkm.id, {
                      allowRetake,
                      isActive: lkmIsActive
                    });
                  }
                  lkmEngine.updateFeedbackRules(editableFeedbackRules);
                  setSettingSaveToast('Pengaturan LKM dan umpan balik otomatis berhasil disimpan!');
                  setTimeout(() => setSettingSaveToast(''), 4000);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Pengaturan</span>
              </button>
            </div>
          </div>

          {/* Section 3: Akses Keamanan & Pemeliharaan Data */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Keamanan Akses & Pemeliharaan Data
                </h3>
                <p className="text-xs text-slate-500">
                  Pengaturan otentikasi guru dan pembersihan data simulasi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <strong className="block text-slate-900 font-bold">PIN Akses Guru Saat Ini:</strong>
                <p className="text-slate-500">
                  Untuk keamanan ruang asesmen, akses guru diproteksi dengan PIN: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">1234</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <strong className="block text-rose-900 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Alat Pengujian & Pembersihan Data</span>
                </strong>
                <p className="text-rose-800 text-[11px] leading-relaxed">
                  Gunakan tombol ini jika Anda ingin mengosongkan data simulasi pengerjaan sebelum murid mulai mengerjakan, atau memuat ulang data default.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Kosongkan semua data pengerjaan hasil simulasi?')) {
                        lkmEngine.resetSubmissions();
                        setSettingSaveToast('Data pengerjaan berhasil dikosongkan.');
                        setTimeout(() => setSettingSaveToast(''), 4000);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Data Simulasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      lkmEngine.reloadSeededSubmissions();
                      setSettingSaveToast('Data sampel SMAN 1 Tejakula telah dimuat ulang.');
                      setTimeout(() => setSettingSaveToast(''), 4000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Muat Ulang Data Sampel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRASI GOOGLE SPREADSHEET & APPS SCRIPT */}
      {activeTab === 'integrasi' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Connection Settings Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Konfigurasi Google Spreadsheet & Apps Script
                  </h2>
                  <p className="text-xs text-slate-500">
                    Prinsip: Google Spreadsheet sebagai Single Source of Truth
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Sync Engine</span>
              </div>
            </div>

            {syncStatusMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Google Spreadsheet ID
                </label>
                <input
                  type="text"
                  value={sheetIdInput}
                  onChange={(e) => setSheetIdInput(e.target.value)}
                  placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Dapat ditemukan dari URL Google Sheet di antara \`/d/\` dan \`/edit\`.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Google Apps Script Web App (doGet / doPost)
                </label>
                <input
                  type="text"
                  value={webAppUrlInput}
                  onChange={(e) => setWebAppUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Didapat setelah menerapkan Web App dengan akses "Anyone".
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveSheetConfig}
                disabled={isSyncing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Simpan & Sinkronkan Sekarang'}</span>
              </button>
            </div>
          </div>

          {/* Code.gs Viewer & Downloader */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  <span>File Backend: Code.gs (Google Apps Script)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Kode lengkap Apps Script untuk dipasang di menu Ekstensi &gt; Apps Script pada Spreadsheet Anda
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCodeGs}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Code.gs</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed select-all">
                {CODE_GS_CONTENT}
              </pre>
            </div>
          </div>

          {/* Spreadsheet Schema Mapping Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Struktur Sheet & Header Google Spreadsheet
              </h3>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SPREADSHEET_SCHEMA_DOCS);
                  setCopiedDocs(true);
                  setTimeout(() => setCopiedDocs(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1"
              >
                {copiedDocs ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDocs ? 'Tersalin' : 'Salin Panduan'}</span>
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {SPREADSHEET_SCHEMA_DOCS}
            </div>
          </div>
        </div>
      )}

      {/* Detail Submission Modal */}
      {selectedSubmissionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-scaleIn max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase">Detail Pengerjaan Murid</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedSubmissionDetail.namaMurid}</h3>
                <p className="text-xs text-slate-500">
                  Kelas {selectedSubmissionDetail.kelas} • NIS: {selectedSubmissionDetail.nis} • {selectedSubmissionDetail.tanggal} {selectedSubmissionDetail.waktuPengerjaan}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-blue-900">{selectedSubmissionDetail.nilaiAkhir}</span>
                <span className="block text-[11px] font-bold text-emerald-700">{selectedSubmissionDetail.kategori}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="block text-emerald-800 font-bold">Benar: {selectedSubmissionDetail.benar}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="block text-rose-800 font-bold">Salah: {selectedSubmissionDetail.salah}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-slate-800 font-bold">Kosong: {selectedSubmissionDetail.kosong}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="block text-slate-800 font-bold mb-1">Umpan Balik Sistem:</strong>
              <p className="text-slate-700 italic">"{selectedSubmissionDetail.umpanBalik}"</p>
            </div>

            {/* Refleksi Murid */}
            {selectedReflectionDetail ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>Jawaban Refleksi Murid</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/60">
                    <strong className="text-teal-900 block mb-0.5">1. Hal baru yang dipahami:</strong>
                    <span className="text-slate-700">{selectedReflectionDetail.q1 || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/60">
                    <strong className="text-teal-900 block mb-0.5">2. Materi yang masih sulit:</strong>
                    <span className="text-slate-700">{selectedReflectionDetail.q2 || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/60">
                    <strong className="text-teal-900 block mb-0.5">3. Penyebab kesulitan:</strong>
                    <span className="text-slate-700">{selectedReflectionDetail.q3 || '-'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/60">
                    <strong className="text-teal-900 block mb-0.5">4. Rencana langkah perbaikan:</strong>
                    <span className="text-slate-700">{selectedReflectionDetail.q4 || '-'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 text-slate-500 text-xs italic text-center">
                Murid belum mengirimkan isian lembar refleksi.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setPrintSingleSub(selectedSubmissionDetail);
                  setShowPrintModal(true);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Lembar Siswa Ini</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSubmissionDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Report Modal */}
      {showPrintModal && (
        <PrintReportModal
          submission={printSingleSub}
          submissionsList={printSingleSub ? undefined : filteredSubmissions}
          kelas={selectedKelas}
          materi={selectedMateri}
          onClose={() => {
            setShowPrintModal(false);
            setPrintSingleSub(null);
          }}
        />
      )}
    </div>
  );
};
