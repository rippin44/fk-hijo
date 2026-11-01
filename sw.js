// FK非常用の計算機：一度開けば、ネットがなくても開けるように保存しておく
var VER="fk-emg-v276-11010205";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(VER).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==VER && k.indexOf("fk-emg-")===0; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch",function(e){
  var r=e.request; if(r.method!=="GET") return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    var key=(r.mode==="navigate")?"index.html":r;
    e.respondWith(caches.open(VER).then(function(c){ return c.match(key,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){ if(res&&res.ok) c.put(key,res.clone()); return res; }).catch(function(){ return hit; });
      return hit||net; }); }));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.open(VER+"-fonts").then(function(c){ return c.match(r).then(function(hit){ return hit||fetch(r).then(function(res){ c.put(r,res.clone()); return res; }); }); }));
  }
});
