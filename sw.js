/* Family Peekaboo — offline service worker.
   Bump CACHE_VERSION whenever you change files or add photos. */
const CACHE_VERSION = 'peekaboo-v3';

/* Everything the app needs to run with NO internet.
   👉 When you add a new family photo, add its path here too. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './apple-touch-icon.png',
  './photos/anja-and-baby.jpg',
  './photos/anja-grass.jpg',
  './photos/mommy-and-anja.jpg',
  './photos/anja-tree.jpg',
  './photos/anja-remi-scout.jpg',
  './photos/anja-and-babies.jpg',
  './photos/family-greenhouse.jpg',
  './photos/family-outside.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Cache-first: instant + works offline. Falls back to network and
   stashes anything new (e.g. photos you added) for next time. */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(event.request, copy));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
