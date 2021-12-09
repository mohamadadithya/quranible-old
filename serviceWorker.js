const staticQuranible = "quranible-site-v1"
const assets = [
    '/',
    '/index.html',
    '/assets/css/main.min.css',
    '/assets/js/app.min.js',
    '/assets/fonts/LPMQ.ttf',
    '/assets/fonts/Poppins-Regular.ttf',
    '/assets/fonts/Poppins-SemiBold.ttf'
]

self.addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticQuranible).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})