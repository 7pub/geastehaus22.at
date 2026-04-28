const CACHE_NAME = 'gastehaus-v1';
const ASSETS = [
  './',
  './index.html',
  './Logo.webp',
  // Use encodeURI for files with umlauts to ensure compatibility
  encodeURI('./bedrooms.webp'),
  encodeURI('./livingroom.webp'),
  encodeURI('./kitchen.webp'),
  encodeURI('./bathroom.webp')
];

// Install: Standard caching
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force the waiting service worker to become active
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch: Network-First (Recommended for simple landing pages)
// This ensures they see the latest prices/info if online, but works offline too.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});