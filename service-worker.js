// Service Worker for Lab Escape Game PWA
const CACHE_NAME = "lab-escape-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/login.css",
  "/qcm.css",
  "/auth.js",
  "/src/gameObjects/enemies.js",
  "/src/gameObjects/items.js",
  "/src/gameObjects/modal.js",
  "/src/gameObjects/platforms.js",
  "/src/gameObjects/player.js",
  "/src/Scenes/gameScene.js",
  "/src/Scenes/labScene.js",
  "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js",
];

// Install event - cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy: Cache first for assets, Network first for HTML
  if (request.destination === "document") {
    // HTML - Network first, fall back to cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the response if it's successful
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return (
              response ||
              new Response("Offline - Page not available", {
                status: 503,
                statusText: "Service Unavailable",
                headers: new Headers({
                  "Content-Type": "text/plain",
                }),
              })
            );
          });
        }),
    );
  } else {
    // Assets, scripts, styles - Cache first, fall back to network
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache successful responses
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });

            return response;
          })
          .catch(() => {
            // Return offline fallback
            if (request.destination === "image") {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#333" width="100" height="100"/><text x="50" y="50" font-size="14" fill="#999" text-anchor="middle" dy=".3em">Offline</text></svg>',
                { headers: { "Content-Type": "image/svg+xml" } },
              );
            }
            return new Response("Offline - Resource not available", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
      }),
    );
  }
});
