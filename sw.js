const C = "like-plants-v1";
const BASE = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "tarjeta-like-plants.jpg", "regalos-like-plants.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
// Primero la red (para que siempre salga lo nuevo), y si no hay internet, lo guardado
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
