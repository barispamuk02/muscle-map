// ============================================
// 🔧 SERVICE WORKER — КЕШ ДЛЯ ОФЛАЙН-РЕЖИМА
// ============================================
const CACHE_NAME = 'muscle-map-v1';
const RUNTIME_CACHE = 'muscle-map-runtime-v1';

// Файлы, которые кешируем сразу при установке
const PRECACHE_URLS = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './muscle-data.js',
    './exercise-data.js',
    './custom-exercises.js',
    './quotes.js',
    './recovery-data.js',
    './nutrition-data.js',
    './programs-data.js',
    './premium-data.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-180.png',
    './images/body-front_1.png',
    './images/body-back_2.png'
];

// ============================================
// УСТАНОВКА — кешируем основные файлы
// ============================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Кеширую основные файлы');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('✅ Основные файлы закешированы');
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('❌ Ошибка кеширования:', err);
            })
    );
});

// ============================================
// АКТИВАЦИЯ — удаляем старые кеши
// ============================================
self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: активация...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                        .map((name) => {
                            console.log('🗑️ Удаляю старый кеш:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker активирован');
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH — стратегия: сначала кеш, потом сеть
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Пропускаем не-GET запросы
    if (request.method !== 'GET') return;
    
    // Пропускаем внешние URL (Google Fonts и т.д.)
    if (!request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Если есть в кеше — возвращаем
                if (cachedResponse) {
                    // Фоново обновляем кеш
                    fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                caches.open(RUNTIME_CACHE).then((cache) => {
                                    cache.put(request, response.clone());
                                });
                            }
                        })
                        .catch(() => {});
                    
                    return cachedResponse;
                }
                
                // Если нет — грузим из сети
                return fetch(request)
                    .then((response) => {
                        // Кешируем ответ
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                        
                        return response;
                    })
                    .catch(() => {
                        // Если сети нет — отдаём index.html для HTML-запросов
                        if (request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});

// ============================================
// СООБЩЕНИЯ ОТ КЛИЕНТА
// ============================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('✅ Service Worker загружен');