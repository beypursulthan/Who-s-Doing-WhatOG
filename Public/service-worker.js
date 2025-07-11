
const CACHE_NAME = 'geopost-cache-v1';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.js',
  '/App.js',
  '/components.js',
  '/services.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(APP_SHELL_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache-first for app shell
      if (response) {
        return response;
      }
      
      // Network-first for other requests
      return fetch(event.request).then(
        (networkResponse) => {
          // Do not cache everything, only if needed.
          // For this app, we let the app logic handle data, not the service worker.
          return networkResponse;
        }
      ).catch(() => {
        // Fallback for failed fetches, e.g., an offline page.
        // For this simple PWA, we just let the fetch fail.
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});