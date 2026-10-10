// ============================================
// 🌍 ПЕРЕВОДЫ (i18n) — Muscle Map
// ============================================
const translations = {
    ru: {
        // ШАПКА
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

        // ЦИТАТА
        'quote.label': 'ЦИТАТА ДНЯ',
        'quote.share': 'Поделиться',
        'quote.copy': 'Скопировать',

        // СТАТИСТИКА
        'stats.muscles': 'мышц',
        'stats.exercises': 'упражнений',
        'stats.animations': 'АНИМАЦИЙ',
        'stats.quotes': 'цитат',
        'stats.programs': 'программ',
        'stats.recovery': 'категорий ЛФК',

        // ЧЕЛЛЕНДЖИ
        'challenges.title': 'Челленджи',
        'challenges.hint': 'Выполняй упражнения → прогресс растёт',

        // ПОИСК
        'search.placeholder': 'Найти мышцу...',

        // ВОССТАНОВЛЕНИЕ
        'recovery.title': 'Восстановление после травм',
        'recovery.warningStrong': 'Важно:',
        'recovery.warning': 'эти упражнения — для профилактики и лёгких состояний. При острой боли, после операции или травмы — консультация врача обязательна!',
        'recovery.placeholder.title': 'Выбери категорию слева',
        'recovery.placeholder.subtitle': 'Программы реабилитации и ЛФК',

        // МЫШЦЫ
        'muscles.all': 'Все',
        'muscles.favorites': 'Избранное',
        'muscles.favoritesEmpty': 'Нет избранных мышц',
        'muscles.views': 'Просмотров',
        'muscles.viewFront': 'Вид спереди',
        'muscles.viewBack': 'Вид сзади',

        // УПРАЖНЕНИЯ
        'exercises.title': 'Упражнения',
        'exercises.all': 'Всё',
        'exercises.home': 'Дом',
        'exercises.gym': 'Зал',
        'exercises.showMore': 'Показать ещё',
        'exercises.counter': 'Показано',
        'exercises.of': 'из',
        'exercises.none': 'Нет упражнений для этого фильтра',
        'exercises.instructions': 'Инструкция',
        'exercises.description': 'Описание',
        'exercises.sets': 'Подходы',
        'exercises.markDone': 'Отметить выполненным',
        'exercises.done': 'Выполнено',
        'exercises.replace': 'Заменить',
        'exercises.moreCount': 'Ещё',
        'exercises.premiumUnlock': 'Премиум откроет всю базу упражнений',


        // СИНЕРГИСТЫ И ОШИБКИ
        'synergists.title': 'Мышцы в работе',
        'mistakes.title': 'Частые ошибки',
        'anatomy.title': 'Анатомия',

        // ТРЕКЕР
        'tracker.title': 'Тренировка сегодня',
        'tracker.noSets': 'Пока нет записанных подходов',
        'tracker.lastTime': 'В прошлый раз',
        'tracker.addFirst': 'Добавь первый подход ниже',
        'tracker.exercisePlaceholder': 'Упражнение (напр. Жим лёжа)',
        'tracker.weight': 'Вес (кг)',
        'tracker.reps': 'Повторы',
        'tracker.add': 'Добавить',
        'tracker.save': 'Сохранить в дневник',
        'tracker.clear': 'Очистить',
        'tracker.sets': 'подходов',
        'tracker.kgVolume': 'кг объём',
        'tracker.repsError': 'Введите повторы',

        // ОТДЫХ
        'rest.title': 'Отдых между подходами',
        'rest.auto': 'Автозапуск',
        'rest.ready': 'Готов',
        'rest.pause': 'Пауза',
        'rest.resume': 'Продолжить',
        'rest.reset': 'Сброс',
        'rest.sec': 'сек',
        'rest.min': 'мин',

        // ВОДА
        'water.title': 'Трекер воды',
        'water.unit': 'мл',
        'water.goal': 'Цель по воде достигнута!',
        'water.reset': 'Сбросить воду за сегодня?',
        'water.resetDone': 'Сброшено',

        // ДНЕВНИК
        'log.title': 'Дневник тренировок',
        'log.empty': 'Пока нет сохранённых тренировок',
        'log.sets': 'подх.',
        'log.max': 'макс',
        'log.repeat': 'Повторить',
        'log.card': 'Карточка',
        'log.clear': 'Очистить дневник',
        'log.clearConfirm': 'Удалить ВСЮ историю тренировок?',
        'log.cleared': 'Дневник очищен',
        'log.repeatConfirm': 'Повторить тренировку от',
        'log.chartTitle': 'Прогресс по упражнению',
        'log.min': 'Мин:',
'log.growth': 'Рост:',
'log.chartTitle': 'Прогресс по упражнению',

        // СРАВНЕНИЕ
        'compare.title': 'Сравнить тренировки',
        'compare.needTwo': 'Нужно минимум 2 записи в дневнике, чтобы сравнить',
        'compare.matching': 'СОВПАДАЮЩИЕ УПРАЖНЕНИЯ',
        'compare.was': 'БЫЛО',
        'compare.became': 'СТАЛО',
        'compare.schemeChanged': 'Схема подходов изменилась; прямое сравнение ограничено',
        'compare.sameScheme': 'Схема подходов не изменилась',
        'compare.volume': 'Объём',
        'compare.reps': 'повторов',
        'compare.added': 'Добавлено',
        'compare.removed': 'Убрано',
        'compare.outOfCatalog': 'Упражнения вне каталога',
        'compare.kgReps': 'кг·повторов',

        // КАРТОЧКА
        'card.title': 'Карточка тренировки',
        'card.mode': 'Режим:',
        'card.plan': 'План',
        'card.result': 'Результат',
        'card.show': 'Показывать в карточке:',
        'card.date': 'Дата тренировки',
        'card.weights': 'Веса',
        'card.reps': 'Повторы',
        'card.download': 'Скачать PNG',
        'card.share': 'Поделиться',
        'card.downloaded': 'Карточка скачана',
        'card.done': 'Сделано в Muscle Map',
        'card.planLabel': 'ПЛАН ТРЕНИРОВКИ',
        'card.resultLabel': 'РЕЗУЛЬТАТ',

        // ЗАМЕНА
        'replace.title': 'Заменить упражнение',
        'replace.source': 'ИСХОДНОЕ:',
        'replace.reason': 'Причина замены:',
        'replace.busy': 'Оборудование занято',
        'replace.home': 'Тренируюсь дома',
        'replace.hard': 'Слишком сложно',
        'replace.setupEquip': 'Настроить оборудование',
        'replace.suitable': 'ПОДХОДЯЩИЕ ВАРИАНТЫ',
        'replace.why': 'Почему подходит:',
        'replace.what': 'Что изменится:',
        'replace.select': 'Выбрать',
        'replace.noResults': 'По выбранным условиям замена не найдена. Измените оборудование или причину.',
        'replace.noData': 'Недостаточно данных для подбора',
        'replace.notFound': 'Замена не найдена',
        'replace.confirm': 'Заменить',
        'replace.on': 'на',
        'replace.whyPrimary': 'Основная целевая мышца сохраняется.',
'replace.sameEquip': 'Схожее оборудование.',
'replace.equipment': 'Оборудование',
'replace.chooseWeight': 'Рабочий вес нужно выбрать отдельно.',

        // ПИТАНИЕ
        'nutrition.title': 'Калькулятор питания',
        'nutrition.subtitle': 'Рассчитай свою норму калорий и БЖУ под цель',
        'nutrition.yourData': 'Твои данные',
        'nutrition.gender': 'Пол:',
        'nutrition.male': 'Мужчина',
        'nutrition.female': 'Женщина',
        'nutrition.age': 'Возраст (лет):',
        'nutrition.weight': 'Вес (кг):',
        'nutrition.height': 'Рост (см):',
        'nutrition.activity': 'Активность:',
        'nutrition.goal': 'Цель:',
        'nutrition.yourNorm': 'Твоя норма',
        'nutrition.kcal': 'ккал / день',
        'nutrition.protein': 'Белки',
        'nutrition.fat': 'Жиры',
        'nutrition.carbs': 'Углеводы',
        'nutrition.examples': 'Примеры продуктов',
        'nutrition.warning': 'Расчёт — ориентировочный. Для точного плана обратитесь к диетологу.',
        'nutrition.supplements': 'Спортивные добавки',
        'nutrition.supplSubtitle': 'Что принимать, зачем, и чем заменить натуральными продуктами',
        'nutrition.supplSearch': 'Поиск по добавкам...',
        'nutrition.supplAll': 'Все',
        'nutrition.supplMore': 'Подробнее',
        'nutrition.supplLess': 'Свернуть',
        'nutrition.supplNotFood': 'Важно: добавки не заменяют полноценное питание и не являются лекарством. Перед приёмом проконсультируйтесь с врачом.',

        // ПРОГРАММЫ
        'programs.title': 'Программы тренировок',
        'programs.subtitle': 'Готовые планы под разные цели',
        'programs.choose': 'Выбери программу слева',
        'programs.count': 'готовых планов',
        'programs.days': 'Дни тренировок',
'programs.tips': 'Советы',

        // ПРЕМИУМ
        'premium.title': 'Muscle Map Премиум',
        'premium.subtitle': 'Открой все возможности для максимального прогресса',
        'premium.cta': 'Оформить Премиум',
        'premium.hint': 'Оплата через Dodo Payments. Отмена в любой момент.',
        'premium.faq.pay': 'Как оплатить?',
        'premium.faq.payA': 'Оплата через Dodo Payments (карта). Скоро откроем.',
        'premium.faq.cancel': 'Как отменить?',
        'premium.faq.cancelA': 'В Dodo Customer Portal — ссылка в письме после оплаты.',
        'premium.faq.mobile': 'Работает на телефоне?',
        'premium.faq.mobileA': 'Да, работает на всех устройствах.',

        // ПРОГРЕСС
        'dashboard.title': 'Твой прогресс',
        'dashboard.calendar': 'Календарь активности (30 дней)',
        'dashboard.analytics': 'Аналитика',
        'dashboard.volume': 'Объём по дням',
        'dashboard.top': 'Топ-5 упражнений',
        'dashboard.streak': 'Streak-календарь',
        'dashboard.achievements': 'Достижения',
        'dashboard.recent': 'Последние выполненные',
        'dashboard.data': 'Данные',
        'dashboard.download': 'Скачать прогресс',
        'dashboard.upload': 'Загрузить прогресс',
        'dashboard.pdf': 'Скачать PDF',

        // ФОРМА
        'feedback.title': 'Есть идея или предложение?',
        'feedback.subtitle': 'Предложи новое упражнение или улучшение сайта — мы рассмотрим!',
        'feedback.typePlaceholder': 'Что предложить?',
        'feedback.namePlaceholder': 'Как вас зовут? (необязательно)',
        'feedback.messagePlaceholder': 'Опишите предложение подробнее...',
        'feedback.emailPlaceholder': 'Email для ответа (необязательно)',
        'feedback.send': 'Отправить',
        'feedback.successTitle': 'Спасибо за предложение!',
        'feedback.successText': 'Мы рассмотрим его и свяжемся, если нужно.',

        // ФУТЕР
        'footer.muscles': 'мышц',
        'footer.exercises': 'упражнений',
        'footer.quotes': 'цитат',
        'footer.programs': 'программ',
        'footer.disclaimer': 'Muscle Map — образовательный проект. Перед началом тренировок или программы восстановления проконсультируйтесь с врачом. Мы не несём ответственности за травмы, полученные при самостоятельных занятиях.',
        'footer.copy': 'Muscle Map © 2026 — сделано с любовью к фитнесу',

        // ОБЩЕЕ
        'common.yes': 'Да',
        'common.no': 'Нет',
        'common.cancel': 'Отмена',
        'common.ok': 'ОК',
        'common.close': 'Закрыть',
        'common.save': 'Сохранить',
        'common.delete': 'Удалить',
        'common.error': 'Ошибка',
        'common.loading': 'Загрузка...',
        'common.kg': 'кг',
    },

    en: {
        // HEADER
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

        // QUOTE
        'quote.label': 'QUOTE OF THE DAY',
        'quote.share': 'Share',
        'quote.copy': 'Copy',

        // STATS
        'stats.muscles': 'muscles',
        'stats.exercises': 'exercises',
        'stats.animations': 'ANIMATIONS',
        'stats.quotes': 'quotes',
        'stats.programs': 'programs',
        'stats.recovery': 'recovery categories',

        // CHALLENGES
        'challenges.title': 'Challenges',
        'challenges.hint': 'Do exercises → progress grows',

        // SEARCH
        'search.placeholder': 'Find a muscle...',

        // RECOVERY
        'recovery.title': 'Recovery after injuries',
        'recovery.warningStrong': 'Important:',
        'recovery.warning': 'these exercises are for prevention and mild conditions. For acute pain, after surgery or injury — consultation with a doctor is required!',
        'recovery.placeholder.title': 'Choose a category on the left',
        'recovery.placeholder.subtitle': 'Rehabilitation and physical therapy programs',

        // MUSCLES
        'muscles.all': 'All',
        'muscles.favorites': 'Favorites',
        'muscles.favoritesEmpty': 'No favorite muscles',
        'muscles.views': 'Views',
        'muscles.viewFront': 'Front view',
        'muscles.viewBack': 'Back view',

        // EXERCISES
        'exercises.title': 'Exercises',
        'exercises.all': 'All',
        'exercises.home': 'Home',
        'exercises.gym': 'Gym',
        'exercises.showMore': 'Show more',
        'exercises.counter': 'Showing',
        'exercises.of': 'of',
        'exercises.none': 'No exercises for this filter',
        'exercises.instructions': 'Instructions',
        'exercises.description': 'Description',
        'exercises.sets': 'Sets',
        'exercises.markDone': 'Mark as done',
        'exercises.done': 'Done',
        'exercises.replace': 'Replace',
        'exercises.moreCount': 'More',
        'exercises.premiumUnlock': 'Premium unlocks the entire exercise base',
     

        // SYNERGISTS & MISTAKES
        'synergists.title': 'Muscles involved',
        'mistakes.title': 'Common mistakes',
        'anatomy.title': 'Anatomy',

        // TRACKER
        'tracker.title': 'Today\'s workout',
        'tracker.noSets': 'No sets recorded yet',
        'tracker.lastTime': 'Last time',
        'tracker.addFirst': 'Add first set below',
        'tracker.exercisePlaceholder': 'Exercise (e.g. Bench press)',
        'tracker.weight': 'Weight (kg)',
        'tracker.reps': 'Reps',
        'tracker.add': 'Add',
        'tracker.save': 'Save to log',
        'tracker.clear': 'Clear',
        'tracker.sets': 'sets',
        'tracker.kgVolume': 'kg volume',
        'tracker.repsError': 'Enter reps',

        // REST
        'rest.title': 'Rest between sets',
        'rest.auto': 'Auto-start',
        'rest.ready': 'Ready',
        'rest.pause': 'Pause',
        'rest.resume': 'Resume',
        'rest.reset': 'Reset',
        'rest.sec': 'sec',
        'rest.min': 'min',

        // WATER
        'water.title': 'Water tracker',
        'water.unit': 'ml',
        'water.goal': 'Water goal achieved!',
        'water.reset': 'Reset water for today?',
        'water.resetDone': 'Reset',

        // LOG
        'log.title': 'Workout log',
        'log.empty': 'No saved workouts yet',
        'log.sets': 'sets',
        'log.max': 'max',
        'log.repeat': 'Repeat',
        'log.card': 'Card',
        'log.clear': 'Clear log',
        'log.clearConfirm': 'Delete ALL workout history?',
        'log.cleared': 'Log cleared',
        'log.repeatConfirm': 'Repeat workout from',
        'log.chartTitle': 'Progress by exercise',
        'log.min': 'Min:',
'log.growth': 'Growth:',
'log.chartTitle': 'Progress by exercise',

        // COMPARE
        'compare.title': 'Compare workouts',
        'compare.needTwo': 'Need at least 2 log entries to compare',
        'compare.matching': 'MATCHING EXERCISES',
        'compare.was': 'WAS',
        'compare.became': 'BECAME',
        'compare.schemeChanged': 'Set scheme changed; direct comparison is limited',
        'compare.sameScheme': 'Set scheme unchanged',
        'compare.volume': 'Volume',
        'compare.reps': 'reps',
        'compare.added': 'Added',
        'compare.removed': 'Removed',
        'compare.outOfCatalog': 'Exercises out of catalog',
        'compare.kgReps': 'kg·reps',

        // CARD
        'card.title': 'Workout card',
        'card.mode': 'Mode:',
        'card.plan': 'Plan',
        'card.result': 'Result',
        'card.show': 'Show in card:',
        'card.date': 'Workout date',
        'card.weights': 'Weights',
        'card.reps': 'Reps',
        'card.download': 'Download PNG',
        'card.share': 'Share',
        'card.downloaded': 'Card downloaded',
        'card.done': 'Made in Muscle Map',
        'card.planLabel': 'WORKOUT PLAN',
        'card.resultLabel': 'RESULT',

        // REPLACE
        'replace.title': 'Replace exercise',
        'replace.source': 'SOURCE:',
        'replace.reason': 'Reason:',
        'replace.busy': 'Equipment busy',
        'replace.home': 'Training at home',
        'replace.hard': 'Too difficult',
        'replace.setupEquip': 'Setup equipment',
        'replace.suitable': 'SUITABLE OPTIONS',
        'replace.why': 'Why it fits:',
        'replace.what': 'What changes:',
        'replace.select': 'Select',
        'replace.noResults': 'No replacement found for these conditions. Change equipment or reason.',
        'replace.noData': 'Not enough data to match',
        'replace.notFound': 'No replacement found',
        'replace.confirm': 'Replace',
        'replace.on': 'with',
        'replace.whyPrimary': 'Primary target muscle is preserved.',
'replace.sameEquip': 'Similar equipment.',
'replace.equipment': 'Equipment',
'replace.chooseWeight': 'Working weight must be chosen separately.',

        // NUTRITION
        'nutrition.title': 'Nutrition calculator',
        'nutrition.subtitle': 'Calculate your calories and macros for your goal',
        'nutrition.yourData': 'Your data',
        'nutrition.gender': 'Gender:',
        'nutrition.male': 'Male',
        'nutrition.female': 'Female',
        'nutrition.age': 'Age (years):',
        'nutrition.weight': 'Weight (kg):',
        'nutrition.height': 'Height (cm):',
        'nutrition.activity': 'Activity:',
        'nutrition.goal': 'Goal:',
        'nutrition.yourNorm': 'Your norm',
        'nutrition.kcal': 'kcal / day',
        'nutrition.protein': 'Protein',
        'nutrition.fat': 'Fat',
        'nutrition.carbs': 'Carbs',
        'nutrition.examples': 'Food examples',
        'nutrition.warning': 'Calculation is approximate. Consult a nutritionist for a precise plan.',
        'nutrition.supplements': 'Sports supplements',
        'nutrition.supplSubtitle': 'What to take, why, and how to replace with natural foods',
        'nutrition.supplSearch': 'Search supplements...',
        'nutrition.supplAll': 'All',
        'nutrition.supplMore': 'Details',
        'nutrition.supplLess': 'Collapse',
        'nutrition.supplNotFood': 'Important: supplements do not replace a balanced diet and are not medicine. Consult a doctor before use.',

        // PROGRAMS
        'programs.title': 'Workout programs',
        'programs.subtitle': 'Ready-made plans for different goals',
        'programs.choose': 'Choose a program on the left',
        'programs.count': 'ready plans',
        'programs.days': 'Training days',
'programs.tips': 'Tips',

        // PREMIUM
        'premium.title': 'Muscle Map Premium',
        'premium.subtitle': 'Unlock all features for maximum progress',
        'premium.cta': 'Get Premium',
        'premium.hint': 'Payment via Dodo Payments. Cancel anytime.',
        'premium.faq.pay': 'How to pay?',
        'premium.faq.payA': 'Payment via Dodo Payments (card). Coming soon.',
        'premium.faq.cancel': 'How to cancel?',
        'premium.faq.cancelA': 'In Dodo Customer Portal — link in email after payment.',
        'premium.faq.mobile': 'Works on mobile?',
        'premium.faq.mobileA': 'Yes, works on all devices.',

        // DASHBOARD
        'dashboard.title': 'Your progress',
        'dashboard.calendar': 'Activity calendar (30 days)',
        'dashboard.analytics': 'Analytics',
        'dashboard.volume': 'Volume by day',
        'dashboard.top': 'Top-5 exercises',
        'dashboard.streak': 'Streak calendar',
        'dashboard.achievements': 'Achievements',
        'dashboard.recent': 'Recently completed',
        'dashboard.data': 'Data',
        'dashboard.download': 'Download progress',
        'dashboard.upload': 'Upload progress',
        'dashboard.pdf': 'Download PDF',

        // FEEDBACK FORM
        'feedback.title': 'Have an idea or suggestion?',
        'feedback.subtitle': 'Suggest a new exercise or site improvement — we\'ll review it!',
        'feedback.typePlaceholder': 'What to suggest?',
        'feedback.namePlaceholder': 'Your name? (optional)',
        'feedback.messagePlaceholder': 'Describe your suggestion in detail...',
        'feedback.emailPlaceholder': 'Email for reply (optional)',
        'feedback.send': 'Send',
        'feedback.successTitle': 'Thanks for your suggestion!',
        'feedback.successText': 'We\'ll review it and contact you if needed.',

        // FOOTER
        'footer.muscles': 'muscles',
        'footer.exercises': 'exercises',
        'footer.quotes': 'quotes',
        'footer.programs': 'programs',
        'footer.disclaimer': 'Muscle Map — educational project. Consult a doctor before starting training or a recovery program. We are not responsible for injuries during self-training.',
        'footer.copy': 'Muscle Map © 2026 — made with love for fitness',

        // COMMON
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.cancel': 'Cancel',
        'common.ok': 'OK',
        'common.close': 'Close',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.error': 'Error',
        'common.loading': 'Loading...',
        'common.kg': 'kg',
           
    }
};
// ============================================
// 🌍 ПЕРЕВОДЫ ОБОРУДОВАНИЯ
// ============================================
const equipmentTranslations = {
    ru: {
        'body weight': 'Своё тело',
        'dumbbell': 'Гантели',
        'barbell': 'Штанга',
        'cable': 'Блок',
        'machine': 'Тренажёр',
        'smith machine': 'Смит',
        'ez barbell': 'EZ-штанга',
        'olympic barbell': 'Олимпийская штанга',
        'kettlebell': 'Гиря',
        'band': 'Эспандер',
        'stability ball': 'Фитбол',
        'medicine ball': 'Медбол',
        'leverage machine': 'Рычажный',
        'assisted': 'С поддержкой',
        'weighted': 'С отягощением',
        'bosu ball': 'Босу',
        'rope': 'Канат',
        'trap bar': 'Трап-штанга',
        'wheel roller': 'Ролик',
    },
    en: {
        'body weight': 'Body weight',
        'dumbbell': 'Dumbbell',
        'barbell': 'Barbell',
        'cable': 'Cable',
        'machine': 'Machine',
        'smith machine': 'Smith machine',
        'ez barbell': 'EZ barbell',
        'olympic barbell': 'Olympic barbell',
        'kettlebell': 'Kettlebell',
        'band': 'Band',
        'stability ball': 'Stability ball',
        'medicine ball': 'Medicine ball',
        'leverage machine': 'Leverage machine',
        'assisted': 'Assisted',
        'weighted': 'Weighted',
        'bosu ball': 'Bosu ball',
        'rope': 'Rope',
        'trap bar': 'Trap bar',
        'wheel roller': 'Wheel roller',
    }
};

