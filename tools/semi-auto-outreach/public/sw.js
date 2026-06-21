const CACHE_NAME = 'apexprospect-shell-v3';

// App shell files only — never cache /api/* responses
// Use versioned URL for app.js to match what index.html requests
const SHELL_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js?v=3',
  '/manifest.json',
  '/assets/apexprospect-logo-192.png',
  '/assets/apexprospect-logo-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept API routes — always go to network
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/previews/')) {
    return;
  }

  // App shell: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
