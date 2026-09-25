// ============================================
// DOM ЭЛЕМЕНТЫ
// ============================================
const searchInput = document.getElementById('searchInput');
const muscleListEl = document.getElementById('muscleList');
const infoContentEl = document.getElementById('infoContent');
const bodyImage = document.getElementById('bodyImage');
const bodyOverlays = document.getElementById('bodyOverlays');
const viewToggleBtn = document.getElementById('viewToggle');
const randomBtn = document.getElementById('randomBtn');
const shareBtn = document.getElementById('shareBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const dashboardModal = document.getElementById('dashboardModal');
const dashboardBackdrop = document.getElementById('dashboardBackdrop');
const dashboardClose = document.getElementById('dashboardClose');
const dashboardStats = document.getElementById('dashboardStats');
const dashboardAchievements = document.getElementById('dashboardAchievements');
const dashboardHistory = document.getElementById('dashboardHistory');
const challengesList = document.getElementById('challengesList');

const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteShareBtn = document.getElementById('quoteShareBtn');
const quoteCopyBtn = document.getElementById('quoteCopyBtn');

// ============================================
// СОСТОЯНИЕ
// ============================================
let currentMuscleId = null;
let currentView = 'front';
let isTransitioning = false;
let currentEquipmentFilter = 'all';
let currentListFilter = 'all';

const STORAGE_KEYS = {
    lastSelected: 'muscleMap_lastSelected',
    favorites: 'muscleMap_favorites',
    views: 'muscleMap_views_',
    completed: 'muscleMap_completed',
    streak: 'muscleMap_streak',
    studyDays: 'muscleMap_studyDays',
    achievements: 'muscleMap_achievements',
};

// ============================================
// ОБОРУДОВАНИЕ
// ============================================
const equipmentGroups = {
    home: ['body weight', 'dumbbell', 'band', 'kettlebell', 'stability ball', 'bosu ball', 'wheel roller'],
    gym: ['barbell', 'cable', 'machine', 'smith machine', 'ez barbell', 'olympic barbell', 'leverage machine', 'assisted', 'weighted', 'medicine ball', 'rope', 'trap bar']
};

const equipmentNames = {
    'body weight': '🏠 Своё тело', 'dumbbell': '🏠 Гантели', 'barbell': '🏋️ Штанга',
    'cable': '🏋️ Блок', 'machine': '🏋️ Тренажёр', 'smith machine': '🏋️ Смит',
    'ez barbell': '🏋️ EZ-штанга', 'olympic barbell': '🏋️ Олимпийская штанга',
    'kettlebell': '🏠 Гиря', 'band': '🏠 Эспандер', 'stability ball': '🏠 Фитбол',
    'medicine ball': '🏋️ Медбол', 'leverage machine': '🏋️ Рычажный',
    'assisted': '🏋️ С поддержкой', 'weighted': '🏋️ С отягощением',
    'bosu ball': '🏠 Босу', 'rope': '🏋️ Канат', 'trap bar': '🏋️ Трап-штанга',
    'wheel roller': '🏠 Ролик'
};

// ============================================
// FALLBACK
// ============================================
const muscleFallback = {};

// ============================================
// ДОСТИЖЕНИЯ
// ============================================
const achievementsDefinitions = [
    { id: 'muscles5',  icon: '🎯', text: 'Изучил 5 мышц',     check: () => getViewedMusclesCount() >= 5 },
    { id: 'muscles15', icon: '🏆', text: 'Изучил 15 мышц',    check: () => getViewedMusclesCount() >= 15 },
    { id: 'muscles30', icon: '👑', text: 'Изучил все мышцы!', check: () => getViewedMusclesCount() >= 30 },
    { id: 'exercises10', icon: '💪', text: '10 упражнений',    check: () => Object.keys(getCompleted()).length >= 10 },
    { id: 'exercises50', icon: '🔥', text: '50 упражнений',    check: () => Object.keys(getCompleted()).length >= 50 },
    { id: 'streak3',   icon: '⚡', text: 'Серия 3 дня',       check: () => getStreakData().days >= 3 },
    { id: 'streak7',   icon: '🌟', text: 'Серия 7 дней',      check: () => getStreakData().days >= 7 },
    { id: 'favorites5', icon: '⭐', text: '5 избранных',       check: () => getFavorites().length >= 5 },
];

// ============================================
// ЧЕЛЛЕНДЖИ
// ============================================
const challenges = [
    { id: 'streak7', emoji: '🔥', name: '7 дней подряд', description: 'Заходи 7 дней подряд', target: 7, getProgress: () => getStreakData().days },
    { id: 'exercises50', emoji: '💪', name: '50 упражнений', description: 'Выполни 50 упражнений', target: 50, getProgress: () => Object.keys(getCompleted()).length },
    { id: 'plank30', emoji: '🏆', name: '30 дней планки', description: 'Отмечай упражнения каждый день', target: 30, getProgress: () => getStudyDays().length },
    { id: 'muscles20', emoji: '🎯', name: 'Изучить 20 мышц', description: 'Открой 20 из 30 мышц', target: 20, getProgress: () => getViewedMusclesCount() },
    { id: 'weekend', emoji: '💯', name: 'Тренировка недели', description: 'Сделай 10 упражнений за 7 дней', target: 10, getProgress: () => {
        const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return Object.values(getCompleted()).filter(t => t >= week).length;
    }},
];

// ============================================
// ХРАНИЛИЩЕ
// ============================================
function getFavorites() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || []; }
    catch { return []; }
}

function toggleFavorite(muscleId) {
    const favs = getFavorites();
    const idx = favs.indexOf(muscleId);
    if (idx >= 0) {
        favs.splice(idx, 1);
        showToast('💔 Убрано из избранного');
    } else {
        favs.push(muscleId);
        showToast('⭐ Добавлено в избранное');
    }
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favs));
    renderList(Object.values(muscleDatabase));
    if (currentMuscleId === muscleId) renderInfo(muscleDatabase[muscleId]);
    checkNewAchievements();
}

function isFavorite(muscleId) { return getFavorites().includes(muscleId); }

function getCompleted() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.completed)) || {}; }
    catch { return {}; }
}

function markCompleted(exerciseId) {
    const completed = getCompleted();
    if (completed[exerciseId]) {
        delete completed[exerciseId];
        showToast('↩️ Отменено');
    } else {
        completed[exerciseId] = Date.now();
        showToast('✅ Выполнено!');
        addStudyDay();
        updateStreak();
    }
    localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completed));
    if (currentMuscleId) renderInfo(muscleDatabase[currentMuscleId]);
    renderChallenges();
    checkNewAchievements();
}

function isCompleted(exerciseId) { return !!getCompleted()[exerciseId]; }

function getStreakData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.streak)) || { days: 0, lastDate: null }; }
    catch { return { days: 0, lastDate: null }; }
}

function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const streak = getStreakData();
    if (streak.lastDate === today) return;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (streak.lastDate === yesterday) streak.days += 1;
    else streak.days = 1;
    streak.lastDate = today;
    localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
}

function getStudyDays() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.studyDays)) || []; }
    catch { return []; }
}

function addStudyDay() {
    const today = new Date().toISOString().split('T')[0];
    const days = getStudyDays();
    if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem(STORAGE_KEYS.studyDays, JSON.stringify(days));
    }
}

function getViews(muscleId) { return parseInt(localStorage.getItem(STORAGE_KEYS.views + muscleId)) || 0; }

function incrementViews(muscleId) {
    const key = STORAGE_KEYS.views + muscleId;
    const current = parseInt(localStorage.getItem(key)) || 0;
    localStorage.setItem(key, current + 1);
    return current + 1;
}

function getViewedMusclesCount() {
    return Object.keys(muscleDatabase).filter(id => getViews(id) > 0).length;
}

// ============================================
// ДОСТИЖЕНИЯ
// ============================================
function getUnlockedAchievements() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements)) || []; }
    catch { return []; }
}

function saveUnlockedAchievements(ids) {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(ids));
}

function checkNewAchievements() {
    const unlocked = getUnlockedAchievements();
    const newOnes = [];

    achievementsDefinitions.forEach(a => {
        if (!unlocked.includes(a.id) && a.check()) {
            unlocked.push(a.id);
            newOnes.push(a);
        }
    });

    if (newOnes.length > 0) {
        saveUnlockedAchievements(unlocked);
        newOnes.forEach((a, i) => {
            setTimeout(() => showAchievementToast(a), i * 2500);
        });
    }
}

function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-toast-icon">${achievement.icon}</div>
        <div class="achievement-toast-text">
            <div class="achievement-toast-label">🎉 Новое достижение!</div>
            <div class="achievement-toast-title">${achievement.text}</div>
        </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================
// СБРОС
// ============================================
function resetProgress() {
    if (!confirm('⚠️ Сбросить ВЕСЬ прогресс?')) return;
    localStorage.removeItem(STORAGE_KEYS.favorites);
    localStorage.removeItem(STORAGE_KEYS.completed);
    localStorage.removeItem(STORAGE_KEYS.streak);
    localStorage.removeItem(STORAGE_KEYS.studyDays);
    localStorage.removeItem(STORAGE_KEYS.achievements);
    Object.keys(muscleDatabase).forEach(id => {
        localStorage.removeItem(STORAGE_KEYS.views + id);
    });
    showToast('🔄 Прогресс сброшен');
    closeDashboard();
    renderList(Object.values(muscleDatabase));
    renderChallenges();
    if (currentMuscleId) renderInfo(muscleDatabase[currentMuscleId]);
}

// ============================================
// МАНЕКЕН
// ============================================
function updateBodyImage() {
    const imagePath = currentView === 'front'
        ? 'images/body-front_1.png'
        : 'images/body-back_2.png';
    if (bodyImage.getAttribute('src') !== imagePath) {
        bodyImage.classList.add('fade');
        setTimeout(() => {
            bodyImage.src = imagePath;
            bodyImage.classList.remove('fade');
            bodyImage.classList.add('fade-in');
            setTimeout(() => bodyImage.classList.remove('fade-in'), 500);
        }, 300);
    }
    renderOverlays();
}

function renderOverlays() {
    if (!bodyOverlays) return;
    const overlays = [];
    for (const key in muscleDatabase) {
        const m = muscleDatabase[key];
        if (!m.overlay) continue;
        const showOnFront = currentView === 'front' && (m.side === 'front' || m.side === 'both');
        const showOnBack  = currentView === 'back'  && (m.side === 'back'  || m.side === 'both');
        if (showOnFront || showOnBack) {
            const activeClass = (m.id === currentMuscleId) ? 'active' : '';
            overlays.push(`<img class="body-overlay ${activeClass}" data-muscle-id="${m.id}" src="${m.overlay}" alt="${m.name}" onerror="this.style.display='none';">`);
        }
    }
    bodyOverlays.innerHTML = overlays.join('');
}

function toggleView() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentView = currentView === 'front' ? 'back' : 'front';
    const btn = document.getElementById('viewToggle');
    if (btn) btn.textContent = currentView === 'front' ? '🔄 Вид сзади' : '🔄 Вид спереди';
    updateBodyImage();
    setTimeout(() => { isTransitioning = false; }, 600);
}

window.toggleView = toggleView;

// ============================================
// СПИСОК МЫШЦ
// ============================================
function renderList(muscles) {
    let filtered = muscles;
    if (currentListFilter === 'favorites') {
        const favs = getFavorites();
        filtered = muscles.filter(m => favs.includes(m.id));
    }

    const filterBar = `
        <div class="list-filter-bar">
            <button class="list-filter-btn ${currentListFilter === 'all' ? 'active' : ''}" data-filter="all">📚 Все (${muscles.length})</button>
            <button class="list-filter-btn ${currentListFilter === 'favorites' ? 'active' : ''}" data-filter="favorites">⭐ Избранное (${getFavorites().length})</button>
        </div>
    `;

    if (filtered.length === 0) {
        muscleListEl.innerHTML = filterBar + `<div class="empty-state">⭐ Нет избранных мышц</div>`;
        bindListFilter();
        return;
    }

    let html = '';
    filtered.forEach(muscle => {
        const active = muscle.id === currentMuscleId ? 'active' : '';
        const views = getViews(muscle.id);
        const color = getGroupColor(muscle.group);
        const icon = getGroupIcon(muscle.group);
        html += `
            <div class="list-item ${active}" data-id="${muscle.id}">
                <div class="list-item-content">
                    <span class="color-dot" style="background:${color};"></span>
                    <span>${muscle.name}</span>
                </div>
                <span class="group-tag">${icon} ${muscle.group} 👁️ ${views}</span>
            </div>
        `;
    });

    muscleListEl.innerHTML = filterBar + html;
    document.querySelectorAll('.list-item').forEach(el => el.addEventListener('click', () => selectMuscle(el.dataset.id)));
    bindListFilter();
}

function bindListFilter() {
    document.querySelectorAll('.list-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentListFilter = btn.dataset.filter;
            renderList(Object.values(muscleDatabase));
        });
    });
}

function selectMuscle(id) {
    const muscle = muscleDatabase[id];
    if (!muscle) return;
    currentMuscleId = id;
    localStorage.setItem(STORAGE_KEYS.lastSelected, id);
    incrementViews(id);
    currentEquipmentFilter = 'all';
    if (muscle.side && muscle.side !== 'both' && muscle.side !== currentView) {
        currentView = muscle.side;
        const btn = document.getElementById('viewToggle');
        if (btn) btn.textContent = currentView === 'front' ? '🔄 Вид сзади' : '🔄 Вид спереди';
    }
    renderList(Object.values(muscleDatabase));
    renderInfo(muscle);
    updateBodyImage();
    checkNewAchievements();
}

// ============================================
// УПРАЖНЕНИЯ
// ============================================
function getExercisesForMuscle(muscleId) {
    if (typeof customExercises !== 'undefined' && customExercises[muscleId]) {
        const custom = customExercises[muscleId];
        const all = [];
        
        if (custom.primary) {
            custom.primary.forEach(ex => {
                all.push({
                    id: 'custom_' + muscleId + '_' + all.length,
                    name: ex.name,
                    name_en: '',
                    equipment: 'custom',
                    description: ex.description || '',
                    sets: ex.sets || '',
                    gif: ex.gif || '',
                    muscleId: muscleId,
                    isCustom: true
                });
            });
        }
        if (custom.secondary) {
            custom.secondary.forEach(ex => {
                all.push({
                    id: 'custom_' + muscleId + '_' + all.length,
                    name: ex.name,
                    name_en: '',
                    equipment: 'custom',
                    description: ex.description || '',
                    sets: ex.sets || '',
                    gif: ex.gif || '',
                    muscleId: muscleId,
                    isCustom: true
                });
            });
        }
        
        if (all.length > 0 && typeof exerciseDatabase !== 'undefined') {
            const fromDb = exerciseDatabase.filter(ex => ex.muscleId === muscleId).slice(0, 5);
            return [...all, ...fromDb];
        }
        
        if (all.length > 0) return all;
    }
    
    if (typeof exerciseDatabase === 'undefined') return [];
    const all = exerciseDatabase.filter(ex => ex.muscleId === muscleId);
    const priority = all.filter(ex => {
        const n = (ex.name_en || '').toLowerCase();
        return !n.includes('close grip') && !n.includes('wide grip') && !n.includes('narrow')
            && !n.includes('reverse grip') && !n.includes('alternate') && !n.includes('alternating')
            && !n.includes('single') && !n.includes('one arm') && !n.includes('one leg')
            && !n.includes('twist') && !n.includes('twisting');
    });
    const others = all.filter(ex => !priority.includes(ex));
    return [...priority, ...others].slice(0, 15);
}

function filterByEquipment(exercises, filter) {
    if (filter === 'all') return exercises;
    const allowed = equipmentGroups[filter] || [];
    return exercises.filter(ex => allowed.includes(ex.equipment));
}

