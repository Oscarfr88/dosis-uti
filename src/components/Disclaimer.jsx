// Descargo de responsabilidad — SIEMPRE visible en el pie de página.
function Disclaimer() {
  return (
    <footer className="mt-8 border-t border-slate-200 py-6 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4">
        <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-center text-sm font-medium text-amber-700 dark:text-amber-300">
          ⚠️ Esta aplicación es una herramienta de apoyo. Todas las dosis y cálculos
          deben ser verificados clínicamente por el profesional a cargo antes de su
          administración.
        </p>
        <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
          Las concentraciones precargadas son diluciones de referencia y pueden no
          coincidir con el protocolo de su institución — verifíquelas y edítelas según
          su preparación real.
        </p>
      </div>
    </footer>
  );
}
