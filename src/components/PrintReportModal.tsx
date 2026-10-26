import React from 'react';
import { X, Printer, School, CheckCircle, FileText } from 'lucide-react';
import { SubmissionResult } from '../types/lkm';

interface PrintReportModalProps {
  submission?: SubmissionResult | null;
  submissionsList?: SubmissionResult[];
  kelas?: string;
  materi?: string;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  submission,
  submissionsList,
  kelas,
  materi,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Controls - Hidden during print */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Pratinjau Cetak Lembar Hasil LKM PJOK
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="print-area font-sans text-slate-900 space-y-6">
          {/* Official Letterhead (Kop Surat) */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-700">
              Pemerintah Provinsi Bali • Dinas Pendidikan Kepemudaan dan Olahraga
            </h2>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              SMA NEGERI 1 TEJAKULA
            </h1>
            <p className="text-xs text-slate-600">
              Jl. Singaraja-Amlapura, Desa Tejakula, Kec. Tejakula, Kab. Buleleng, Bali - 81173
            </p>
            <div className="text-xs font-bold text-blue-900 pt-1">
              LEMBAR KERJA MURID (LKM) DIGITAL - PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN
            </div>
          </div>

          {/* Mode 1: Individual Student Report */}
          {submission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500 w-28 inline-block">Nama Murid</span>
                    <strong className="text-slate-900">: {submission.namaMurid}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 w-28 inline-block">NIS</span>
                    <strong className="text-slate-900">: {submission.nis}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 w-28 inline-block">Kelas / Fase</span>
                    <strong className="text-slate-900">: {submission.kelas} (Fase F)</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <div>
                    <span className="text-slate-500 w-28 inline-block">Mata Pelajaran</span>
                    <strong className="text-slate-900">: PJOK</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 w-28 inline-block">Materi LKM</span>
                    <strong className="text-slate-900">: {submission.materi}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 w-28 inline-block">Tanggal Submit</span>
                    <strong className="text-slate-900">: {submission.tanggal} ({submission.waktuPengerjaan})</strong>
                  </div>
                </div>
              </div>

              {/* Score Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Total Soal</th>
                      <th className="py-2.5 px-3">Jawaban Benar</th>
                      <th className="py-2.5 px-3">Jawaban Salah</th>
                      <th className="py-2.5 px-3">Belum Dijawab</th>
                      <th className="py-2.5 px-3">Nilai Akhir (0-100)</th>
                      <th className="py-2.5 px-3">Kategori Capaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-semibold divide-x divide-slate-200">
                      <td className="py-3 px-3">{submission.totalSoal}</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">{submission.benar}</td>
                      <td className="py-3 px-3 text-rose-700 font-bold">{submission.salah}</td>
                      <td className="py-3 px-3 text-slate-500">{submission.kosong}</td>
                      <td className="py-3 px-3 text-xl font-black text-blue-900">{submission.nilaiAkhir}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{submission.kategori}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Umpan Balik */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                <strong className="block text-slate-800 font-bold uppercase text-[11px]">
                  Umpan Balik Pembelajaran:
                </strong>
                <p className="text-slate-700 italic">"{submission.umpanBalik}"</p>
              </div>

              {/* Analisis Indikator */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Penguasaan Indikator Kebugaran Jasmani:
                </h4>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Indikator</th>
                      <th className="p-2 text-center">Soal</th>
                      <th className="p-2 text-center">Benar</th>
                      <th className="p-2 text-center">Capaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {submission.analisisIndikator.map((ind, i) => {
                      const pct = ind.total > 0 ? Math.round((ind.benar / ind.total) * 100) : 0;
                      return (
                        <tr key={i}>
                          <td className="p-2 font-medium">{ind.indikator}</td>
                          <td className="p-2 text-center">{ind.total}</td>
                          <td className="p-2 text-center">{ind.benar}</td>
                          <td className="p-2 text-center font-bold">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mode 2: Class Recap Table */}
          {submissionsList && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span>Rombel / Kelas: <strong>{kelas || 'Semua Kelas'}</strong></span>
                <span>Materi: <strong>{materi || 'Kebugaran Jasmani'}</strong></span>
                <span>Total Murid: <strong>{submissionsList.length} Murid</strong></span>
              </div>

              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 text-center w-10">No</th>
                    <th className="p-2">Nama Murid</th>
                    <th className="p-2">Kelas</th>
                    <th className="p-2">NIS</th>
                    <th className="p-2 text-center">Benar</th>
                    <th className="p-2 text-center">Salah</th>
                    <th className="p-2 text-center">Nilai</th>
                    <th className="p-2">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {submissionsList.map((sub, idx) => (
                    <tr key={sub.id}>
                      <td className="p-2 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2 font-semibold text-slate-900">{sub.namaMurid}</td>
                      <td className="p-2">{sub.kelas}</td>
                      <td className="p-2 font-mono">{sub.nis}</td>
                      <td className="p-2 text-center font-bold text-emerald-700">{sub.benar}</td>
                      <td className="p-2 text-center font-bold text-rose-700">{sub.salah}</td>
                      <td className="p-2 text-center font-black text-blue-900">{sub.nilaiAkhir}</td>
                      <td className="p-2 font-semibold">{sub.kategori}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures Area */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-center">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-semibold text-slate-800">Kepala SMA Negeri 1 Tejakula</p>
              <div className="h-16"></div>
              <p className="font-bold underline text-slate-900">I Wayan Suweta, S.Pd., M.Pd.</p>
              <p className="text-slate-500">NIP. 19710502 199702 1 004</p>
            </div>

            <div>
              <p className="text-slate-500">Tejakula, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold text-slate-800">Guru Mata Pelajaran PJOK</p>
              <div className="h-16"></div>
              <p className="font-bold underline text-slate-900">I Ketut Agus Nova Anggarawan, S.Pd.</p>
              <p className="text-slate-500">NIP. 19930815 202221 1 006</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
