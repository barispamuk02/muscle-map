// ============================================
// 🌍 ПЕРЕВОДЫ (i18n)
// ============================================
const translations = {
    ru: {
        'header.title': 'Калькулятор мышц',
        'header.subtitle': 'Выбери мышцу → узнай упражнения',
        'nav.muscles': 'Мышцы',
        'nav.recovery': 'Восстановление',
        'nav.nutrition': 'Питание',
        'nav.programs': 'Программы',
        'nav.premium': 'Премиум',
        'nav.share': 'Поделиться',
        'nav.random': 'Случайная',
        'nav.progress': 'Прогресс',
        'nav.theme': 'Сменить тему',
        'quote.label': 'ЦИТАТА ДНЯ',
        'stats.muscles': 'мышц',
        'stats.exercises': 'упражнений',
        'stats.animations': 'АНИМАЦИЙ',
        'stats.quotes': 'цитат',
        'stats.programs': 'программ',
        'stats.recovery': 'категорий ЛФК',
        'challenges.title': 'Челленджи',
        'challenges.hint': 'Выполняй упражнения → прогресс растёт',
        'search.placeholder': 'Найти мышцу...',
        'exercises.title': 'Упражнения',
        'exercises.all': 'Всё',
        'exercises.home': 'Дом',
        'exercises.gym': 'Зал',
        'tracker.title': 'Тренировка сегодня',
        'tracker.save': 'Сохранить в дневник',
        'water.title': 'Трекер воды',
        'premium.title': 'Muscle Map Премиум',
        'premium.cta': 'Оформить Премиум',
        'footer.disclaimer': 'Muscle Map — образовательный проект. Проконсультируйтесь с врачом.',
    },
    en: {
        'header.title': 'Muscle Calculator',
        'header.subtitle': 'Choose a muscle → discover exercises',
        'nav.muscles': 'Muscles',
        'nav.recovery': 'Recovery',
        'nav.nutrition': 'Nutrition',
        'nav.programs': 'Programs',
        'nav.premium': 'Premium',
        'nav.share': 'Share',
        'nav.random': 'Random',
        'nav.progress': 'Progress',
        'nav.theme': 'Change theme',
        'quote.label': 'QUOTE OF THE DAY',
        'stats.muscles': 'muscles',
        'stats.exercises': 'exercises',
        'stats.animations': 'ANIMATIONS',
        'stats.quotes': 'quotes',
        'stats.programs': 'programs',
        'stats.recovery': 'recovery categories',
        'challenges.title': 'Challenges',
        'challenges.hint': 'Do exercises → progress grows',
        'search.placeholder': 'Find a muscle...',
        'exercises.title': 'Exercises',
        'exercises.all': 'All',
        'exercises.home': 'Home',
        'exercises.gym': 'Gym',
        'tracker.title': 'Today\'s workout',
        'tracker.save': 'Save to log',
        'water.title': 'Water tracker',
        'premium.title': 'Muscle Map Premium',
        'premium.cta': 'Get Premium',
        'footer.disclaimer': 'Muscle Map — educational project. Consult a doctor.',
    }
};

let currentLang = localStorage.getItem('muscleMap_lang') || 'ru';

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
}

function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('muscleMap_lang', lang);
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    }
    document.documentElement.lang = currentLang;
}

console.log('✅ translations.js loaded | lang:', currentLang, '| keys:', Object.keys(translations.ru).length);

// Применяем переводы при загрузке
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});