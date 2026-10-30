var C='arbeitszeit-v1';
var CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
var CDN='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return c.addAll(CORE).then(function(){
      return fetch(new Request(CDN,{mode:'no-cors'})).then(function(r){return c.put(CDN,r)}).catch(function(){});
    });
  }));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(hit){
    if(hit)return hit;
    return fetch(e.request).then(function(r){
      if(r&&(r.ok||r.type==='opaque')){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
      return r;
    }).catch(function(){return caches.match('./index.html')});
  }));
});
