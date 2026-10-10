// ============================================
// 🏋️ ПЕРЕВОДЫ ПРОГРАММ (RU / EN)
// ============================================
const programsTranslations = {
    en: {
        'mass3': {
            name: 'Muscle Gain',
            subtitle: '3 days per week · for beginners',
            goal: 'Build muscle mass',
            level: '🟢 Beginner',
            duration: '8-12 weeks',
            description: 'Classic 3-day split. Suitable for beginners and intermediate lifters. Focus on compound exercises and progressive overload.',
            days: [
                { name: 'Day 1 — Chest + Triceps' },
                { name: 'Day 2 — Back + Biceps' },
                { name: 'Day 3 — Legs + Shoulders' }
            ]
        },
        'strength4': {
            name: 'Strength',
            subtitle: '4 days per week · for experienced lifters',
            goal: 'Build strength',
            level: '🟡 Intermediate',
            duration: '8-12 weeks',
            description: 'A strength program built around 5×5 training and heavy compound lifts. Focus on low reps and longer rest periods.',
            days: [
                { name: 'Day 1 — Push' },
                { name: 'Day 2 — Pull' },
                { name: 'Day 3 — Squat' },
                { name: 'Day 4 — Accessory Work' }
            ]
        },
        'cut5': {
            name: 'Fat Loss / Cutting',
            subtitle: '5 days per week · intermediate',
            goal: 'Fat loss + muscle preservation',
            level: '🟡 Intermediate',
            duration: '6-10 weeks',
            description: 'High-volume training with higher reps and cardio. Designed to reduce body fat while maintaining muscle mass.',
            days: [
                { name: 'Day 1 — Chest' },
                { name: 'Day 2 — Back' },
                { name: 'Day 3 — Legs + Abs' },
                { name: 'Day 4 — Shoulders + Arms' },
                { name: 'Day 5 — Functional Training' }
            ]
        },
        'home3': {
            name: 'Home Workout',
            subtitle: '3 days per week · no equipment',
            goal: 'General fitness',
            level: '🟢 Beginner',
            duration: '8 weeks',
            description: 'A bodyweight-only home workout program. Ideal for training without access to a gym or exercise equipment.',
            days: [
                { name: 'Day 1 — Upper Body' },
                { name: 'Day 2 — Lower Body' },
                { name: 'Day 3 — Core + Cardio' }
            ]
        },
        'women3': {
            name: 'Women\'s Workout',
            subtitle: '3 days per week · glute-focused',
            goal: 'Body shaping + glute development',
            level: '🟢 Beginner',
            duration: '8-12 weeks',
            description: 'A workout program focused on glutes, legs, and core. Emphasizes proper technique without heavy lifting.',
            days: [
                { name: 'Day 1 — Glutes + Thighs' },
                { name: 'Day 2 — Upper Body' },
                { name: 'Day 3 — Legs + Core' }
            ]
        },
        'senior3': {
            name: 'Health 40+',
            subtitle: '3 days per week · low-impact training',
            goal: 'Health and muscle tone',
            level: '🟢 Beginner',
            duration: 'Ongoing',
            description: 'A gentle workout program for adults over 40. Focuses on joint health, posture, and overall fitness.',
            days: [
                { name: 'Day 1 — Full Body' },
                { name: 'Day 2 — Joints + Back' },
                { name: 'Day 3 — Cardio + Stretching' }
            ]
        }
    }
};

// ============================================
// ФУНКЦИИ
// ============================================
function getProgramName(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.name;
    return (programsTranslations.en[program.id]?.name) || program.name;
}

function getProgramSubtitle(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.subtitle;
    return (programsTranslations.en[program.id]?.subtitle) || program.subtitle;
}

function getProgramGoal(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.goal;
    return (programsTranslations.en[program.id]?.goal) || program.goal;
}

function getProgramLevel(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.level;
    return (programsTranslations.en[program.id]?.level) || program.level;
}

function getProgramDuration(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.duration;
    return (programsTranslations.en[program.id]?.duration) || program.duration;
}

function getProgramDescription(program) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.description;
    return (programsTranslations.en[program.id]?.description) || program.description;
}

function getProgramDayName(program, dayIndex) {
    const lang = currentLang || 'ru';
    if (lang === 'ru') return program.days[dayIndex]?.name || '';
    const tDays = programsTranslations.en[program.id]?.days;
    return (tDays && tDays[dayIndex]?.name) || program.days[dayIndex]?.name || '';
}

function formatRest(restStr) {
    if (!restStr) return '';
    if (currentLang === 'ru') return restStr;
    return restStr.replace(/сек/g, 'sec').replace(/мин/g, 'min');
}

console.log('✅ programs-translations.js loaded | программ:', Object.keys(programsTranslations.en).length);