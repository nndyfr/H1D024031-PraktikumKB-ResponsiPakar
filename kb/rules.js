// Basis aturan IF-THEN untuk forward chaining
// Setiap rule: kondisi (array gejala yang harus YA) → kesimpulan (jenis anemia) + bobot kekuatan

const DIAGNOSA = {
  ADB: {
    kode: 'ADB',
    nama: 'Anemia Defisiensi Besi',
    deskripsi: 'Jenis anemia paling umum pada perempuan usia produktif. Terjadi akibat kekurangan zat besi yang dibutuhkan tubuh untuk memproduksi hemoglobin.',
    rekomendasi: [
      'Konsumsi suplemen zat besi (Ferro Sulfat / Sangobion) sesuai anjuran dokter',
      'Perbanyak makanan sumber zat besi: daging merah, hati ayam, bayam, kacang hijau, tempe',
      'Konsumsi vitamin C bersamaan untuk meningkatkan penyerapan zat besi',
      'Hindari minum teh, kopi, atau susu bersamaan waktu makan',
      'Segera periksa ke puskesmas atau klinik untuk cek darah lengkap (Hb, ferritin, MCV)',
      'Jika sedang menstruasi banyak, konsultasikan ke dokter kandungan',
    ],
    warna: '#e74c3c',
    emoji: '🩸',
  },
  ADF: {
    kode: 'ADF',
    nama: 'Anemia Defisiensi Folat / Vitamin B12',
    deskripsi: 'Terjadi akibat kekurangan asam folat atau vitamin B12 yang dibutuhkan untuk pembentukan sel darah merah yang normal dan fungsi sistem saraf.',
    rekomendasi: [
      'Konsumsi suplemen asam folat (400–800 mcg/hari) dan/atau vitamin B12',
      'Perbanyak makanan sumber folat: bayam, brokoli, kacang-kacangan, hati, alpukat',
      'Perbanyak makanan sumber B12: daging, ikan, telur, susu, produk olahan susu',
      'Jika vegetarian/vegan, wajib konsultasi dokter untuk suplementasi B12',
      'Periksa kadar folat dan B12 serum ke laboratorium klinik',
      'Ibu hamil wajib konsumsi folat sejak sebelum kehamilan',
    ],
    warna: '#8e44ad',
    emoji: '💊',
  },
  APK: {
    kode: 'APK',
    nama: 'Anemia Penyakit Kronis',
    deskripsi: 'Anemia yang muncul sebagai akibat dari penyakit kronis yang sudah diderita sebelumnya, seperti infeksi jangka panjang, penyakit autoimun, diabetes, atau penyakit ginjal.',
    rekomendasi: [
      'Prioritaskan pengobatan penyakit kronis yang mendasari terlebih dahulu',
      'Konsultasi ke dokter spesialis sesuai penyakit penyebab (internist, nefrologi, reumatologi)',
      'Pantau kadar hemoglobin secara berkala (minimal 3 bulan sekali)',
      'JANGAN konsumsi suplemen zat besi tanpa anjuran dokter pada kondisi ini',
      'Terapkan pola hidup sehat: istirahat cukup, hindari stres berlebihan, gizi seimbang',
      'Catat dan laporkan semua obat yang dikonsumsi ke dokter',
    ],
    warna: '#e67e22',
    emoji: '⚕️',
  },
  AHA: {
    kode: 'AHA',
    nama: 'Anemia Hemolitik',
    deskripsi: 'Terjadi ketika sel darah merah dihancurkan lebih cepat dari kemampuan tubuh memproduksinya. Bisa bersifat bawaan (genetik) atau didapat karena faktor tertentu.',
    rekomendasi: [
      'SEGERA ke dokter atau IGD jika urin gelap dan kulit tampak kuning',
      'Jangan menunda pemeriksaan — anemia hemolitik bisa memburuk dengan cepat',
      'Informasikan riwayat keluarga dengan kelainan darah kepada dokter',
      'Hindari obat-obatan yang bisa memicu hemolisis tanpa konsultasi dokter (aspirin dosis tinggi, beberapa antibiotik)',
      'Pemeriksaan yang mungkin diperlukan: hitung retikulosit, bilirubin, LDH, tes Coombs',
      'Kemungkinan memerlukan transfusi darah jika kondisi berat',
    ],
    warna: '#c0392b',
    emoji: '🚨',
  },
  TIDAK: {
    kode: 'TIDAK',
    nama: 'Tidak Terindikasi Anemia',
    deskripsi: 'Berdasarkan gejala yang dilaporkan, tidak ditemukan indikasi kuat ke arah anemia. Namun kondisi ini bersifat indikatif dan perlu dikonfirmasi dengan pemeriksaan laboratorium.',
    rekomendasi: [
      'Pertahankan pola makan bergizi seimbang dengan cukup zat besi, folat, dan vitamin B12',
      'Lakukan pemeriksaan darah rutin minimal 1 tahun sekali',
      'Jika gejala baru muncul atau memburuk, segera periksakan ke dokter',
      'Jaga hidrasi dan pola tidur yang cukup',
      'Tetap aktif bergerak dan kelola stres dengan baik',
    ],
    warna: '#27ae60',
    emoji: '✅',
  },
};

