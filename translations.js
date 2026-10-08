const translations = {
    ru: {
        'nav.muscles': 'Мышцы',
        'nav.recovery': 'Восстановление',
        // ... ещё ~200 ключей
    },
    en: {
        'nav.muscles': 'Muscles',
        'nav.recovery': 'Recovery',
        // ... ещё ~200 ключей
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
    if (langBtn) langBtn.textContent = currentLang === 'ru' ? 'EN' : 'RU';
}

console.log('✅ translations.js loaded | currentLang:', currentLang);