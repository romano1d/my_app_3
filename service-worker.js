const CACHE_NAME = 'my-radio-pwa-cache-v1';

const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
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
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // ИСПРАВЛЕНО ЗДЕСЬ: Используются обратные кавычки (Ⓝ)
                        console.log(ⓃService Worker: Удаляю старый кэш: ${cacheName}Ⓝ);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker: Захватываю контроль над клиентами.');
            return self.clients.claim();
        })
        .catch(error => {
            console.error('Service Worker: Ошибка при активации:', error);
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // ВАЖНО: Ниже нужно дописать логику для обработчика 'fetch'.
    // Пример базовой стратегии "Cache First, then Network":
    if (urlsToCache.includes(requestUrl.pathname) || requestUrl.origin === location.origin) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Возвращаем из кэша, если найдено
                    if (response) {
                        return response;
                    }
                    // Иначе, делаем сетевой запрос
                    return fetch(event.request)
                        .then(networkResponse => {
                            // Кэшируем новые сетевые ресурсы для последующего использования
                            // Только если это GET запрос и ответ валиден
                            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                                const responseToCache = networkResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                            return networkResponse;
                        });
                })
                .catch(error => {
                    console.error('Service Worker: Ошибка при обработке fetch:', error);
                    // Можно вернуть офлайн-страницу или сообщение об ошибке
                    // return caches.match('/offline.html'); 
                })
        );
    } else {
        // Для запросов, которые не должны кэшироваться (например, потоковое аудио или внешние ресурсы)
        event.respondWith(fetch(event.request));
    }
});
