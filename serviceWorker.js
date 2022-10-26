const version = 3;
const cacheName = `piesni-${version}`;

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
  "/scripts/favoriteMenu.js",
  "/scripts/hymn.js",
  "/scripts/main.js",
  "/scripts/menu.js",
  "/scripts/themeMenu.js",

  // ikonki
  "/files/icons/arrow.svg",
  "/files/icons/clear.svg",
  "/files/icons/star_empty.svg",
  "/files/icons/star_filled.svg",
  "/files/icons/text.svg",

  // pdf-y
  "/files/Piesni Brzasku Tysiaclecia.pdf",
  "/files/Spiewajcie Panu Piesn Nowa.pdf",
  "/files/Spiewniczek Mlodziezowy Epifanii.pdf",
  // "/files/Uwielbiajmy Pana.pdf",
];

// wszystkie teksty pieśni z plików JSON (raw github)
let hymnsArray = [];
async function cacheHymnBook(name) {
  const x = await fetch(`/json/${name}.json`).then((response) => {
    return response.json();
  });
  for (let i = 0; i < x.length; i++) hymnsArray.push(x[i].link);
}

// instalacja nowego sw
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      await cacheHymnBook("brzask");
      await cacheHymnBook("cegielki");
      await cacheHymnBook("nowe");
      await cacheHymnBook("epifania");

      const contentToCache = assets.concat(hymnsArray);

      const cache = await caches.open(cacheName);
      await cache.addAll(contentToCache);
    })()
  );
});

// zapisanie i odczyt plików
self.addEventListener("fetch", (e) => {
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

// aktywacja nowego sw
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) return;
          return caches.delete(key);
        })
      );
    })
  );
});
