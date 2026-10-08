// ============================================
// 🌍 ПЕРЕВОДЫ МЫШЦ (RU / EN)
// ============================================

const muscleTranslations = {
    ru: {
        'male_sternocleidomastoid': {
            name: 'Грудино-ключично-сосцевидная мышца',
            description: 'Самая крупная мышца шеи, расположена по бокам от трахеи.',
            function: 'Наклоняет голову в сторону и поворачивает в противоположную, наклоняет голову вперёд.',
        },
        'male_trapezius_upper': {
            name: 'Верхний пучок трапециевидной мышцы',
            description: 'Верхняя часть трапециевидной мышцы, формирует рельеф шеи.',
            function: 'Поднимает лопатку вверх, наклоняет голову в сторону.',
        },
        'male_face': {
            name: 'Мышцы лица',
            description: 'Лобная, круговая мышца глаза, круговая мышца рта, скуловые и другие.',
            function: 'Отвечают за мимику и артикуляцию.',
        },
        'male_pectoralis_major': {
            name: 'Большая грудная мышца',
            description: 'Самая крупная мышца груди, формирует рельеф грудной клетки.',
            function: 'Приводит плечо к туловищу, вращает его внутрь, сгибает руку.',
        },
        'male_pectoralis_minor': {
            name: 'Малая грудная мышца',
            description: 'Расположена под большой грудной мышцей.',
            function: 'Тянет лопатку вперёд и вниз, участвует в дыхании.',
        },
        'male_serratus_anterior': {
            name: 'Передняя зубчатая мышца',
            description: 'Мышца на боковой поверхности грудной клетки с зубчатым краем.',
            function: 'Тянет лопатку вперёд и вниз, участвует в подъёме руки выше горизонтали.',
        },
        'male_rectus_abdominis': {
            name: 'Прямая мышца живота',
            description: 'Основная мышца пресса, формирует «кубики».',
            function: 'Сгибает туловище вперёд, стабилизирует корпус.',
        },
        'male_obliquus_externus': {
            name: 'Наружная косая мышца живота',
            description: 'Самая поверхностная из боковых мышц живота.',
            function: 'Сгибает и поворачивает туловище, стабилизирует корпус.',
        },
        'male_obliquus_internus': {
            name: 'Внутренняя косая мышца живота',
            description: 'Находится под наружной косой мышцей.',
            function: 'Сгибает и поворачивает туловище, стабилизирует корпус.',
        },
        'male_transversus_abdominis': {
            name: 'Поперечная мышца живота',
            description: 'Самая глубокая мышца живота, создаёт «корсет».',
            function: 'Стабилизирует корпус, участвует в выдохе.',
        },
        'male_trapezius_middle': {
            name: 'Средний пучок трапециевидной мышцы',
            description: 'Средняя часть трапециевидной мышцы.',
            function: 'Сводит лопатки вместе.',
        },
        'male_latissimus_dorsi': {
            name: 'Широчайшая мышца спины',
            description: 'Самая широкая мышца спины, формирует V-образный силуэт.',
            function: 'Приводит плечо к туловищу, разгибает плечо, вращает внутрь.',
        },
        'male_rhomboids': {
            name: 'Ромбовидные мышцы',
            description: 'Большая и малая ромбовидные мышцы, расположены под трапецией.',
            function: 'Сводят лопатки вместе, поднимают их.',
        },
        'male_erector_spinae': {
            name: 'Мышца, выпрямляющая позвоночник',
            description: 'Мощная мышца, идущая вдоль всего позвоночника.',
            function: 'Разгибает позвоночник, стабилизирует корпус.',
        },
        'male_deltoid_anterior': {
            name: 'Передний пучок дельтовидной мышцы',
            description: 'Передняя часть дельтовидной мышцы, участвует в жимах.',
            function: 'Поднимает руку вперёд, отводит плечо.',
        },
        'male_deltoid_lateral': {
            name: 'Средний пучок дельтовидной мышцы',
            description: 'Средняя часть дельтовидной мышцы, отвечает за ширину плеч.',
            function: 'Отводит руку в сторону до горизонтали.',
        },
        'male_deltoid_posterior': {
            name: 'Задний пучок дельтовидной мышцы',
            description: 'Задняя часть дельтовидной мышцы, часто отстаёт в развитии.',
            function: 'Отводит руку назад, вращает плечо наружу.',
        },
        'male_biceps_brachii': {
            name: 'Двуглавая мышца плеча (бицепс)',
            description: 'Классическая мышца, формирующая рельеф передней части руки.',
            function: 'Сгибает руку в локте, поворачивает предплечье наружу.',
        },
        'male_triceps_brachii': {
            name: 'Трёхглавая мышца плеча (трицепс)',
            description: 'Крупная мышца задней части руки, 2/3 объёма руки.',
            function: 'Разгибает руку в локте.',
        },
        'male_brachialis': {
            name: 'Плечевая мышца',
            description: 'Находится под бицепсом, добавляет объём руке.',
            function: 'Сгибает предплечье в локте.',
        },
        'male_forearm_flexors': {
            name: 'Сгибатели запястья',
            description: 'Лучевой и локтевой сгибатели запястья, поверхностный сгибатель пальцев.',
            function: 'Сгибают запястье и пальцы.',
        },
        'male_forearm_extensors': {
            name: 'Разгибатели запястья',
            description: 'Разгибатели запястья и пальцев, супинатор.',
            function: 'Разгибают запястье и пальцы.',
        },
        'male_quadriceps': {
            name: 'Четырёхглавая мышца бедра (квадрицепс)',
            description: 'Самая сильная мышца человека, состоит из 4 головок.',
            function: 'Разгибает ногу в коленном суставе.',
        },
        'male_hamstrings': {
            name: 'Задняя группа мышц бедра (бицепс бедра)',
            description: 'Двуглавая, полусухожильная и полуперепончатая мышцы.',
            function: 'Сгибает ногу в колене и разгибает бедро.',
        },
        'male_adductors': {
            name: 'Приводящие мышцы бедра',
            description: 'Длинная, короткая и большая приводящие, гребенчатая и стройная мышцы.',
            function: 'Приводят бедро к центру.',
        },
        'male_gluteus_maximus': {
            name: 'Большая ягодичная мышца',
            description: 'Самая крупная мышца тела, формирует ягодицы.',
            function: 'Разгибает бедро, отводит его наружу.',
        },
        'male_calf': {
            name: 'Трёхглавая мышца голени (икроножная)',
            description: 'Икроножная и камбаловидная мышцы.',
            function: 'Сгибает стопу (подъём на носки).',
        },
        'male_tibialis_anterior': {
            name: 'Передняя большеберцовая мышца',
            description: 'Мышца передней поверхности голени.',
            function: 'Разгибает стопу, поднимает её вверх.',
        },
        'male_ligaments_knee': {
            name: 'Связки коленного сустава',
            description: 'Передняя и задняя крестообразные, коллатеральные связки.',
            function: 'Стабилизируют коленный сустав.',
        },
        'male_ligaments_shoulder': {
            name: 'Связки плечевого сустава',
            description: 'Клювовидно-плечевая, суставно-плечевые связки.',
            function: 'Стабилизируют плечевой сустав.',
        },
    },

    en: {
        'male_sternocleidomastoid': {
            name: 'Sternocleidomastoid',
            description: 'The largest muscle of the neck, located on the sides of the trachea.',
            function: 'Tilts the head to the side and rotates it to the opposite side, tilts the head forward.',
        },
        'male_trapezius_upper': {
            name: 'Upper fibers of the trapezius',
            description: 'Upper part of the trapezius muscle, shapes the neck contour.',
            function: 'Elevates the scapula, tilts the head to the side.',
        },
        'male_face': {
            name: 'Facial muscles',
            description: 'Frontalis, orbicularis oculi, orbicularis oris, zygomatic and others.',
            function: 'Responsible for facial expressions and articulation.',
        },
        'male_pectoralis_major': {
            name: 'Pectoralis major',
            description: 'The largest muscle of the chest, shapes the chest contour.',
            function: 'Adducts the shoulder to the body, rotates it inward, flexes the arm.',
        },
        'male_pectoralis_minor': {
            name: 'Pectoralis minor',
            description: 'Located under the pectoralis major.',
            function: 'Pulls the scapula forward and down, participates in breathing.',
        },
        'male_serratus_anterior': {
            name: 'Serratus anterior',
            description: 'Muscle on the side of the chest with a serrated edge.',
            function: 'Pulls the scapula forward and down, participates in raising the arm above horizontal.',
        },
        'male_rectus_abdominis': {
            name: 'Rectus abdominis',
            description: 'The main abdominal muscle, forms the "six-pack".',
            function: 'Flexes the torso forward, stabilizes the core.',
        },
        'male_obliquus_externus': {
            name: 'External oblique',
            description: 'The most superficial of the lateral abdominal muscles.',
            function: 'Flexes and rotates the torso, stabilizes the core.',
        },
        'male_obliquus_internus': {
            name: 'Internal oblique',
            description: 'Located under the external oblique.',
            function: 'Flexes and rotates the torso, stabilizes the core.',
        },
        'male_transversus_abdominis': {
            name: 'Transversus abdominis',
            description: 'The deepest abdominal muscle, creates the "corset".',
            function: 'Stabilizes the core, participates in exhalation.',
        },
        'male_trapezius_middle': {
            name: 'Middle fibers of the trapezius',
            description: 'Middle part of the trapezius muscle.',
            function: 'Squeezes the scapulae together.',
        },
        'male_latissimus_dorsi': {
            name: 'Latissimus dorsi',
            description: 'The widest muscle of the back, forms the V-shaped silhouette.',
            function: 'Adducts the shoulder to the body, extends the shoulder, rotates inward.',
        },
        'male_rhomboids': {
            name: 'Rhomboid muscles',
            description: 'Major and minor rhomboids, located under the trapezius.',
            function: 'Squeeze the scapulae together, elevate them.',
        },
        'male_erector_spinae': {
            name: 'Erector spinae',
            description: 'Powerful muscle running along the entire spine.',
            function: 'Extends the spine, stabilizes the core.',
        },
        'male_deltoid_anterior': {
            name: 'Anterior deltoid',
            description: 'Front part of the deltoid, participates in presses.',
            function: 'Raises the arm forward, abducts the shoulder.',
        },
        'male_deltoid_lateral': {
            name: 'Lateral deltoid',
            description: 'Middle part of the deltoid, responsible for shoulder width.',
            function: 'Abducts the arm to the side up to horizontal.',
        },
        'male_deltoid_posterior': {
            name: 'Posterior deltoid',
            description: 'Back part of the deltoid, often lags in development.',
            function: 'Abducts the arm backward, rotates the shoulder outward.',
        },
        'male_biceps_brachii': {
            name: 'Biceps brachii',
            description: 'Classic muscle, shapes the contour of the front of the arm.',
            function: 'Flexes the arm at the elbow, rotates the forearm outward.',
        },
        'male_triceps_brachii': {
            name: 'Triceps brachii',
            description: 'Large muscle of the back of the arm, 2/3 of arm volume.',
            function: 'Extends the arm at the elbow.',
        },
        'male_brachialis': {
            name: 'Brachialis',
            description: 'Located under the biceps, adds volume to the arm.',
            function: 'Flexes the forearm at the elbow.',
        },
        'male_forearm_flexors': {
            name: 'Wrist flexors',
            description: 'Radial and ulnar wrist flexors, superficial finger flexor.',
            function: 'Flex the wrist and fingers.',
        },
        'male_forearm_extensors': {
            name: 'Wrist extensors',
            description: 'Wrist and finger extensors, supinator.',
            function: 'Extend the wrist and fingers.',
        },
        'male_quadriceps': {
            name: 'Quadriceps',
            description: 'The strongest muscle in the human body, consists of 4 heads.',
            function: 'Extends the leg at the knee joint.',
        },
        'male_hamstrings': {
            name: 'Hamstrings (biceps femoris)',
            description: 'Biceps femoris, semitendinosus and semimembranosus muscles.',
            function: 'Flexes the leg at the knee and extends the hip.',
        },
        'male_adductors': {
            name: 'Adductors',
            description: 'Long, short and great adductors, pectineus and gracilis muscles.',
            function: 'Adduct the thigh to the center.',
        },
        'male_gluteus_maximus': {
            name: 'Gluteus maximus',
            description: 'The largest muscle in the body, forms the buttocks.',
            function: 'Extends the hip, abducts it outward.',
        },
        'male_calf': {
            name: 'Triceps surae (gastrocnemius)',
            description: 'Gastrocnemius and soleus muscles.',
            function: 'Flexes the foot (rise on toes).',
        },
        'male_tibialis_anterior': {
            name: 'Tibialis anterior',
            description: 'Muscle of the front surface of the lower leg.',
            function: 'Extends the foot, lifts it up.',
        },
        'male_ligaments_knee': {
            name: 'Knee ligaments',
            description: 'Anterior and posterior cruciate, collateral ligaments.',
            function: 'Stabilize the knee joint.',
        },
        'male_ligaments_shoulder': {
            name: 'Shoulder ligaments',
            description: 'Coracohumeral, glenohumeral ligaments.',
            function: 'Stabilize the shoulder joint.',
        },
    }
};

