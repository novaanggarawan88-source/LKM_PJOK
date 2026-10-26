export type QuestionType = 'pilihan_ganda' | 'benar_salah' | 'isian' | 'uraian';

export interface Student {
  nis: string;
  nama: string;
  kelas: string;
}

export interface QuestionClient {
  id: string;
  nomor: number;
  tipe: QuestionType;
  indikator: string;
  submateri: string;
  pertanyaan: string;
  opsi?: { key: string; text: string }[];
  bobot: number;
}

export interface QuestionServer extends QuestionClient {
  kunciJawaban: string; // E.g., 'A', 'BENAR', or keyword
  pembahasan: string;
  saranBelajar?: string;
}

export interface LKMInfo {
  id: string;
  judul: string;
  materi: string;
  kelas: string;
  fase: string;
  guru: string;
  sekolah: string;
  tujuanPembelajaran: string[];
  petunjuk: string[];
  jumlahSoal: number;
  allowRetake: boolean;
  isActive: boolean;
}

export interface FeedbackRule {
  minScore: number;
  maxScore: number;
  kategori: string;
  arah: string;
  teks: string;
}

export interface IndicatorAnalysis {
  indikator: string;
  total: number;
  benar: number;
  saranBelajar?: string;
}

export interface ReviewQuestionItem {
  id: string;
  nomor: number;
  pertanyaan: string;
  tipe: QuestionType;
  jawabanMurid: string;
  kunciJawaban: string;
  isBenar: boolean;
  isKosong: boolean;
  indikator: string;
  pembahasan: string;
  opsi?: { key: string; text: string }[];
}

export interface SubmissionResult {
  id: string;
  waktuPengerjaan: string;
  tanggal: string;
  namaMurid: string;
  kelas: string;
  nis: string;
  lkmId: string;
  materi: string;
  totalSoal: number;
  benar: number;
  salah: number;
  kosong: number;
  persentaseBenar: number;
  nilaiAkhir: number;
  kategori: string;
  umpanBalik: string;
  analisisIndikator: IndicatorAnalysis[];
  saranBelajarList: string[];
  rekomendasiTindakLanjut: string[];
  reviewQuestions: ReviewQuestionItem[];
  statusPenilaian: 'selesai' | 'menunggu_guru';
  refleksiTersimpan?: boolean;
}

export interface StudentReflection {
  submissionId: string;
  namaMurid: string;
  kelas: string;
  materi: string;
  q1: string; // Hal baru yang dipahami dengan baik
  q2: string; // Materi yang masih sulit / perlu dipelajari kembali
  q3: string; // Penyebab kesulitan
  q4: string; // Rencana langkah perbaikan
  timestamp: string;
}

export interface ClassAnalytics {
  totalMuridTerdaftar: number;
  totalSudahMengerjakan: number;
  totalBelumMengerjakan: number;
  persentaseSelesai: number;
  nilaiRataRata: number;
  nilaiTertinggi: number;
  nilaiTerendah: number;
  distribusiKategori: {
    sangatBaik: number;
    baik: number;
    cukupBaik: number;
    perluPeningkatan: number;
    perluPendampingan: number;
  };
  indikatorPalingSulit: {
    indikator: string;
    persentaseSalah: number;
    totalSalah: number;
    totalKemunculan: number;
  }[];
  indikatorPalingDikuasai: {
    indikator: string;
    persentaseBenar: number;
  }[];
  soalPalingSulit: {
    nomor: number;
    pertanyaan: string;
    persentaseSalah: number;
    indikator: string;
  }[];
  muridButuhPendampingan: {
    nama: string;
    kelas: string;
    nilai: number;
    kategori: string;
  }[];
  rekomendasiGuru: string[];
}

export interface SpreadsheetConfig {
  sheetId: string;
  webAppUrl: string; // Google Apps Script Web App URL (doGet/doPost)
  lastSyncTime?: string;
  isConnected: boolean;
  statusMessage?: string;
}