function getCustomEquipment(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('штанга') || n.includes('штанги') || n.includes('штангой')) return 'barbell';
    if (n.includes('гантел')) return 'dumbbell';
    if (n.includes('блок') || n.includes('кроссовер')) return 'cable';
    if (n.includes('тренажёр') || n.includes('тренажер')) return 'machine';
    if (n.includes('эспандер') || n.includes('резинк')) return 'band';
    if (n.includes('гиря') || n.includes('гирей')) return 'kettlebell';
    if (n.includes('скамья') || n.includes('скамье') || n.includes('наклонная')) return 'barbell';
    if (n.includes('своё тело') || n.includes('свое тело') || n.includes('без веса') || n.includes('веса')) return 'body weight';
    return 'body weight';
}
// ============================================
// 🌐 ПЕРЕВОД НАЗВАНИЙ УПРАЖНЕНИЙ НА РУССКИЙ
// ============================================


   const exerciseWordDict = {
    // === ОБОРУДОВАНИЕ ===
    'barbell': 'со штангой',
    'dumbbell': 'с гантелями',
    'dumbbells': 'с гантелями',
    'ez bar': 'с EZ-штангой',
    'ez barbell': 'с EZ-штангой',
    'ez-bar': 'с EZ-штангой',
    'olympic barbell': 'с олимпийской штангой',
    'cable': 'на блоке',
    'machine': 'в тренажёре',
    'smith': 'в Смите',
    'smith machine': 'в Смите',
    'lever': 'в рычажном',
    'kettlebell': 'с гирей',
    'band': 'с эспандером',
    'resistance band': 'с эспандером',
    'bodyweight': 'своё тело',
    'body weight': 'своё тело',
    'weighted': 'с отягощением',
    'medicine ball': 'с медболом',
    'stability ball': 'на фитболе',
    'exercise ball': 'на фитболе',
    'bosu ball': 'на босу',
    'rope': 'с канатом',
    'trap bar': 'с трап-штангой',
    'wheel roller': 'с роликом',
    'roller': 'с роликом',
    'towel': 'с полотенцем',
    'straps': 'с ремнями',
    'bench': 'на скамье',
    'floor': 'на полу',
    'wall': 'у стены',
    'bar': 'на турнике',
    'parallel bars': 'на брусьях',
    'dip cage': 'на брусьях',
    'rings': 'на кольцах',
    'ring': 'на кольцах',
    'trx': 'TRX',
    'suspension': 'на петлях',
    'sled': 'на санях',
    'tire': 'с покрышкой',
    'sledge hammer': 'с кувалдой',
    'battling ropes': 'с канатами',
    'skierg': 'на ски-эргометре',
    'ski ergometer': 'на ски-эргометре',
    'balance board': 'на балансировочной доске',
    'bosu': 'на босу',

    // === ЧАСТИ ТЕЛА / МЫШЦЫ ===
    'chest': 'грудь',
    'back': 'спина',
    'shoulder': 'плечо',
    'shoulders': 'плечи',
    'biceps': 'бицепс',
    'bicep': 'бицепс',
    'triceps': 'трицепс',
    'tricep': 'трицепс',
    'lats': 'широчайшие',
    'abs': 'пресс',
    'oblique': 'косые',
    'obliques': 'косые',
    'glutes': 'ягодицы',
    'glute': 'ягодицы',
    'gluteus': 'ягодичные',
    'hamstring': 'бицепс бедра',
    'hamstrings': 'бицепс бедра',
    'quads': 'квадрицепс',
    'quad': 'квадрицепс',
    'calves': 'голени',
    'calf': 'голень',
    'adductor': 'приводящие',
    'abductor': 'отводящие',
    'forearm': 'предплечье',
    'forearms': 'предплечья',
    'wrist': 'запястье',
    'hip': 'бедро',
    'hip flexor': 'сгибатель бедра',
    'knee': 'колено',
    'knees': 'колени',
    'leg': 'нога',
    'legs': 'ноги',
    'thigh': 'бедро',
    'ankle': 'лодыжка',
    'neck': 'шея',
    'spine': 'позвоночник',
    'lower back': 'поясница',
    'upper back': 'верх спины',
    'inner chest': 'внутренняя грудь',
    'rear delt': 'задняя дельта',
    'rear deltoid': 'задняя дельта',
    'deltoid': 'дельта',
    'pectoralis': 'грудная',
    'pectorals': 'грудные',
    'pec': 'грудная',
    'rectus femoris': 'прямая мышца бедра',
    'tibialis': 'большеберцовая',
    'piriformis': 'грушевидная',
    'sternum': 'грудина',

    // === ДЕЙСТВИЯ ===
    'press': 'жим',
    'pressing': 'жим',
    'bench press': 'жим лёжа',
    'curl': 'сгибание',
    'curls': 'сгибания',
    'extension': 'разгибание',
    'extensions': 'разгибания',
    'raise': 'подъём',
    'raises': 'подъёмы',
    'row': 'тяга',
    'rows': 'тяги',
    'pulldown': 'тяга верхнего блока',
    'pushdown': 'разгибание на блоке',
    'push-up': 'отжимание',
    'push up': 'отжимание',
    'pushup': 'отжимание',
    'push-ups': 'отжимания',
    'pull-up': 'подтягивание',
    'pull up': 'подтягивание',
    'pullup': 'подтягивание',
    'chin-up': 'подтягивание обратным хватом',
    'chin up': 'подтягивание обратным хватом',
    'dip': 'отжимание на брусьях',
    'dips': 'отжимания на брусьях',
    'squat': 'приседание',
    'squats': 'приседания',
    'lunge': 'выпад',
    'lunges': 'выпады',
    'deadlift': 'становая тяга',
    'clean': 'взятие на грудь',
    'snatch': 'рывок',
    'jerk': 'толчок',
    'swing': 'махи',
    'swings': 'махи',
    'thruster': 'трастер',
    'walk': 'ходьба',
    'walking': 'ходьба',
    'carry': 'переноска',
    'jump': 'прыжок',
    'jumps': 'прыжки',
    'jumping': 'прыжки',
    'hop': 'прыжок',
    'step': 'зашагивание',
    'step-up': 'зашагивание',
    'crunch': 'скручивание',
    'crunches': 'скручивания',
    'sit-up': 'подъём корпуса',
    'sit up': 'подъём корпуса',
    'sit-ups': 'подъёмы корпуса',
    'plank': 'планка',
    'bridge': 'мостик',
    'stretch': 'растяжка',
    'twist': 'поворот',
    'twisting': 'с поворотом',
    'rotation': 'вращение',
    'circle': 'круговое движение',
    'circles': 'круговые движения',
    'lift': 'подъём',
    'lifted': 'поднятый',
    'pull': 'тяга',
    'push': 'жим',
    'touch': 'касание',
    'hold': 'удержание',
    'kick': 'удар',
    'kickback': 'разгибание назад',
    'fly': 'разводка',
    'flyes': 'разводки',
    'cross-over': 'кроссовер',
    'crossover': 'кроссовер',
    'hug': 'объятие',
    'squeeze': 'сжатие',
    'twist': 'поворот',
    'sit': 'сед',
    'lean': 'наклон',
    'fallout': 'выпад',
    'climb': 'подъём',
    'crawl': 'ходьба',
    'march': 'ходьба',
    'kick': 'удар',
    'throw': 'бросок',
    'slam': 'удар',
    'flip': 'переворот',
    'sprint': 'спринт',
    'bend': 'наклон',
    'clean and press': 'взятие на грудь и жим',
    'good morning': 'наклоны со штангой',
    'pull through': 'протяжка',
    'pullover': 'пуловер',
    'shrug': 'шраги',
    'upright row': 'тяга к подбородку',
    'rear delt row': 'тяга на заднюю дельту',
    'face pull': 'тяга к лицу',
    'skull crusher': 'французский жим',
    'skullcrusher': 'французский жим',
    'french press': 'французский жим',
    'drag curl': 'тяговое сгибание',
    'spider curl': 'сгибание паук',
    'zottman curl': 'сгибание Зоттмана',
    'preacher curl': 'сгибание на скамье Скотта',
    'concentration curl': 'концентрированное сгибание',
    'hammer curl': 'молотковое сгибание',
    'reverse curl': 'обратное сгибание',
    'wrist curl': 'сгибание запястий',
    'calf raise': 'подъём на носки',
    'glute bridge': 'ягодичный мост',
    'hip thrust': 'ягодичный мост',
    'hip lift': 'подъём бедра',
    'hip extension': 'разгибание бедра',
    'leg extension': 'разгибание ног',
    'leg curl': 'сгибание ног',
    'leg press': 'жим ногами',
    'lat pulldown': 'тяга верхнего блока',
    'lat stretch': 'растяжка широчайших',
    'shoulder press': 'жим над головой',
    'military press': 'жим стоя',
    'arnold press': 'жим Арнольда',
    'overhead press': 'жим над головой',
    'lateral raise': 'махи в стороны',
    'front raise': 'махи перед собой',
    'rear delt raise': 'махи на заднюю дельту',
    'reverse fly': 'обратная разводка',
    'bench press': 'жим лёжа',
    'incline bench press': 'жим лёжа на наклонной',
    'decline bench press': 'жим лёжа на обратной наклонной',
    'close-grip bench press': 'жим лёжа узким хватом',
    'wide-grip bench press': 'жим лёжа широким хватом',
    'jm bench press': 'жим JM',
    'svend press': 'жим Свенда',
    'tate press': 'жим Тейта',
    'cuban press': 'кубинский жим',
    'bradford press': 'жим Брэдфорда',
    'scott press': 'жим Скотта',
    'w-press': 'W-жим',
    'floor press': 'жим с пола',
    'pin press': 'жим со стоек',
    'rack pull': 'тяга со стоек',
    'pullover to press': 'пуловер в жим',
    'sit to stand': 'вставание со стула',

    // === ПОЛОЖЕНИЯ ===
    'seated': 'сидя',
    'standing': 'стоя',
    'lying': 'лёжа',
    'prone': 'лёжа на животе',
    'supine': 'лёжа на спине',
    'kneeling': 'на коленях',
    'hanging': 'в висе',
    'bent over': 'в наклоне',
    'bent-over': 'в наклоне',
    'incline': 'на наклонной',
    'decline': 'на обратной наклонной',
    'flat': 'на горизонтальной',
    'sitted': 'сидя',
    'half': 'полу',
    'full': 'полный',
    'single': 'одной рукой',
    'two': 'две',
    'double': 'двойной',
    'one arm': 'одной рукой',
    'one-arm': 'одной рукой',
    'one leg': 'одной ногой',
    'one-legged': 'одной ногой',
    'alternate': 'попеременно',
    'alternating': 'попеременно',
    'reverse': 'обратный',
    'forward': 'вперёд',
    'backward': 'назад',
    'side': 'боковой',
    'lateral': 'боковой',
    'front': 'передний',
    'rear': 'задний',
    'close': 'узкий',
    'close-grip': 'узким хватом',
    'wide': 'широкий',
    'wide-grip': 'широким хватом',
    'narrow': 'узкий',
    'neutral': 'нейтральный',
    'neutral grip': 'нейтральным хватом',
    'overhand': 'прямым хватом',
    'underhand': 'обратным хватом',
    'mixed grip': 'смешанным хватом',
    'overhead': 'над головой',
    'behind': 'из-за',
    'behind neck': 'из-за головы',
    'around': 'вокруг',
    'around world': 'вокруг мира',
    'to': 'к',
    'from': 'с',
    'on': 'на',
    'with': 'с',
    'over': 'через',
    'under': 'под',
    'against': 'у',
    'into': 'в',
    'through': 'через',
    'across': 'поперёк',
    'up': 'вверх',
    'down': 'вниз',
    'in': 'в',
    'out': 'из',
    'off': 'с',
    'apart': 'врозь',
    'together': 'вместе',
    'high': 'высокий',
    'low': 'низкий',
    'mid': 'средний',
    'middle': 'средний',
    'upper': 'верхний',
    'lower': 'нижний',
    'inner': 'внутренний',
    'outer': 'внешний',
    'deep': 'глубокий',
    'short': 'короткий',
    'long': 'длинный',
    'extended': 'вытянутый',
    'straight': 'прямой',
    'bent': 'согнутый',
    'crossed': 'скрещённый',
    'clasped': 'сцепленный',
    'reversed': 'обратный',
    'cross': 'перекрёстный',
    'cross body': 'поперёк тела',
    'cross-body': 'поперёк тела',
    'contralateral': 'противоположный',
    'unilateral': 'односторонний',
    'ipsilateral': 'односторонний',
    'palms': 'ладони',
    'palm': 'ладонь',
    'palm-in': 'ладонями внутрь',
    'palms up': 'ладонями вверх',
    'palms down': 'ладонями вниз',
    'pronated': 'прямым хватом',
    'supinated': 'обратным хватом',
    'pronate-grip': 'прямым хватом',
    'w': 'W',
    'y': 'Y',
    't': 'T',
    'l': 'L',
    'v': 'V',
    'v-up': 'V-скручивание',
    'v-sit': 'V-сед',
    'l-sit': 'L-сед',
    'l-pull-up': 'L-подтягивание',
    'y-raise': 'Y-подъём',
    't-raise': 'T-подъём',
    't-bar': 'Т-гриф',
    't bar': 'Т-гриф',

    // === УПРАЖНЕНИЯ ===
    'air bike': 'велосипед',
    'bicycle': 'велосипед',
    'ankle circles': 'круговые движения лодыжкой',
    'ankle circle': 'круговое движение лодыжкой',
    'wrist circles': 'круговые движения запястьями',
    'toe touch': 'касание стоп',
    'heel touchers': 'касания пяток',
    'donkey calf raise': 'ослиный подъём на носки',
    'donkey kick': 'удар осла',
    'fire hydrant': 'пожарный гидрант',
    'clamshell': 'ракушка',
    'superman': 'супермен',
    'bird dog': 'птица-собака',
    'dead bug': 'мёртвый жук',
    'mountain climber': 'альпинист',
    'burpee': 'бёрпи',
    'inchworm': 'червяк',
    'bear crawl': 'медвежья ходьба',
    'crab walk': 'ходьба крабом',
    'spider crawl': 'ходьба паука',
    'monster walk': 'монстр-ходьба',
    'glute bridge march': 'ягодичный мост с шагами',
    'flutter kicks': 'порхающие удары',
    'scissor kicks': 'ножницы',
    'leg raise': 'подъём ног',
    'leg-hip raise': 'подъём ног и бедра',
    'knee raise': 'подъём коленей',
    'hip raise': 'подъём бедра',
    'reverse crunch': 'обратное скручивание',
    'bicycle crunch': 'велосипед',
    'cross body crunch': 'скручивание поперёк тела',
    'oblique crunch': 'скручивание на косые',
    'jackknife sit-up': 'складной подъём корпуса',
    'jack knife sit-up': 'складной подъём корпуса',
    'frog crunch': 'скручивание лягушкой',
    'tuck crunch': 'скручивание с подтягиванием',
    'negative crunch': 'негативное скручивание',
    'v-up': 'V-скручивание',
    'cocoon': 'кокон',
    'hollow body': 'полая лодка',
    'boat pose': 'поза лодки',
    'butterfly yoga pose': 'поза бабочки',
    'child pose': 'поза ребёнка',
    'cobra': 'кобра',
    'downward dog': 'собака мордой вниз',
    'upward facing dog': 'собака мордой вверх',
    'warrior': 'воин',
    'bridge pose': 'поза моста',
    'plank': 'планка',
    'side plank': 'боковая планка',
    'reverse plank': 'обратная планка',
    'front plank': 'передняя планка',
    'power point plank': 'планка на предплечьях',
    'world greatest stretch': 'лучшая растяжка',
    'runners stretch': 'растяжка бегуна',
    'hurdler stretch': 'растяжка барьериста',
    'butterfly stretch': 'бабочка',
    'frog stretch': 'растяжка лягушкой',
    'lizard stretch': 'растяжка ящерицы',
    'pigeon pose': 'поза голубя',
    'cat cow': 'кошка-корова',
    'spine twist': 'скручивание позвоночника',
    'spine stretch': 'растяжка позвоночника',
    'neck side stretch': 'боковая растяжка шеи',
    'upper back stretch': 'растяжка верхней части спины',
    'lower back stretch': 'растяжка поясницы',
    'chest stretch': 'растяжка груди',
    'shoulder stretch': 'растяжка плеч',
    'triceps stretch': 'растяжка трицепса',
    'biceps stretch': 'растяжка бицепса',
    'lat stretch': 'растяжка широчайших',
    'quad stretch': 'растяжка квадрицепса',
    'hamstring stretch': 'растяжка бицепса бедра',
    'calf stretch': 'растяжка голени',
    'glute stretch': 'растяжка ягодиц',
    'hip flexor stretch': 'растяжка сгибателя бедра',
    'adductor stretch': 'растяжка приводящих',
    'abductor stretch': 'растяжка отводящих',
    'groin stretch': 'растяжка паха',
    'wrist stretch': 'растяжка запястий',
    'forearm stretch': 'растяжка предплечий',
    'side wrist pull stretch': 'боковая растяжка запястья',
    'rear deltoid stretch': 'растяжка задней дельты',
    'peroneals stretch': 'растяжка малоберцовых',
    'posterior tibialis stretch': 'растяжка задней большеберцовой',
    'soleus stretch': 'растяжка камбаловидной',
    'rocking frog stretch': 'раскачивающаяся растяжка лягушкой',
    'world\'s greatest stretch': 'лучшая растяжка в мире',
    'iron cross stretch': 'растяжка железный крест',
    'roller': 'ролик',
    'rollerout': 'выкат роликом',
    'wheel rollerout': 'выкат роликом',
    'ab roller': 'ролик для пресса',
    'ab rollerout': 'выкат роликом для пресса',
    'body saw': 'пила для корпуса',
    'plank saw': 'планка-пила',
    'plank up-down': 'планка вверх-вниз',
    'shoulder tap': 'касание плеча',
    'shoulder tap push-up': 'отжимание с касанием плеча',
    'push-up plus': 'отжимание плюс',
    'scapula push-up': 'отжимание лопаток',
    'scapula dips': 'отжимания лопаток',
    'scapular pull-up': 'подтягивание лопаток',
    'handstand': 'стойка на руках',
    'handstand push-up': 'отжимание в стойке на руках',
    'headstand': 'стойка на голове',
    'planche': 'горизонт',
    'full planche': 'полный горизонт',
    'lean planche': 'горизонт с наклоном',
    'straddle planche': 'горизонт ноги врозь',
    'frog planche': 'горизонт лягушкой',
    'maltese': 'мальтийский крест',
    'full maltese': 'полный мальтийский крест',
    'straddle maltese': 'мальтийский крест ноги врозь',
    'front lever': 'передний вис',
    'back lever': 'задний вис',
    'skin the cat': 'выкрут',
    'muscle up': 'выход силой',
    'muscle-up': 'выход силой',
    'kipping muscle up': 'выход силой киппинг',
    'pull-up': 'подтягивание',
    'chin-up': 'подтягивание обратным хватом',
    'archer pull up': 'подтягивания лучника',
    'archer push up': 'отжимания лучника',
    'l-pull-up': 'L-подтягивание',
    'l-sit': 'L-сед',
    'v-sit': 'V-сед',
    'flag': 'флаг',
    'human flag': 'флаг',
    'front lever reps': 'передний вис',
    'planche push-up': 'отжимание в горизонте',
    'full planche push-up': 'полный горизонт с отжиманием',
    'stalder press': 'жим Штальдера',
    'sissy squat': 'сисси-приседания',
    'pistol squat': 'пистолетик',
    'cossack squat': 'казацкие приседания',
    'sumo squat': 'приседания сумо',
    'hack squat': 'гакк-приседания',
    'zercher squat': 'приседания Зерхера',
    'front squat': 'фронтальные приседания',
    'back squat': 'приседания со штангой',
    'high bar squat': 'приседания с высоким грифом',
    'low bar squat': 'приседания с низким грифом',
    'goblet squat': 'гоблет-приседания',
    'jump squat': 'выпрыгивания',
    'split squat': 'болгарские выпады',
    'bulgarian split squat': 'болгарские выпады',
    'squat jump': 'выпрыгивания',
    'box squat': 'приседания на тумбу',
    'chair squat': 'приседания на стул',
    'speed squat': 'скоростные приседания',
    'frankenstein squat': 'приседания Франкенштейна',
    'jefferson squat': 'приседания Джефферсона',
    'sumo deadlift': 'становая тяга сумо',
    'romanian deadlift': 'румынская тяга',
    'stiff leg deadlift': 'становая тяга на прямых ногах',
    'stiff-leg deadlift': 'становая тяга на прямых ногах',
    'trap bar deadlift': 'становая тяга с трап-грифом',
    'single leg deadlift': 'становая тяга на одной ноге',
    'power clean': 'взятие на грудь',
    'hang clean': 'взятие с виса',
    'clean and jerk': 'взятие на грудь и толчок',
    'clean and press': 'взятие на грудь и жим',
    'snatch': 'рывок',
    'power snatch': 'рывок',
    'jerk': 'толчок',
    'push jerk': 'толчок',
    'split jerk': 'толчок врозь',
    'thruster': 'трастер',
    'turkish get up': 'турецкий подъём',
    'turkish get-up': 'турецкий подъём',
    'windmill': 'мельница',
    'figure 8': 'восьмёрка',
    'renegade row': 'тяга ренегата',
    'seesaw press': 'жим-качели',
    'see-saw press': 'жим-качели',
    'bottoms up': 'перевёрнутый',
    'bottoms-up': 'перевёрнутый',
    'farmer\'s walk': 'фермерская ходьба',
    'farmers walk': 'фермерская ходьба',
    'suitcase carry': 'переноска чемодана',
    'waiter carry': 'переноска официанта',
    'rack carry': 'переноска на груди',
    'overhead carry': 'переноска над головой',
    'step-up': 'зашагивание',
    'step up': 'зашагивание',
    'box jump': 'прыжок на тумбу',
    'jump squat': 'выпрыгивания',
    'broad jump': 'прыжок в длину',
    'vertical jump': 'прыжок вверх',
    'tuck jump': 'прыжок с подтягиванием колен',
    'jump lunge': 'выпады с прыжком',
    'jumping jack': 'прыжки с хлопками',
    'jumping jacks': 'прыжки с хлопками',
    'jump rope': 'прыжки через скакалку',
    'skipping': 'прыжки через скакалку',
    'high knees': 'высокие колени',
    'butt kicks': 'захлёст голени',
    'mountain climbers': 'альпинисты',
    'burpee': 'бёрпи',
    'burpees': 'бёрпи',
    'sprawl': 'распластаться',
    'inchworm': 'червяк',
    'bear crawl': 'медвежья ходьба',
    'crab walk': 'ходьба крабом',
    'duck walk': 'утиная ходьба',
    'lunge walk': 'выпады с ходьбой',
    'walking lunge': 'выпады с ходьбой',
    'reverse lunge': 'обратные выпады',
    'lateral lunge': 'боковые выпады',
    'side lunge': 'боковые выпады',
    'curtsy lunge': 'выпады с зашагиванием',
    'deficit lunge': 'выпады с дефицитом',
    'deficit reverse lunge': 'обратные выпады с дефицитом',
    'drop jump': 'прыжок в глубину',
    'depth jump': 'прыжок в глубину',
    'box jump down': 'спрыгивание с тумбы',
    'broad jump': 'прыжок в длину',
    'shuttle run': 'челночный бег',
    'sprint': 'спринт',
    'wind sprint': 'спринт на ветру',
    'hand bike': 'ручной велосипед',
    'hands bike': 'ручной велосипед',
    'battling ropes': 'боевые канаты',
    'rope climb': 'подъём по канату',
    'tire flip': 'переворот покрышки',
    'sledgehammer': 'кувалда',
    'sledge hammer': 'кувалда',
    'kayak row': 'гребля на каяке',
    'judo flip': 'дзюдо-переворот',
    'landmine 180': 'обратный выпад с поворотом',
    'landmine press': 'жим с landmine',
    'landmine lateral raise': 'боковые махи с landmine',
    'landmine twist': 'поворот с landmine',
    'sot press': 'жим СОТ',
    'z press': 'Z-жим',
    'floor press': 'жим с пола',
    'board press': 'жим с доски',
    'pin press': 'жим со стоек',
    'rack pull': 'тяга со стоек',
    'block pull': 'тяга с блоков',
    'deficit deadlift': 'становая тяга с дефицитом',
    'snatch grip deadlift': 'становая тяга рывковым хватом',
    'clean grip deadlift': 'становая тяга взятием',
    'sumo deadlift high pull': 'тяга сумо к подбородку',
    'high pull': 'высокая тяга',
    'upright row': 'тяга к подбородку',
    'wide-grip upright row': 'тяга к подбородку широким хватом',
    'close-grip upright row': 'тяга к подбородку узким хватом',
    'face pull': 'тяга к лицу',
    'band pull apart': 'разведение эспандера',
    'pull apart': 'разведение',
    'band pull-apart': 'разведение эспандера',
    'scapular retraction': 'сведение лопаток',
    'scapular protraction': 'разведение лопаток',
    'wall slide': 'скольжение по стене',
    'wall angel': 'ангел у стены',
    'prone y raise': 'Y-подъём лёжа',
    'prone t raise': 'T-подъём лёжа',
    'prone w raise': 'W-подъём лёжа',
    'prone i raise': 'I-подъём лёжа',
    'ytwl': 'YTWL',
    'external rotation': 'наружное вращение',
    'internal rotation': 'внутреннее вращение',
    'hip internal rotation': 'внутреннее вращение бедра',
    'hip external rotation': 'наружное вращение бедра',
    'shoulder external rotation': 'наружное вращение плеча',
    'shoulder internal rotation': 'внутреннее вращение плеча',
    'cuban rotation': 'кубинское вращение',
    'cuban press': 'кубинский жим',
    'arm circles': 'круговые движения руками',
    'arm circle': 'круговое движение рукой',
    'shoulder circles': 'круговые движения плечами',
    'neck circles': 'круговые движения шеей',
    'hip circles': 'круговые движения бедрами',
    'leg swings': 'махи ногами',
    'arm swings': 'махи руками',
    'torso twist': 'повороты корпуса',
    'torso rotation': 'вращение корпуса',
    'trunk rotation': 'вращение корпуса',
    'trunk twist': 'поворот корпуса',
    'side bend': 'боковой наклон',
    'side bends': 'боковые наклоны',
    'standing side bend': 'боковые наклоны стоя',
    'seated side bend': 'боковые наклоны сидя',
    'weighted side bend': 'боковые наклоны с отягощением',
    'russian twist': 'русский твист',
    'russian twists': 'русские твисты',
    'seated twist': 'повороты сидя',
    'prone twist': 'поворот лёжа на животе',
    'twisting crunch': 'скручивание с поворотом',
    'twisting sit-up': 'подъём корпуса с поворотом',
    'twisting leg raise': 'подъём ног с поворотом',
    'twisted leg raise': 'подъём ног с поворотом',
    'twist hip lift': 'подъём бедра с поворотом',
    'lying twist': 'поворот лёжа',
    'bent knee lying twist': 'поворот лёжа с согнутыми коленями',
    'pelvic tilt': 'наклон таза',
    'standing pelvic tilt': 'наклон таза стоя',
    'pelvic tilt into bridge': 'наклон таза в мостик',
    'glute bridge': 'ягодичный мост',
    'single leg bridge': 'ягодичный мост на одной ноге',
    'glute bridge march': 'ягодичный мост с шагами',
    'frog pump': 'лягушачий мостик',
    'hip thrust': 'ягодичный мост',
    'barbell hip thrust': 'ягодичный мост со штангой',
    'single leg hip thrust': 'ягодичный мост на одной ноге',
    'low glute bridge': 'низкий ягодичный мост',
    'reverse hyperextension': 'обратная гиперэкстензия',
    'hyperextension': 'гиперэкстензия',
    'back extension': 'разгибание спины',
    'good morning': 'наклоны со штангой',
    'seated good morning': 'наклоны сидя',
    'stiff leg good morning': 'наклоны на прямых ногах',
    'jefferson curl': 'сгибание Джефферсона',
    'jefferson curl': 'сгибание Джефферсона',
    'cat stretch': 'растяжка кошки',
    'cow stretch': 'растяжка коровы',
    'cat-cow': 'кошка-корова',
    'cat cow': 'кошка-корова',
    'spinal twist': 'скручивание позвоночника',
    'spinal stretch': 'растяжка позвоночника',
    'kneeling lat stretch': 'растяжка широчайших на коленях',
    'kneeling hip flexor stretch': 'растяжка сгибателя бедра на коленях',
    'half kneeling': 'полустоя на коленях',
    'half-kneeling': 'полустоя на коленях',
    'couch stretch': 'растяжка на диване',
    'pigeon stretch': 'растяжка голубя',
    'lizard stretch': 'растяжка ящерицы',
    'butterfly stretch': 'растяжка бабочки',
    'frog stretch': 'растяжка лягушки',
    'pancake stretch': 'растяжка блина',
    'straddle stretch': 'растяжка ноги врозь',
    'seated straddle': 'сед ноги врозь',
    'wide angle pose': 'поза широкого угла',
    'seated wide angle pose': 'поза широкого угла сидя',
    'reclining big toe pose': 'поза лежачего большого пальца',
    'reclining pigeon': 'лежачий голубь',
    'happy baby': 'счастливый малыш',
    'plow pose': 'поза плуга',
    'shoulder stand': 'стойка на плечах',
    'plank to downward dog': 'планка в собаку мордой вниз',
    'up dog': 'собака мордой вверх',
    'down dog': 'собака мордой вниз',
    'sun salutation': 'приветствие солнцу',
    'warrior pose': 'поза воина',
    'triangle pose': 'поза треугольника',
    'tree pose': 'поза дерева',
    'chair pose': 'поза стула',
    'eagle pose': 'поза орла',
    'crow pose': 'поза вороны',
    'side crow': 'боковая ворона',
    'eight angle pose': 'поза восьми углов',
    'firefly pose': 'поза светлячка',
    'peacock pose': 'поза павлина',
    'scorpion pose': 'поза скорпиона',
    'king pigeon': 'королевский голубь',
    'king cobra': 'королевская кобра',
    'camel pose': 'поза верблюда',
    'bow pose': 'поза лука',
    'locust pose': 'поза саранчи',
    'fish pose': 'поза рыбы',
    'corpse pose': 'поза трупа',
    'child\'s pose': 'поза ребёнка',
    'legs up the wall': 'ноги вверх по стене',
    'viparita karani': 'випарита карани',
    'shoulder press': 'жим над головой',
    'military press': 'жим стоя',
    'overhead press': 'жим над головой',
    'push press': 'жим толчком',
    'arnold press': 'жим Арнольда',
    'z press': 'Z-жим',
    'seated press': 'жим сидя',
    'standing press': 'жим стоя',
    'behind neck press': 'жим из-за головы',
    'behind the neck press': 'жим из-за головы',
    'bradford press': 'жим Брэдфорда',
    'bradford rocky press': 'жим Брэдфорда-Роки',
    'rocky press': 'жим Роки',
    'scott press': 'жим Скотта',
    'viking press': 'жим викинга',
    'landmine press': 'жим с landmine',
    'sot press': 'жим СОТ',
    'z press': 'Z-жим',
    'larsen press': 'жим Ларсена',
    'spoto press': 'жим Спото',
    'close grip bench press': 'жим лёжа узким хватом',
    'wide grip bench press': 'жим лёжа широким хватом',
    'reverse grip bench press': 'жим лёжа обратным хватом',
    'incline bench press': 'жим лёжа на наклонной',
    'decline bench press': 'жим лёжа на обратной наклонной',
    'dumbbell bench press': 'жим гантелей лёжа',
    'dumbbell incline press': 'жим гантелей на наклонной',
    'dumbbell decline press': 'жим гантелей на обратной наклонной',
    'neutral grip press': 'жим нейтральным хватом',
    'floor press': 'жим с пола',
    'pin press': 'жим со стоек',
    'board press': 'жим с доски',
    'jm press': 'жим JM',
    'tate press': 'жим Тейта',
    'svend press': 'жим Свенда',
    'cuban press': 'кубинский жим',
    'w-press': 'W-жим',
    'chest press': 'жим на грудь',
    'machine chest press': 'жим в тренажёре на грудь',
    'incline chest press': 'жим на грудь на наклонной',
    'decline chest press': 'жим на грудь на обратной наклонной',
    'shoulder press machine': 'жим в тренажёре на плечи',
    'leg press': 'жим ногами',
    'horizontal leg press': 'горизонтальный жим ногами',
    '45 degree leg press': 'жим ногами под 45°',
    'calf press': 'жим на носки',
    'sled leg press': 'жим ногами в санях',
    'seated leg press': 'жим ногами сидя',
    'vertical leg press': 'вертикальный жим ногами',
    'press': 'жим',
    'push': 'жим',
    'pull': 'тяга',
    'row': 'тяга',
    'pull-up': 'подтягивание',
    'chin-up': 'подтягивание обратным хватом',
    'lat pulldown': 'тяга верхнего блока',
    'close grip pulldown': 'тяга верхнего блока узким хватом',
    'wide grip pulldown': 'тяга верхнего блока широким хватом',
    'reverse grip pulldown': 'тяга верхнего блока обратным хватом',
    'underhand pulldown': 'тяга верхнего блока обратным хватом',
    'seated row': 'тяга сидя',
    'cable row': 'тяга на блоке',
    'machine row': 'тяга в тренажёре',
    'bent over row': 'тяга в наклоне',
    'barbell row': 'тяга со штангой',
    'dumbbell row': 'тяга с гантелью',
    't-bar row': 'тяга Т-грифа',
    'pendlay row': 'тяга Пендлея',
    'yates row': 'тяга Йетса',
    'seal row': 'тяга на скамье',
    'chest supported row': 'тяга с упором в грудь',
    'inverted row': 'австралийское подтягивание',
    'bodyweight row': 'австралийское подтягивание',
    'australian pull-up': 'австралийское подтягивание',
    'face pull': 'тяга к лицу',
    'high pull': 'высокая тяга',
    'upright row': 'тяга к подбородку',
    'rear delt row': 'тяга на заднюю дельту',
    'wide grip row': 'тяга широким хватом',
    'close grip row': 'тяга узким хватом',
    'one arm row': 'тяга одной рукой',
    'single arm row': 'тяга одной рукой',
    'two arm row': 'тяга двумя руками',
    'alternating row': 'попеременная тяга',
    'renegade row': 'тяга ренегата',
    'kayak row': 'гребля на каяке',
    'meadows row': 'тяга Медоуза',
    'kroc row': 'тяга Крока',
    'dumbbell pullover': 'пуловер с гантелью',
    'barbell pullover': 'пуловер со штангой',
    'cable pullover': 'пуловер на блоке',
    'straight arm pulldown': 'тяга прямыми руками',
    'straight arm pullover': 'пуловер прямыми руками',
    'lat prayer': 'молитва на широчайшие',
    'pullover': 'пуловер',
    'shrug': 'шраги',
    'barbell shrug': 'шраги со штангой',
    'dumbbell shrug': 'шраги с гантелями',
    'cable shrug': 'шраги на блоке',
    'machine shrug': 'шраги в тренажёре',
    'smith shrug': 'шраги в Смите',
    'trap bar shrug': 'шраги с трап-грифом',
    'behind the back shrug': 'шраги из-за спины',
    'incline shrug': 'шраги на наклонной',
    'decline shrug': 'шраги на обратной наклонной',
    'overhead shrug': 'шраги над головой',
    'chest supported shrug': 'шраги с упором в грудь',
    'gripless shrug': 'шраги без хвата',
    'curl': 'сгибание',
    'barbell curl': 'сгибание со штангой',
    'dumbbell curl': 'сгибание с гантелями',
    'cable curl': 'сгибание на блоке',
    'machine curl': 'сгибание в тренажёре',
    'ez bar curl': 'сгибание с EZ-штангой',
    'ez-bar curl': 'сгибание с EZ-штангой',
    'hammer curl': 'молотковое сгибание',
    'preacher curl': 'сгибание на скамье Скотта',
    'concentration curl': 'концентрированное сгибание',
    'spider curl': 'сгибание паук',
    'drag curl': 'тяговое сгибание',
    'zottman curl': 'сгибание Зоттмана',
    'reverse curl': 'обратное сгибание',
    'wrist curl': 'сгибание запястий',
    'reverse wrist curl': 'обратное сгибание запястий',
    'finger curl': 'сгибание пальцев',
    'finger curls': 'сгибание пальцев',
    'wrist roller': 'ролик для запястий',
    'wrist rollerer': 'ролик для запястий',
    'behind the back wrist curl': 'сгибание запястий за спиной',
    'seated wrist curl': 'сгибание запястий сидя',
    'standing wrist curl': 'сгибание запястий стоя',
    'incline curl': 'сгибание на наклонной',
    'decline curl': 'сгибание на обратной наклонной',
    'seated curl': 'сгибание сидя',
    'standing curl': 'сгибание стоя',
    'lying curl': 'сгибание лёжа',
    'single arm curl': 'сгибание одной рукой',
    'two arm curl': 'сгибание двумя руками',
    'alternating curl': 'попеременное сгибание',
    'cable curl': 'сгибание на блоке',
    'cable rope hammer curl': 'молотковое сгибание с канатом',
    'bayesian curl': 'байесовское сгибание',
    'waiter curl': 'сгибание официанта',
    'high curl': 'высокое сгибание',
    '20s curl': 'сгибание 21',
    '21s curl': 'сгибание 21',
    'triceps extension': 'разгибание на трицепс',
    'skull crusher': 'французский жим',
    'skullcrusher': 'французский жим',
    'french press': 'французский жим',
    'pushdown': 'разгибание на блоке',
    'triceps pushdown': 'разгибание на трицепс на блоке',
    'rope pushdown': 'разгибание с канатом',
    'v-bar pushdown': 'разгибание с V-ручкой',
    'straight bar pushdown': 'разгибание с прямой ручкой',
    'reverse grip pushdown': 'разгибание обратным хватом',
    'kickback': 'разгибание назад',
    'triceps kickback': 'разгибание на трицепс назад',
    'overhead extension': 'разгибание над головой',
    'overhead triceps extension': 'разгибание на трицепс над головой',
    'dumbbell triceps extension': 'разгибание на трицепс с гантелью',
    'barbell triceps extension': 'разгибание на трицепс со штангой',
    'cable triceps extension': 'разгибание на трицепс на блоке',
    'ez bar triceps extension': 'разгибание на трицепс с EZ-штангой',
    'jm press': 'жим JM',
    'tate press': 'жим Тейта',
    'dip': 'отжимание на брусьях',
    'triceps dip': 'отжимание на брусьях на трицепс',
    'chest dip': 'отжимание на брусьях на грудь',
    'bench dip': 'обратное отжимание',
    'ring dip': 'отжимание на кольцах',
    'korean dip': 'корейское отжимание',
    'impossible dip': 'невозможное отжимание',
    'elbow dip': 'отжимание на локтях',
    'push-up': 'отжимание',
    'push up': 'отжимание',
    'pushup': 'отжимание',
    'diamond push-up': 'отжимание ромбом',
    'close grip push-up': 'отжимание узким хватом',
    'wide push-up': 'отжимание широким хватом',
    'archer push-up': 'отжимание лучника',
    'pike push-up': 'отжимание уголком',
    'hindu push-up': 'индуистское отжимание',
    'clap push-up': 'отжимание с хлопком',
    'explosive push-up': 'взрывное отжимание',
    'plyo push-up': 'плиометрическое отжимание',
    'drop push-up': 'отжимание с падением',
    'clock push-up': 'отжимание по часам',
    'superman push-up': 'отжимание супермена',
    'spider crawl push-up': 'отжимание с ходьбой паука',
    'incline push-up': 'отжимание с наклоном',
    'decline push-up': 'отжимание с обратным наклоном',
    'wall push-up': 'отжимание от стены',
    'kneeling push-up': 'отжимание с колен',
    'handstand push-up': 'отжимание в стойке на руках',
    'scapula push-up': 'отжимание лопаток',
    'push-up plus': 'отжимание плюс',
    'plyo push up': 'плиометрическое отжимание',
    'pseudo planche push-up': 'псевдо-горизонт отжимание',
    'planche push-up': 'отжимание в горизонте',
    'one arm push-up': 'отжимание одной рукой',
    'plyometric push-up': 'плиометрическое отжимание',
    'sphinx push-up': 'отжимание сфинкса',
    'pike-to-cobra push-up': 'отжимание уголок-кобра',
    'chin-up': 'подтягивание обратным хватом',
    'chin up': 'подтягивание обратным хватом',
    'close grip chin-up': 'подтягивание узким обратным хватом',
    'weighted chin-up': 'подтягивание обратным хватом с отягощением',
    'one arm chin-up': 'подтягивание одной рукой',
    'mixed grip chin-up': 'подтягивание смешанным хватом',
    'gorilla chin': 'подтягивание гориллы',
    'side-to-side chin': 'подтягивание с поворотом',
    'sternum chin': 'подтягивание к грудине',
    'gironda sternum chin': 'подтягивание Жиронда к грудине',
    'pull-up': 'подтягивание',
    'archer pull-up': 'подтягивание лучника',
    'l-pull-up': 'L-подтягивание',
    'weighted pull-up': 'подтягивание с отягощением',
    'assisted pull-up': 'подтягивание с поддержкой',
    'scapular pull-up': 'подтягивание лопаток',
    'wide grip pull-up': 'подтягивание широким хватом',
    'close grip pull-up': 'подтягивание узким хватом',
    'neutral grip pull-up': 'подтягивание нейтральным хватом',
    'commando pull-up': 'подтягивание коммандо',
    'typewriter pull-up': 'подтягивание печатной машинкой',
    'korean pull-up': 'корейское подтягивание',
    'chest to bar pull-up': 'подтягивание до груди',
    'crunches': 'скручивания',
    'crunch': 'скручивание',
    'bicycle crunch': 'велосипед',
    'reverse crunch': 'обратное скручивание',
    'cross body crunch': 'скручивание поперёк тела',
    'oblique crunch': 'скручивание на косые',
    'cable crunch': 'скручивание на блоке',
    'machine crunch': 'скручивание в тренажёре',
    'weighted crunch': 'скручивание с отягощением',
    'decline crunch': 'скручивание на обратной наклонной',
    'incline crunch': 'скручивание на наклонной',
    'stability ball crunch': 'скручивание на фитболе',
    'bosu crunch': 'скручивание на босу',
    'bent knee crunch': 'скручивание с согнутыми коленями',
    'toe touch crunch': 'скручивание с касанием стоп',
    'frog crunch': 'скручивание лягушкой',
    'tuck crunch': 'скручивание с подтягиванием',
    'vertical crunch': 'вертикальное скручивание',
    'negative crunch': 'негативное скручивание',
    'cable crunch': 'скручивание на блоке',
    'oblique cable crunch': 'скручивание на косые на блоке',
    'side crunch': 'боковое скручивание',
    'double crunch': 'двойное скручивание',
    'sit-up': 'подъём корпуса',
    'sit up': 'подъём корпуса',
    'full sit-up': 'полный подъём корпуса',
    'half sit-up': 'половинный подъём корпуса',
    'jackknife sit-up': 'складной подъём корпуса',
    'janda sit-up': 'подъём корпуса Янда',
    'incline sit-up': 'подъём корпуса на наклонной',
    'decline sit-up': 'подъём корпуса на обратной наклонной',
    'weighted sit-up': 'подъём корпуса с отягощением',
    'assisted sit-up': 'подъём корпуса с поддержкой',
    'v-up': 'V-скручивание',
    'v sit-up': 'V-подъём корпуса',
    'quarter sit-up': 'четверть подъёма корпуса',
    'prisoner sit-up': 'подъём корпуса заключённого',
    'arms overhead sit-up': 'подъём корпуса с руками над головой',
    'sit-up with arms on chest': 'подъём корпуса с руками на груди',
    'leg raise': 'подъём ног',
    'leg raises': 'подъёмы ног',
    'hanging leg raise': 'подъём ног в висе',
    'lying leg raise': 'подъём ног лёжа',
    'captain chair leg raise': 'подъём ног в тренажёре',
    'vertical leg raise': 'вертикальный подъём ног',
    'weighted leg raise': 'подъём ног с отягощением',
    'twisting leg raise': 'подъём ног с поворотом',
    'single leg raise': 'подъём одной ноги',
    'alternating leg raise': 'попеременный подъём ног',
    'knee raise': 'подъём коленей',
    'hanging knee raise': 'подъём коленей в висе',
    'lying knee raise': 'подъём коленей лёжа',
    'hip raise': 'подъём бедра',
    'lying hip raise': 'подъём бедра лёжа',
    'reverse hip raise': 'обратный подъём бедра',
    'plank': 'планка',
    'side plank': 'боковая планка',
    'front plank': 'передняя планка',
    'reverse plank': 'обратная планка',
    'plank with twist': 'планка с поворотом',
    'plank with leg lift': 'планка с подъёмом ноги',
    'plank with arm lift': 'планка с подъёмом руки',
    'plank jack': 'планка с прыжками',
    'plank up-down': 'планка вверх-вниз',
    'plank to push-up': 'планка в отжимание',
    'walking plank': 'планка с ходьбой',
    'weighted plank': 'планка с отягощением',
    'stability ball plank': 'планка на фитболе',
    'bosu plank': 'планка на босу',
    'bird dog': 'птица-собака',
    'dead bug': 'мёртвый жук',
    'superman': 'супермен',
    'superman hold': 'супермен удержание',
    'hollow body hold': 'удержание полой лодки',
    'hollow body rock': 'раскачивание полой лодки',
    'boat pose': 'поза лодки',
    'side bend': 'боковой наклон',
    'cable side bend': 'боковой наклон на блоке',
    'dumbbell side bend': 'боковой наклон с гантелью',
    'barbell side bend': 'боковой наклон со штангой',
    'weighted side bend': 'боковой наклон с отягощением',
    'seated side bend': 'боковой наклон сидя',
    'standing side bend': 'боковой наклон стоя',
    'russian twist': 'русский твист',
    'cable russian twist': 'русский твист на блоке',
    'weighted russian twist': 'русский твист с отягощением',
    'seated russian twist': 'русский твист сидя',
    'lying russian twist': 'русский твист лёжа',
    'twist': 'поворот',
    'twisting': 'с поворотом',
    'wood chop': 'рубка дерева',
    'cable wood chop': 'рубка дерева на блоке',
    'landmine twist': 'поворот с landmine',
    'pallof press': 'жим Паллофа',
    'cable pallof press': 'жим Паллофа на блоке',
    'band pallof press': 'жим Паллофа с эспандером',
    'squat': 'приседание',
    'squats': 'приседания',
    'lunge': 'выпад',
    'lunges': 'выпады',
    'deadlift': 'становая тяга',
    'hip thrust': 'ягодичный мост',
    'glute bridge': 'ягодичный мост',
    'calf raise': 'подъём на носки',
    'leg curl': 'сгибание ног',
    'leg extension': 'разгибание ног',
    'leg press': 'жим ногами',
    'walking lunge': 'выпады с ходьбой',
    'reverse lunge': 'обратные выпады',
    'lateral lunge': 'боковые выпады',
    'curtsy lunge': 'выпады с зашагиванием',
    'deficit reverse lunge': 'обратные выпады с дефицитом',
    'step-up': 'зашагивание',
    'box jump': 'прыжок на тумбу',
    'jump squat': 'выпрыгивания',
    'split squat': 'болгарские выпады',
    'bulgarian split squat': 'болгарские выпады',
    'pistol squat': 'пистолетик',
    'cossack squat': 'казацкие приседания',
    'sissy squat': 'сисси-приседания',
    'goblet squat': 'гоблет-приседания',
    'sumo squat': 'приседания сумо',
    'front squat': 'фронтальные приседания',
    'back squat': 'приседания со штангой',
    'hack squat': 'гакк-приседания',
    'zercher squat': 'приседания Зерхера',
    'jefferson squat': 'приседания Джефферсона',
    'chair squat': 'приседания на стул',
    'wall sit': 'стульчик у стены',
    'horse stance': 'поза всадника',
    'plie squat': 'плие-приседания',
    'sumo deadlift': 'становая тяга сумо',
    'romanian deadlift': 'румынская тяга',
    'stiff leg deadlift': 'становая тяга на прямых ногах',
    'single leg deadlift': 'становая тяга на одной ноге',
    'trap bar deadlift': 'становая тяга с трап-грифом',
    'rack pull': 'тяга со стоек',
    'block pull': 'тяга с блоков',
    'deficit deadlift': 'становая тяга с дефицитом',
    'good morning': 'наклоны со штангой',
    'hip thrust': 'ягодичный мост',
    'glute bridge': 'ягодичный мост',
    'frog pump': 'лягушачий мостик',
    'single leg glute bridge': 'ягодичный мост на одной ноге',
    'donkey kick': 'удар осла',
    'fire hydrant': 'пожарный гидрант',
    'clamshell': 'ракушка',
    'leg abduction': 'отведение ноги',
    'leg adduction': 'приведение ноги',
    'hip abduction': 'отведение бедра',
    'hip adduction': 'приведение бедра',
    'hip extension': 'разгибание бедра',
    'hip flexion': 'сгибание бедра',
    'leg curl': 'сгибание ног',
    'nordic curl': 'нордическое сгибание',
    'glute ham raise': 'подъём на глют-хам',
    'reverse hyperextension': 'обратная гиперэкстензия',
    'back extension': 'разгибание спины',
    'hyperextension': 'гиперэкстензия',
    'calf raise': 'подъём на носки',
    'standing calf raise': 'подъём на носки стоя',
    'seated calf raise': 'подъём на носки сидя',
    'donkey calf raise': 'ослиный подъём на носки',
    'single leg calf raise': 'подъём на носки на одной ноге',
    'weighted calf raise': 'подъём на носки с отягощением',
    'tibialis raise': 'подъём передней большеберцовой',
    'tibialis anterior raise': 'подъём передней большеберцовой',
    'incline tibialis raise': 'подъём передней большеберцовой на наклонной',
    'tib bar raise': 'подъём на тиб-баре',
    'reverse calf raise': 'обратный подъём на носки',
    'toe raise': 'подъём пальцев стоп',
    'heel walk': 'ходьба на пятках',
    'toe walk': 'ходьба на носках',
    'ankle circles': 'круговые движения лодыжкой',
    'wrist circles': 'круговые движения запястьями',
    'neck circles': 'круговые движения шеей',
    'shoulder circles': 'круговые движения плечами',
    'arm circles': 'круговые движения руками',
    'hip circles': 'круговые движения бедрами',
    'leg swings': 'махи ногами',
    'arm swings': 'махи руками',
    'torso twist': 'повороты корпуса',
    'torso rotation': 'вращение корпуса',
    // ==========================================
    // ДОПОЛНЕНИЕ — модификаторы, версии, редкости
    // ==========================================
    
    // --- Версии и ракурсы ---
    'v. 2': '',
    'v. 3': '',
    'v. 4': '',
    '(back pov)': '(вид сзади)',
    '(side pov)': '(вид сбоку)',
    '(front pov)': '(вид спереди)',
    '(male)': '(муж)',
    '(female)': '(жен)',
    'pov': 'ракурс',
    'variation': 'вариация',

    // --- Оборудование и приспособления ---
    'with arm blaster': 'с Arm Blaster',
    'with rope': 'с канатом',
    'with rope attachment': 'с канатной ручкой',
    'with towel': 'с полотенцем',
    'with support': 'с поддержкой',
    'with strap': 'с ремнём',
    'with straps': 'с ремнями',
    'stirrups': 'со стременами',
    'v-bar': 'с V-ручкой',
    'sz-bar': 'с SZ-грифом',
    'pro lat bar': 'с Pro Lat грифом',
    'lat bar': 'с Lat грифом',
    'rope attachment': 'с канатом',
    'straight bar': 'с прямой ручкой',
    'parallel grip': 'нейтральным хватом',
    'wide-grip': 'широким хватом',
    'close-grip': 'узким хватом',
    'reverse-grip': 'обратным хватом',
    'clean-grip': 'хватом для взятия',
    'underhand': 'обратным хватом',
    'overhand': 'прямым хватом',
    'palm-in': 'ладонями внутрь',
    'palms up': 'ладонями вверх',
    'palms down': 'ладонями вниз',
    'hammer grip': 'молотковым хватом',
    'parallel': 'параллельный',
    'stability ball': 'на фитболе',
    'exercise ball': 'на фитболе',
    'bosu ball': 'на босу',
    'medicine ball': 'с медболом',
    'tennis ball': 'с теннисным мячом',
    'dip-pull-up cage': 'в клетке для брусьев и турника',
    'pull-up cable machine': 'в блочном тренажёре',
    'stepbox': 'на степ-платформе',
    'stepbox support': 'с опорой на степ-платформу',
    'staircase': 'на лестнице',
    'box': 'на тумбу',
    'bench': 'на скамье',
    'floor': 'на полу',
    'wall': 'у стены',
    'cage': 'в клетке',
    'machine': 'в тренажёре',
    'seated calf': 'подъём на носки сидя',
    'flat bench': 'на горизонтальной скамье',
    'incline bench': 'на наклонной скамье',
    'decline bench': 'на обратной наклонной',

    // --- Положения ---
    'sitted': 'сидя',
    'sitting': 'сидя',
    'cross body': 'поперёк тела',
    'cross-body': 'поперёк тела',
    'one hand': 'одной рукой',
    'two-one': 'двумя-одной',
    'two arm': 'двумя руками',
    'one arm': 'одной рукой',
    'one-arm': 'одной рукой',
    'single arm': 'одной рукой',
    'single-arm': 'одной рукой',
    'single leg': 'на одной ноге',
    'single-leg': 'на одной ноге',
    'one leg': 'на одной ноге',
    'one-legged': 'на одной ноге',
    'alternate': 'попеременно',
    'alternating': 'попеременно',
    'reverse grip': 'обратным хватом',
    'reverse-grip': 'обратным хватом',
    'revers': 'обратный',
    'reverse': 'обратный',
    'over head': 'над головой',
    'overhead': 'над головой',
    'behind head': 'из-за головы',
    'behind neck': 'из-за шеи',
    'behind the head': 'из-за головы',
    'in front of': 'перед',
    'front of': 'перед',
    'back of the head': 'задняя часть головы',
    'on hip': 'на бедре',
    'on knees': 'на коленях',
    'on floor': 'на полу',
    'on bench': 'на скамье',
    'on box': 'на тумбе',
    'on stability ball': 'на фитболе',
    'on exercise ball': 'на фитболе',
    'on bosu ball': 'на босу',
    'on parallel bars': 'на брусьях',
    'on dip-pull-up cage': 'в клетке',
    'on a dumbbell': 'на гантели',
    'on a staircase': 'на лестнице',
    'on wall': 'у стены',
    'on the wall': 'у стены',
    'against wall': 'у стены',
    'on the floor': 'на полу',
    'on vertical bar': 'на вертикальной перекладине',
    'between benches': 'между скамьями',
    'between ankles': 'между лодыжками',
    'between knees': 'между коленями',
    'under both legs': 'под обеими ногами',

    // --- Технические термины ---
    'pallof press': 'жим Паллофа',
    'zercher': 'Зерхера',
    'guillotine': 'гильотинный',
    'jm bench press': 'жим JM',
    'skier': 'лыжник',
    'pirate': 'пиратский',
    'otis up': 'подъём Отиса',
    'sphinx': 'сфинкс',
    'spell caster': 'заклинатель',
    'cossack': 'казацкие',
    'korean': 'корейские',
    'hindu': 'индуистские',
    'hyght': 'Хайта',
    'stork stance': 'поза аиста',
    'bowling motion': 'движение боулинга',
    'iron cross': 'железный крест',
    'elbow-to-knee': 'локоть к колену',
    'elbow to knee': 'локоть к колену',
    'elbow lift': 'подъём локтя',
    'elbow press': 'жим локтем',
    'london bridge': 'Лондонский мост',
    'groin crunch': 'скручивание на пах',
    'hanging pike': 'вис уголком',
    'hanging pike raise': 'вис с подъёмом уголком',
    'crab twist toe touch': 'касание стоп с поворотом крабом',
    'cocoons': 'коконы',
    'cocoon': 'кокон',
    'body-up': 'подъём тела',
    'butt-ups': 'подъёмы таза',
    'elevator': 'лифт',
    'otis': 'Отис',
    'anti gravity press': 'жим антигравитации',
    'kayak row': 'гребля на каяке',
    'thibaudeau': 'Тибо',
    'pirate supper legs': 'пиратский ужин',
    'archer': 'лучник',
    'standing archer': 'стоя лучником',
    'wind sprints': 'спринты',
    'wind sprint': 'спринт',
    'skipping': 'прыжки через скакалку',
    'box jump': 'прыжок на тумбу',
    'drop jump': 'прыжок в глубину',
    'depth jump': 'прыжок в глубину',
    'broad jump': 'прыжок в длину',
    'vertical jump': 'прыжок вверх',
    'tuck jump': 'прыжок с подтягиванием колен',
    'jump squat': 'выпрыгивания',
    'squat jump': 'выпрыгивания',
    'jumping jack': 'прыжки с хлопками',
    'jump rope': 'прыжки через скакалку',

    // --- Анатомия (доп.) ---
    'femoral': 'бедренная',
    'piriformis': 'грушевидная',
    'gluteus': 'ягодичная',
    'gastrocnemius': 'икроножная',
    'soleus': 'камбаловидная',
    'tibialis': 'большеберцовая',
    'tibialis anterior': 'передняя большеберцовая',
    'rectus femoris': 'прямая мышца бедра',
    'rectus abdominis': 'прямая мышца живота',
    'transversus abdominis': 'поперечная мышца живота',
    'erector spinae': 'мышца, выпрямляющая позвоночник',
    'latissimus dorsi': 'широчайшая мышца спины',
    'pectoralis major': 'большая грудная',
    'pectoralis minor': 'малая грудная',
    'serratus anterior': 'передняя зубчатая',
    'biceps brachii': 'двуглавая мышца плеча',
    'triceps brachii': 'трёхглавая мышца плеча',
    'deltoid': 'дельтовидная',
    'deltoids': 'дельтовидные',
    'quadriceps': 'квадрицепс',
    'hamstrings': 'бицепс бедра',
    'calves': 'голени',
    'soleus': 'камбаловидная',

    // --- Прилагательные ---
    'narrow': 'узкий',
    'wide': 'широкий',
    'close': 'узкий',
    'medium': 'средний',
    'mid': 'средний',
    'lower': 'нижний',
    'upper': 'верхний',
    'inner': 'внутренний',
    'outer': 'внешний',
    'high': 'высокий',
    'low': 'низкий',
    'full': 'полный',
    'half': 'половинный',
    'partial': 'частичный',
    'explosive': 'взрывной',
    'isometric': 'изометрический',
    'dynamic': 'динамический',
    'static': 'статический',
    'alternating': 'попеременный',
    'bent': 'согнутый',
    'straight': 'прямой',
    'extended': 'вытянутый',
    'crossed': 'скрещённый',
    'clasped': 'сцепленный',
    'reversed': 'обратный',
    'rotational': 'с вращением',
    'twisted': 'с поворотом',
    'diagonal': 'диагональный',
    'prone': 'лёжа на животе',
    'supine': 'лёжа на спине',

    // --- Глаголы ---
    'squeeze': 'сжатие',
    'hold': 'удержание',
    'reach': 'доставание',
    'catch': 'ловля',
    'throw': 'бросок',
    'slam': 'удар',
    'pull': 'тяга',
    'push': 'жим',
    'lift': 'подъём',
    'rise': 'подъём',
    'lowering': 'опускание',
    'drive': 'жим',
    'flip': 'переворот',
    'climb': 'подъём',
    'crawl': 'ходьба',
    'march': 'ходьба',
    'step': 'шаг',
    'pass through': 'протяжка',
    'pull through': 'протяжка',
    'walk': 'ходьба',
    'run': 'бег',
    'release': 'разгибание',
    'balance': 'баланс',
    'stabilization': 'стабилизация',
    'squeeze': 'сжатие',
    'tap': 'касание',
    'touch': 'касание',
    'kick': 'удар',
    'hit': 'удар',
    'swing': 'махи',
    'hinge': 'наклон',
    'flexion': 'сгибание',
    'extension': 'разгибание',
    'rotation': 'вращение',
    'abduction': 'отведение',
    'adduction': 'приведение',
    'retraction': 'втягивание',
    'protraction': 'выдвижение',
    'depression': 'опускание',
    'elevation': 'подъём',
    'supination': 'супинация',
    'pronation': 'пронация',

    // --- Прочее ---
    'class': 'класс',
    'chair': 'стул',
    'full range of motion': 'полная амплитуда',
    'range of motion': 'амплитуда',
    'motion': 'движение',
    'multiple response': 'многократный',
    'single response': 'однократный',
    'point stance': 'стойка',
    'left hook': 'левый хук',
    'boxing': 'бокс',
    'potty squat': 'глубокий присед',
    'quick feet': 'быстрые ноги',
    'sphinx push-up': 'отжимание сфинкса',
    'superman push-up': 'отжимание супермена',
    'clock push-up': 'отжимание по часам',
    'chest tap push-up': 'отжимание с касанием груди',
    'shoulder tap push-up': 'отжимание с касанием плеча',
    'scapula push-up': 'отжимание лопаток',
    'incline scapula push up': 'отжимание лопаток на наклонной',
    'outside leg kick push-up': 'отжимание с махом ноги',
    'push-up inside leg kick': 'отжимание с махом внутрь',
    'raise single arm push-up': 'отжимание одной рукой с подъёмом',
    'single arm push-up': 'отжимание одной рукой',
    'pike push up': 'отжимание уголком',
    'bench pull-ups': 'подтягивания на скамье',
    'biceps narrow pull-ups': 'подтягивания узким хватом на бицепс',
    'reverse grip pull-up': 'подтягивания обратным хватом',
    'wide grip rear pull-up': 'подтягивания широким хватом',
    'shoulder grip pull-up': 'подтягивания хватом за плечо',
    'chin-ups': 'подтягивания обратным хватом',
    'self assisted': 'с самоподдержкой',
    'inverse leg curl': 'обратное сгибание ног',
    'glute-ham raise': 'подъём на глют-хам',
    'reverse hyper': 'обратная гиперэкстензия',
    'reverse hyper extension': 'обратная гиперэкстензия',
    'hack': 'гакк',
    'hack squat': 'гакк-приседания',
    'hack calf raise': 'гакк-подъём на носки',
    'hack one leg calf raise': 'гакк-подъём на носки одной ногой',
    'curtsey squat': 'выпады с зашагиванием',
    'frankenstein squat': 'приседания Франкенштейна',
    'sissy squat': 'сисси-приседания',
    'split squats': 'болгарские выпады',
    'squat to overhead reach': 'приседание с вытягиванием рук',
    'squat to overhead reach with twist': 'приседание с вытягиванием рук и поворотом',
    'supported squat': 'приседание с опорой',
    'drop jump squat': 'прыжок в глубину с приседом',
    'plyo squat': 'плиометрическое приседание',
    'bodyweight squatting row': 'тяга в приседе своим телом',
    'gorilla': 'горилла',
    'squat row': 'тяга в приседе',
    'lunge pass through': 'выпады с протяжкой',
    'lunge with twist': 'выпады с поворотом',
    'side split squat': 'боковые выпады',
    'single leg split squat': 'болгарские выпады на одной ноге',
    'split squat': 'болгарские выпады',
    'front squat': 'фронтальные приседания',
    'rear lunge': 'обратные выпады',
    'calf stretch': 'растяжка голени',
    'hands against wall': 'руками у стены',
    'hands clasped': 'руки сцеплены',
    'hands reversed clasped': 'руки сцеплены обратным хватом',
    'hands overhead': 'руки над головой',
    'arms extended': 'руки вытянуты',
    'arms straight': 'руки прямые',
    'arms apart': 'руки врозь',
    'arms overhead': 'руки над головой',
    'leg extended': 'нога вытянута',
    'leg extended stretch': 'растяжка с вытянутой ногой',
    'chair leg extended stretch': 'растяжка ноги на стуле',
    'leg raised': 'нога поднята',
    'leg raised on exercise ball': 'нога на фитболе',
    'legs on bench': 'ноги на скамье',
    'one leg balance': 'баланс на одной ноге',
    'single leg balance': 'баланс на одной ноге',
    'bench support': 'с опорой на скамью',
    'outstretched leg': 'вытянутая нога',
    'step to overhead reach': 'шаг с вытягиванием рук',
    'posterior step': 'шаг назад',
    'hip flexor and quad stretch': 'растяжка сгибателя бедра и квадрицепса',
    'intermediate': 'средний',
    'side bridge': 'боковая планка',
    'side lying': 'лёжа на боку',
    'side lying hip adduction': 'приведение бедра лёжа на боку',
    'lying elbow to knee': 'лёжа локоть к колену',
    'lying femoral': 'лёжа на бедро',
    'lying pronation': 'пронация лёжа',
    'lying supination': 'супинация лёжа',
    'lying external shoulder rotation': 'наружное вращение плеча лёжа',
    'lying two-one leg curl': 'сгибание ног двумя-одной лёжа',
    'flexion leg sit up': 'подъём корпуса со сгибанием ног',
    'bent knee': 'с согнутыми коленями',
    'straight arm': 'прямые руки',
    'prisoner': 'заключённый',
    'half sit-up': 'половинный подъём корпуса',
    'full sit-up': 'полный подъём корпуса',
    'quarter sit-up': 'четверть подъёма корпуса',
    'jackknife sit-up': 'складной подъём корпуса',
    'janda sit-up': 'подъём корпуса Янда',
    'band jack knife sit-up': 'складной подъём корпуса с эспандером',
    'band push sit-up': 'подъём корпуса с эспандером',
    'arms on chest': 'руки на груди',
    'v sit': 'V-сед',
    'v-up': 'V-скручивание',
    'v-sit': 'V-сед',
    'tuck reverse crunch': 'обратное скручивание с подтягиванием',
    'cable tuck reverse crunch': 'обратное скручивание с подтягиванием на блоке',
    'twist toe touch': 'касание стоп с поворотом',
    'side-to-side toe touch': 'касание стоп в стороны',
    'side-to-side': 'в стороны',
    'circular toe touch': 'круговое касание стоп',
    'two toe touch': 'двойное касание стоп',
    'basic toe touch': 'базовое касание стоп',
    'isometric chest squeeze': 'изометрическое сжатие груди',
    'isometric wipers': 'изометрические дворники',
    'body saw': 'пила для корпуса',
    'suspended abdominal fallout': 'выпад на пресс в петлях',
    'suspended': 'в петлях',
    'suspended push-up': 'отжимание в петлях',
    'suspended reverse crunch': 'обратное скручивание в петлях',
    'suspended row': 'тяга в петлях',
    'suspended split squat': 'болгарские выпады в петлях',
    'two leg': 'на двух ногах',
    'crab': 'краб',
    'bear': 'медведь',
    'spider': 'паук',
    'crawl': 'ходьба',
    'push and pull bodyweight': 'жим и тяга своим телом',
    'body-up': 'подъём тела',
    'butt-ups': 'подъёмы таза',
    'glute bridge march': 'ягодичный мост с шагами',
    'single leg bridge with outstretched leg': 'ягодичный мост на одной ноге с вытянутой ногой',
    'hip thrusts on knees': 'ягодичный мост с колен',
    'resistance band': 'с эспандером',
    'resistance band hip thrusts': 'ягодичный мост с эспандером',
    'resistance band leg extension': 'разгибание ног с эспандером',
    'resistance band seated biceps curl': 'сгибание на бицепс сидя с эспандером',
    'kneeling plank tap shoulder': 'планка на коленях с касанием плеча',
    'kneeling push-up': 'отжимание с колен',
    'push-up on lower arms': 'отжимание на предплечьях',
    'modified push up to lower arms': 'модифицированное отжимание на предплечья',
    'modified hindu push-up': 'модифицированное индуистское отжимание',
    'outside leg kick': 'мах ноги наружу',
    'inside leg kick': 'мах ноги внутрь',
    'elbow dips': 'отжимания на локтях',
    'korean dips': 'корейские отжимания',
    'impossible dips': 'невозможные отжимания',
    'three bench dip': 'отжимание между тремя скамьями',
    'triceps dip between benches': 'отжимание на трицепс между скамьями',
    'weighted three bench dips': 'отжимание между тремя скамьями с отягощением',
    'chest dip on dip-pull-up cage': 'отжимание на грудь в клетке',
    'dip-pull-up cage': 'клетка для брусьев и турника',
    'muscle-up on vertical bar': 'выход силой на вертикальной перекладине',
    'l-sit on floor': 'L-сед на полу',
    'v-sit on floor': 'V-сед на полу',
    'hanging oblique knee raise': 'подъём коленей в висе на косые',
    'hanging straight twisting leg hip raise': 'подъём прямых ног в висе с поворотом',
    'hanging pike': 'вис уголком',
    'captains chair straight leg raise': 'подъём прямых ног в тренажёре',
    'captains chair': 'тренажёр «капитанский стул»',
    'landmine lateral raise': 'боковые махи с landmine',
    'landmine': 'с landmine',
    'left hook boxing': 'левый хук в боксе',
    'sledge hammer': 'кувалда',
    'spell caster': 'заклинатель',
    'sphinx': 'сфинкс',
    'otis up': 'подъём Отиса',
    'otis': 'Отис',
    'cocoons': 'коконы',
    'elevator': 'лифт',
    'london bridge': 'Лондонский мост',
    'hyght dumbbell fly': 'разводка Хайта с гантелями',
    'iron cross': 'железный крест',
    'iron cross stretch': 'растяжка железный крест',
    'archer': 'лучник',
    'standing archer': 'стоя лучником',
    'wind sprints': 'спринты',
    'sled': 'сани',
    'sled 45': 'сани 45°',
    'sled closer hack squat': 'гакк-приседания в санях',
    'sled forward angled calf raise': 'подъём на носки в санях под углом',
    'sled lying squat': 'приседание лёжа в санях',
    'closer': 'ближе',
    'forward angled': 'под углом вперёд',
    'back pov': 'вид сзади',
    'side pov': 'вид сбоку',
    'degrees': 'градусов',

    // --- Ключевые модификаторы в конце (чтобы не перекрывали фразы) ---
    'close grip': 'узким хватом',
    'close-grip': 'узким хватом',
    'wide grip': 'широким хватом',
    'wide-grip': 'широким хватом',
    'reverse grip': 'обратным хватом',
    'reverse-grip': 'обратным хватом',
    'parallel grip': 'нейтральным хватом',
    'neutral grip': 'нейтральным хватом',
    'palms down': 'ладонями вниз',
    'palms up': 'ладонями вверх',
    'palm up': 'ладонями вверх',
    'one arm': 'одной рукой',
    'one-arm': 'одной рукой',
    'one leg': 'на одной ноге',
    'one-legged': 'на одной ноге',
    'two arm': 'двумя руками',
    'two-arm': 'двумя руками',
    'single arm': 'одной рукой',
    'single-arm': 'одной рукой',
    'single leg': 'на одной ноге',
    'single-leg': 'на одной ноге',
    'two legs': 'на двух ногах',
    'two leg': 'на двух ногах',
    'alternate': 'попеременно',
    'alternating': 'попеременно',
    // ==========================================
    // ДОПОЛНЕНИЕ 2 — забытые фразы и слова
    // ==========================================
    'all fours squad stretch': 'растяжка на четвереньках',
    'all fours': 'на четвереньках',
    'all fours squad': 'на четвереньках',
    'arm slingers hanging bent knee legs': 'вис на руках с согнутыми коленями',
    'arm slingers hanging straight legs': 'вис на руках с прямыми ногами',
    'arm slingers': 'слингеры для рук',
    'slingers': 'слингеры',
    'horizontal': 'горизонтальный',
    'vertical': 'вертикальный',
    'diagonal': 'диагональный',
    'rotational': 'с вращением',
    'stirrups': 'со стременами',
    'pallof': 'Паллофа',
    'pallof press': 'жим Паллофа',
    'squad': 'команда',
    'fours': 'четвереньки',
    'all': 'все',
    'four': 'четыре',
    'archer': 'лучник',
    'hyght': 'Хайта',
    'otis': 'Отис',
    'cocoons': 'коконы',
    'cocoon': 'кокон',
    'elevator': 'лифт',
    'london bridge': 'Лондонский мост',
    'spell caster': 'заклинатель',
    'sphinx': 'сфинкс',
    'cossack': 'казацкие',
    'korean': 'корейские',
    'hindu': 'индуистские',
    'pirate': 'пиратский',
    'thibaudeau': 'Тибо',
    'skier': 'лыжник',
    'guillotine': 'гильотинный',
    'body-up': 'подъём тела',
    'butt-ups': 'подъёмы таза',
    'iron cross': 'железный крест',
    'groin crunch': 'скручивание на пах',
    'hanging pike': 'вис уголком',
    'crab twist toe touch': 'касание стоп с поворотом крабом',
    'elbow-to-knee': 'локоть к колену',
    'elbow to knee': 'локоть к колену',
    'elbow lift': 'подъём локтя',
    'elbow press': 'жим локтем',
    'elbow dips': 'отжимания на локтях',
    'otis up': 'подъём Отиса',
    'left hook': 'левый хук',
    'boxing': 'бокс',
    'potty squat': 'глубокий присед',
    'quick feet': 'быстрые ноги',
    'wind sprints': 'спринты',
    'wind sprint': 'спринт',
    'sledge': 'кувалда',
    'hammer': 'молот',
    'anti gravity': 'антигравитации',
    'anti gravity press': 'жим антигравитации',
    'waiter': 'официант',
    'waiter biceps curl': 'сгибание официанта',
    'cross-over': 'кроссовер',
    'crossover': 'кроссовер',
    'cross-over variation': 'вариация кроссовера',
    'cross-over revers fly': 'обратная разводка кроссовером',
    'upper chest': 'верх груди',
    'inner chest': 'внутренняя грудь',
    'rear drive': 'задний жим',
    'palm rotational': 'ладонь с вращением',
    'round arm': 'круговая рука',
    'reverse hyper': 'обратная гиперэкстензия',
    'glute-ham': 'глют-хам',
    'glute-ham raise': 'подъём на глют-хам',
    'hack': 'гакк',
    'sled': 'сани',
    'closer': 'ближе',
    'forward angled': 'под углом вперёд',
    'calf push stretch': 'растяжка голени с отталкиванием',
    'cambered bar': 'изогнутый гриф',
    'cambered': 'изогнутый',
    'crab': 'краб',
    'crab twist': 'поворот крабом',
    'bear': 'медведь',
    'spider': 'паук',
    'spider crawl': 'ходьба паука',
    'inchworm': 'червяк',
    'monster walk': 'монстр-ходьба',
    'gorilla': 'горилла',
    'gorilla chin': 'подтягивание гориллы',
    'kayak': 'каяк',
    'judo': 'дзюдо',
    'judo flip': 'дзюдо-переворот',
    'bowling': 'боулинг',
    'bowling motion': 'движение боулинга',
    'stork': 'аист',
    'stork stance': 'поза аиста',
    'brewing': 'заваривание',
    'breeding': 'разведение',
    'iron cross': 'железный крест',
    'swimmer': 'пловец',
    'swimmer kicks': 'удары пловца',
    'flutter kicks': 'порхающие удары',
    'scissor': 'ножницы',
    'scissor kicks': 'удары ножницами',
    'quick': 'быстрый',
    'feet': 'ноги',
    'sphinx push-up': 'отжимание сфинкса',
    'superman push-up': 'отжимание супермена',
    'clock push-up': 'отжимание по часам',
    'chest tap': 'касание груди',
    'chest tap push-up': 'отжимание с касанием груди',
    'shoulder tap': 'касание плеча',
    'shoulder tap push-up': 'отжимание с касанием плеча',
    'scapula push-up': 'отжимание лопаток',
    'scapula': 'лопатка',
    'outside leg kick': 'мах ноги наружу',
    'inside leg kick': 'мах ноги внутрь',
    'raise single arm': 'подъём одной рукой',
    'single arm push-up': 'отжимание одной рукой',
    'pike push up': 'отжимание уголком',
    'pike-to-cobra': 'уголок-кобра',
    'pike-to-cobra push-up': 'отжимание уголок-кобра',
    'reverse grip machine lat pulldown': 'тяга верхнего блока обратным хватом в тренажёре',
    'wide grip rear pull-up': 'подтягивания широким хватом сзади',
    'shoulder grip pull-up': 'подтягивания хватом за плечо',
    'self assisted': 'с самоподдержкой',
    'self assisted inverse leg curl': 'обратное сгибание ног с самоподдержкой',
    'inverse leg curl': 'обратное сгибание ног',
    'reverse hyper extension': 'обратная гиперэкстензия',
    'reverse hyper on flat bench': 'обратная гиперэкстензия на горизонтальной скамье',
    'flat bench': 'горизонтальная скамья',
    'rocky': 'Роки',
    'rocky pull-up pulldown': 'тяга верхнего блока Роки',
    'roller seated shoulder flexor depresor retractor': 'ролик для плеч сидя',
    'roller seated single leg shoulder flexor depresor retractor': 'ролик для плеч сидя на одной ноге',
    'seated wide angle pose': 'поза широкого угла сидя',
    'seated wide angle pose sequence': 'последовательность позы широкого угла сидя',
    'wide angle': 'широкий угол',
    'pose': 'поза',
    'sequence': 'последовательность',
    'split squats': 'болгарские выпады',
    'squat to overhead reach': 'приседание с вытягиванием рук',
    'squat to overhead reach with twist': 'приседание с вытягиванием рук и поворотом',
    'standing archer': 'стоя лучником',
    'twin handle': 'двойная ручка',
    'twin handle parallel grip lat pulldown': 'тяга верхнего блока двойной ручкой нейтральным хватом',
    'two toe touch': 'двойное касание стоп',
    'v-sit on floor': 'V-сед на полу',
    'weighted cossack squats': 'казацкие приседания с отягощением',
    'weighted round arm': 'круговая рука с отягощением',
    'weighted standing hand squeeze': 'сжатие кистей стоя с отягощением',
    'weighted drop push up': 'отжимание с падением и отягощением',
    'weighted one hand pull up': 'подтягивание одной рукой с отягощением',
    'drop push up': 'отжимание с падением',
    'one hand pull up': 'подтягивание одной рукой',
    'hand squeeze': 'сжатие кистей',
    'wide hand push up': 'отжимание широко расставленными руками',
    'wide hand': 'широко расставленные руки',
    'box jump down': 'спрыгивание с тумбы',
    'one leg stabilization': 'стабилизация на одной ноге',
    'stabilization': 'стабилизация',
    'side bridge': 'боковая планка',
    'side lying': 'лёжа на боку',
    'side lying hip adduction': 'приведение бедра лёжа на боку',
    'lying elbow to knee': 'лёжа локоть к колену',
    'hug keens to chest': 'подтягивание колен к груди',
    'hug keens': 'подтягивание колен',
    'keens': 'колени',
    'prisoner': 'заключённый',
    'prisoner half sit-up': 'половинный подъём корпуса заключённого',
    'hands clasped': 'руки сцеплены',
    'hands reversed clasped': 'руки сцеплены обратным хватом',
    'hands overhead': 'руки над головой',
    'arms extended': 'руки вытянуты',
    'arms straight': 'руки прямые',
    'arms apart': 'руки врозь',
    'arms overhead': 'руки над головой',
    'leg extended': 'нога вытянута',
    'leg raised': 'нога поднята',
    'legs on bench': 'ноги на скамье',
    'one leg balance': 'баланс на одной ноге',
    'single leg balance': 'баланс на одной ноге',
    'bench support': 'с опорой на скамью',
    'outstretched leg': 'вытянутая нога',
    'step to overhead reach': 'шаг с вытягиванием рук',
    'posterior step': 'шаг назад',
    'hip flexor and quad stretch': 'растяжка сгибателя бедра и квадрицепса',
    'intermediate': 'средний',
    'flexion leg sit up': 'подъём корпуса со сгибанием ног',
    'flexion': 'сгибание',
    'prone lower body rotation': 'вращение нижней части тела лёжа на животе',
    'prone lower body': 'нижняя часть тела лёжа на животе',
    'prone': 'лёжа на животе',
    'lower body': 'нижняя часть тела',
    'upper body': 'верхняя часть тела',
    'crab twist toe touch': 'касание стоп с поворотом крабом',
    'bent knee lying twist': 'поворот лёжа с согнутыми коленями',
    'bent knee': 'с согнутыми коленями',
    'straight arm': 'прямые руки',
    'crunch hands overhead': 'скручивание с руками над головой',
    'on stability ball, arms straight': 'на фитболе с прямыми руками',
    'on stability ball': 'на фитболе',
    'hands behind head': 'руки за головой',
    'full range': 'полная амплитуда',
    'range of motion': 'амплитуда',
    'full range hands behind head': 'полная амплитуда с руками за головой',
    // ==========================================
    // ДОПОЛНЕНИЕ 3 — финальная чистка
    // ==========================================
    
    // --- Модификаторы в скобках ---
    '(male)': '',
    '(female)': '',
    '(kneeling)': '',
    '(with towel)': '',
    '(with arm blaster)': '',
    'v. 2': '',
    'v. 3': '',
    'v. 4': '',
    
    // --- Положение ---
    'above head': 'над головой',
    'across face': 'поперёк лица',
    'across': 'поперёк',
    'face': 'лицо',
    'behind head': 'из-за головы',
    'bottoms up': 'перевёрнутый',
    'to the side': 'в сторону',
    'to side': 'в сторону',
    'on floor': 'на полу',
    'on exercise ball': 'на фитболе',
    'on bench': 'на скамье',
    'on knees': 'на коленях',
    'on ground': 'на земле',
    'off ground': 'от земли',
    'off': 'от',
    'ground': 'земля',
    'up': 'вверх',
    'position': 'положение',
    'stance': 'стойка',
    
    // --- Специфичные термины ---
    'hyght': 'Хайта',
    'otis': 'Отис',
    'otis up': 'подъём Отиса',
    'peacher': 'на скамье Скотта',
    'zottman': 'Зоттмана',
    'cossack': 'казацкие',
    'turkish get up': 'турецкий подъём',
    'turkish get-up': 'турецкий подъём',
    'kettlebell turkish get up': 'турецкий подъём с гирей',
    'bottoms up clean': 'взятие перевёрнутой гири',
    'bottoms-up clean': 'взятие перевёрнутой гири',
    'hang position': 'из виса',
    'clean from the hang': 'взятие с виса',
    'from the hang': 'с виса',
    'advanced windmill': 'продвинутая мельница',
    'windmill': 'мельница',
    'pirate': 'пиратский',
    'super legs': 'супер-ноги',
    'sumo high pull': 'тяга сумо к подбородку',
    'extended range': 'расширенная амплитуда',
    'range': 'амплитуда',
    'one arm military press': 'жим стоя одной рукой',
    'military press': 'жим стоя',
    'judo': 'дзюдо',
    'judo flip': 'дзюдо-переворот',
    'spell caster': 'заклинатель',
    'sphinx': 'сфинкс',
    'elevator': 'лифт',
    'cocoon': 'кокон',
    'cocoons': 'коконы',
    'london bridge': 'Лондонский мост',
    'iron cross': 'железный крест',
    'groin': 'пах',
    'groin crunch': 'скручивание на пах',
    'hanging pike': 'вис уголком',
    'pike': 'уголком',
    'crab twist': 'поворот крабом',
    'crab': 'краб',
    'elbow-to-knee': 'локоть к колену',
    'elbow to knee': 'локоть к колену',
    'elbow lift': 'подъём локтя',
    'elbow press': 'жим локтем',
    'elbow dips': 'отжимания на локтях',
    'quick feet': 'быстрые ноги',
    'wind sprint': 'спринт',
    'wind sprints': 'спринты',
    'anti gravity press': 'жим антигравитации',
    'anti gravity': 'антигравитации',
    'skier': 'лыжник',
    'sledge': 'кувалда',
    'hammer': 'молот',
    'waiter': 'официант',
    'boxing': 'бокс',
    'left hook': 'левый хук',
    'potty squat': 'глубокий присед',
    'swimmer kicks': 'удары пловца',
    'swimmer': 'пловец',
    'flutter kicks': 'порхающие удары',
    'scissor kicks': 'удары ножницами',
    'scissor': 'ножницы',
    
    // --- Инвентарь ---
    'v-bar': '',
    'sz-bar': '',
    'ez-bar': '',
    'ez-barbell': '',
    'ez bar': '',
    'ez barbell': '',
    'pro lat bar': '',
    'lat bar': '',
    'lat': 'широчайшая',
    'bar': '',
    'stirrups': '',
    'arm blaster': 'Arm Blaster',
    'cambered bar': 'изогнутый гриф',
    'cambered': 'изогнутый',
    'pulley': 'блок',
    'high pulley': 'верхний блок',
    'low pulley': 'нижний блок',
    'cable': 'на блоке',
    'rope': 'канат',
    'handle': 'ручка',
    'handles': 'ручки',
    'rope attachment': 'канатная ручка',
    'straight bar attachment': 'прямая ручка',
    'stirrups attachment': 'стремена',
    'tennis ball': 'теннисный мяч',
    'medicine ball': 'медбол',
    'bosu': 'босу',
    'bosu ball': 'босу',
    'stability ball': 'фитбол',
    'exercise ball': 'фитбол',
    'swiss ball': 'фитбол',
    'stepbox': 'степ-платформа',
    'step box': 'степ-платформа',
    'dip-pull-up cage': 'клетка для брусьев и турника',
    'pull-up cable machine': 'блочный тренажёр',
    'staircase': 'лестница',
    'box': 'тумба',
    'bench': 'скамья',
    'chair': 'стул',
    'flat bench': 'горизонтальная скамья',
    'incline bench': 'наклонная скамья',
    'decline bench': 'обратная наклонная',
    'preacher bench': 'скамья Скотта',
    'arm blaster': 'Arm Blaster',
    'step': 'шаг',
    'platform': 'платформа',
    'sled': 'сани',
    'trap bar': 'трап-гриф',
    'cambered bar': 'изогнутый гриф',
    
    // --- Мышцы ---
    'femoral': 'бедренная',
    'femur': 'бедро',
    'hamstring': 'бицепс бедра',
    'hamstrings': 'бицепс бедра',
    'glute': 'ягодицы',
    'glutes': 'ягодицы',
    'gluteus': 'ягодичные',
    'piriformis': 'грушевидная',
    'pectoralis': 'грудная',
    'pectoralis major': 'большая грудная',
    'pectoralis minor': 'малая грудная',
    'pectorals': 'грудные',
    'rectus': 'прямая',
    'femoris': 'бедра',
    'rectus femoris': 'прямая мышца бедра',
    'latissimus': 'широчайшая',
    'dorsi': 'спины',
    'latissimus dorsi': 'широчайшая мышца спины',
    'deltoid': 'дельтовидная',
    'deltoids': 'дельтовидные',
    'rear deltoid': 'задняя дельта',
    'rear delt': 'задняя дельта',
    'adductor': 'приводящая',
    'adductors': 'приводящие',
    'abductor': 'отводящая',
    'quad': 'квадрицепс',
    'quads': 'квадрицепс',
    'quadriceps': 'квадрицепс',
    'calves': 'голени',
    'calf': 'голень',
    'core': 'кор',
    'abs': 'пресс',
    'oblique': 'косые',
    'obliques': 'косые',
    
    // --- Прочее ---
    'back extension': 'разгибание спины',
    'hyperextension': 'гиперэкстензия',
    'reverse hyper': 'обратная гиперэкстензия',
    'glute-ham': 'глют-хам',
    'glute-ham raise': 'подъём на глют-хам',
    'nordic': 'нордическое',
    'nordic curl': 'нордическое сгибание',
    'inverse leg curl': 'обратное сгибание ног',
    'leg curl': 'сгибание ног',
    'leg extension': 'разгибание ног',
    'leg press': 'жим ногами',
    'calf raise': 'подъём на носки',
    'hip thrust': 'ягодичный мост',
    'hip thrusts': 'ягодичные мосты',
    'glute bridge': 'ягодичный мост',
    'hip extension': 'разгибание бедра',
    'hip adduction': 'приведение бедра',
    'hip abduction': 'отведение бедра',
    'hip internal rotation': 'внутреннее вращение бедра',
    'external rotation': 'наружное вращение',
    'internal rotation': 'внутреннее вращение',
    'shoulder external rotation': 'наружное вращение плеча',
    'shoulder internal rotation': 'внутреннее вращение плеча',
    'wrist curl': 'сгибание запястий',
    'wrist extension': 'разгибание запястий',
    'reverse wrist curl': 'обратное сгибание запястий',
    'finger curl': 'сгибание пальцев',
    'wrist circles': 'круговые движения запястьями',
    'ankle circles': 'круговые движения лодыжкой',
    'circles': 'круговые движения',
    'circle': 'круговое движение',
    'toe touch': 'касание стоп',
    'toe touches': 'касания стоп',
    'heel touchers': 'касания пяток',
    'side-to-side': 'в стороны',
    'side to side': 'в стороны',
    'circular': 'круговое',
    'circular toe touch': 'круговое касание стоп',
    'arms apart': 'руки врозь',
    'arms overhead': 'руки над головой',
    'hands clasped': 'руки сцеплены',
    'hands reversed clasped': 'руки сцеплены обратным хватом',
    'reversed clasped': 'сцеплены обратным хватом',
    'clasped': 'сцеплены',
    'apart': 'врозь',
    'full sit-up': 'полный подъём корпуса',
    'half sit-up': 'половинный подъём корпуса',
    'quarter sit-up': 'четверть подъёма корпуса',
    'prisoner': 'заключённый',
    'sit-up': 'подъём корпуса',
    'sit up': 'подъём корпуса',
    'situp': 'подъём корпуса',
    'v-up': 'V-скручивание',
    'v-up': 'V-скручивание',
    'v sit': 'V-сед',
    'v-sit': 'V-сед',
    'l-pull-up': 'L-подтягивание',
    'l-sit': 'L-сед',
    'l sit': 'L-сед',
    'crunch': 'скручивание',
    'crunch (chest pad)': 'скручивание с упором в грудь',
    'chest pad': 'упор в грудь',
    'pad': 'упор',
    'leg raise': 'подъём ног',
    'leg raises': 'подъёмы ног',
    'leg curl': 'сгибание ног',
    'twisted leg raise': 'подъём ног с поворотом',
    'twisted': 'с поворотом',
    'bent knee lying twist': 'поворот лёжа с согнутыми коленями',
    'bent knee': 'с согнутыми коленями',
    'bent arm': 'согнутые руки',
    'bent arms': 'согнутые руки',
    'lying twist': 'поворот лёжа',
    'side lying': 'лёжа на боку',
    'side lying hip adduction': 'приведение бедра лёжа на боку',
    'kneeling plank': 'планка на коленях',
    'plank tap shoulder': 'планка с касанием плеча',
    'tap shoulder': 'касание плеча',
    'shoulder tap': 'касание плеча',
    'kneeling push-up': 'отжимание с колен',
    'modified push-up': 'модифицированное отжимание',
    'modified': 'модифицированное',
    'hindu push-up': 'индуистское отжимание',
    'hindu': 'индуистское',
    'korean dips': 'корейские отжимания',
    'korean': 'корейские',
    'impossible dips': 'невозможные отжимания',
    'impossible': 'невозможные',
    'elbow dips': 'отжимания на локтях',
    'chest dip': 'отжимание на брусьях на грудь',
    'triceps dip': 'отжимание на брусьях на трицепс',
    'dip': 'отжимание на брусьях',
    'dips': 'отжимания на брусьях',
    'push-up': 'отжимание',
    'push up': 'отжимание',
    'pushup': 'отжимание',
    'push-ups': 'отжимания',
    'chin-up': 'подтягивание обратным хватом',
    'chin up': 'подтягивание обратным хватом',
    'chin-ups': 'подтягивания обратным хватом',
    'pull-up': 'подтягивание',
    'pull up': 'подтягивание',
    'pull-ups': 'подтягивания',
    'muscle-up': 'выход силой',
    'muscle up': 'выход силой',
    'chest tap push-up': 'отжимание с касанием груди',
    'clap push-up': 'отжимание с хлопком',
    'clap push up': 'отжимание с хлопком',
    'archer push up': 'отжимание лучника',
    'archer pull up': 'подтягивание лучника',
    'archer': 'лучник',
    'squat': 'приседание',
    'squats': 'приседания',
    'split squat': 'болгарские выпады',
    'split squats': 'болгарские выпады',
    'front squat': 'фронтальные приседания',
    'back squat': 'приседания со штангой',
    'hack squat': 'гакк-приседания',
    'sissy squat': 'сисси-приседания',
    'goblet squat': 'гоблет-приседания',
    'sumo squat': 'приседания сумо',
    'zercher squat': 'приседания Зерхера',
    'zercher': 'Зерхера',
    'pistol squat': 'пистолетик',
    'pistol': 'пистолет',
    'lunge': 'выпад',
    'lunges': 'выпады',
    'forward lunge': 'выпад вперёд',
    'rear lunge': 'выпад назад',
    'side lunge': 'боковой выпад',
    'reverse lunge': 'обратный выпад',
    'curtsey squat': 'выпад с зашагиванием',
    'step up': 'зашагивание',
    'step-up': 'зашагивание',
    'cossack squats': 'казацкие приседания',
    'cossack': 'казацкие',
    'deadlift': 'становая тяга',
    'sumo deadlift': 'становая тяга сумо',
    'romanian deadlift': 'румынская тяга',
    'stiff leg deadlift': 'становая тяга на прямых ногах',
    'trap bar deadlift': 'становая тяга с трап-грифом',
    'single leg deadlift': 'становая тяга на одной ноге',
    'good morning': 'наклоны со штангой',
    'shrug': 'шраги',
    'shrugs': 'шраги',
    'upright row': 'тяга к подбородку',
    'face pull': 'тяга к лицу',
    'row': 'тяга',
    'rows': 'тяги',
    'bent over row': 'тяга в наклоне',
    'bent-over row': 'тяга в наклоне',
    'pendlay row': 'тяга Пендлея',
    't-bar row': 'тяга Т-грифа',
    'seated row': 'тяга сидя',
    'cable row': 'тяга на блоке',
    'lat pulldown': 'тяга верхнего блока',
    'pulldown': 'тяга верхнего блока',
    'pushdown': 'разгибание на блоке',
    'triceps pushdown': 'разгибание на трицепс на блоке',
    'kickback': 'разгибание назад',
    'triceps extension': 'разгибание на трицепс',
    'skull crusher': 'французский жим',
    'skullcrusher': 'французский жим',
    'french press': 'французский жим',
    'push press': 'жим толчком',
    'bench press': 'жим лёжа',
    'incline bench press': 'жим лёжа на наклонной',
    'decline bench press': 'жим лёжа на обратной наклонной',
    'overhead press': 'жим над головой',
    'shoulder press': 'жим над головой',
    'military press': 'жим стоя',
    'arnold press': 'жим Арнольда',
    'jm bench press': 'жим JM',
    'jm press': 'жим JM',
    'cuban press': 'кубинский жим',
    'floor press': 'жим с пола',
    'pin presses': 'жим со стоек',
    'pin press': 'жим со стоек',
    'squat press': 'приседание с жимом',
    'w-press': 'W-жим',
    'anti gravity press': 'жим антигравитации',
    'curl': 'сгибание',
    'curls': 'сгибания',
    'biceps curl': 'сгибание на бицепс',
    'barbell curl': 'сгибание со штангой',
    'dumbbell curl': 'сгибание с гантелями',
    'cable curl': 'сгибание на блоке',
    'hammer curl': 'молотковое сгибание',
    'preacher curl': 'сгибание на скамье Скотта',
    'concentration curl': 'концентрированное сгибание',
    'zottman curl': 'сгибание Зоттмана',
    'zottman preacher curl': 'сгибание Зоттмана на скамье Скотта',
    'spider curl': 'сгибание паук',
    'drag curl': 'тяговое сгибание',
    'finger curl': 'сгибание пальцев',
    'wrist curl': 'сгибание запястий',
    'reverse grip curl': 'сгибание обратным хватом',
    'reverse curl': 'обратное сгибание',
    'close grip curl': 'сгибание узким хватом',
    'wide grip curl': 'сгибание широким хватом',
    'alternate curl': 'попеременное сгибание',
    'sitted alternate': 'сидя попеременно',
    'sitted': 'сидя',
    'seated': 'сидя',
    'standing': 'стоя',
    'lying': 'лёжа',
    'prone': 'лёжа на животе',
    'supine': 'лёжа на спине',
    'kneeling': 'на коленях',
    'hanging': 'в висе',
    'incline': 'на наклонной',
    'decline': 'на обратной наклонной',
    'flat': 'на горизонтальной',
    'alternate': 'попеременно',
    'alternating': 'попеременно',
    'single': 'одной рукой',
    'one arm': 'одной рукой',
    'one-arm': 'одной рукой',
    'one leg': 'на одной ноге',
    'one-legged': 'на одной ноге',
    'one hand': 'одной рукой',
    'two arm': 'двумя руками',
    'two-arm': 'двумя руками',
    'two leg': 'на двух ногах',
    'two legs': 'на двух ногах',
    'two-one': 'двумя-одной',
    'both legs': 'обе ноги',
    'wide grip': 'широким хватом',
    'wide-grip': 'широким хватом',
    'close grip': 'узким хватом',
    'close-grip': 'узким хватом',
    'narrow grip': 'узким хватом',
    'reverse grip': 'обратным хватом',
    'reverse-grip': 'обратным хватом',
    'overhand grip': 'прямым хватом',
    'underhand grip': 'обратным хватом',
    'neutral grip': 'нейтральным хватом',
    'parallel grip': 'нейтральным хватом',
    'mixed grip': 'смешанным хватом',
    'hammer grip': 'молотковым хватом',
    'clean grip': 'хватом для взятия',
    'clean-grip': 'хватом для взятия',
    'palms down': 'ладонями вниз',
    'palms up': 'ладонями вверх',
    'palm in': 'ладонями внутрь',
    'palm-in': 'ладонями внутрь',
    'overhand': 'прямым хватом',
    'underhand': 'обратным хватом',
    'revers': 'обратный',
    'reverse': 'обратный',
    'grip': 'хват',
    
    // --- Анатомические направления ---
    'anterior': 'передний',
    'posterior': 'задний',
    'lateral': 'боковой',
    'medial': 'медиальный',
    'superior': 'верхний',
    'inferior': 'нижний',
    'proximal': 'проксимальный',
    'distal': 'дистальный',
    'bilateral': 'двусторонний',
    'unilateral': 'односторонний',
    'contralateral': 'противоположный',
    'ipsilateral': 'односторонний',
    'internal': 'внутренний',
    'external': 'наружный',
    'front': 'передний',
    'rear': 'задний',
    'side': 'боковой',
    'back': 'спина',
    'upper': 'верхний',
    'lower': 'нижний',
    'inner': 'внутренний',
    'outer': 'внешний',
    'high': 'высокий',
    'low': 'низкий',
    'mid': 'средний',
    'middle': 'средний',
    'full': 'полный',
    'half': 'половинный',
    'partial': 'частичный',
    'total': 'полный',
    'extended': 'расширенный',
    'short': 'короткий',
    'long': 'длинный',
    'deep': 'глубокий',
    'quick': 'быстрый',
    'slow': 'медленный',
    'explosive': 'взрывной',
    'dynamic': 'динамический',
    'static': 'статический',
    'isometric': 'изометрический',
    'weighted': 'с отягощением',
    'unweighted': 'без отягощения',
    'assisted': 'с поддержкой',
    'self assisted': 'с самоподдержкой',
    'resistance': 'с сопротивлением',
    'resisted': 'с сопротивлением',
    'band': 'с эспандером',
    'banded': 'с эспандером',
    'cable': 'на блоке',
    'machine': 'в тренажёре',
    'lever': 'в рычажном',
    'smith': 'в Смите',
    'barbell': 'со штангой',
    'dumbbell': 'с гантелями',
    'dumbbells': 'с гантелями',
    'kettlebell': 'с гирей',
    'kettlebells': 'с гирями',
    'olympic barbell': 'с олимпийской штангой',
    'olympic': 'олимпийская',
    'trap bar': 'трап-гриф',
    'trap': 'трап',
    'ez bar': 'EZ-штанга',
    'ez barbell': 'EZ-штанга',
    'ez-bar': 'EZ-штанга',
    'ez-barbell': 'EZ-штанга',
    'olympic barbell': 'олимпийская штанга',
    'bodyweight': 'своё тело',
    'body weight': 'своё тело',
    'bodyweight': 'своё тело',
    'body weight': 'своё тело',
    'body': 'тело',
    'weight': 'вес',
    'medicine ball': 'медбол',
    'stability ball': 'фитбол',
    'exercise ball': 'фитбол',
    'swiss ball': 'фитбол',
    'bosu': 'босу',
    'bosu ball': 'босу',
    'balance board': 'балансировочная доска',
    'wheel roller': 'ролик',
    'ab wheel': 'ролик для пресса',
    'ab roller': 'ролик для пресса',
    'roller': 'ролик',
    'rollerout': 'выкат роликом',
    'tennis ball': 'теннисный мяч',
    'towel': 'полотенце',
    'strap': 'ремень',
    'straps': 'ремни',
    'belt': 'пояс',
    'plate': 'блин',
    'plates': 'блины',
    'bench': 'скамья',
    'platform': 'платформа',
    'stepbox': 'степ-платформа',
    'step box': 'степ-платформа',
    'box': 'тумба',
    'chair': 'стул',
    'wall': 'стена',
    'floor': 'пол',
    'ground': 'земля',
    'staircase': 'лестница',
    'stair': 'лестница',
    'stairs': 'лестница',
    'bar': 'турник',
    'parallel bars': 'брусья',
    'rings': 'кольца',
    'ring': 'кольца',
    'trx': 'TRX',
    'suspension': 'петли',
    'sling': 'петли',
    'tire': 'покрышка',
    'sledgehammer': 'кувалда',
    'sledge hammer': 'кувалда',
    'rope': 'канат',
    'battling ropes': 'боевые канаты',
    'sled': 'сани',
    'landmine': 'landmine',
    'kayak': 'каяк',
    'judo': 'дзюдо',
    'boxing': 'бокс',
    'swimming': 'плавание',
    'running': 'бег',
    'sprint': 'спринт',
    'walk': 'ходьба',
    'walking': 'ходьба',
    'jump': 'прыжок',
    'jumps': 'прыжки',
    'jumping': 'прыжки',
    'hop': 'прыжок',
    'clap': 'хлопок',
    'clapping': 'с хлопком',
    'kick': 'удар',
    'kicks': 'удары',
    'kickback': 'разгибание назад',
    'kickbacks': 'разгибания назад',
    'throw': 'бросок',
    'catch': 'ловля',
    'slam': 'удар',
    'lift': 'подъём',
    'lifted': 'поднятый',
    'lift up': 'подъём',
    'lifting': 'подъём',
    'squeeze': 'сжатие',
    'hold': 'удержание',
    'holds': 'удержания',
    'reach': 'доставание',
    'reach up': 'вытягивание',
    'rotate': 'вращение',
    'rotate up': 'вращение вверх',
    'rotation': 'вращение',
    'rotations': 'вращения',
    'twist': 'поворот',
    'twists': 'повороты',
    'twisting': 'с поворотом',
    'twisted': 'с поворотом',
    'turn': 'поворот',
    'bend': 'наклон',
    'bends': 'наклоны',
    'bending': 'наклон',
    'side bend': 'боковой наклон',
    'side bends': 'боковые наклоны',
    'lean': 'наклон',
    'tilt': 'наклон',
    'rocking': 'раскачивание',
    'rock': 'раскачивание',
    'swing': 'махи',
    'swings': 'махи',
    'swinging': 'махи',
    'circle': 'круговое движение',
    'circles': 'круговые движения',
    'circular': 'круговой',
    'archer': 'лучник',
    'draw': 'тяга',
    'drag': 'тяга',
    'row': 'тяга',
    'pull': 'тяга',
    'push': 'жим',
    'press': 'жим',
    'raise': 'подъём',
    'raises': 'подъёмы',
    'lower': 'опускание',
    'lowering': 'опускание',
    'extension': 'разгибание',
    'flexion': 'сгибание',
    'flex': 'сгибание',
    'curl': 'сгибание',
    'fold': 'складывание',
    'unfold': 'разгибание',
    'spread': 'разведение',
    'close': 'сведение',
    'open': 'открытие',
    'retract': 'втягивание',
    'protract': 'выдвижение',
    'elevate': 'подъём',
    'depress': 'опускание',
    'incline': 'наклон',
    'decline': 'обратный наклон',
    'step': 'шаг',
    'steps': 'шаги',
    'stepping': 'шаги',
    'stride': 'шаг',
    'march': 'ходьба',
    'marching': 'ходьба',
    'crawl': 'ходьба',
    'crawling': 'ходьба',
    'climb': 'подъём',
    'climbing': 'подъём',
    'balance': 'баланс',
    'stabilization': 'стабилизация',
    'stable': 'стабильный',
    'unstable': 'нестабильный',
    'stork': 'аист',
    'stork stance': 'поза аиста',
    'warrior': 'воин',
    'child': 'ребёнок',
    'baby': 'малыш',
    'happy baby': 'счастливый малыш',
    'pigeon': 'голубь',
    'cobra': 'кобра',
    'downward dog': 'собака мордой вниз',
    'upward dog': 'собака мордой вверх',
    'cat': 'кошка',
    'cow': 'корова',
    'cat cow': 'кошка-корова',
    'pose': 'поза',
    'sequence': 'последовательность',
    'breath': 'дыхание',
    'breathing': 'дыхание',
    'inhale': 'вдох',
    'exhale': 'выдох',
    'sphinx': 'сфинкс',
    'locust': 'саранча',
    'fish': 'рыба',
    'camel': 'верблюд',
    'bow': 'лук',
    'corpse': 'труп',
    'legs up the wall': 'ноги вверх по стене',
    'wheel': 'колесо',
    'chair pose': 'поза стула',
    'tree pose': 'поза дерева',
    'eagle': 'орёл',
    'crow': 'ворона',
    'side crow': 'боковая ворона',
    'peacock': 'павлин',
    'scorpion': 'скорпион',
    'king pigeon': 'королевский голубь',
    'king cobra': 'королевская кобра',
    'eight angle': 'восьми углов',
    'firefly': 'светлячок',
    'reclining': 'лежачий',
    'pancake': 'блин',
    'straddle': 'ноги врозь',
    'wide angle': 'широкий угол',
    'butterfly': 'бабочка',
    'frog': 'лягушка',
    'lizard': 'ящерица',
    'pigeon pose': 'поза голубя',
    'pyramid': 'пирамида',
    'triangle': 'треугольник',
    'warrior pose': 'поза воина',
    
    // --- Доп. слова ---
    'basic': 'базовое',
    'advanced': 'продвинутое',
    'intermediate': 'среднее',
    'beginner': 'начальное',
    'easy': 'лёгкое',
    'hard': 'сложное',
    'light': 'лёгкий',
    'heavy': 'тяжёлый',
    'slow': 'медленный',
    'fast': 'быстрый',
    'single': 'одиночный',
    'double': 'двойной',
    'triple': 'тройной',
    'multiple': 'многократный',
    'response': 'отклик',
    'stance': 'стойка',
    'position': 'положение',
    'point': 'точка',
    'point stance': 'стойка',
    'bowling': 'боулинг',
    'motion': 'движение',
    'brewing': 'заваривание',
    'breeding': 'разведение',
    'seesaw': 'качели',
    'see-saw': 'качели',
    'windmill': 'мельница',
    'figure 8': 'восьмёрка',
    'renegade': 'ренегат',
    'turkish': 'турецкий',
    'get up': 'подъём',
    'get-up': 'подъём',
    'thibaudeau': 'Тибо',
    'rocky': 'Роки',
    'otis': 'Отис',
    'hyght': 'Хайта',
    'rooney': 'Руни',
    'arnold': 'Арнольд',
    'bradford': 'Брэдфорд',
    'rocky press': 'жим Роки',
    'bradford press': 'жим Брэдфорда',
    'roll': 'перекат',
    'roller': 'ролик',
    'saw': 'пила',
    'climber': 'альпинист',
    'climbers': 'альпинисты',
    'crawl': 'ходьба',
    'crawling': 'ходьба',
    'bear': 'медвежья',
    'crab': 'краб',
    'spider': 'паук',
    'gorilla': 'горилла',
    'inchworm': 'червяк',
    'monster': 'монстр',
    'walk': 'ходьба',
    'walking': 'ходьба',
    'lunge walk': 'выпады с ходьбой',
    'walking lunge': 'выпады с ходьбой',
    'farmer': 'фермерская',
    'farmers': 'фермерская',
    'farmer walk': 'фермерская ходьба',
    'farmers walk': 'фермерская ходьба',
    'suitcase': 'чемодан',
    'suitcase carry': 'переноска чемодана',
    'waiter carry': 'переноска официанта',
    'overhead carry': 'переноска над головой',
    'single arm overhead carry': 'переноска одной рукой над головой',
    'carry': 'переноска',
    'hold': 'удержание',
    'bottoms': 'перевёрнутый',
    'bottoms up': 'перевёрнутый',
    'bottoms-up': 'перевёрнутый',
    'clean': 'взятие на грудь',
    'snatch': 'рывок',
    'jerk': 'толчок',
    'split jerk': 'толчок врозь',
    'push jerk': 'толчок',
    'power clean': 'взятие на грудь',
    'power snatch': 'рывок',
    'hang clean': 'взятие с виса',
    'hang position': 'вис',
    'hang': 'вис',
    'thruster': 'трастер',
    'thrusters': 'трастеры',
    'swing': 'махи',
    'swings': 'махи',
    'american swing': 'американские махи',
    'russian swing': 'русские махи',
    'kettlebell swing': 'махи гирей',
    'renegade row': 'тяга ренегата',
    'seesaw press': 'жим-качели',
    'see-saw press': 'жим-качели',
    'windmill': 'мельница',
    'turkish get up': 'турецкий подъём',
    'turkish get-up': 'турецкий подъём',
    'figure 8': 'восьмёрка',
    'figure eight': 'восьмёрка',
    'pass through': 'протяжка',
    'pass-through': 'протяжка',
    'pull through': 'протяжка',
    'pull-through': 'протяжка',
    'judo flip': 'дзюдо-переворот',
    'spell caster': 'заклинатель',
    'thibaudeau kayak row': 'гребля на каяке Тибо',
    'twin handle': 'двойная ручка',
    'twin': 'двойной',
    'handle': 'ручка',
    'handles': 'ручки',
    'ballistic': 'баллистический',
    'plyo': 'плиометрический',
    'plyometric': 'плиометрический',
    'explosive': 'взрывной',
    'isometric': 'изометрический',
    'eccentric': 'эксцентрический',
    'concentric': 'концентрический',
    'tempo': 'темп',
    'pause': 'пауза',
    'paused': 'с паузой',
    'hold': 'удержание',
    'hold up': 'удержание',
    'iso hold': 'изометрическое удержание',
    'wall sit': 'стульчик у стены',
    'horse stance': 'поза всадника',
    'sumo stance': 'стойка сумо',
    'wide stance': 'широкая стойка',
    'narrow stance': 'узкая стойка',
    'close stance': 'узкая стойка',
    'shoulder width': 'на ширине плеч',
    'hip width': 'на ширине бёдер',
    'feet': 'стопы',
    'foot': 'стопа',
    'ankle': 'лодыжка',
    'ankles': 'лодыжки',
    'heel': 'пятка',
    'heels': 'пятки',
    'toe': 'палец стопы',
    'toes': 'пальцы стоп',
    'knee': 'колено',
    'knees': 'колени',
    'thigh': 'бедро',
    'thighs': 'бёдра',
    'hip': 'бедро',
    'hips': 'бёдра',
    'waist': 'талия',
    'chest': 'грудь',
    'back': 'спина',
    'shoulder': 'плечо',
    'shoulders': 'плечи',
    'neck': 'шея',
    'head': 'голова',
    'forearm': 'предплечье',
    'forearms': 'предплечья',
    'wrist': 'запястье',
    'wrists': 'запястья',
    'hand': 'рука',
    'hands': 'руки',
    'arm': 'рука',
    'arms': 'руки',
    'elbow': 'локоть',
    'elbows': 'локти',
    'leg': 'нога',
    'legs': 'ноги',
    'calf': 'голень',
    'calves': 'голени',
    'shin': 'голень',
    'shins': 'голени',
    'abdomen': 'живот',
    'abdominal': 'брюшной',
    'core': 'кор',
    'spine': 'позвоночник',
    'spinal': 'позвоночный',
    'pelvis': 'таз',
    'pelvic': 'тазовый',
    'glute': 'ягодица',
    'glutes': 'ягодицы',
    'hamstring': 'бицепс бедра',
    'quads': 'квадрицепс',
    'quad': 'квадрицепс',
    'adductor': 'приводящая',
    'abductor': 'отводящая',
    'deltoid': 'дельта',
    'delts': 'дельты',
    'trap': 'трапеция',
    'traps': 'трапеции',
    'trapezius': 'трапециевидная',
    'lat': 'широчайшая',
    'lats': 'широчайшие',
    'pec': 'грудная',
    'pecs': 'грудные',
    'bicep': 'бицепс',
    'biceps': 'бицепс',
    'tricep': 'трицепс',
    'triceps': 'трицепс',
    'forearm': 'предплечье',
    'grip': 'хват',
    'hand': 'кисть',
    'finger': 'палец',
    'fingers': 'пальцы',
    'thumb': 'большой палец',
    'palm': 'ладонь',
    'palms': 'ладони',
    'side': 'бок',
    'sides': 'бока',
    'front': 'перёд',
    'back': 'зад',
    'top': 'верх',
    'bottom': 'низ',
    'up': 'вверх',
    'down': 'вниз',
    'left': 'левый',
    'right': 'правый',
    'both': 'оба',
    'same': 'тот же',
    'opposite': 'противоположный',
    'cross': 'перекрёстный',
    'crossed': 'скрещённый',
    'cross body': 'поперёк тела',
    'cross-body': 'поперёк тела',
    'across body': 'поперёк тела',
    'across face': 'поперёк лица',
    'face': 'лицо',
    'chest': 'грудь',
    'shoulder': 'плечо',
    'knee': 'колено',
    'elbow': 'локоть',
    'hand': 'кисть',
    'foot': 'стопа',
    'toe': 'палец стопы',
    'heel': 'пятка',
    'hip': 'бедро',
    'thigh': 'бедро',
    'waist': 'талия',
    'spine': 'позвоночник',
    'neck': 'шея',
    'head': 'голова',
    // Финальная добивка
    '(with arm blaster)': '',
    '(with rope)': '',
    '(with towel)': '',
    '(stirrups)': '',
    '(sz-bar)': '',
    '(v-bar)': '',
    '(pro lat bar)': '',
    '(on knee)': '',
    '(support head)': '',
    '(squat style)': '',
    '(female)': '',
    '(male)': '',
    'v. 2': '',
    'v. 3': '',
    'v. 4': '',
    'row_shoulder': 'тяга на плечо',
    '_shoulder': ' на плечо',
    'dumbbell biceps curl v sit on bosu ball': 'сгибание с гантелями V-сед на босу',
    'dumbbell biceps curl': 'сгибание с гантелями на бицепс',
    'v sit on bosu ball': 'V-сед на босу',
    'v sit': 'V-сед',
    'v-sit': 'V-сед',
    'on bosu ball': 'на босу',
    'bosu ball': 'босу',
    'exercise ball alternating arm ups': 'попеременные подъёмы рук на фитболе',
    'exercise ball': 'фитбол',
    'alternating arm ups': 'попеременные подъёмы рук',
    'arm ups': 'подъёмы рук',
    'arm up': 'подъём рук',
    'single leg platform slide': 'скольжение на одной ноге по платформе',
    'platform slide': 'скольжение по платформе',
    'platform': 'платформа',
    'slide': 'скольжение',
    'sled 45 degrees one leg press': 'жим ногами в санях 45° одной ногой',
    'sled 45 degrees': 'сани 45°',
    '45 degrees': '45°',
    'degrees': 'градусов',
    'sled 45': 'сани 45°',
    'swimmer kicks v. 2': 'удары пловца',
    'swimmer kicks': 'удары пловца',
    'swimmer': 'пловец',
    'gluteus and piriformis stretch': 'растяжка ягодичной и грушевидной',
    'gluteus': 'ягодичная',
    'piriformis': 'грушевидная',
    'gripper hands': 'сжимание кистей',
    'gripper': 'кистевой эспандер',
    'hands': 'кисти',
    'rotary calf': 'круговой подъём на носки',
    'rotary': 'круговой',
    'concentration extension': 'концентрированное разгибание',
    'concentration': 'концентрированное',
    'on knee': 'на колене',
    'rope elevated seated row': 'тяга сидя с канатом поднятая',
    'elevated seated row': 'поднятая тяга сидя',
    'elevated': 'поднятая',
    'squatting curl': 'сгибание в приседе',
    'squatting': 'в приседе',
    'standing up straight crossovers': 'прямые кроссоверы стоя',
    'up straight': 'прямо',
    'crossovers': 'кроссоверы',
    'upper chest': 'верх груди',
    'chest and front of shoulder': 'грудь и передняя часть плеча',
    'front of shoulder': 'передняя часть плеча',
    'chest tap push-up': 'отжимание с касанием груди',
    'chest tap': 'касание груди',
    'handstand': 'стойка на руках',
    'handstand push-up': 'отжимание в стойке на руках',
    'rear lateral raise': 'боковые махи на заднюю дельту',
    'rear lateral': 'задне-боковой',
    'support head': 'с поддержкой головы',
    'incline t-raise': 'T-подъём на наклонной',
    'incline y-raise': 'Y-подъём на наклонной',
    't-raise': 'T-подъём',
    'y-raise': 'Y-подъём',
    't raise': 'T-подъём',
    'y raise': 'Y-подъём',
    'upright shoulder external rotation': 'наружное вращение плеча стоя',
    'upright shoulder': 'плечо стоя',
    'shoulder external rotation': 'наружное вращение плеча',
    'external rotation': 'наружное вращение',
    'w-press': 'W-жим',
    'w press': 'W-жим',
    'clean-grip curl': 'сгибание хватом для взятия',
    'clean-grip': 'хватом для взятия',
    'close-grip curl': 'сгибание узким хватом',
    'wide grip biceps curl': 'сгибание на бицепс широким хватом',
    'wide grip': 'широким хватом',
    'biceps curl': 'сгибание на бицепс',
    'biceps': 'бицепс',
    'decline close grip face press': 'жим узким хватом на обратной наклонной к лицу',
    'face press': 'жим к лицу',
    'face': 'лицо',
    'anti gravity press': 'жим антигравитации',
    'anti gravity': 'антигравитации',
    'gravity': 'гравитация',
    'jm bench press': 'жим JM',
    'jm': 'JM',
    'jm press': 'жим JM',
    'palms down wrist curl over a bench': 'сгибание запястий ладонями вниз над скамьёй',
    'palms up wrist curl over a bench': 'сгибание запястий ладонями вверх над скамьёй',
    'palms down': 'ладонями вниз',
    'palms up': 'ладонями вверх',
    'wrist curl': 'сгибание запястий',
    'over a bench': 'над скамьёй',
    'sitted alternate leg raise': 'сидя попеременный подъём ног',
    'sitted alternate': 'сидя попеременно',
    'sitted': 'сидя',
    'alternate leg raise': 'попеременный подъём ног',
    'alternate leg': 'попеременная нога',
    'basic toe touch': 'базовое касание стоп',
    'two toe touch': 'двойное касание стоп',
    'side-to-side toe touch': 'боковое касание стоп',
    'side-to-side': 'в стороны',
    'toe touch': 'касание стоп',
    'circular toe touch': 'круговое касание стоп',
    'circular': 'круговое',
    'bent knee lying twist': 'поворот лёжа с согнутыми коленями',
    'bent knee': 'с согнутыми коленями',
    'lying twist': 'поворот лёжа',
    'twist': 'поворот',
    'kneeling plank tap shoulder': 'планка на коленях с касанием плеча',
    'kneeling plank': 'планка на коленях',
    'plank tap shoulder': 'планка с касанием плеча',
    'tap shoulder': 'касание плеча',
    'shoulder tap': 'касание плеча',
    'kneeling push-up': 'отжимание с колен',
    'kneeling': 'с колен',
    'push-up': 'отжимание',
    'push up': 'отжимание',
    'l-pull-up': 'L-подтягивание',
    'l-pull up': 'L-подтягивание',
    'l-sit on floor': 'L-сед на полу',
    'l-sit': 'L-сед',
    'landmine lateral raise': 'боковые махи с landmine',
    'landmine': 'с landmine',
    'lateral raise': 'боковые махи',
    'lever gripper hands': 'сжимание кистей в рычажном',
    'lever': 'в рычажном',
    'horizontal one leg press': 'горизонтальный жим одной ногой',
    'one leg press': 'жим одной ногой',
    'one leg': 'одной ногой',
    'medicine ball catch and overhead throw': 'медбол ловля и бросок над головой',
    'catch and overhead throw': 'ловля и бросок над головой',
    'medicine ball': 'медбол',
    'chest pass': 'передача от груди',
    'modified hindu push-up': 'модифицированное индуистское отжимание',
    'hindu push-up': 'индуистское отжимание',
    'hindu': 'индуистское',
    'modified': 'модифицированное',
    'prisoner half sit-up': 'половинный подъём корпуса заключённого',
    'prisoner': 'заключённый',
    'half sit-up': 'половинный подъём корпуса',
    'half': 'половинный',
    'sit-up': 'подъём корпуса',
    'resistance band hip thrusts on knees': 'ягодичные мосты с эспандером с колен',
    'resistance band': 'с эспандером',
    'hip thrusts': 'ягодичные мосты',
    'hip thrust': 'ягодичный мост',
    'on knees': 'с колен',
    'seated calf stretch': 'растяжка голени сидя',
    'seated calf': 'голень сидя',
    'calf stretch': 'растяжка голени',
    'side lying hip adduction': 'приведение бедра лёжа на боку',
    'side lying': 'лёжа на боку',
    'hip adduction': 'приведение бедра',
    'single leg platform slide': 'скольжение на одной ноге',
    'single leg': 'на одной ноге',
    'single leg squat': 'пистолетик',
    'pistol': 'пистолетик',
    'squat (pistol)': 'пистолетик',
    'squat': 'присед',
    'weighted cossack squats': 'казацкие приседания с отягощением',
    'cossack squats': 'казацкие приседания',
    'cossack': 'казацкие',
    'weighted': 'с отягощением',
    'kettlebell turkish get up': 'турецкий подъём с гирей',
    'turkish get up': 'турецкий подъём',
    'turkish': 'турецкий',
    'get up': 'подъём',
    'squat style': 'стиль приседа',
    'standing hamstring and calf stretch': 'растяжка бицепса бедра и голени стоя',
    'hamstring and calf stretch': 'растяжка бицепса бедра и голени',
    'hamstring stretch': 'растяжка бицепса бедра',
    'hamstring': 'бицепс бедра',
    'calf': 'голень',
    'standing': 'стоя',
    'with strap': 'с ремнём',
    'strap': 'ремень',
    'twisted leg raise': 'подъём ног с поворотом',
    'twisted': 'с поворотом',
    'leg raise': 'подъём ног',
    'v-sit on floor': 'V-сед на полу',
    'v-sit': 'V-сед',
    'on floor': 'на полу',
    'ez barbell': 'с EZ-штангой',
    'ez bar': 'с EZ-штангой',
    'ez-bar': 'с EZ-штангой',
    'ez-barbell': 'с EZ-штангой',
    'ez': 'EZ',
    'barbell': 'со штангой',
    'dumbbell': 'с гантелями',
    'cable': 'на блоке',
    'machine': 'в тренажёре',
    'lever': 'в рычажном',
    'smith': 'в Смите',
    'kettlebell': 'с гирей',
    'band': 'с эспандером',
    'bodyweight': 'своё тело',
    'body weight': 'своё тело',
    'exercise ball': 'фитбол',
    'stability ball': 'фитбол',
    'bosu ball': 'босу',
    'medicine ball': 'медбол',
    'ez barbell': 'с EZ-штангой',
    'olympic barbell': 'с олимпийской штангой',
    'trap bar': 'с трап-грифом',
    'wheel roller': 'ролик',
    'roller': 'ролик',
    'ab roller': 'ролик для пресса',
    'foam roller': 'массажный ролл',
    'foam': 'пенный',
    'parallel bars': 'брусья',
    'parallel': 'параллельный',
    'rings': 'кольца',
    'ring': 'кольца',
    'suspension': 'в петлях',
    'trx': 'TRX',
    'tire': 'покрышка',
    'sledgehammer': 'кувалда',
    'battling ropes': 'боевые канаты',
    'rope': 'канат',
    'sled': 'сани',
    'trap bar': 'трап-гриф',
    'cambered bar': 'изогнутый гриф',
    'cambered': 'изогнутый',
    // ==========================================
    // ФИНАЛЬНАЯ ДОБИВКА
    // ==========================================
    'band alternating v-up': 'попеременное V-скручивание с эспандером',
    'band fixed back close grip pulldown': 'тяга верхнего блока узким хватом с фиксированной спиной и эспандером',
    'band fixed back underhand pulldown': 'тяга верхнего блока обратным хватом с фиксированной спиной и эспандером',
    'band v-up': 'V-скручивание с эспандером',
    'band y-raise': 'Y-подъём с эспандером',
    'barbell decline close grip to skull press': 'жим узким хватом на обратной наклонной к французскому жиму',
    'barbell front raise and pullover': 'махи перед собой и пуловер со штангой',
    'barbell jm bench press': 'жим JM со штангой',
    'dumbbell biceps curl v sit on bosu ball': 'сгибание на бицепс с гантелями V-сед на босу',
    'dumbbell full can lateral raise': 'полные боковые махи с гантелями',
    'dumbbell incline t-raise': 'T-подъём на наклонной с гантелями',
    'dumbbell incline y-raise': 'Y-подъём на наклонной с гантелями',
    'dumbbell standing alternate hammer curl and press': 'попеременное молотковое сгибание и жим стоя с гантелями',
    'dumbbell sumo pull through': 'протяжка сумо с гантелью',
    'dumbbell w-press': 'W-жим с гантелями',
    'exercise ball one legged diagonal kick hamstring curl': 'диагональный удар одной ногой сгибание бицепса бедра на фитболе',
    'ez bar french press on exercise ball': 'французский жим с EZ-штангой на фитболе',
    'ez bar lying bent arms pullover': 'пуловер с согнутыми руками и EZ-штангой лёжа',
    'ez bar lying close grip triceps extension behind head': 'разгибание на трицепс узким хватом из-за головы с EZ-штангой лёжа',
    'ez bar reverse grip bent over row': 'тяга в наклоне обратным хватом с EZ-штангой',
    'ez bar seated close grip concentration curl': 'концентрированное сгибание узким хватом сидя с EZ-штангой',
    'ez bar standing french press': 'французский жим с EZ-штангой стоя',
    'ez barbell anti gravity press': 'жим антигравитации с EZ-штангой',
    'ez barbell close grip preacher curl': 'сгибание на скамье Скотта узким хватом с EZ-штангой',
    'ez barbell close-grip curl': 'сгибание узким хватом с EZ-штангой',
    'ez barbell curl': 'сгибание с EZ-штангой',
    'ez barbell decline close grip face press': 'жим узким хватом к лицу на обратной наклонной с EZ-штангой',
    'ez barbell decline triceps extension': 'разгибание на трицепс на обратной наклонной с EZ-штангой',
    'ez barbell incline triceps extension': 'разгибание на трицепс на наклонной с EZ-штангой',
    'ez barbell jm bench press': 'жим JM с EZ-штангой',
    'ez barbell reverse grip curl': 'сгибание обратным хватом с EZ-штангой',
    'ez barbell reverse grip preacher curl': 'сгибание на скамье Скотта обратным хватом с EZ-штангой',
    'ez barbell seated curls': 'сгибание сидя с EZ-штангой',
    'ez barbell seated triceps extension': 'разгибание на трицепс сидя с EZ-штангой',
    'ez barbell spider curl': 'сгибание паук с EZ-штангой',
    'ez-bar biceps curl (with arm blaster)': 'сгибание на бицепс с EZ-штангой',
    'ez-bar close-grip bench press': 'жим лёжа узким хватом с EZ-штангой',
    'ez-barbell standing wide grip biceps curl': 'сгибание на бицепс широким хватом стоя с EZ-штангой',
    'l-pull-up': 'L-подтягивание',
    'l-sit on floor': 'L-сед на полу',
    'landmine lateral raise': 'боковые махи с landmine',
    'single leg squat (pistol) male': 'пистолетик',
    'v-sit on floor': 'V-сед на полу',
};
const exerciseNameDict = [
    // --- Полные фразы (сначала длинные, чтобы не перекрывались) ---
['ankle circles', 'круговые движения лодыжкой'],
['archer pull up', 'подтягивания лучника'],
['archer pull-up', 'подтягивания лучника'],
['archer push up', 'отжимания лучника'],
['archer push-up', 'отжимания лучника'],
['ankle circle', 'круговые движения лодыжкой'],
    ['all fours squad stretch', 'Растяжка на четвереньках'],
    ['alternate heel touchers', 'Попеременные касания пяток'],
    ['alternate lateral pulldown', 'Попеременная тяга верхнего блока'],
    ['3/4 sit-up', '3/4 подъёма корпуса'],
    ['45° side bend', 'Боковые наклоны 45°'],

    // --- Жимы ---
    ['incline bench press', 'жим лёжа на наклонной'],
    ['decline bench press', 'жим лёжа на обратной наклонной'],
    ['bench press', 'жим лёжа'],
    ['dumbbell press', 'жим гантелей'],
    ['shoulder press', 'жим над головой'],
    ['overhead press', 'жим над головой'],
    ['military press', 'жим стоя'],
    ['arnold press', 'жим Арнольда'],
    ['push press', 'жим толчком'],

    // --- Тяги ---
    ['romanian deadlift', 'румынская тяга'],
    ['sumo deadlift', 'становая тяга сумо'],
    ['stiff leg deadlift', 'становая тяга на прямых ногах'],
    ['deadlift', 'становая тяга'],
    ['lat pulldown', 'тяга верхнего блока'],
    ['seated row', 'тяга сидя'],
    ['bent over row', 'тяга в наклоне'],
    ['t-bar row', 'тяга Т-грифа'],
    ['face pull', 'тяга к лицу'],
    ['upright row', 'тяга к подбородку'],
    ['pulldown', 'тяга верхнего блока'],
    ['pull down', 'тяга верхнего блока'],
    ['row', 'тяга'],

    // --- Приседания ---
    ['bulgarian split squat', 'болгарские выпады'],
    ['front squat', 'фронтальные приседания'],
    ['back squat', 'приседания со штангой'],
    ['goblet squat', 'гоблет-приседания'],
    ['hack squat', 'гакк-приседания'],
    ['split squat', 'болгарские выпады'],
    ['squat jump', 'выпрыгивания'],
    ['squat', 'приседания'],

    // --- Подтягивания / отжимания ---
    ['chin-up', 'подтягивания обратным хватом'],
    ['chin up', 'подтягивания обратным хватом'],
    ['pull-up', 'подтягивания'],
    ['pull up', 'подтягивания'],
    ['push-up', 'отжимания'],
    ['push up', 'отжимания'],
    ['muscle-up', 'выход силой'],
    ['dip', 'отжимания на брусьях'],

    // --- Бицепс / трицепс ---
    ['biceps curl', 'сгибание на бицепс'],
    ['barbell curl', 'сгибание со штангой'],
    ['dumbbell curl', 'сгибание с гантелями'],
    ['hammer curl', 'молотковые сгибания'],
    ['preacher curl', 'сгибание на скамье Скотта'],
    ['concentration curl', 'концентрированные сгибания'],
    ['reverse curl', 'обратные сгибания'],
    ['wrist curl', 'сгибание запястий'],
    ['wrist extension', 'разгибание запястий'],
    ['triceps extension', 'разгибание на трицепс'],
    ['skull crusher', 'французский жим'],
    ['pushdown', 'разгибание на блоке'],
    ['kickback', 'разгибание назад'],
    ['curl', 'сгибание'],
    ['extension', 'разгибание'],

    // --- Плечи ---
    ['lateral raise', 'махи в стороны'],
    ['front raise', 'махи перед собой'],
    ['rear delt fly', 'разводка в наклоне'],
    ['reverse fly', 'обратная разводка'],
    ['fly', 'разводка'],
    ['raise', 'махи'],

    // --- Ноги ---
    ['leg press', 'жим ногами'],
    ['leg extension', 'разгибание ног'],
    ['leg curl', 'сгибание ног'],
    ['calf raise', 'подъём на носки'],
    ['hip thrust', 'ягодичный мост'],
    ['glute bridge', 'ягодичный мост'],
    ['lunge', 'выпады'],
    ['step up', 'зашагивания'],

    // --- Пресс / кор ---
    ['side plank', 'боковая планка'],
    ['russian twist', 'русский твист'],
    ['mountain climber', 'альпинист'],
    ['dead bug', 'мёртвый жук'],
    ['bird dog', 'птица-собака'],
    ['leg raise', 'подъёмы ног'],
    ['sit-up', 'подъёмы корпуса'],
    ['sit up', 'подъёмы корпуса'],
    ['crunch', 'скручивания'],
    ['plank', 'планка'],
    ['burpee', 'бёрпи'],
    ['superman', 'супермен'],

    // --- Прочее ---
    ['shrug', 'шраги'],
    ['good morning', 'наклоны со штангой'],

    // --- Оборудование и модификаторы ---
    ['ez barbell', 'с EZ-штангой'],
    ['olympic barbell', 'с олимпийской штангой'],
    ['trap bar', 'с трап-штангой'],
    ['smith machine', 'в Смите'],
    ['leverage machine', 'в рычажном тренажёре'],
    ['medicine ball', 'с медболом'],
    ['stability ball', 'на фитболе'],
    ['bosu ball', 'на босу'],
    ['wheel roller', 'с роликом'],
    ['body weight', 'своё тело'],
    ['bodyweight', 'своё тело'],
    ['kettlebell', 'с гирей'],
    ['dumbbell', 'с гантелями'],
    ['barbell', 'со штангой'],
    ['machine', 'в тренажёре'],
    ['cable', 'на блоке'],
    ['band', 'с эспандером'],
    ['assisted', 'с поддержкой'],
    ['weighted', 'с отягощением'],
    ['rope', 'с канатом'],

    // --- Положение и хват ---
    ['close grip', 'узким хватом'],
    ['wide grip', 'широким хватом'],
    ['reverse grip', 'обратным хватом'],
    ['neutral grip', 'нейтральным хватом'],
    ['bent over', 'в наклоне'],
    ['one arm', 'одной рукой'],
    ['one-arm', 'одной рукой'],
    ['one leg', 'одной ногой'],
    ['one-leg', 'одной ногой'],
    ['alternating', 'попеременно'],
    ['alternate', 'попеременно'],
    ['kneeling', 'стоя на коленях'],
    ['hanging', 'в висе'],
    ['incline', 'на наклонной'],
    ['decline', 'на обратной наклонной'],
    ['seated', 'сидя'],
    ['standing', 'стоя'],
    ['lying', 'лёжа'],
    ['overhead', 'над головой'],
    ['behind', 'из-за головы'],
    ['twisting', 'с поворотом'],
    ['twist', 'с поворотом'],
    ['scapular', 'лопаточный'],
    ['lateral', 'боковой'],
    ['reverse', 'обратный'],
    ['single', 'одной рукой'],
    ['front', 'передний'],
    ['rear', 'задний'],
    ['side', 'боковой'],
['circles', 'круговые движения'],
['circle', 'круговые движения'],
['ankle', 'лодыжка'],
['ankles', 'лодыжки'],

    // --- Растяжка ---
    ['stretch', 'растяжка'],
    ['mobility', 'мобилити'],
    ['static', 'статическая'],
    ['dynamic', 'динамическая'],
];

