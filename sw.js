/* Offline support: cache the app on first visit, then serve from cache and refresh in the background. */
const CACHE = 'g8maths-v1';
const FILES = [
  './',
  './index.html',
  './css/styles.css',
  './js/core.js',
  './js/app.js',
  './js/topics/area-perimeter.js',
  './js/topics/constructions.js',
  './js/topics/data.js',
  './js/topics/decimals.js',
  './js/topics/equations.js',
  './js/topics/exponents.js',
  './js/topics/expressions.js',
  './js/topics/fractions.js',
  './js/topics/functions.js',
  './js/topics/graphs.js',
  './js/topics/integers.js',
  './js/topics/patterns.js',
  './js/topics/probability.js',
  './js/topics/pythagoras.js',
  './js/topics/shapes-2d.js',
  './js/topics/solids-3d.js',
  './js/topics/straight-lines.js',
  './js/topics/surface-volume.js',
  './js/topics/transformations.js',
  './js/topics/whole-numbers.js',
  './fonts/atkinson-hyperlegible-latin-400-normal.woff2',
  './fonts/atkinson-hyperlegible-latin-400-italic.woff2',
  './fonts/atkinson-hyperlegible-latin-700-normal.woff2',
  './fonts/shantell-sans-latin-700-normal.woff2',
  './fonts/shantell-sans-latin-800-normal.woff2',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(e.request, { ignoreSearch: true });
      const fresh = fetch(e.request).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
});
