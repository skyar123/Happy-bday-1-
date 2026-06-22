/* Family Peekaboo — offline service worker.
   Bump CACHE_VERSION whenever you change files or add photos. */
const CACHE_VERSION = 'peekaboo-v7';

/* Everything the app needs to run with NO internet.
   👉 When you add a new family photo, add its path here too. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './apple-touch-icon.png',
  './photos/mommy.jpg',
  './photos/mommy-germany.jpg',
  './photos/mommy-germany-2.jpg',
  './photos/alli.jpg',
  './photos/ammorette.jpg',
  './photos/amorette.jpg',
  './photos/becca.jpg',
  './photos/boone.jpg',
  './photos/claudia.jpg',
  './photos/eva.jpg',
  './photos/eva-anska-becca-uli.jpg',
  './photos/gam-gam-and-ga-ga.jpg',
  './photos/grand-dad.jpg',
  './photos/klaus.jpg',
  './photos/klaus-2.jpg',
  './photos/maggie.jpg',
  './photos/opa.jpg',
  './photos/remi-and-scout.jpg',
  './photos/remi-scout-sauce-gigi.jpg',
  './photos/scout-and-opa.jpg',
  './photos/sauce-and-remi.jpg',
  './photos/torren.jpg',
  './photos/uli.jpg',
  './photos/anja-and-baby.jpg',
  './photos/anja-grass.jpg',
  './photos/mommy-and-anja.jpg',
  './photos/anja-tree.jpg',
  './photos/anja-remi-scout.jpg',
  './photos/anja-and-babies.jpg',
  './photos/family-greenhouse.jpg',
  './photos/family-outside.jpg',
  // close-up face crops (interspersed in the game)
  './photos/mommy-face.jpg',
  './photos/becca-face.jpg',
  './photos/boone-face.jpg',
  './photos/grand-dad-face.jpg',
  './photos/klaus-face.jpg',
  './photos/klaus-2-face.jpg',
  './photos/maggie-face.jpg',
  './photos/opa-face.jpg',
  './photos/scout-and-opa-face.jpg',
  './photos/torren-face.jpg',
  './photos/anja-and-baby-face.jpg',
  './photos/anja-grass-face.jpg',
  './photos/mommy-and-anja-face.jpg',
  './photos/anja-tree-face.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      /* Cache each file on its own so one transient hiccup can't sink the whole
         install (cache.addAll is all-or-nothing). Anything that slips through is
         picked up by the cache-first handler below the next time we're online. */
      Promise.all(PRECACHE.map(url =>
        cache.add(url).catch(err => console.warn('[sw] could not precache', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Strategy:
   • The app shell (HTML page) is NETWORK-FIRST, so a fresh deploy shows up the
     next time the app is opened online; it falls back to the cached page offline.
     (Cache-first on the HTML is what makes "I redeployed but nothing changed".)
   • Everything else — photos, icons, manifest — is CACHE-FIRST: instant and
     offline-ready, and a photo never changes once it has a filename. Newly added
     files are fetched from the network and stashed for next time. */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isPageShell =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname === '/' ||
    url.pathname.endsWith('/index.html');

  if (isPageShell) {
    event.respondWith(
      fetch(req)
        .then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_VERSION).then(c => c.put('./index.html', copy)).catch(() => {});
          }
          return resp;
        })
        // Offline: serve the cached app shell so launching from the Home Screen
        // always lands on the game, never an error page.
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    // ignoreSearch so a stray ?query (e.g. the Home Screen launch URL) still hits the cache.
    caches.match(req, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return resp;
      }).catch(() => cached);   // undefined for other misses — nothing more we can do offline
    })
  );
});
