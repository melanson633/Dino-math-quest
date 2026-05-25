# Local Validation Harness

Date: 2026-05-25

## Commands

Install from the repo root only when dependencies are missing or changed:

```powershell
pnpm install
```

Run the Charlotte-facing app:

```powershell
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run dev
```

Portable local/Replit run command:

```powershell
pnpm run dev:dino
```

Local URL:

```text
http://127.0.0.1:25918/
```

Fast app-specific validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

Full workspace validation:

```powershell
pnpm run typecheck
pnpm run build
```

Replit-compatible build and preview wrappers:

```powershell
pnpm run build:replit
pnpm run preview:dino
```

## Browser Smoke Checklist

Primary viewport: tablet portrait `820 x 1180`.

Secondary quick viewport: mobile portrait `390 x 844`.

Use `docs/qa-playtest-checklist.md` when the task needs repeatable pass/fail coverage across Home Base, Math, Spelling, Speech, Music, Dino Den, grown-up controls, and persistence.

Check:

- Home Base renders with no blank screen or runtime overlay.
- Companion selection works for solo and at least one family companion.
- Math opens from Home Base.
- A Math wrong answer gives positive retry feedback and does not dead-end.
- A Math correct answer advances and keeps controls responsive.
- Home return from Math works.
- Words, Say It, and Music open and return Home.
- Console has no runtime errors.
- Audio starts only after a user gesture and does not create autoplay warnings.

## Current Known Status

Recent local smoke work verified the current Dino Island foundation at `http://127.0.0.1:25918/` on tablet and mobile viewports with no console errors or warnings. Typecheck and build passed for `@workspace/dino-math-quest`.

2026-05-25 P2 adult controls smoke: Playwright Chromium verified `Grown-up Controls` on tablet `820 x 1180` and mobile `390 x 844`. Math pace, speech support, and music cues persisted to localStorage; progress reset preserved those adult settings. App-specific typecheck and build passed. One mobile run reported a transient Chromium `ERR_NO_BUFFER_SPACE` resource error, but an immediate request-failure rerun was clean.

2026-05-25 P2 spelling adaptation smoke: Playwright Chromium tablet `820 x 1180` verified Words flow from Home Base, DINO then MAMA completion advanced to steady WOW, one wrong tap quietly fell back to support DINO, and console warnings/errors were empty.

2026-05-25 P2 release-readiness validation: Playwright Chromium verified the running app at `http://127.0.0.1:25918/` on tablet `834 x 1112` and mobile `390 x 844`. Flows exercised: Home Base, Mama companion selection, Math wrong/correct answer, Spelling DINO completion, Speech rhythm beat plus `I Tried`, Music song plus beat buttons, Dino Den empty state, seeded Stegosaurus practice, grown-up controls persistence, and return-home navigation. Console check returned no errors or warnings.

2026-05-25 full workspace validation passed from the repo root:

```powershell
pnpm run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build
```

Resolved 2026-05-25 in P3-003: mobile Home Base now shows all four adventure choices within the first `390 x 844` viewport, and Math Home has `data-testid="button-math-home"`.

2026-05-25 Replit/local wrapper validation:

```powershell
pnpm run build:replit
$env:PORT='25919'; $env:BASE_PATH='/'; pnpm run dev:dino
```

`pnpm run build:replit` passed from the repo root after running full workspace typecheck and recursive package builds. `pnpm run dev:dino` served the app on an alternate local port with HTTP 200 and the `Dino Math Quest` title, confirming the portable command routes to the Charlotte-facing app.

2026-05-25 fresh-state browser smoke: Playwright Chromium cleared `localStorage`, reloaded `http://127.0.0.1:25918/` on tablet `834 x 1112`, and verified first-run Home Base rendered with no console warnings or errors. Persisted-state checks are still useful, but fresh-state checks should be included when validating onboarding or first-use behavior.

2026-05-25 rhythm/visual-clue browser validation: Playwright Chromium verified the running app at `http://127.0.0.1:25918/` on tablet `834 x 1112` and mobile `390 x 844`. Flows exercised: Home Base, Mama companion selection, Math `Count Beat` rhythm cue and answer choices, Words visual icon clue with DINO letter-building, and Say It rhythm beat plus single positive `I Said It` completion. All three Math answer choices were visible on mobile after the layout adjustment, minimum measured button side was `48px`, and console warnings/errors were empty. Evidence: `artifacts/dino-math-quest/test-results/child-flow-report-final.json` and matching final screenshots in `artifacts/dino-math-quest/test-results/`.

