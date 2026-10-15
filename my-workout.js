/* Muscle Map: My Workout stage 1. Uses existing tracker and storage (no duplicate diary). */
(function () {
    'use strict';

    const screen = document.getElementById('viewMyWorkout');
    const nav = document.getElementById('navMyWorkout');
    const host = document.getElementById('myWorkoutHost');
    if (!screen || !nav || !host) return;

    const views = {
        navMuscles: ['viewMuscles', 'grid'],
        navRecovery: ['viewRecovery', 'grid'],
        navNutrition: ['viewNutrition', 'block'],
        navPrograms: ['viewPrograms', 'block']
    };
    const navIds = ['navMuscles', 'navRecovery', 'navNutrition', 'navPrograms', 'navMyWorkout'];

    function setNavigation(activeId) {
        navIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('active', id === activeId);
        });
        Object.entries(views).forEach(([id, [viewId, display]]) => {
            const el = document.getElementById(viewId);
            if (el) el.style.display = id === activeId ? display : 'none';
        });
        screen.style.display = activeId === 'navMyWorkout' ? 'block' : 'none';
        document.body.classList.toggle('my-workout-active', activeId === 'navMyWorkout');
    }

    function getLocalDate() {
        return new Intl.DateTimeFormat(
            typeof currentLang !== 'undefined' && currentLang === 'en' ? 'en-US' : 'ru-RU',
            { weekday: 'long', day: 'numeric', month: 'long' }
        ).format(new Date());
    }

    function readWorkout() {
        return typeof getCurrentWorkout === 'function' ? getCurrentWorkout() : { exercises: {} };
    }

    function readHistory() {
        return typeof getWorkoutLog === 'function' ? getWorkoutLog() : {};
    }

    function mostRecentDate(log) {
        const dates = Object.keys(log || {}).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date));
        dates.sort();
        return dates.length ? dates[dates.length - 1] : null;
    }

    function updateSummary() {
        const workout = readWorkout();
        const entries = Object.entries(workout.exercises || {});
        const count = entries.length;
        const sets = entries.reduce((sum, [, items]) => sum + (Array.isArray(items) ? items.length : 0), 0);
        const history = readHistory();
        const last = mostRecentDate(history);
        const date = document.getElementById('myWorkoutDate');
        const exerciseCount = document.getElementById('myWorkoutExerciseCount');
        const setCount = document.getElementById('myWorkoutSetCount');
        const lastDate = document.getElementById('myWorkoutLastDate');
        const repeat = document.getElementById('myWorkoutRepeatLast');
        if (date) date.textContent = getLocalDate();
        if (exerciseCount) exerciseCount.textContent = String(count);
        if (setCount) setCount.textContent = String(sets);
        if (lastDate) {
            const lang = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'en-US' : 'ru-RU';
            // Noon local avoids UTC-midnight day-shift in date-only values.
            const parsed = last ? new Date(last + 'T12:00:00') : null;
            lastDate.textContent = parsed && !Number.isNaN(parsed.getTime())
                ? new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(parsed)
                : '—';
        }
        if (repeat) repeat.disabled = !last;
    }

    function renderExistingTracker() {
        let tracker = document.getElementById('workoutTracker');
        if (!tracker) {
            tracker = document.createElement('div');
            tracker.id = 'workoutTracker';
        }
        if (tracker.parentElement !== host) host.appendChild(tracker);
        if (typeof renderWorkoutTracker === 'function') renderWorkoutTracker();
        updateSummary();
    }

    function openMyWorkout() {
        setNavigation('navMyWorkout');
        if (typeof currentViewMode !== 'undefined') currentViewMode = 'my-workout';
        ['challengesSection', 'searchSection', 'recoveryHeader'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        renderExistingTracker();
    }

    nav.addEventListener('click', openMyWorkout);

    // Existing handlers run in the bubble phase. Restore consistent visibility first.
    // The Programs screen still owns its original tracker location.
    document.addEventListener('click', event => {
        const target = event.target.closest('#navMuscles, #navRecovery, #navNutrition, #navPrograms');
        if (!target) return;
        setNavigation(target.id);
        if (target.id === 'navPrograms') {
            // Existing switchToPrograms renders its contents asynchronously after 50 ms.
            window.setTimeout(() => {
                if (typeof currentViewMode !== 'undefined' && currentViewMode !== 'programs') return;
                const programs = document.getElementById('programsContainer');
                const tracker = document.getElementById('workoutTracker');
                if (programs && tracker && !programs.contains(tracker)) {
                    programs.appendChild(tracker);
                    if (typeof renderWorkoutTracker === 'function') renderWorkoutTracker();
                }
            }, 100);
        }
    }, true);

    const goPrograms = document.getElementById('myWorkoutGoPrograms');
    if (goPrograms) goPrograms.addEventListener('click', () => {
        const programs = document.getElementById('navPrograms');
        if (programs) programs.click();
    });

    const repeat = document.getElementById('myWorkoutRepeatLast');
    if (repeat) repeat.addEventListener('click', () => {
        const last = mostRecentDate(readHistory());
        if (!last || typeof repeatWorkout !== 'function') return;
        repeatWorkout(last);
        updateSummary();
    });

    // Existing tracker controls redraw on click. Refresh header after their handlers run.
    screen.addEventListener('click', () => window.setTimeout(updateSummary, 0));

    // The global language-switch handler runs on document. Refresh values afterward.
    document.addEventListener('click', event => {
        if (event.target.closest('#langToggle') && screen.style.display !== 'none') {
            window.setTimeout(() => {
                if (typeof renderWorkoutTracker === 'function') renderWorkoutTracker();
                updateSummary();
            }, 0);
        }
    });

    // No writes to muscleMap_workoutLog or muscleMap_currentWorkout in this module.
    window.MuscleMapMyWorkout = { open: openMyWorkout, refresh: updateSummary };
})();
