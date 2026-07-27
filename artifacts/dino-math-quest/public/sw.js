const CACHE = 'dino-math-quest-v3-audio-library';
const APP_ROOT = self.registration.scope;
const appUrl = path => new URL(path.replace(/^\//, ''), APP_ROOT).toString();
const SHELL = appUrl('./');
const APP_MANIFEST = appUrl('manifest.json');
const AUDIO_MANIFEST = appUrl('audio/manifest.json');

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([SHELL, APP_MANIFEST]);

    // Audio must be ready before an airplane-mode session. The public manifest
    // is the source of truth, so a new curated library updates with one cache
    // version rather than a hand-maintained file list.
    try {
      const response = await fetch(AUDIO_MANIFEST);
      if (!response.ok) throw new Error('Audio manifest request failed');
      await cache.put(AUDIO_MANIFEST, response.clone());
      const manifest = await response.json();
      const sources = Array.isArray(manifest?.assets)
        ? manifest.assets
          .filter(asset => asset?.approved === true && typeof asset.src === 'string' && asset.src.startsWith('/audio/generated/'))
          .map(asset => appUrl(asset.src))
        : [];
      await Promise.all(sources.map(source => cache.add(source).catch(() => undefined)));
    } catch {
      // The app still has local Web Audio fallbacks if a first install happens
      // without a connection. A later online visit fills this cache.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(response => response || caches.match(SHELL)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fresh = fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      });
      return cached || fresh;
    })
  );
});
