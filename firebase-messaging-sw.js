const CACHE='team-portal-fcm-v6';
const APP_SHELL=['/','/index.html','/styles.css','/app-v6.js','/manifest.json','/icon-192.png','/icon-512.png'];

importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCaoVVdh18Z2nmVuzVtdgb4_2gKukXS7Hs",
  authDomain: "team-portal2027.firebaseapp.com",
  projectId: "team-portal2027",
  storageBucket: "team-portal2027.firebasestorage.app",
  messagingSenderId: "569191612562",
  appId: "1:569191612562:web:c8167ff705a44c1c40e64b"
});

const messaging=firebase.messaging();

messaging.onBackgroundMessage((payload)=>{
  const title=payload.notification?.title || payload.data?.title || 'إشعار جديد';
  const body=payload.notification?.body || payload.data?.body || 'لديك إشعار جديد';
  const icon=payload.notification?.icon || '/icon-192.png';
  self.registration.showNotification(title,{
    body,
    icon,
    badge:'/icon-192.png',
    data:{url:payload.data?.url || '/'}
  });
});

self.addEventListener('notificationclick',(event)=>{
  event.notification.close();
  const url=event.notification?.data?.url || '/';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){
      if('focus' in client){
        try{client.navigate(url);}catch(e){}
        return client.focus();
      }
    }
    return clients.openWindow(url);
  }));
});

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return r;
    }).catch(()=>cached))
  );
});
