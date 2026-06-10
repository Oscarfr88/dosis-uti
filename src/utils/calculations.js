// =====================================================================
// Lógica de cálculo de infusiones continuas — funciones puras, sin UI.
//
// Fórmula base:
//   ml/h = (dosis × peso × factor_tiempo) / concentración_de_la_mezcla
//
// donde la concentración se expresa en la MISMA unidad de masa que la
// dosis, por ml de mezcla. El factor_tiempo es 60 si la dosis es "por
// minuto" (la bomba siempre programa por hora). El peso solo participa
// si la unidad de dosis incluye "/kg/".
// =====================================================================
(function () {
  'use strict';

  // Equivalencias de masa, normalizadas a microgramos.
  // Las UI (unidades internacionales) no son convertibles a masa:
  // solo se admiten cuando dosis y concentración están ambas en UI.
  var MASS_IN_MCG = { mcg: 1, mg: 1000 };

  // 'mcg/kg/min' -> { mass:'mcg', weightBased:true,  perMinute:true  }
  // 'UI/min'     -> { mass:'UI',  weightBased:false, perMinute:true  }
  // 'mg/kg/h'    -> { mass:'mg',  weightBased:true,  perMinute:false }
  function parseDoseUnit(doseUnit) {
    var parts = doseUnit.split('/');
    return {
      mass: parts[0],
      weightBased: parts.indexOf('kg') !== -1,
      perMinute: parts[parts.length - 1] === 'min',
    };
  }

  // Concentración de la mezcla por ml, expresada en la unidad de masa
  // de la dosis. Ej.: { amount: 4, unit: 'mg', volume: 100 } con dosis
  // en mcg -> 40 mcg/ml.
  function concentrationPerMl(concentration, doseMass) {
    var amount = Number(concentration.amount);
    var volume = Number(concentration.volume);
    if (!(amount > 0) || !(volume > 0)) return NaN;
    if (concentration.unit === 'UI' || doseMass === 'UI') {
      return concentration.unit === doseMass ? amount / volume : NaN;
    }
    var factor = MASS_IN_MCG[concentration.unit] / MASS_IN_MCG[doseMass];
    if (!isFinite(factor)) return NaN;
    return (amount * factor) / volume;
  }

  // Dosis deseada -> ritmo de bomba (ml/h). NaN si faltan datos válidos.
  function doseToRate(params) {
    var u = parseDoseUnit(params.doseUnit);
    var conc = concentrationPerMl(params.concentration, u.mass);
    if (!(params.dose > 0) || !(conc > 0)) return NaN;
    if (u.weightBased && !(params.weightKg > 0)) return NaN;
    var massPerHour =
      params.dose *
      (u.weightBased ? params.weightKg : 1) *
      (u.perMinute ? 60 : 1);
    return massPerHour / conc;
  }

  // Ritmo de bomba (ml/h) -> dosis recibida. NaN si faltan datos válidos.
  function rateToDose(params) {
    var u = parseDoseUnit(params.doseUnit);
    var conc = concentrationPerMl(params.concentration, u.mass);
    if (!(params.rateMlH > 0) || !(conc > 0)) return NaN;
    if (u.weightBased && !(params.weightKg > 0)) return NaN;
    var dose = (params.rateMlH * conc) / (u.perMinute ? 60 : 1);
    return u.weightBased ? dose / params.weightKg : dose;
  }

  // ---------------- Validaciones de seguridad ----------------

  var WEIGHT_LIMITS = { min: 1, max: 300 }; // kg plausibles (neonato–obesidad extrema)
  var MAX_RATE_ML_H = 1500; // por encima de esto ninguna bomba volumétrica es creíble

  function validateWeight(weightKg) {
    if (weightKg === '' || weightKg === null || weightKg === undefined) {
      return { ok: false, empty: true, error: 'Ingrese el peso del paciente.' };
    }
    var w = Number(weightKg);
    if (!isFinite(w) || w <= 0) {
      return { ok: false, error: 'El peso debe ser un número mayor a 0.' };
    }
    if (w < WEIGHT_LIMITS.min || w > WEIGHT_LIMITS.max) {
      return {
        ok: false,
        error:
          'Peso fuera de rango plausible (' +
          WEIGHT_LIMITS.min + '–' + WEIGHT_LIMITS.max + ' kg).',
      };
    }
    return { ok: true, value: w };
  }

  // 'low' | 'in' | 'high' | null (sin dosis calculable)
  function classifyDose(dose, range) {
    if (!(dose > 0) || !range) return null;
    if (dose < range.min * 0.999) return 'low';
    if (dose > range.max * 1.001) return 'high';
    return 'in';
  }

  // Formato es-AR (coma decimal), con decimales según magnitud.
  function formatNumber(value) {
    if (!isFinite(value)) return '—';
    var dec = value >= 100 ? 0 : value >= 10 ? 1 : value >= 1 ? 2 : 3;
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: dec,
    });
  }

  window.Calc = {
    parseDoseUnit: parseDoseUnit,
    concentrationPerMl: concentrationPerMl,
    doseToRate: doseToRate,
    rateToDose: rateToDose,
    validateWeight: validateWeight,
    classifyDose: classifyDose,
    formatNumber: formatNumber,
    WEIGHT_LIMITS: WEIGHT_LIMITS,
    MAX_RATE_ML_H: MAX_RATE_ML_H,
  };
})();
