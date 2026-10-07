// ============================================
// ЗАМЕНЫ — «сложное → упрощённое»
// Связи по name_en (английские имена)
// ============================================
const substitutesData = {
    // Подтягивания → австралийские
    'pullup': 'australian pull-up',
    'chin-up': 'australian pull-up',

    // Брусья → отжимания на брусьях (трицепс)
    'dips - triceps version': 'bench dips',
    'dips - chest version': 'bench dips',

    // Жим штанги лёжа → жим гантелей
    'barbell bench press': 'dumbbell bench press',
    'barbell incline bench press': 'dumbbell incline bench press',

    // Приседания со штангой → гоблет-приседания
    'barbell squat': 'goblet squat',
    'barbell front squat': 'goblet squat',
    'barbell full squat': 'goblet squat',

    // Становая тяга → румынская тяга
    'barbell deadlift': 'romanian deadlift',

    // Жим над головой → жим гантелей сидя
    'barbell seated overhead press': 'dumbbell seated shoulder press',
    'barbell standing military press': 'dumbbell shoulder press',

    // Тяга штанги в наклоне → тяга гантелей
    'barbell bent over row': 'dumbbell bent over row',

    // Подъём штанги на бицепс → подъём гантелей
    'barbell curl': 'dumbbell bicep curl',
    'barbell preacher curl': 'dumbbell bicep curl',

    // Французский жим со штангой → с гантелью
    'barbell lying triceps extension': 'dumbbell lying triceps extension',

    // Отжимания с ног на скамье → обычные отжимания
    'push-up with feet elevated': 'push-up',

    // Планка с отягощением → обычная планка
    'weighted plank': 'plank',
};

console.log('✅ База замен загружена:', Object.keys(substitutesData).length, 'пар');