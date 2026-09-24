// --- ЦВЕТА ГРУПП МЫШЦ ---
const groupColors = {
    'Голова и шея': '#6fb3ff',
    'Грудь': '#ff6b6b',
    'Живот': '#ffd93d',
    'Спина': '#a29bfe',
    'Плечи': '#fd79a8',
    'Руки': '#6c5ce7',
    'Ноги': '#00b894',
    'Связки': '#fd79a8'
};

// --- ИКОНКИ ГРУПП ---
const groupIcons = {
    'Голова и шея': '🧠',
    'Грудь': '💪',
    'Живот': '🏋️',
    'Спина': '🦴',
    'Плечи': '💪',
    'Руки': '💪',
    'Ноги': '🦵',
    'Связки': '🔗'
};

// --- БАЗА ДАННЫХ МЫШЦ ---
const muscleDatabase = {

    // ==================== ГОЛОВА И ШЕЯ ====================
    'male_sternocleidomastoid': {
        id: 'male_sternocleidomastoid',
        name: 'Грудино-ключично-сосцевидная мышца',
        latin: 'Musculus sternocleidomastoideus',
        group: 'Голова и шея',
        zone: 'head',
        side: 'front',
        image: 'images/muscules/1_Sternocleidomastoid_muscle.png',
        overlay: 'images/muscules/1_Sternocleidomastoid_muscle_min.png',
        clip: 'm 96.340908 73.718181 1.431819 0.327274 1.881817 1.268179 2.045456 -0.204544 1.10454 -0.940908 1.47273 -0.286364 0.16364 -2.618182 0.40909 -5.031819 -1.18637 1.349999 -1.26818 3.027275 -3.681815 0.245454 -1.145455 -3.231819 -1.390909 -1.595453 0.08182 4.049998 z',
        function: 'Наклоняет голову в сторону и поворачивает в противоположную, наклоняет голову вперёд.',
        description: 'Самая крупная мышца шеи, расположена по бокам от трахеи.',
        exercises: {
            primary: [
                { name: 'Наклоны головы с отягощением', video: '' },
                { name: 'Повороты головы с сопротивлением', video: '' }
            ],
            secondary: [
                { name: 'Изометрические упражнения для шеи', video: '' }
            ]
        }
    },
    'male_trapezius_upper': {
        id: 'male_trapezius_upper',
        name: 'Верхний пучок трапециевидной мышцы',
        latin: 'Pars descendens musculi trapezii',
        group: 'Голова и шея',
        zone: 'head',
        side: 'front',
        image: 'images/muscules/2_Upper_fibers_of_the_trapezius_muscle.png',
        overlay: 'images/muscules/2_Upper_fibers_of_the_trapezius_muscle_min.png',
        function: 'Поднимает лопатку вверх, наклоняет голову в сторону.',
        description: 'Верхняя часть трапециевидной мышцы, формирует рельеф шеи.',
        exercises: {
            primary: [
                { name: 'Пожимания плечами с гантелями', video: '' },
                { name: 'Шраги со штангой', video: '' }
            ],
            secondary: [
                { name: 'Тяга к подбородку', video: '' }
            ]
        }
    },
    'male_face': {
        id: 'male_face',
        name: 'Мышцы лица',
        latin: 'Musculi faciei',
        group: 'Голова и шея',
        zone: 'head',
        side: 'front',
        image: 'images/muscules/3_Facial_muscles.png',
        overlay: null,
        function: 'Отвечают за мимику и артикуляцию.',
        description: 'Лобная, круговая мышца глаза, круговая мышца рта, скуловые и другие.',
        exercises: {
            primary: [
                { name: 'Артикуляционная гимнастика', video: '' }
            ],
            secondary: [
                { name: 'Упражнения для мимики', video: '' }
            ]
        }
    },

    // ==================== ГРУДЬ ====================
    'male_pectoralis_major': {
        id: 'male_pectoralis_major',
        name: 'Большая грудная мышца',
        latin: 'Musculus pectoralis major',
        group: 'Грудь',
        zone: 'chest',
        side: 'front',
        image: 'images/muscules/4_Pectoralis_major_muscle.png',
        overlay: 'images/muscules/4_Pectoralis_major_muscle_min.png',
        function: 'Приводит плечо к туловищу, вращает его внутрь, сгибает руку.',
        description: 'Самая крупная мышца груди, формирует рельеф грудной клетки.',
        exercises: {
            primary: [
                { name: 'Жим штанги лёжа', video: '' },
                { name: 'Разводка гантелей', video: '' }
            ],
            secondary: [
                { name: 'Отжимания', video: '' },
                { name: 'Сведение рук в кроссовере', video: '' }
            ]
        }
    },
    'male_pectoralis_minor': {
        id: 'male_pectoralis_minor',
        name: 'Малая грудная мышца',
        latin: 'Musculus pectoralis minor',
        group: 'Грудь',
        zone: 'chest',
        side: 'front',
        image: 'images/muscules/5_Pectoralis_minor_muscle.png',
        overlay: null,
        function: 'Тянет лопатку вперёд и вниз, участвует в дыхании.',
        description: 'Расположена под большой грудной мышцей.',
        exercises: {
            primary: [
                { name: 'Жим штанги узким хватом', video: '' },
                { name: 'Отжимания на брусьях', video: '' }
            ],
            secondary: [
                { name: 'Пуловер с гантелью', video: '' }
            ]
        }
    },
    'male_serratus_anterior': {
        id: 'male_serratus_anterior',
        name: 'Передняя зубчатая мышца',
        latin: 'Musculus serratus anterior',
        group: 'Грудь',
        zone: 'chest',
        side: 'front',
        image: 'images/muscules/6_Serratus_anterior_muscle.png',
        overlay: 'images/muscules/6_Serratus_anterior_muscle_min.png',
        function: 'Тянет лопатку вперёд и вниз, участвует в подъёме руки выше горизонтали.',
        description: 'Мышца на боковой поверхности грудной клетки с зубчатым краем.',
        exercises: {
            primary: [
                { name: 'Жим штанги в наклоне', video: '' },
                { name: 'Пуловер с гантелью', video: '' }
            ],
            secondary: [
                { name: 'Отжимания с широкой постановкой рук', video: '' }
            ]
        }
    },

    // ==================== ЖИВОТ ====================
    'male_rectus_abdominis': {
        id: 'male_rectus_abdominis',
        name: 'Прямая мышца живота',
        latin: 'Musculus rectus abdominis',
        group: 'Живот',
        zone: 'abs',
        side: 'front',
        image: 'images/muscules/7_Rectus_abdominis_muscle.png',
        overlay: 'images/muscules/7_Rectus_abdominis_muscle_min.png',
        function: 'Сгибает туловище вперёд, стабилизирует корпус.',
        description: 'Основная мышца пресса, формирует «кубики».',
        exercises: {
            primary: [
                { name: 'Скручивания', video: '' },
                { name: 'Подъёмы ног', video: '' }
            ],
            secondary: [
                { name: 'Планка', video: '' }
            ]
        }
    },
    'male_obliquus_externus': {
        id: 'male_obliquus_externus',
        name: 'Наружная косая мышца живота',
        latin: 'Musculus obliquus externus abdominis',
        group: 'Живот',
        zone: 'abs',
        side: 'front',
        image: 'images/muscules/8_External_oblique_muscle_of_the_abdomen.png',
        overlay: 'images/muscules/8_External_oblique_muscle_of_the_abdomen_min.png',
        function: 'Сгибает и поворачивает туловище, стабилизирует корпус.',
        description: 'Самая поверхностная из боковых мышц живота.',
        exercises: {
            primary: [
                { name: 'Боковые скручивания', video: '' },
                { name: 'Русский твист', video: '' }
            ],
            secondary: [
                { name: 'Планка с поворотом', video: '' }
            ]
        }
    },
    'male_obliquus_internus': {
        id: 'male_obliquus_internus',
        name: 'Внутренняя косая мышца живота',
        latin: 'Musculus obliquus internus abdominis',
        group: 'Живот',
        zone: 'abs',
        side: 'front',
        image: 'images/muscules/9_Internal_oblique_muscle_of_the_abdomen.png',
        overlay: 'images/muscules/9_Internal_oblique_muscle_of_the_abdomen_min.png',
        function: 'Сгибает и поворачивает туловище, стабилизирует корпус.',
        description: 'Находится под наружной косой мышцей.',
        exercises: {
            primary: [
                { name: 'Обратные скручивания', video: '' },
                { name: 'Боковые наклоны с гантелью', video: '' }
            ],
            secondary: [
                { name: 'Боковая планка', video: '' }
            ]
        }
    },
    'male_transversus_abdominis': {
        id: 'male_transversus_abdominis',
        name: 'Поперечная мышца живота',
        latin: 'Musculus transversus abdominis',
        group: 'Живот',
        zone: 'abs',
        side: 'front',
        image: 'images/muscules/10_Transversus_abdominis_muscle.png',
        overlay: 'images/muscules/10_Transversus_abdominis_muscle_min.png',
        function: 'Стабилизирует корпус, участвует в выдохе.',
        description: 'Самая глубокая мышца живота, создаёт «корсет».',
        exercises: {
            primary: [
                { name: 'Вакуум живота', video: '' },
                { name: 'Планка', video: '' }
            ],
            secondary: [
                { name: 'Упражнение «мёртвый жук»', video: '' }
            ]
        }
    },

    // ==================== СПИНА ====================
    'male_trapezius_middle': {
        id: 'male_trapezius_middle',
        name: 'Средний пучок трапециевидной мышцы',
        latin: 'Pars transversa musculi trapezii',
        group: 'Спина',
        zone: 'back',
        side: 'back',
        image: 'images/muscules/11_Middle_fibers_of_the_trapezius_muscle.png',
        overlay: 'images/muscules/11_Middle_fibers_of_the_trapezius_muscle_min.png',
        function: 'Сводит лопатки вместе.',
        description: 'Средняя часть трапециевидной мышцы.',
        exercises: {
            primary: [
                { name: 'Тяга штанги в наклоне', video: '' },
                { name: 'Тяга гантелей к поясу', video: '' }
            ],
            secondary: [
                { name: 'Тяга верхнего блока', video: '' }
            ]
        }
    },
    'male_latissimus_dorsi': {
        id: 'male_latissimus_dorsi',
        name: 'Широчайшая мышца спины',
        latin: 'Musculus latissimus dorsi',
        group: 'Спина',
        zone: 'back',
        side: 'back',
        image: 'images/muscules/12_Latissimus_dorsi_muscle.png',
        overlay: 'images/muscules/12_Latissimus_dorsi_muscle_min.png',
        function: 'Приводит плечо к туловищу, разгибает плечо, вращает внутрь.',
        description: 'Самая широкая мышца спины, формирует V-образный силуэт.',
        exercises: {
            primary: [
                { name: 'Подтягивания', video: '' },
                { name: 'Тяга верхнего блока', video: '' }
            ],
            secondary: [
                { name: 'Тяга штанги в наклоне', video: '' }
            ]
        }
    },
    'male_rhomboids': {
        id: 'male_rhomboids',
        name: 'Ромбовидные мышцы',
        latin: 'Musculi rhomboidei',
        group: 'Спина',
        zone: 'back',
        side: 'back',
        image: 'images/muscules/13_Rhomboid_muscles.png',
        overlay: 'images/muscules/13_Rhomboid_muscles_min.png',
        function: 'Сводят лопатки вместе, поднимают их.',
        description: 'Большая и малая ромбовидные мышцы, расположены под трапецией.',
        exercises: {
            primary: [
                { name: 'Тяга штанги в наклоне', video: '' },
                { name: 'Тяга гантелей к поясу', video: '' }
            ],
            secondary: [
                { name: 'Разведение рук в наклоне', video: '' }
            ]
        }
    },
    'male_erector_spinae': {
        id: 'male_erector_spinae',
        name: 'Мышца, выпрямляющая позвоночник',
        latin: 'Musculus erector spinae',
        group: 'Спина',
        zone: 'back',
        side: 'back',
        image: 'images/muscules/14_Erector_spinae_muscle.png',
        overlay: null,
        function: 'Разгибает позвоночник, стабилизирует корпус.',
        description: 'Мощная мышца, идущая вдоль всего позвоночника.',
        exercises: {
            primary: [
                { name: 'Гиперэкстензия', video: '' },
                { name: 'Становая тяга', video: '' }
            ],
            secondary: [
                { name: 'Ягодичный мостик', video: '' }
            ]
        }
    },

    // ==================== ПЛЕЧИ ====================
    'male_deltoid_anterior': {
        id: 'male_deltoid_anterior',
        name: 'Передний пучок дельтовидной мышцы',
        latin: 'Pars clavicularis musculi deltoidei',
        group: 'Плечи',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/15_Anterior_bundle_of_the_deltoid_muscle.png',
        overlay: 'images/muscules/15_Anterior_bundle_of_the_deltoid_muscle_min.png',
        function: 'Поднимает руку вперёд, отводит плечо.',
        description: 'Передняя часть дельтовидной мышцы, участвует в жимах.',
        exercises: {
            primary: [
                { name: 'Жим гантелей сидя', video: '' },
                { name: 'Подъём гантелей перед собой', video: '' }
            ],
            secondary: [
                { name: 'Жим штанги стоя', video: '' }
            ]
        }
    },
    'male_deltoid_lateral': {
        id: 'male_deltoid_lateral',
        name: 'Средний пучок дельтовидной мышцы',
        latin: 'Pars acromialis musculi deltoidei',
        group: 'Плечи',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/16_Middle_head_of_the_deltoid_muscle.png',
        overlay: 'images/muscules/16_Middle_head_of_the_deltoid_muscle_min.png',
        function: 'Отводит руку в сторону до горизонтали.',
        description: 'Средняя часть дельтовидной мышцы, отвечает за ширину плеч.',
        exercises: {
            primary: [
                { name: 'Махи гантелями в стороны', video: '' },
                { name: 'Тяга к подбородку', video: '' }
            ],
            secondary: [
                { name: 'Жим Арнольда', video: '' }
            ]
        }
    },
    'male_deltoid_posterior': {
        id: 'male_deltoid_posterior',
        name: 'Задний пучок дельтовидной мышцы',
        latin: 'Pars spinalis musculi deltoidei',
        group: 'Плечи',
        zone: 'arms',
        side: 'back',
        image: 'images/muscules/17_Posterior_deltoid.png',
        overlay: 'images/muscules/17_Posterior_deltoid_min.png',
        function: 'Отводит руку назад, вращает плечо наружу.',
        description: 'Задняя часть дельтовидной мышцы, часто отстаёт в развитии.',
        exercises: {
            primary: [
                { name: 'Разведение рук в наклоне', video: '' },
                { name: 'Обратные разводки в тренажёре', video: '' }
            ],
            secondary: [
                { name: 'Лицевая тяга', video: '' }
            ]
        }
    },

    // ==================== РУКИ ====================
    'male_biceps_brachii': {
        id: 'male_biceps_brachii',
        name: 'Двуглавая мышца плеча (бицепс)',
        latin: 'Musculus biceps brachii',
        group: 'Руки',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/18_BICEPS.png',
        overlay: 'images/muscules/18_BICEPS_min.png',
        function: 'Сгибает руку в локте, поворачивает предплечье наружу.',
        description: 'Классическая мышца, формирующая рельеф передней части руки.',
        exercises: {
            primary: [
                { name: 'Сгибание рук со штангой', video: '' },
                { name: 'Сгибание рук с гантелями', video: '' }
            ],
            secondary: [
                { name: 'Молотковые сгибания', video: '' }
            ]
        }
    },
    'male_triceps_brachii': {
        id: 'male_triceps_brachii',
        name: 'Трёхглавая мышца плеча (трицепс)',
        latin: 'Musculus triceps brachii',
        group: 'Руки',
        zone: 'arms',
        side: 'back',
        image: 'images/muscules/19_TRICEPS.png',
        overlay: 'images/muscules/19_TRICEPS_min.png',
        function: 'Разгибает руку в локте.',
        description: 'Крупная мышца задней части руки, 2/3 объёма руки.',
        exercises: {
            primary: [
                { name: 'Французский жим', video: '' },
                { name: 'Разгибание рук на блоке', video: '' }
            ],
            secondary: [
                { name: 'Отжимания на брусьях', video: '' }
            ]
        }
    },
    'male_brachialis': {
        id: 'male_brachialis',
        name: 'Плечевая мышца',
        latin: 'Musculus brachialis',
        group: 'Руки',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/20_Brachialis.png',
        overlay: 'images/muscules/20_Brachialis_min.png',
        function: 'Сгибает предплечье в локте.',
        description: 'Находится под бицепсом, добавляет объём руке.',
        exercises: {
            primary: [
                { name: 'Молотковые сгибания', video: '' },
                { name: 'Сгибание рук обратным хватом', video: '' }
            ],
            secondary: [
                { name: 'Сгибание рук на скамье Скотта', video: '' }
            ]
        }
    },
    'male_forearm_flexors': {
        id: 'male_forearm_flexors',
        name: 'Сгибатели запястья',
        latin: 'Musculi flexores carpi',
        group: 'Руки',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/21_Wristflexors.png',
        overlay: 'images/muscules/21_Wristflexors_min.png',
        function: 'Сгибают запястье и пальцы.',
        description: 'Лучевой и локтевой сгибатели запястья, поверхностный сгибатель пальцев.',
        exercises: {
            primary: [
                { name: 'Сгибание запястий со штангой', video: '' }
            ],
            secondary: [
                { name: 'Кистевой эспандер', video: '' }
            ]
        }
    },
    'male_forearm_extensors': {
        id: 'male_forearm_extensors',
        name: 'Разгибатели запястья',
        latin: 'Musculi extensores carpi',
        group: 'Руки',
        zone: 'arms',
        side: 'back',
        image: 'images/muscules/22_Musculi_extensores_carpi.png',
        overlay: 'images/muscules/22_Musculi_extensores_carpi_min.png',
        function: 'Разгибают запястье и пальцы.',
        description: 'Разгибатели запястья и пальцев, супинатор.',
        exercises: {
            primary: [
                { name: 'Разгибание запястий', video: '' }
            ],
            secondary: [
                { name: 'Обратные сгибания', video: '' }
            ]
        }
    },

    // ==================== НОГИ ====================
    'male_quadriceps': {
        id: 'male_quadriceps',
        name: 'Четырёхглавая мышца бедра (квадрицепс)',
        latin: 'Musculus quadriceps femoris',
        group: 'Ноги',
        zone: 'legs',
        side: 'front',
        image: 'images/muscules/23_quadriceps.png',
        overlay: 'images/muscules/23_quadriceps_min.png',
        function: 'Разгибает ногу в коленном суставе.',
        description: 'Самая сильная мышца человека, состоит из 4 головок.',
        exercises: {
            primary: [
                { name: 'Приседания', video: '' },
                { name: 'Жим ногами', video: '' }
            ],
            secondary: [
                { name: 'Разгибание ног сидя', video: '' }
            ]
        }
    },
    'male_hamstrings': {
        id: 'male_hamstrings',
        name: 'Задняя группа мышц бедра (бицепс бедра)',
        latin: 'Musculi ischiocrurales',
        group: 'Ноги',
        zone: 'legs',
        side: 'back',
        image: 'images/muscules/24_Posterior_thigh_muscle_group_(biceps_femoris).png',
        overlay: 'images/muscules/24_Posterior_thigh_muscle_group_(biceps_femoris)_min.png',
        function: 'Сгибает ногу в колене и разгибает бедро.',
        description: 'Двуглавая, полусухожильная и полуперепончатая мышцы.',
        exercises: {
            primary: [
                { name: 'Румынская тяга', video: '' },
                { name: 'Сгибание ног лёжа', video: '' }
            ],
            secondary: [
                { name: 'Приседания со штангой', video: '' }
            ]
        }
    },
    'male_adductors': {
        id: 'male_adductors',
        name: 'Приводящие мышцы бедра',
        latin: 'Musculi adductores',
        group: 'Ноги',
        zone: 'legs',
        side: 'front',
        image: 'images/muscules/25_Adductor_muscles_of_the_thigh.png',
        overlay: 'images/muscules/25_Adductor_muscles_of_the_thigh_min.png',
        function: 'Приводят бедро к центру.',
        description: 'Длинная, короткая и большая приводящие, гребенчатая и стройная мышцы.',
        exercises: {
            primary: [
                { name: 'Сведение ног в тренажёре', video: '' },
                { name: 'Плие-приседания', video: '' }
            ],
            secondary: [
                { name: 'Боковые выпады', video: '' }
            ]
        }
    },
    'male_gluteus_maximus': {
        id: 'male_gluteus_maximus',
        name: 'Большая ягодичная мышца',
        latin: 'Musculus gluteus maximus',
        group: 'Ноги',
        zone: 'legs',
        side: 'back',
        image: 'images/muscules/26_Musculus_gluteus_maximus.png',
        overlay: 'images/muscules/26_Musculus_gluteus_maximus_min.png',
        function: 'Разгибает бедро, отводит его наружу.',
        description: 'Самая крупная мышца тела, формирует ягодицы.',
        exercises: {
            primary: [
                { name: 'Приседания', video: '' },
                { name: 'Ягодичный мостик', video: '' }
            ],
            secondary: [
                { name: 'Выпады', video: '' }
            ]
        }
    },
    'male_calf': {
        id: 'male_calf',
        name: 'Трёхглавая мышца голени (икроножная)',
        latin: 'Musculus triceps surae',
        group: 'Ноги',
        zone: 'legs',
        side: 'back',
        image: 'images/muscules/27_Triceps_surae_muscle_(gastrocnemius).png',
        overlay: 'images/muscules/27_Triceps_surae_muscle_(gastrocnemius)_min.png',
        function: 'Сгибает стопу (подъём на носки).',
        description: 'Икроножная и камбаловидная мышцы.',
        exercises: {
            primary: [
                { name: 'Подъём на носки стоя', video: '' },
                { name: 'Подъём на носки сидя', video: '' }
            ],
            secondary: [
                { name: 'Бег', video: '' },
                { name: 'Прыжки', video: '' }
            ]
        }
    },
    'male_tibialis_anterior': {
        id: 'male_tibialis_anterior',
        name: 'Передняя большеберцовая мышца',
        latin: 'Musculus tibialis anterior',
        group: 'Ноги',
        zone: 'legs',
        side: 'front',
        image: 'images/muscules/28_Tibialis_anterior_muscle.png',
        overlay: 'images/muscules/28_Tibialis_anterior_muscle_min.png',
        function: 'Разгибает стопу, поднимает её вверх.',
        description: 'Мышца передней поверхности голени.',
        exercises: {
            primary: [
                { name: 'Подъёмы стопы', video: '' }
            ],
            secondary: [
                { name: 'Ходьба на пятках', video: '' }
            ]
        }
    },

    // ==================== СВЯЗКИ ====================
    'male_ligaments_knee': {
        id: 'male_ligaments_knee',
        name: 'Связки коленного сустава',
        latin: 'Ligamenta genus',
        group: 'Связки',
        zone: 'legs',
        side: 'front',
        image: 'images/muscules/29_Ligaments_of_the_knee_joint.png',
        overlay: null,
        function: 'Стабилизируют коленный сустав.',
        description: 'Передняя и задняя крестообразные, коллатеральные связки.',
        exercises: {
            primary: [
                { name: 'Упражнения на стабильность', video: '' }
            ],
            secondary: [
                { name: 'Растяжка', video: '' }
            ]
        }
    },
    'male_ligaments_shoulder': {
        id: 'male_ligaments_shoulder',
        name: 'Связки плечевого сустава',
        latin: 'Ligamenta articulationis humeri',
        group: 'Связки',
        zone: 'arms',
        side: 'front',
        image: 'images/muscules/30_Ligaments_of_the_shoulder_joint.png',
        overlay: null,
        function: 'Стабилизируют плечевой сустав.',
        description: 'Клювовидно-плечевая, суставно-плечевые связки.',
        exercises: {
            primary: [
                { name: 'Вращения с эспандером', video: '' }
            ],
            secondary: [
                { name: 'Растяжка', video: '' }
            ]
        }
    }
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function getMuscleGroups() {
    const groups = new Set();
    for (const key in muscleDatabase) {
        groups.add(muscleDatabase[key].group);
    }
    return Array.from(groups);
}

function getMusclesByGroup(group) {
    const result = [];
    for (const key in muscleDatabase) {
        if (muscleDatabase[key].group === group) {
            result.push(muscleDatabase[key]);
        }
    }
    return result;
}

function searchMuscles(query) {
    const q = query.toLowerCase().trim();
    if (q === '') return Object.values(muscleDatabase);
    const result = [];
    for (const key in muscleDatabase) {
        const muscle = muscleDatabase[key];
        if (muscle.name.toLowerCase().includes(q) || 
            muscle.latin.toLowerCase().includes(q) ||
            muscle.id.toLowerCase().includes(q)) {
            result.push(muscle);
        }
    }
    return result;
}

function getGroupColor(group) {
    return groupColors[group] || '#4a4a6a';
}

function getGroupIcon(group) {
    return groupIcons[group] || '📌';
}

console.log('✅ База данных загружена!');
console.log(`📊 Всего мышц: ${Object.keys(muscleDatabase).length}`);