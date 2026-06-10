// Panel global y persistente con los datos del paciente (peso en kg).
// El peso se comparte con todas las categorías y se valida contra
// límites plausibles (Calc.WEIGHT_LIMITS).
function PatientPanel({ weightRaw, onWeightChange }) {
  const validation = Calc.validateWeight(
    weightRaw === '' ? '' : String(weightRaw).replace(',', '.')
  );

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <label
        htmlFor="peso-paciente"
        className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        Peso del paciente
      </label>
      <div
        className={
          'flex items-baseline gap-2 rounded-xl border-2 px-3 py-1.5 bg-white dark:bg-slate-900 sm:px-4 sm:py-2 ' +
          (validation.ok
            ? 'border-emerald-500/70'
            : validation.empty
            ? 'border-slate-300 dark:border-slate-600'
            : 'border-red-500')
        }
      >
        <input
          id="peso-paciente"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="—"
          value={weightRaw}
          onChange={(e) => onWeightChange(e.target.value)}
          className="w-20 bg-transparent text-2xl font-bold tabular-nums outline-none placeholder:text-slate-400 sm:w-24 sm:text-3xl"
          aria-invalid={!validation.ok}
        />
        <span className="text-xl font-semibold text-slate-500 dark:text-slate-400">kg</span>
      </div>
      {!validation.ok && !validation.empty && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          ⚠ {validation.error}
        </p>
      )}
      {validation.empty && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Obligatorio para todas las drogas dosificadas por kg.
        </p>
      )}
    </div>
  );
}
