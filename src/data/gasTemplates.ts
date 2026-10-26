export const SPREADSHEET_SCHEMA_DOCS = `# PANDUAN STRUKTUR GOOGLE SPREADSHEET (SINGLE SOURCE OF TRUTH)
## LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA
Guru Pengampu: I Ketut Agus Nova Anggarawan, S.Pd.

Berikut struktur sheet dan kolom yang didukung oleh sistem LKM Digital PJOK:

---

### 1. Sheet: "DATA_MURID"
Menyimpan data identitas peserta didik per kelas.
| Header Kolom | Tipe Data | Keterangan & Contoh |
| :--- | :--- | :--- |
| **Kelas** | Teks | Nama rombel/kelas (Contoh: \`XI 1\`, \`XI 2\`, \`XI 3\`) |
| **NIS** | Teks | Nomor Induk Siswa (Contoh: \`4501\`, \`4502\`) |
| **Nama Murid** | Teks | Nama lengkap murid (Contoh: \`I Gede Arya Pratama\`) |
| **Status** | Teks | Aktif / Non-Aktif (Opsional) |

---

### 2. Sheet: "BANK_SOAL"
Menyimpan butir pertanyaan, opsi pilihan, kunci jawaban (hanya dibaca backend), indikator, dan pembahasan.
| Header Kolom | Tipe Data | Keterangan & Contoh |
| :--- | :--- | :--- |
| **ID Soal** | Teks | Kode unik soal (Contoh: \`Q01\`, \`Q02\`) |
| **ID LKM** | Teks | ID LKM terkait (Contoh: \`LKM-001-KBG\`) |
| **Nomor** | Angka | Nomor urut soal (1, 2, 3...) |
| **Tipe** | Teks | \`pilihan_ganda\`, \`benar_salah\`, \`isian\`, atau \`uraian\` |
| **Indikator** | Teks | Indikator kompetensi (Contoh: \`Komponen Kebugaran Jasmani\`) |
| **Submateri** | Teks | Pokok bahasan (Contoh: \`Kelincahan (Agility)\`) |
| **Pertanyaan** | Teks | Teks pertanyaan lengkap |
| **A** | Teks | Opsi A (Pilihan ganda) |
| **B** | Teks | Opsi B (Pilihan ganda) |
| **C** | Teks | Opsi C (Pilihan ganda) |
| **D** | Teks | Opsi D (Pilihan ganda) |
| **E** | Teks | Opsi E (Pilihan ganda) |
| **Kunci** | Teks | Kunci jawaban (\`A\`, \`B\`, \`C\`, \`D\`, \`E\`, \`BENAR\`, \`SALAH\`, dsb) |
| **Bobot** | Angka | Bobot nilai per butir (Default: 5) |
| **Pembahasan** | Teks | Penjelasan konsep jawaban benar |
| **Saran Belajar** | Teks | Rekomendasi materi jika murid menjawab salah |

---

### 3. Sheet: "PENGATURAN_FEEDBACK"
Mengatur rentang nilai dan teks umpan balik otomatis yang dapat diubah guru tanpa menyentuh kode.
| Header Kolom | Tipe Data | Keterangan & Contoh |
| :--- | :--- | :--- |
| **Min Nilai** | Angka | Batas bawah nilai (90, 80, 70, 60, 0) |
| **Max Nilai** | Angka | Batas atas nilai (100, 89, 79, 69, 59) |
| **Kategori** | Teks | Sangat Baik, Baik, Cukup Baik, dsb. |
| **Arah Umpan Balik**| Teks | Orientasi tindak lanjut |
| **Teks Umpan Balik**| Teks | Kalimat motivasi dan saran perbaikan |

---

### 4. Sheet: "HASIL_LKM"
Tempat Google Apps Script menyimpan otomatis hasil pengerjaan setiap murid.
| Header Kolom | Keterangan |
| :--- | :--- |
| **ID Pengerjaan** | Kode unik (Contoh: \`SUB-20261026-001\`) |
| **Tanggal** | Tanggal submit (\`YYYY-MM-DD\`) |
| **Waktu** | Waktu submit (\`HH:MM:SS\`) |
| **Kelas** | Kelas murid |
| **NIS** | NIS murid |
| **Nama Murid** | Nama lengkap murid |
| **ID LKM** | ID Lembar Kerja Murid |
| **Materi** | Judul materi LKM |
| **Total Soal** | Jumlah butir soal |
| **Benar** | Jumlah jawaban benar |
| **Salah** | Jumlah jawaban salah |
| **Kosong** | Jumlah soal belum dijawab |
| **Nilai Akhir** | Nilai skala 0–100 |
| **Kategori** | Kategori pencapaian |
| **Indikator Lemah**| Daftar indikator yang dijawab salah |
| **Umpan Balik** | Teks umpan balik yang diberikan |
| **Jawaban Detail** | JSON jawaban per butir |
| **Status Penilaian**| Selesai / Menunggu Penilaian Guru |

---

### 5. Sheet: "REFLEKSI_MURID"
Menyimpan refleksi 4 pertanyaan setelah murid melihat hasil dan umpan balik.
| Header Kolom | Keterangan |
| :--- | :--- |
| **ID Pengerjaan** | Menghubungkan ke tabel Hasil LKM |
| **Waktu Simpan** | Timestamp |
| **Nama Murid** | Nama murid |
| **Kelas** | Kelas |
| **Materi LKM** | Materi yang direfleksikan |
| **Hal Baru Dipahami** | Jawaban Pertanyaan 1 |
| **Materi Masih Sulit**| Jawaban Pertanyaan 2 |
| **Penyebab Kesulitan**| Jawaban Pertanyaan 3 |
| **Rencana Perbaikan** | Jawaban Pertanyaan 4 |
`;

