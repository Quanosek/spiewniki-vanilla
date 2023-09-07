const cacheName = "v2.4.0";

const assets = [
  // główny plik HTML
  "/",
  "/index.html",

  // style
  "/styles/app.css",
  "/styles/colors.css",
  "/styles/main.css",
  "/styles/menu.css",
  "/styles/reset.css",

  // skrypty
  "/scripts/menu/favorites.js",
  "/scripts/menu/redirect.js",
  "/scripts/menu/settings.js",

  "/scripts/bookNames.js",
  "/scripts/hymn.js",
  "/scripts/main.js",
  "/scripts/menu.js",
  "/scripts/slideShow.js",

  // baza danych
  "/json/brzask.json",
  "/json/cegielki.json",
  "/json/epifania.json",
  "/json/inne.json",
  "/json/nowe.json",
  "/json/syloe.json",

  // pliki
  "/files/fonts/Brutal Type Medium.ttf",
  "/files/fonts/Gill Sans MT.ttf",

  "/files/icons/arrow.svg",
  "/files/icons/close.svg",
  "/files/icons/dice.svg",
  "/files/icons/monitor.svg",
  "/files/icons/settings.svg",
  "/files/icons/star_empty.svg",
  "/files/icons/star_filled.svg",
  "/files/icons/text.svg",
  "/files/icons/update.svg",

  "/files/images/spiewniki.webp",
];

let hymnsArray = [];

// odczyt zdefiniowanych plików .json
async function cacheHymnBook(hymnBooks) {
  for (let i = 0; i < hymnBooks.length; i++) {
    await fetch(`/json/${hymnBooks[i]}.json`)
      .then((response) => response.json())
      .then((hymnBook) => {
        hymnBook.forEach((hymn) => {
          hymnsArray.push(hymn.link);
        });
      });
  }
}

// odczyt i zapis nowych plików
self.addEventListener("fetch", (e) => {
  url = e.request.url;

  if (
    url.startsWith("chrome-extension") ||
    url.includes("extension") ||
    url.indexOf("http") !== 0
  )
    return;

  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) return r;

      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      cache.put(e.request, response.clone());

      return response;
    })()
  );
});

// instalacja nowego sw
self.addEventListener("install", (e) => {
  self.skipWaiting();

  e.waitUntil(
    (async () => {
      await cacheHymnBook([
        "brzask",
        "cegielki",
        "nowe",
        "epifania",
        "syloe",
        "inne",
      ]);

      const contentToCache = assets.concat(hymnsArray);
      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
    })()
  );
});

// usunięcie starego sw
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keysList) => {
      return Promise.all(
        keysList.map((key) => {
          return caches.delete(key);
        })
      );
    })
  );
});
