const CACHE = 'dino-math-quest-v3-audio-library';
const APP_ROOT = self.registration.scope;
const appUrl = path => new URL(path.replace(/^\//, ''), APP_ROOT).toString();
const SHELL = appUrl('./');
const APP_MANIFEST = appUrl('manifest.json');
const AUDIO_MANIFEST = appUrl('audio/manifest.json');
// Vite emits the bundles with `crossorigin`, so the browser sends an Origin
// header the precache request never had. Any host answering `Vary: Origin`
// would then miss every precached bundle and the offline launch would still be
// blank, precache or not.
const MATCH = { ignoreVary: true };

// index.html is the only record of the Vite-hashed bundle names, and this file
// ships from public/ untouched by the build, so the shell HTML is parsed at
// install time rather than adding a build-time manifest step. Without these the
// shell caches but its JS/CSS do not, and an installed PWA launches blank in
// airplane mode.
function bundleUrlsFromShell(html) {
  const urls = new Set();
  const add = value => {
    try {
      const url = new URL(value, SHELL);
      if (url.origin === self.location.origin) urls.add(url.toString());
    } catch {
      // A malformed or protocol-relative reference is simply not precached.
    }
  };

  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) add(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel=["']?stylesheet\b/i.test(match[0])) continue;
    const href = match[0].match(/\bhref=["']([^"']+)["']/i);
    if (href) add(href[1]);
  }

  return [...urls];
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const shell = await fetch(SHELL, { cache: 'reload' });
    if (!shell.ok) throw new Error('Shell request failed');
    await cache.put(SHELL, shell.clone());
    await cache.add(APP_MANIFEST);

    const bundles = bundleUrlsFromShell(await shell.text());
    await Promise.all(bundles.map(url => cache.add(url).catch(() => undefined)));

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
        .catch(() => caches.match(event.request, MATCH).then(response => response || caches.match(SHELL, MATCH)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, MATCH).then(cached => {
      const fresh = fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      });
      return cached || fresh;
    })
  );
});
