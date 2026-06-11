// Service worker: precachea la app completa para que funcione sin conexión
// una vez visitada (y para que "Agregar a pantalla de inicio" la deje
// instalada como app). Estrategia: responde desde caché al instante y
// actualiza el caché en segundo plano (stale-while-revalidate), así las
// correcciones de dosis llegan a todos en la visita siguiente.
//
// IMPORTANTE: subir el número de versión en cada publicación.
const CACHE = 'infusiones-uti-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './vendor/tailwind.js',
  './vendor/babel.min.js',
  './src/utils/calculations.js',
  './src/data/drugs.js',
  './src/components/Disclaimer.jsx',
  './src/components/PatientPanel.jsx',
  './src/components/CategoryTabs.jsx',
  './src/components/DrugCard.jsx',
  './src/App.jsx',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fresh = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
