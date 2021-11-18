const CACHE_FILES = [
    "/",
    "/index.html",
    "/index.js",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];
const PRECACHE = "precache-budget";
const DATACACHE = "datacache-budget";

//installing service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => {
                console.log(cache);
                cache.addAll(CACHE_FILES);
            })
            .then(self.skipWaiting())
    );
});

//service worker retrieving assets
self.addEventListener("fetch", function (evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches
                .open(DATACACHE)
                .then((cache) => {
                    return fetch(evt.request)
                        .then((response) => {
                            // If the response was good, clone it and store it in the cache.
                            if (response.status === 200) {
                                cache.put(evt.request.url, response.clone());
                            }

                            return response;
                        })
                        .catch((err) => {
                            // Network request failed, try to get it from the cache.
                            return cache.match(evt.request);
                        });
                })
                .catch((err) => console.log(err))
        );

        return;
    }

    evt.respondWith(
        caches.open(PRECACHE).then((cache) => {
            return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            });
        })
    );
});