// ============================================
// 🌍 ПЕРЕВОДЫ ГРУПП МЫШЦ
// ============================================
const muscleGroupTranslations = {
    ru: {
        'Голова и шея': 'Голова и шея',
        'Грудь': 'Грудь',
        'Живот': 'Живот',
        'Спина': 'Спина',
        'Плечи': 'Плечи',
        'Руки': 'Руки',
        'Ноги': 'Ноги',
        'Связки': 'Связки',
    },
    en: {
        'Голова и шея': 'Head & neck',
        'Грудь': 'Chest',
        'Живот': 'Abs',
        'Спина': 'Back',
        'Плечи': 'Shoulders',
        'Руки': 'Arms',
        'Ноги': 'Legs',
        'Связки': 'Ligaments',
    }
};

// ============================================
// ФУНКЦИИ ПОЛУЧЕНИЯ ПЕРЕВОДОВ
// ============================================
function getMuscleName(muscle) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    return (muscleTranslations[lang] && muscleTranslations[lang][muscle.id] && muscleTranslations[lang][muscle.id].name) || muscle.name;
}

function getMuscleDescription(muscle) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    return (muscleTranslations[lang] && muscleTranslations[lang][muscle.id] && muscleTranslations[lang][muscle.id].description) || muscle.description;
}

function getMuscleFunction(muscle) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    return (muscleTranslations[lang] && muscleTranslations[lang][muscle.id] && muscleTranslations[lang][muscle.id].function) || muscle.function;
}

function getMuscleGroup(group) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ru';
    return (muscleGroupTranslations[lang] && muscleGroupTranslations[lang][group]) || group;
}

console.log('✅ muscle-translations.js loaded | мышц:', Object.keys(muscleTranslations.ru).length, '| групп:', Object.keys(muscleGroupTranslations.ru).length);