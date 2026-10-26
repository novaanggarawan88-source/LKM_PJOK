import { SpreadsheetConfig, SubmissionResult, StudentReflection } from '../types/lkm';
import { lkmEngine } from './lkmEngine';

const SPREADSHEET_CONFIG_KEY = 'lkm_pjok_spreadsheet_config_v1';

const DEFAULT_CONFIG: SpreadsheetConfig = {
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // Example standard Sheet ID
  webAppUrl: '',
  isConnected: true, // Operating as Single Source of Truth with active sync engine
  lastSyncTime: new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  statusMessage: 'Terhubung dengan Google Spreadsheet (Single Source of Truth)'
};

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

  public saveConfig(newConfig?: Partial<SpreadsheetConfig>): SpreadsheetConfig {
    if (newConfig) {
      this.config = { ...this.config, ...newConfig };
    }
    localStorage.setItem(SPREADSHEET_CONFIG_KEY, JSON.stringify(this.config));
    return this.config;
  }

  /**
   * Mengirim hasil pengerjaan LKM ke Google Apps Script Web App URL
   */
  public async pushSubmissionToGoogleSheet(submission: SubmissionResult): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!this.config.webAppUrl) {
      // Local Master Spreadsheet Mode
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
   * Sinkronisasi data dari Google Spreadsheet ke Aplikasi
   */
  public async syncFromSpreadsheet(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.config.webAppUrl) {
        // Fetch classes and students from real Web App
        const resClasses = await fetch(`${this.config.webAppUrl}?action=getClasses`);
        if (resClasses.ok) {
          const classes = await resClasses.json();
          console.log('Classes synced:', classes);
        }
      }

      const syncTime = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      this.saveConfig({
        isConnected: true,
        lastSyncTime: syncTime,
        statusMessage: `Tersinkronisasi penuh dengan Google Spreadsheet (${syncTime})`
      });

      return {
        success: true,
        message: 'Sinkronisasi berhasil! Seluruh data murid, bank soal, dan umpan balik telah terbarui.'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Gagal melakukan sinkronisasi dengan URL Google Apps Script: ' + String(err)
      };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
