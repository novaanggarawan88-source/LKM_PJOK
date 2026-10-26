import { Student, QuestionServer, LKMInfo, FeedbackRule } from '../types/lkm';

export const DEFAULT_LKM_LIST: LKMInfo[] = [
  {
    id: 'LKM-001-KBG',
    judul: 'LKM Kebugaran Jasmani & Circuit Training',
    materi: 'Aktivitas Kebugaran Jasmani Terkait Kesehatan & Keterampilan',
    kelas: 'Kelas XI',
    fase: 'Fase F (SMA/MA)',
    guru: 'I Ketut Agus Nova Anggarawan, S.Pd.',
    sekolah: 'SMA Negeri 1 Tejakula',
    jumlahSoal: 20,
    allowRetake: true,
    isActive: true,
    tujuanPembelajaran: [
      'Menganalisis konsep latihan peningkatan derajat kebugaran jasmani yang terkait dengan keterampilan (kecepatan, kelincahan, keseimbangan, daya ledak).',
      'Menganalisis dan menyusun variasi bentuk latihan kebugaran jasmani dengan metode circuit training.',
      'Mengevaluasi hasil pengukuran kebugaran jasmani dan menerapkan pola hidup aktif secara mandiri.'
    ],
    petunjuk: [
      'Pilihlah salah satu jawaban yang paling tepat pada soal pilihan ganda (A, B, C, D, atau E).',
      'Pada soal Benar atau Salah, tentukan kesesuaian pernyataan ilmiah PJOK.',
      'Pada soal isian, ketikkan istilah atau jawaban singkat yang tepat dan ringkas.',
      'Kerjakan dengan cermat, jujur, dan manfaatkan seluruh waktu pengerjaan.',
      'Periksa kembali seluruh jawaban sebelum menekan tombol Kumpulkan Jawaban.'
    ]
  },
  {
    id: 'LKM-002-BLB',
    judul: 'LKM Permainan Bola Besar (Bola Basket & Bola Voli)',
    materi: 'Analisis Keterampilan Gerak & Taktik Permainan Bola Besar',
    kelas: 'Kelas XI',
    fase: 'Fase F (SMA/MA)',
    guru: 'I Ketut Agus Nova Anggarawan, S.Pd.',
    sekolah: 'SMA Negeri 1 Tejakula',
    jumlahSoal: 10,
    allowRetake: false,
    isActive: true,
    tujuanPembelajaran: [
      'Menganalisis pola penyerangan dan pertahanan dalam permainan bola basket.',
      'Mengevaluasi variasi keterampilan passing, dribbling, dan shooting dalam situasi permainan nyata.'
    ],
    petunjuk: [
      'Jawab seluruh pertanyaan berdasarkan prinsip analisis taktik permainan bola besar.',
      'Pastikan Anda telah membaca studi kasus pada setiap nomor soal.'
    ]
  }
];

export const DEFAULT_STUDENTS: Student[] = [
  // Kelas XI 1
  { nis: '4501', nama: 'I Gede Arya Pratama', kelas: 'XI 1' },
  { nis: '4502', nama: 'Ni Kadek Dwi Lestari', kelas: 'XI 1' },
  { nis: '4503', nama: 'I Komang Yoga Artawan', kelas: 'XI 1' },
  { nis: '4504', nama: 'Ni Luh Putu Sintya Dewi', kelas: 'XI 1' },
  { nis: '4505', nama: 'I Made Suardana Putra', kelas: 'XI 1' },
  { nis: '4506', nama: 'Ni Wayan Ratna Sari', kelas: 'XI 1' },
  { nis: '4507', nama: 'I Ketut Aditya Gunawan', kelas: 'XI 1' },
  { nis: '4508', nama: 'Ni Nyoman Ayu Sukmadewi', kelas: 'XI 1' },
  { nis: '4509', nama: 'I Putu Budi Mahendra', kelas: 'XI 1' },
  { nis: '4510', nama: 'Ni Made Gita Cantika', kelas: 'XI 1' },

  // Kelas XI 2
  { nis: '4511', nama: 'I Wayan Agus Wira Sanjaya', kelas: 'XI 2' },
  { nis: '4512', nama: 'Ni Komang Sri Wahyuni', kelas: 'XI 2' },
  { nis: '4513', nama: 'I Kadek Bagus Hendra', kelas: 'XI 2' },
  { nis: '4514', nama: 'Ni Putu Desi Anggreni', kelas: 'XI 2' },
  { nis: '4515', nama: 'I Made Raditya Danendra', kelas: 'XI 2' },
  { nis: '4516', nama: 'Ni Wayan Mirah Cempaka', kelas: 'XI 2' },

  // Kelas XI 3
  { nis: '4521', nama: 'I Ketut Dharma Yasa', kelas: 'XI 3' },
  { nis: '4522', nama: 'Ni Luh Manik Pradnyani', kelas: 'XI 3' },
  { nis: '4523', nama: 'I Gede Bayu Samudra', kelas: 'XI 3' },
  { nis: '4524', nama: 'Ni Kadek Lia Puspita', kelas: 'XI 3' },
  { nis: '4525', nama: 'I Made Fajar Pratama', kelas: 'XI 3' },

  // Kelas XI 4
  { nis: '4531', nama: 'I Nyoman Krisna Wardana', kelas: 'XI 4' },
  { nis: '4532', nama: 'Ni Luh Eka Jayanti', kelas: 'XI 4' },
  { nis: '4533', nama: 'I Wayan Teguh Santosa', kelas: 'XI 4' },
  { nis: '4534', nama: 'Ni Putu Nadia Maharani', kelas: 'XI 4' }
];

