/* Service worker Aren Jariyah: cangkang aplikasi tersedia offline; data Supabase tidak pernah disimpan di cache. */
const VER='aj-v2',SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VER).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  /* font: simpan setelah pertama kali dimuat */
  if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(VER).then(c=>c.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>h))));return;
  }
  if(u.origin!==location.origin)return; /* Supabase dan layanan lain: langsung ke jaringan */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(VER).then(c=>c.put('index.html',y))}return x}).catch(()=>caches.match('index.html').then(h=>h||caches.match('./'))));return;
  }
  e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(VER).then(c=>c.put(r,y))}return x}).catch(()=>h);return h||n}));
});
