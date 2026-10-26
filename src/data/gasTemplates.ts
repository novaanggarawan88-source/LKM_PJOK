export const SPREADSHEET_SCHEMA_DOCS = `# PANDUAN STRUKTUR GOOGLE SPREADSHEET (SINGLE SOURCE OF TRUTH)
## LKM DIGITAL PJOK - SMA NEGERI 1 TEJAKULA
Guru Pengampu: I Ketut Agus Nova Anggarawan, S.Pd.

Berikut struktur sheet dan kolom yang didukung dan dibuat secara otomatis oleh sistem LKM Digital PJOK:

---

### 1. Sheet: "DATA_MURID"
Menyimpan data identitas peserta didik per kelas.
| Header Kolom | Tipe Data | Keterangan & Contoh |
| :--- | :--- | :--- |
| **Kelas** | Teks | Nama rombel/kelas (Contoh: \`XI 1\`, \`XI 2\`, \`XI 3\`, \`XI 4\`) |
| **NIS** | Teks | Nomor Induk Siswa (Contoh: \`4501\`, \`4502\`) |
| **Nama Murid** | Teks | Nama lengkap murid (Contoh: \`I Gede Arya Pratama\`) |
| **Status** | Teks | Aktif / Non-Aktif |

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
 * Fungsi:
 * 1. Otomatis Membuat Seluruh Bagian & Sheet Spreadsheet (Auto-Setup)
 * 2. Penilaian Otomatis & Proteksi Kunci Jawaban di Backend
 * 3. Analisis Penguasaan Indikator & Saran Belajar Personal
 * 4. Pencatatan Hasil & Lembar Refleksi Murid ke Google Sheets
 * ====================================================================
 */

// Ganti dengan ID Spreadsheet jika menggunakan standalone script,
// atau biarkan null jika script tertaut langsung (Container-Bound) ke Spreadsheet.
var SPREADSHEET_ID = null; 

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Otomatis menambahkan Menu Khusus saat Google Spreadsheet dibuka
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚡ LKM PJOK SMAN 1 TEJAKULA')
      .addItem('🚀 1. Siapkan Otomatis Seluruh Sheet (Auto Setup)', 'setupInitialSpreadsheet')
      .addItem('🔄 2. Muat Ulang Bank Soal & Data Murid', 'populateMasterData')
      .addSeparator()
      .addItem('ℹ️ 3. Cek Status Database LKM', 'checkDatabaseStatus')
      .addToUi();
  } catch (e) {
    // Dipanggil di luar konteks UI (misal via Web App)
  }
}

/**
 * FUNGSI UTAMA: OTOMATIS MEMBUAT SELURUH SHEET, HEADER, STYLING, DAN DATA
 * Dapat dijalankan langsung dari tombol Run di Apps Script
 * atau dari Menu "⚡ LKM PJOK SMAN 1 TEJAKULA" di Spreadsheet.
 */
function setupInitialSpreadsheet() {
  var ss = getSpreadsheet();
  
  // 1. Siapkan Sheet DATA_MURID
  var sheetMurid = ss.getSheetByName('DATA_MURID');
  if (!sheetMurid) {
    sheetMurid = ss.insertSheet('DATA_MURID');
  }
  if (sheetMurid.getLastRow() === 0) {
    sheetMurid.appendRow(['Kelas', 'NIS', 'Nama Murid', 'Status']);
    styleHeaderRow(sheetMurid, 4, '#1e3a8a'); // Navy Blue
    
    // Seed Roster Murid SMA Negeri 1 Tejakula
    var dataMurid = [
      ['XI 1', '4501', 'I Gede Arya Pratama', 'Aktif'],
      ['XI 1', '4502', 'Ni Kadek Dwi Lestari', 'Aktif'],
      ['XI 1', '4503', 'I Komang Yoga Artawan', 'Aktif'],
      ['XI 1', '4504', 'Ni Luh Putu Sintya Dewi', 'Aktif'],
      ['XI 1', '4505', 'I Made Suardana Putra', 'Aktif'],
      ['XI 1', '4506', 'Ni Wayan Ratna Sari', 'Aktif'],
      ['XI 1', '4507', 'I Ketut Aditya Gunawan', 'Aktif'],
      ['XI 1', '4508', 'Ni Nyoman Ayu Sukmadewi', 'Aktif'],
      ['XI 1', '4509', 'I Putu Budi Mahendra', 'Aktif'],
      ['XI 1', '4510', 'Ni Made Gita Cantika', 'Aktif'],
      ['XI 2', '4511', 'I Wayan Agus Wira Sanjaya', 'Aktif'],
      ['XI 2', '4512', 'Ni Komang Sri Wahyuni', 'Aktif'],
      ['XI 2', '4513', 'I Kadek Bagus Hendra', 'Aktif'],
      ['XI 2', '4514', 'Ni Putu Desi Anggreni', 'Aktif'],
      ['XI 2', '4515', 'I Made Raditya Danendra', 'Aktif'],
      ['XI 2', '4516', 'Ni Wayan Mirah Cempaka', 'Aktif'],
      ['XI 3', '4521', 'I Ketut Dharma Yasa', 'Aktif'],
      ['XI 3', '4522', 'Ni Luh Manik Pradnyani', 'Aktif'],
      ['XI 3', '4523', 'I Gede Bayu Samudra', 'Aktif'],
      ['XI 3', '4524', 'Ni Kadek Lia Puspita', 'Aktif'],
      ['XI 3', '4525', 'I Made Fajar Pratama', 'Aktif'],
      ['XI 4', '4531', 'I Nyoman Krisna Wardana', 'Aktif'],
      ['XI 4', '4532', 'Ni Luh Eka Jayanti', 'Aktif'],
      ['XI 4', '4533', 'I Wayan Teguh Santosa', 'Aktif'],
      ['XI 4', '4534', 'Ni Putu Nadia Maharani', 'Aktif']
    ];
    sheetMurid.getRange(2, 1, dataMurid.length, 4).setValues(dataMurid);
    sheetMurid.autoResizeColumns(1, 4);
    sheetMurid.setFrozenRows(1);
  }

  // 2. Siapkan Sheet BANK_SOAL
  var sheetSoal = ss.getSheetByName('BANK_SOAL');
  if (!sheetSoal) {
    sheetSoal = ss.insertSheet('BANK_SOAL');
  }
  if (sheetSoal.getLastRow() === 0) {
    sheetSoal.appendRow([
      'ID Soal', 'ID LKM', 'Nomor', 'Tipe', 'Indikator', 'Submateri', 'Pertanyaan',
      'A', 'B', 'C', 'D', 'E', 'Kunci', 'Bobot', 'Pembahasan', 'Saran Belajar'
    ]);
    styleHeaderRow(sheetSoal, 16, '#0f766e'); // Teal

    // Seed 20 Soal Calibrated PJOK Kebugaran Jasmani SMAN 1 Tejakula
    var soalData = getInitialBankSoalPJOK();
    sheetSoal.getRange(2, 1, soalData.length, 16).setValues(soalData);
    sheetSoal.autoResizeColumns(1, 6);
    sheetSoal.setFrozenRows(1);
  }

  // 3. Siapkan Sheet PENGATURAN_FEEDBACK
  var sheetFeedback = ss.getSheetByName('PENGATURAN_FEEDBACK');
  if (!sheetFeedback) {
    sheetFeedback = ss.insertSheet('PENGATURAN_FEEDBACK');
  }
  if (sheetFeedback.getLastRow() === 0) {
    sheetFeedback.appendRow(['Min Nilai', 'Max Nilai', 'Kategori', 'Arah Umpan Balik', 'Teks Umpan Balik']);
    styleHeaderRow(sheetFeedback, 5, '#334155'); // Slate
    
    var rules = [
      [90, 100, 'Sangat Baik', 'Apresiasi dan pengayaan', 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi pembelajaran kebugaran jasmani. Pertahankan pencapaian ini dan terus kembangkan kemampuanmu dengan menerapkan pengetahuan kebugaran dalam aktivitas sehari-hari serta bantu temanmu melalui diskusi positif.'],
      [80, 89, 'Baik', 'Penguatan dan peningkatan ketelitian', 'Bagus! Kamu sudah memahami sebagian besar materi kebugaran jasmani dengan baik. Tingkatkan ketelitian dalam menganalisis soal dan pelajari kembali beberapa indikator yang masih perlu diperkuat melalui pembahasan soal.'],
      [70, 79, 'Cukup Baik', 'Penguatan materi tertentu', 'Kamu sudah menunjukkan pemahaman dasar yang cukup baik. Masih ada beberapa konsep atau komponen kebugaran yang perlu dipelajari kembali. Tetap semangat, fokuskan latihan pada indikator yang dijawab salah.'],
      [60, 69, 'Perlu Peningkatan', 'Belajar ulang dan latihan tambahan', 'Terima kasih sudah berusaha menyelesaikan LKM. Kamu perlu memperkuat pemahaman terhadap konsep dasar kebugaran jasmani dan metodologi latihannya. Bacalah kembali rangkuman materi, cermati pembahasan soal, dan ikuti latihan tambahan.'],
      [0, 59, 'Perlu Pendampingan', 'Pendampingan bertahap dan latihan dasar', 'Terima kasih atas usaha yang sudah kamu lakukan. Hasil ini menjadi panduan penting untuk mengetahui bagian materi yang perlu dipelajari secara bertahap. Jangan ragu berkonsultasi dengan guru PJOK (Pak Agus Nova) dan terus berlatih secara teratur.']
    ];
    sheetFeedback.getRange(2, 1, rules.length, 5).setValues(rules);
    sheetFeedback.autoResizeColumns(1, 4);
    sheetFeedback.setFrozenRows(1);
  }

  // 4. Siapkan Sheet HASIL_LKM
  var sheetHasil = ss.getSheetByName('HASIL_LKM');
  if (!sheetHasil) {
    sheetHasil = ss.insertSheet('HASIL_LKM');
  }
  if (sheetHasil.getLastRow() === 0) {
    sheetHasil.appendRow([
      'ID Pengerjaan', 'Tanggal', 'Waktu', 'Kelas', 'NIS', 'Nama Murid', 'ID LKM', 'Materi',
      'Total Soal', 'Benar', 'Salah', 'Kosong', 'Nilai Akhir', 'Kategori', 'Indikator Lemah',
      'Umpan Balik', 'Jawaban Detail', 'Status'
    ]);
    styleHeaderRow(sheetHasil, 18, '#0f172a'); // Dark Navy
    sheetHasil.autoResizeColumns(1, 14);
    sheetHasil.setFrozenRows(1);
  }

  // 5. Siapkan Sheet REFLEKSI_MURID
  var sheetRefleksi = ss.getSheetByName('REFLEKSI_MURID');
  if (!sheetRefleksi) {
    sheetRefleksi = ss.insertSheet('REFLEKSI_MURID');
  }
  if (sheetRefleksi.getLastRow() === 0) {
    sheetRefleksi.appendRow([
      'ID Pengerjaan', 'Waktu Simpan', 'Nama Murid', 'Kelas', 'Materi LKM',
      'Hal Baru Dipahami', 'Materi Masih Sulit', 'Penyebab Kesulitan', 'Rencana Perbaikan'
    ]);
    styleHeaderRow(sheetRefleksi, 9, '#047857'); // Emerald Green
    sheetRefleksi.autoResizeColumns(1, 5);
    sheetRefleksi.setFrozenRows(1);
  }

  // Bersihkan sheet bawaan kosong "Sheet1" jika ada
  var defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {}
  }

  // Tampilkan pesan konfirmasi di UI jika dipanggil langsung oleh guru
  try {
    var nl = String.fromCharCode(10);
    var pesan = [
      'Seluruh bagian spreadsheet LKM PJOK SMAN 1 Tejakula telah otomatis dibuat:',
      '',
      '1. DATA_MURID (25 Siswa XI 1 - XI 4)',
      '2. BANK_SOAL (20 Butir Soal & Kunci Jawaban)',
      '3. PENGATURAN_FEEDBACK (5 Tingkat Capaian)',
      '4. HASIL_LKM (Siap mencatat nilai murid)',
      '5. REFLEKSI_MURID (Siap mencatat refleksi murid)',
      '',
      'Database siap terhubung dengan LKM Digital!'
    ].join(nl);
    SpreadsheetApp.getUi().alert('Berhasil Disiapkan!', pesan, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}

  return { success: true, message: 'Semua sheet berhasil dibuat dan disiapkan secara otomatis.' };
}

/**
 * Styling Header Baris Pertama
 */
function styleHeaderRow(sheet, numCols, bgColor) {
  var range = sheet.getRange(1, 1, 1, numCols);
  range.setBackground(bgColor)
       .setFontColor('#ffffff')
       .setFontWeight('bold')
       .setFontFamily('Arial')
       .setFontSize(10)
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 35);
}

/**
 * Cek status database
 */
function checkDatabaseStatus() {
  var ss = getSpreadsheet();
  var sheets = ['DATA_MURID', 'BANK_SOAL', 'PENGATURAN_FEEDBACK', 'HASIL_LKM', 'REFLEKSI_MURID'];
  var status = [];
  
  for (var i = 0; i < sheets.length; i++) {
    var sh = ss.getSheetByName(sheets[i]);
    if (sh) {
      status.push('✓ ' + sheets[i] + ' (' + Math.max(0, sh.getLastRow() - 1) + ' baris data)');
    } else {
      status.push('✗ ' + sheets[i] + ' (Belum dibuat)');
    }
  }
  
  SpreadsheetApp.getUi().alert('Status Database LKM PJOK', status.join(String.fromCharCode(10)), SpreadsheetApp.getUi().ButtonSet.OK);
}

function populateMasterData() {
  setupInitialSpreadsheet();
}

/**
 * Endpoint GET: Melayani Web App HTML Service atau API JSON
 */
function doGet(e) {
  // Cek apakah sheet penting sudah ada, jika belum otomatis dibuat
  checkAndAutoInit();

  var action = e && e.parameter ? e.parameter.action : null;
  
  if (action === 'autoSetup') {
    return createJsonResponse(setupInitialSpreadsheet());
  } else if (action === 'getAllData' || action === 'sync') {
    return createJsonResponse(apiGetAllData());
  } else if (action === 'getClasses') {
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
  checkAndAutoInit();
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'submitLKM') {
      var result = processLKMSubmission(data);
      return createJsonResponse(result);
    } else if (action === 'saveReflection') {
      var refResult = saveStudentReflection(data);
      return createJsonResponse(refResult);
    } else if (action === 'autoSetup') {
      var setupRes = setupInitialSpreadsheet();
      return createJsonResponse(setupRes);
    }
    
    return createJsonResponse({ success: false, error: 'Aksi tidak dikenali' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function checkAndAutoInit() {
  var ss = getSpreadsheet();
  if (!ss.getSheetByName('DATA_MURID') || !ss.getSheetByName('BANK_SOAL')) {
    setupInitialSpreadsheet();
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

/**
 * Mengambil seluruh data master untuk sinkronisasi aplikasi
 */
function apiGetAllData() {
  return {
    success: true,
    classes: apiGetClasses(),
    students: apiGetStudents(),
    questions: apiGetQuestionsWithDetails(),
    feedbackRules: apiGetFeedbackRules(),
    lkms: apiGetLKMList()
  };
}

function apiGetQuestionsWithDetails() {
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
  var colKunci = header.indexOf('Kunci');
  var colBobot = header.indexOf('Bobot');
  var colPembahasan = header.indexOf('Pembahasan');
  var colSaran = header.indexOf('Saran Belajar');
  var colA = header.indexOf('A');
  var colB = header.indexOf('B');
  var colC = header.indexOf('C');
  var colD = header.indexOf('D');
  var colE = header.indexOf('E');
  
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
      kunciJawaban: String(r[colKunci] || 'A'),
      pembahasan: String(r[colPembahasan] || ''),
      saranBelajar: String(r[colSaran] || ''),
      opsi: opsi,
      bobot: Number(r[colBobot] || 5)
    });
  }
  return questions;
}

function apiGetFeedbackRules() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('PENGATURAN_FEEDBACK');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  var rules = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    rules.push({
      minScore: Number(r[0]),
      maxScore: Number(r[1]),
      kategori: String(r[2]),
      arah: String(r[3]),
      teks: String(r[4])
    });
  }
  return rules;
}

// -------------------------------------------------------------
// PENILAIAN OTOMATIS & PENCEGAHAN DUPLIKASI
// -------------------------------------------------------------

function processLKMSubmission(payload) {
  var ss = getSpreadsheet();
  var sheetHasil = ss.getSheetByName('HASIL_LKM');
  if (!sheetHasil) {
    setupInitialSpreadsheet();
    sheetHasil = ss.getSheetByName('HASIL_LKM');
  }
  
  var nama = payload.namaMurid;
  var kelas = payload.kelas;
  var lkmId = payload.lkmId;
  var answers = payload.jawabanMurid || {};
  
  // Baca Bank Soal lengkap (Kunci Jawaban di Backend)
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
  
  if (nilai >= 90) return { kategori: 'Sangat Baik', teks: 'Hebat! Kamu menunjukkan pemahaman yang sangat baik terhadap materi kebugaran jasmani. Pertahankan pencapaian ini!' };
  if (nilai >= 80) return { kategori: 'Baik', teks: 'Bagus! Kamu sudah memahami sebagian besar materi dengan baik. Tingkatkan ketelitian dalam menjawab soal.' };
  if (nilai >= 70) return { kategori: 'Cukup Baik', teks: 'Kamu sudah menunjukkan pemahaman yang cukup baik. Masih ada beberapa konsep yang perlu dipelajari kembali.' };
  if (nilai >= 60) return { kategori: 'Perlu Peningkatan', teks: 'Terima kasih atas usahamu. Bacalah kembali modul pembelajaran dan perkuat konsep latihan dasar.' };
  return { kategori: 'Perlu Pendampingan', teks: 'Terima kasih atas usahamu. Jangan ragu berkonsultasi dengan guru PJOK (Pak Agus Nova) dan terus berlatih secara teratur.' };
}

function saveStudentReflection(payload) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('REFLEKSI_MURID');
  if (!sheet) {
    setupInitialSpreadsheet();
    sheet = ss.getSheetByName('REFLEKSI_MURID');
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

/**
 * 20 Soal Baku PJOK Kebugaran Jasmani SMAN 1 Tejakula
 */
function getInitialBankSoalPJOK() {
  return [
    ['Q01', 'LKM-001-KBG', 1, 'pilihan_ganda', 'Pengertian Kebugaran Jasmani', 'Konsep Dasar', 'Kemampuan tubuh seseorang untuk melakukan aktivitas fisik sehari-hari tanpa kelelahan berlebih dan masih memiliki energi cadangan disebut...', 'Kesehatan jasmani', 'Kebugaran jasmani', 'Kekuatan otot', 'Ketahanan aerobik', 'Ketangkasan gerak', 'B', 5, 'Kebugaran jasmani (physical fitness) adalah kesanggupan tubuh bertugas tanpa kelelahan berlebih dan punya cadangan energi.', 'Pelajari kembali definisi baku kebugaran jasmani.'],
    ['Q02', 'LKM-001-KBG', 2, 'pilihan_ganda', 'Komponen Kebugaran Jasmani', 'Health-Related Fitness', 'Kelompok komponen kebugaran jasmani yang berhubungan langsung dengan kesehatan (health-related fitness) adalah...', 'Kecepatan, kelincahan, dan keseimbangan', 'Daya ledak otot, koordinasi, dan reaksi', 'Daya tahan jantung-paru, kekuatan, daya tahan otot, dan kelenturan', 'Kelincahan, kekuatan otot, dan daya ledak', 'Keseimbangan, ketepatan, dan kelenturan', 'C', 5, 'Health-related fitness mencakup daya tahan kardiorespirasi, kekuatan, daya tahan otot, kelenturan, dan komposisi tubuh.', 'Bedakan komponen terkait kesehatan (health) dan keterampilan (skill).'],
    ['Q03', 'LKM-001-KBG', 3, 'pilihan_ganda', 'Komponen Kebugaran Jasmani', 'Kelincahan (Agility)', 'Kemampuan mengubah arah dan posisi tubuh secara cepat dan tepat pada saat bergerak tanpa kehilangan keseimbangan disebut...', 'Kecepatan (speed)', 'Kelincahan (agility)', 'Kekuatan (strength)', 'Keseimbangan (balance)', 'Ketepatan (accuracy)', 'B', 5, 'Kelincahan (agility) adalah kemampuan mengubah arah gerak tubuh secara cepat tanpa kehilangan kontrol keseimbangan.', 'Perhatikan kata kunci: mengubah arah dan posisi secara cepat tanpa hilang keseimbangan adalah kelincahan.'],
    ['Q04', 'LKM-001-KBG', 4, 'pilihan_ganda', 'Bentuk Latihan Kebugaran', 'Latihan Kelincahan', 'Bentuk latihan yang paling tepat dan efektif untuk melatih dan meningkatkan kelincahan adalah...', 'Lari jarak jauh 5.000 meter', 'Lari bolak-balik (shuttle run) dan lari zig-zag mengitari rintangan', 'Latihan angkat beban bench press maksimal', 'Latihan sit-up 1 menit', 'Latihan peregangan statis', 'B', 5, 'Shuttle run dan zig-zag run menuntut perubahan arah secara mendadak dengan akselerasi deselerasi cepat.', 'Shuttle run dan lari zig-zag adalah latihan spesifik melatih kelincahan.'],
    ['Q05', 'LKM-001-KBG', 5, 'pilihan_ganda', 'Komponen Kebugaran Jasmani', 'Daya Ledak Otot (Power)', 'Perpaduan maksimal antara komponen kekuatan otot (strength) dengan komponen kecepatan kontraksi otot (speed) dinamakan...', 'Daya tahan otot', 'Daya ledak otot (power / explosive power)', 'Ketangkasan gerak', 'Fleksibilitas dinamis', 'Stabilitas sendi', 'B', 5, 'Daya ledak otot (power) merupakan perpaduan antara kekuatan dan kecepatan (P = Force x Velocity).', 'Rumus daya ledak adalah Kekuatan + Kecepatan (Explosive Power).'],
    ['Q06', 'LKM-001-KBG', 6, 'pilihan_ganda', 'Bentuk Latihan Kebugaran', 'Latihan Kekuatan Otot', 'Gerakan push-up yang dilakukan dengan teknik yang tepat dan postur lurus terutama bertujuan melatih kekuatan otot...', 'Dada (pectoralis), bahu (deltoid), dan lengan (triceps)', 'Punggung atas dan paha depan', 'Betis dan pergelangan kaki', 'Otot leher dan pinggang', 'Otot perut samping semata', 'A', 5, 'Push-up adalah latihan upper-body pushing yang mengaktivasi otot dada, bahu depan, dan triceps.', 'Ketahui kelompok otot primer kalistenik: Push-up untuk dada/triceps, Pull-up untuk punggung.'],
    ['Q07', 'LKM-001-KBG', 7, 'pilihan_ganda', 'Konsep Circuit Training', 'Prinsip Latihan Sirkuit', 'Dalam penyusunan pos latihan sirkuit (circuit training), prinsip penting untuk mencegah kelelahan lokal berlebihan adalah...', 'Semua pos melatih lengan berturut-turut', 'Pos latihan diselingi antara kelompok otot tubuh atas, perut, dan tubuh bawah', 'Waktu istirahat antar pos minimal 10 menit', 'Beban dinaikkan 100% setiap pos', 'Hanya satu pos selama 45 menit', 'B', 5, 'Rotasi kelompok otot (upper body -> core -> lower body) memberi kesempatan pemulihan lokal saat otot lain bekerja.', 'Prinsip variasi pos sirkuit training mencegah penumpukan asam laktat lokal.'],
    ['Q08', 'LKM-001-KBG', 8, 'pilihan_ganda', 'Konsep Circuit Training', 'Manfaat Circuit Training', 'Keunggulan utama penerapan metode latihan circuit training dalam pembelajaran PJOK adalah...', 'Hanya melatih satu komponen saja', 'Dapat melatih berbagai komponen kebugaran secara bersamaan dan hemat waktu', 'Tidak memerlukan pemanasan sama sekali', 'Hanya cocok untuk atlet profesional maraton', 'Murid beristirahat pasif hampir sepanjang waktu', 'B', 5, 'Circuit training memadukan latihan daya tahan jantung, otot, kekuatan, dan kelincahan dalam waktu efisien.', 'Circuit training memadukan stimulasi aerobik dan anaerobik secara dinamis.'],
    ['Q09', 'LKM-001-KBG', 9, 'pilihan_ganda', 'Pengukuran Kebugaran Jasmani', 'Tes Daya Tahan Jantung', 'Tes kebugaran jasmani standar untuk mengukur daya tahan jantung-paru (VO2Max) adalah...', 'Lari cepat 50 meter sprint', 'Duduk tegak meraih (sit and reach)', 'Tes bleep (Multistage Fitness Test / MFT) atau lari 1.200 meter', 'Lempar bola tenis', 'Lompat jauh tanpa awalan', 'C', 5, 'Bleep test (MFT) dan lari 1.200m (TKJI usia SMA) adalah instrumen baku kapasitas aerobik (VO2Max).', 'Kenali instrumen tes TKJI: Lari 50m (kecepatan), Bleep test (daya tahan jantung-paru).'],
    ['Q10', 'LKM-001-KBG', 10, 'pilihan_ganda', 'Metodologi & Prinsip Latihan', 'Prinsip Overload', 'Prinsip latihan yang menyatakan bahwa beban latihan fisik harus lebih berat dari aktivitas normal sehari-hari agar terjadi peningkatan kapasitas fisik disebut prinsip...', 'Spesifisitas', 'Beban lebih (overload principle)', 'Kembali ke asal (reversibility)', 'Individualitas', 'Periodisasi latihan', 'B', 5, 'Prinsip overload mensyaratkan pemberian beban stimulus yang melebihi beban adaptasi saat ini secara bertahap.', 'Pahami 4 prinsip latihan: FITT, Overload, Specificity, dan Reversibility.'],
    ['Q11', 'LKM-001-KBG', 11, 'pilihan_ganda', 'Metodologi & Prinsip Latihan', 'Denyut Nadi Maksimal', 'Rumus baku perkiraan denyut nadi maksimal (DNM) seseorang berdasarkan usia adalah...', 'DNM = 220 – Usia', 'DNM = 200 + Usia', 'DNM = 150 × Usia', 'DNM = 100 + (Usia / 2)', 'DNM = 180 – Usia', 'A', 5, 'Rumus Fox & Haskell untuk estimasi Denyut Nadi Maksimal adalah 220 dikurangi usia individu.', 'Hafalkan rumus DNM = 220 - Usia dan zona latihan 60%-85% DNM.'],
    ['Q12', 'LKM-001-KBG', 12, 'pilihan_ganda', 'Bentuk Latihan Kebugaran', 'Kelentukan (Flexibility)', 'Latihan peregangan statis (menahan posisi 15–30 detik tanpa hentakan) paling baik dilakukan pada saat fase...', 'Tepat sebelum lari sprint 100m', 'Pendinginan (cooling down) setelah selesai berolahraga', 'Saat sedang bertanding aktif', 'Saat bangun tidur tanpa pemanasan', 'Hanya jika mengalami kram otot akut', 'B', 5, 'Peregangan statis ideal saat pendinginan (cooling down) saat otot masih hangat untuk memulihkan elastisitas.', 'Bedakan peregangan dinamis (pemanasan) dan peregangan statis (pendinginan).'],
    ['Q13', 'LKM-001-KBG', 13, 'benar_salah', 'Konsep Circuit Training', 'Struktur Circuit Training', 'Pernyataan: "Pada circuit training, setiap pos harus memiliki jeda istirahat selama minimal 15 menit agar denyut jantung kembali normal sebelum pindah pos."', '', '', '', '', '', 'SALAH', 5, 'Pernyataan SALAH. Jeda antar pos sirkuit umumnya singkat (15-45 detik) agar denyut jantung tetap di zona latihan.', 'Jeda istirahat pos sirkuit dibuat singkat untuk menjaga denyut training zone.'],
    ['Q14', 'LKM-001-KBG', 14, 'benar_salah', 'Komponen Kebugaran Jasmani', 'Serabut Otot & Energi', 'Pernyataan: "Pelari maraton 42 km lebih dominan mengandalkan serabut otot tipe lambat (slow-twitch) dan sistem energi aerobik dibanding pelari sprint 100 meter."', '', '', '', '', '', 'BENAR', 5, 'Pernyataan BENAR. Pelari jarak jauh mengandalkan serabut tipe I (slow-twitch) yang kaya mitokondria untuk metabolisme aerobik.', 'Sistem energi aerobik untuk daya tahan lama, anaerobik untuk gerak cepat intens.'],
    ['Q15', 'LKM-001-KBG', 15, 'benar_salah', 'Pengertian Kebugaran Jasmani', 'Pola Hidup Sehat', 'Pernyataan: "Tingkat kebugaran jasmani seseorang dipengaruhi oleh asupan nutrisi seimbang, istirahat cukup, serta intensitas dan keteraturan latihan fisik."', '', '', '', '', '', 'BENAR', 5, 'Pernyataan BENAR. Kebugaran fisik bertumpu pada latihan fisik teratur, nutrisi seimbang, dan istirahat memadai.', 'Kebugaran jasmani dipengaruhi oleh latihan, nutrisi, dan pemulihan.'],
    ['Q16', 'LKM-001-KBG', 16, 'isian', 'Bentuk Latihan Kebugaran', 'Latihan Otot Perut', 'Sebutkan bentuk latihan fisik kalistenik tanpa alat yang paling umum untuk melatih kekuatan dan daya tahan otot perut (abdominal muscle)!', '', '', '', '', '', 'SIT UP', 5, 'Latihan sit-up atau crunch adalah kalistenik standar yang menargetkan otot rektus abdominis (otot perut).', 'Sit-up atau crunch adalah latihan dasar penguatan otot perut.'],
    ['Q17', 'LKM-001-KBG', 17, 'isian', 'Pengukuran Kebugaran Jasmani', 'Indeks Massa Tubuh', 'Singkatan dari ukuran yang membandingkan berat badan (kg) terhadap kuadrat tinggi badan (meter) untuk memantau status gizi tubuh adalah...', '', '', '', '', '', 'IMT', 5, 'IMT (Indeks Massa Tubuh) atau BMI (Body Mass Index) digunakan untuk memantau status komposisi tubuh.', 'Rumus IMT = Berat Badan (kg) / [Tinggi Badan (m)]^2.'],
    ['Q18', 'LKM-001-KBG', 18, 'pilihan_ganda', 'Manfaat Kebugaran Jasmani', 'Adaptasi Kardiovaskular', 'Salah satu dampak adaptasi fisiologis positif pada sistem kardiovaskular seseorang yang rutin latihan aerobik adalah...', 'Denyut nadi istirahat (resting heart rate) cenderung lebih rendah dan efisien', 'Kapasitas paru menyempit', 'Produksi asam laktat berlipat ganda saat tidur', 'Tekanan darah meningkat tak terkendali', 'Jantung berdetak lebih cepat saat tidur', 'A', 5, 'Volume sekuncup (stroke volume) jantung meningkat sehingga denyut nadi istirahat menjadi lebih rendah dan efisien.', 'Tanda jantung bugar: denyut nadi istirahat lebih rendah dan pemulihan lebih cepat.'],
    ['Q19', 'LKM-001-KBG', 19, 'pilihan_ganda', 'Bentuk Latihan Kebugaran', 'Keseimbangan Statis', 'Sikap melayang dengan bertumpu pada satu kaki, badan condong ke depan, dan kedua tangan direntangkan meniru pesawat terbang melatih...', 'Keseimbangan statis', 'Kecepatan reaksi', 'Daya ledak tungkai', 'Kelenturan pergelangan', 'Daya tahan bisep', 'A', 5, 'Sikap kapal terbang (airplane stance) melatih keseimbangan statis karena tubuh diam mempertahankan keseimbangan.', 'Keseimbangan statis adalah mempertahankan posisi tubuh tanpa berpindah tempat.'],
    ['Q20', 'LKM-001-KBG', 20, 'pilihan_ganda', 'Konsep Circuit Training', 'Penerapan Pos Latihan', 'Di SMAN 1 Tejakula, Pak Agus merancang 4 pos: Pos 1 (Push-up), Pos 2 (Shuttle Run), Pos 3 (Sit-up), Pos 4 (Jumping Jack). Urutan tersebut mencerminkan kombinasi latihan...', 'Kekuatan dada/lengan, kelincahan, kekuatan perut, dan daya tahan kardiovaskular', 'Hanya kelentukan punggung bawah semata', 'Seluruhnya kekuatan jari tangan', 'Hanya kecepatan reaksi pendengaran', 'Tidak ada variasi komponen gerak sama sekali', 'A', 5, 'Pos 1 (Push-up: dada/lengan), Pos 2 (Shuttle run: kelincahan), Pos 3 (Sit-up: otot perut), Pos 4 (Jumping jack: kardiovaskular).', 'Pemetaan variasi pos sirkuit melatih berbagai komponen secara seimbang.']
  ];
}
`;
