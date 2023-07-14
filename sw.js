const CACHE_NAME = "my-cache-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./src/main.js",
    "./src/game.js",
    "./src/img/back.svg",
    "./src/img/confirm.svg",
    "./src/img/벽_이용가능.gif",
    "./src/img/집이_있으면_잡을수_없다.gif",
    "./src/img/둘러싸면_먹힘.gif",
    "./src/img/장애물을 이용 가능.gif",
    "./src/img/장애물을_이용해서_잡을_수_있다.gif",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          });
      })
  );
});