// Сортируем один раз по длине (длинные — первыми)
exerciseNameDict.sort((a, b) => b[0].length - a[0].length);

// ============================================
// 🌐 ПЕРЕВОД НАЗВАНИЙ УПРАЖНЕНИЙ
// ============================================
function translateExerciseName(ex) {
    let en = (ex.name_en || '').toLowerCase().trim();
    if (!en) return ex.name || '';
    
    // 1) Убираем модификаторы в скобках ПЕРЕД переводом
    en = en.replace(/\s*\(male\)/gi, '');
    en = en.replace(/\s*\(female\)/gi, '');
    en = en.replace(/\s*\(kneeling\)/gi, '');
    en = en.replace(/\s*\(with towel\)/gi, '');
    en = en.replace(/\s*\(with arm blaster\)/gi, '');
    en = en.replace(/\s*\(with rope\)/gi, '');
    en = en.replace(/\s*\(with support\)/gi, '');
    en = en.replace(/\s*\(stirrups\)/gi, '');
    en = en.replace(/\s*\(sz-bar\)/gi, '');
    en = en.replace(/\s*\(v-bar\)/gi, '');
    en = en.replace(/\s*\(pro lat bar\)/gi, '');
    en = en.replace(/\s*\(on knee\)/gi, '');
    en = en.replace(/\s*\(support head\)/gi, '');
    en = en.replace(/\s*\(squat style\)/gi, '');
    en = en.replace(/\s*\(back pov\)/gi, '');
    en = en.replace(/\s*\(side pov\)/gi, '');
    en = en.replace(/\s*v\.\s*\d+/gi, '');
    en = en.replace(/\s*_shoulder/gi, '');
    en = en.trim();
    
    // 2) Точное совпадение с фразой
    if (exerciseWordDict[en]) {
        return capitalize(exerciseWordDict[en]);
    }
    
    // 3) Замена фраз (длинные первыми)
    let result = ' ' + en + ' ';
    const sortedKeys = Object.keys(exerciseWordDict).sort((a, b) => b.length - a.length);
    sortedKeys.forEach(key => {
        if (key.includes(' ') || key.includes('-')) {
            const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            result = result.replace(regex, ` ${exerciseWordDict[key]} `);
        }
    });
    
    // 4. Разбиваем на слова
    const words = result.split(/\s+/);
    const translated = words.map(w => {
        const clean = w.toLowerCase().replace(/[()]/g, '').replace(/[,.]/g, '');
        if (exerciseWordDict[clean]) return exerciseWordDict[clean];
        if (clean.includes('-')) {
            const parts = clean.split('-');
            const translatedParts = parts.map(p => exerciseWordDict[p] || p);
            return translatedParts.join('-');
        }
        return w;
    });
    
    result = translated.join(' ');
    result = result.replace(/\s+/g, ' ').trim();
    
    return capitalize(result);
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
// ============================================
// КАРТОЧКА УПРАЖНЕНИЯ
// ============================================
function renderExerciseCard(ex) {
    if (ex.isCustom) {
        const equipment = equipmentNames[ex.equipment] || '🏠 Своё тело';
        const gifPath = ex.gif || '';
        const done = isCompleted(ex.id);
        
        return `
            <div class="exercise-card ${done ? 'completed' : ''}" data-ex-id="${ex.id}">
                <div class="exercise-header">
                    <div class="exercise-image">
                        ${gifPath 
                            ? `<img src="${gifPath}" alt="${ex.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='💪';">` 
                            : '💪'}
                    </div>
                    <div class="exercise-info">
                        <div class="exercise-name">${ex.name}</div>
                        <div class="exercise-equipment">${equipment}</div>
                    </div>
                    <div class="exercise-toggle">▼</div>
                </div>
                <div class="exercise-details">
                    ${gifPath ? `
                        <div class="exercise-gif">
                            <img src="${gifPath}" 
                                 alt="${ex.name}" 
                                 loading="lazy" 
                                 data-gif="${gifPath}" 
                                 data-name="${ex.name}"
                                 onerror="this.parentElement.style.display='none';">
                        </div>
                    ` : ''}
                    <div class="exercise-instructions">
                        <div class="instructions-title">📋 Описание:</div>
                        <p>${ex.description || 'Описание недоступно'}</p>
                        ${ex.sets ? `<p><strong>Подходы:</strong> ${ex.sets}</p>` : ''}
                    </div>
                    <div class="exercise-actions">
                        <button class="btn-complete ${done ? 'done' : ''}" data-complete-id="${ex.id}">
                            ${done ? '✅ Выполнено' : '✔️ Отметить выполненным'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    const equipment = equipmentNames[ex.equipment] || ex.equipment;
    const imagePath = ex.image || '';
    const gifPath = ex.gif || '';
    const displayName = translateExerciseName(ex);
    const done = isCompleted(ex.id);

    return `
        <div class="exercise-card ${done ? 'completed' : ''}" data-ex-id="${ex.id}">
            <div class="exercise-header">
                <div class="exercise-image">
                    ${imagePath ? `<img src="${imagePath}" alt="${displayName}" onerror="this.style.display='none'; this.parentElement.innerHTML='💪';">` : '💪'}
                </div>
                <div class="exercise-info">
                    <div class="exercise-name">${displayName}</div>
                    <div class="exercise-equipment">${equipment}</div>
                </div>
                <div class="exercise-toggle">▼</div>
            </div>
            <div class="exercise-details">
                ${gifPath ? `
                    <div class="exercise-gif">
                        <img src="${gifPath}" alt="${displayName}" loading="lazy" data-gif="${gifPath}" data-name="${displayName}" onerror="this.parentElement.style.display='none';">
                    </div>
                ` : ''}
                <div class="exercise-instructions">
                    <div class="instructions-title">📋 Инструкция:</div>
                    ${ex.instruction_steps_ru && ex.instruction_steps_ru.length > 0
                        ? `<ol>${ex.instruction_steps_ru.map(step => `<li>${step}</li>`).join('')}</ol>`
                        : `<p>${ex.instructions_ru || 'Инструкция недоступна'}</p>`}
                </div>
                <div class="exercise-attribution">${ex.attribution || ''}</div>
                <div class="exercise-actions">
                    <button class="btn-complete ${done ? 'done' : ''}" data-complete-id="${ex.id}">
                        ${done ? '✅ Выполнено' : '✔️ Отметить выполненным'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderExercisesSection(muscle) {
    let allExercises = getExercisesForMuscle(muscle.id).map(ex => {
        if (ex.isCustom) {
            return { ...ex, equipment: getCustomEquipment(ex.name) };
        }
        return ex;
    });

    const filtered = filterByEquipment(allExercises, currentEquipmentFilter);

    const buttons = `
        <div class="equipment-filter">
            <button class="filter-btn ${currentEquipmentFilter === 'all' ? 'active' : ''}" data-filter="all">📚 Всё (${allExercises.length})</button>
            <button class="filter-btn ${currentEquipmentFilter === 'home' ? 'active' : ''}" data-filter="home">🏠 Дом (${filterByEquipment(allExercises, 'home').length})</button>
            <button class="filter-btn ${currentEquipmentFilter === 'gym' ? 'active' : ''}" data-filter="gym">🏋️ Зал (${filterByEquipment(allExercises, 'gym').length})</button>
        </div>
    `;

    const cards = filtered.length > 0
        ? filtered.map(renderExerciseCard).join('')
        : '<div class="no-exercises">😕 Нет упражнений для этого фильтра</div>';

    return `
        <div class="exercises-block">
            <h3>🏋️ Упражнения</h3>
            ${buttons}
            <div class="exercises-list">${cards}</div>
        </div>
    `;
}

// ============================================
// КАРТОЧКА МЫШЦЫ
// ============================================
function renderInfo(muscle) {
    if (!muscle) { infoContentEl.innerHTML = ''; return; }
    const views = getViews(muscle.id);
    const icon = getGroupIcon(muscle.group);
    const color = getGroupColor(muscle.group);
    const fav = isFavorite(muscle.id);

    const imageBlock = muscle.image
        ? `<div class="muscle-image-block"><div class="muscle-image-title">🖼️ Анатомия</div><img src="${muscle.image}" alt="${muscle.name}" onerror="this.parentElement.style.display='none';"></div>`
        : '';

    const newCard = document.createElement('div');
    newCard.className = 'muscle-card';
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(24px) scale(0.96)';
    newCard.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-name">${muscle.name}</div>
                <div class="card-latin">${muscle.latin || ''}</div>
                <div class="card-views">👁️ Просмотров: <span>${views}</span></div>
            </div>
            <div class="card-header-right">
                <span class="card-group" style="background:${color}20; color:${color}; border:1px solid ${color}30;">${icon} ${muscle.group}</span>
                <button class="card-favorite ${fav ? 'active' : ''}" data-fav-id="${muscle.id}" title="В избранное">${fav ? '⭐' : '☆'}</button>
            </div>
        </div>
        ${muscle.function ? `<div class="card-function">💡 ${muscle.function}</div>` : ''}
        ${muscle.description ? `<div class="card-description">${muscle.description}</div>` : ''}
        ${renderExercisesSection(muscle)}
        ${imageBlock}
    `;

    const oldCard = infoContentEl.querySelector('.muscle-card');
    if (oldCard) {
        oldCard.style.transition = 'all 0.25s ease-out';
        oldCard.style.opacity = '0';
        oldCard.style.transform = 'translateY(-12px) scale(0.97)';
        setTimeout(() => {
            oldCard.remove();
            infoContentEl.appendChild(newCard);
            bindCardEvents(newCard);
            requestAnimationFrame(() => {
                newCard.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                newCard.style.opacity = '1';
                newCard.style.transform = 'translateY(0) scale(1)';
            });
        }, 280);
    } else {
        infoContentEl.appendChild(newCard);
        bindCardEvents(newCard);
        requestAnimationFrame(() => {
            newCard.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0) scale(1)';
        });
    }
}

function bindCardEvents(container) {
    const favBtn = container.querySelector('.card-favorite');
    if (favBtn) favBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(favBtn.dataset.favId); });

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentEquipmentFilter = btn.dataset.filter;
            if (currentMuscleId && muscleDatabase[currentMuscleId]) renderInfo(muscleDatabase[currentMuscleId]);
        });
    });

    container.querySelectorAll('.exercise-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-complete')) {
                e.stopPropagation();
                const exId = e.target.closest('.btn-complete').dataset.completeId;
                markCompleted(exId);
                return;
            }
            const gifImg = e.target.closest('.exercise-gif img');
            if (gifImg) {
                e.stopPropagation();
                openGifModal(gifImg.dataset.gif, gifImg.dataset.name);
                return;
            }
            const toggle = card.querySelector('.exercise-toggle');
            const isOpen = card.classList.contains('expanded');
            if (isOpen) { card.classList.remove('expanded'); toggle.textContent = '▼'; }
            else { card.classList.add('expanded'); toggle.textContent = '▲'; }
        });
    });
}

// ============================================
// МОДАЛКА GIF
// ============================================
function openGifModal(gifUrl, name) {
    if (!gifUrl) return;
    const old = document.querySelector('.gif-modal');
    if (old) old.remove();
    const modal = document.createElement('div');
    modal.className = 'gif-modal';
    modal.innerHTML = `
        <div class="gif-modal-backdrop"></div>
        <div class="gif-modal-content">
            <button class="gif-modal-close">✕</button>
            <div class="gif-modal-title">${name}</div>
            <div class="gif-modal-image"><img src="${gifUrl}" alt="${name}"></div>
            <div class="gif-modal-hint">Esc или клик вне — закрыть</div>
        </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));
    const close = () => { modal.classList.remove('show'); setTimeout(() => modal.remove(), 300); };
    modal.querySelector('.gif-modal-close').addEventListener('click', close);
    modal.querySelector('.gif-modal-backdrop').addEventListener('click', close);
    const escHandler = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);
}

// ============================================
// ЧЕЛЛЕНДЖИ
// ============================================
function renderChallenges() {
    if (!challengesList) return;
    challengesList.innerHTML = challenges.map(ch => {
        const progress = Math.min(ch.getProgress(), ch.target);
        const percent = Math.round((progress / ch.target) * 100);
        const completed = progress >= ch.target;
        return `
            <div class="challenge-card ${completed ? 'completed' : ''}">
                <div class="challenge-emoji">${ch.emoji}</div>
                <div class="challenge-name">${ch.name}</div>
                <div class="challenge-progress"><div class="challenge-progress-bar" style="width: ${percent}%"></div></div>
                <div class="challenge-counter">
                    <span>${ch.description}</span>
                    <span class="${completed ? 'done' : ''}">${progress}/${ch.target}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// DASHBOARD
// ============================================
function openDashboard() {
    if (!dashboardModal) return;

    const viewedMuscles = getViewedMusclesCount();
    const totalMuscles = Object.keys(muscleDatabase).length;
    const completedExercises = Object.keys(getCompleted()).length;
    const streak = getStreakData().days;
    const favorites = getFavorites().length;

    dashboardStats.innerHTML = `
        <div class="stat-card"><div class="stat-value">${viewedMuscles}/${totalMuscles}</div><div class="stat-label">Мышц изучено</div></div>
        <div class="stat-card"><div class="stat-value">${completedExercises}</div><div class="stat-label">Упражнений</div></div>
        <div class="stat-card"><div class="stat-value">${streak}</div><div class="stat-label">Дней подряд</div></div>
        <div class="stat-card"><div class="stat-value">${favorites}</div><div class="stat-label">В избранном</div></div>
    `;

    const achievements = achievementsDefinitions.filter(a => a.check());
    if (achievements.length === 0) {
        dashboardAchievements.innerHTML = '<div class="achievement-badge locked">🚀 Начни тренироваться!</div>';
    } else {
        dashboardAchievements.innerHTML = achievements.map(a => `<div class="achievement-badge">${a.icon} ${a.text}</div>`).join('');
    }

    const completed = getCompleted();
    const entries = Object.entries(completed).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([exId, timestamp]) => {
        const ex = (typeof exerciseDatabase !== 'undefined') ? exerciseDatabase.find(e => e.id === exId) : null;
        const name = ex ? ex.name : `Упражнение ${exId}`;
        const date = new Date(timestamp);
        const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        return `<div class="history-item"><div class="history-item-name">${name}</div><div class="history-item-date">${dateStr}</div></div>`;
    });

    if (entries.length === 0) {
        dashboardHistory.innerHTML = '<div style="color:#4a4a6a;font-size:12px;text-align:center;padding:10px;">Пока ничего не выполнено</div>';
    } else {
        dashboardHistory.innerHTML = entries.join('');
    }

    let resetBlock = dashboardModal.querySelector('.dashboard-reset');
    if (!resetBlock) {
        resetBlock = document.createElement('div');
        resetBlock.className = 'dashboard-reset';
        resetBlock.innerHTML = `<button class="btn-reset-progress" id="resetProgressBtn">🔄 Сбросить весь прогресс</button>`;
        dashboardModal.querySelector('.dashboard-content').appendChild(resetBlock);
        resetBlock.querySelector('#resetProgressBtn').addEventListener('click', resetProgress);
    }

    dashboardModal.classList.add('show');
}

function closeDashboard() {
    if (dashboardModal) dashboardModal.classList.remove('show');
}

// ============================================
// ПОИСК
// ============================================
function handleSearch(query) {
    const results = searchMuscles(query);
    renderList(results);
    if (currentMuscleId && muscleDatabase[currentMuscleId]) {
        const found = results.some(m => m.id === currentMuscleId);
        if (found) renderInfo(muscleDatabase[currentMuscleId]);
        else renderInfo(null);
    } else if (results.length > 0) {
        selectMuscle(results[0].id);
    }
}

// ============================================
// СЛУЧАЙНАЯ МЫШЦА
// ============================================
function randomMuscle() {
    const all = Object.values(muscleDatabase);
    if (all.length === 0) return;
    const random = all[Math.floor(Math.random() * all.length)];
    selectMuscle(random.id);
    searchInput.value = '';
    renderList(Object.values(muscleDatabase));
}

// ============================================
// SHARE
// ============================================
function shareProject() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Muscle Map', text: '💪 Узнай, какие упражнения тренируют нужную мышцу!', url: url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(url).then(() => showToast('🔗 Ссылка скопирована!')).catch(() => prompt('Скопируйте ссылку:', url));
    }
}

// ============================================
// ЦИТАТА
// ============================================
function renderQuoteOfDay() {
    if (typeof getQuoteOfDay !== 'function') return;
    if (!quoteText) return;
    const quote = getQuoteOfDay();
    quoteText.textContent = `«${quote.text}»`;
    quoteAuthor.textContent = `— ${quote.author}`;
}

function shareQuote() {
    if (typeof getQuoteOfDay !== 'function') return;
    const quote = getQuoteOfDay();
    const text = `«${quote.text}» — ${quote.author}\n\n💪 Muscle Map`;
    if (navigator.share) navigator.share({ title: 'Цитата дня', text: text }).catch(() => {});
    else navigator.clipboard.writeText(text).then(() => showToast('✅ Цитата скопирована!'));
}

function copyQuote() {
    if (typeof getQuoteOfDay !== 'function') return;
    const quote = getQuoteOfDay();
    navigator.clipboard.writeText(`«${quote.text}» — ${quote.author}`).then(() => showToast('✅ Цитата скопирована!'));
}

// ============================================
// TOAST
// ============================================
function showToast(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
function init() {
    const savedId = localStorage.getItem(STORAGE_KEYS.lastSelected);
    const allMuscles = Object.values(muscleDatabase);

    updateStreak();
    addStudyDay();

    updateBodyImage();

    if (savedId && muscleDatabase[savedId]) {
        currentMuscleId = savedId;
        renderList(allMuscles);
        renderInfo(muscleDatabase[savedId]);
    } else if (allMuscles.length > 0) {
        selectMuscle(allMuscles[0].id);
    }

    renderQuoteOfDay();
    renderChallenges();

    setTimeout(checkNewAchievements, 1500);

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    randomBtn.addEventListener('click', randomMuscle);
    shareBtn.addEventListener('click', shareProject);

    if (quoteShareBtn) quoteShareBtn.addEventListener('click', shareQuote);
    if (quoteCopyBtn) quoteCopyBtn.addEventListener('click', copyQuote);

    if (dashboardBtn) dashboardBtn.addEventListener('click', openDashboard);
    if (dashboardClose) dashboardClose.addEventListener('click', closeDashboard);
    if (dashboardBackdrop) dashboardBackdrop.addEventListener('click', closeDashboard);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dashboardModal.classList.contains('show')) closeDashboard();
    });
}

init();

(function bindViewButton() {
    const btn = document.getElementById('viewToggle');
    if (btn) btn.onclick = function() { toggleView(); };
})();

console.log('🚀 Muscle Map запущен');

// ============================================
// ВОССТАНОВЛЕНИЕ ПОСЛЕ ТРАВМ
// ============================================
let currentRecoveryId = null;
let currentViewMode = 'muscles';

const navMuscles = document.getElementById('navMuscles');
const navRecovery = document.getElementById('navRecovery');
const viewMuscles = document.getElementById('viewMuscles');
const viewRecovery = document.getElementById('viewRecovery');
const recoveryList = document.getElementById('recoveryList');
const recoveryContent = document.getElementById('recoveryContent');
const challengesSection = document.getElementById('challengesSection');
const searchSection = document.getElementById('searchSection');
const recoveryHeader = document.getElementById('recoveryHeader');

function switchToMuscles() {
    currentViewMode = 'muscles';
    if (navMuscles) navMuscles.classList.add('active');
    if (navRecovery) navRecovery.classList.remove('active');
    if (viewMuscles) viewMuscles.style.display = 'grid';
    if (viewRecovery) viewRecovery.style.display = 'none';
    if (challengesSection) challengesSection.style.display = 'block';
    if (searchSection) searchSection.style.display = 'block';
    if (recoveryHeader) recoveryHeader.style.display = 'none';
}

function switchToRecovery() {
    currentViewMode = 'recovery';
    if (navMuscles) navMuscles.classList.remove('active');
    if (navRecovery) navRecovery.classList.add('active');
    if (viewMuscles) viewMuscles.style.display = 'none';
    if (viewRecovery) viewRecovery.style.display = 'grid';
    if (challengesSection) challengesSection.style.display = 'none';
    if (searchSection) searchSection.style.display = 'none';
    if (recoveryHeader) recoveryHeader.style.display = 'block';
    renderRecoveryList();
}

function renderRecoveryList() {
    if (!recoveryList || typeof recoveryDatabase === 'undefined') return;
    
    let html = '<div class="recovery-list-title">🩹 Категории</div>';
    Object.values(recoveryDatabase).forEach(r => {
        const active = r.id === currentRecoveryId ? 'active' : '';
        html += `
            <div class="recovery-item ${active}" data-id="${r.id}">
                <span class="recovery-icon">${r.icon}</span>
                <div class="recovery-item-info">
                    <div class="recovery-item-name">${r.name}</div>
                    <div class="recovery-item-subtitle">${r.subtitle}</div>
                </div>
            </div>
        `;
    });
    recoveryList.innerHTML = html;
    
    recoveryList.querySelectorAll('.recovery-item').forEach(el => {
        el.addEventListener('click', () => selectRecovery(el.dataset.id));
    });
}

function selectRecovery(id) {
    currentRecoveryId = id;
    const recovery = recoveryDatabase[id];
    if (!recovery) return;
    renderRecoveryList();
    renderRecoveryInfo(recovery);
}

function renderRecoveryInfo(recovery) {
    if (!recoveryContent) return;
    
    let phasesHtml = '';
    recovery.phases.forEach((phase, idx) => {
        const exercisesHtml = phase.exercises.map(ex => `
            <div class="recovery-exercise">
                <div class="recovery-exercise-header">
                    <div class="recovery-exercise-name">${ex.name}</div>
                    <div class="recovery-exercise-duration">${ex.duration}</div>
                </div>
                <div class="recovery-exercise-description">${ex.description}</div>
            </div>
        `).join('');
        
        phasesHtml += `
            <div class="recovery-phase" data-phase="${idx}">
                <div class="recovery-phase-header">
                    <div class="recovery-phase-title">${phase.name}</div>
                    <div class="recovery-phase-toggle">▼</div>
                </div>
                <div class="recovery-phase-description">${phase.description}</div>
                <div class="recovery-phase-exercises">${exercisesHtml}</div>
            </div>
        `;
    });
    
    recoveryContent.innerHTML = `
        <div class="recovery-card">
            <div class="recovery-card-header">
                <div class="recovery-card-icon">${recovery.icon}</div>
                <div>
                    <div class="recovery-card-title">${recovery.name}</div>
                    <div class="recovery-card-subtitle">${recovery.subtitle}</div>
                </div>
            </div>
            <div class="recovery-warning-box">${recovery.warning}</div>
            <div class="recovery-phases">${phasesHtml}</div>
        </div>
    `;
    
    recoveryContent.querySelectorAll('.recovery-phase-header').forEach(header => {
        header.addEventListener('click', () => {
            const phase = header.closest('.recovery-phase');
            const isOpen = phase.classList.contains('open');
            if (isOpen) {
                phase.classList.remove('open');
                header.querySelector('.recovery-phase-toggle').textContent = '▼';
            } else {
                phase.classList.add('open');
                header.querySelector('.recovery-phase-toggle').textContent = '▲';
            }
        });
    });
    
    const firstPhase = recoveryContent.querySelector('.recovery-phase');
    if (firstPhase) {
        firstPhase.classList.add('open');
        firstPhase.querySelector('.recovery-phase-toggle').textContent = '▲';
    }
}

if (navMuscles) navMuscles.addEventListener('click', switchToMuscles);
if (navRecovery) navRecovery.addEventListener('click', switchToRecovery);
if (recoveryHeader) recoveryHeader.style.display = 'none';

// ============================================
// КАЛЕНДАРЬ АКТИВНОСТИ
// ============================================
function renderActivityCalendar() {
    const calendarEl = document.getElementById('activityCalendar');
    if (!calendarEl) return;

    const studyDays = getStudyDays();
    const daysSet = new Set(studyDays);
    
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        days.push({
            date: dateStr,
            dayNum: d.getDate(),
            month: d.getMonth(),
            active: daysSet.has(dateStr),
            isToday: i === 0
        });
    }
    
    const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    
    calendarEl.innerHTML = days.map(d => {
        const title = `${d.dayNum} ${months[d.month]}${d.active ? ' — ✅' : ''}${d.isToday ? ' — сегодня' : ''}`;
        const classes = ['calendar-day'];
        if (d.active) classes.push('active');
        if (d.isToday) classes.push('today');
        return `<div class="${classes.join(' ')}" title="${title}"></div>`;
    }).join('');
    
    const activeCount = days.filter(d => d.active).length;
    const totalDays = getStudyDays().length;
    
    calendarEl.insertAdjacentHTML('afterend', `
        <div class="calendar-legend">
            <div class="calendar-legend-item">
                <span class="calendar-legend-dot active"></span>
                Активный день
            </div>
            <div class="calendar-legend-item">
                <span class="calendar-legend-dot"></span>
                Пропущен
            </div>
            <div class="calendar-legend-summary">
                За 30 дней: <strong>${activeCount} дней</strong> · Всего: <strong>${totalDays}</strong>
            </div>
        </div>
    `);
}

// ============================================
// ЭКСПОРТ / ИМПОРТ
// ============================================
function exportProgress() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        muscleMap: {
            favorites: getFavorites(),
            completed: getCompleted(),
            streak: getStreakData(),
            studyDays: getStudyDays(),
            achievements: getUnlockedAchievements(),
            views: {}
        }
    };
    
    Object.keys(muscleDatabase).forEach(id => {
        const v = getViews(id);
        if (v > 0) data.muscleMap.views[id] = v;
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `muscle-map-progress-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('📤 Прогресс скачан!');
}

function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.muscleMap) throw new Error('Неверный формат');
            
            if (data.muscleMap.favorites) localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(data.muscleMap.favorites));
            if (data.muscleMap.completed) localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(data.muscleMap.completed));
            if (data.muscleMap.streak) localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(data.muscleMap.streak));
            if (data.muscleMap.studyDays) localStorage.setItem(STORAGE_KEYS.studyDays, JSON.stringify(data.muscleMap.studyDays));
            if (data.muscleMap.achievements) localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(data.muscleMap.achievements));
            if (data.muscleMap.views) {
                Object.entries(data.muscleMap.views).forEach(([id, v]) => {
                    localStorage.setItem(STORAGE_KEYS.views + id, v);
                });
            }
            
            showToast('📥 Прогресс загружен!');
            closeDashboard();
            setTimeout(() => {
                renderList(Object.values(muscleDatabase));
                renderChallenges();
                if (currentMuscleId && muscleDatabase[currentMuscleId]) renderInfo(muscleDatabase[currentMuscleId]);
            }, 500);
        } catch (err) {
            showToast('❌ Ошибка: неверный файл');
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

setTimeout(() => {
    const exportBtn = document.getElementById('exportBtn');
    const importFile = document.getElementById('importFile');
    if (exportBtn) exportBtn.addEventListener('click', exportProgress);
    if (importFile) importFile.addEventListener('change', importProgress);
}, 500);

const _origOpenDashboard = openDashboard;
window.openDashboard = function() {
    _origOpenDashboard();
    setTimeout(renderActivityCalendar, 50);
};

if (dashboardBtn) {
    dashboardBtn.removeEventListener('click', openDashboard);
    dashboardBtn.addEventListener('click', window.openDashboard);
}

// ============================================
// ПИТАНИЕ
// ============================================
let nutritionState = {
    gender: 'male',
    age: 30,
    weight: 75,
    height: 180,
    activity: 'moderate',
    goal: 'maintain'
};

const navNutrition = document.getElementById('navNutrition');
const viewNutrition = document.getElementById('viewNutrition');
const nutritionContainer = document.getElementById('nutritionContainer');

function switchToNutrition() {
    currentViewMode = 'nutrition';
    if (navMuscles) navMuscles.classList.remove('active');
    if (navRecovery) navRecovery.classList.remove('active');
    if (navNutrition) navNutrition.classList.add('active');
    if (viewMuscles) viewMuscles.style.display = 'none';
    if (viewRecovery) viewRecovery.style.display = 'none';
    if (viewNutrition) viewNutrition.style.display = 'block';
    if (challengesSection) challengesSection.style.display = 'none';
    if (searchSection) searchSection.style.display = 'none';
    if (recoveryHeader) recoveryHeader.style.display = 'none';
    renderNutrition();
}

function renderNutrition() {
    if (!nutritionContainer) return;
    const calc = calculateNutrition();
    
    nutritionContainer.innerHTML = `
        <div class="nutrition-header">
            <div class="nutrition-title">🍎 Калькулятор питания</div>
            <div class="nutrition-subtitle">Рассчитай свою норму калорий и БЖУ под цель</div>
        </div>
        <div class="nutrition-grid">
            <div class="nutrition-card">
                <h3 class="nutrition-card-title">📋 Твои данные</h3>
                <div class="nutrition-field">
                    <label>Пол:</label>
                    <div class="nutrition-toggle">
                        <button class="toggle-btn ${nutritionState.gender === 'male' ? 'active' : ''}" data-gender="male">👨 Мужской</button>
                        <button class="toggle-btn ${nutritionState.gender === 'female' ? 'active' : ''}" data-gender="female">👩 Женский</button>
                    </div>
                </div>
                <div class="nutrition-field">
                    <label>Возраст (лет):</label>
                    <input type="number" id="nutAge" value="${nutritionState.age}" min="14" max="100" />
                </div>
                <div class="nutrition-field">
                    <label>Вес (кг):</label>
                    <input type="number" id="nutWeight" value="${nutritionState.weight}" min="30" max="300" step="0.5" />
                </div>
                <div class="nutrition-field">
                    <label>Рост (см):</label>
                    <input type="number" id="nutHeight" value="${nutritionState.height}" min="120" max="250" />
                </div>
                <div class="nutrition-field">
                    <label>Активность:</label>
                    <select id="nutActivity">
                        ${activityLevels.map(a => `<option value="${a.id}" ${nutritionState.activity === a.id ? 'selected' : ''}>${a.name} — ${a.description}</option>`).join('')}
                    </select>
                </div>
                <div class="nutrition-field">
                    <label>Цель:</label>
                    <div class="goal-grid">
                        ${goals.map(g => `
                            <button class="goal-btn ${nutritionState.goal === g.id ? 'active' : ''}" data-goal="${g.id}">
                                <div class="goal-icon">${g.name.split(' ')[0]}</div>
                                <div class="goal-name">${g.name.split(' ').slice(1).join(' ')}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="nutrition-card">
                <h3 class="nutrition-card-title">📊 Твоя норма</h3>
                <div class="nutrition-main-stat">
                    <div class="nutrition-kcal">${calc.kcal}</div>
                    <div class="nutrition-kcal-label">ккал / день</div>
                </div>
                <div class="macros-grid">
                    <div class="macro-card protein">
                        <div class="macro-icon">🥩</div>
                        <div class="macro-value">${calc.protein} г</div>
                        <div class="macro-label">Белки</div>
                        <div class="macro-percent">${calc.proteinPercent}%</div>
                    </div>
                    <div class="macro-card fat">
                        <div class="macro-icon">🥑</div>
                        <div class="macro-value">${calc.fat} г</div>
                        <div class="macro-label">Жиры</div>
                        <div class="macro-percent">${calc.fatPercent}%</div>
                    </div>
                    <div class="macro-card carbs">
                        <div class="macro-icon">🍚</div>
                        <div class="macro-value">${calc.carbs} г</div>
                        <div class="macro-label">Углеводы</div>
                        <div class="macro-percent">${calc.carbsPercent}%</div>
                    </div>
                </div>
                <div class="nutrition-details">
                    <div class="detail-row"><span>BMR:</span><strong>${calc.bmr} ккал</strong></div>
                    <div class="detail-row"><span>TDEE:</span><strong>${calc.tdee} ккал</strong></div>
                    <div class="detail-row"><span>Коэффициент цели:</span><strong>×${calc.goalFactor}</strong></div>
                </div>
            </div>
        </div>
        <div class="nutrition-card nutrition-meal">
            <h3 class="nutrition-card-title">🍽️ ${mealPlanExample.title}</h3>
            <div class="meal-list">
                ${mealPlanExample.meals.map(m => `
                    <div class="meal-item">
                        <div class="meal-time">${m.time}</div>
                        <div class="meal-items">${m.items.map(i => `<div class="meal-item-name">• ${i}</div>`).join('')}</div>
                        <div class="meal-kcal">${m.kcal} ккал</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="nutrition-card">
            <h3 class="nutrition-card-title">🥗 Примеры продуктов</h3>
            <div class="food-tabs">
                <button class="food-tab active" data-food="protein">🥩 Белки</button>
                <button class="food-tab" data-food="fat">🥑 Жиры</button>
                <button class="food-tab" data-food="carbs">🍚 Углеводы</button>
            </div>
            <div class="food-list" id="foodList"></div>
        </div>
        <div class="nutrition-warning">⚠️ Расчёт — ориентировочный. Для точного плана обратитесь к диетологу.</div>
    `;
    
    bindNutritionEvents();
    renderFoodList('protein');
}

function calculateNutrition() {
    let bmr;
    if (nutritionState.gender === 'male') {
        bmr = 10 * nutritionState.weight + 6.25 * nutritionState.height - 5 * nutritionState.age + 5;
    } else {
        bmr = 10 * nutritionState.weight + 6.25 * nutritionState.height - 5 * nutritionState.age - 161;
    }
    const activity = activityLevels.find(a => a.id === nutritionState.activity) || activityLevels[2];
    const tdee = Math.round(bmr * activity.factor);
    const goal = goals.find(g => g.id === nutritionState.goal) || goals[1];
    const kcal = Math.round(tdee * goal.factor);
    const norms = macroNorms[nutritionState.goal] || macroNorms.maintain;
    const protein = Math.round(nutritionState.weight * norms.protein);
    const fat = Math.round(nutritionState.weight * norms.fat);
    const carbs = Math.round(nutritionState.weight * norms.carbs);
    const proteinKcal = protein * 4;
    const fatKcal = fat * 9;
    const carbsKcal = carbs * 4;
    const totalKcal = proteinKcal + fatKcal + carbsKcal;
    
    return {
        bmr: Math.round(bmr), tdee, kcal, goalFactor: goal.factor,
        protein, fat, carbs,
        proteinPercent: Math.round((proteinKcal / totalKcal) * 100),
        fatPercent: Math.round((fatKcal / totalKcal) * 100),
        carbsPercent: Math.round((carbsKcal / totalKcal) * 100)
    };
}

function bindNutritionEvents() {
    document.querySelectorAll('[data-gender]').forEach(btn => {
        btn.addEventListener('click', () => { nutritionState.gender = btn.dataset.gender; renderNutrition(); });
    });
    document.querySelectorAll('[data-goal]').forEach(btn => {
        btn.addEventListener('click', () => { nutritionState.goal = btn.dataset.goal; renderNutrition(); });
    });
    const ageInput = document.getElementById('nutAge');
    const weightInput = document.getElementById('nutWeight');
    const heightInput = document.getElementById('nutHeight');
    const activitySelect = document.getElementById('nutActivity');
    if (ageInput) ageInput.addEventListener('change', (e) => { nutritionState.age = parseInt(e.target.value) || 30; renderNutrition(); });
    if (weightInput) weightInput.addEventListener('change', (e) => { nutritionState.weight = parseFloat(e.target.value) || 75; renderNutrition(); });
    if (heightInput) heightInput.addEventListener('change', (e) => { nutritionState.height = parseInt(e.target.value) || 180; renderNutrition(); });
    if (activitySelect) activitySelect.addEventListener('change', (e) => { nutritionState.activity = e.target.value; renderNutrition(); });
    document.querySelectorAll('.food-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.food-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderFoodList(tab.dataset.food);
        });
    });
}

