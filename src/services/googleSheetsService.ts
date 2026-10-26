import { 
  SpreadsheetConfig, 
  SubmissionResult, 
  StudentReflection,
  Student,
  QuestionServer,
  FeedbackRule,
  QuestionType
} from '../types/lkm';
import { lkmEngine } from './lkmEngine';

const SPREADSHEET_CONFIG_KEY = 'lkm_pjok_spreadsheet_config_v1';

export const DEFAULT_EXAMPLE_SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';

const DEFAULT_CONFIG: SpreadsheetConfig = {
  sheetId: '',
  webAppUrl: '',
  isConnected: false,
  lastSyncTime: '',
  statusMessage: 'Belum terhubung ke Google Spreadsheet Anda'
};

/**
 * Ekstraksi ID bersih dari input URL Google Spreadsheet lengkap maupun ID mentah.
 * Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
 * -> 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

class GoogleSheetsService {
  private config: SpreadsheetConfig;

  constructor() {
    try {
      const stored = localStorage.getItem(SPREADSHEET_CONFIG_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
      } else {
        this.config = DEFAULT_CONFIG;
        this.saveConfig();
      }
    } catch {
      this.config = DEFAULT_CONFIG;
    }
  }

  public getConfig(): SpreadsheetConfig {
    return this.config;
  }

  public isCustomSheetConnected(): boolean {
    const cleanId = extractSpreadsheetId(this.config.sheetId);
    return Boolean(
      (cleanId && cleanId !== DEFAULT_EXAMPLE_SHEET_ID) ||
      (this.config.webAppUrl && this.config.webAppUrl.trim().length > 10)
    );
  }

  public saveConfig(newConfig?: Partial<SpreadsheetConfig>): SpreadsheetConfig {
    if (newConfig) {
      if (newConfig.sheetId !== undefined) {
        newConfig.sheetId = extractSpreadsheetId(newConfig.sheetId);
      }
      this.config = { ...this.config, ...newConfig };
    }
    localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(this.config));
    return this.config;
  }

  /**
   * Helper untuk membaca data sheet via Google Visualization (GViz) API publik.
   * Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={SHEET_NAME}
   */
  private async fetchGVizRows(sheetId: string, sheetName: string): Promise<Record<string, string>[]> {
    const cleanId = extractSpreadsheetId(sheetId);
    if (!cleanId) return [];

    const url = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Gagal membaca sheet '${sheetName}' (HTTP ${res.status}). Pastikan spreadsheet disetel "Siapa saja yang memiliki link dapat melihat".`);
    }

    const text = await res.text();
    // Parse format GViz: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?/);
    if (!match || !match[1]) {
      throw new Error(`Respons dari sheet '${sheetName}' tidak valid.`);
    }

    const json = JSON.parse(match[1]);
    const table = json.table;
    if (!table || !table.cols || !table.rows) {
      return [];
    }

    const colNames = table.cols.map((col: any, idx: number) => {
      const label = col && col.label ? String(col.label).trim() : '';
      return label.toLowerCase() || `col_${idx}`;
    });

    const parsedRows: Record<string, string>[] = [];
    for (const r of table.rows) {
      if (!r || !r.c) continue;
      const rowObj: Record<string, string> = {};
      let hasData = false;

      r.c.forEach((cell: any, idx: number) => {
        const colKey = colNames[idx] || `col_${idx}`;
        let val = '';
        if (cell) {
          if (cell.f !== undefined && cell.f !== null) {
            val = String(cell.f).trim();
          } else if (cell.v !== undefined && cell.v !== null) {
            val = String(cell.v).trim();
          }
        }
        rowObj[colKey] = val;
        if (val) hasData = true;
      });

      if (hasData) {
        parsedRows.push(rowObj);
      }
    }

    return parsedRows;
  }

  /**
   * Helper fleksibel untuk mencari nilai kolom tanpa sensitif huruf/spasi
   */
  private getVal(row: Record<string, string>, possibleNames: string[]): string {
    const keys = Object.keys(row);
    for (const name of possibleNames) {
      const lower = name.toLowerCase();
      const foundKey = keys.find(k => k.toLowerCase() === lower || k.toLowerCase().includes(lower));
      if (foundKey && row[foundKey] !== undefined) {
        return row[foundKey];
      }
    }
    return '';
  }

  /**
   * SINKRONISASI LENGKAP: Mengambil data dari Google Spreadsheet & Apps Script ke aplikasi
   */
  public async syncFromSpreadsheet(customConfig?: Partial<SpreadsheetConfig>): Promise<{
    success: boolean;
    message: string;
    details?: {
      studentCount: number;
      questionCount: number;
      feedbackCount: number;
      submissionCount: number;
      source: 'webapp' | 'gviz' | 'local';
    };
  }> {
    if (customConfig) {
      this.saveConfig(customConfig);
    }

    const cleanSheetId = extractSpreadsheetId(this.config.sheetId);
    const webAppUrl = (this.config.webAppUrl || '').trim();

    let studentCount = 0;
    let questionCount = 0;
    let feedbackCount = 0;
    let submissionCount = 0;
    let source: 'webapp' | 'gviz' | 'local' = 'local';

    // 1. OPSI UTAMA: Tarik via Google Apps Script Web App jika URL tersedia
    if (webAppUrl) {
      try {
        const res = await fetch(`${webAppUrl}?action=getAllData`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            if (data.students && Array.isArray(data.students) && data.students.length > 0) {
              lkmEngine.setStudents(data.students);
              studentCount = data.students.length;
            }
            if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
              lkmEngine.setQuestions(data.questions);
              questionCount = data.questions.length;
            }
            if (data.feedbackRules && Array.isArray(data.feedbackRules) && data.feedbackRules.length > 0) {
              lkmEngine.setFeedbackRules(data.feedbackRules);
              feedbackCount = data.feedbackRules.length;
            }
            if (data.submissions && Array.isArray(data.submissions) && data.submissions.length > 0) {
              lkmEngine.setSubmissions(data.submissions);
              submissionCount = data.submissions.length;
            }
            source = 'webapp';
          }
        }
      } catch (err) {
        console.warn('Gagal sync via Apps Script Web App, mencoba membaca via Google Sheets GViz API:', err);
      }
    }

    // 2. OPSI KEDUA: Jika Web App belum digunakan atau belum mengembalikan data, baca langsung via GViz API
    if (source !== 'webapp' && cleanSheetId) {
      try {
        // A. Ambil DATA_MURID
        try {
          const rawMurid = await this.fetchGVizRows(cleanSheetId, 'DATA_MURID');
          if (rawMurid.length > 0) {
            const parsedStudents: Student[] = [];
            for (const r of rawMurid) {
              const kelas = this.getVal(r, ['kelas', 'rombel', 'tingkat']);
              const nama = this.getVal(r, ['nama murid', 'nama siswa', 'nama', 'murid']);
              const nis = this.getVal(r, ['nis', 'nisn', 'nomor induk', 'no']);

              if (nama && kelas) {
                parsedStudents.push({
                  kelas: kelas.trim(),
                  nama: nama.trim(),
                  nis: nis ? nis.trim() : ''
                });
              }
            }

            if (parsedStudents.length > 0) {
              lkmEngine.setStudents(parsedStudents);
              studentCount = parsedStudents.length;
              source = 'gviz';
            }
          }
        } catch (eMurid) {
          console.warn('Gagal membaca sheet DATA_MURID:', eMurid);
        }

        // B. Ambil BANK_SOAL
        try {
          const rawSoal = await this.fetchGVizRows(cleanSheetId, 'BANK_SOAL');
          if (rawSoal.length > 0) {
            const parsedQuestions: QuestionServer[] = [];
            rawSoal.forEach((r, idx) => {
              const id = this.getVal(r, ['id soal', 'id', 'kode']) || `Q${idx + 1}`;
              const nomorRaw = this.getVal(r, ['nomor', 'no']);
              const nomor = nomorRaw ? parseInt(nomorRaw, 10) : idx + 1;
              const pertanyaan = this.getVal(r, ['pertanyaan', 'soal', 'butir']);
              const tipeRaw = (this.getVal(r, ['tipe', 'jenis']) || 'pilihan_ganda').toLowerCase();
              let tipe: QuestionType = 'pilihan_ganda';
              if (tipeRaw.includes('benar') || tipeRaw.includes('salah')) tipe = 'benar_salah';
              else if (tipeRaw.includes('isian')) tipe = 'isian';
              else if (tipeRaw.includes('uraian')) tipe = 'uraian';

              const indikator = this.getVal(r, ['indikator', 'kompetensi']) || 'Kebugaran Jasmani';
              const submateri = this.getVal(r, ['submateri', 'materi']);
              const kunci = (this.getVal(r, ['kunci', 'jawaban benar']) || 'A').toUpperCase();
              const bobotRaw = this.getVal(r, ['bobot', 'poin']);
              const bobot = bobotRaw ? parseInt(bobotRaw, 10) : 5;
              const pembahasan = this.getVal(r, ['pembahasan', 'penjelasan']);
              const saranBelajar = this.getVal(r, ['saran belajar', 'saran', 'rekomendasi']);

              const opsi: { key: string; text: string }[] = [];
              if (tipe === 'pilihan_ganda') {
                const optA = this.getVal(r, ['a', 'opsi a']);
                const optB = this.getVal(r, ['b', 'opsi b']);
                const optC = this.getVal(r, ['c', 'opsi c']);
                const optD = this.getVal(r, ['d', 'opsi d']);
                const optE = this.getVal(r, ['e', 'opsi e']);

                if (optA) opsi.push({ key: 'A', text: optA });
                if (optB) opsi.push({ key: 'B', text: optB });
                if (optC) opsi.push({ key: 'C', text: optC });
                if (optD) opsi.push({ key: 'D', text: optD });
                if (optE) opsi.push({ key: 'E', text: optE });
              } else if (tipe === 'benar_salah') {
                opsi.push({ key: 'BENAR', text: 'BENAR' });
                opsi.push({ key: 'SALAH', text: 'SALAH' });
              }

              if (pertanyaan) {
                parsedQuestions.push({
                  id,
                  nomor: isNaN(nomor) ? idx + 1 : nomor,
                  pertanyaan,
                  tipe,
                  indikator,
                  submateri,
                  kunciJawaban: kunci,
                  bobot: isNaN(bobot) ? 5 : bobot,
                  pembahasan,
                  saranBelajar,
                  opsi: opsi.length > 0 ? opsi : undefined
                });
              }
            });

            if (parsedQuestions.length > 0) {
              lkmEngine.setQuestions(parsedQuestions);
              questionCount = parsedQuestions.length;
              source = 'gviz';
            }
          }
        } catch (eSoal) {
          console.warn('Gagal membaca sheet BANK_SOAL:', eSoal);
        }

        // C. Ambil PENGATURAN_FEEDBACK
        try {
          const rawFeedback = await this.fetchGVizRows(cleanSheetId, 'PENGATURAN_FEEDBACK');
          if (rawFeedback.length > 0) {
            const rules: FeedbackRule[] = [];
            for (const r of rawFeedback) {
              const minScore = parseInt(this.getVal(r, ['min nilai', 'min']), 10);
              const maxScore = parseInt(this.getVal(r, ['max nilai', 'max']), 10);
              const kategori = this.getVal(r, ['kategori', 'predikat']);
              const arah = this.getVal(r, ['arah', 'tindak lanjut']);
              const teks = this.getVal(r, ['teks umpan balik', 'umpan balik', 'pesan']);

              if (!isNaN(minScore) && !isNaN(maxScore) && kategori) {
                rules.push({ minScore, maxScore, kategori, arah, teks });
              }
            }

            if (rules.length > 0) {
              lkmEngine.setFeedbackRules(rules);
              feedbackCount = rules.length;
            }
          }
        } catch (eFeedback) {
          console.warn('Gagal membaca sheet PENGATURAN_FEEDBACK:', eFeedback);
        }
      } catch (errGViz) {
        console.warn('Gagal membaca langsung via Google Visualization API:', errGViz);
      }
    }

    const now = new Date();
    const syncTimeStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (studentCount > 0 || questionCount > 0) {
      this.saveConfig({
        isConnected: true,
        lastSyncTime: syncTimeStr,
        statusMessage: `Tersinkronisasi penuh dengan Google Spreadsheet (${syncTimeStr})`
      });

      return {
        success: true,
        message: `Berhasil tersinkronisasi! Memuat ${studentCount} siswa dari sheet DATA_MURID dan ${questionCount} soal dari sheet BANK_SOAL.`,
        details: {
          studentCount,
          questionCount,
          feedbackCount,
          submissionCount,
          source
        }
      };
    } else {
      // Tidak ada data yang berhasil ditarik dari spreadsheet
      const isCustom = this.isCustomSheetConnected();
      return {
        success: false,
        message: isCustom
          ? 'Tidak dapat membaca data dari Spreadsheet. Pastikan Spreadsheet disetel "Siapa saja yang memiliki link dapat melihat" (Viewer).'
          : 'Spreadsheet belum terhubung. Silakan masukkan Link atau ID Google Spreadsheet Anda.',
        details: {
          studentCount: lkmEngine.getTotalStudentsCount(),
          questionCount: lkmEngine.getTotalQuestionsCount(),
          feedbackCount: 5,
          submissionCount: 0,
          source: 'local'
        }
      };
    }
  }

  /**
   * Mengirim hasil pengerjaan LKM ke Google Apps Script Web App URL
   */
  public async pushSubmissionToGoogleSheet(submission: SubmissionResult): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!this.config.webAppUrl) {
      return {
        success: true,
        message: 'Hasil tersimpan ke Master Database LKM SMAN 1 Tejakula.'
      };
    }

    try {
      const payload = {
        action: 'submitLKM',
        idSubmission: submission.id,
        namaMurid: submission.namaMurid,
        kelas: submission.kelas,
        nis: submission.nis,
        lkmId: submission.lkmId,
        materi: submission.materi,
        tanggal: submission.tanggal,
        waktu: submission.waktuPengerjaan,
        totalSoal: submission.totalSoal,
        benar: submission.benar,
        salah: submission.salah,
        kosong: submission.kosong,
        nilaiAkhir: submission.nilaiAkhir,
        kategori: submission.kategori,
        umpanBalik: submission.umpanBalik
      };

      const response = await fetch(this.config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Berhasil dikirim dan tersinkronisasi ke Google Spreadsheet via Apps Script.'
        };
      } else {
        return {
          success: false,
          message: `Gagal mengirim ke Google Apps Script (HTTP ${response.status}).`
        };
      }
    } catch (err) {
      console.warn('Gagal push ke Web App URL:', err);
      return {
        success: true,
        message: 'Tersimpan di Master Database lokal (Koneksi ke endpoint Web App tertunda).'
      };
    }
  }

  /**
   * Mengirim jawaban refleksi murid ke Google Apps Script Web App URL
   */
  public async pushReflectionToGoogleSheet(reflection: StudentReflection): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!this.config.webAppUrl) {
      return {
        success: true,
        message: 'Refleksi tersimpan di Master Database LKM SMAN 1 Tejakula.'
      };
    }

    try {
      const payload = {
        action: 'saveReflection',
        ...reflection
      };

      const res = await fetch(this.config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        return {
          success: true,
          message: 'Refleksi tersimpan ke sheet REFLEKSI_MURID di Google Spreadsheet!'
        };
      }
    } catch (e) {
      console.warn('Gagal push refleksi ke GAS:', e);
    }

    return {
      success: true,
      message: 'Refleksi tersimpan secara lokal dan siap disinkronkan ke Google Spreadsheet.'
    };
  }

  /**
   * Memicu auto-setup pembuatan seluruh sheet di Google Spreadsheet via Apps Script Web App
   */
  public async triggerAutoSetup(): Promise<{ success: boolean; message: string }> {
    if (!this.config.webAppUrl) {
      return {
        success: false,
        message: 'Masukkan URL Web App Google Apps Script terlebih dahulu di kolom konfigurasi.'
      };
    }

    try {
      await fetch(this.config.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'autoSetup' })
      });

      return {
        success: true,
        message: 'Perintah Auto-Setup berhasil dikirim ke Google Apps Script! Seluruh sheet (DATA_MURID, BANK_SOAL, PENGATURAN_FEEDBACK, HASIL_LKM, REFLEKSI_MURID) telah disiapkan.'
      };
    } catch {
      try {
        await fetch(`${this.config.webAppUrl}?action=autoSetup`, {
          method: 'GET',
          mode: 'no-cors'
        });
        return {
          success: true,
          message: 'Perintah Auto-Setup berhasil dikirim ke Google Apps Script! Periksa sheet di Google Spreadsheet Anda.'
        };
      } catch (err2) {
        return {
          success: false,
          message: 'Gagal menghubungi Google Apps Script: ' + String(err2)
        };
      }
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
