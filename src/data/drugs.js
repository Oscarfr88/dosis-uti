// =====================================================================
// Vademécum de infusiones — concentraciones estándar EDITABLES en la UI.
//
// concentracion: { amount, unit ('mg'|'mcg'|'UI'), volume (ml) }
// unidad:        unidad de dosificación de la droga
// rango:         rango de dosis HABITUAL (genera aviso fuera de él, no bloquea)
//
// ⚠ Las concentraciones son diluciones de referencia frecuentes; cada
// institución debe verificar contra su propio protocolo de preparación.
// =====================================================================
(function () {
  'use strict';

  window.CATEGORIES = [
    { id: 'vasopresores', label: 'Vasopresores e Inotrópicos', short: 'Vasopresores', color: 'rose' },
    { id: 'sedantes', label: 'Sedantes', short: 'Sedantes', color: 'indigo' },
    { id: 'analgesia', label: 'Analgesia', short: 'Analgesia', color: 'amber' },
    { id: 'bnm', label: 'Bloqueantes Neuromusculares', short: 'BNM', color: 'violet' },
    { id: 'cardio', label: 'Cardiovasculares (HTA y Antiarrítmicos)', short: 'Cardio', color: 'emerald' },
  ];

  window.DRUGS = [
    // ----------------- Vasopresores e Inotrópicos -----------------
    {
      id: 'noradrenalina', categoria: 'vasopresores', nombre: 'Noradrenalina',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 4, unit: 'mg', volume: 100 },
      rango: { min: 0.01, max: 1 },
      presentacion: 'Amp. 4 mg / 4 ml',
      nota: 'Titular según TAM objetivo. Administrar por vía central.',
    },
    {
      id: 'adrenalina', categoria: 'vasopresores', nombre: 'Adrenalina',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 4, unit: 'mg', volume: 100 },
      rango: { min: 0.01, max: 0.5 },
      presentacion: 'Amp. 1 mg / 1 ml',
      nota: 'Vía central. Monitoreo continuo de ritmo y perfusión.',
    },
    {
      id: 'vasopresina', categoria: 'vasopresores', nombre: 'Vasopresina',
      unidad: 'UI/min',
      concentracion: { amount: 20, unit: 'UI', volume: 100 },
      rango: { min: 0.01, max: 0.04 },
      presentacion: 'Amp. 20 UI / 1 ml',
      nota: 'Dosis fija, NO se ajusta por peso. Habitual 0,03 UI/min en shock séptico.',
    },
    {
      id: 'dopamina', categoria: 'vasopresores', nombre: 'Dopamina',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 400, unit: 'mg', volume: 250 },
      rango: { min: 2, max: 20 },
      presentacion: 'Amp. 200 mg / 5 ml',
      nota: 'Mayor riesgo de arritmias que noradrenalina.',
    },
    {
      id: 'dobutamina', categoria: 'vasopresores', nombre: 'Dobutamina',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 250, unit: 'mg', volume: 250 },
      rango: { min: 2.5, max: 20 },
      presentacion: 'Amp. 250 mg / 20 ml',
      nota: 'Inotrópico; puede causar hipotensión por vasodilatación.',
    },
    {
      id: 'milrinona', categoria: 'vasopresores', nombre: 'Milrinona',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 20, unit: 'mg', volume: 100 },
      rango: { min: 0.25, max: 0.75 },
      presentacion: 'Amp. 10 mg / 10 ml',
      nota: 'Ajustar dosis en insuficiencia renal.',
    },

    // ----------------------- Sedantes -----------------------
    {
      id: 'propofol', categoria: 'sedantes', nombre: 'Propofol 1%',
      unidad: 'mg/kg/h',
      concentracion: { amount: 1000, unit: 'mg', volume: 100 },
      rango: { min: 0.5, max: 4 },
      presentacion: 'Fco. 1% (10 mg/ml) — sin diluir',
      nota: 'Riesgo de PRIS con >4 mg/kg/h sostenido >48 h. Aporta 1,1 kcal/ml.',
    },
    {
      id: 'midazolam', categoria: 'sedantes', nombre: 'Midazolam',
      unidad: 'mg/kg/h',
      concentracion: { amount: 100, unit: 'mg', volume: 100 },
      rango: { min: 0.02, max: 0.2 },
      presentacion: 'Amp. 15 mg / 3 ml',
      nota: 'Acumulación en falla renal/hepática y obesidad. Riesgo de delirium.',
    },
    {
      id: 'dexmedetomidina', categoria: 'sedantes', nombre: 'Dexmedetomidina',
      unidad: 'mcg/kg/h',
      concentracion: { amount: 200, unit: 'mcg', volume: 50 },
      rango: { min: 0.2, max: 1.4 },
      presentacion: 'Amp. 200 mcg / 2 ml',
      nota: 'En UTI iniciar sin bolo. Vigilar bradicardia e hipotensión.',
    },

    // ----------------------- Analgesia -----------------------
    {
      id: 'fentanilo', categoria: 'analgesia', nombre: 'Fentanilo',
      unidad: 'mcg/kg/h',
      concentracion: { amount: 1000, unit: 'mcg', volume: 100 },
      rango: { min: 0.5, max: 3 },
      presentacion: 'Amp. 250 mcg / 5 ml',
      nota: 'Acumulación con infusiones prolongadas (lipofílico).',
    },
    {
      id: 'remifentanilo', categoria: 'analgesia', nombre: 'Remifentanilo',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 5, unit: 'mg', volume: 100 },
      rango: { min: 0.025, max: 0.3 },
      presentacion: 'Vial 5 mg (polvo)',
      nota: 'Vida media ultracorta e independiente del tiempo de infusión. Prever analgesia de rescate al suspender.',
    },
    {
      id: 'morfina', categoria: 'analgesia', nombre: 'Morfina',
      unidad: 'mg/kg/h',
      concentracion: { amount: 50, unit: 'mg', volume: 50 },
      rango: { min: 0.01, max: 0.05 },
      presentacion: 'Amp. 10 mg / 1 ml',
      nota: 'Metabolito activo se acumula en falla renal.',
    },

    // --------------- Bloqueantes Neuromusculares ---------------
    {
      id: 'atracurio', categoria: 'bnm', nombre: 'Atracurio',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 250, unit: 'mg', volume: 250 },
      rango: { min: 4, max: 12 },
      presentacion: 'Amp. 50 mg / 5 ml',
      nota: 'Asegurar sedación profunda concomitante. Libera histamina.',
    },
    {
      id: 'cisatracurio', categoria: 'bnm', nombre: 'Cisatracurio',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 100, unit: 'mg', volume: 100 },
      rango: { min: 1, max: 3 },
      presentacion: 'Amp. 10 mg / 5 ml',
      nota: 'Asegurar sedación profunda. De elección en falla renal/hepática (vía de Hofmann).',
    },
    {
      id: 'rocuronio', categoria: 'bnm', nombre: 'Rocuronio',
      unidad: 'mg/kg/h',
      concentracion: { amount: 100, unit: 'mg', volume: 100 },
      rango: { min: 0.3, max: 0.6 },
      presentacion: 'Amp. 50 mg / 5 ml',
      nota: 'Asegurar sedación profunda. Reversible con sugammadex.',
    },
    {
      id: 'vecuronio', categoria: 'bnm', nombre: 'Vecuronio',
      unidad: 'mg/kg/h',
      concentracion: { amount: 50, unit: 'mg', volume: 50 },
      rango: { min: 0.05, max: 0.1 },
      presentacion: 'Vial 10 mg (polvo)',
      nota: 'Asegurar sedación profunda. Acumulación en falla renal/hepática.',
    },

    // --------- Cardiovasculares (HTA y Antiarrítmicos) ---------
    {
      id: 'nitroglicerina', categoria: 'cardio', nombre: 'Nitroglicerina',
      unidad: 'mcg/min',
      concentracion: { amount: 50, unit: 'mg', volume: 250 },
      rango: { min: 5, max: 200 },
      presentacion: 'Amp. 25 mg / 5 ml',
      nota: 'Dosis fija, NO se ajusta por peso. Usar envases y tubuladuras no adsorbentes (evitar PVC). Taquifilaxia con uso prolongado.',
    },
    {
      id: 'nitroprusiato', categoria: 'cardio', nombre: 'Nitroprusiato de sodio',
      unidad: 'mcg/kg/min',
      concentracion: { amount: 50, unit: 'mg', volume: 250 },
      rango: { min: 0.3, max: 4 },
      presentacion: 'Vial 50 mg (polvo)',
      nota: 'Fotoprotección obligatoria (mezcla y tubuladura). Riesgo de toxicidad por cianuro/tiocianato con dosis altas, uso prolongado o falla renal/hepática.',
    },
    {
      id: 'labetalol', categoria: 'cardio', nombre: 'Labetalol',
      unidad: 'mg/min',
      concentracion: { amount: 200, unit: 'mg', volume: 200 },
      rango: { min: 0.5, max: 2 },
      presentacion: 'Amp. 100 mg / 20 ml',
      nota: 'Dosis fija, NO se ajusta por peso. Contraindicado en bradicardia, bloqueo AV avanzado, asma grave o falla cardíaca descompensada.',
    },
    {
      id: 'amiodarona', categoria: 'cardio', nombre: 'Amiodarona',
      unidad: 'mg/min',
      concentracion: { amount: 900, unit: 'mg', volume: 500 },
      rango: { min: 0.5, max: 1 },
      presentacion: 'Amp. 150 mg / 3 ml',
      nota: 'Carga de 150–300 mg aparte. Esquema habitual: 1 mg/min × 6 h, luego 0,5 mg/min × 18 h. Diluir SOLO en dextrosa 5%; preferir vía central (flebitis).',
    },
  ];
})();