export const DEFAULT_FEEDBACK_RULES: FeedbackRule[] = [
  {
    minScore: 90,
    maxScore: 100,
    kategori: 'Sangat Baik',
    arah: 'Apresiasi dan pengayaan',
    teks: 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi pembelajaran kebugaran jasmani. Pertahankan pencapaian ini dan terus kembangkan kemampuanmu dengan menerapkan pengetahuan kebugaran dalam aktivitas sehari-hari serta bantu temanmu melalui diskusi positif.'
  },
  {
    minScore: 80,
    maxScore: 89,
    kategori: 'Baik',
    arah: 'Penguatan dan peningkatan ketelitian',
    teks: 'Bagus! Kamu sudah memahami sebagian besar materi kebugaran jasmani dengan baik. Tingkatkan ketelitian dalam menganalisis soal dan pelajari kembali beberapa indikator yang masih perlu diperkuat melalui pembahasan soal.'
  },
  {
    minScore: 70,
    maxScore: 79,
    kategori: 'Cukup Baik',
    arah: 'Penguatan materi tertentu',
    teks: 'Kamu sudah menunjukkan pemahaman dasar yang cukup baik. Masih ada beberapa konsep atau komponen kebugaran yang perlu dipelajari kembali. Tetap semangat, fokuskan latihan pada indikator yang dijawab salah.'
  },
  {
    minScore: 60,
    maxScore: 69,
    kategori: 'Perlu Peningkatan',
    arah: 'Belajar ulang dan latihan tambahan',
    teks: 'Terima kasih sudah berusaha menyelesaikan LKM. Kamu perlu memperkuat pemahaman terhadap konsep dasar kebugaran jasmani dan metodologi latihannya. Bacalah kembali rangkuman materi, cermati pembahasan soal, dan ikuti latihan tambahan.'
  },
  {
    minScore: 0,
    maxScore: 59,
    kategori: 'Perlu Pendampingan',
    arah: 'Pendampingan bertahap dan latihan dasar',
    teks: 'Terima kasih atas usaha yang sudah kamu lakukan. Hasil ini menjadi panduan penting untuk mengetahui bagian materi yang perlu dipelajari secara bertahap. Jangan ragu berkonsultasi dengan guru PJOK (Pak Agus Nova) dan terus berlatih secara teratur.'
  }
];