function renderFoodList(type) {
    const foodListEl = document.getElementById('foodList');
    if (!foodListEl) return;
    const foods = foodExamples[type] || [];
    foodListEl.innerHTML = foods.map(f => `
        <div class="food-item">
            <div class="food-name">${f.name}</div>
            <div class="food-stats">
                <span class="food-kcal">${f.kcal} ккал</span>
                <span class="food-p">Б: ${f.p}г</span>
                <span class="food-f">Ж: ${f.f}г</span>
                <span class="food-c">У: ${f.c}г</span>
            </div>
        </div>
    `).join('');
}

if (navNutrition) navNutrition.addEventListener('click', switchToNutrition);

// ============================================
// ПРОГРАММЫ
// ============================================
let currentProgramId = null;
const navPrograms = document.getElementById('navPrograms');
const viewPrograms = document.getElementById('viewPrograms');
const programsContainer = document.getElementById('programsContainer');

function switchToPrograms() {
    currentViewMode = 'programs';
    if (navMuscles) navMuscles.classList.remove('active');
    if (navRecovery) navRecovery.classList.remove('active');
    if (navNutrition) navNutrition.classList.remove('active');
    if (navPrograms) navPrograms.classList.add('active');
    if (viewMuscles) viewMuscles.style.display = 'none';
    if (viewRecovery) viewRecovery.style.display = 'none';
    if (viewNutrition) viewNutrition.style.display = 'none';
    if (viewPrograms) viewPrograms.style.display = 'block';
    if (challengesSection) challengesSection.style.display = 'none';
    if (searchSection) searchSection.style.display = 'none';
    if (recoveryHeader) recoveryHeader.style.display = 'none';
    renderPrograms();
    setTimeout(() => {
        const container = document.querySelector('.programs-container');
        if (container && !document.getElementById('workoutTracker')) {
            const trackerEl = document.createElement('div');
            trackerEl.id = 'workoutTracker';
            container.appendChild(trackerEl);
        }
        renderWorkoutTracker();
    }, 50);
}