export const CODE_GS_CONTENT = `/**
 * ====================================================================
 * LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA
 * Guru Pengampu: I Ketut Agus Nova Anggarawan, S.Pd.
 * 
 * Google Apps Script Backend (Code.gs)
 * Fungsi: Penilaian Otomatis, Analisis Indikator, Proteksi Kunci Jawaban,
 *         dan Penyimpanan Hasil & Refleksi ke Google Spreadsheet.
 * ====================================================================
 */

// Ganti dengan ID Spreadsheet Anda jika menggunakan standalone script,
// atau biarkan null jika script tertaut langsung (Container-Bound) ke Spreadsheet.
var SPREADSHEET_ID = null; 

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Endpoint GET: Melayani Web App HTML Service atau API JSON
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : null;
  
  if (action === 'getClasses') {
    return createJsonResponse(apiGetClasses());
  } else if (action === 'getStudents') {
    return createJsonResponse(apiGetStudents(e.parameter.kelas));
  } else if (action === 'getLKMList') {
    return createJsonResponse(apiGetLKMList());
  } else if (action === 'getQuestions') {
    return createJsonResponse(apiGetQuestions(e.parameter.lkmId));
  } else if (action === 'getAnalytics') {
    return createJsonResponse(apiGetClassAnalytics(e.parameter.kelas, e.parameter.lkmId));
  }
  
  // Default: Tampilkan antarmuka HTML Service
  var html = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('LKM Digital PJOK - SMAN 1 Tejakula')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

/**
 * Endpoint POST: Menerima pengumpulan jawaban dan refleksi murid
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'submitLKM') {
      var result = processLKMSubmission(data);
      return createJsonResponse(result);
    } else if (action === 'saveReflection') {
      var refResult = saveStudentReflection(data);
      return createJsonResponse(refResult);
    }
    
    return createJsonResponse({ success: false, error: 'Aksi tidak dikenali' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// -------------------------------------------------------------
// FUNGSI PENGAMBILAN DATA (UNTUK FRONTEND MAUPUN google.script.run)
// -------------------------------------------------------------

function apiGetClasses() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('DATA_MURID');
  if (!sheet) return ['XI 1', 'XI 2', 'XI 3', 'XI 4'];
  
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var kelasCol = header.indexOf('Kelas');
  if (kelasCol === -1) kelasCol = 0;
  
  var setKelas = {};
  for (var i = 1; i < data.length; i++) {
    var k = String(data[i][kelasCol]).trim();
    if (k) setKelas[k] = true;
  }
  return Object.keys(setKelas).sort();
}

function apiGetStudents(kelas) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('DATA_MURID');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var kelasCol = header.indexOf('Kelas');
  var nisCol = header.indexOf('NIS');
  var namaCol = header.indexOf('Nama Murid');
  if (namaCol === -1) namaCol = header.indexOf('Nama');
  
  var students = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowKelas = String(row[kelasCol]).trim();
    if (!kelas || rowKelas === String(kelas).trim()) {
      students.push({
        kelas: rowKelas,
        nis: String(row[nisCol] || ''),
        nama: String(row[namaCol] || '')
      });
    }
  }
  return students.sort(function(a, b) {
    return a.nama.localeCompare(b.nama);
  });
}

function apiGetLKMList() {
  return [
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
      isActive: true
    }
  ];
}

/**
 * PENTING: Kunci Jawaban TIDAK PERNAH dikirim ke browser murid!
 */
function apiGetQuestions(lkmId) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('BANK_SOAL');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  
  var colId = header.indexOf('ID Soal');
  var colNomor = header.indexOf('Nomor');
  var colTipe = header.indexOf('Tipe');
  var colIndikator = header.indexOf('Indikator');
  var colSub = header.indexOf('Submateri');
  var colSoal = header.indexOf('Pertanyaan');
  var colA = header.indexOf('A');
  var colB = header.indexOf('B');
  var colC = header.indexOf('C');
  var colD = header.indexOf('D');
  var colE = header.indexOf('E');
  var colBobot = header.indexOf('Bobot');
  
  var questions = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    var tipe = String(r[colTipe] || 'pilihan_ganda').trim().toLowerCase();
    
    var opsi = [];
    if (tipe === 'pilihan_ganda') {
      if (r[colA]) opsi.push({ key: 'A', text: String(r[colA]) });
      if (r[colB]) opsi.push({ key: 'B', text: String(r[colB]) });
      if (r[colC]) opsi.push({ key: 'C', text: String(r[colC]) });
      if (r[colD]) opsi.push({ key: 'D', text: String(r[colD]) });
      if (r[colE]) opsi.push({ key: 'E', text: String(r[colE]) });
    } else if (tipe === 'benar_salah') {
      opsi = [
        { key: 'BENAR', text: 'BENAR' },
        { key: 'SALAH', text: 'SALAH' }
      ];
    }
    
    questions.push({
      id: String(r[colId] || ('Q' + i)),
      nomor: Number(r[colNomor] || i),
      tipe: tipe,
      indikator: String(r[colIndikator] || 'Umum'),
      submateri: String(r[colSub] || ''),
      pertanyaan: String(r[colSoal] || ''),
      opsi: opsi,
      bobot: Number(r[colBobot] || 5)
    });
  }
  return questions;
}

// -------------------------------------------------------------
// PENILAIAN OTOMATIS & PENCEGAHAN DUPLIKASI
// -------------------------------------------------------------

function processLKMSubmission(payload) {
  var ss = getSpreadsheet();
  var sheetHasil = ss.getSheetByName('HASIL_LKM');
  if (!sheetHasil) {
    sheetHasil = setupSheetHasil(ss);
  }
  
  var nama = payload.namaMurid;
  var kelas = payload.kelas;
  var lkmId = payload.lkmId;
  var answers = payload.jawabanMurid || {};
  
  // Baca Bank Soal lengkap (termasuk Kunci Jawaban di Backend)
  var sheetSoal = ss.getSheetByName('BANK_SOAL');
  var soalData = sheetSoal.getDataRange().getValues();
  var header = soalData[0];
  
  var colId = header.indexOf('ID Soal');
  var colNomor = header.indexOf('Nomor');
  var colTipe = header.indexOf('Tipe');
  var colSoal = header.indexOf('Pertanyaan');
  var colKunci = header.indexOf('Kunci');
  var colBobot = header.indexOf('Bobot');
  var colIndikator = header.indexOf('Indikator');
  var colPembahasan = header.indexOf('Pembahasan');
  var colSaran = header.indexOf('Saran Belajar');
  var colA = header.indexOf('A');
  var colB = header.indexOf('B');
  var colC = header.indexOf('C');
  var colD = header.indexOf('D');
  var colE = header.indexOf('E');
  
  var totalSoal = soalData.length - 1;
  var benar = 0;
  var salah = 0;
  var kosong = 0;
  var totalBobotMax = 0;
  var totalBobotDiperoleh = 0;
  
  var indicatorStats = {};
  var saranBelajarSet = {};
  var reviewItems = [];
  
  for (var i = 1; i < soalData.length; i++) {
    var row = soalData[i];
    var qId = String(row[colId] || ('Q' + i));
    var qNomor = Number(row[colNomor] || i);
    var qTipe = String(row[colTipe] || 'pilihan_ganda').trim().toLowerCase();
    var qKunci = String(row[colKunci] || '').trim().toUpperCase();
    var qBobot = Number(row[colBobot] || 5);
    var qIndikator = String(row[colIndikator] || 'Umum').trim();
    var qPembahasan = String(row[colPembahasan] || '');
    var qSaran = String(row[colSaran] || '');
    var userAns = answers[qId] ? String(answers[qId]).trim().toUpperCase() : '';
    
    totalBobotMax += qBobot;
    
    if (!indicatorStats[qIndikator]) {
      indicatorStats[qIndikator] = { indikator: qIndikator, total: 0, benar: 0, saranBelajar: qSaran };
    }
    indicatorStats[qIndikator].total++;
    
    var isBenar = false;
    var isKosong = false;
    
    if (!userAns) {
      kosong++;
      isKosong = true;
      if (qSaran) saranBelajarSet[qSaran] = true;
    } else if (userAns === qKunci) {
      benar++;
      isBenar = true;
      totalBobotDiperoleh += qBobot;
      indicatorStats[qIndikator].benar++;
    } else {
      salah++;
      if (qSaran) saranBelajarSet[qSaran] = true;
    }
    
    var opsiList = [];
    if (qTipe === 'pilihan_ganda') {
      if (row[colA]) opsiList.push({ key: 'A', text: String(row[colA]) });
      if (row[colB]) opsiList.push({ key: 'B', text: String(row[colB]) });
      if (row[colC]) opsiList.push({ key: 'C', text: String(row[colC]) });
      if (row[colD]) opsiList.push({ key: 'D', text: String(row[colD]) });
      if (row[colE]) opsiList.push({ key: 'E', text: String(row[colE]) });
    }
    
    reviewItems.push({
      id: qId,
      nomor: qNomor,
      pertanyaan: String(row[colSoal] || ''),
      tipe: qTipe,
      jawabanMurid: userAns || '(Tidak dijawab)',
      kunciJawaban: qKunci,
      isBenar: isBenar,
      isKosong: isKosong,
      indikator: qIndikator,
      pembahasan: qPembahasan,
      opsi: opsiList
    });
  }
  
  // Hitung Nilai Akhir (0 - 100)
  var nilaiAkhir = totalBobotMax > 0 ? Math.round((totalBobotDiperoleh / totalBobotMax) * 100) : 0;
  
  // Kategori & Umpan Balik Otomatis
  var feedbackData = getFeedbackCategory(ss, nilaiAkhir);
  
  var idSubmission = 'SUB-' + Utilities.formatDate(new Date(), 'GMT+8', 'yyyyMMdd-HHmmss') + '-' + Math.floor(100 + Math.random() * 900);
  var tglStr = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd');
  var jamStr = Utilities.formatDate(new Date(), 'GMT+8', 'HH:mm:ss');
  
  var indikatorLemah = [];
  var analisisArray = [];
  for (var ind in indicatorStats) {
    analisisArray.push(indicatorStats[ind]);
    if (indicatorStats[ind].benar < indicatorStats[ind].total) {
      indikatorLemah.push(ind + ' (' + indicatorStats[ind].benar + '/' + indicatorStats[ind].total + ')');
    }
  }
  
  // Simpan baris ke HASIL_LKM
  sheetHasil.appendRow([
    idSubmission,
    tglStr,
    jamStr,
    kelas,
    payload.nis || '',
    nama,
    lkmId,
    payload.materi || 'Kebugaran Jasmani',
    totalSoal,
    benar,
    salah,
    kosong,
    nilaiAkhir,
    feedbackData.kategori,
    indikatorLemah.join(', '),
    feedbackData.teks,
    JSON.stringify(answers),
    'Selesai'
  ]);
  
  var saranBelajarList = Object.keys(saranBelajarSet);
  var rekomendasiTindakLanjut = [];
  if (nilaiAkhir >= 90) {
    rekomendasiTindakLanjut = [
      'Kerjakan kegiatan pengayaan materi penyusunan program kebugaran mandiri.',
      'Terapkan variasi circuit training dalam latihan mandiri atau tim olahraga.',
      'Bantu rekan sekelas melalui tutor sebaya yang positif.'
    ];
  } else if (nilaiAkhir >= 80) {
    rekomendasiTindakLanjut = [
      'Pelajari kembali pembahasan pada butir soal yang dijawab salah.',
      'Tingkatkan ketelitian dalam memahami istilah dan kaidah latihan fisik.'
    ];
  } else if (nilaiAkhir >= 70) {
    rekomendasiTindakLanjut = [
      'Fokuskan belajar mandiri pada indikator yang masih kurang maksimal.',
      'Diskusikan konsep pos latihan sirkuit bersama kelompok belajar.'
    ];
  } else {
    rekomendasiTindakLanjut = [
      'Pelajari kembali ringkasan materi dan modul dasar kebugaran jasmani.',
      'Konsultasikan kesulitan belajar langsung dengan Pak Guru Agus Nova.',
      'Kerjakan latihan formatif ulang setelah penguatan konsep.'
    ];
  }
  
  return {
    success: true,
    id: idSubmission,
    tanggal: tglStr,
    waktuPengerjaan: jamStr,
    namaMurid: nama,
    kelas: kelas,
    nis: payload.nis || '',
    lkmId: lkmId,
    materi: payload.materi || 'Aktivitas Kebugaran Jasmani',
    totalSoal: totalSoal,
    benar: benar,
    salah: salah,
    kosong: kosong,
    persentaseBenar: totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0,
    nilaiAkhir: nilaiAkhir,
    kategori: feedbackData.kategori,
    umpanBalik: feedbackData.teks,
    analisisIndikator: analisisArray,
    saranBelajarList: saranBelajarList,
    rekomendasiTindakLanjut: rekomendasiTindakLanjut,
    reviewQuestions: reviewItems,
    statusPenilaian: 'selesai'
  };
}

function getFeedbackCategory(ss, nilai) {
  var sheet = ss.getSheetByName('PENGATURAN_FEEDBACK');
  if (sheet) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var min = Number(data[i][0]);
      var max = Number(data[i][1]);
      if (nilai >= min && nilai <= max) {
        return {
          kategori: String(data[i][2]),
          arah: String(data[i][3]),
          teks: String(data[i][4])
        };
      }
    }
  }
  
  if (nilai >= 90) return {
    kategori: 'Sangat Baik',
    teks: 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi kebugaran jasmani. Pertahankan pencapaian ini!'
  };
  if (nilai >= 80) return {
    kategori: 'Baik',
    teks: 'Bagus! Kamu sudah memahami sebagian besar materi dengan baik. Tingkatkan ketelitian dalam menjawab soal.'
  };
  if (nilai >= 70) return {
    kategori: 'Cukup Baik',
    teks: 'Kamu sudah menunjukkan pemahaman yang cukup baik. Masih ada beberapa konsep yang perlu dipelajari kembali.'
  };
  if (nilai >= 60) return {
    kategori: 'Perlu Peningkatan',
    teks: 'Terima kasih atas usahamu. Bacalah kembali modul pembelajaran dan perkuat konsep latihan dasar.'
  };
  return {
    kategori: 'Perlu Pendampingan',
    teks: 'Terima kasih atas usahamu. Jangan ragu berkonsultasi dengan guru PJOK (Pak Agus Nova) dan terus berlatih secara teratur.'
  };
}

function saveStudentReflection(payload) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('REFLEKSI_MURID');
  if (!sheet) {
    sheet = ss.insertSheet('REFLEKSI_MURID');
    sheet.appendRow([
      'ID Pengerjaan', 'Waktu Simpan', 'Nama Murid', 'Kelas', 'Materi LKM',
      'Hal Baru Dipahami', 'Materi Masih Sulit', 'Penyebab Kesulitan', 'Rencana Perbaikan'
    ]);
  }
  
  sheet.appendRow([
    payload.submissionId || '',
    Utilities.formatDate(new Date(), 'GMT+8', 'yyyy-MM-dd HH:mm:ss'),
    payload.namaMurid || '',
    payload.kelas || '',
    payload.materi || '',
    payload.q1 || '',
    payload.q2 || '',
    payload.q3 || '',
    payload.q4 || ''
  ]);
  
  return { success: true, message: 'Refleksi berhasil disimpan ke Spreadsheet.' };
}

function setupSheetHasil(ss) {
  var s = ss.insertSheet('HASIL_LKM');
  s.appendRow([
    'ID Pengerjaan', 'Tanggal', 'Waktu', 'Kelas', 'NIS', 'Nama Murid', 'ID LKM', 'Materi',
    'Total Soal', 'Benar', 'Salah', 'Kosong', 'Nilai Akhir', 'Kategori', 'Indikator Lemah',
    'Umpan Balik', 'Jawaban Detail', 'Status'
  ]);
  return s;
}
`;
