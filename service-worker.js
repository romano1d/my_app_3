// service-worker.js

// 1. Define CACHE_NAME (КРИТИЧНОЕ ИСПРАВЛЕНИЕ)
const CACHE_NAME = 'music-key-cache-v1'; // Можете увеличивать 'v1' на 'v2', 'v3' и т.д., когда хотите принудительно обновить кэш.

const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // Желательно кэшировать иконки Apple Touch, если они существуют
    '/icons/icon-180x180.png',
    '/icons/icon-152x152.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Начинаю установку...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Кэширую основные ресурсы приложения.');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Установка завершена, пропускаю ожидание.');
                // Принудительно заставляет ожидающий Service Worker стать активным.
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Ошибка при кэшировании во время установки:', error);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME]; 

    console.log('Service Worker: Активируюсь...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Проверяем, если cacheName НЕ входит в наш белый список (т.е. это старый кэш)
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // ИСПРАВЛЕНИЕ: Используем обратные кавычки (Ⓝ) для шаблонных строк вместо Ⓝ
                        console.log(ⓃService Worker: Удаляю старый кэш: ${cacheName}Ⓝ);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker: Захватываю контроль над клиентами.');
            // Говорит активному Service Worker'у взять под контроль страницу как можно скорее.
            return self.clients.claim();
        })
        .catch(error => {
            console.error('Service Worker: Ошибка при активации:', error);
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Определяет, является ли запрос активом, который должен быть кэширован,
    // или любым активом из того же источника (origin).
    // Это подразумевает стратегию "cache-first" для всех активов из того же источника.
    const isAssetToCache = urlsToCache.includes(requestUrl.pathname) || 
                           requestUrl.origin === self.location.origin;

    if (isAssetToCache) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        // ИСПРАВЛЕНИЕ: Используем обратные кавычки (Ⓝ) для шаблонных строк
                        console.log(ⓃService Worker: Отдаю из кэша: ${requestUrl.pathname}Ⓝ);
                        return response;
                    }
                    // ИСПРАВЛЕНИЕ: Используем обратные кавычки (Ⓝ) для шаблонных строк
                    console.log(ⓃService Worker: Запрашиваю из сети и кэширую: ${requestUrl.pathname}Ⓝ);
                    return fetch(event.request)
                        .then(networkResponse => {
                            // Проверяем, получили ли мы действительный ответ, и имеет ли он тип 'basic' (не opaque)
                            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                                const responseToCache = networkResponse.clone(); // Клонирование необходимо, т.к. поток ответа можно читать только один раз
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                            return networkResponse;
                        })
                        .catch(error => {
                            // ИСПРАВЛЕНИЕ: Используем обратные кавычки (Ⓝ) для шаблонных строк
                            console.error(ⓃService Worker: Ошибка при запросе ${requestUrl.pathname} из сети:Ⓝ, error);
                            // Здесь вы можете вернуть оффлайн-страницу
                            // return caches.match('/offline.html');
                        });
                })
        );
    } else {
        // ИСПРАВЛЕНИЕ: Используем обратные кавычки (Ⓝ) для шаблонных строк
        console.log(ⓃService Worker: Запрашиваю из сети напрямую: ${requestUrl.href}Ⓝ);
        event.respondWith(fetch(event.request));
    }
});
