// ============================================
// 🔧 SERVICE WORKER — КЕШ ДЛЯ ОФЛАЙН-РЕЖИМА
// ============================================
const CACHE_NAME = 'muscle-map-v113';
const RUNTIME_CACHE = 'muscle-map-runtime-v113';

// Файлы, которые кешируем сразу при установке
const PRECACHE_URLS = [
    // ============================================
    // 📄 ОСНОВНЫЕ ФАЙЛЫ
    // ============================================
    './',
    './index.html',
    './styles.css',
    './script.js',
    './exercise-name-ru.js',
    './muscle-data.js',
    './exercise-data.js',
    './custom-exercises.js',
    './quotes.js',
    './recovery-data.js',
    './nutrition-data.js',
    './programs-data.js',
    './premium-data.js',
    './fonts.js',
    './manifest.json',
    './synergists-data.js',
    './mistakes-data.js',
    './supplements-data.js',
    './substitutes-data.js',
    './muscle-translations.js',
    // ============================================
    // 🖼️ PWA-ИКОНКИ
    // ============================================
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-180.png',

    // ============================================
    // 🖼️ КАРТИНКИ МАНЕКЕНА
    // ============================================
    './images/body-front_1.png',
    './images/body-back_2.png',

    // ============================================
    // 🎨 SVG-ИКОНКИ (Lucide v3) — 48 штук
    // ============================================
    './svg/apple.svg',
    './svg/arrow-up-down.svg',
    './svg/beef.svg',
    './svg/biceps-flexed.svg',
    './svg/calendar-days.svg',
    './svg/chart-column-increasing.svg',
    './svg/check.svg',
    './svg/chevrons-down.svg',
    './svg/circle-check-big.svg',
    './svg/circle-x.svg',
    './svg/clapperboard.svg',
    './svg/clipboard-list.svg',
    './svg/clock.svg',
    './svg/credit-card.svg',
    './svg/crosshair.svg',
    './svg/crown.svg',
    './svg/download.svg',
    './svg/dumbbell.svg',
    './svg/eye.svg',
    './svg/file-text.svg',
    './svg/flame.svg',
    './svg/footprints.svg',
    './svg/gem.svg',
    './svg/git-branch.svg',
    './svg/heart-plus.svg',
    './svg/house.svg',
    './svg/image.svg',
    './svg/lightbulb.svg',
    './svg/message-circle-more.svg',
    './svg/moon.svg',
    './svg/plus.svg',
    './svg/refresh-cw.svg',
    './svg/rocket.svg',
    './svg/salad.svg',
    './svg/save.svg',
    './svg/search.svg',
    './svg/send-horizontal.svg',
    './svg/shuffle.svg',
    './svg/smartphone.svg',
    './svg/star.svg',
    './svg/sun.svg',
    './svg/trash.svg',
    './svg/trending-up.svg',
    './svg/triangle-alert.svg',
    './svg/trophy.svg',
    './svg/user.svg',
    './svg/users-round.svg',
    './svg/utensils.svg',
    './svg/waypoints.svg',
    './svg/wheat.svg',
    './svg/x.svg',
    './svg/zap.svg',
    './svg/droplet.svg',

    // ============================================
    // 🎨 SVG-МЫШЦЫ (манекен) — 25 мышц
    // ============================================
    './svg/1_Sternocleidomastoid_muscle.svg',
    './svg/2_Upper_fibers_of_the_trapezius_muscle.svg',
    './svg/4_Pectoralis_major_muscle.svg',
    './svg/6_Serratus_anterior_muscle.svg',
    './svg/7_Rectus_abdominis_muscle.svg',
    './svg/8_External_oblique_muscle_of_the_abdomen.svg',
    './svg/9_Internal_oblique_muscle_of_the_abdomen.svg',
    './svg/10_Transversus_abdominis_muscle.svg',
    './svg/11_Middle_fibers_of_the_trapezius_muscle.svg',
    './svg/12_Latissimus_dorsi_muscle.svg',
    './svg/13_Rhomboid_muscles.svg',
    './svg/15_Anterior_bundle_of_the_deltoid_muscle.svg',
    './svg/16_Middle_head_of_the_deltoid_muscle.svg',
    './svg/17_Posterior_deltoid.svg',
    './svg/18_BICEPS.svg',
    './svg/19_TRICEPS.svg',
    './svg/20_Brachialis.svg',
    './svg/21_Wristflexors.svg',
    './svg/22_Musculi_extensores_carpi.svg',
    './svg/23_quadriceps.svg',
    './svg/24_Posterior_thigh_muscle_group_(biceps_femoris).svg',
    './svg/25_Adductor_muscles_of_the_thigh.svg',
    './svg/26_Musculus_gluteus_maximus.svg',
    './svg/27_Triceps_surae_muscle_(gastrocnemius).svg',
    './svg/28_Tibialis_anterior_muscle.svg'
];

// ============================================
// УСТАНОВКА — кешируем основные файлы
// ============================================
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('📦 Кеширую основные файлы (' + PRECACHE_URLS.length + ')');
                // Загружаем по одному — один битый URL не убьёт весь кэш
                const results = await Promise.allSettled(
                    PRECACHE_URLS.map(url =>
                        cache.add(url).catch(err => {
                            console.warn('⚠️ Не закэшировано:', url, err.message);
                            throw err;
                        })
                    )
                );
                const failed = results.filter(r => r.status === 'rejected');
                if (failed.length > 0) {
                    console.warn(`⚠️ Не закэшировано: ${failed.length} из ${PRECACHE_URLS.length}`);
                } else {
                    console.log('✅ Основные файлы закешированы (' + PRECACHE_URLS.length + ')');
                }
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('❌ Ошибка установки:', err);
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
    
    // ============================================
    // СТРАТЕГИЯ: Network-first (свежие данные)
    // ============================================
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Кэшируем свежий ответ
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                
                return response;
            })
            .catch(() => {
                // Если сеть недоступна — берём из кэша
                return caches.match(request).then((cached) => {
                    if (cached) return cached;
                    
                    // Для HTML-документов — отдаём index.html
                    if (request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                    
                    // Иначе — заглушка
                    return new Response('Offline', { status: 503 });
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