// kondisi: gejala yang harus dijawab YA agar rule terpenuhi
// bobot: kekuatan kesimpulan (3=kuat, 2=sedang, 1=lemah)
const RULES = [
  // ANEMIA DEFISIENSI BESI (ADB) 
  { id: 'R01', kondisi: ['G01', 'G02', 'G06', 'G07'], kesimpulan: 'ADB', bobot: 3 },
  { id: 'R02', kondisi: ['G01', 'G02', 'G09'],        kesimpulan: 'ADB', bobot: 3 },
  { id: 'R03', kondisi: ['G07', 'G08', 'G10'],        kesimpulan: 'ADB', bobot: 3 },
  { id: 'R04', kondisi: ['G01', 'G02', 'G22'],        kesimpulan: 'ADB', bobot: 2 },
  { id: 'R07', kondisi: ['G06', 'G10', 'G02'],        kesimpulan: 'ADB', bobot: 2 },

  // ANEMIA DEFISIENSI FOLAT / B12 (ADF)
  { id: 'R09', kondisi: ['G11', 'G12', 'G13'],        kesimpulan: 'ADF', bobot: 3 },
  { id: 'R10', kondisi: ['G08', 'G13', 'G11'],        kesimpulan: 'ADF', bobot: 3 },
  { id: 'R11', kondisi: ['G01', 'G02', 'G11', 'G14'], kesimpulan: 'ADF', bobot: 2 },
  { id: 'R13', kondisi: ['G12', 'G14', 'G01'],        kesimpulan: 'ADF', bobot: 1 },

  // ANEMIA PENYAKIT KRONIS (APK)
  { id: 'R14', kondisi: ['G16', 'G15', 'G01', 'G02'], kesimpulan: 'APK', bobot: 3 },
  { id: 'R15', kondisi: ['G16', 'G17', 'G02'],        kesimpulan: 'APK', bobot: 3 },
  { id: 'R17', kondisi: ['G16', 'G01', 'G15'],        kesimpulan: 'APK', bobot: 2 },

  // ANEMIA HEMOLITIK (AHA)
  { id: 'R18', kondisi: ['G19', 'G20'],               kesimpulan: 'AHA', bobot: 3 },
  { id: 'R19', kondisi: ['G19', 'G17', 'G02'],        kesimpulan: 'AHA', bobot: 3 },
  { id: 'R20', kondisi: ['G21', 'G01', 'G02', 'G17'], kesimpulan: 'AHA', bobot: 2 },
  { id: 'R21', kondisi: ['G21', 'G19'],               kesimpulan: 'AHA', bobot: 2 },
];