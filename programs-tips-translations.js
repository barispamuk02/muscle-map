// ============================================
// 🏋️ ПЕРЕВОДЫ TIPS И УПРАЖНЕНИЙ В ПРОГРАММАХ
// ============================================
const programsTipsTranslations = {
    en: {
        tips: {
            'mass3': [
                "🥩 Nutrition: 15-20% calorie surplus, protein 1.8-2 g/kg",
                "😴 Sleep: at least 7-8 hours",
                "📈 Progression: add 2.5 kg to the barbell every 1-2 weeks",
                "💧 Water: 30-40 ml per kg of body weight"
            ],
            'strength4': [
                "🥩 Protein: 2 g per kg of body weight",
                "💤 Rest between heavy sets: 3-5 minutes",
                "📈 Progression: add 2.5 kg each workout if you complete all 5×5 sets",
                "🚫 Do not increase the weight until you complete all 5×5 sets"
            ],
            'cut5': [
                "🥩 Protein: 2.2-2.5 g per kg of body weight",
                "🔥 Maintain a 15-20% calorie deficit",
                "💧 Water: 40+ ml per kg of body weight",
                "🏃 Cardio: 20-30 minutes, 3-5 times per week",
                "😴 Sleep: 8+ hours for optimal recovery"
            ],
            'home3': [
                "🥩 Nutrition: adjust to your goal (see calculator)",
                "📈 Progression: increase repetitions every week",
                "💧 Water: at least 2 liters per day",
                "🏃 Add cardio: running, jump rope, or walking"
            ],
            'women3': [
                "🥩 Protein: 1.6-2 g per kg of body weight",
                "🎯 Don't be afraid of lifting weights — they won't automatically make you bulky",
                "🔥 Progression: increase the weight every 2 weeks",
                "💧 Water: 30 ml per kg of body weight"
            ],
            'senior3': [
                "⚠️ Consult your doctor before starting this program",
                "🐢 Take it slow — start with minimal intensity",
                "💧 Water: 30 ml per kg of body weight",
                "🚶 Daily walking: 30-40 minutes",
                "🥗 Mediterranean diet is the best choice"
            ]
        },
        exerciseNames: {
            "Жим штанги лёжа": "Barbell bench press",
            "Жим гантелей на наклонной": "Incline dumbbell press",
            "Разводка гантелей лёжа": "Dumbbell fly",
            "Отжимания на брусьях": "Dips",
            "Французский жим": "Skull crushers",
            "Разгибание на блоке": "Cable pushdown",
            "Становая тяга": "Deadlift",
            "Подтягивания": "Pull-ups",
            "Тяга штанги в наклоне": "Bent-over barbell row",
            "Тяга верхнего блока": "Lat pulldown",
            "Сгибание рук со штангой": "Barbell curl",
            "Молотковые сгибания": "Hammer curls",
            "Приседания со штангой": "Barbell squat",
            "Жим ногами": "Leg press",
            "Румынская тяга": "Romanian deadlift",
            "Подъём на носки стоя": "Standing calf raise",
            "Жим штанги стоя": "Overhead press",
            "Махи гантелями в стороны": "Dumbbell lateral raise",
            "Отжимания на брусьях с весом": "Weighted dips",
            "Подтягивания с весом": "Weighted pull-ups",
            "Фронтальные приседания": "Front squat",
            "Жим гантелей лёжа": "Dumbbell bench press",
            "Планка с весом": "Weighted plank",
            "Разводка гантелей": "Dumbbell fly",
            "Кардио 20 минут": "20-minute cardio",
            "Гиперэкстензия": "Back extension",
            "Выпады": "Lunges",
            "Подъём на носки": "Calf raises",
            "Скручивания": "Crunches",
            "Планка": "Plank",
            "Жим гантелей сидя": "Seated dumbbell shoulder press",
            "Махи в стороны": "Lateral raises",
            "Подъём перед собой": "Front raises",
            "Сгибание рук с гантелями": "Dumbbell biceps curls",
            "Берпи": "Burpees",
            "Трастеры": "Thrusters",
            "Канаты": "Battle ropes",
            "Прыжки на скакалке": "Jump rope",
            "HIIT 15 минут": "15-minute HIIT",
            "Отжимания от пола": "Push-ups",
            "Отжимания узким хватом": "Close-grip push-ups",
            "Обратные отжимания от стула": "Chair triceps dips",
            "Лодочка": "Superman exercise",
            "Приседания": "Bodyweight squats",
            "Ягодичный мостик": "Glute bridge",
            "Болгарские выпады": "Bulgarian split squat",
            "Велосипед": "Bicycle crunches",
            "Русский твист": "Russian twists",
            "Планка боковая": "Side plank",
            "Джампинг-джек": "Jumping jacks",
            "Ягодичный мостик со штангой": "Barbell hip thrust",
            "Отведение ноги в кроссовере": "Cable glute kickback",
            "Выпады с гантелями": "Dumbbell lunges",
            "Приседания без веса": "Bodyweight squats",
            "Отжимания от стены": "Wall push-ups",
            "Тяга эспандера": "Resistance band row",
            "Планка на коленях": "Knee plank",
            "Ходьба 20 минут": "20-minute walk",
            "Кошка-корова": "Cat-cow stretch",
            "Ягодичный мост": "Glute bridge",
            "Подъём рук с гантелями": "Dumbbell arm raises",
            "Вращения плечами": "Shoulder rolls",
            "Ходьба на месте": "Marching in place",
            "Велосипед (лёжа)": "Supine bicycle exercise",
            "Растяжка всего тела": "Full-body stretching",
            "Дыхание 4-7-8": "4-7-8 breathing"
        }
    }
};

// ============================================
// ФУНКЦИИ
// ============================================
function getProgramTips(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.tips || [];
    return programsTipsTranslations.en.tips[program.id] || program.tips || [];
}

function getProgramExerciseName(ruName) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return ruName;
    // 1. Из словаря (приоритет)
    if (programsTipsTranslations.en.exerciseNames[ruName]) {
        return programsTipsTranslations.en.exerciseNames[ruName];
    }
    // 2. Поиск в exerciseDatabase (fallback)
    if (typeof exerciseDatabase !== 'undefined') {
        const found = exerciseDatabase.find(e => e.name === ruName);
        if (found && found.name_en) return found.name_en;
    }
    // 3. Fallback — оставить русское
    return ruName;
}

console.log('✅ programs-tips-translations.js loaded | tips:', Object.keys(programsTipsTranslations.en.tips).length, '| упражнений:', Object.keys(programsTipsTranslations.en.exerciseNames).length);