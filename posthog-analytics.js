/* Muscle Map analytics: anonymous pageview telemetry only; disable autocapture and session recordings. */
(function () {
    'use strict';
    if (window.location.hostname !== 'muscle-map.app' && window.location.hostname !== 'www.muscle-map.app') return;
    if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
    var key = 'phc_oLfcGvjb6awPy5UAPhtrRZ59Pzq5TSweXjARSzsMGxJG';
    var src = 'https://eu.i.posthog.com/static/array.js';
    window.posthog = window.posthog || [];
    var q = window.posthog;
    q._i = q._i || [];
    if (!q.init) {
        var names = 'capture identify alias people.set people.set_once set_config reset onFeatureFlags get_distinct_id'.split(' ');
        names.forEach(function (name) {
            var parts = name.split('.'), context = q;
            for (var j = 0; j < parts.length - 1; j++) context = context[parts[j]] = context[parts[j]] || [];
            context[parts[parts.length - 1]] = function () {
                var args = Array.prototype.slice.call(arguments);
                (context === q ? q : context).push([name].concat(args));
            };
        });
        q.init = function (token, config) { q._i.push([token, config]); };
    }
    var script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.onerror = function () { console.warn('Analytics unavailable'); };
    document.head.appendChild(script);
    q.init(key, {
        api_host: 'https://eu.i.posthog.com',
        ui_host: 'https://eu.posthog.com',
        capture_pageview: true,
        capture_pageleave: false,
        autocapture: false,
        disable_session_recording: true,
        person_profiles: 'identified_only',
        mask_all_text: true,
        mask_all_element_attributes: true,
        persistence: 'memory',
        respect_dnt: true,
        opt_out_capturing_by_default: false
    });
})();
