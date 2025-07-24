const CACHE_NAME = "service-report-v1";
const assets = [
  "/",
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "assets/letterhead.jpg"
];

self.addEventListener("install", e =>
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)))
);

self.addEventListener("fetch", e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);