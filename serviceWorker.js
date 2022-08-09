const staticPiesni = "piesni-site-v1";
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "generate json/brzask.json",
  "generate json/cegielki.json",
  "generate json/nowe.json",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticPiesni).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
