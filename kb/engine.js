// kb/engine.js
// Mesin inferensi Forward Chaining

function forwardChaining(jawaban) {
  // jawaban = { G01: true, G02: false, ... }

  const skor = { ADB: 0, ADF: 0, APK: 0, AHA: 0 };
  const rulesTerpenuhi = [];

  for (const rule of RULES) {
    const terpenuhi = rule.kondisi.every(id => jawaban[id] === true);
    if (terpenuhi) {
      skor[rule.kesimpulan] += rule.bobot;
      rulesTerpenuhi.push(rule.id);
    }
  }

  // Cari diagnosa dengan skor tertinggi
  const skorMax = Math.max(...Object.values(skor));

  if (skorMax === 0) {
    return {
      diagnosa: DIAGNOSA['TIDAK'],
      skor,
      rulesTerpenuhi,
      gejalaDitemukan: Object.keys(jawaban).filter(k => jawaban[k]),
    };
  }

  // Jika ada seri, pilih urutan prioritas: AHA > APK > ADF > ADB
  const prioritas = ['AHA', 'APK', 'ADF', 'ADB'];
  let diagnosaKode = null;
  for (const kode of prioritas) {
    if (skor[kode] === skorMax) { diagnosaKode = kode; break; }
  }

  return {
    diagnosa: DIAGNOSA[diagnosaKode],
    skor,
    rulesTerpenuhi,
    gejalaDitemukan: Object.keys(jawaban).filter(k => jawaban[k]),
  };
}