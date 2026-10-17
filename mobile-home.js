/* Muscle Map Mobile Home v2. No diary data writes, all actions use existing app controls. */
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const mobile = window.matchMedia('(max-width: 768px)');
    if (!$('viewMuscles') || !$('navMuscles') || !$('navMyWorkout')) return;
    const lang = () => {
        if (typeof currentLang !== 'undefined') return currentLang === 'en' ? 'en' : 'ru';
        return localStorage.getItem('muscleMap_lang') === 'en' ? 'en' : 'ru';
    };
    const labels = {
        ru: {
            kicker: 'АНАТОМИЯ И ТРЕНИРОВКИ', title: 'Изучай мышцы.', titleAccent: 'Тренируйся осознанно.',
            description: 'Выбери мышцу и открой подходящие упражнения.', search: 'Найти мышцу…',
            workout: 'Моя тренировка', programs: 'Программы', muscles: 'Мышцы', progress: 'Прогресс',
            more: 'Ещё', menu: 'Все разделы', recovery: 'Восстановление', nutrition: 'Питание',
            premium: 'Премиум', account: 'Аккаунт', share: 'Поделиться', random: 'Случайная мышца', close: 'Закрыть'
        },
        en: {
            kicker: 'ANATOMY & TRAINING', title: 'Know your muscles.', titleAccent: 'Own your workout.',
            description: 'Choose a muscle to discover exercises.', search: 'Find a muscle…',
            workout: 'My Workout', programs: 'Programs', muscles: 'Muscles', progress: 'Progress',
            more: 'More', menu: 'All sections', recovery: 'Recovery', nutrition: 'Nutrition',
            premium: 'Premium', account: 'Account', share: 'Share', random: 'Random muscle', close: 'Close'
        }
    };
    const hero = document.createElement('section');
    hero.id = 'mmMobileHero';
    hero.className = 'mm-mobile-hero';
    hero.innerHTML = '<div class="mm-mobile-eyebrow" data-mm-text="kicker"></div><h2><span data-mm-text="title"></span><span class="mm-hero-accent" data-mm-text="titleAccent"></span></h2><p data-mm-text="description"></p>';
    const header = document.querySelector('.header');
    header.insertAdjacentElement('afterend', hero);

    const shortcuts = document.createElement('div');
    shortcuts.className = 'mm-mobile-shortcuts';
    shortcuts.innerHTML = '<button type="button" data-mm-target="navMyWorkout" data-mm-text="workout"></button><button type="button" data-mm-target="navPrograms" data-mm-text="programs"></button>';
    $('viewMuscles').appendChild(shortcuts);

    const bottom = document.createElement('nav');
    bottom.className = 'mm-mobile-bottom-nav';
    bottom.setAttribute('aria-label', 'Main navigation');
    const paths = {
        muscles: '<path d="M8 11c-2-1-3-4-1-6 1-1 3-1 4 1l1 3h4c3 0 5 2 5 5v2c0 3-2 5-5 5H8c-3 0-5-2-5-5v-3c0-2 1-4 3-5"/><path d="M8 15c2-3 5-3 7-2"/>',
        workout: '<path d="m6.5 6.5 11 11M4 4l2-2 4 4-4 4-4-4 2-2Zm14 14 2-2 4 4-4 4-4-4 2-2Z"/>',
        programs: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2"/>',
        progress: '<path d="M4 20V10M10 20V5M16 20v-8M22 20V3"/>',
        more: '<path d="M4 7h16M4 12h16M4 17h16"/>'
    };
    const navIcon = name => '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths[name] + '</svg>';
    bottom.innerHTML = [
        ['navMuscles', 'muscles'], ['navMyWorkout', 'workout'],
        ['navPrograms', 'programs'], ['dashboardBtn', 'progress'], ['more', 'more']
    ].map(([target, key]) => '<button type="button" data-mm-target="' + target + '"><span class="mm-tab-icon" aria-hidden="true">' + navIcon(key) + '</span><span data-mm-text="' + key + '"></span></button>').join('');
    document.body.appendChild(bottom);

    const backdrop = document.createElement('div');
    backdrop.className = 'mm-mobile-menu-backdrop';
    backdrop.hidden = true;
    const sheet = document.createElement('section');
    sheet.className = 'mm-mobile-menu';
    sheet.id = 'mmMobileMenu';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'All sections');
    sheet.hidden = true;
    sheet.innerHTML = '<div class="mm-mobile-menu-head"><span data-mm-text="menu"></span><button type="button" data-mm-close aria-label="Close">×</button></div>' +
        '<div class="mm-mobile-menu-grid">' + [
            ['navRecovery', '♡', 'recovery'], ['navNutrition', '♧', 'nutrition'],
            ['premiumBtn', '◇', 'premium'], ['navAccount', '👤', 'account'], ['shareBtn', '↗', 'share'],
            ['randomBtn', '⤨', 'random']
        ].map(([target, symbol, key]) => '<button type="button" class="' + (target === 'premiumBtn' ? 'mm-premium' : '') + '" data-mm-target="' + target + '">' + symbol + ' <span data-mm-text="' + key + '"></span></button>').join('') + '</div>';
    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    let menuReturnFocus = null;
    function closeMenu() {
        const wasOpen = !sheet.hidden;
        sheet.hidden = true;
        backdrop.hidden = true;
        document.body.classList.remove('mm-mobile-menu-open');
        if (wasOpen && menuReturnFocus?.isConnected) menuReturnFocus.focus();
    }
    function openMenu() {
        menuReturnFocus = document.activeElement;
        backdrop.hidden = false;
        sheet.hidden = false;
        document.body.classList.add('mm-mobile-menu-open');
        const close = sheet.querySelector('[data-mm-close]');
        if (close) close.focus();
    }
    function showCurrent() {
        const views = [
            ['navMyWorkout','viewMyWorkout'], ['navPrograms','viewPrograms'],
            ['navRecovery','viewRecovery'], ['navNutrition','viewNutrition']
        ];
        const active = views.find(([,view]) => $(view) && $(view).style.display !== 'none');
        return active ? active[0] : 'navMuscles';
    }
    function sync() {
        const active = showCurrent();
        const onHome = active === 'navMuscles';
        document.body.classList.toggle('mm-home', onHome);
        document.body.classList.toggle('mm-english', lang() === 'en');
        document.querySelectorAll('.mm-mobile-bottom-nav button').forEach(btn => {
            if (btn.dataset.mmTarget === active) btn.setAttribute('aria-current','page');
            else btn.removeAttribute('aria-current');
        });
        const tr = labels[lang()];
        document.querySelectorAll('[data-mm-text]').forEach(el => {
            const k = el.getAttribute('data-mm-text');
            if (tr[k]) el.textContent = tr[k];
        });
        const search = $('searchInput');
        if (search && !search.value) search.placeholder = tr.search;
        sheet.setAttribute('aria-label',tr.menu);
        bottom.setAttribute('aria-label',tr.menu);
    }
    function navigate(target) {
        closeMenu();
        if (target === 'more') return openMenu();
        const element = $(target);
        if (!element) return;
        if (target === 'randomBtn') $('navMuscles').click();
        if (target !== 'navMuscles' && target !== 'randomBtn') document.body.classList.remove('mm-home');
        element.click();
        if (mobile.matches && ['navMyWorkout','navPrograms','navRecovery','navNutrition','navMuscles'].includes(target)) {
            window.scrollTo({top:0,behavior:'instant'});
        }
        setTimeout(sync, 130);
    }
    for (const area of [bottom, sheet, shortcuts]) {
        area.addEventListener('click', event => {
            const close = event.target.closest('[data-mm-close]');
            if (close) { closeMenu(); return; }
            const button = event.target.closest('[data-mm-target]');
            if (button) navigate(button.dataset.mmTarget);
        });
    }
    // Bring the exercise panel into view after selecting a muscle on either the
    // anatomical overlay or the list. Do not scroll on initial page load.
    const muscleList = $('muscleList');
    const muscleMap = $('bodyView');
    let pendingDetailScroll = null;
    function revealMuscleDetails() {
        if (pendingDetailScroll !== null) clearTimeout(pendingDetailScroll);
        pendingDetailScroll = setTimeout(() => {
            pendingDetailScroll = null;
            if (!mobile.matches || showCurrent() !== 'navMuscles') return;
            const info = $('infoContent');
            if (!info || !info.textContent.trim()) return;
            info.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start'
            });
        }, 140);
    }
    if (muscleList) muscleList.addEventListener('click', event => {
        if (event.target.closest('.list-item')) revealMuscleDetails();
    });
    if (muscleMap) muscleMap.addEventListener('click', event => {
        if (event.target.closest('#viewToggle,.view-toggle-btn')) return;
        if (event.target.closest('.body-svg-layer,[data-muscle-id],[data-muscle]')) {
            revealMuscleDetails();
        }
    });
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', event => {
        if (sheet.hidden) return;
        if (event.key === 'Escape') { closeMenu(); return; }
        if (event.key !== 'Tab') return;
        const controls = [...sheet.querySelectorAll('button:not([disabled])')];
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) {
            event.preventDefault(); controls[controls.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
            event.preventDefault(); controls[0].focus();
        }
    });
    document.addEventListener('click', event => {
        if (event.target.closest('#navMuscles,#navMyWorkout,#navPrograms,#navRecovery,#navNutrition,#langToggle')) {
            setTimeout(sync,130);
        }
    });
    if (mobile.addEventListener) mobile.addEventListener('change', () => { closeMenu(); sync(); });
    sync();
})();