function getEquipmentName(equipmentKey) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    if (equipmentTranslations[lang] && equipmentTranslations[lang][equipmentKey]) {
        return equipmentTranslations[lang][equipmentKey];
    }
    return equipmentKey;
}
// ============================================
// ФУНКЦИИ
// ============================================
let currentLang = localStorage.getItem('muscleMap_lang') || 'ru';

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || key;
}

function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('muscleMap_lang', lang);
    applyTranslations();
    
    // Перерисовать динамические блоки
    if (typeof renderList === 'function' && typeof muscleDatabase !== 'undefined') {
        try {
            renderList(Object.values(muscleDatabase));
        } catch(e) {
            console.warn('renderList error:', e);
        }
    }
    
    // Обновить кнопку «Вид»
    if (typeof currentView !== 'undefined') {
        const btn = document.getElementById('viewToggle');
        if (btn) btn.innerHTML = currentView === 'front' 
            ? `<span data-svg="refresh-cw" data-svg-size="16"></span> ${t('muscles.viewBack')}` 
            : `<span data-svg="refresh-cw" data-svg-size="16"></span> ${t('muscles.viewFront')}`;
    }
    
    // Перерисовать карточку мышцы (если открыта)
    if (typeof currentMuscleId !== 'undefined' && typeof muscleDatabase !== 'undefined' && currentMuscleId) {
        try {
            const muscle = muscleDatabase[currentMuscleId];
            if (muscle && typeof renderInfo === 'function') renderInfo(muscle);
        } catch(e) {
            console.warn('renderInfo error:', e);
        }
    }
    
    // 🏋️ Перерисовать программы (если открыт раздел)
    if (typeof renderPrograms === 'function' && typeof programsContainer !== 'undefined' && programsContainer) {
        try {
            renderPrograms();
        } catch(e) {
            console.warn('renderPrograms error:', e);
        }
    }
}

