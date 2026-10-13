// ============================================
// 💰 ПРЕМИУМ-РАЗДЕЛ
// ============================================

const premiumFeatures = [
    {
        icon: 'circle-check-big',
        title: 'Все 1295 упражнений',
        titleEn: 'All 1295 exercises',
        description: 'Полный доступ ко всей базе. Бесплатно — по 6 упражнений на каждую мышцу.',
        descriptionEn: 'Full access to the entire database. Free — 6 exercises per muscle.',
        free: '6 на мышцу',
        freeEn: '6 per muscle',
        premium: '1295',
        premiumEn: '1295'
    },
    {
        icon: 'crosshair',
        title: 'Все программы тренировок',
        titleEn: 'All workout programs',
        description: '6 готовых программ под разные цели. Бесплатно — 1 программа.',
        descriptionEn: '6 ready-made programs for different goals. Free — 1 program.',
        free: '1',
        freeEn: '1',
        premium: '6',
        premiumEn: '6'
    },
    {
        icon: 'trending-up',
        title: 'Расширенный график прогресса',
        titleEn: 'Advanced progress chart',
        description: 'Отслеживай рост веса по ВСЕМ упражнениям без ограничений.',
        descriptionEn: 'Track weight growth across ALL exercises without limits.',
        free: '3 упражнения',
        freeEn: '3 exercises',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
    },
    {
        icon: 'refresh-cw',
        title: 'Замена упражнений без лимита',
        titleEn: 'Unlimited exercise replacements',
        description: 'Меняй упражнения под оборудование и условия без ограничений. Бесплатно — 3 раза в день.',
        descriptionEn: 'Replace exercises for equipment and conditions without limits. Free — 3 per day.',
        free: '3 / день',
        freeEn: '3 / day',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
    },
    {
        icon: 'chart-column-increasing',
        title: 'Экспорт в PDF',
        titleEn: 'PDF export',
        description: 'Сохрани свой прогресс, программы и достижения в PDF.',
        descriptionEn: 'Save your progress, programs, and achievements in PDF.',
        free: '—',
        freeEn: '—',
        premium: '✅',
        premiumEn: '✅'
    },
    {
        icon: 'image',
        title: 'Карточка тренировки PNG',
        titleEn: 'Workout card PNG',
        description: 'Делись своими тренировками без ограничений. Бесплатно — 1 карточка в неделю.',
        descriptionEn: 'Share your workouts without limits. Free — 1 card per week.',
        free: '1 / неделю',
        freeEn: '1 / week',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
    },
    {
        icon: 'trophy',
        title: 'Расширенная аналитика',
        titleEn: 'Advanced analytics',
        description: 'Подробная статистика: объём, интенсивность, тренды по неделям и месяцам.',
        descriptionEn: 'Detailed stats: volume, intensity, trends by week and month.',
        free: 'Базовая',
        freeEn: 'Basic',
        premium: 'Полная',
        premiumEn: 'Full'
    }
];

const premiumPlans = [
    {
        id: 'monthly',
        name: 'Премиум',
        nameEn: 'Premium',
        price: 3.99,
        currency: '$',
        period: 'USD / месяц',
        periodEn: 'USD / month',
        description: 'Полный доступ ко всем функциям',
        descriptionEn: 'Full access to all features',
        features: [
            '✅ Все 1295 упражнений без ограничений',
            '✅ Все 30 групп мышц',
            '✅ Все 6 программ тренировок',
            '✅ Расширенный график прогресса',
            '✅ Экспорт прогресса в PDF',
            '✅ Карточка тренировки PNG без ограничений',
            '✅ Замена упражнений без лимита',
            '✅ Отмена в любой момент'
        ],
        featuresEn: [
            '✅ All 1295 exercises unlocked',
            '✅ All 30 muscle groups',
            '✅ All 6 workout programs',
            '✅ Advanced progress chart',
            '✅ Progress export to PDF',
            '✅ Unlimited workout card PNG',
            '✅ Unlimited exercise replacements',
            '✅ Cancel anytime'
        ],
        badge: 'gem',
        badgeEn: 'gem',
        popular: true,
        savings: null
    }
];

// ============================================
// HELPERS
// ============================================

function getPremiumField(obj, field) {
    if (typeof currentLang === 'undefined' || currentLang === 'ru') {
        return obj[field];
    }
    const enField = field + 'En';
    return obj[enField] || obj[field];
}

console.log('✅ Премиум-данные загружены!');
console.log('💎 Тарифов: ' + premiumPlans.length);