2026-05-25 root validation after rhythm/visual-clue pass:

```powershell
pnpm run typecheck
pnpm --filter @workspace/scripts run elevenlabs:audio -- --dry-run
pnpm run build:replit
```

Typecheck and Replit-compatible build passed. The ElevenLabs dry run used the configured manifest path, found no `approved_for_generation` items, and refreshed the public audio manifest with zero generated gameplay assets.

Real iPad Safari remains the important follow-up for touch feel, safe-area behavior, PWA install behavior, and audio unlock behavior.

2026-05-25 ElevenLabs SDK/music candidate validation:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run elevenlabs:audio -- --dry-run
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

The generator now uses the official `@elevenlabs/elevenlabs-js` SDK and dry-run refreshed the public manifest with zero approved gameplay assets. Playwright Chromium verified a fresh dev server at `http://localhost:25919/` on tablet `834 x 1112`: Home Base rendered fully, Math opened, answer buttons were visible/touch-sized, and console warnings/errors were empty. Mobile `390 x 844` fresh-state Home Base rendered with touch-sized controls and no console warnings/errors.

2026-05-25 Home Base compact / Music ordered-beat validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

Playwright Chromium verified `http://127.0.0.1:25918/?v=home-compact-1` at mobile CSS viewport `390 x 844` and `http://127.0.0.1:25918/?v=tablet-compact-1` at tablet CSS viewport `820 x 1180`. Mobile Home Base showed Math, Words, Say It, and Music without scrolling; Math opened with `button-math-home`; Music reset positively after an out-of-order beat and enabled `Next Beat` only after the ordered `clap, clap, stomp` sequence. Console warnings/errors were empty.

2026-05-25 root validation after Home Base compact / Music ordered-beat pass:

```powershell
pnpm run typecheck
pnpm run build:replit
```

Both commands passed from the repo root. `build:replit` routed through `scripts/run-dino.mjs build`, re-ran workspace typecheck, and built the Charlotte-facing game output under `artifacts/dino-math-quest/dist/public`.

2026-05-25 companion activity variant validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

Playwright Chromium verified `http://127.0.0.1:25918/?v=family-polish-mobile-2` at mobile CSS viewport `390 x 844`. After choosing Mama, the Mama companion tile and selected Home Base panel both used the same stable YAML activity text, `Mama is carrying River.`, the selected image rendered, all four adventure buttons remained visible without scrolling, and console warnings/errors were empty. Tablet CSS `820 x 1180` also kept the adventure grid visible after selecting a family companion.

Root validation after companion activity variant pass:

```powershell
pnpm run typecheck
pnpm run build:replit
```

Both commands passed from the repo root.

2026-05-25 ElevenLabs parent-review harness hardening:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run elevenlabs:review
pnpm run typecheck
pnpm run build:replit
```

The audio generator now validates the parent-review manifest before generation or public-manifest writes. The review command regenerated `docs/audio-parent-review.md`, refreshed `artifacts/dino-math-quest/public/audio/manifest.json` with zero approved gameplay assets, and did not require live ElevenLabs calls because no items are approved for generation yet. Chrome DevTools verified the existing app at `http://127.0.0.1:25918/` on tablet emulation `834 x 1112 x2` and mobile emulation `390 x 844 x3`: Home Base rendered, all four adventure choices were visible, the public audio manifest returned `assets: []`, companion selection and Math answer flow worked on tablet, touch targets remained at least `64px` on mobile, and console warnings/errors were empty.

2026-05-25 child-facing audio manifest loader hardening:

```powershell
pnpm --filter @workspace/scripts run elevenlabs:review
pnpm run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build
pnpm run build:replit
```

The runtime audio loader now retries after transient public-manifest fetch failures and accepts only approved, generated `.mp3` manifest entries under `/audio/generated/`. The ElevenLabs review command regenerated the parent worksheet and refreshed the public manifest with zero approved gameplay assets. Root typecheck, production build, and Replit-routed build passed. Playwright Chromium verified the running app at `http://127.0.0.1:25918/` on tablet `834 x 1112`: Home Base rendered, Math opened, a correct answer advanced quickly, `/audio/manifest.json` returned HTTP 200 with `assets: []`, and console warnings/errors were empty.

