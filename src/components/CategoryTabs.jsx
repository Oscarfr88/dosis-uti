// Pestañas de navegación entre categorías de drogas. Cambiar de pestaña
// NUNCA borra el peso del paciente (vive en el estado de App).
const TAB_ACCENTS = {
  rose: 'bg-rose-600 text-white border-rose-600 shadow-rose-600/30',
  indigo: 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/30',
  amber: 'bg-amber-500 text-slate-950 border-amber-500 shadow-amber-500/30',
  violet: 'bg-violet-600 text-white border-violet-600 shadow-violet-600/30',
  emerald: 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/30',
};

function CategoryTabs({ categories, activeId, onSelect }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Categorías de drogas">
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            aria-pressed={active}
            title={cat.label}
            className={
              'whitespace-nowrap rounded-lg border-2 px-3 py-2 text-sm font-bold transition-colors shadow-lg sm:px-4 ' +
              (active
                ? TAB_ACCENTS[cat.color]
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 shadow-transparent')
            }
          >
            {cat.short}
          </button>
        );
      })}
    </nav>
  );
}
