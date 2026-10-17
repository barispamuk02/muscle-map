// ============================================
// 💰 ПРЕМИУМ-РАЗДЕЛ
// ============================================

const premiumFeatures = [
    {
        icon: 'crosshair',
        title: 'Прогрессия по неделям',
        titleEn: 'Week-by-week progressions',
        description: 'Все 6 базовых программ доступны бесплатно. Premium открывает защищённую прогрессию по неделям.',
        descriptionEn: 'All six basic programs are free. Premium unlocks server-protected weekly progressions.',
        free: '6 базовых',
        freeEn: '6 basic',
        premium: '6 прогрессий',
        premiumEn: '6 progressions'
    },
    {
        icon: 'chart-column-increasing',
        title: 'Расширенная аналитика',
        titleEn: 'Advanced analytics',
        description: 'Глубокие графики, сравнение периодов, объём по неделям. Бесплатно — базовые графики.',
        descriptionEn: 'Deep charts, period comparison, weekly volume. Free — basic charts.',
        free: 'Базовая',
        freeEn: 'Basic',
        premium: 'Полная',
        premiumEn: 'Full'
    },
    {
        icon: 'trending-up',
        title: 'График по всем упражнениям',
        titleEn: 'Chart for all exercises',
        description: 'Отслеживай рост веса по всем упражнениям. Бесплатно — только 6 упражнений.',
        descriptionEn: 'Track weight growth across all exercises. Free — only 6 exercises.',
        free: '6 упражнений',
        freeEn: '6 exercises',
        premium: 'Все',
        premiumEn: 'All'
    },
    {
        icon: 'image',
        title: 'Карточка без логотипа',
        titleEn: 'Card without logo',
        description: 'Делись тренировками без логотипа Muscle Map. Бесплатно — с логотипом.',
        descriptionEn: 'Share workouts without the Muscle Map logo. Free — with logo.',
        free: 'С логотипом',
        freeEn: 'With logo',
        premium: 'Без логотипа',
        premiumEn: 'No logo'
    },
    {
        icon: 'file-text',
        title: 'PDF-отчёты',
        titleEn: 'PDF reports',
        description: 'Подробные PDF-отчёты по прогрессу, программам и достижениям.',
        descriptionEn: 'Detailed PDF reports on progress, programs, and achievements.',
        free: '—',
        freeEn: '—',
        premium: '✅',
        premiumEn: '✅'
    },
    {
        icon: 'refresh-cw',
        title: 'Замена упражнений без лимита',
        titleEn: 'Unlimited replacements',
        description: 'Меняй упражнения без ограничений. Бесплатно — 3 раза в день.',
        descriptionEn: 'Replace exercises without limits. Free — 3 per day.',
        free: '3 / день',
        freeEn: '3 / day',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
    },
    {
        icon: 'circle-check-big',
        title: 'Тренировки без лимита',
        titleEn: 'Unlimited workouts',
        description: 'Добавляй неограниченное число упражнений в тренировку. Бесплатно — 6.',
        descriptionEn: 'Add unlimited exercises to your workout. Free — 6.',
        free: '6',
        freeEn: '6',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
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
            '✅ Прогрессия по неделям для 6 программ',
            '✅ Расширенный график прогресса',
            '✅ Экспорт прогресса в PDF',
            '✅ Карточка тренировки PNG без ограничений',
            '✅ Замена упражнений без лимита',
            '✅ Отмена в любой момент'
        ],
        featuresEn: [
            '✅ All 1295 exercises unlocked',
            '✅ All 30 muscle groups',
            '✅ Week-by-week progression for 6 programs',
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