const CACHE_NAME = "hsk-app-v1";
const urlsToCache = [
  "/hsk-app/",
  "/hsk-app/index.html",
  "/hsk-app/icon-512.png",
  "/hsk-app/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