2026-05-25 repeatable child-flow harness:

```powershell
pnpm --filter @workspace/scripts run dino:child-playtest
```

The child-playtest harness opens the Charlotte-facing game in Playwright, checks tablet/mobile Home Base and learning-flow basics, and writes evidence under `artifacts/dino-math-quest/test-results/child-playtest/`. Latest recorded pass: 15 pass, 0 warn, 0 fail, with `report.json`, `tablet-final.png`, and `mobile-home.png` generated in that folder.

2026-05-25 strengthened child-flow harness:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
```

The harness now includes child-perspective heuristics for first-viewport fit, obvious next tap, no horizontal overflow, positive-only speech retry copy, and 44px minimum touch targets. Latest recorded pass: 30 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

Root validation after strengthened harness:

```powershell
pnpm run typecheck
pnpm run build:replit
```

Both commands passed from the repo root. `.gitignore` now also ignores root `.symphony-*.log` dry-run logs so local orchestration probes do not pollute the eventual tracked baseline.

2026-05-25 iPad playtest helper:

```powershell
pnpm --filter @workspace/scripts run dino:ipad-server
```

Added a repo-local helper that starts the Dino Quest dev server and prints LAN playtest URLs for real iPad Safari validation. This does not replace the P4-002 gate; it only reduces setup friction for the physical-device checklist in `docs/qa-playtest-checklist.md`.

Validation:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:ipad-server -- --print-only
pnpm run typecheck
```

The print-only check produced LAN URL candidates on the current network without starting a long-running server.

2026-05-25 Words context-cue validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest -- --no-server --url http://127.0.0.1:25918/
pnpm run typecheck
pnpm run build:replit
```

The Words screen now renders YAML-backed child-readable context cues for each spelling word, pairing a visual/meaning hint with first-sound or speech-position support and a short rhythm cue. The child-playtest harness now fails if the Words screen does not expose at least three visible context cues before letter tapping. Initial context-cue pass: 31 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, `mobile-home.png`, and targeted Words screenshot `tablet-spelling-cues.png`.

2026-05-25 Math context-cue validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build:replit
```

Math Quest now renders child-readable context cues for every puzzle type before answer tapping, such as count, touch, pattern, match, order, gap, bigger, and shape cues. The child-playtest harness now fails if Math does not expose at least three visible context cues before the answer flow. Latest recorded pass: 32 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 spelling word-bank context audit:

```powershell
pnpm install
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
```

The repeatable child-playtest harness now parses `artifacts/dino-math-quest/src/content/dino-island.yaml` and fails if the spelling word bank lacks visible clues, first-letter support, difficulty/group coverage, rhythm cues, or gentle `L`/`W` support where relevant. `WALK` and `CHARLOTTE` now include explicit `tongue-up L` context alongside existing word and sound cues. Latest recorded pass: 33 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 source copy guardrail:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build:replit
```

The child-playtest harness now scans Dino Quest source and YAML content for blocked discouraging speech-recognition phrases, including "can't understand", "cannot understand", "didn't say", "wrong voice", "try harder", and "bad try". This supplements the visible Speech screen copy check so off-path child-facing text cannot quietly regress. Latest recorded pass: 34 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 grown-up controls harness coverage:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build:replit
```

The child-playtest harness now opens `Grown-up Controls`, enforces a touch-safe close button, toggles math pace, speech support, and music cues, verifies those adult settings persist after reload, and verifies progress reset returns to Home Base while preserving adult settings. This initially exposed a real 41px measured close target during the settings-modal animation/device context; the modal close control was enlarged and the harness now passes at 40 pass, 0 warn, 0 fail. Root typecheck and Replit-routed build also passed. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 public audio manifest safety harness:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
```

The child-playtest harness now fetches `/audio/manifest.json` during the tablet flow and fails if child-facing audio assets are not explicitly approved, use unsupported kinds, point outside `/audio/generated/`, contain unsafe path segments, or are not generated `.mp3` files. The current parent-review state still exposes zero gameplay assets, which is valid and keeps synthesized fallback sounds in place. Latest recorded pass: 41 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 Dino Den child-flow harness coverage:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
```

The child-playtest harness now opens Dino Den from Home Base, verifies the empty-state guidance and locked collection grid, seeds a first unlocked Stegosaurus state, and checks that Clap Name, Dino Song, and Count practice controls expose the expected syllable, chant, and counting prompts. It also rechecks Dino Den touch targets and horizontal containment before returning Home. Latest recorded pass: 50 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 Dino Den empty-state Math route:

