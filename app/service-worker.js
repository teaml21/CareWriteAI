const CACHE_NAME = 'carewriteai-v2';

const APP_FILES = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json'
   './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
