import {
  Student,
  QuestionServer,
  QuestionClient,
  LKMInfo,
  FeedbackRule,
  SubmissionResult,
  StudentReflection,
  ClassAnalytics,
  ReviewQuestionItem,
  IndicatorAnalysis
} from '../types/lkm';
import {
  DEFAULT_LKM_LIST,
  DEFAULT_STUDENTS,
  DEFAULT_QUESTIONS_LKM1,
  DEFAULT_FEEDBACK_RULES,
  INITIAL_SUBMISSIONS_SEEDED
} from '../data/defaultData';

const STORAGE_KEYS = {
  SUBMISSIONS: 'lkm_pjok_submissions_v1',
  REFLECTIONS: 'lkm_pjok_reflections_v1',
  STUDENTS: 'lkm_pjok_students_v1',
  QUESTIONS: 'lkm_pjok_questions_v1',
  LKMS: 'lkm_pjok_lkms_v1',
  FEEDBACK_RULES: 'lkm_pjok_feedback_rules_v1',
  SHEET_CONFIG: 'lkm_pjok_sheet_config_v1'
};

class LKMEngineService {
  private submissions: SubmissionResult[] = [];
  private reflections: StudentReflection[] = [];
  private students: Student[] = DEFAULT_STUDENTS;
  private questions: QuestionServer[] = DEFAULT_QUESTIONS_LKM1;
  private lkms: LKMInfo[] = DEFAULT_LKM_LIST;
  private feedbackRules: FeedbackRule[] = DEFAULT_FEEDBACK_RULES;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (storedSubs) {
        this.submissions = JSON.parse(storedSubs);
      } else {
        this.submissions = [...INITIAL_SUBMISSIONS_SEEDED];
        this.saveSubmissions();
      }

      const storedRefs = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      if (storedRefs) {
        this.reflections = JSON.parse(storedRefs);
      } else {
        // Seed initial reflections
        this.reflections = [
          {
            submissionId: 'SUB-20261026-001',
            namaMurid: 'I Gede Arya Pratama',
            kelas: 'XI 1',
            materi: 'Aktivitas Kebugaran Jasmani',
            q1: 'Saya lebih memahami perbedaan peregangan statis saat pendinginan dan dinamis saat pemanasan serta fungsi tes VO2Max.',
            q2: 'Menghitung zona latihan target dari denyut nadi maksimal.',
            q3: 'Kurang teliti saat mengingat rumus perkalian intensitas.',
            q4: 'Membuat catatan rumus denyut nadi maksimal di buku catatan PJOK dan mempraktikkannya saat lari mandiri.',
            timestamp: '2026-10-26 08:35:00'
          }
        ];
        this.saveReflections();
      }

      const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (storedStudents) this.students = JSON.parse(storedStudents);

      const storedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (storedQuestions) this.questions = JSON.parse(storedQuestions);

      const storedLkms = localStorage.getItem(STORAGE_KEYS.LKMS);
      if (storedLkms) this.lkms = JSON.parse(storedLkms);

