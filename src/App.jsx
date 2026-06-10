// Algunos navegadores bloquean localStorage al abrir el archivo localmente
// (file://); en ese caso la app funciona igual, solo que sin persistencia.
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* sin persistencia */ } },
};

// Componente raíz. El peso del paciente vive acá (y en storage),
// por eso navegar entre categorías nunca lo pierde.
function App() {
  const [weightRaw, setWeightRaw] = React.useState(
    () => storage.get('dosisuti.peso') || ''
  );
  const [activeCategory, setActiveCategory] = React.useState(CATEGORIES[0].id);
  const [dark, setDark] = React.useState(
    () => storage.get('dosisuti.tema') !== 'claro' // oscuro por defecto
  );

  React.useEffect(() => {
    storage.set('dosisuti.peso', weightRaw);
  }, [weightRaw]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    storage.set('dosisuti.tema', dark ? 'oscuro' : 'claro');
  }, [dark]);

  const validation = Calc.validateWeight(
    weightRaw === '' ? '' : String(weightRaw).replace(',', '.')
  );
  const weightKg = validation.ok ? validation.value : NaN;

  const category = CATEGORIES.find((c) => c.id === activeCategory);
  const drugs = DRUGS.filter((d) => d.categoria === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Encabezado + datos del paciente, fijos al hacer scroll */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-6xl space-y-2 px-3 py-2 sm:space-y-3 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-black tracking-tight sm:text-2xl">
              💉 Infusiones <span className="text-sky-500">UTI</span>
              <span className="ml-2 hidden text-sm font-medium text-slate-400 sm:inline">
                Calculadora de drogas de infusión continua
              </span>
            </h1>
            <button
              onClick={() => setDark(!dark)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Cambiar tema"
            >
              {dark ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          </div>
          <PatientPanel weightRaw={weightRaw} onWeightChange={setWeightRaw} />
          <CategoryTabs
            categories={CATEGORIES}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </div>

      {/* Grilla de drogas de la categoría activa */}
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <h2 className="mb-4 text-xl font-bold text-slate-700 dark:text-slate-200">
          {category.label}
        </h2>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {drugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} weightKg={weightKg} color={category.color} />
          ))}
        </div>
      </main>

      <Disclaimer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