```powershell
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build:replit
```

The empty Dino Den state now includes a large direct `Play Math` button so a child does not need to infer that the back arrow is the next step. The child-playtest harness verifies that the new button is touch-sized/obvious and routes directly into Math Quest with answer choices visible, then continues the seeded unlocked-Dino practice flow. Latest recorded pass: 52 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`.

2026-05-25 Math mission cue and Home solo containment pass:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build:replit
```

Math Quest now renders a compact `math-mission` island cue for each puzzle type before answer tapping, and the child-playtest harness verifies the cue is visible and matches one of the supported mission titles. Home Base solo mode now uses a compact dino icon in the selected-companion panel so the mascot does not occlude adventure cards on tablet or mobile. Latest recorded pass: 53 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`. Root typecheck and Replit-routed build also passed.

2026-05-25 Dino Den friend-practice trail pass:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run build:replit
```

Dino Den now gives unlocked friends a short practice loop with Clap Name, Dino Song, Count, and Move actions. The visible three-step friend-practice trail completes with positive feedback, and the child-playtest harness now fails if the Dino Den speech-math practice cue or trail reward disappears. Latest recorded pass: 54 pass, 0 warn, 0 fail. A targeted Playwright tablet capture at `744 x 1133` verified the completed Stegosaurus practice trail with no console errors: `artifacts/dino-math-quest/test-results/child-playtest/dinoden-practice.png`. Replit-routed build also passed.

2026-05-25 Math island visual-scene validation:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run build:replit
```

Math Quest now renders `math-visual-scene` before answer tapping, with child-countable scene items for counting, addition, subtraction, compare, missing-number, and shape prompts. The child-playtest harness now fails if the scene disappears or renders without countable items; the latest observed Math scene was `Dino Island counting scene with 5 items`. Latest recorded pass: 55 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`. Replit-routed build also passed.

2026-05-25 Music Den next-beat clarity and root build harness pass:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build
pnpm run build:replit
```

Music Den now shows a stable `music-next-beat-cue` and marks exactly one expected beat button with `data-next="true"` so repeated patterns such as `clap, clap, stomp` do not rely on adult inference. The child-playtest harness now fails if the first Music beat is not both cue-visible and visibly highlighted. Root `pnpm run build` now routes through the same Dino/Replit wrapper as `pnpm run build:replit`, supplying the required `PORT` and `BASE_PATH` values for workspace Vite packages. Latest recorded pass: 56 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`. Root build and Replit-routed build both passed.

2026-05-25 Math count-trail self-check pass:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest
pnpm run typecheck
pnpm run build
pnpm run build:replit
```

Math Quest countable visual scenes now show small numbered count-trail badges on scene items. Addition continues the trail across both groups, while subtraction only numbers the items left, giving Charlotte a visual self-check before answer tapping without adding a new mode. The child-playtest harness now fails if countable Math scenes lose their count-trail badges. Latest recorded pass: 57 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`. Root typecheck, root build, and Replit-routed build all passed.

2026-05-25 Speech turn-taking cue pass:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
pnpm --filter @workspace/scripts run typecheck
pnpm --filter @workspace/scripts run dino:child-playtest -- --port 25921
pnpm run typecheck
pnpm run build
pnpm run build:replit
```

Say It now shows a compact `speech-turn-cue` with `Dino says`, `Charlotte says`, and `Next dino word` steps so the speech loop communicates turn-taking without adult explanation. The child-playtest harness now fails if the Speech screen loses that Dino/Charlotte turn cue, has no active turn step, starts on the wrong active cue, fails to hand the active cue to `Charlotte says` after a rhythm beat tap, or fails to unlock `Next dino word` after `I Tried`. The app wait guard also refuses non-Dino HTTP 200 responses before browser flow by checking for the Dino Quest Vite entrypoint. The default `25918` port was occupied by an older stale dev server during verification, and port `25920` was occupied by a non-game local service, so the passing child-playtest was rerun on fresh port `25921`. Latest recorded pass: 60 pass, 0 warn, 0 fail. Evidence: `artifacts/dino-math-quest/test-results/child-playtest/report.json`, `tablet-final.png`, and `mobile-home.png`. Root typecheck, root build, and Replit-routed build all passed.
