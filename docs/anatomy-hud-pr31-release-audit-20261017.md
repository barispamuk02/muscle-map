# PR #31 — Anatomy HUD: release audit and acceptance gates
Date: 2026-10-17
Status: **DRAFT / NOT AUTHORIZED FOR MERGE**

## Non-negotiable product constraints
- Preserve the owner's Samsung-approved UX: tap abdomen -> `Слои живота` launcher -> four callouts -> one 90-degree (H/V/H) connector moving **from the selected callout to the existing SVG muscle**.
- Preserve immediate exercise content updates. Do not restore any delayed card swap or hide exercises while waiting for animation.
- Do not touch Neon Production, Dodo Payments, subscriptions, existing user accounts or billing, Production runtime/configuration, or backend state. Never carry out a real payment, registration, or destructive test without explicit authorization.
- This frontend PR is **not** evidence that a new buyer's Neon Auth -> Dodo -> Premium flow has been tested end-to-end on Production. CI passing is not Production payment verification.
- Do not merge PR #31 or release until explicit owner approval after every mandatory gate is addressed.

## Gate 1 — Anatomical fidelity: BLOCKED
The exact Git blob is shared by:
- `svg/9_Internal_oblique_muscle_of_the_abdomen.svg`
- `svg/10_Transversus_abdominis_muscle.svg`

Both blobs: `6f4f5b641f6da68e39fa5a1229b8112122d1f527`.
Current contours are identical, despite representing different deep layers of the abdominal wall.
Correct superficial -> deep layer order: external oblique -> internal oblique -> transversus abdominis.

Before anatomical sign-off:
- [ ] obtain independently verified, non-identical muscle representations appropriate to the frontal mannequin (existing 707x1412 SVG coordinate frame or a clearly documented compatible mapping)
- [ ] verify boundaries and depth with an anatomical source and human review; do not invent shapes to pass a SHA test
- [ ] verify permissible reuse/licensing in a commercial application
- [ ] preserve existing IDs, HUD visual interaction, and exercise mappings
- [ ] add a regression assertion that the two intended anatomical SVGs are not identical and test their selection
- [ ] visually approve on Samsung