      const storedRules = localStorage.getItem(STORAGE_KEYS.FEEDBACK_RULES);
      if (storedRules) this.feedbackRules = JSON.parse(storedRules);
    } catch (e) {
      console.warn('Gagal memuat penyimpanan lokal, menggunakan default PJOK', e);
      this.submissions = [...INITIAL_SUBMISSIONS_SEEDED];
      this.students = DEFAULT_STUDENTS;
      this.questions = DEFAULT_QUESTIONS_LKM1;
      this.lkms = DEFAULT_LKM_LIST;
      this.feedbackRules = DEFAULT_FEEDBACK_RULES;
    }
  }

  private saveSubmissions() {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(this.submissions));
    } catch (e) {
      console.error('Gagal menyimpan hasil:', e);
    }
  }

  private saveReflections() {
    try {
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(this.reflections));
    } catch (e) {
      console.error('Gagal menyimpan refleksi:', e);
    }
  }

  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    });
  }

  public setStudents(newStudents: Student[]) {
    if (newStudents && newStudents.length > 0) {
      this.students = newStudents;
      try {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
      } catch (e) {
        console.error('Gagal menyimpan students ke storage', e);
      }
      this.notifyListeners();
    }
  }

  public setQuestions(newQuestions: QuestionServer[]) {
    if (newQuestions && newQuestions.length > 0) {
      this.questions = newQuestions;
      try {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(this.questions));
      } catch (e) {
        console.error('Gagal menyimpan questions ke storage', e);
      }
      this.notifyListeners();
    }
  }

  public setFeedbackRules(rules: FeedbackRule[]) {
    if (rules && rules.length > 0) {
      this.feedbackRules = rules;
      try {
        localStorage.setItem(STORAGE_KEYS.FEEDBACK_RULES, JSON.stringify(this.feedbackRules));
      } catch (e) {
        console.error('Gagal menyimpan feedback rules ke storage', e);
      }
      this.notifyListeners();
    }
  }

  public setSubmissions(newSubmissions: SubmissionResult[]) {
    if (newSubmissions && Array.isArray(newSubmissions)) {
      this.submissions = newSubmissions;
      this.saveSubmissions();
      this.notifyListeners();
    }
  }

  public getTotalStudentsCount(): number {
    return this.students.length;
  }

  public getTotalQuestionsCount(): number {
    return this.questions.length;
  }

  // --- PUBLIC GETTERS ---

  public getClasses(): string[] {
    const set = new Set(this.students.map((s) => s.kelas));
    return Array.from(set).sort();
  }

  public getStudentsByClass(kelas: string): Student[] {
    return this.students
      .filter((s) => s.kelas.trim().toLowerCase() === kelas.trim().toLowerCase())
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }

  public getActiveLKMs(): LKMInfo[] {
    return this.lkms.filter((l) => l.isActive);
  }

  public getLKMById(id: string): LKMInfo | undefined {
    return this.lkms.find((l) => l.id === id);
  }

  /**
   * SECURITY RULE: Siswa HANYA menerima pertanyaan & opsi,
   * Kunci jawaban dan pembahasan TIDAK PERNAH dikirimkan sebelum submit!
   */
  public getQuestionsForStudent(lkmId: string): QuestionClient[] {
    // If lkmId is LKM-001 or default
    return this.questions.map((q) => ({
      id: q.id,
      nomor: q.nomor,
      tipe: q.tipe,
      indikator: q.indikator,
      submateri: q.submateri,
      pertanyaan: q.pertanyaan,
      opsi: q.opsi,
      bobot: q.bobot
    }));
  }

  public checkExistingSubmission(nama: string, kelas: string, lkmId: string): SubmissionResult | null {
    const match = this.submissions.find(
      (s) =>
        s.namaMurid.trim().toLowerCase() === nama.trim().toLowerCase() &&
        s.kelas.trim().toLowerCase() === kelas.trim().toLowerCase() &&
        s.lkmId === lkmId
    );
    return match || null;
  }

  // --- SUBMISSION EVALUATION (SECURE BACKEND LOGIC) ---

  public submitExam(payload: {
    namaMurid: string;
    kelas: string;
    nis?: string;
    lkmId: string;
    materi: string;
    jawabanMurid: Record<string, string>;
  }): SubmissionResult {
    const { namaMurid, kelas, nis, lkmId, materi, jawabanMurid } = payload;

    const totalSoal = this.questions.length;
    let benar = 0;
    let salah = 0;
    let kosong = 0;
    let totalBobotMax = 0;
    let totalBobotDiperoleh = 0;

    const indicatorMap = new Map<string, { total: number; benar: number; saranBelajar?: string }>();
    const saranBelajarSet = new Set<string>();
    const reviewItems: ReviewQuestionItem[] = [];

    for (const q of this.questions) {
      totalBobotMax += q.bobot;
      const userAnsRaw = (jawabanMurid[q.id] || '').trim();
      const userAns = userAnsRaw.toUpperCase();
      const kunci = q.kunciJawaban.trim().toUpperCase();

      if (!indicatorMap.has(q.indikator)) {
        indicatorMap.set(q.indikator, {
          total: 0,
          benar: 0,
          saranBelajar: q.saranBelajar
        });
      }
      const indStat = indicatorMap.get(q.indikator)!;
      indStat.total++;

      let isBenar = false;
      let isKosong = false;

      if (!userAnsRaw) {
        kosong++;
        isKosong = true;
        if (q.saranBelajar) saranBelajarSet.add(q.saranBelajar);
      } else {
        // Evaluate based on type
        if (q.tipe === 'isian') {
          // Normalize text: ignore punctuation, spaces
          const cleanUser = userAns.replace(/[^A-Z0-9]/g, '');
          const cleanKey = kunci.replace(/[^A-Z0-9]/g, '');
          if (cleanUser === cleanKey || cleanUser.includes(cleanKey) || cleanKey.includes(cleanUser)) {
            isBenar = true;
          }
        } else {
          // pilihan_ganda / benar_salah
          if (userAns === kunci) {
            isBenar = true;
          }
        }

        if (isBenar) {
          benar++;
          totalBobotDiperoleh += q.bobot;
          indStat.benar++;
        } else {
          salah++;
          if (q.saranBelajar) saranBelajarSet.add(q.saranBelajar);
        }
      }

      reviewItems.push({
        id: q.id,
        nomor: q.nomor,
        pertanyaan: q.pertanyaan,
        tipe: q.tipe,
        jawabanMurid: userAnsRaw || '(Tidak Dijawab)',
        kunciJawaban: q.kunciJawaban,
        isBenar,
        isKosong,
        indikator: q.indikator,
        pembahasan: q.pembahasan,
        opsi: q.opsi
      });
    }

    const nilaiAkhir =
      totalBobotMax > 0 ? Math.round((totalBobotDiperoleh / totalBobotMax) * 100) : 0;
    const persentaseBenar = totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0;

    // Get feedback category
    const feedbackObj = this.getFeedbackForScore(nilaiAkhir);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const analisisIndikator: IndicatorAnalysis[] = [];
    indicatorMap.forEach((val, key) => {
      analisisIndikator.push({
        indikator: key,
        total: val.total,
        benar: val.benar,
        saranBelajar: val.saranBelajar
      });
    });

    // Smart recommendations based on missed indicators & score
    const rekomendasiTindakLanjut: string[] = [];
    if (nilaiAkhir >= 90) {
      rekomendasiTindakLanjut.push(
        'Lakukan kegiatan pengayaan: Rancang mandiri satu program sirkuit training 5 pos untuk melatih kebugaran di rumah.',
        'Bantu rekan sekelas melalui diskusi dan tutor sebaya saat praktik PJOK di lapangan.',
        'Terapkan gaya hidup aktif dengan mempertahankan latihan kebugaran jasmani minimal 3 kali seminggu.'
      );
    } else if (nilaiAkhir >= 80) {
      rekomendasiTindakLanjut.push(
        'Cermati kembali pembahasan butir soal yang dijawab salah pada menu Lihat Pembahasan.',
        'Tingkatkan ketelitian saat membaca studi kasus indikator metodologi dan prinsip latihan fisik.',
        'Praktikkan latihan kelincahan (shuttle run) dan daya ledak saat sesi olahraga mandiri.'
      );
    } else if (nilaiAkhir >= 70) {
      rekomendasiTindakLanjut.push(
        'Fokuskan belajar mandiri pada indikator yang persentase benarnya masih di bawah 60%.',
        'Pelajari kembali perbedaan komponen kebugaran terkait kesehatan vs terkait keterampilan.',
        'Diskusikan materi circuit training bersama rekan kelompok sebelum sesi praktik lapangan berikutnya.'
      );
    } else if (nilaiAkhir >= 60) {
      rekomendasiTindakLanjut.push(
        'Pelajari kembali ringkasan materi PJOK Kebugaran Jasmani Fase F dari awal secara seksama.',
        'Tinjau setiap pembahasan soal yang salah dan catat konsep pentingnya di buku catatan PJOK.',
        'Ikuti latihan penguatan mandiri dan manfaatkan kesempatan konsultasi bersama guru PJOK.'
      );
    } else {
      rekomendasiTindakLanjut.push(
        'Segera berkonsultasi langsung dengan Pak Agus Nova untuk mendapatkan pendampingan belajar bertahap.',
        'Pelajari kembali konsep dasar komponen kebugaran jasmani dan jenis-jenis tes kebugaran baku (TKJI).',
        'Kerjakan latihan bertahap setelah memahami konsep dasar.'
      );
    }

    const subId = `SUB-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newResult: SubmissionResult = {
      id: subId,
      waktuPengerjaan: timeStr,
      tanggal: dateStr,
      namaMurid,
      kelas,
      nis: nis || '45' + Math.floor(10 + Math.random() * 89),
      lkmId,
      materi,
      totalSoal,
      benar,
      salah,
      kosong,
      persentaseBenar,
      nilaiAkhir,
      kategori: feedbackObj.kategori,
      umpanBalik: feedbackObj.teks,
      analisisIndikator,
      saranBelajarList: Array.from(saranBelajarSet),
      rekomendasiTindakLanjut,
      reviewQuestions: reviewItems,
      statusPenilaian: 'selesai',
      refleksiTersimpan: false
    };

    // Replace if retake allowed, or append
    const existingIndex = this.submissions.findIndex(
      (s) =>
        s.namaMurid.trim().toLowerCase() === namaMurid.trim().toLowerCase() &&
        s.kelas.trim().toLowerCase() === kelas.trim().toLowerCase() &&
        s.lkmId === lkmId
    );

    if (existingIndex >= 0) {
      this.submissions[existingIndex] = newResult;
    } else {
      this.submissions.unshift(newResult);
    }

    this.saveSubmissions();
    return newResult;
  }

  private getFeedbackForScore(nilai: number): { kategori: string; teks: string } {
    for (const rule of this.feedbackRules) {
      if (nilai >= rule.minScore && nilai <= rule.maxScore) {
        return { kategori: rule.kategori, teks: rule.teks };
      }
    }
    return {
      kategori: 'Cukup Baik',
      teks: 'Terima kasih telah menyelesaikan LKM. Teruslah belajar dan berlatih untuk meningkatkan kebugaran jasmanimu!'
    };
  }

  // --- REFLECTION HANDLING ---

  public saveReflection(reflection: StudentReflection): boolean {
    const existingIndex = this.reflections.findIndex(
      (r) => r.submissionId === reflection.submissionId
    );
    if (existingIndex >= 0) {
      this.reflections[existingIndex] = reflection;
    } else {
      this.reflections.push(reflection);
    }
    this.saveReflections();

    // Mark submission
    const sub = this.submissions.find((s) => s.id === reflection.submissionId);
    if (sub) {
      sub.refleksiTersimpan = true;
      this.saveSubmissions();
    }
    return true;
  }

  public getReflections(): StudentReflection[] {
    return this.reflections;
  }

  public getReflectionBySubmissionId(subId: string): StudentReflection | undefined {
    return this.reflections.find((r) => r.submissionId === subId);
  }

  // --- TEACHER DASHBOARD & ANALYTICS ---

  public getSubmissions(): SubmissionResult[] {
    return this.submissions;
  }

  public getClassAnalytics(kelasFilter?: string, lkmFilter?: string): ClassAnalytics {
    let filteredSubs = this.submissions;
    if (kelasFilter && kelasFilter !== 'Semua Kelas') {
      filteredSubs = filteredSubs.filter((s) => s.kelas.trim().toLowerCase() === kelasFilter.trim().toLowerCase());
    }
    if (lkmFilter && lkmFilter !== 'Semua Materi') {
      filteredSubs = filteredSubs.filter((s) => s.lkmId === lkmFilter);
    }

    let enrolledStudents = this.students;
    if (kelasFilter && kelasFilter !== 'Semua Kelas') {
      enrolledStudents = enrolledStudents.filter((s) => s.kelas.trim().toLowerCase() === kelasFilter.trim().toLowerCase());
    }

    const totalMuridTerdaftar = enrolledStudents.length;
    const totalSudahMengerjakan = filteredSubs.length;
    const totalBelumMengerjakan = Math.max(0, totalMuridTerdaftar - totalSudahMengerjakan);
    const persentaseSelesai =
      totalMuridTerdaftar > 0
        ? Math.round((totalSudahMengerjakan / totalMuridTerdaftar) * 100)
        : 0;

    let nilaiRataRata = 0;
    let nilaiTertinggi = 0;
    let nilaiTerendah = 100;

    const distribusiKategori = {
      sangatBaik: 0,
      baik: 0,
      cukupBaik: 0,
      perluPeningkatan: 0,
      perluPendampingan: 0
    };

    const indikatorCounter = new Map<string, { totalSalah: number; totalCount: number }>();
    const soalMistakeCounter = new Map<number, { pertanyaan: string; salah: number; indikator: string }>();
    const butuhPendampingan: { nama: string; kelas: string; nilai: number; kategori: string }[] = [];

    if (filteredSubs.length > 0) {
      let sum = 0;
      nilaiTerendah = filteredSubs[0].nilaiAkhir;

      filteredSubs.forEach((sub) => {
        sum += sub.nilaiAkhir;
        if (sub.nilaiAkhir > nilaiTertinggi) nilaiTertinggi = sub.nilaiAkhir;
        if (sub.nilaiAkhir < nilaiTerendah) nilaiTerendah = sub.nilaiAkhir;

        if (sub.kategori === 'Sangat Baik') distribusiKategori.sangatBaik++;
        else if (sub.kategori === 'Baik') distribusiKategori.baik++;
        else if (sub.kategori === 'Cukup Baik') distribusiKategori.cukupBaik++;
        else if (sub.kategori === 'Perlu Peningkatan') distribusiKategori.perluPeningkatan++;
        else distribusiKategori.perluPendampingan++;

        if (sub.nilaiAkhir < 70) {
          butuhPendampingan.push({
            nama: sub.namaMurid,
            kelas: sub.kelas,
            nilai: sub.nilaiAkhir,
            kategori: sub.kategori
          });
        }

        // Tally indicator accuracy
        sub.analisisIndikator.forEach((ind) => {
          if (!indikatorCounter.has(ind.indikator)) {
            indikatorCounter.set(ind.indikator, { totalSalah: 0, totalCount: 0 });
          }
          const item = indikatorCounter.get(ind.indikator)!;
          item.totalCount += ind.total;
          item.totalSalah += ind.total - ind.benar;
        });

        // Tally question mistakes if available
        sub.reviewQuestions.forEach((q) => {
          if (!q.isBenar) {
            if (!soalMistakeCounter.has(q.nomor)) {
              soalMistakeCounter.set(q.nomor, {
                pertanyaan: q.pertanyaan,
                salah: 0,
                indikator: q.indikator
              });
            }
            soalMistakeCounter.get(q.nomor)!.salah++;
          }
        });
      });

      nilaiRataRata = Math.round(sum / filteredSubs.length);
    } else {
      nilaiTerendah = 0;
    }

    // Rank indicators by difficulty
    const indikatorPalingSulit: {
      indikator: string;
      persentaseSalah: number;
      totalSalah: number;
      totalKemunculan: number;
    }[] = [];
    const indikatorPalingDikuasai: {
      indikator: string;
      persentaseBenar: number;
    }[] = [];

    indikatorCounter.forEach((val, key) => {
      const pctWrong = val.totalCount > 0 ? Math.round((val.totalSalah / val.totalCount) * 100) : 0;
      indikatorPalingSulit.push({
        indikator: key,
        persentaseSalah: pctWrong,
        totalSalah: val.totalSalah,
        totalKemunculan: val.totalCount
      });
      indikatorPalingDikuasai.push({
        indikator: key,
        persentaseBenar: 100 - pctWrong
      });
    });

    indikatorPalingSulit.sort((a, b) => b.persentaseSalah - a.persentaseSalah);
    indikatorPalingDikuasai.sort((a, b) => b.persentaseBenar - a.persentaseBenar);

    // Rank hardest questions
    const soalPalingSulit: {
      nomor: number;
      pertanyaan: string;
      persentaseSalah: number;
      indikator: string;
    }[] = [];

    soalMistakeCounter.forEach((val, key) => {
      const pct = filteredSubs.length > 0 ? Math.round((val.salah / filteredSubs.length) * 100) : 0;
      soalPalingSulit.push({
        nomor: key,
        pertanyaan: val.pertanyaan,
        persentaseSalah: pct,
        indikator: val.indikator
      });
    });
    soalPalingSulit.sort((a, b) => b.persentaseSalah - a.persentaseSalah);

    // Generate teacher pedagogy recommendations
    const rekomendasiGuru: string[] = [];
    if (indikatorPalingSulit.length > 0 && indikatorPalingSulit[0].persentaseSalah > 25) {
      rekomendasiGuru.push(
        `Lakukan penguatan materi pada indikator "${indikatorPalingSulit[0].indikator}" karena ${indikatorPalingSulit[0].persentaseSalah}% jawaban murid masih salah.`
      );
    }
    if (distribusiKategori.perluPeningkatan + distribusiKategori.perluPendampingan > 0) {
      rekomendasiGuru.push(
        `Sediakan sesi pendampingan klinis atau remedial terarah untuk ${
          distribusiKategori.perluPeningkatan + distribusiKategori.perluPendampingan
        } murid yang memiliki nilai di bawah KKM 70.`
      );
    }
    rekomendasiGuru.push(
      'Integrasikan simulasi pos circuit training langsung di lapangan pada pertemuan PJOK berikutnya untuk memperkuat pemahaman kinestetik murid.'
    );

    return {
      totalMuridTerdaftar,
      totalSudahMengerjakan,
      totalBelumMengerjakan,
      persentaseSelesai,
      nilaiRataRata,
      nilaiTertinggi,
      nilaiTerendah,
      distribusiKategori,
      indikatorPalingSulit: indikatorPalingSulit.slice(0, 5),
      indikatorPalingDikuasai: indikatorPalingDikuasai.slice(0, 5),
      soalPalingSulit: soalPalingSulit.slice(0, 5),
      muridButuhPendampingan: butuhPendampingan.slice(0, 8),
      rekomendasiGuru
    };
  }

  // --- GOOGLE SPREADSHEET LIVE SYNC INTEGRATION ---

  public updateFromRemoteSpreadsheet(data: {
    students?: Student[];
    questions?: QuestionServer[];
    rules?: FeedbackRule[];
  }) {
    if (data.students && data.students.length > 0) {
      this.students = data.students;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
    }
    if (data.questions && data.questions.length > 0) {
      this.questions = data.questions;
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(this.questions));
    }
    if (data.rules && data.rules.length > 0) {
      this.feedbackRules = data.rules;
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_RULES, JSON.stringify(this.feedbackRules));
    }
  }

  public getRawQuestionsForTeacher(): QuestionServer[] {
    return this.questions;
  }

  public getFeedbackRules(): FeedbackRule[] {
    return this.feedbackRules;
  }

  public updateFeedbackRules(newRules: FeedbackRule[]) {
    this.feedbackRules = newRules;
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_RULES, JSON.stringify(newRules));
  }

  public updateLKMSettings(lkmId: string, settings: { allowRetake?: boolean; isActive?: boolean }) {
    const lkm = this.lkms.find((l) => l.id === lkmId);
    if (lkm) {
      if (typeof settings.allowRetake === 'boolean') lkm.allowRetake = settings.allowRetake;
      if (typeof settings.isActive === 'boolean') lkm.isActive = settings.isActive;
      localStorage.setItem(STORAGE_KEYS.LKMS, JSON.stringify(this.lkms));
    }
  }

  public resetSubmissions() {
    this.submissions = [];
    this.reflections = [];
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
  }

  public reloadSeededSubmissions() {
    this.submissions = [...INITIAL_SUBMISSIONS_SEEDED];
    this.saveSubmissions();
  }
}

export const lkmEngine = new LKMEngineService();
