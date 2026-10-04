// ============================================
// 🎯 СИНЕРГИСТЫ — вспомогательные мышцы
// Распределение нагрузки по упражнениям
// ============================================

const synergistsData = {
    // ============================================
    // 💪 ГРУДЬ
    // ============================================
    "barbell bench press": {
        primary: { muscleId: "male_pectoralis_major", percent: 70 },
        synergists: [
            { muscleId: "male_triceps_brachii", percent: 20 },
            { muscleId: "male_deltoid_anterior", percent: 10 }
        ]
    },
    "dumbbell bench press": {
        primary: { muscleId: "male_pectoralis_major", percent: 75 },
        synergists: [
            { muscleId: "male_triceps_brachii", percent: 15 },
            { muscleId: "male_deltoid_anterior", percent: 10 }
        ]
    },
    "dumbbell fly": {
        primary: { muscleId: "male_pectoralis_major", percent: 90 },
        synergists: [
            { muscleId: "male_deltoid_anterior", percent: 10 }
        ]
    },
    "push-up": {
        primary: { muscleId: "male_pectoralis_major", percent: 60 },
        synergists: [
            { muscleId: "male_triceps_brachii", percent: 25 },
            { muscleId: "male_deltoid_anterior", percent: 10 },
            { muscleId: "male_rectus_abdominis", percent: 5 }
        ]
    },
    "cable crossover": {
        primary: { muscleId: "male_pectoralis_major", percent: 85 },
        synergists: [
            { muscleId: "male_deltoid_anterior", percent: 15 }
        ]
    },
    "incline barbell bench press": {
        primary: { muscleId: "male_pectoralis_major", percent: 70 },
        synergists: [
            { muscleId: "male_deltoid_anterior", percent: 20 },
            { muscleId: "male_triceps_brachii", percent: 10 }
        ]
    },

    // ============================================
    // 🦵 НОГИ
    // ============================================
    "barbell squat": {
        primary: { muscleId: "male_quadriceps", percent: 55 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 25 },
            { muscleId: "male_hamstrings", percent: 10 },
            { muscleId: "male_erector_spinae", percent: 10 }
        ]
    },
    "leg press": {
        primary: { muscleId: "male_quadriceps", percent: 65 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 25 },
            { muscleId: "male_hamstrings", percent: 10 }
        ]
    },
    "romanian deadlift": {
        primary: { muscleId: "male_hamstrings", percent: 55 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 25 },
            { muscleId: "male_erector_spinae", percent: 15 },
            { muscleId: "male_quadriceps", percent: 5 }
        ]
    },
    "deadlift": {
        primary: { muscleId: "male_erector_spinae", percent: 40 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 25 },
            { muscleId: "male_hamstrings", percent: 20 },
            { muscleId: "male_latissimus_dorsi", percent: 10 },
            { muscleId: "male_quadriceps", percent: 5 }
        ]
    },
    "bulgarian split squat": {
        primary: { muscleId: "male_quadriceps", percent: 50 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 35 },
            { muscleId: "male_hamstrings", percent: 15 }
        ]
    },
    "lunges": {
        primary: { muscleId: "male_quadriceps", percent: 50 },
        synergists: [
            { muscleId: "male_gluteus_maximus", percent: 35 },
            { muscleId: "male_hamstrings", percent: 15 }
        ]
    },
    "leg extension": {
        primary: { muscleId: "male_quadriceps", percent: 100 },
        synergists: []
    },
    "leg curl": {
        primary: { muscleId: "male_hamstrings", percent: 100 },
        synergists: []
    },
    "calf raise": {
        primary: { muscleId: "male_calf", percent: 100 },
        synergists: []
    },
    "hip thrust": {
        primary: { muscleId: "male_gluteus_maximus", percent: 75 },
        synergists: [
            { muscleId: "male_hamstrings", percent: 20 },
            { muscleId: "male_quadriceps", percent: 5 }
        ]
    },

    // ============================================
    // 🏋️ СПИНА
    // ============================================
    "pull-up": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 60 },
        synergists: [
            { muscleId: "male_biceps_brachii", percent: 20 },
            { muscleId: "male_rhomboids", percent: 10 },
            { muscleId: "male_trapezius_upper", percent: 10 }
        ]
    },
    "chin-up": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 50 },
        synergists: [
            { muscleId: "male_biceps_brachii", percent: 30 },
            { muscleId: "male_rhomboids", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 5 }
        ]
    },
    "barbell bent over row": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 55 },
        synergists: [
            { muscleId: "male_rhomboids", percent: 20 },
            { muscleId: "male_biceps_brachii", percent: 15 },
            { muscleId: "male_erector_spinae", percent: 10 }
        ]
    },
    "seated cable row": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 50 },
        synergists: [
            { muscleId: "male_rhomboids", percent: 25 },
            { muscleId: "male_biceps_brachii", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 10 }
        ]
    },
    "lat pulldown": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 55 },
        synergists: [
            { muscleId: "male_biceps_brachii", percent: 20 },
            { muscleId: "male_rhomboids", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 10 }
        ]
    },
    "t-bar row": {
        primary: { muscleId: "male_latissimus_dorsi", percent: 55 },
        synergists: [
            { muscleId: "male_rhomboids", percent: 20 },
            { muscleId: "male_biceps_brachii", percent: 15 },
            { muscleId: "male_erector_spinae", percent: 10 }
        ]
    },

    // ============================================
    // 💪 ПЛЕЧИ
    // ============================================
    "overhead press": {
        primary: { muscleId: "male_deltoid_anterior", percent: 60 },
        synergists: [
            { muscleId: "male_triceps_brachii", percent: 20 },
            { muscleId: "male_deltoid_middle", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 5 }
        ]
    },
    "dumbbell shoulder press": {
        primary: { muscleId: "male_deltoid_anterior", percent: 60 },
        synergists: [
            { muscleId: "male_triceps_brachii", percent: 20 },
            { muscleId: "male_deltoid_middle", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 5 }
        ]
    },
    "lateral raise": {
        primary: { muscleId: "male_deltoid_middle", percent: 90 },
        synergists: [
            { muscleId: "male_trapezius_upper", percent: 10 }
        ]
    },
    "front raise": {
        primary: { muscleId: "male_deltoid_anterior", percent: 90 },
        synergists: [
            { muscleId: "male_trapezius_upper", percent: 10 }
        ]
    },
    "rear delt fly": {
        primary: { muscleId: "male_posterior_deltoid", percent: 80 },
        synergists: [
            { muscleId: "male_rhomboids", percent: 15 },
            { muscleId: "male_trapezius_upper", percent: 5 }
        ]
    },

    // ============================================
    // 💪 РУКИ
    // ============================================
    "barbell curl": {
        primary: { muscleId: "male_biceps_brachii", percent: 90 },
        synergists: [
            { muscleId: "male_forearm_flexors", percent: 10 }
        ]
    },
    "dumbbell curl": {
        primary: { muscleId: "male_biceps_brachii", percent: 85 },
        synergists: [
            { muscleId: "male_forearm_flexors", percent: 15 }
        ]
    },
    "hammer curl": {
        primary: { muscleId: "male_brachialis", percent: 60 },
        synergists: [
            { muscleId: "male_biceps_brachii", percent: 25 },
            { muscleId: "male_forearm_flexors", percent: 15 }
        ]
    },
    "triceps pushdown": {
        primary: { muscleId: "male_triceps_brachii", percent: 100 },
        synergists: []
    },
    "skull crusher": {
        primary: { muscleId: "male_triceps_brachii", percent: 100 },
        synergists: []
    },
    "dips": {
        primary: { muscleId: "male_triceps_brachii", percent: 50 },
        synergists: [
            { muscleId: "male_pectoralis_major", percent: 40 },
            { muscleId: "male_deltoid_anterior", percent: 10 }
        ]
    },

    // ============================================
    // 🎯 ПРЕСС
    // ============================================
    "crunch": {
        primary: { muscleId: "male_rectus_abdominis", percent: 100 },
        synergists: []
    },
    "plank": {
        primary: { muscleId: "male_rectus_abdominis", percent: 60 },
        synergists: [
            { muscleId: "male_transversus_abdominis", percent: 20 },
            { muscleId: "male_erector_spinae", percent: 10 },
            { muscleId: "male_gluteus_maximus", percent: 10 }
        ]
    },
    "russian twist": {
        primary: { muscleId: "male_obliques", percent: 70 },
        synergists: [
            { muscleId: "male_rectus_abdominis", percent: 20 },
            { muscleId: "male_transversus_abdominis", percent: 10 }
        ]
    },
    "hanging leg raise": {
        primary: { muscleId: "male_rectus_abdominis", percent: 70 },
        synergists: [
            { muscleId: "male_forearm_flexors", percent: 15 },
            { muscleId: "male_obliques", percent: 15 }
        ]
    }
};

// Экспорт для использования в script.js
if (typeof window !== 'undefined') {
    window.synergistsData = synergistsData;
}