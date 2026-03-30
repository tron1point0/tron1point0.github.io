const CACHE_NAME = 'genpass-v1';
const ASSETS = [
  './index.html',
  './style/main.css',
  './style/Password.woff',
  './script/main.js',
  './script/genpass.js',
  './script/color-hash.js',
  './image/favicon.svg',
  './image/favicon_32.png',
  './image/favicon_64.png',
  './image/logo_128.png',
  './image/logo_152.png',
  './image/logo_180.png',
  './image/logo_192.png',
  './image/logo.svg',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
