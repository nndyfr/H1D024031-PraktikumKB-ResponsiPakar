# AnemiaExpert (Sistem Pakar Diagnosa Anemia pada Perempuan Usia Produktif)
Sistem pakar berbasis web untuk mendiagnosa jenis anemia pada perempuan usia produktif menggunakan metode inferensi Forward Chaining.

---

## Identitas Mahasiswa

| Keterangan | Detail |
|---|---|
| Nama | Nindya Alif Romland |
| NIM | H1D024031 |
| Shift KRS | A |
| Shift Baru | F |
| Program Studi | Informatika |
| Fakultas | Fakultas Teknik, Universitas Jenderal Soedirman |
| Mata Kuliah | Praktikum Kecerdasan Buatan |

---

## Deskripsi Proyek

AnemiaExpert adalah sistem pakar diagnosa anemia berbasis web yang berjalan sepenuhnya di browser tanpa memerlukan server atau instalasi tambahan. Sistem mengajukan 18 pertanyaan seputar gejala klinis kepada pengguna, lalu memprosesnya menggunakan mesin inferensi Forward Chaining dengan 16 aturan produksi untuk menghasilkan diagnosa jenis anemia yang paling sesuai.

Output sistem berupa salah satu dari empat jenis anemia, atau tidak terindikasi anemia disertai skor kesesuaian tiap diagnosa dan rekomendasi penanganan awal. Sistem ini bersifat indikatif dan tidak menggantikan diagnosis tenaga medis profesional.

---

## Fitur Utama

- Input interaktif berupa 18 pertanyaan gejala dengan jawaban Ya/Tidak (dapat dijawab via klik atau keyboard)
- Navigasi maju-mundur antar pertanyaan tanpa kehilangan jawaban sebelumnya
- Mesin forward chaining lengkap dengan evaluasi 16 aturan produksi berbobot
- Visualisasi skor kesesuaian semua diagnosa dalam bentuk progress bar
- Rekomendasi penanganan awal yang spesifik per jenis anemia
- Progress bar pertanyaan real-time selama sesi diagnosis
- Reset dan analisis ulang tanpa reload halaman
- Antarmuka responsif, berjalan 100% di sisi klien (pure HTML/CSS/JS)

---

## Basis Pengetahuan

### Gejala (10 Gejala)

| Kode | Pertanyaan Gejala |
|---|---|
| G01 | Mudah lelah atau lemas meskipun tidak banyak beraktivitas |
| G02 | Wajah, kuku, atau kelopak mata terlihat pucat |
| G06 | Rambut rontok lebih banyak dari biasanya |
| G07 | Kuku rapuh, mudah patah, atau berbentuk cekung seperti sendok |
| G11 | Kesemutan atau mati rasa di tangan atau kaki |
| G12 | Gangguan daya ingat atau mudah lupa |
| G15 | Keluhan sudah berlangsung lebih dari satu bulan |
| G16 | Riwayat penyakit kronis (diabetes, lupus, TBC, gangguan ginjal) |
| G19 | Urin pernah berwarna gelap seperti teh atau kecokelatan |
| G22 | Menstruasi sangat banyak atau berlangsung lebih dari 7 hari |

### Diagnosa (5 Output)

| Kode | Nama | Deskripsi Singkat |
|---|---|---|
| ADB | Anemia Defisiensi Besi | Kekurangan zat besi untuk produksi hemoglobin; paling umum pada perempuan usia produktif |
| ADF | Anemia Defisiensi Folat/B12 | Kekurangan asam folat atau vitamin B12 untuk pembentukan sel darah merah normal |
| APK | Anemia Penyakit Kronis | Anemia sekunder akibat penyakit kronis seperti infeksi, autoimun, diabetes, atau ginjal |
| AHA | Anemia Hemolitik | Sel darah merah dihancurkan lebih cepat dari kemampuan tubuh memproduksinya |
| TIDAK | Tidak Terindikasi Anemia | Tidak ditemukan indikasi kuat ke arah anemia berdasarkan gejala yang dilaporkan |

### Aturan Produksi (19 Aturan Forward Chaining)

Setiap aturan memiliki bobot kekuatan: **3 = kuat**, **2 = sedang**, **1 = lemah**.

**Anemia Defisiensi Besi (ADB)**

| ID | Kondisi (Gejala Harus YA) | Bobot |
|---|---|---|
| R01 | G01, G02, G06, G07 | 3 |
| R02 | G01, G02, G22 | 3 |
| R03 | G07, G06, G02 | 2 |
| R04 | G01, G22, G06 | 2 |
| R05 | G02, G07, G22 | 2 |

**Anemia Defisiensi Folat/B12 (ADF)**

| ID | Kondisi (Gejala Harus YA) | Bobot |
|---|---|---|
| R06 | G11, G12, G01 | 3 |
| R07 | G11, G12, G02 | 3 |
| R08 | G01, G02, G11, G12 | 3 |
| R09 | G12, G11, G15 | 2 |
| R10 | G12, G01, G15 | 1 |

**Anemia Penyakit Kronis (APK)**

| ID | Kondisi (Gejala Harus YA) | Bobot |
|---|---|---|
| R11 | G16, G15, G01, G02 | 3 |
| R12 | G16, G15, G01 | 3 |
| R13 | G16, G02, G15 | 2 |
| R14 | G16, G01, G12 | 2 |

**Anemia Hemolitik (AHA)**

| ID | Kondisi (Gejala Harus YA) | Bobot |
|---|---|---|
| R15 | G19, G01 | 3 |
| R16 | G19, G02 | 3 |
| R17 | G19, G01, G02 | 3 |
| R18 | G19, G15, G01 | 2 |
| R19 | G19, G11, G02 | 2 |

Operator AND menggunakan evaluasi semua kondisi harus terpenuhi. Diagnosa ditentukan berdasarkan akumulasi bobot aturan yang terpenuhi tertinggi.

---

## Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| HTML5 | Struktur antarmuka |
| CSS3 | Styling dan animasi (custom properties, flexbox, grid) |
| Vanilla JavaScript (ES6+) | Mesin forward chaining dan logika interaksi |
| Google Fonts | Tipografi (DM Serif Display, DM Sans) |

Tidak menggunakan framework atau library eksternal apapun — seluruh logika forward chaining diimplementasikan secara manual dalam `script.js`.

---

## Instalasi Lokal

Proyek ini tidak memerlukan instalasi atau server karena berjalan sepenuhnya di browser.

**Langkah menjalankan:**

```bash
# 1. Clone atau extract repository
git clone <url-repo>
cd "Sistem-Pakar-Anemia"

# 2. Buka langsung di browser
# Klik dua kali file index.html, atau:
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Tidak diperlukan `npm install`, `pip install`, atau konfigurasi apapun.

---


## Struktur Folder

```
Sistem-Pakar-Anemia/
├── index.html        # Halaman utama antarmuka sistem (3 layar: landing, quiz, hasil)
├── style.css         # Seluruh styling dan layout
├── script.js         # Logika navigasi, sesi diagnosis, dan rendering hasil
└── kb/
    ├── gejala.js     # Basis pengetahuan: daftar 18 gejala
    ├── rules.js      # Basis aturan: 16 aturan forward chaining + data diagnosa
    └── engine.js     # Mesin inferensi forward chaining
```

---

## Disclaimer

Hasil analisis AnemiaExpert bersifat indikatif dan tidak menggantikan diagnosis dokter. Selalu konsultasikan kondisi kesehatan Anda kepada tenaga medis profesional.