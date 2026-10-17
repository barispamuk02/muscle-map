// Movement-specific, qualitative links for manual/custom exercises.
// Reviewed first-pass references:
// https://www.ncbi.nlm.nih.gov/books/NBK518994/
// https://pmc.ncbi.nlm.nih.gov/articles/PMC6849087/
// https://www.ncbi.nlm.nih.gov/books/NBK531457/
// These are potential partners/stabilizers, NEVER measured activation percentages.
// An omitted movement intentionally has no asserted mapping (stretch, antagonist,
// movement with unmodeled muscles, or insufficient evidence).
const customExerciseSynergists = {
  male_pectoralis_minor: {
    'Отжимания с пронацией лопаток (Scapular Push-Ups)': ['male_serratus_anterior'],
    'Жим гантелей лёжа (полная амплитуда)': ['male_pectoralis_major', 'male_deltoid_anterior', 'male_triceps_brachii'],
    'Отжимания с полной амплитудой': ['male_pectoralis_major', 'male_deltoid_anterior', 'male_triceps_brachii']
  },
  male_obliquus_externus: {
    'Подъём корпуса и ног лёжа на боку': ['male_obliquus_internus', 'male_rectus_abdominis'],
    'Подъём корпуса лёжа на боку': ['male_obliquus_internus', 'male_rectus_abdominis'],
    'Боковая планка': ['male_obliquus_internus', 'male_transversus_abdominis']
  },
  male_obliquus_internus: {
    'Косые скручивания с поворотом коленей': ['male_obliquus_externus', 'male_rectus_abdominis'],
    'Русский твист с гантелью/гирей': ['male_obliquus_externus', 'male_rectus_abdominis'],
    'Боковые наклоны с гантелью': ['male_obliquus_externus', 'male_rectus_abdominis'],
    'Планка с поворотом': ['male_obliquus_externus', 'male_transversus_abdominis'],
    'Дровосек в кроссовере': ['male_obliquus_externus', 'male_rectus_abdominis']
  },
  male_transversus_abdominis: {
    // Vacuum intentionally omitted: dynamic support from another *modeled* muscle is not established.
    'Мёртвый жук': ['male_rectus_abdominis', 'male_obliquus_internus'],
    'Планка': ['male_rectus_abdominis', 'male_obliquus_externus', 'male_obliquus_internus'],
    'Обратные скручивания': ['male_rectus_abdominis', 'male_obliquus_externus'],
    'Тазовый наклон (Pelvic Tilt)': ['male_rectus_abdominis']
  },
  male_trapezius_middle: {
    'Тяга штанги в наклоне': ['male_rhomboids', 'male_latissimus_dorsi', 'male_biceps_brachii'],
    'Тяга гантелей к поясу': ['male_rhomboids', 'male_latissimus_dorsi', 'male_biceps_brachii'],
    'Тяга верхнего блока к груди': ['male_latissimus_dorsi', 'male_biceps_brachii', 'male_rhomboids'],
    'Разведение рук в наклоне': ['male_deltoid_posterior', 'male_rhomboids'],
    'Face Pulls (тяга к лицу)': ['male_deltoid_posterior', 'male_rhomboids'],
    'Тяга Т-грифа': ['male_rhomboids', 'male_latissimus_dorsi', 'male_biceps_brachii'],
    'Тяга сидя на блоке': ['male_rhomboids', 'male_latissimus_dorsi', 'male_biceps_brachii']
    // "Шраги" target mainly upper, not middle trapezius. Track separate catalog correction.
  },
  male_deltoid_lateral: {
    'Махи гантелями в стороны': ['male_trapezius_upper'],
    'Махи в кроссовере': ['male_trapezius_upper'],
    'Тяга к подбородку': ['male_trapezius_upper', 'male_deltoid_anterior'],
    'Жим Арнольда': ['male_deltoid_anterior', 'male_triceps_brachii', 'male_trapezius_upper', 'male_serratus_anterior']
  },
  male_deltoid_posterior: {
    'Разведение рук в наклоне': ['male_rhomboids', 'male_trapezius_middle'],
    'Обратные разводки в тренажёре': ['male_rhomboids', 'male_trapezius_middle'],
    'Лицевая тяга (Face Pull)': ['male_rhomboids', 'male_trapezius_middle'],
    'Тяга штанги к груди широким хватом': ['male_rhomboids', 'male_trapezius_middle', 'male_biceps_brachii']
  },
  male_brachialis: {
    'Молотковые сгибания': ['male_biceps_brachii'],
    'Сгибание рук обратным хватом': ['male_biceps_brachii'],
    'Сгибание на скамье Скотта': ['male_biceps_brachii'],
    'Сгибание в кроссовере': ['male_biceps_brachii'],
    'Молотковые сгибания через скамью': ['male_biceps_brachii']
  }
};
// Data curation is deliberately sparse, not fabricated. Do not auto-create
// 'synergists' for neck isolation, facial movements, wrist dorsiflexion,
// tibialis dorsiflexion, stretching or ligament rehabilitation entries.
// Some of those pairs are antagonists, not synergists.
