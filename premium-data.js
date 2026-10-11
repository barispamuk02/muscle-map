// ============================================
// 💰 ПРЕМИУМ-РАЗДЕЛ
// ============================================

const premiumFeatures = [
    {
        icon: '📈',
        title: 'Расширенный график прогресса',
        titleEn: 'Advanced progress chart',
        description: 'Отслеживай рост веса по ВСЕМ упражнениям без ограничений. Бесплатно — только 3 упражнения.',
        descriptionEn: 'Track weight growth across ALL exercises without limits. Free — only 3 exercises.',
        free: '3 упражнения',
        freeEn: '3 exercises',
        premium: 'Без ограничений',
        premiumEn: 'Unlimited'
    },
    {
        icon: '🎯',
        title: 'Персональные программы',
        titleEn: 'Personal programs',
        description: 'Готовые программы под твою цель, уровень и доступное оборудование.',
        descriptionEn: 'Ready-made programs for your goal, level, and available equipment.',
        free: '—',
        freeEn: '—',
        premium: '6+ программ',
        premiumEn: '6+ programs'
    },
    {
        icon: '📊',
        title: 'Экспорт в PDF',
        titleEn: 'PDF export',
        description: 'Сохрани свой прогресс, программы и достижения в красивом PDF.',
        descriptionEn: 'Save your progress, programs, and achievements in a beautiful PDF.',
        free: '—',
        freeEn: '—',
        premium: '✅',
        premiumEn: '✅'
    },
    {
        icon: '🎬',
        title: 'HD-видео упражнений',
        titleEn: 'HD exercise videos',
        description: 'Качественные видео-демонстрации техники выполнения каждого упражнения.',
        descriptionEn: 'High-quality video demonstrations of each exercise technique.',
        free: 'GIF 180p',
        freeEn: 'GIF 180p',
        premium: 'Скоро',
        premiumEn: 'Coming soon'
    },
    {
        icon: '🏆',
        title: 'Расширенная аналитика',
        titleEn: 'Advanced analytics',
        description: 'Подробная статистика: объём, интенсивность, тренды по неделям и месяцам.',
        descriptionEn: 'Detailed stats: volume, intensity, trends by week and month.',
        free: 'Базовая',
        freeEn: 'Basic',
        premium: 'Полная',
        premiumEn: 'Full'
    },
    {
        icon: '🚫',
        title: 'Без рекламы',
        titleEn: 'No ads',
        description: 'Никаких баннеров и всплывающих окон — только тренировки.',
        descriptionEn: 'No banners or pop-ups — just workouts.',
        free: 'Реклама',
        freeEn: 'Ads',
        premium: 'Без рекламы',
        premiumEn: 'No ads'
    },
    {
        icon: '💾',
        title: 'Облачное сохранение',
        titleEn: 'Cloud sync',
        description: 'Твой прогресс в облаке — доступен с любого устройства.',
        descriptionEn: 'Your progress in the cloud — accessible from any device.',
        free: '—',
        freeEn: '—',
        premium: 'Скоро',
        premiumEn: 'Coming soon'
    },
    {
        icon: '💬',
        title: 'Приоритетная поддержка',
        titleEn: 'Priority support',
        description: 'Ответим на вопросы в течение 24 часов.',
        descriptionEn: 'We respond to your questions within 24 hours.',
        free: '—',
        freeEn: '—',
        premium: 'Скоро',
        premiumEn: 'Coming soon'
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
            '✅ Расширенный график прогресса',
            '✅ Экспорт прогресса в PDF',
            '✅ Отмена в любой момент'
        ],
        featuresEn: [
            '✅ All 1295 exercises unlocked',
            '✅ All 30 muscle groups',
            '✅ Advanced progress chart',
            '✅ Progress export to PDF',
            '✅ Cancel anytime'
        ],
        badge: '💎 Premium',
        badgeEn: '💎 Premium',
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
    return obj[enField] || obj[field]; // fallback на RU
}

console.log('✅ Премиум-данные загружены!');
console.log('💎 Тарифов: ' + premiumPlans.length);