export const DEFAULT_QUESTIONS_LKM1: QuestionServer[] = [
  {
    id: 'Q01',
    nomor: 1,
    tipe: 'pilihan_ganda',
    indikator: 'Pengertian Kebugaran Jasmani',
    submateri: 'Konsep Dasar Kebugaran Jasmani',
    pertanyaan: 'Kemampuan tubuh seseorang untuk melakukan aktivitas kerja fisik sehari-hari tanpa menimbulkan kelelahan yang berlebihan, serta masih memiliki cadangan energi untuk menikmati waktu luang atau keperluan mendadak disebut...',
    opsi: [
      { key: 'A', text: 'Kesehatan jasmani' },
      { key: 'B', text: 'Kebugaran jasmani' },
      { key: 'C', text: 'Kekuatan otot' },
      { key: 'D', text: 'Ketahanan aerobik' },
      { key: 'E', text: 'Ketangkasan gerak' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Kebugaran jasmani (physical fitness) didefinisikan sebagai kesanggupan tubuh untuk melakukan tugas harian tanpa kelelahan berarti dan masih memiliki energi cadangan untuk situasi mendadak atau rekreasi.',
    saranBelajar: 'Pelajari kembali definisi baku kebugaran jasmani dan bedakan dengan konsep kesehatan statis.'
  },
  {
    id: 'Q02',
    nomor: 2,
    tipe: 'pilihan_ganda',
    indikator: 'Komponen Kebugaran Jasmani',
    submateri: 'Komponen Terkait Kesehatan vs Keterampilan',
    pertanyaan: 'Berikut ini merupakan kelompok komponen kebugaran jasmani yang berhubungan langsung dengan kesehatan (health-related fitness), yaitu...',
    opsi: [
      { key: 'A', text: 'Kecepatan, kelincahan, dan keseimbangan' },
      { key: 'B', text: 'Daya ledak otot, koordinasi, dan reaksi' },
      { key: 'C', text: 'Daya tahan jantung-paru, kekuatan otot, daya tahan otot, dan kelenturan' },
      { key: 'D', text: 'Kelincahan, kekuatan otot, dan daya ledak' },
      { key: 'E', text: 'Keseimbangan, ketepatan, dan kelenturan tubuh' }
    ],
    kunciJawaban: 'C',
    bobot: 5,
    pembahasan: 'Health-related fitness mencakup daya tahan kardiorespirasi (jantung-paru), daya tahan otot, kekuatan otot, fleksibilitas/kelenturan, dan komposisi tubuh. Komponen lain seperti kecepatan, kelincahan, koordinasi tergolong skill-related fitness.',
    saranBelajar: 'Pahami pembagian 2 kelompok utama komponen kebugaran: terkait kesehatan (health-related) dan terkait keterampilan (skill-related).'
  },
  {
    id: 'Q03',
    nomor: 3,
    tipe: 'pilihan_ganda',
    indikator: 'Komponen Kebugaran Jasmani',
    submateri: 'Kelincahan (Agility)',
    pertanyaan: 'Kemampuan seseorang untuk mengubah arah dan posisi tubuh secara cepat dan tepat pada saat bergerak tanpa kehilangan keseimbangan disebut...',
    opsi: [
      { key: 'A', text: 'Kecepatan (speed)' },
      { key: 'B', text: 'Kelincahan (agility)' },
      { key: 'C', text: 'Kekuatan (strength)' },
      { key: 'D', text: 'Keseimbangan (balance)' },
      { key: 'E', text: 'Ketepatan (accuracy)' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Kelincahan (agility) adalah kemampuan mengubah arah gerak tubuh dengan cepat dan akurat dalam keadaan bergerak aktif tanpa kehilangan kontrol keseimbangan.',
    saranBelajar: 'Perhatikan kata kunci: "mengubah arah dan posisi secara cepat tanpa hilang keseimbangan" adalah kelincahan (agility).'
  },
  {
    id: 'Q04',
    nomor: 4,
    tipe: 'pilihan_ganda',
    indikator: 'Bentuk Latihan Kebugaran',
    submateri: 'Latihan Kelincahan',
    pertanyaan: 'Bentuk latihan yang paling tepat dan efektif untuk melatih dan meningkatkan tingkat kelincahan (agility) adalah...',
    opsi: [
      { key: 'A', text: 'Lari jarak jauh 5.000 meter' },
      { key: 'B', text: 'Lari bolak-balik (shuttle run) dan lari zig-zag mengitari rintangan' },
      { key: 'C', text: 'Latihan angkat beban bench press maksimal' },
      { key: 'D', text: 'Latihan sit-up selama 1 menit berturut-turut' },
      { key: 'E', text: 'Latihan peregangan statis di tempat' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Shuttle run (lari bolak-balik) dan zig-zag run menuntut perubahan arah secara mendadak dengan akselerasi dan deselerasi cepat, sehingga sangat spesifik untuk melatih kelincahan.',
    saranBelajar: 'Hubungkan setiap bentuk tes/latihan dengan komponen yang diukur. Shuttle run dan zig-zag run melatih kelincahan.'
  },
  {
    id: 'Q05',
    nomor: 5,
    tipe: 'pilihan_ganda',
    indikator: 'Komponen Kebugaran Jasmani',
    submateri: 'Daya Ledak Otot (Power)',
    pertanyaan: 'Perpaduan maksimal antara komponen kekuatan otot (strength) dengan komponen kecepatan kontraksi otot (speed) dinamakan...',
    opsi: [
      { key: 'A', text: 'Daya tahan otot (muscle endurance)' },
      { key: 'B', text: 'Daya ledak otot (power / explosive power)' },
      { key: 'C', text: 'Ketangkasan gerak' },
      { key: 'D', text: 'Fleksibilitas dinamis' },
      { key: 'E', text: 'Stabilitas sendi' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Daya ledak (muscular power) merupakan hasil perkalian antara kekuatan (kekuatan kontraksi maksimal) dengan kecepatan kontraksi gerak (P = Force x Velocity). Contohnya gerakan smash atau vertical jump.',
    saranBelajar: 'Rumus daya ledak adalah Kekuatan + Kecepatan. Ingat istilah explosive power.'
  },
  {
    id: 'Q06',
    nomor: 6,
    tipe: 'pilihan_ganda',
    indikator: 'Bentuk Latihan Kebugaran',
    submateri: 'Latihan Kekuatan Otot',
    pertanyaan: 'Gerakan push-up yang dilakukan dengan teknik yang tepat dan postur tubuh lurus terutama bertujuan untuk melatih dan meningkatkan kekuatan otot...',
    opsi: [
      { key: 'A', text: 'Dada (pectoralis major), bahu (anterior deltoid), dan lengan (triceps)' },
      { key: 'B', text: 'Punggung atas (latissimus dorsi) dan paha depan' },
      { key: 'C', text: 'Betis (gastrocnemius) dan pergelangan kaki' },
      { key: 'D', text: 'Otot leher dan otot pinggang bawah' },
      { key: 'E', text: 'Otot perut samping (obliques) semata' }
    ],
    kunciJawaban: 'A',
    bobot: 5,
    pembahasan: 'Push-up adalah latihan compound tubuh bagian atas (upper body pushing) yang mengaktivasi otot pectoralis major (dada), deltoid anterior (bahu depan), dan triceps brachii (lengan belakang).',
    saranBelajar: 'Identifikasi kelompok otot primer pada latihan kalistenik: Push-up untuk dada/triceps, Pull-up untuk punggung/biceps, Sit-up untuk perut.'
  },
  {
    id: 'Q07',
    nomor: 7,
    tipe: 'pilihan_ganda',
    indikator: 'Konsep Circuit Training',
    submateri: 'Prinsip Latihan Sirkuit',
    pertanyaan: 'Dalam penyusunan pos-pos pada latihan sirkuit (circuit training), prinsip penting yang harus diperhatikan agar tidak terjadi kelelahan lokal yang berlebihan adalah...',
    opsi: [
      { key: 'A', text: 'Semua pos harus melatih otot lengan secara berturut-turut' },
      { key: 'B', text: 'Pos latihan harus diselingi antara kelompok otot tubuh bagian atas, perut, dan tubuh bagian bawah' },
      { key: 'C', text: 'Waktu istirahat antar pos harus minimal 10 menit' },
      { key: 'D', text: 'Beban latihan setiap pos harus selalu dinaikkan 100%' },
      { key: 'E', text: 'Latihan dilakukan hanya pada satu pos selama 45 menit' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Prinsip penyusunan circuit training yang baik adalah rotasi kelompok otot: pos tubuh atas (upper body) -> pos inti/perut (core) -> pos tubuh bawah (lower body). Hal ini memberi kesempatan pemulihan lokal saat kelompok otot lain bekerja.',
    saranBelajar: 'Pahami prinsip variasi pos sirkuit training: pergantian target otot mencegah penumpukan asam laktat lokal secara berlebihan.'
  },
  {
    id: 'Q08',
    nomor: 8,
    tipe: 'pilihan_ganda',
    indikator: 'Konsep Circuit Training',
    submateri: 'Manfaat & Ciri Circuit Training',
    pertanyaan: 'Keunggulan utama penerapan metode latihan circuit training dalam pembelajaran PJOK adalah...',
    opsi: [
      { key: 'A', text: 'Hanya melatih satu komponen kebugaran dalam satu waktu' },
      { key: 'B', text: 'Dapat melatih berbagai komponen kebugaran (kekuatan, daya tahan, kelincahan) secara bersamaan dan hemat waktu' },
      { key: 'C', text: 'Tidak memerlukan pemanasan dan pendinginan sama sekali' },
      { key: 'D', text: 'Hanya cocok untuk atlet profesional yang berlatih maraton' },
      { key: 'E', text: 'Murid beristirahat pasif selama sebagian besar waktu' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Circuit training efisien karena dalam satu rangkaian putaran, murid melatih daya tahan kardiovaskular, daya tahan otot, kekuatan, serta kelincahan secara terpadu dalam waktu yang relatif singkat.',
    saranBelajar: 'Review tujuan utama sirkuit training yang memadukan latihan aerobik dan anaerobik secara dinamis.'
  },
  {
    id: 'Q09',
    nomor: 9,
    tipe: 'pilihan_ganda',
    indikator: 'Pengukuran Kebugaran Jasmani',
    submateri: 'Tes Daya Tahan Jantung-Paru',
    pertanyaan: 'Tes kebugaran jasmani standar yang sering digunakan di sekolah untuk mengukur daya tahan jantung dan paru-paru (kardiorespiratori / VO2Max) adalah...',
    opsi: [
      { key: 'A', text: 'Tes lari cepat 50 meter (sprint)' },
      { key: 'B', text: 'Tes duduk tegak meraih (sit and reach)' },
      { key: 'C', text: 'Tes bleep (Multistage Fitness Test / lari multistage 20m) atau lari 1.200 meter' },
      { key: 'D', text: 'Tes lempar bola tenis' },
      { key: 'E', text: 'Tes lompat jauh tanpa awalan (standing broad jump)' }
    ],
    kunciJawaban: 'C',
    bobot: 5,
    pembahasan: 'Bleep test (MFT) dan lari 1.200 meter (TKJI kategori usia SMA) adalah instrumen baku untuk mengukur kapasitas aerobik maksimal (VO2Max) dan daya tahan kardiorespirasi.',
    saranBelajar: 'Kenali instrumen tes TKJI: Lari 50m (kecepatan), Gantung angkat tubuh (kekuatan lengan), Baring duduk (otot perut), Loncat tegak (daya ledak), Lari 1200m/Bleep test (daya tahan jantung-paru).'
  },
  {
    id: 'Q10',
    nomor: 10,
    tipe: 'pilihan_ganda',
    indikator: 'Metodologi & Prinsip Latihan',
    submateri: 'Prinsip Beban Lebih (Overload)',
    pertanyaan: 'Prinsip latihan yang menyatakan bahwa beban latihan fisik yang diberikan kepada tubuh harus lebih berat dari aktivitas normal sehari-hari agar terjadi peningkatan kapasitas fisik disebut prinsip...',
    opsi: [
      { key: 'A', text: 'Spesifisitas (specificity)' },
      { key: 'B', text: 'Beban lebih (overload principle)' },
      { key: 'C', text: 'Kembali ke asal (reversibility)' },
      { key: 'D', text: 'Individualitas (individuality)' },
      { key: 'E', text: 'Periodisasi latihan' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Prinsip overload mensyaratkan pemberian beban stimulus yang melebihi beban adaptasi saat ini secara terukur dan bertahap (progressive overload) agar sistem fisiologis tubuh beradaptasi meningkat.',
    saranBelajar: 'Pelajari 4 prinsip dasar latihan FITT: Frequency, Intensity, Time, Type serta prinsip Overload, Specificity, dan Reversibility.'
  },
  {
    id: 'Q11',
    nomor: 11,
    tipe: 'pilihan_ganda',
    indikator: 'Metodologi & Prinsip Latihan',
    submateri: 'Frekuensi Latihan & Denyut Nadi',
    pertanyaan: 'Rumus standar perkiraan denyut nadi maksimal (DNM) seseorang berdasarkan usianya menurut kaidah fisiologi olahraga adalah...',
    opsi: [
      { key: 'A', text: 'DNM = 220 – Usia' },
      { key: 'B', text: 'DNM = 200 + Usia' },
      { key: 'C', text: 'DNM = 150 × Usia' },
      { key: 'D', text: 'DNM = 100 + (Usia / 2)' },
      { key: 'E', text: 'DNM = 180 – Usia' }
    ],
    kunciJawaban: 'A',
    bobot: 5,
    pembahasan: 'Rumus Fox and Haskell yang umum dipakai untuk menentukan estimasi Denyut Nadi Maksimal (DNM) adalah 220 dikurangi usia individu (tahun). Contoh: usia 16 tahun -> DNM = 220 - 16 = 204 denyut/menit.',
    saranBelajar: 'Hafalkan rumus DNM = 220 - Usia dan cara menghitung target training zone (60% - 85% dari DNM).'
  },
  {
    id: 'Q12',
    nomor: 12,
    tipe: 'pilihan_ganda',
    indikator: 'Bentuk Latihan Kebugaran',
    submateri: 'Kelentukan (Flexibility)',
    pertanyaan: 'Latihan peregangan statis (menahan posisi regangan selama 15–30 detik tanpa hentakan) paling baik dilakukan pada saat fase...',
    opsi: [
      { key: 'A', text: 'Tepat sebelum melakukan lari sprint 100 meter' },
      { key: 'B', text: 'Pendinginan (cooling down) setelah selesai berolahraga' },
      { key: 'C', text: 'Ketika sedang bertanding aktif di lapangan' },
      { key: 'D', text: 'Saat tubuh baru bangun tidur tanpa pemanasan' },
      { key: 'E', text: 'Hanya jika mengalami kram otot akut' }
    ],
    kunciJawaban: 'B',
    bobot: 5,
    pembahasan: 'Peregangan statis ideal dilakukan saat pendinginan (cooling down) saat otot masih hangat untuk memulihkan elastisitas otot dan mengurangi ketegangan. Pada pemanasan, lebih disarankan peregangan dinamis.',
    saranBelajar: 'Bedakan peregangan dinamis (cocok untuk pemanasan) dengan peregangan statis (cocok untuk pendinginan).'
  },
  {
    id: 'Q13',
    nomor: 13,
    tipe: 'benar_salah',
    indikator: 'Konsep Circuit Training',
    submateri: 'Struktur Circuit Training',
    pertanyaan: 'Pernyataan: "Pada circuit training, setiap pos harus memiliki jeda istirahat selama minimal 15 menit agar denyut jantung kembali ke kondisi istirahat total sebelum pindah pos berikutnya."',
    opsi: [
      { key: 'BENAR', text: 'BENAR' },
      { key: 'SALAH', text: 'SALAH' }
    ],
    kunciJawaban: 'SALAH',
    bobot: 5,
    pembahasan: 'Pernyataan SALAH. Jeda antar pos pada circuit training umumnya singkat (15 sampai 45 detik) agar denyut jantung tetap berada di zona latihan (training zone) dan menjaga intensitas aerobik-anaerobik.',
    saranBelajar: 'Perhatikan bahwa istirahat 15 menit antar pos justru menghilangkan efek latihan sirkuit yang mengutamakan transisi berulang.'
  },
  {
    id: 'Q14',
    nomor: 14,
    tipe: 'benar_salah',
    indikator: 'Komponen Kebugaran Jasmani',
    submateri: 'Kecepatan vs Daya Tahan',
    pertanyaan: 'Pernyataan: "Seorang pelari maraton 42 km lebih dominan mengandalkan serabut otot tipe lambat (slow-twitch muscle fibers) dan sistem energi aerobik dibandingkan pelari sprint 100 meter."',
    opsi: [
      { key: 'BENAR', text: 'BENAR' },
      { key: 'SALAH', text: 'SALAH' }
    ],
    kunciJawaban: 'BENAR',
    bobot: 5,
    pembahasan: 'Pernyataan BENAR. Pelari jarak jauh/maraton mengandalkan serat otot tipe I (slow-twitch) yang kaya mitokondria untuk metabolisme aerobik yang tahan lelah, sedangkan sprinter mengandalkan fast-twitch (anaerobik).',
    saranBelajar: 'Pahami hubungan sistem energi aerobik (oksigen) untuk daya tahan lama dan anaerobik (tanpa oksigen) untuk gerak cepat intens.'
  },
  {
    id: 'Q15',
    nomor: 15,
    tipe: 'benar_salah',
    indikator: 'Pengertian Kebugaran Jasmani',
    submateri: 'Pola Hidup Sehat & Pemulihan',
    pertanyaan: 'Pernyataan: "Tingkat kebugaran jasmani seseorang dipengaruhi oleh asupan nutrisi seimbang, istirahat/tidur yang cukup, serta intensitas dan keteraturan latihan fisik."',
    opsi: [
      { key: 'BENAR', text: 'BENAR' },
      { key: 'SALAH', text: 'SALAH' }
    ],
    kunciJawaban: 'BENAR',
    bobot: 5,
    pembahasan: 'Pernyataan BENAR. Triad kebugaran dan kesehatan jasmani bertumpu pada latihan fisik yang teratur, nutrisi seimbang, dan istirahat/pemulihan yang memadai.',
    saranBelajar: 'Kebugaran jasmani tidak hanya ditentukan oleh latihan fisik saja, melainkan juga pola istirahat dan nutrisi.'
  },
  {
    id: 'Q16',
    nomor: 16,
    tipe: 'isian',
    indikator: 'Bentuk Latihan Kebugaran',
    submateri: 'Latihan Otot Perut',
    pertanyaan: 'Sebutkan nama bentuk latihan fisik tanpa alat yang paling umum dilakukan untuk memperkuat daya tahan dan kekuatan otot perut (abdominal muscle)!',
    kunciJawaban: 'SIT UP',
    bobot: 5,
    pembahasan: 'Latihan sit-up atau crunch merupakan bentuk latihan kalistenik standar yang menargetkan otot rektus abdominis (otot perut).',
    saranBelajar: 'Sit-up atau crunch adalah latihan dasar penguatan otot perut.'
  },
  {
    id: 'Q17',
    nomor: 17,
    tipe: 'isian',
    indikator: 'Pengukuran Kebugaran Jasmani',
    submateri: 'Indeks Massa Tubuh',
    pertanyaan: 'Singkatan dari ukuran yang membandingkan berat badan (kg) terhadap kuadrat tinggi badan (meter) untuk memantau status gizi dan komposisi tubuh adalah...',
    kunciJawaban: 'IMT',
    bobot: 5,
    pembahasan: 'IMT (Indeks Massa Tubuh) atau BMI (Body Mass Index) digunakan untuk mengklasifikasikan status gizi berat badan kurang, normal, berlebih, atau obesitas.',
    saranBelajar: 'Ketahui rumus IMT = Berat Badan (kg) / [Tinggi Badan (m)]^2.'
  },
  {
    id: 'Q18',
    nomor: 18,
    tipe: 'pilihan_ganda',
    indikator: 'Manfaat Kebugaran Jasmani',
    submateri: 'Fisiologi Kardiovaskular',
    pertanyaan: 'Salah satu dampak positif adaptasi fisiologis yang terjadi pada sistem kardiovaskular seseorang yang rutin melakukan latihan kebugaran aerobik adalah...',
    opsi: [
      { key: 'A', text: 'Denyut nadi istirahat (resting heart rate) cenderung lebih rendah dan efisien' },
      { key: 'B', text: 'Kapasitas paru-paru menjadi semakin menyempit' },
      { key: 'C', text: 'Produksi asam laktat dalam darah menjadi berlipat ganda saat tidur' },
      { key: 'D', text: 'Tekanan darah meningkat secara konstan dan tidak terkendali' },
      { key: 'E', text: 'Jantung berdetak lebih cepat bahkan saat sedang istirahat' }
    ],
    kunciJawaban: 'A',
    bobot: 5,
    pembahasan: 'Orang yang bugar secara aerobik memiliki volume sekuncup (stroke volume) jantung yang lebih besar, sehingga jantung memompa lebih banyak darah per detak. Akibatnya, denyut nadi istirahat (resting heart rate) menjadi lebih rendah (bradikardia fisiologis).',
    saranBelajar: 'Pahami tanda jantung bugar: denyut nadi istirahat lebih rendah dan pemulihan nadi setelah latihan berlangsung lebih cepat.'
  },
  {
    id: 'Q19',
    nomor: 19,
    tipe: 'pilihan_ganda',
    indikator: 'Bentuk Latihan Kebugaran',
    submateri: 'Keseimbangan (Balance)',
    pertanyaan: 'Sikap melayang dengan bertumpu pada satu kaki terkuat, badan condong ke depan, dan kedua tangan direntangkan ke samping meniru gerakan pesawat terbang berguna untuk melatih...',
    opsi: [
      { key: 'A', text: 'Keseimbangan statis' },
      { key: 'B', text: 'Kecepatan reaksi' },
      { key: 'C', text: 'Daya ledak tungkai' },
      { key: 'D', text: 'Kelenturan pergelangan tangan' },
      { key: 'E', text: 'Daya tahan otot bisep' }
    ],
    kunciJawaban: 'A',
    bobot: 5,
    pembahasan: 'Sikap kapal terbang (stork stand / airplane stance) adalah latihan untuk melatih keseimbangan statis karena tubuh mempertahankan posisi seimbang di satu tempat tanpa berpindah tempat.',
    saranBelajar: 'Bedakan keseimbangan statis (diam di tempat seperti sikap kapal terbang) dengan keseimbangan dinamis (saat bergerak seperti berjalan di balok titian).'
  },
  {
    id: 'Q20',
    nomor: 20,
    tipe: 'pilihan_ganda',
    indikator: 'Konsep Circuit Training',
    submateri: 'Penerapan Pos Latihan',
    pertanyaan: 'Di SMA Negeri 1 Tejakula, Pak Agus Nova merancang 4 pos circuit training: Pos 1 (Push-up), Pos 2 (Shuttle Run), Pos 3 (Sit-up), Pos 4 (Jumping Jack). Urutan tersebut mencerminkan kombinasi latihan...',
    opsi: [
      { key: 'A', text: 'Kekuatan dada/lengan, kelincahan, kekuatan otot perut, dan daya tahan kardiovaskular' },
      { key: 'B', text: 'Hanya melatih kelentukan punggung bawah semata' },
      { key: 'C', text: 'Seluruhnya melatih kekuatan otot jari tangan' },
      { key: 'D', text: 'Hanya melatih kecepatan reaksi pendengaran' },
      { key: 'E', text: 'Tidak ada variasi komponen gerak sama sekali' }
    ],
    kunciJawaban: 'A',
    bobot: 5,
    pembahasan: 'Pos 1 (Push-up: kekuatan otot dada & triceps), Pos 2 (Shuttle run: kelincahan & koordinasi), Pos 3 (Sit-up: kekuatan otot perut), Pos 4 (Jumping jack: daya tahan kardiovaskular & koordinasi ritmik). Susunan ini sangat seimbang dan representatif.',
    saranBelajar: 'Pahami pemetaan gerakan latihan ke komponen kebugaran yang dilatih pada setiap pos sirkuit.'
  }
];

export const INITIAL_SUBMISSIONS_SEEDED = [
  {
    id: 'SUB-20261026-001',
    waktuPengerjaan: '08:30:15',
    tanggal: '2026-10-26',
    namaMurid: 'I Gede Arya Pratama',
    kelas: 'XI 1',
    nis: '4501',
    lkmId: 'LKM-001-KBG',
    materi: 'Aktivitas Kebugaran Jasmani Terkait Kesehatan & Keterampilan',
    totalSoal: 20,
    benar: 18,
    salah: 2,
    kosong: 0,
    persentaseBenar: 90,
    nilaiAkhir: 90,
    kategori: 'Sangat Baik',
    umpanBalik: 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi pembelajaran kebugaran jasmani. Pertahankan pencapaian ini dan terus kembangkan kemampuanmu dengan menerapkan pengetahuan kebugaran dalam aktivitas sehari-hari.',
    analisisIndikator: [
      { indikator: 'Pengertian Kebugaran Jasmani', total: 2, benar: 2 },
      { indikator: 'Komponen Kebugaran Jasmani', total: 4, benar: 4 },
      { indikator: 'Bentuk Latihan Kebugaran', total: 5, benar: 4, saranBelajar: 'Perhatikan teknik peregangan statis vs dinamis.' },
      { indikator: 'Konsep Circuit Training', total: 4, benar: 4 },
      { indikator: 'Pengukuran Kebugaran Jasmani', total: 2, benar: 2 },
      { indikator: 'Metodologi & Prinsip Latihan', total: 2, benar: 1, saranBelajar: 'Perkuat pemahaman mengenai rumus denyut nadi maksimal.' },
      { indikator: 'Manfaat Kebugaran Jasmani', total: 1, benar: 1 }
    ],
    saranBelajarList: [
      'Perhatikan teknik peregangan statis vs dinamis pada fase pendinginan.',
      'Perkuat pemahaman mengenai rumus denyut nadi maksimal dan zona latihan target.'
    ],
    rekomendasiTindakLanjut: [
      'Kerjakan kegiatan pengayaan materi penyusunan program kebugaran mandiri.',
      'Bantu rekan sekelas melalui diskusi dan praktik gerak circuit training.'
    ],
    reviewQuestions: [],
    statusPenilaian: 'selesai' as const,
    refleksiTersimpan: true
  },
  {
    id: 'SUB-20261026-002',
    waktuPengerjaan: '08:45:20',
    tanggal: '2026-10-26',
    namaMurid: 'Ni Kadek Dwi Lestari',
    kelas: 'XI 1',
    nis: '4502',
    lkmId: 'LKM-001-KBG',
    materi: 'Aktivitas Kebugaran Jasmani Terkait Kesehatan & Keterampilan',
    totalSoal: 20,
    benar: 16,
    salah: 4,
    kosong: 0,
    persentaseBenar: 80,
    nilaiAkhir: 80,
    kategori: 'Baik',
    umpanBalik: 'Bagus! Kamu sudah memahami sebagian besar materi kebugaran jasmani dengan baik. Tingkatkan ketelitian dalam menganalisis soal dan pelajari kembali beberapa indikator yang masih perlu diperkuat melalui pembahasan soal.',
    analisisIndikator: [
      { indikator: 'Pengertian Kebugaran Jasmani', total: 2, benar: 2 },
      { indikator: 'Komponen Kebugaran Jasmani', total: 4, benar: 3, saranBelajar: 'Pelajari perbedaan kelincahan vs kecepatan.' },
      { indikator: 'Bentuk Latihan Kebugaran', total: 5, benar: 4 },
      { indikator: 'Konsep Circuit Training', total: 4, benar: 3, saranBelajar: 'Cermati jeda waktu antar pos latihan sirkuit.' },
      { indikator: 'Pengukuran Kebugaran Jasmani', total: 2, benar: 2 },
      { indikator: 'Metodologi & Prinsip Latihan', total: 2, benar: 1 },
      { indikator: 'Manfaat Kebugaran Jasmani', total: 1, benar: 1 }
    ],
    saranBelajarList: [
      'Pelajari perbedaan kelincahan (agility) dan kecepatan reaksi.',
      'Cermati jeda waktu antar pos latihan sirkuit agar intensitas tetap terjaga.'
    ],
    rekomendasiTindakLanjut: [
      'Pelajari kembali pembahasan soal nomor yang salah.',
      'Latih ketelitian membaca studi kasus pada indikator circuit training.'
    ],
    reviewQuestions: [],
    statusPenilaian: 'selesai' as const,
    refleksiTersimpan: true
  },
  {
    id: 'SUB-20261026-003',
    waktuPengerjaan: '09:02:11',
    tanggal: '2026-10-26',
    namaMurid: 'I Komang Yoga Artawan',
    kelas: 'XI 1',
    nis: '4503',
    lkmId: 'LKM-001-KBG',
    materi: 'Aktivitas Kebugaran Jasmani Terkait Kesehatan & Keterampilan',
    totalSoal: 20,
    benar: 14,
    salah: 6,
    kosong: 0,
    persentaseBenar: 70,
    nilaiAkhir: 70,
    kategori: 'Cukup Baik',
    umpanBalik: 'Kamu sudah menunjukkan pemahaman dasar yang cukup baik. Masih ada beberapa konsep atau komponen kebugaran yang perlu dipelajari kembali. Tetap semangat, fokuskan latihan pada indikator yang dijawab salah.',
    analisisIndikator: [
      { indikator: 'Pengertian Kebugaran Jasmani', total: 2, benar: 2 },
      { indikator: 'Komponen Kebugaran Jasmani', total: 4, benar: 2, saranBelajar: 'Perkuat konsep daya ledak (power) dan kelincahan.' },
      { indikator: 'Bentuk Latihan Kebugaran', total: 5, benar: 3, saranBelajar: 'Pelajari latihan compound otot tubuh bagian atas.' },
      { indikator: 'Konsep Circuit Training', total: 4, benar: 3 },
      { indikator: 'Pengukuran Kebugaran Jasmani', total: 2, benar: 1, saranBelajar: 'Pelajari fungsi tes VO2Max (Bleep test).' },
      { indikator: 'Metodologi & Prinsip Latihan', total: 2, benar: 2 },
      { indikator: 'Manfaat Kebugaran Jasmani', total: 1, benar: 1 }
    ],
    saranBelajarList: [
      'Perkuat konsep daya ledak (power = force x velocity) dan kelincahan.',
      'Pelajari jenis latihan kalistenik dan fungsi tes VO2Max bleep test.'
    ],
    rekomendasiTindakLanjut: [
      'Pelajari kembali indikator yang masih banyak dijawab salah.',
      'Kerjakan latihan penguatan konsep mandiri.'
    ],
    reviewQuestions: [],
    statusPenilaian: 'selesai' as const,
    refleksiTersimpan: false
  }
];
