const CACHE_NAME = 'gastehaus-v1';
const ASSETS = [
  './',
  './index.html',
  './Logo.webp',
  encodeURI('./bedrooms.webp'),
  encodeURI('./livingroom.webp'),
  encodeURI('./kitchen.webp'),
  encodeURI('./bathroom.webp')
];

const MARKDOWN_CONTENT = `# Gästehaus 22 Asten | Monteurzimmer & Arbeiterunterkunft Linz

**Praktisch. Sauber. Günstig.**
Preiswerte Unterkunft in 4481 Asten nahe Linz. Einzelbetten, Highspeed-WLAN & Parkplätze direkt vorm Haus.

### 💰 Angebot
* **35 € / Nacht pro Person**
* **Starlink** - Highspeed-Internet
* **Voll ausgestattete Küche**
* **Wohnzimmer** mit TV & YouTube Premium
* **Parkplätze** direkt vorm Haus

### 📍 Lage & Kontakt
**Gästehaus 22**
Eichenstraße 22, 4481 Asten, Österreich

* **WhatsApp:** [Jetzt anfragen](https://wa.me/436801610618)
* **Telefon:** [+43 680 1610618](tel:+436801610618)
* **Web:** [gaestehaus22.at](https://gaestehaus22.at/)`;

// Install: Standard caching
self.addEventListener('install', (e) => {
  self.skipWaiting();
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
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Fetch: Intercept for Markdown + Network-First logic
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const acceptHeader = e.request.headers.get('Accept') || '';

  // 1. Check if the agent specifically requests Markdown for the main page
  if (acceptHeader.includes('text/markdown') && (url.pathname === '/' || url.pathname.endsWith('index.html'))) {
    return e.respondWith(
      new Response(MARKDOWN_CONTENT, {
        headers: {
          'Content-Type': 'text/markdown; charset=UTF-8',
          'x-markdown-tokens': 'true'
        }
      })
    );
  }

  // 2. Standard Network-First logic for everything else
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});