const CACHE_FILES = [
    '/index.html',
    '/index.js',
    '/style.css',
    '/icons/icon-192x192.png',
    '/icons,icon-512x512.png'
];
const PRECACHE = "precache-v1";

//installing service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(CACHE_FILES))
            .then(self.skipWaiting())
    );
});

//service worker retrieving assets
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then( response => {
        return response || fetch(event.request);
      })
    );
  });