function renderPrograms() {
    if (!programsContainer) return;
    const programsList = Object.values(programsDatabase).map(p => `
        <div class="program-card ${currentProgramId === p.id ? 'active' : ''}" data-program="${p.id}">
            <div class="program-card-icon" style="background: ${p.color}20; color: ${p.color}; border-color: ${p.color}40;">${p.icon}</div>
            <div class="program-card-info">
                <div class="program-card-name">${p.name}</div>
                <div class="program-card-subtitle">${p.subtitle}</div>
                <div class="program-card-meta">
                    <span class="program-badge">${p.level}</span>
                    <span class="program-badge">${p.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    let detailsHtml = '';
    if (currentProgramId && programsDatabase[currentProgramId]) {
        const program = programsDatabase[currentProgramId];
        const daysHtml = program.days.map((day, idx) => `
            <div class="program-day" data-day="${idx}">
                <div class="program-day-header">
                    <div class="program-day-title">${day.name}</div>
                    <div class="program-day-toggle">▼</div>
                </div>
                <div class="program-day-exercises">
                    ${day.exercises.map(ex => `
                        <div class="program-exercise">
                            <div class="program-exercise-name">${ex.name}</div>
                            <div class="program-exercise-sets">${ex.sets}</div>
                            <div class="program-exercise-rest">⏱ ${ex.rest}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        const tipsHtml = program.tips.map(tip => `<div class="program-tip">${tip}</div>`).join('');
        
        detailsHtml = `
            <div class="program-details">
                <div class="program-details-header" style="border-left-color: ${program.color};">
                    <div class="program-details-icon">${program.icon}</div>
                    <div>
                        <div class="program-details-title">${program.name}</div>
                        <div class="program-details-subtitle">${program.subtitle}</div>
                        <div class="program-details-meta">
                            <span>🎯 ${program.goal}</span>
                            <span>📊 ${program.level}</span>
                            <span>⏱ ${program.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="program-description">${program.description}</div>
                <h3 class="program-section-title">📅 Дни тренировок</h3>
                <div class="program-days">${daysHtml}</div>
                <h3 class="program-section-title">💡 Советы</h3>
                <div class="program-tips">${tipsHtml}</div>
            </div>
        `;
    } else {
        detailsHtml = `
            <div class="program-placeholder">
                <div style="font-size: 60px; margin-bottom: 16px; opacity: 0.4;">🏋️</div>
                <div style="font-size: 20px; color: #5a5a7a;">Выбери программу слева</div>
                <div style="font-size: 14px; color: #3a3a5a; margin-top: 8px;">${Object.keys(programsDatabase).length} готовых планов</div>
            </div>
        `;
    }
    
    programsContainer.innerHTML = `
        <div class="programs-header">
            <div class="programs-title">🏋️ Программы тренировок</div>
            <div class="programs-subtitle">Готовые планы под разные цели</div>
        </div>
        <div class="programs-grid">
            <aside class="programs-list">${programsList}</aside>
            <section class="program-details-wrapper">${detailsHtml}</section>
        </div>
    `;
    bindProgramEvents();
}

function bindProgramEvents() {
    document.querySelectorAll('[data-program]').forEach(el => {
        el.addEventListener('click', () => { currentProgramId = el.dataset.program; renderPrograms(); });
    });
    document.querySelectorAll('.program-day-header').forEach(header => {
        header.addEventListener('click', () => {
            const day = header.closest('.program-day');
            const isOpen = day.classList.contains('open');
            if (isOpen) {
                day.classList.remove('open');
                header.querySelector('.program-day-toggle').textContent = '▼';
            } else {
                day.classList.add('open');
                header.querySelector('.program-day-toggle').textContent = '▲';
            }
        });
    });
    const firstDay = document.querySelector('.program-day');
    if (firstDay) {
        firstDay.classList.add('open');
        firstDay.querySelector('.program-day-toggle').textContent = '▲';
    }
}

if (navPrograms) navPrograms.addEventListener('click', switchToPrograms);

// ============================================
// ТРЕКЕР
// ============================================
const TRACKER_KEYS = {
    workoutLog: 'muscleMap_workoutLog',
    currentWorkout: 'muscleMap_currentWorkout',
};

function getCurrentWorkout() {
    try {
        return JSON.parse(localStorage.getItem(TRACKER_KEYS.currentWorkout)) || {
            date: new Date().toISOString().split('T')[0],
            exercises: {}
        };
    } catch {
        return { date: new Date().toISOString().split('T')[0], exercises: {} };
    }
}

function saveCurrentWorkout(workout) {
    localStorage.setItem(TRACKER_KEYS.currentWorkout, JSON.stringify(workout));
}

function addSetToExercise(exerciseName, weight, reps) {
    const workout = getCurrentWorkout();
    if (!workout.exercises[exerciseName]) workout.exercises[exerciseName] = [];
    workout.exercises[exerciseName].push({
        weight: parseFloat(weight) || 0,
        reps: parseInt(reps) || 0,
        time: Date.now()
    });
    saveCurrentWorkout(workout);
    return workout;
}

function removeSetFromExercise(exerciseName, index) {
    const workout = getCurrentWorkout();
    if (workout.exercises[exerciseName]) {
        workout.exercises[exerciseName].splice(index, 1);
        if (workout.exercises[exerciseName].length === 0) delete workout.exercises[exerciseName];
        saveCurrentWorkout(workout);
    }
    return workout;
}

function getWorkoutLog() {
    try { return JSON.parse(localStorage.getItem(TRACKER_KEYS.workoutLog)) || {}; }
    catch { return {}; }
}

function saveWorkoutToLog() {
    const workout = getCurrentWorkout();
    if (Object.keys(workout.exercises).length === 0) {
        showToast('⚠️ Нет упражнений');
        return false;
    }
    const log = getWorkoutLog();
    const date = workout.date;
    if (log[date]) {
        Object.entries(workout.exercises).forEach(([exName, sets]) => {
            if (!log[date][exName]) log[date][exName] = [];
            log[date][exName] = log[date][exName].concat(sets);
        });
    } else {
        log[date] = workout.exercises;
    }
    localStorage.setItem(TRACKER_KEYS.workoutLog, JSON.stringify(log));
    saveCurrentWorkout({ date: new Date().toISOString().split('T')[0], exercises: {} });
    showToast('✅ Тренировка сохранена!');
    return true;
}

function getWorkoutVolume(exercises) {
    let total = 0;
    Object.values(exercises).forEach(sets => {
        sets.forEach(s => { total += (s.weight || 0) * (s.reps || 0); });
    });
    return Math.round(total);
}

function renderWorkoutTracker() {
    const container = document.getElementById('workoutTracker');
    if (!container) return;
    
    const workout = getCurrentWorkout();
    const exerciseEntries = Object.entries(workout.exercises);
    const totalSets = exerciseEntries.reduce((sum, [, sets]) => sum + sets.length, 0);
    const totalVolume = getWorkoutVolume(workout.exercises);
    
    let exercisesHtml = '';
    if (exerciseEntries.length === 0) {
        exercisesHtml = `<div class="tracker-empty">😕 Пока нет записанных подходов<br><span style="font-size: 11px; color: #4a4a6a;">Добавь первый подход ниже</span></div>`;
    } else {
        exercisesHtml = exerciseEntries.map(([exName, sets]) => {
            const setsHtml = sets.map((s, i) => `
                <div class="tracker-set">
                    <span class="set-number">${i + 1}</span>
                    <span class="set-weight">${s.weight} кг</span>
                    <span class="set-times">×</span>
                    <span class="set-reps">${s.reps} раз</span>
                    <button class="set-remove" data-ex="${encodeURIComponent(exName)}" data-idx="${i}" title="Удалить">✕</button>
                </div>
            `).join('');
            const maxWeight = Math.max(...sets.map(s => s.weight || 0), 0);
            return `
                <div class="tracker-exercise">
                    <div class="tracker-exercise-header">
                        <div class="tracker-exercise-name">${exName}</div>
                        <div class="tracker-exercise-stat">${sets.length} подх. · макс ${maxWeight} кг</div>
                    </div>
                    <div class="tracker-sets">${setsHtml}</div>
                </div>
            `;
        }).join('');
    }
    
    container.innerHTML = `
        <div class="tracker-card">
            <div class="tracker-header">
                <div>
                    <div class="tracker-title">🏋️ Тренировка сегодня</div>
                    <div class="tracker-date">📅 ${new Date(workout.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div class="tracker-stats">
                    <div class="tracker-stat">
                        <div class="tracker-stat-value">${totalSets}</div>
                        <div class="tracker-stat-label">подходов</div>
                    </div>
                    <div class="tracker-stat">
                        <div class="tracker-stat-value">${totalVolume}</div>
                        <div class="tracker-stat-label">кг объём</div>
                    </div>
                </div>
            </div>
            <div class="tracker-exercises">${exercisesHtml}</div>
            <div class="tracker-add">
                <input type="text" id="trackerExName" placeholder="Упражнение (напр. Жим лёжа)" list="trackerExList">
                <datalist id="trackerExList">
                    ${getAllExerciseNames().map(n => `<option value="${n}">`).join('')}
                </datalist>
                <div class="tracker-add-row">
                    <input type="number" id="trackerWeight" placeholder="Вес (кг)" min="0" step="0.5">
                    <input type="number" id="trackerReps" placeholder="Повторы" min="1" max="100">
                    <button class="btn-tracker-add" id="trackerAddBtn">➕ Добавить</button>
                </div>
            </div>
            <div class="tracker-actions">
                <button class="btn-tracker-save" id="trackerSaveBtn">💾 Сохранить в дневник</button>
                <button class="btn-tracker-clear" id="trackerClearBtn">🗑️ Очистить</button>
            </div>
        </div>
        <div class="workout-log" id="workoutLog"></div>
    `;
    
    bindTrackerEvents();
    renderWorkoutLog();
}

function getAllExerciseNames() {
    const names = new Set();
    if (typeof programsDatabase !== 'undefined') {
        Object.values(programsDatabase).forEach(p => {
            p.days.forEach(d => {
                d.exercises.forEach(e => names.add(e.name));
            });
        });
    }
    if (typeof exerciseDatabase !== 'undefined') {
        exerciseDatabase.slice(0, 100).forEach(e => names.add(e.name));
    }
    return Array.from(names).sort();
}

function bindTrackerEvents() {
    const addBtn = document.getElementById('trackerAddBtn');
    const saveBtn = document.getElementById('trackerSaveBtn');
    const clearBtn = document.getElementById('trackerClearBtn');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = document.getElementById('trackerExName').value.trim();
            const weight = document.getElementById('trackerWeight').value;
            const reps = document.getElementById('trackerReps').value;
            if (!name) { showToast('⚠️ Введите название'); return; }
            if (!weight && weight !== '0') { showToast('⚠️ Введите вес'); return; }
            if (!reps) { showToast('⚠️ Введите повторы'); return; }
            addSetToExercise(name, weight, reps);
            showToast('✅ Подход добавлен!');
            renderWorkoutTracker();
        });
    }
    if (saveBtn) saveBtn.addEventListener('click', () => { if (saveWorkoutToLog()) renderWorkoutTracker(); });
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm('Очистить текущую тренировку?')) return;
            saveCurrentWorkout({ date: new Date().toISOString().split('T')[0], exercises: {} });
            showToast('🗑️ Очищено');
            renderWorkoutTracker();
        });
    }
    document.querySelectorAll('.set-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const exName = decodeURIComponent(btn.dataset.ex);
            const idx = parseInt(btn.dataset.idx);
            removeSetFromExercise(exName, idx);
            renderWorkoutTracker();
        });
    });
    ['trackerExName', 'trackerWeight', 'trackerReps'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keypress', (e) => { if (e.key === 'Enter') addBtn?.click(); });
    });
}

function renderWorkoutLog() {
    const container = document.getElementById('workoutLog');
    if (!container) return;
    const log = getWorkoutLog();
    const dates = Object.keys(log).sort((a, b) => b.localeCompare(a)).slice(0, 10);
    
    if (dates.length === 0) {
        container.innerHTML = `<div class="log-title">📓 Дневник тренировок</div><div class="log-empty">Пока нет сохранённых тренировок</div>`;
        return;
    }
    
    const entriesHtml = dates.map(date => {
        const dayData = log[date];
        const exercises = Object.entries(dayData);
        const totalVolume = getWorkoutVolume(dayData);
        const totalSets = exercises.reduce((sum, [, sets]) => sum + sets.length, 0);
        const exHtml = exercises.map(([name, sets]) => {
            const maxW = Math.max(...sets.map(s => s.weight || 0));
            return `<div class="log-exercise"><div class="log-ex-name">${name}</div><div class="log-ex-info">${sets.length} подх. · макс <strong>${maxW} кг</strong></div></div>`;
        }).join('');
        return `
            <div class="log-day">
                <div class="log-day-header">
                    <div class="log-date">📅 ${new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })}</div>
                    <div class="log-day-stats">${totalSets} подх. · ${totalVolume} кг</div>
                </div>
                <div class="log-day-exercises">${exHtml}</div>
            </div>
        `;
    }).join('');
    
    const allExercises = new Set();
    Object.values(log).forEach(dayData => {
        Object.keys(dayData).forEach(exName => allExercises.add(exName));
    });
    const exerciseList = Array.from(allExercises).sort();
    
    container.innerHTML = `
        <div class="log-title">📓 Дневник тренировок <span class="log-count">${dates.length} дней</span></div>
        
        <div class="progress-chart-block">
            <div class="progress-chart-header">
                <div class="progress-chart-title">📈 Прогресс по упражнению</div>
                <select class="progress-chart-select" id="progressChartSelect">
                    ${exerciseList.map(ex => `<option value="${ex}">${ex}</option>`).join('')}
                </select>
            </div>
            <div class="progress-chart-container" id="progressChart"></div>
        </div>
        
        <div class="log-entries">${entriesHtml}</div>
        <button class="btn-clear-log" id="clearLogBtn">🗑️ Очистить дневник</button>
    `;
    
    const clearLogBtn = document.getElementById('clearLogBtn');
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', () => {
            if (!confirm('Удалить ВСЮ историю тренировок?')) return;
            localStorage.removeItem(TRACKER_KEYS.workoutLog);
            showToast('🗑️ Дневник очищен');
            renderWorkoutTracker();
        });
    }
    
    const select = document.getElementById('progressChartSelect');
    if (select && exerciseList.length > 0) {
        renderProgressChart(exerciseList[0]);
        select.addEventListener('change', (e) => {
            renderProgressChart(e.target.value);
        });
    }
}

// ============================================
// ТЕМА
// ============================================
const THEME_KEY = 'muscleMap_theme';
const themeToggle = document.getElementById('themeToggle');

function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }

function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
        themeToggle.title = theme === 'light' ? 'Тёмная тема' : 'Светлая тема';
    }
    document.body.style.background = theme === 'light' ? '#f5f6fa' : '';
}

function toggleTheme() {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(next === 'light' ? '☀️ Светлая тема' : '🌙 Тёмная тема');
}

(function initTheme() { setTheme(getTheme()); })();
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

// ============================================
// ТАЙМЕР ОТДЫХА
// ============================================
let restTimer = {
    interval: null,
    timeLeft: 0,
    totalTime: 0,
    isRunning: false,
    autoStart: localStorage.getItem('muscleMap_autoRest') === 'true'
};

function playTimerSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
        setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.value = 1000;
            gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc2.start(audioCtx.currentTime);
            osc2.stop(audioCtx.currentTime + 0.5);
        }, 200);
    } catch (e) { console.log('Звук недоступен'); }
}

function vibrate() { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }

function startRestTimer(seconds) {
    stopRestTimer();
    restTimer.totalTime = seconds;
    restTimer.timeLeft = seconds;
    restTimer.isRunning = true;
    renderRestTimer();
    restTimer.interval = setInterval(() => {
        restTimer.timeLeft--;
        renderRestTimer();
        if (restTimer.timeLeft <= 0) {
            stopRestTimer();
            playTimerSound();
            vibrate();
            showToast('⏱️ Отдых закончен!');
        }
    }, 1000);
}

function stopRestTimer() {
    if (restTimer.interval) { clearInterval(restTimer.interval); restTimer.interval = null; }
    restTimer.isRunning = false;
    restTimer.timeLeft = 0;
    renderRestTimer();
}

function pauseRestTimer() {
    if (restTimer.isRunning) {
        clearInterval(restTimer.interval);
        restTimer.interval = null;
        restTimer.isRunning = false;
    } else if (restTimer.timeLeft > 0) {
        restTimer.isRunning = true;
        restTimer.interval = setInterval(() => {
            restTimer.timeLeft--;
            renderRestTimer();
            if (restTimer.timeLeft <= 0) {
                stopRestTimer();
                playTimerSound();
                vibrate();
                showToast('⏱️ Отдых закончен!');
            }
        }, 1000);
    }
    renderRestTimer();
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderRestTimer() {
    const container = document.getElementById('restTimerContainer');
    if (!container) return;
    const percent = restTimer.totalTime > 0 ? (restTimer.timeLeft / restTimer.totalTime) * 100 : 0;
    const isActive = restTimer.timeLeft > 0;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    
    container.innerHTML = `
        <div class="rest-timer ${isActive ? 'active' : ''}">
            <div class="rest-timer-header">
                <div class="rest-timer-title">⏱️ Отдых между подходами</div>
                <label class="rest-timer-auto">
                    <input type="checkbox" id="autoRestCheckbox" ${restTimer.autoStart ? 'checked' : ''}>
                    <span>Автозапуск</span>
                </label>
            </div>
            <div class="rest-timer-main">
                <div class="rest-timer-circle">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
                        <circle cx="60" cy="60" r="45" fill="none" stroke="${isActive ? '#00b894' : '#6fb3ff'}" stroke-width="8"
                                stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
                                stroke-linecap="round" transform="rotate(-90 60 60)"
                                style="transition: stroke-dashoffset 1s linear;"/>
                    </svg>
                    <div class="rest-timer-display">${isActive ? formatTime(restTimer.timeLeft) : 'Готов'}</div>
                </div>
                <div class="rest-timer-controls">
                    <button class="rest-btn ${isActive ? 'pause' : 'play'}" id="restPauseBtn" ${!isActive ? 'disabled' : ''}>
                        ${restTimer.isRunning ? '⏸️ Пауза' : (isActive ? '▶️ Продолжить' : '—')}
                    </button>
                    <button class="rest-btn reset" id="restResetBtn" ${!isActive ? 'disabled' : ''}>🔄 Сброс</button>
                </div>
            </div>
            <div class="rest-timer-presets">
                <button class="rest-preset" data-time="30">30 сек</button>
                <button class="rest-preset" data-time="60">1 мин</button>
                <button class="rest-preset" data-time="90">1:30</button>
                <button class="rest-preset" data-time="120">2 мин</button>
                <button class="rest-preset" data-time="180">3 мин</button>
            </div>
        </div>
    `;
    bindRestTimerEvents();
}

function bindRestTimerEvents() {
    document.querySelectorAll('.rest-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const seconds = parseInt(btn.dataset.time);
            startRestTimer(seconds);
            showToast(`⏱️ Отдых ${formatTime(seconds)}`);
        });
    });
    const pauseBtn = document.getElementById('restPauseBtn');
    if (pauseBtn) pauseBtn.addEventListener('click', pauseRestTimer);
    const resetBtn = document.getElementById('restResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', stopRestTimer);
    const autoCheck = document.getElementById('autoRestCheckbox');
    if (autoCheck) {
        autoCheck.addEventListener('change', (e) => {
            restTimer.autoStart = e.target.checked;
            localStorage.setItem('muscleMap_autoRest', e.target.checked);
            showToast(e.target.checked ? '✅ Автозапуск включён' : '❌ Автозапуск выключен');
        });
    }
}

const _origRenderWorkoutTracker = renderWorkoutTracker;
window.renderWorkoutTracker = function() {
    _origRenderWorkoutTracker();
    setTimeout(() => {
        const tracker = document.getElementById('workoutTracker');
        if (tracker && !document.getElementById('restTimerContainer')) {
            const timerEl = document.createElement('div');
            timerEl.id = 'restTimerContainer';
            const trackerCard = tracker.querySelector('.tracker-card');
            if (trackerCard) trackerCard.insertAdjacentElement('afterend', timerEl);
            else tracker.appendChild(timerEl);
            renderRestTimer();
        }
    }, 30);
};

const _origAddSet = addSetToExercise;
window.addSetToExercise = function(exerciseName, weight, reps) {
    const result = _origAddSet(exerciseName, weight, reps);
    if (restTimer.autoStart) {
        const lastRest = parseInt(localStorage.getItem('muscleMap_lastRest') || '90');
        startRestTimer(lastRest);
        showToast(`⏱️ Отдых ${formatTime(lastRest)}`);
    }
    return result;
};

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('rest-preset')) {
        const seconds = parseInt(e.target.dataset.time);
        localStorage.setItem('muscleMap_lastRest', seconds);
    }
});

setTimeout(() => {
    const container = document.getElementById('workoutTracker');
    if (container && !document.getElementById('restTimerContainer')) {
        const timerEl = document.createElement('div');
        timerEl.id = 'restTimerContainer';
        const trackerCard = container.querySelector('.tracker-card');
        if (trackerCard) trackerCard.insertAdjacentElement('afterend', timerEl);
        else container.appendChild(timerEl);
        renderRestTimer();
    }
}, 1000);

console.log('✅ Muscle Map полностью загружен');

// ============================================
// 📈 ГРАФИК ПРОГРЕССА ПО УПРАЖНЕНИЮ
// ============================================
function renderProgressChart(exerciseName) {
    const container = document.getElementById('progressChart');
    if (!container) return;
    
    const log = getWorkoutLog();
    
    const dataPoints = [];
    Object.entries(log).forEach(([date, dayData]) => {
        if (dayData[exerciseName]) {
            const maxWeight = Math.max(...dayData[exerciseName].map(s => s.weight || 0));
            if (maxWeight > 0) {
                dataPoints.push({ date, weight: maxWeight });
            }
        }
    });
    
    dataPoints.sort((a, b) => a.date.localeCompare(b.date));
    
    if (dataPoints.length === 0) {
        container.innerHTML = `<div class="progress-chart-empty">😕 Нет данных для этого упражнения</div>`;
        return;
    }
    
    if (dataPoints.length === 1) {
        container.innerHTML = `
            <div class="progress-chart-empty">
                📊 Пока одна тренировка<br>
                <span style="font-size: 11px; color: #4a4a6a;">Добавь ещё — и увидишь прогресс!</span>
            </div>
        `;
        return;
    }
    
    const width = container.clientWidth || 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    
    const weights = dataPoints.map(d => d.weight);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const rangeW = maxW - minW || 1;
    
    const points = dataPoints.map((d, i) => {
        const x = padding.left + (i / (dataPoints.length - 1)) * chartW;
        const y = padding.top + chartH - ((d.weight - minW) / rangeW) * chartH;
        return { x, y, ...d };
    });
    
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length-1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;
    
    const gridLines = [];
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartH;
        const value = Math.round(maxW - (i / 4) * rangeW);
        gridLines.push(`
            <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" 
                  stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <text x="${padding.left - 8}" y="${y + 4}" 
                  fill="#5a5a7a" font-size="10" text-anchor="end">${value}</text>
        `);
    }
    
    const dots = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" 
                fill="#00b894" stroke="#0a0a12" stroke-width="2">
            <title>${new Date(p.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} — ${p.weight} кг</title>
        </circle>
        <text x="${p.x}" y="${p.y - 10}" 
              fill="#00b894" font-size="10" font-weight="600" text-anchor="middle">${p.weight}</text>
    `).join('');
    
    const firstDate = new Date(points[0].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const lastDate = new Date(points[points.length-1].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    
    container.innerHTML = `
        <svg class="progress-chart-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#00b894" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#00b894" stop-opacity="0"/>
                </linearGradient>
            </defs>
            
            ${gridLines.join('')}
            
            <path d="${areaPath}" fill="url(#chartGradient)"/>
            <path d="${linePath}" fill="none" stroke="#00b894" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            
            ${dots}
            
            <text x="${padding.left}" y="${height - 8}" fill="#5a5a7a" font-size="10" text-anchor="start">${firstDate}</text>
            <text x="${width - padding.right}" y="${height - 8}" fill="#5a5a7a" font-size="10" text-anchor="end">${lastDate}</text>
        </svg>
        <div class="progress-chart-stats">
            <div class="progress-chart-stat">
                <span class="progress-chart-stat-label">Мин:</span>
                <span class="progress-chart-stat-value">${minW} кг</span>
            </div>
            <div class="progress-chart-stat">
                <span class="progress-chart-stat-label">Макс:</span>
                <span class="progress-chart-stat-value">${maxW} кг</span>
            </div>
            <div class="progress-chart-stat">
                <span class="progress-chart-stat-label">Рост:</span>
                <span class="progress-chart-stat-value" style="color: #00b894;">+${maxW - minW} кг</span>
            </div>
        </div>
    `;
}

// ============================================
// 💰 ПРЕМИУМ-РАЗДЕЛ
// ============================================
const premiumBtn = document.getElementById('premiumBtn');
const premiumModal = document.getElementById('premiumModal');
const premiumBackdrop = document.getElementById('premiumBackdrop');
const premiumClose = document.getElementById('premiumClose');
const premiumFeaturesEl = document.getElementById('premiumFeatures');
const premiumPlansEl = document.getElementById('premiumPlans');
const premiumCta = document.getElementById('premiumCta');

function openPremium() {
    if (!premiumModal) return;
    renderPremium();
    premiumModal.classList.add('show');
}

function closePremium() {
    if (premiumModal) premiumModal.classList.remove('show');
}

function renderPremium() {
    if (typeof premiumFeatures === 'undefined' || typeof premiumPlans === 'undefined') {
        console.warn('⚠️ premium-data.js не загружен!');
        return;
    }

    premiumFeaturesEl.innerHTML = premiumFeatures.map(f => `
        <div class="premium-feature">
            <div class="premium-feature-icon">${f.icon}</div>
            <div class="premium-feature-content">
                <div class="premium-feature-title">${f.title}</div>
                <div class="premium-feature-desc">${f.description}</div>
                <div class="premium-feature-compare">
                    <span class="premium-compare-free">Бесплатно: ${f.free}</span>
                    <span class="premium-compare-arrow">→</span>
                    <span class="premium-compare-premium">Премиум: ${f.premium}</span>
                </div>
            </div>
        </div>
    `).join('');

    premiumPlansEl.innerHTML = premiumPlans.map(p => `
        <div class="premium-plan ${p.popular ? 'popular' : ''}">
            ${p.badge ? `<div class="premium-plan-badge">${p.badge}</div>` : ''}
            <div class="premium-plan-name">${p.name}</div>
            <div class="premium-plan-price">
                <span class="premium-plan-amount">${p.price} ₽</span>
                <span class="premium-plan-period">${p.period}</span>
            </div>
            <div class="premium-plan-desc">${p.description}</div>
            ${p.savings ? `<div class="premium-plan-savings">${p.savings}</div>` : ''}
            <div class="premium-plan-features">
                ${p.features.map(feat => `<div class="premium-plan-feature">${feat}</div>`).join('')}
            </div>
        </div>
    `).join('');
}

function activatePremium() {
    const userEmail = prompt(
        '🚀 Оформление Премиума\n\n' +
        'Введите ваш email — мы сообщим, когда откроем оплату:\n\n' +
        '(Это заглушка. Реальная оплата будет позже.)'
    );

    if (userEmail && userEmail.includes('@')) {
        const requests = JSON.parse(localStorage.getItem('muscleMap_premiumRequests') || '[]');
        requests.push({
            email: userEmail,
            date: new Date().toISOString()
        });
        localStorage.setItem('muscleMap_premiumRequests', JSON.stringify(requests));

        showToast('✅ Спасибо! Мы сообщим о запуске оплаты.');
        closePremium();
    } else if (userEmail) {
        showToast('⚠️ Введите корректный email');
    }
}

if (premiumBtn) premiumBtn.addEventListener('click', openPremium);
if (premiumClose) premiumClose.addEventListener('click', closePremium);
if (premiumBackdrop) premiumBackdrop.addEventListener('click', closePremium);
if (premiumCta) premiumCta.addEventListener('click', activatePremium);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && premiumModal && premiumModal.classList.contains('show')) {
        closePremium();
    }
});

console.log('✅ Премиум-раздел готов!');
// ============================================
// 📱 PWA — РЕГИСТРАЦИЯ SERVICE WORKER
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker зарегистрирован:', registration.scope);
                
                // Проверка обновлений
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Найдено обновление Service Worker');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('✨ Доступно обновление приложения');
                            
                            // Показать пользователю уведомление
                            if (confirm('✨ Доступно обновление Muscle Map!\n\nОбновить сейчас?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.warn('⚠️ Service Worker не зарегистрирован:', error);
            });
    });
    
    // Перезагрузка при обновлении
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}

// ============================================
// 📱 PWA — КНОПКА «УСТАНОВИТЬ»
// ============================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('📱 Приложение можно установить');
    
    // Показать кнопку «Установить» (если хочешь)
    // showInstallButton();
});

window.addEventListener('appinstalled', () => {
    console.log('✅ Приложение установлено!');
    deferredPrompt = null;
    showToast('🎉 Muscle Map установлен на телефон!');
});

console.log('✅ PWA-блок загружен');