// ============================================
// 🏋️ ПЕРЕВОД НАЗВАНИЙ УПРАЖНЕНИЙ В ПРОГРАММАХ
// ============================================
function getProgramExerciseName(ruName) {
    // Если язык русский — возвращаем как есть
    if (typeof currentLang === 'undefined' || currentLang === 'ru') {
        return ruName;
    }
    
    // Ищем упражнение в базе по русскому названию
    if (typeof exerciseDatabase !== 'undefined') {
        const found = exerciseDatabase.find(e => e.name === ruName);
        if (found && found.name_en) {
            return found.name_en;
        }
    }
    
    // Fallback — оставляем как есть
    return ruName;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translated = t(key);
        
        const svgIcon = el.querySelector('svg');
        const svgPlaceholder = el.querySelector('[data-svg]');
        
        if (svgIcon || svgPlaceholder) {
            let replaced = false;
            for (let i = el.childNodes.length - 1; i >= 0; i--) {
                const node = el.childNodes[i];
                if (node.nodeType === 3 && node.textContent.trim()) {
                    node.textContent = ' ' + translated;
                    replaced = true;
                    break;
                }
            }
            if (!replaced) {
                el.appendChild(document.createTextNode(' ' + translated));
            }
        } else {
            el.textContent = translated;
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });
    
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    
    document.documentElement.lang = currentLang;
}

console.log('✅ translations.js loaded | lang:', currentLang, '| keys:', Object.keys(translations.ru).length);

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});

// ============================================
// 🌍 АВТО-ПЕРЕПРИМЕНЕНИЕ ПЕРЕВОДОВ
// ============================================
// 1. При полной загрузке страницы
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof applyTranslations === 'function') applyTranslations();
    }, 100);
    setTimeout(() => {
        if (typeof applyTranslations === 'function') applyTranslations();
    }, 500);
});

// 2. При любом изменении DOM (MutationObserver)
if (typeof MutationObserver !== 'undefined') {
    let timeoutId;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (typeof applyTranslations === 'function') applyTranslations();
        }, 100);
    });
    
    const startObserving = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('🌍 MutationObserver запущен');
        }
    };
    
    if (document.body) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }
}