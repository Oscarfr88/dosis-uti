// Tarjeta de cálculo para una droga. Genérica para todas las categorías:
// la categoría "Vasopresores" (y las demás) se renderizan mapeando DRUGS
// filtradas por categoría sobre este componente.
//
// Modos:
//   'doseToRate' : ingreso la dosis deseada  -> obtengo ml/h de bomba
//   'rateToDose' : ingreso los ml/h actuales -> obtengo la dosis recibida

const CARD_ACCENTS = {
  rose: { bar: 'bg-rose-500', chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/30' },
  indigo: { bar: 'bg-indigo-500', chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/30' },
  amber: { bar: 'bg-amber-500', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/30' },
  violet: { bar: 'bg-violet-500', chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/30' },
  emerald: { bar: 'bg-emerald-500', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30' },
};

function parseInputNumber(raw) {
  if (raw === '' || raw === null) return NaN;
  return parseFloat(String(raw).replace(',', '.'));
}

function DrugCard({ drug, weightKg, color }) {
  const [mode, setMode] = React.useState('doseToRate');
  const [rawInput, setRawInput] = React.useState('');
  const [conc, setConc] = React.useState({ ...drug.concentracion });

  const accent = CARD_ACCENTS[color];
  const unitInfo = Calc.parseDoseUnit(drug.unidad);
  const input = parseInputNumber(rawInput);
  const concValid = Calc.concentrationPerMl(conc, unitInfo.mass) > 0;
  const concModified =
    Number(conc.amount) !== drug.concentracion.amount ||
    Number(conc.volume) !== drug.concentracion.volume;

  const common = { weightKg, doseUnit: drug.unidad, concentration: conc };
  const rate = mode === 'doseToRate' ? Calc.doseToRate({ dose: input, ...common }) : input;
  const dose = mode === 'doseToRate' ? input : Calc.rateToDose({ rateMlH: input, ...common });
  const result = mode === 'doseToRate' ? rate : dose;
  const resultUnit = mode === 'doseToRate' ? 'ml/h' : drug.unidad;

  const status = Calc.classifyDose(dose, drug.rango);
  const hasInput = rawInput !== '';
  const inputInvalid = hasInput && !(input > 0);
  const missingWeight = unitInfo.weightBased && !(weightKg > 0);
  const rateImplausible = isFinite(rate) && rate > Calc.MAX_RATE_ML_H;
  const showResult = isFinite(result) && !rateImplausible;

  // Equivalencia rápida: cuánta dosis entrega 1 ml/h con esta mezcla.
  const dosePerMl = Calc.rateToDose({ rateMlH: 1, ...common });

  const setConcField = (field) => (e) =>
    setConc({ ...conc, [field]: e.target.value });

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={'h-1.5 ' + accent.bar} />
      <div className="space-y-4 p-4 sm:p-5">
        {/* Encabezado */}
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold">{drug.nombre}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{drug.presentacion}</p>
          </div>
          <span className={'rounded-full px-3 py-1 text-xs font-bold ring-1 ' + accent.chip}>
            {drug.unidad}
          </span>
        </header>

        {/* Concentración de la mezcla (editable) */}
        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/60">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mezcla
            </span>
            {concModified && (
              <button
                onClick={() => setConc({ ...drug.concentracion })}
                className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
                title="Volver a la concentración estándar"
              >
                ↺ Estándar
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-lg font-semibold tabular-nums">
            <input
              type="text"
              inputMode="decimal"
              value={conc.amount}
              onChange={setConcField('amount')}
              aria-label={'Cantidad de droga en la mezcla (' + conc.unit + ')'}
              className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900"
            />
            <span>{conc.unit} en</span>
            <input
              type="text"
              inputMode="decimal"
              value={conc.volume}
              onChange={setConcField('volume')}
              aria-label="Volumen total de la mezcla (ml)"
              className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900"
            />
            <span>ml</span>
            {concValid && (
              <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                = {Calc.formatNumber(Calc.concentrationPerMl(conc, unitInfo.mass))} {unitInfo.mass}/ml
              </span>
            )}
          </div>
          {!concValid && (
            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
              ⚠ Concentración inválida: cantidad y volumen deben ser mayores a 0.
            </p>
          )}
        </div>

        {/* Selector de dirección del cálculo */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60" role="tablist">
          {[
            ['doseToRate', 'Dosis → ml/h'],
            ['rateToDose', 'ml/h → Dosis'],
          ].map(([m, label]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setRawInput(''); }}
              className={
                'rounded-lg py-1.5 text-sm font-bold transition-colors ' +
                (mode === m
                  ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200')
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Entrada */}
        <div className="flex items-baseline gap-3">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            aria-label={mode === 'doseToRate' ? 'Dosis deseada (' + drug.unidad + ')' : 'Ritmo actual de la bomba (ml/h)'}
            className={
              'w-full rounded-xl border-2 bg-white px-3 py-2 text-2xl font-bold tabular-nums outline-none focus:border-sky-500 dark:bg-slate-950 sm:px-4 sm:text-3xl ' +
              (inputInvalid ? 'border-red-500' : 'border-slate-300 dark:border-slate-600')
            }
          />
          <span className="shrink-0 text-lg font-semibold text-slate-500 dark:text-slate-400">
            {mode === 'doseToRate' ? drug.unidad : 'ml/h'}
          </span>
        </div>

        {/* Resultado */}
        <div className="rounded-xl bg-slate-950 px-4 py-3 text-center dark:bg-black/40 dark:ring-1 dark:ring-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {mode === 'doseToRate' ? 'Programar bomba a' : 'El paciente recibe'}
          </p>
          <p className="text-4xl font-black tabular-nums text-white sm:text-5xl">
            {showResult ? Calc.formatNumber(result) : '—'}
            <span className="ml-2 text-xl font-bold text-slate-400">{resultUnit}</span>
          </p>
        </div>

        {/* Avisos de seguridad y rango */}
        <div className="space-y-1 text-sm font-medium" aria-live="polite">
          {inputInvalid && (
            <p className="text-red-600 dark:text-red-400">⚠ Ingrese un valor numérico mayor a 0.</p>
          )}
          {missingWeight && hasInput && !inputInvalid && (
            <p className="text-red-600 dark:text-red-400">⚠ Ingrese un peso válido para calcular esta droga.</p>
          )}
          {rateImplausible && (
            <p className="text-red-600 dark:text-red-400">
              ⛔ Resultado implausible (&gt;{Calc.MAX_RATE_ML_H} ml/h). Revise dosis y concentración.
            </p>
          )}
          {showResult && status === 'high' && (
            <p className="text-red-600 dark:text-red-400">⚠ Por ENCIMA del rango habitual.</p>
          )}
          {showResult && status === 'low' && (
            <p className="text-sky-600 dark:text-sky-400">ℹ Por debajo del rango habitual.</p>
          )}
          {showResult && status === 'in' && (
            <p className="text-emerald-600 dark:text-emerald-400">✓ Dentro del rango habitual.</p>
          )}
          <p className="text-slate-500 dark:text-slate-400">
            Rango habitual: {Calc.formatNumber(drug.rango.min)}–{Calc.formatNumber(drug.rango.max)} {drug.unidad}
            {isFinite(dosePerMl) && (
              <span> · 1 ml/h ≈ {Calc.formatNumber(dosePerMl)} {drug.unidad}</span>
            )}
          </p>
          {drug.nota && <p className="text-xs text-slate-500 dark:text-slate-500">{drug.nota}</p>}
        </div>
      </div>
    </article>
  );
}