Tracked as [Issue #32](https://github.com/barispamuk02/muscle-map/issues/32).
References: [NCBI StatPearls, Anterolateral Abdominal Wall](https://www.ncbi.nlm.nih.gov/books/NBK525975/); [public domain Gray399.svg reference](https://commons.wikimedia.org/wiki/File:Gray399.svg) (not a ready-made overlay).

## Gate 2 — Actual Samsung performance: QUALITATIVE PASS, FPS UNMEASURED
Owner validated on physical Samsung: HUD visually smooth, and previously observed 6-7s exercise delay is gone.
Automated Chromium smoke tests verify immediate DOM rendering and guard against stale card timers, but cannot prove real-device FPS.
- [ ] measure animation/selection frames with physical Samsung through Chrome DevTools remote inspection, recording 10+ selections and rapid taps
- [ ] look for dropped frames and long main-thread tasks; aim for stable 60 FPS where supported (or the device's actual 90/120Hz refresh as applicable)
- [ ] check thermal and reduced-power conditions before claiming stable performance
- [ ] keep opacity/transform entrance, one-shot SVG stroke animation; no infinite pulse

## Gate 3 — Accessible UX: FUNCTIONAL TESTS, DEVICE SIGN-OFF PENDING
- [x] four callouts fit tested 320, 360, 390, 412px Chromium mobile viewports
- [x] visible button touch targets are >= 44px; HUD callouts use min-height 48px on narrow screens
- [x] keyboard Tab from `viewToggle` reveals keyboard-focusable HUD launcher
- [x] `aria-expanded`, `aria-pressed`, and localized RU/EN group name
- [x] `prefers-reduced-motion: reduce` removes label, stroke, launcher and dot motion
- [ ] independently inspect readable RU/EN callout labels and focus indication on Samsung and desktop keyboard
- [ ] audit screen-reader announcements on mobile, if available

## Gate 4 — Safe release: FRONTEND SCOPE REVIEWED, HOLD FOR APPROVAL
- PR is based on `main`, still Draft; never auto-merge.
- Changed scope: `index.html`, `mobile-home.css`, `script.js`, `service-worker.js`, `styles.css`, `tests/browser-smoke.cjs`, and this audit document.
- No backend, Neon SQL, Render, Dodo billing or credentials modified by this PR.
- Browser smoke includes desktop/mobile navigation, one selected HUD leader, orthogonal segments, no horizontal mobile overflow, immediate exercises, keyboard, reduced motion, and rapid changes.
- [ ] all four GitHub Actions checks green at final head SHA
- [ ] re-verify current main/head diff and no accidental unrelated changes
- [ ] no Production merge/deploy until owner expressly authorizes
- [ ] separately preserve the original commercial release plan: new buyer Neon Auth, real Dodo payment, automatic Premium server-side check, and backed-up Neon data. Do not treat this design PR as a substitute for payment/security release gates.

## Current release decision
**HOLD:** The approved animation should be preserved, but anatomical layer files remain identical and real physical-device frame measurements have not been recorded. Keep Draft until these are either completed or the owner explicitly decides a narrower release scope without claiming deep anatomy is finished.

## Additional gate — exercise synergists: PROVISIONAL FIX, FULL EVIDENCE REVIEW PENDING (2026-10-17)
The user's Samsung report identified missing synergist sections on trapezius and other muscles.

### Runtime findings (real Chromium application audit)
- `muscleDatabase`: 30 entities, including 2 ligament categories and a face category.
- Catalogue: 1295 exercise records, **all resolve to keys** in the 1289-entry `synergists-data.js` lookup. The difference is duplicate exercise names, **not** six missing exercise mappings.
- 14 entities had no rendered synergy section because all of their displayed exercises were in `customExercises`, where `name_en` is intentionally empty; `renderMuscleSynergists` previously looked up by `name_en` only.
- Two invalid `synergists-data.js` muscle IDs: `male_calves` -> `male_calf`; `male_deltoid posterior` -> `male_deltoid_posterior`.

### Draft solution
- Added `custom-synergists-data.js`: first-pass exercise-specific qualitative partner sets for 8 muscle categories, including **middle trapezius rows, face pulls and reverse flys**. These are anatomical interpretations requiring further qualified review, not per-exercise EMG measurements.
- Added `resolveExerciseSynergists(ex)` to keep generated catalogue mappings and curated manual mappings distinct.
- Showed selected manual-exercise partners in individual exercise details and in the muscle-level summary.
- Disabled display of generated 70/15/10/5 percentages in exercise synergist cards. Do not pass off default/template weights as measured contribution.
- Added the custom-exercise click highlighting path while preserving original regular-exercise highlight behavior.
- New automated checks reject unknown IDs, missing linked exercise destinations, missing rendered synergists for curated groups, and source link failures.
- **Deliberately left some exercises blank** when reliable co-activation of another *modeled* muscle is not established (e.g. isolated forearm/tibialis actions), for facial movement, or when the entries describe stretching/ligament rehabilitation. Do not convert antagonists to synergists to meet a numeric coverage target.

### Follow-up review required
- [ ] Check each curated movement and the full generated catalogue for biomechanical accuracy; do not equate stabilizers with primary movers
- [ ] Resolve catalog-primary mismatch in `dumbbell rear delt raise` and manual middle-trapezius `Шраги` classification before claiming scientific completeness
- [ ] Resolve dataset quality ticket: https://github.com/barispamuk02/muscle-map/issues/33
- [ ] Confirm mobile/desktop RU/EN labels, click-through exercise list and amber body highlights on Samsung
- [ ] Preserve approved Anatomy HUD, current performance, four required release gates, original Production/Neon/Dodo constraints and Draft status

References: https://www.ncbi.nlm.nih.gov/books/NBK518994/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC6849087/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC5758546/ .
