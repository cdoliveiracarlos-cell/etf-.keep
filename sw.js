
const CACHE='etf-watch-v3-4';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./index.html','./manifest.json','./icon-192.png'])));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=e.request.url;
  if(u.includes('script.google')||u.includes('docs.google')){e.respondWith(fetch(e.request));return;}
  e.respondWith(fetch(e.request).then(r=>{
    if(u.startsWith(self.location.origin)){const cl=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));}
    return r;
  }).catch(()=>caches.match(e.request)));
});
 
