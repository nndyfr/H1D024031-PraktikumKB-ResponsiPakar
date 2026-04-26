let currentIdx = 0;
let jawaban = {};

// Navigasi layar
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function mulaiDiagnosa() {
  currentIdx = 0;
  jawaban = {};
  updateProgress();
  tampilkanGejala(0, false);
  showScreen('screen-quiz');
}

function kembaliLanding() {
  showScreen('screen-landing');
}

function ulangi() {
  showScreen('screen-landing');
}

// Progres bar
function updateProgress() {
  const pct = (currentIdx / GEJALA.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('quiz-counter').textContent = (currentIdx + 1) + ' / ' + GEJALA.length;
}

// Tampilan pertanyaan
function tampilkanGejala(idx, animate) {
  const card = document.getElementById('question-card');

  const render = () => {
    const g = GEJALA[idx];
    document.getElementById('q-id').textContent = g.id;
    document.getElementById('q-teks').textContent = g.teks;

    // reset state tombol
    document.getElementById('btn-ya').classList.remove('selected');
    document.getElementById('btn-tidak').classList.remove('selected');
    if (jawaban[g.id] === true)  document.getElementById('btn-ya').classList.add('selected');
    if (jawaban[g.id] === false) document.getElementById('btn-tidak').classList.add('selected');

    // tombol prev
    document.getElementById('btn-prev').style.visibility = idx > 0 ? 'visible' : 'hidden';

    if (animate) {
      card.classList.remove('q-out');
      card.classList.add('q-in');
    }
  };

  if (animate) {
    card.classList.add('q-out');
    setTimeout(render, 190);
  } else {
    render();
  }
}

// Jawab Ya / Tidak 
function jawab(nilai) {
  const g = GEJALA[currentIdx];
  jawaban[g.id] = nilai;

  document.getElementById('btn-ya').classList.toggle('selected', nilai === true);
  document.getElementById('btn-tidak').classList.toggle('selected', nilai === false);

  setTimeout(() => {
    if (currentIdx < GEJALA.length - 1) {
      currentIdx++;
      updateProgress();
      tampilkanGejala(currentIdx, true);
    } else {
      // Selesai update progress ke 100% dulu
      document.getElementById('progress-fill').style.width = '100%';
      setTimeout(tampilkanHasil, 300);
    }
  }, 320);
}

// Kembali ke pertanyaan sebelumnya 
function prevGejala() {
  if (currentIdx > 0) {
    currentIdx--;
    updateProgress();
    tampilkanGejala(currentIdx, true);
  }
}

// Tampilkan hasil 
function tampilkanHasil() {
  const hasil = forwardChaining(jawaban);
  const { diagnosa, skor, rulesTerpenuhi, gejalaDitemukan } = hasil;

  // Header
  document.getElementById('res-emoji').textContent = diagnosa.emoji;
  document.getElementById('res-kode').textContent  = diagnosa.kode;
  document.getElementById('res-nama').textContent  = diagnosa.nama;
  document.getElementById('res-desc').textContent  = diagnosa.deskripsi;

  // Warna 
  document.getElementById('screen-hasil').style.setProperty('--aksen', diagnosa.warna);

  // Statistik
  document.getElementById('stat-ya').textContent    = gejalaDitemukan.length;
  document.getElementById('stat-tidak').textContent = GEJALA.length - gejalaDitemukan.length;
  document.getElementById('stat-rules').textContent = rulesTerpenuhi.length;

  // Skor bars
  const maxSkor = Math.max(...Object.values(skor), 1);
  const urutan  = ['ADB', 'ADF', 'APK', 'AHA'];
  const skorEl  = document.getElementById('skor-list');
  skorEl.innerHTML = '';
  for (const kode of urutan) {
    const val  = skor[kode];
    const pct  = Math.round((val / maxSkor) * 100);
    const aktif = kode === diagnosa.kode ? 'aktif' : '';
    const d     = DIAGNOSA[kode];
    skorEl.innerHTML += `
      <div class="skor-item ${aktif}">
        <div class="skor-lbl">${d.nama}</div>
        <div class="skor-bar-track">
          <div class="skor-bar-fill" style="width:0%;background:${d.warna}" data-target="${pct}"></div>
        </div>
        <div class="skor-val">${val} poin</div>
      </div>`;
  }

  // Rekomendasi
  const rekEl = document.getElementById('rek-list');
  rekEl.innerHTML = diagnosa.rekomendasi
    .map((r, i) => `
      <li class="rek-item" style="animation-delay:${i * 0.07}s">
        <span class="rek-num">${String(i + 1).padStart(2, '0')}</span>
        ${r}
      </li>`)
    .join('');

  // Disclaimer + tombol ulangi di kolom skor
  const skorCol = document.querySelector('.skor-col');
  // Hapus disclaimer lama kalau ada
  const old = skorCol.querySelector('.disclaimer-inline');
  if (old) old.remove();
  const oldBtn = skorCol.querySelector('.btn-ulangi-inline');
  if (oldBtn) oldBtn.remove();

  skorCol.insertAdjacentHTML('beforeend', `
    <div class="disclaimer-inline">
      ⚠ Hasil ini bersifat indikatif dan tidak menggantikan diagnosis dokter. Segera konsultasikan kondisi Anda ke tenaga medis profesional.
    </div>
    <button class="btn-ulangi-inline" onclick="ulangi()">↺ Ulangi Diagnosa</button>
  `);

  showScreen('screen-hasil');

  // Animasi bar setelah render
  setTimeout(() => {
    document.querySelectorAll('.skor-bar-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 100);
}

// Keyboard shortcut 
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-quiz').classList.contains('hidden')) {
    if (e.key === 'y' || e.key === 'Y') jawab(true);
    if (e.key === 'n' || e.key === 'N') jawab(false);
    if (e.key === 'ArrowLeft' || e.key === 'Backspace') prevGejala();
  }
});