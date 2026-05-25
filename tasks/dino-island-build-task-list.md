# Dino Island Build Task List

Purpose: Build Dino Island into Charlotte's personalized, tablet-first learning game world while materially improving Math Quest and expanding into spelling, speech, and music adventures.

## Scope Guardrails

- Treat `docs/product-blueprint.md`, `AGENTS.md`, and `docs/team-roster.md` as the durable context entry points.
- Treat `docs/product-blueprint.md` as the product source of truth; use this file for execution order, owners, dependencies, and completion notes once approved.
- If this file conflicts with the blueprint or current user direction, stop and reconcile before implementation.
- Execute tasks in priority order while respecting dependencies.
- Keep child-facing navigation simple, smooth, and tablet-first.
- Preserve existing project conventions and `data-testid` attributes.
- Do not add open-ended AI conversation, punitive speech scoring, ads, accounts, social features, or complex adult menus.
- Voice and music tasks are in normal scope but must not block unrelated Math Quest, spelling, or core architecture tasks.
- If a task is completed, check it off immediately and add completion notes plus sign-off by the responsible team member(s).
- If blocked, leave it unchecked, prefix the title with `[BLOCKED]`, record evidence and needed input, then move to the next unblocked task.

## Continuity Log

- 2026-05-24: Created from orchestrator interview, local repo review, `docs/local-exploration-notes.md`, and `docs/product-blueprint.md`. Current status: not started.
- 2026-05-25: P0-P3 implementation and local release-readiness validation are complete through P3-004 for the current Dino Island foundation. Remaining product work should start from P4 and the blueprint gates, not from stale Replit-era assumptions.
- 2026-05-25: Strategy confidence loop found and fixed two tablet-first layout loopholes before final-gate confidence: Home Base adventure choices and Math Quest answer choices could be pushed below the first iPad viewport by unnecessary `sm:flex-1` growth. Browser recheck now shows Home, Math, Words, Speech, and Music expose the next child action in the first tablet viewport, with remaining confidence gates still external.

## Tasks

### P0 - Preflight, Harness, and Acceptance Bar

- [x] P0-001 Align durable docs and stale Replit guidance
  - Owner(s): Orchestrator
  - Depends on: None
  - Action: Review `AGENTS.md`, `CLAUDE.md`, `replit.md`, `docs/team-roster.md`, and `docs/product-blueprint.md`; patch stale or conflicting guidance so future agents enter through the right files without duplicating product context.
  - Done when: Local instructions identify `artifacts/dino-math-quest` as the child-facing app, `replit.md` no longer misleads future agents toward API-only work, and team docs link to the PRD and task list.
  - Stop/blocked: Stop if guidance changes would alter global Codex/tool configuration; ask the user before touching those files.
  - Completion notes / sign-off: 2026-05-24 Orchestrator reviewed `AGENTS.md`, `CLAUDE.md`, `replit.md`, `docs/team-roster.md`, and `docs/product-blueprint.md`. `AGENTS.md`, `CLAUDE.md`, and the roster already routed agents correctly; `replit.md` was replaced with a concise local import note pointing to `artifacts/dino-math-quest`, the correct run command, validation commands, PRD, roster, and task list. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep Replit-era implementation comments in imported UI files unless they create real confusion; use `replit.md` only as local orientation, not a second product spec.

- [x] P0-002 Create Math Quest 100-point rubric and baseline score
  - Owner(s): Orchestrator, UI/UX Design Thread, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P0-001
  - Action: Create a concise rubric document under `docs/` with 100 total points across the categories in `docs/product-blueprint.md`; score the current Math Quest and define what "10x better" means for each category.
  - Done when: Rubric exists, current score is recorded with evidence, target descriptors are practical, and the first improvement tasks can map back to rubric categories.
  - Stop/blocked: If the app cannot run for baseline scoring, record the run blocker and complete only the rubric structure.
  - Completion notes / sign-off: 2026-05-24 Orchestrator created `docs/math-quest-rubric.md` with 100 total points, a current baseline score of 53/100, evidence references, and practical "10x better" descriptors for each PRD category. Sign-off: Orchestrator.
  - Notes / patterns learned: Math Quest is strongest today in basic math variety and touch target size, weakest in companion integration, repeatable validation, and audio/music-supported learning.

- [x] P0-003 Confirm local run and validation harness
  - Owner(s): QA / Playtest Thread, Code Review Thread
  - Depends on: P0-001
  - Action: Run install only if needed, start the game with the documented PowerShell command, verify tablet and mobile browser smoke flows, and record exact validation commands and URL.
  - Done when: Dev server URL, viewport sizes, smoke flows, console health, typecheck, and build results are recorded in `docs/` or the task notes.
  - Stop/blocked: If dependency or dev-server failures occur, diagnose the smallest local fix before escalating.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `docs/local-validation-harness.md` with install/run/URL/typecheck/build commands and tablet/mobile smoke checklist. Current known status records recent successful app-specific typecheck, build, and browser smoke verification at `http://127.0.0.1:25918/`. Sign-off: Orchestrator.
  - Notes / patterns learned: Real iPad Safari remains the follow-up for audio unlock, safe area, PWA install, and touch feel.

- [x] P0-004 Audit current game architecture for extension points
  - Owner(s): Orchestrator, Code Review Thread
  - Depends on: P0-003
  - Action: Inspect current screens, `GameContext`, `src/lib` content files, audio code, manifest, and routing to identify the smallest architecture changes needed for home base, companions, and multiple learning sections.
  - Done when: A short architecture audit exists with files touched risk, state/persistence implications, and recommended first changes.
  - Stop/blocked: Do not redesign code during audit unless a tiny fix is required to keep the app running.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `docs/architecture-extension-audit.md` covering app/state/content/audio/math entry points, extension seams, risks, and recommended first architecture changes. Sign-off: Orchestrator.
  - Notes / patterns learned: `startLearningArea` should remain the child-facing section entry point; Math adaptive difficulty needs lightweight local session state before deeper progression work.

- [x] P0-005 Research bounded ElevenLabs and voice/music options
  - Owner(s): Researcher Thread
  - Depends on: P0-001
  - Action: Research narrow ElevenLabs API integration patterns for scripted dino voices, generated songs/sounds, latency/cost/safety, browser playback, and parent-approved content generation.
  - Done when: Research notes land under `research/` with recommended integration scope, risks, non-blocking prototype path, and clear "do not use yet" boundaries.
  - Stop/blocked: Do not require this task before non-voice gameplay tasks proceed.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `research/elevenlabs-voice-music-options.md` with official ElevenLabs Text to Speech, streaming, models, and sound effects API references; recommended a parent-approved static asset pipeline and explicitly deferred live child-facing generation. Sign-off: Orchestrator.
  - Notes / patterns learned: Use ElevenLabs as a content production pipeline first, not as a runtime dependency in Charlotte's play loop; keep all scripts reviewed and fallback to synthesized local sounds when assets are missing.

### P1 - Core Architecture and Quick Wins

- [x] P1-001 Fix immediate layout, PWA, and audio reliability issues
  - Owner(s): UI/UX Design Thread, Code Review Thread, QA / Playtest Thread
  - Depends on: P0-003
  - Action: Patch high-confidence issues from local exploration: top-bar/prompt overlap, missing PWA icons or manifest references, mobile web app meta, and Web Audio startup timing.
  - Done when: Tablet and mobile smoke checks show no prompt overlap, no missing-icon console warnings, and audio starts only after a user gesture.
  - Stop/blocked: Defer any item that requires new art assets beyond placeholders; record the deferral.
  - Completion notes / sign-off: 2026-05-24 Orchestrator fixed the puzzle/top-bar overlap, removed missing PWA icon references, added the current mobile web app meta, and gated background audio startup behind a user gesture. Verified with tablet and mobile browser smoke checks showing no console errors/warnings. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep browser audio unlock tied to explicit adventure/start interactions; avoid creating or resuming `AudioContext` during initial render.

- [x] P1-002 Define data schema for family companions, learning sections, speech, and music
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, Code Review Thread
  - Depends on: P0-004
  - Action: Add a coherent content schema plan, then implement the minimal typed structure needed for companions, avatar variants, learning sections, speech prompts, music moments, weighted triggers, difficulty flags, and feature gates.
  - Done when: Schema/types exist, sample content is loaded by the app, and the structure can represent Mama, Dada, River, Gracie, Max, Math, Spelling, Speech, and Music without UI complexity.
  - Stop/blocked: If YAML parsing adds risk, start with typed local data that can migrate cleanly to YAML; record the tradeoff.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added YAML-backed content in `artifacts/dino-math-quest/src/content/dino-island.yaml` plus typed loader/types in `src/content/dinoIslandContent.ts`. It represents companions, avatar variants with weights, four learning sections, speech/music starters, difficulty pacing, and feature flags. Sign-off: Orchestrator.
  - Notes / patterns learned: Runtime YAML parsing uses the app-local `yaml` dependency and Vite `?raw`; this keeps future content edits out of component code.

- [x] P1-003 Add placeholder family companion content
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread
  - Depends on: P1-002
  - Action: Add placeholder slots and simple avatar metadata for Mama, Dada, River, Gracie, and Max, including base home variants and a few learning-area action variants.
  - Done when: Companion data supports 0 or 1 selected companion, variant weights, short labels, and future image replacement without changing game flow.
  - Stop/blocked: Do not attempt likeness generation until family images are provided and the user approves that step.
  - Completion notes / sign-off: 2026-05-24 Orchestrator imported existing family character assets from `C:\Users\melan\Documents\MothersDay_FlipBook26\characters` into `artifacts/dino-math-quest/public/characters` and mapped Mama, Dada, River, Gracie, Max, plus solo mode. Sign-off: Orchestrator.
  - Notes / patterns learned: Mariah maps to Mama and Mark maps to Dada for this app. Gracie and Max currently have baseline-only variants, which is enough for weighted metadata but not final action variety.

- [x] P1-004 Introduce family home base as the session start
  - Owner(s): UI/UX Design Thread, Code Review Thread, QA / Playtest Thread
  - Depends on: P1-002, P1-003
  - Action: Replace or evolve the start screen into a simple home base where Charlotte can start with no companion or choose one companion before selecting a learning area.
  - Done when: The first screen is tablet-friendly, visually obvious, remembers selection if appropriate, and can be navigated with simple reading plus icons.
  - Stop/blocked: Keep interactions simple; defer complex household activity animations if they slow the core flow.
  - Completion notes / sign-off: 2026-05-24 Orchestrator replaced the start-only home screen with Family Home Base: Charlotte can pick no companion or one companion, then choose an adventure. The selected companion persists in game state. Sign-off: Orchestrator.
  - Notes / patterns learned: The first version keeps household activity simple and uses existing assets; richer subtle activity variants can be layered through YAML without changing the flow.

- [x] P1-005 Add Dino Island section selection
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P1-004
  - Action: Add a calm Dino Island selection screen or home-base island map with Math, Spelling, Speech, and Music areas, using stable icons and short labels.
  - Done when: Charlotte can choose a learning area without adult explanation after first use, and Math Quest remains the most complete path.
  - Stop/blocked: Do not add more than the initial four areas unless a later task approves it.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added four section choices: Math, Words, Say It, and Music. Math enters the current playable game; other sections route to a simple preview screen instead of dead-ending. Sign-off: Orchestrator.
  - Notes / patterns learned: Section selection is data-driven by `learningAreas`; future sections should extend YAML first, then add the corresponding playable screen.

- [x] P1-006 Refactor navigation/state for multiple adventures
  - Owner(s): Code Review Thread, Orchestrator
  - Depends on: P1-004, P1-005
  - Action: Update game state and routing/screen flow so each learning section can preserve progress, return home, and use companion context without brittle conditionals.
  - Done when: Math, placeholder Spelling, placeholder Speech, and placeholder Music can be entered/exited predictably and persisted state remains compatible or migrates cleanly.
  - Stop/blocked: Ask before intentionally breaking existing localStorage progress; otherwise add a small migration/defaulting layer.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `selectedLearningAreaId`, companion selection state, defaulting for older saved state, routes for Math, Spelling, Speech, and Music, and direct Home returns from each adventure. Tablet browser smoke verified Math enter/return plus Words, Say It, and Music entry without console errors. Sign-off: Orchestrator.
  - Notes / patterns learned: New non-math adventures should enter through `startLearningArea` so audio unlock and selection persistence remain consistent.

### P1 - Math Quest 10x Pass

- [x] P1-007 Build Math Quest improvement plan from rubric
  - Owner(s): Orchestrator, UI/UX Design Thread, Learning Design / Curriculum Thread
  - Depends on: P0-002, P0-004
  - Action: Translate the rubric baseline into a sequenced Math Quest improvement plan covering layout, visuals, puzzle variety, rewards, story, adaptive difficulty, audio, companions, and validation.
  - Done when: Improvement tasks are specific enough to implement without re-litigating scope and can be scored against the rubric.
  - Stop/blocked: If the rubric exposes too much work for one pass, split into quick wins and deeper iterations.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `docs/math-quest-improvement-plan.md`, mapping the rubric baseline into immediate Math Quest quick wins and the next deeper puzzle/adaptive/reward pass. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep the first Math improvement slice small enough to browser-verify now: tablet presentation, warmer feedback, faster first reward, and companion presence.

- [x] P1-008 Improve Math Quest tablet-native presentation
  - Owner(s): UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P1-007
  - Action: Make Math Quest feel intentional on iPad portrait while still working on mobile, with larger useful art, stable spacing, clear prompt hierarchy, and large answer targets.
  - Done when: Tablet viewport no longer feels like an accidental narrow phone frame unless intentionally chosen, and mobile remains clean.
  - Stop/blocked: Avoid decorative layout complexity that slows gameplay or hides the puzzle.
  - Completion notes / sign-off: 2026-05-24 Orchestrator verified the Math Quest tablet-native pass already in the current app: wide tablet layout, stable prompt/header spacing, companion side panel, large answer targets, and mobile fallback. Browser verification used `820 x 1180` tablet portrait and `390 x 844` mobile portrait at `http://127.0.0.1:25918/` with no console warnings/errors after fresh navigation. Sign-off: Orchestrator.
  - Notes / patterns learned: The tablet layout now feels intentional rather than like a narrow phone frame; keep future puzzle additions inside the existing prompt/visual/answer regions so controls stay predictable.

- [x] P1-009 Expand Math Quest puzzle variety and progression
  - Owner(s): Learning Design / Curriculum Thread, Code Review Thread
  - Depends on: P1-007
  - Action: Add or revise math content to better support fluency, visual quantities, patterns, number sense, and silent difficulty fallback for a cognitively advanced 4-year-old.
  - Done when: Puzzle data and generation produce more varied sessions, avoid repeated friction, and keep wrong answers recoverable.
  - Stop/blocked: Update coupled `biomes.ts`, `dinos.ts`, and `puzzles.ts` together when progression changes require it.
  - Completion notes / sign-off: 2026-05-24 Orchestrator expanded `src/lib/puzzles.ts` with support/steady/stretch difficulty bands, counting, missing-number, and compare-number puzzle types, plus broader addition/subtraction ranges. `GameContext` now silently moves the next puzzle toward support after repeated misses and stretch after a correct streak. Verified with app-specific typecheck, env-backed production build, and browser play through a wrong answer plus correct answer. Sign-off: Orchestrator.
  - Notes / patterns learned: Silent adaptation is intentionally session-local for now; it improves moment-to-moment pacing without adding adult settings or persistent tracking complexity.

- [x] P1-010 Strengthen Math Quest feedback and reward loop
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread
  - Depends on: P1-007, P1-009
  - Action: Improve correct and incorrect answer feedback, early reward timing, Dino Den motivation, effort reinforcement, and "almost there" progress signals.
  - Done when: Wrong answers remain safe, correct answers feel rewarding but not slow, and a first-session reward happens quickly enough for short sessions.
  - Stop/blocked: Avoid animations or reward sequences that interrupt play for too long.
  - Completion notes / sign-off: Implemented a first-unlock `dino-reward` screen, early Stegosaurus reward path, "More Math" continuation, Dino Den route, companion-reactive feedback lines, and next-friend progress signal. Verified by Orchestrator on 2026-05-25 with `pnpm --filter @workspace/dino-math-quest run typecheck`, `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build`, and Playwright tablet/mobile checks at `http://127.0.0.1:25918/?reward_pass=1`.
  - Notes / patterns learned: A short explicit unlock screen gives the reward moment room to land without turning every correct answer into a long interruption. The next-friend progress card keeps motivation visible during normal puzzles.

- [x] P1-011 Add companion participation to Math Quest
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread
  - Depends on: P1-003, P1-006, P1-010
  - Action: Let the selected companion appear in Math Quest through simple avatar moments, encouragement, or task-relevant flavor without crowding the puzzle.
  - Done when: 0 companion and 1 companion paths both work, companion variants can trigger by weight, and gameplay remains smooth.
  - Stop/blocked: Use placeholders rather than blocking on final family avatars.
  - Completion notes / sign-off: Selected companion now appears in Math Quest with weighted YAML-backed variants, task-relevant helper copy, correct/retry reactions, and lightweight motion. Verified by Orchestrator on 2026-05-25 with Mama selected in tablet and mobile Math Quest flows, including post-reward continuation.
  - Notes / patterns learned: Keep the companion as a supportive side presence on tablet and stacked helper panel on mobile; it adds warmth without competing with the answer buttons.

- [x] P1-012 Re-score Math Quest against the 100-point rubric
  - Owner(s): Orchestrator, Code Review Thread, QA / Playtest Thread
  - Depends on: P1-008, P1-009, P1-010, P1-011
  - Action: Re-run the rubric, compare baseline to current state, and identify remaining gaps before broadening scope.
  - Done when: Rubric document records before/after scores, validation evidence, and remaining highest-value improvements.
  - Stop/blocked: Do not declare the 10x pass done if tablet playtest reveals layout, lag, or navigation problems.
  - Completion notes / sign-off: 2026-05-25 Orchestrator updated `docs/math-quest-rubric.md` with a current post-P1 score of 71/100, preserving the original 53/100 baseline. Evidence included source inspection plus Playwright Chromium smoke at tablet `820 x 1180` and mobile `390 x 844`: Home loaded, Mama companion selection worked, Math opened, positive retry feedback appeared, the first dino reward appeared, and console warnings/errors were empty. Sign-off: Orchestrator.
  - Notes / patterns learned: The P1 Math pass materially improved the experience, especially tablet layout, puzzle variety, early reward, and companion integration. Remaining Math leverage is optional prompt/rhythm audio, a richer Dino Den practice space, bespoke non-emoji visuals, repeatable QA, and real iPad Safari validation.

### P1 - Spelling, Speech, and Music Foundations

- [x] P1-013 Define spelling progression and first content set
  - Owner(s): Learning Design / Curriculum Thread, Researcher Thread
  - Depends on: P1-002
  - Action: Define first spelling activities around simple words, letter sounds, phonics, Charlotte's name, and family names, with difficulty that can advance faster than speech.
  - Done when: A compact content plan and initial data set exist for a playable first spelling section.
  - Stop/blocked: Avoid large curriculum documents; keep enough detail to implement and test.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `docs/audio-music-speech-spec.md` and YAML-backed `spellingWords` starter content in `artifacts/dino-math-quest/src/content/dino-island.yaml`, covering DINO, MAMA, MAX, WOW, LION, and RIVER across support/steady/stretch levels. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep spelling content data-driven so family words, letter sounds, and difficulty can advance faster than speech without changing screen code.

- [x] P1-014 Build first playable Spelling Adventure
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread, Code Review Thread, QA / Playtest Thread
  - Depends on: P1-005, P1-006, P1-013
  - Action: Implement a first spelling adventure with simple word/letter tasks, large tap targets, visual choices, gentle feedback, and companion compatibility.
  - Done when: Charlotte can enter Spelling from Dino Island, complete a short session, receive rewards/feedback, and return home.
  - Stop/blocked: Keep the first version narrow rather than adding too many spelling modes.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `SpellingAdventureScreen` with large letter buttons, family/dino word prompts, gentle retry feedback, companion context, and a Home return button. Browser smoke verified entry from Dino Island and visible letter controls. 2026-05-25 Orchestrator migrated starter words to YAML content and Playwright-verified tablet flow: Words opens, YAML clue appears, D-I-N-O completes, and Next Word enables. Sign-off: Orchestrator.
  - Notes / patterns learned: First spelling pass is intentionally narrow; next iteration should connect rewards/progress and improve phonics sequencing. Service worker cache can preserve stale HMR failures during local verification; unregister/clear cache before treating a blank screen as current runtime state.

- [x] P1-015 Define speech practice interaction rules and first content set
  - Owner(s): Learning Design / Curriculum Thread, Researcher Thread
  - Depends on: P1-002
  - Action: Define gentle speech moments using "say it with me", help-the-dino-say-it framing, syllable breaks, rhythm, `L`/`W` support, one retry maximum, and participation-only reinforcement.
  - Done when: A speech interaction spec and starter prompt data exist without requiring voice recognition.
  - Stop/blocked: Do not add correctness scoring or discouraging recognition messages.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `docs/audio-music-speech-spec.md` and expanded YAML `speechMoments` with positive-only rules, syllable beats, one-retry maximum, no pronunciation judging, and starter focus on `L`, `W`, and family-name practice. Sign-off: Orchestrator.
  - Notes / patterns learned: Speech should be participation-first and optional; use "help Dino" and "say it with me" framing, never "I can't understand you" or correctness scoring.

- [x] P1-016 Build first playable Speech Adventure without recognition dependency
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P1-005, P1-006, P1-015
  - Action: Implement a first speech adventure based on short modeled phrases, rhythm taps/beat dots, optional repetition, and positive participation feedback.
  - Done when: Charlotte can play speech moments without the app needing to judge her pronunciation, and silent use still remains positive.
  - Stop/blocked: Defer microphone work if it risks blocking the playable static/scripted experience.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `SpeechAdventureScreen` using scripted rhythm prompts from YAML, beat buttons, one positive retry path, and no microphone/pronunciation judging dependency. Browser smoke verified entry and visible "I Tried" participation control. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep speech practice opt-in and participation-first until the voice participation prototype proves it can stay encouraging.

- [x] P1-017 Define music and song interaction approach
  - Owner(s): Learning Design / Curriculum Thread, Researcher Thread, UI/UX Design Thread
  - Depends on: P1-002, P0-005
  - Action: Define how music supports learning: short jingles, call-and-response, dino songs, rhythm cues, and section-specific audio personality, with feature gates for AI-generated assets.
  - Done when: A practical music spec exists with immediate non-AI implementation options and later ElevenLabs/AI paths.
  - Stop/blocked: Do not block other sections on AI-generated songs.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `docs/audio-music-speech-spec.md`, `research/elevenlabs-voice-music-options.md`, and YAML-backed `musicPatterns` for Dino Stomp, Wow Song, and Count Beat. The spec defines immediate non-AI tones/rhythm interactions plus a later static ElevenLabs asset path. Sign-off: Orchestrator.
  - Notes / patterns learned: Music should stay short, rhythmic, and interruptible; AI-generated songs/sounds must remain non-blocking and reviewed before entering Charlotte's runtime.

- [x] P1-018 Build first playable Music/Song Den
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P1-005, P1-006, P1-017
  - Action: Implement a simple music area with a small set of scripted songs/sounds or rhythm interactions tied to learning and fun.
  - Done when: Charlotte can enter Music, trigger clear audio/rhythm interactions after user gesture, and return home without audio glitches.
  - Stop/blocked: Keep audio assets simple if custom generation is not ready.
  - Completion notes / sign-off: 2026-05-24 Orchestrator added `MusicDenScreen` with three simple rhythm patterns, a tiny generated song cue, large beat buttons, companion context, and a Home return button. Browser smoke verified entry and the song control without console warnings. 2026-05-25 Orchestrator migrated starter patterns to YAML and Playwright-verified tablet/mobile flow: Music opens to Dino Stomp, beat buttons are large, clap-clap-stomp enables Next Beat, and current console has no warnings/errors. Sign-off: Orchestrator.
  - Notes / patterns learned: The first version uses synthesized tones only; ElevenLabs/custom songs remain feature-flagged and non-blocking. Keep rhythm content in YAML so music can reinforce math, spelling, and speech areas without hard-coded screen changes.

### P2 - Personalization, Configuration, and AI Prototypes

- [x] P2-001 Add minimal adult configuration surface
  - Owner(s): UI/UX Design Thread, Orchestrator, Code Review Thread
  - Depends on: P1-002, P1-005
  - Action: Add or define a minimal configuration entry point for adult-controlled difficulty/focus toggles without making Charlotte's UI complex.
  - Done when: Adults can understand where configuration will live, and the child-facing path remains simple.
  - Stop/blocked: It does not need to be hidden, but stop if the settings flow starts to dominate the main experience.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added a minimal `Grown-up Controls` section inside the existing settings modal, keeping Charlotte's Home Base flow unchanged. Adults can set Math pace (`Ready`/balanced, Gentle, Stretch), Speech support (Steady or Light), and Music cues on/off; settings persist in localStorage and are preserved when progress is reset. Math pace is wired into the existing silent Math difficulty thresholds. Verified with app-specific typecheck and Playwright tablet/mobile settings smoke: settings opened, toggles worked, values persisted, and console warnings/errors were empty. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep adult controls in the existing settings entry point for now. `Ready` maps to the internal `balanced` math pace. Speech support and music cues are intentionally stored first; P2-002/P2-004/P2-005 should wire them into spelling/speech/music behavior without blocking unrelated work.

- [x] P2-002 Implement silent adaptive difficulty foundations
  - Owner(s): Learning Design / Curriculum Thread, Code Review Thread, QA / Playtest Thread
  - Depends on: P1-009, P1-013, P1-015
  - Action: Add lightweight difficulty tracking and fallback behavior for math and spelling while keeping speech gentle and participation-based.
  - Done when: Repeated misses or friction can lower difficulty without visible failure messaging, and quick success can unlock harder content.
  - Stop/blocked: Avoid overfitting or heavy analytics; keep local-first and maintainable.
  - Completion notes / sign-off: 2026-05-25 Orchestrator completed the local-first adaptive foundation. Math already adapts session difficulty through streak thresholds, now influenced by the adult Math pace setting. Spelling now starts with support words, advances to harder word groups after quick success, and quietly falls back to support after a wrong sequence without visible failure messaging. Speech remains participation-based with no pronunciation scoring. Verified with app-specific typecheck and Playwright tablet spelling flow: DINO then MAMA advanced to steady WOW, a wrong tap fell back to support DINO, and console warnings/errors were empty. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep this adaptation invisible and session-local until the product needs durable parent-visible progress. Speech difficulty should stay decoupled from math/spelling challenge; future voice participation should adjust prompt frequency/support, not judge correctness.

- [x] P2-003 Prepare family image ingestion and avatar replacement workflow
  - Owner(s): UI/UX Design Thread, Orchestrator
  - Depends on: P1-003
  - Action: Define where family source images should go, what generated/avatar outputs are expected, naming conventions, consent/approval steps, and how placeholders are replaced.
  - Done when: The workflow is documented and placeholder assets can be swapped without code restructuring.
  - Stop/blocked: Do not generate family likenesses until the user provides images and approves the approach.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `docs/family-avatar-workflow.md` documenting raw source-photo handling, approved runtime asset location, naming conventions, YAML replacement steps, consent/approval rules, output targets, and tablet validation. Added a narrow `.gitignore` entry for `private-family-source/` so raw family source/staging files stay local unless explicitly approved. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep raw family photos out of the repo by default. The YAML companion variant layer is already the right replacement point, so future avatar work should add approved assets and update weights/labels without restructuring code.

- [x] P2-004 Prototype bounded voice participation behind a feature flag
  - Owner(s): Researcher Thread, Code Review Thread, QA / Playtest Thread
  - Depends on: P0-005, P1-015, P1-016
  - Action: Explore a narrow microphone or voice participation prototype that can detect attempt/silence in a scripted flow without correctness scoring.
  - Done when: Prototype is feature-flagged, off by default if risky, and documented with browser/iPad limitations.
  - Stop/blocked: Stop if latency, permissions, recognition quality, or UX risk would discourage Charlotte.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added a browser-native microphone attempt detector in `src/lib/voiceParticipation.ts` and wired it into Speech Adventure only when YAML `featureFlags.liveVoiceParticipation` is enabled. The flag remains off by default, `I Tried` remains the safe path, and the prototype detects only attempt/quiet/unavailable without recognition, transcription, or correctness scoring. Added `docs/voice-participation-prototype.md` with behavior, child-experience rules, iPad limitations, and validation path. Verified default-off Speech flow with Playwright tablet smoke, app-specific typecheck, and build. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep voice participation dormant until real iPad Safari testing with an adult present confirms the microphone prompt improves confidence rather than creating friction.

- [x] P2-005 Prototype approved AI song or dino voice generation path
  - Owner(s): Researcher Thread, UI/UX Design Thread, Code Review Thread
  - Depends on: P0-005, P1-017
  - Action: Build or document a narrow parent-approved pipeline for generated songs, dino phrases, or sound assets, with static asset fallback.
  - Done when: The prototype path is clear, bounded, and does not require live AI generation during Charlotte gameplay.
  - Stop/blocked: Do not ship live network-dependent generation into the child flow without explicit approval.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added a parent-reviewed ElevenLabs static audio pipeline with `scripts/audio/elevenlabs-audio-manifest.json`, `scripts/src/audio/elevenlabsGenerator.ts`, `pnpm --filter @workspace/scripts run elevenlabs:audio`, `artifacts/dino-math-quest/public/audio/manifest.json`, runtime approved-asset playback/fallback in `src/lib/audio.ts`, and `docs/elevenlabs-static-audio-pipeline.md`. Initial candidate phrases/sounds are intentionally unapproved, so no live child-flow network generation or unreviewed audio ships. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep ElevenLabs server-side and parent-reviewed. Generated assets become normal static files only after explicit gameplay approval; synthesized local tones remain the reliable fallback.

- [x] P2-006 Expand Dino Den into a confidence and practice space
  - Owner(s): UI/UX Design Thread, Learning Design / Curriculum Thread
  - Depends on: P1-010, P1-015, P1-017
  - Action: Let unlocked dinos support optional practice: names, syllable breaks, short facts, songs, and confidence interactions.
  - Done when: Dino Den adds value beyond collection while staying simple and non-blocking.
  - Stop/blocked: Avoid turning Dino Den into a dense menu.
  - Completion notes / sign-off: Completed 2026-05-25 by Orchestrator with UI/UX and Learning Design scope applied. Added per-dino practice metadata, a selected-dino practice panel, rhythmic name clap, short song, and counting prompt controls. Validation: `pnpm --filter @workspace/dino-math-quest run typecheck`; `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build`; Playwright tablet viewport `834x1112` at `http://127.0.0.1:25918/?verify=dino-den-practice-fresh` and `?verify=dino-den-empty`; no console warnings/errors.
  - Notes / patterns learned: Keep Dino Den practice-first and collection-second on tablet because the collection grid gets long quickly. The empty state should appear before locked cards so a child gets a clear next step without reading through the grid.

### P2 - Validation, Review, and Release Readiness

- [x] P2-007 Add repeatable QA playtest scripts/checklists
  - Owner(s): QA / Playtest Thread, Code Review Thread
  - Depends on: P1-014, P1-016, P1-018
  - Action: Create a concise checklist or script for tablet and mobile playtests across Home Base, Math, Spelling, Speech, Music, Dino Den, settings/config, and persistence.
  - Done when: Future agents can rerun the same flows and record pass/fail notes without guessing.
  - Stop/blocked: Keep it practical; do not build a large test bureaucracy.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `docs/qa-playtest-checklist.md`, a practical repeatable tablet/mobile playtest checklist covering Home Base, Math, Spelling, Speech, Music, Dino Den, grown-up controls, persistence, pass gates, state seeds, evidence format, and real iPad Safari follow-up. Linked it from `docs/local-validation-harness.md`. Verified by readback; no runtime validation was needed because this slice changed docs only. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep QA evidence lightweight but consistent: exact URL, viewport, state seed, pass/fail per flow, console/request failures, screenshots, and final recommendation.

- [x] P2-008 Run full code review pass across completed scope
  - Owner(s): Code Review Thread
  - Depends on: P1-012, P1-014, P1-016, P1-018
  - Action: Review changed files for regressions, state bugs, audio lifecycle issues, accessibility/touch issues, content coupling, performance, and maintainability.
  - Done when: Findings are ordered by severity with file/line references, and material issues are fixed or recorded as explicit follow-ups.
  - Stop/blocked: Do not broaden review into aesthetic redesign unless it creates real usability or implementation risk.
  - Completion notes / sign-off: 2026-05-25 Orchestrator reviewed the completed Charlotte-facing app scope across game state, Math Quest, Home Base, spelling, speech, music, Dino Den, reward screens, settings, audio, voice-attempt detection, puzzle generation, and Dino Island content. Fixed a medium-severity Math Quest delayed-transition race in `artifacts/dino-math-quest/src/context/GameContext.tsx` so correct-answer progress still records while explicit navigation during the reward beat is preserved. Added ordered findings and follow-ups in `docs/code-review-p2-scope.md`. Verified with `pnpm --filter @workspace/dino-math-quest run typecheck`. Sign-off: Orchestrator acting as Code Review Thread.
  - Notes / patterns learned: Delayed child-facing reward transitions should not override explicit navigation; record progress separately from route changes when the user has moved to a different screen.

- [x] P2-009 Run full browser validation on tablet and mobile
  - Owner(s): QA / Playtest Thread
  - Depends on: P2-008
  - Action: Run the app locally and play through the major flows on tablet portrait and mobile portrait, checking console, layout, navigation, audio, persistence, and smoothness.
  - Done when: Validation notes include exact URL, viewport sizes, browser/tool, flows exercised, issues found, and final pass/fail recommendation.
  - Stop/blocked: Any blank screen, runtime overlay, severe layout overlap, or blocking lag prevents release readiness.
  - Completion notes / sign-off: 2026-05-25 Orchestrator acting as QA / Playtest Thread used Playwright Chromium against the running app at `http://127.0.0.1:25918/`. Tablet validation used `834 x 1112` at `?playtest=2026-05-25-p2-009`; mobile validation used `390 x 844` at `?playtest=2026-05-25-p2-009-mobile-final`. Exercised Home Base, Mama companion selection, Math wrong/correct flow, Spelling DINO completion, Speech rhythm beat plus `I Tried`, Music song plus beats, Dino Den empty state, seeded Stegosaurus practice, grown-up controls persistence, and return-home navigation. Console check returned no errors or warnings. Recommendation: pass for local release-readiness with real iPad Safari still required before treating the experience as device-proven. Sign-off: Orchestrator.
  - Notes / patterns learned: Mobile Home Base works but the lower Say It/Music row can require a slight scroll on `390 x 844`; acceptable now, worth tuning after real device play. Math Home is reachable by visible text, but does not currently have a dedicated `data-testid`, so future automated checks should either use accessible text or add a stable test id.

- [x] P2-010 Run final typecheck and build
  - Owner(s): Code Review Thread, Orchestrator
  - Depends on: P2-008
  - Action: Run `pnpm run typecheck` and `pnpm run build` from repo root after the completed scope.
  - Done when: Both commands pass, or failures are documented with precise cause and owner.
  - Stop/blocked: Do not declare completion with failing validation unless the user explicitly accepts the blocker.
  - Completion notes / sign-off: 2026-05-25 Orchestrator ran `pnpm run typecheck` from the repo root; it passed across libs, `artifacts/dino-math-quest`, `artifacts/api-server`, `artifacts/mockup-sandbox`, and `scripts`. Then ran `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build`; it passed after rerunning typecheck and building mockup sandbox, API server, and Dino Math Quest. Sign-off: Orchestrator.
  - Notes / patterns learned: Keep the root validation command as the final gate because it catches supporting package drift outside the Charlotte-facing app.

- [x] P2-011 Update handoff docs and next-iteration recommendations
  - Owner(s): Orchestrator
  - Depends on: P2-009, P2-010
  - Action: Update `docs/product-blueprint.md`, `docs/team-roster.md`, rubric, exploration notes, and this task list with completion status, decisions, and recommended next iteration.
  - Done when: A fresh agent can understand what shipped, what remains, and where to continue without rereading the whole chat.
  - Stop/blocked: Keep docs concise; avoid duplicating large findings across files.
  - Completion notes / sign-off: 2026-05-25 Orchestrator updated the product blueprint, team roster, local validation harness, Math Quest rubric, local exploration notes, and this task list with current implementation status, validation evidence, and recommended next iteration. Sign-off: Orchestrator.
  - Notes / patterns learned: The next useful loop is not more harness work; it is real iPad Safari playtest plus child-observation tuning, then approved audio/avatar polish and deeper content variety.

### P3 - Personalization and Control Wiring

- [x] P3-001 Extend section-specific companion participation and wire existing adult controls
  - Owner(s): Orchestrator, UI/UX Design Thread, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P1-003, P1-014, P1-016, P1-018, P2-001
  - Action: Add companion action variants for Words, Say It, and Music; make those variants visible in each section; connect Speech support and Music cues controls to actual play behavior.
  - Done when: 0/1 companion structure remains intact, section-specific companion labels render, Speech Light removes the extra retry prompt, Music cues off creates quieter visual play, and tablet/mobile walkthrough passes.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added section-specific YAML companion action variants for all companions, a shared content helper, and screen wiring in Spelling, Speech, Music, Math, and Dino Den. Speech Light now praises on first try; Music cues off suppresses rhythm/song cues while preserving visual play. Validation: app typecheck/build passed and Playwright tablet `834 x 1112` plus mobile `390 x 844` walkthrough passed with no console issues. Sign-off: Orchestrator.
  - Notes / patterns learned: Existing controls must change child-facing behavior, not just persist settings. Keep companion copy short and visible in the adventure header so it adds warmth without becoming another instruction screen.

- [x] P3-002 Expand Words into phonics and rhythm practice
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P1-014, P2-002, P3-001
  - Action: Add spelling content fields and child-facing controls for sound cues, syllable/rhythm cues, family-name words, and longer-word tablet layout while preserving the existing adaptive spelling flow.
  - Done when: Words includes phonics/rhythm prompt data, Charlotte can trigger large Sound and Clap Word controls, longer words fit cleanly on tablet, and typecheck plus browser smoke pass.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `sayPrompt` and `rhythm` fields to spelling content, expanded Words with Charlotte, Gracie, and Count, added synthesized Sound and Clap Word controls, and changed the word tile grid to handle longer words with stable columns. Fixed the adaptive progression loop so each difficulty band finishes its available words before moving up. Validation: `pnpm --filter @workspace/dino-math-quest run typecheck` passed; `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build` passed; Playwright tablet `834 x 1112` completed DINO, MAMA, MAX, WOW, LION, GRACIE, RIVER, and CHARLOTTE with no console errors/warnings; Playwright mobile `390 x 844` confirmed Sound, Clap Word, first letter, and Home controls visible with no console errors/warnings. Sign-off: Orchestrator.
  - Notes / patterns learned: Words can now bridge spelling and speech practice without microphone scoring or adult-led explanation. Keep the controls short and concrete so Charlotte can learn them by icon/text memory after first use. Browser verification is useful for catching progression reachability bugs, not just layout issues.

- [x] P3-003 Tighten Home Base mobile navigation and Music Den ordered rhythm
  - Owner(s): Orchestrator, UI/UX Design Thread, QA / Playtest Thread, Code Review Thread
  - Depends on: P2-008, P2-009, P3-001
  - Action: Resolve the known mobile Home Base visibility/test-hook follow-ups and make Music Den pattern play validate ordered rhythm rather than tap count.
  - Done when: All four Home Base adventures are visible without first-screen scroll on `390 x 844`, Math Home has a stable test id, Music positively resets out-of-order beats, and ordered completion enables `Next Beat`.
  - Completion notes / sign-off: 2026-05-25 Orchestrator compacted mobile Home Base sizing, added `data-testid="button-math-home"`, and changed Music Den to ordered beat validation with positive retry copy and progress dots. Validation: app typecheck/build passed; Playwright Chromium mobile CSS `390 x 844` and tablet CSS `820 x 1180` verified Home Base visibility; Math Home test id; Music wrong-order reset and correct-order unlock; no console warnings/errors. Sign-off: Orchestrator.
  - Notes / patterns learned: Use cache-busted URLs when verifying Vite UI changes in a long-lived browser session. Keep Music Den as a pattern game with positive reset language rather than correctness/failure language.

- [x] P3-004 Make Home Base companion activity variants visible
  - Owner(s): Orchestrator, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P1-003, P3-001, P3-003
  - Action: Use the existing YAML home variant weights to make the selected companion panel visibly show the current family helper activity/avatar without adding a menu.
  - Done when: Companion tile labels and selected helper panel use stable variant selection, selected family imagery appears in the Home Base panel, all four adventures remain visible on mobile, and typecheck/build/browser smoke pass.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added deterministic weighted variant picking in `dinoIslandContent.ts` and wired Home Base companion buttons plus the selected helper panel to the same stable home variant key. Mobile Playwright CSS `390 x 844` verified Mama's tile and selected panel both showed `Mama is carrying River.`, the selected image rendered, all four adventures remained visible without scrolling, and console warnings/errors were empty. App-specific typecheck/build passed. Sign-off: Orchestrator.
  - Notes / patterns learned: Weighted home variants should feel like warm family presence, not a separate activity system. Keep the child-facing output to one short activity line plus image so it does not compete with the adventure choices.

### P4 - Blueprint Closure Gates and Deeper Variety

- [x] P4-001 Add the next unblocked speech/music/words variety pass
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P3-002, P3-003
  - Action: Add more L/W, family, and rhythm content while keeping the child-facing flow simple and making Speech participation more intentional before advancing.
  - Done when: Speech offers more gentle L/W practice prompts, Words includes more high-context L/W words, Music has more short ordered patterns, Speech `Next` waits for participation, and tablet/mobile child-style verification passes.
  - Completion notes / sign-off: 2026-05-25 Orchestrator expanded YAML content with `WE`, `LOVE`, `WALK`, additional L/W speech prompts, and two music patterns. Speech Adventure now enables `Next` only after `I Said It` or a feature-flagged detected attempt, while preserving positive fallback copy and no pronunciation scoring. Validation: app-specific typecheck/build passed; root `pnpm run typecheck` passed; root build passed when run with `$env:PORT='25918'; $env:BASE_PATH='/'`. Playwright tablet `834 x 1112` verified Home Base, Speech participation gating, Words DINO-to-MAMA progression, and Music ordered pattern progression; mobile `390 x 844` verified no horizontal overflow and Speech next-step clarity; current console errors/warnings were empty after clean reload. Sign-off: Orchestrator.
  - Notes / patterns learned: A light participation gate supports speech confidence better than a free skip, but it must stay easy to satisfy and never judge clarity.

- [ ] P4-002 Run real iPad Safari release-candidate playtest
  - Owner(s): QA / Playtest Thread, Orchestrator, Adult tester
  - Linear: MEM-39
  - Depends on: P4-001
  - Action: Repeat the core QA checklist on a real iPad in Safari and, if relevant, installed PWA mode.
  - Done when: Notes cover safe areas, scroll feel, touch immediacy, audio unlock, PWA behavior, and whether Charlotte can identify the next tap within 1-2 seconds.
  - Stop/blocked: This requires physical device access; continue other unblocked work until an adult can run or supervise the device test.
  - Progress notes: 2026-05-25 Orchestrator strengthened the repeatable Playwright child-flow harness as a surrogate pre-check while physical iPad access is pending. The harness now records first-viewport fit, obvious next tap, horizontal overflow, touch target, positive speech-copy, and core flow evidence across tablet and mobile. Validation passed with 30 pass, 0 warn, 0 fail and artifacts under `artifacts/dino-math-quest/test-results/child-playtest/`. Added matching Linear API evidence comment `138445f8` on MEM-39. This task remains open because real iPad Safari/PWA/audio-unlock feel still requires the physical device.
  - Progress notes: 2026-05-25 Orchestrator added `pnpm --filter @workspace/scripts run dino:ipad-server`, which starts the same local Dino dev server and prints LAN URLs for iPad Safari on the same Wi-Fi network. Updated `docs/qa-playtest-checklist.md` with the helper command and evidence flow. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:ipad-server -- --print-only`, and root `pnpm run typecheck`. Added matching Linear API evidence comment `daccc7e3` on MEM-39. This task remains open pending actual physical iPad Safari/PWA/audio-unlock observations.

- [ ] P4-003 Parent-review and approve the starter ElevenLabs audio set
  - Owner(s): Orchestrator, Researcher Thread, QA / Playtest Thread, Adult reviewer
  - Linear: MEM-40
  - Depends on: P2-005
  - Action: Review candidate scripts in `scripts/audio/elevenlabs-audio-manifest.json`, generate only explicitly approved assets, then approve only audio that fits the Montessori-calm plus Sesame-like tone.
  - Done when: Approved static assets are generated, referenced by the public manifest, heard in game after user gestures, and documented with parent review notes.
  - Stop/blocked: Do not expose unreviewed generated audio to Charlotte's gameplay.
  - Progress notes: 2026-05-25 Orchestrator used Context7 to verify current ElevenLabs JS SDK usage, added `pnpm --filter @workspace/scripts run elevenlabs:review`, generated `docs/audio-parent-review.md`, and hardened the generator so `approved_for_gameplay` fails if the referenced generated file is missing. Dry-run review refreshed the public manifest with 0 approved gameplay assets, and root `pnpm run typecheck` plus `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build` passed. This task remains open pending parent approval, generation, listening review, and runtime gameplay verification.
  - Progress notes: 2026-05-25 Orchestrator added manifest validation for duplicate ids, unsafe output paths, missing required text/prompts, overlong cue durations, and gameplay approval without generation approval. `docs/audio-parent-review.md` now includes the safe approval/generation/listening sequence. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run elevenlabs:review`, `pnpm run typecheck`, and `pnpm run build:replit`. Browser checks at tablet `834 x 1112` and mobile `390 x 844` confirmed the app renders with public audio manifest `assets: []` and no console warnings/errors. Still open pending adult approval, generation, listening review, and runtime verification with approved assets.
  - Progress notes: 2026-05-25 Orchestrator rechecked the installed `@elevenlabs/elevenlabs-js@2.49.1` SDK against Context7 and local types. TTS, sound-effects, and music request fields match the installed SDK; Context7's music example uses `durationSeconds`, but the installed current package type serializes `musicLengthMs`, so no code patch was needed. Re-ran `pnpm --filter @workspace/scripts run elevenlabs:review`; it kept the public manifest at 0 approved gameplay assets and regenerated the parent worksheet.
  - Progress notes: 2026-05-25 Orchestrator hardened the child-facing audio manifest loader so a transient manifest fetch failure can retry later in the same session, and runtime playback now ignores malformed/unapproved/public-path-unsafe manifest entries. Validation passed: `pnpm --filter @workspace/scripts run elevenlabs:review`, `pnpm run typecheck`, `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build`, and `pnpm run build:replit`. Playwright tablet `834 x 1112` verified Home Base, Math answer flow, public audio manifest HTTP 200 with `assets: []`, and no console warnings/errors. This remains open pending parent-approved generated audio and listening/runtime verification with approved assets.
  - Progress notes: 2026-05-25 Orchestrator added public audio manifest safety validation to the repeatable child-playtest harness. The harness now fetches `/audio/manifest.json` during tablet flow and fails if child-facing assets are missing approval, use unsafe paths, use unsupported kinds, or are not generated `.mp3` files under `/audio/generated/`. Validation passed: `pnpm --filter @workspace/scripts run typecheck` and `pnpm --filter @workspace/scripts run dino:child-playtest` with 41 pass, 0 warn, 0 fail. This remains open pending adult approval, generation, listening review, and runtime verification with approved assets.

- [ ] P4-004 Replace placeholder family avatars after approved image intake
  - Owner(s): UI/UX Design Thread, Orchestrator, Adult reviewer
  - Linear: MEM-41
  - Depends on: P2-003
  - Action: Use `docs/family-avatar-workflow.md` to ingest approved source photos, create simple runtime avatar assets, update YAML paths/weights, and verify Home Base plus adventure headers.
  - Done when: Mama, Dada, River, Gracie, and Max have approved runtime assets or intentional placeholders, and no private source images are committed.
  - Stop/blocked: Requires user-provided images and explicit approval for likeness generation/replacement.

- [x] P4-005 Sync blueprint-derived execution issues to Linear by API
  - Owner(s): Orchestrator, Git Thread
  - Depends on: P4 task definitions
  - Action: Use the Linear API as authoritative to create or update issues for active P4 work, linking back to the canonical blueprint and task-list entries.
  - Done when: Linear has current approved issues matching the unblocked next work, and no live Symphony run depends on stale or browser-only Linear state.
  - Stop/blocked: If Linear, task list, and blueprint conflict, treat `docs/product-blueprint.md` as canonical and stop to reconcile before creating execution work.
  - Completion notes / sign-off: 2026-05-25 Orchestrator used the Linear GraphQL API, not browser state, to query DINO project `f48a68feb930`, confirm the `Symphony Run` label exists, and create stable task-marker backlog issues for P4-002 through P4-004 plus P4-006. Created MEM-39, MEM-40, MEM-41, and MEM-42 in Backlog with no labels, so no issue was accidentally approved for Symphony execution. Verified by API readback that all four issues remain Backlog and unlabeled. Sign-off: Orchestrator.
  - Notes / patterns learned: Use `Task ID: P4-###` in each Linear issue description before future syncs so updates can be idempotent and do not overwrite human-authored Linear context.

- [x] P4-007 Strengthen child-inferable Words context
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P4-001, repeatable child-flow harness
  - Action: Make each spelling word easier to infer without adult explanation by adding compact YAML-backed visual, phonics/speech-position, and rhythm cues, then enforce the cue contract in automated child-flow validation.
  - Done when: Words shows child-readable context cues before letter tapping, first-letter/speech cues remain gentle for hard sounds, tablet validation shows the next tap clearly, and the child-playtest harness fails if the cue support disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `contextHints` to all YAML spelling words, rendered them in `SpellingAdventureScreen.tsx`, and tightened `scripts/src/qa/dinoChildPlaytest.ts` with a spelling inference support check. Follow-up hardening added a structured spelling word-bank audit for clue, first-letter, difficulty/group, rhythm, and gentle `L`/`W` support coverage. Validation passed: app typecheck, scripts typecheck, root `pnpm run typecheck`, root `pnpm run build:replit`, and child playtest at `http://127.0.0.1:25918/` with latest 33 pass, 0 warn, 0 fail. Targeted tablet Words screenshot `artifacts/dino-math-quest/test-results/child-playtest/tablet-spelling-cues.png` confirms visible cue chips and the highlighted next letter. Sign-off: Orchestrator.
  - Notes / patterns learned: For Charlotte's Words flow, a short visual cue plus sound-position cue plus rhythm cue gives useful scaffolding without adding an adult-facing explanation layer.

- [x] P4-008 Strengthen child-inferable Math context
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, QA / Playtest Thread
  - Depends on: P4-007, repeatable child-flow harness
  - Action: Add short child-readable cue chips to every Math puzzle type and enforce that cue support in automated child-flow validation.
  - Done when: Math shows at least three child-readable cues before answer tapping, answer controls remain visible/touch-sized on tablet/mobile, and the child-playtest harness fails if cue support disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `childHints` to all Math puzzle generators in `puzzles.ts`, rendered `math-context-cues` in `PuzzleScreen.tsx`, and tightened `dinoChildPlaytest.ts` with a Math context gate. Validation passed: app typecheck, scripts typecheck, child playtest with 32 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: Short action/visual cues reduce reliance on adult sentence reading while keeping Math Quest fast and uncluttered.

- [x] P4-009 Expand Dino Den friend-practice confidence loop
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P4-008, Dino Den unlock flow, repeatable child-flow harness
  - Action: Give unlocked dinos a short, low-pressure practice loop so Math rewards continue into confidence-building speech, music, counting, and movement play.
  - Done when: Dino Den exposes obvious tablet-sized Clap Name, Dino Song, Count, and Move actions, a child-visible practice trail rewards effort after a few moments, and automated validation fails if the practice cue or reward disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added data-backed `movePrompt` and `cheer` fields for each dino, rendered a three-step friend-practice trail in `DinoDenScreen.tsx`, added a large Move practice action, and tightened `scripts/src/qa/dinoChildPlaytest.ts` to verify the speech-math practice cue and completed trail. Validation passed: app typecheck, scripts typecheck, child playtest with 54 pass, 0 warn, 0 fail, targeted tablet Playwright capture at `artifacts/dino-math-quest/test-results/child-playtest/dinoden-practice.png`, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: Dino Den practice works best as a tiny confidence ritual, not a second menu. Keep each action short, cheerful, and skippable until real iPad observation shows which moments Charlotte repeats voluntarily.

- [x] P4-010 Add Math Quest Dino Island visual scenes
  - Owner(s): Orchestrator, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P4-008, Math mission/cue foundation, repeatable child-flow harness
  - Action: Replace generic emoji-only Math quantity surfaces with calm child-countable Dino Island mini-scenes across puzzle types.
  - Done when: Math renders a `math-visual-scene` before answer tapping, scene items are countable/testable, and child-playtest fails if the scene disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator replaced emoji token rows in `PuzzleScreen.tsx` with CSS Dino Island scene tokens for counting, addition, subtraction, compare, missing-number, and shapes, and added `math island visual scene` coverage to `scripts/src/qa/dinoChildPlaytest.ts`. Validation passed: app typecheck, scripts typecheck, child playtest with 55 pass, 0 warn, 0 fail, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: Simple scene tokens are a useful intermediate between generic emoji and full custom art; keep them countable, stable, and fast while family/avatar assets remain pending.

- [x] P4-011 Make Music Den next-beat choice child-obvious
  - Owner(s): Orchestrator, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P3-003, P4-001, repeatable child-flow harness
  - Action: Make ordered Music patterns show the next expected beat clearly enough that repeated labels do not require adult inference.
  - Done when: Music Den renders a visible next-beat cue, exactly one expected beat button is highlighted/testable, ordered completion still enables `Next Beat`, and child-playtest fails if the cue disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added a `music-next-beat-cue`, `data-next="true"` marker, positive targeted retry hint, and visible next-beat button state in `MusicDenScreen.tsx`; then added `music next beat is explicit` coverage to `scripts/src/qa/dinoChildPlaytest.ts`. Validation passed: app typecheck, scripts typecheck, child playtest with 56 pass, 0 warn, 0 fail, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: Music patterns need to work as a visual sequence game before audio polish lands. Repeated words such as `clap, clap, stomp` should still have one obvious next target at all times.

- [x] P4-012 Add Math Quest count-trail self-checks
  - Owner(s): Orchestrator, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P4-010, repeatable child-flow harness
  - Action: Make countable Math visual scenes easier for Charlotte to self-check before answer tapping without introducing another mode or adult-readable explanation layer.
  - Done when: Counting, addition, subtraction, and compare scenes expose visible numbered count-trail badges, addition continues the trail across both groups, subtraction only numbers the items left, and child-playtest fails if countable scenes lose the trail.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `math-count-badge` labels to `PuzzleScreen.tsx` scene tokens and tightened `scripts/src/qa/dinoChildPlaytest.ts` with `math count trail` coverage. Validation passed: app typecheck, scripts typecheck, child playtest with 57 pass, 0 warn, 0 fail, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: A small count trail gives Charlotte a visual self-check for countable scenes while preserving the fast Math Quest loop and avoiding another control surface.

- [x] P4-013 Make Speech turn-taking child-obvious
  - Owner(s): Orchestrator, Learning Design / Curriculum Thread, UI/UX Design Thread, QA / Playtest Thread
  - Depends on: P4-001, repeatable child-flow harness
  - Action: Make the Say It loop easier for Charlotte to understand independently by separating Dino modeling, Charlotte's turn, and next-word readiness with a compact visual cue.
  - Done when: Speech renders a tablet-friendly turn-taking cue, the cue distinguishes Dino says / Charlotte says / next word, at least one step is visibly active, positive retry/completion copy remains intact, and child-playtest fails if the cue disappears.
  - Completion notes / sign-off: 2026-05-25 Orchestrator added `speech-turn-cue` and `speech-turn-step` rendering in `SpeechAdventureScreen.tsx`, then tightened `scripts/src/qa/dinoChildPlaytest.ts` with Speech turn-taking coverage. Validation passed: app typecheck, scripts typecheck, child playtest with 58 pass, 0 warn, 0 fail on port `25919` after default `25918` was occupied by a stale dev server, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit`. Sign-off: Orchestrator.
  - Notes / patterns learned: Speech support needs visible turn-taking as much as audio rhythm; a short Dino/Charlotte cue reduces ambiguity without adding correction pressure.

- [ ] P4-006 Replit compatibility and final merge readiness
  - Owner(s): Orchestrator, Git Thread, Code Review Thread
  - Linear: MEM-42
  - Depends on: P4-002, P4-003, P4-004, root validation
  - Action: After release-candidate gameplay tests pass, ensure Replit compatibility and prepare the final commit/merge to main.
  - Progress notes: 2026-05-25 Orchestrator reconfirmed the Symphony strategy as API-first pre-live only. Verified workflow validation, prompt rendering, scripts typecheck, Linear API reconciliation, dry-run status/refresh, and fail-closed live-agent preflight. Live unattended execution and final merge remain blocked by the clean tracked Git baseline, live workspace lifecycle hooks, durable failure policy, non-terminal handoff, stall/abort handling, real iPad validation, parent-approved audio exposure, and family-avatar approval gates.
  - Done when: Replit-local run/build expectations are verified or documented with a minimal fix, the repo has a clean intentional baseline with secrets excluded, and changes are committed and merged to main only after all product evidence gates pass.
  - Stop/blocked: Do not commit or merge until real iPad playtest, approved audio exposure, avatar/privacy decisions, root validation, and user approval gates are satisfied.
  - Progress notes: 2026-05-25 Orchestrator reran the strategy confidence loop against the live app and patched tablet layout overgrowth in `HomeScreen.tsx` and `PuzzleScreen.tsx`. Playwright verified tablet `834 x 1112` Home Base, Math wrong/correct recovery, Words DINO completion, Speech participation, Music entry, and mobile `390 x 844` Home/Math smoke with no fresh console warnings/errors. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm run typecheck`, and `pnpm run build:replit`. This task remains open because physical iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, commit, and merge are still unresolved gates.
  - Progress notes: 2026-05-25 P4-013 Speech turn-taking cue and child-playtest coverage passed with 58 pass, 0 warn, 0 fail on fresh port `25919`; app/scripts typecheck, root typecheck, root build, and Replit-routed build passed. P4-006 remains open because physical iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, commit, and merge are still unresolved gates.
  - Progress notes: 2026-05-25 Orchestrator added a narrow `.gitignore` rule for local `dino-dev.*.log` runtime logs so verification artifacts do not pollute the eventual commit baseline. Re-ran browser smoke at tablet/mobile sizes against `http://127.0.0.1:25918/`, confirmed Home Base visible, public audio manifest `assets: []`, and no console warnings/errors. Root `pnpm run typecheck` and `pnpm run build:replit` passed. The repo still has a broad untracked imported-project baseline, so final commit/merge remains gated.
  - Progress notes: 2026-05-25 Orchestrator upgraded `scripts/src/qa/dinoChildPlaytest.ts` so the release-candidate surrogate check captures Charlotte-style next-tap clarity, first-viewport fit, no horizontal overflow, and touch target evidence. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 30 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and `pnpm run build:replit`. Added `/.symphony-*.log` to `.gitignore` for local dry-run logs and added matching Linear API evidence comment `f4b51ccb` on MEM-42. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator rechecked the Linear/Symphony strategy after the user clarified that AI Linear operations should assume API use by default. `WORKFLOW.md` validation and rendered prompt passed, Linear GraphQL API confirmed `mem-dev`, DINO project `f48a68feb930`, one `Symphony Run` label, and 0 active approved issues, scripts typecheck passed, `--live-agent` failed closed without workspace hooks, and `pnpm run build:replit` passed. The confidence statement remains deliberately bounded: API-first pre-live coordination is ready, but broad autonomous live Symphony execution remains blocked.
  - Progress notes: 2026-05-25 Orchestrator added a source/content copy guardrail to `scripts/src/qa/dinoChildPlaytest.ts` so the release-candidate surrogate check fails if Dino Quest source or YAML content includes blocked discouraging speech-recognition phrases such as "can't understand", "cannot understand", "didn't say", "wrong voice", "try harder", or "bad try". Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 34 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator expanded Dino Den with the P4-009 friend-practice confidence loop and reran the local release surrogate checks. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 54 pass, 0 warn, 0 fail, targeted tablet Playwright verification of `dinoden-practice.png`, and root `pnpm run build:replit`. This task remains open because physical iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, commit, merge, and explicit user approval are still unresolved gates.
  - Progress notes: 2026-05-25 Orchestrator added grown-up controls persistence/reset coverage to `scripts/src/qa/dinoChildPlaytest.ts`. The harness opens settings, enforces the settings close target, toggles math pace/speech support/music cues, verifies adult settings persist after reload, verifies reset clears child progress while preserving adult settings, and rechecks Home Base containment afterward. The new gate exposed a real 41px measured settings close target, fixed by enlarging the close button in `SettingsModal.tsx`. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 40 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added Dino Den empty/unlocked practice coverage to `scripts/src/qa/dinoChildPlaytest.ts`. The harness now verifies Home-to-Dino-Den routing, empty-state guidance, locked collection visibility, seeded Stegosaurus practice, Clap Name syllables, Dino Song chant, Count prompt, touch targets, horizontal containment, and return Home. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 50 pass, 0 warn, 0 fail, and root `pnpm run typecheck`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added a direct empty-state `Play Math` route in Dino Den so the next action is child-obvious without requiring the back arrow. The child-playtest harness now checks the button as an obvious/touch-safe next tap, verifies it opens Math Quest answer choices, then continues the seeded Dino Den speech-math practice checks. Validation passed: `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 52 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added Math island mission cues in `puzzles.ts`/`PuzzleScreen.tsx`, enforced them in `scripts/src/qa/dinoChildPlaytest.ts`, and fixed Home Base solo mode so the selected dino mascot no longer occludes adventure cards on tablet/mobile. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 53 pass, 0 warn, 0 fail, root `pnpm run typecheck`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added Math Quest Dino Island visual scenes in `PuzzleScreen.tsx`, enforced visible countable scene items in `scripts/src/qa/dinoChildPlaytest.ts`, and reran release surrogate checks. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 55 pass, 0 warn, 0 fail, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added Music Den next-beat cueing and made `pnpm run build` use the same `scripts/run-dino.mjs` harness as `pnpm run build:replit`, which supplies required `PORT` and `BASE_PATH` values for workspace Vite packages. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 56 pass, 0 warn, 0 fail, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator added Math Quest count-trail badges and harness coverage. Validation passed: `pnpm --filter @workspace/dino-math-quest run typecheck`, `pnpm --filter @workspace/scripts run typecheck`, `pnpm --filter @workspace/scripts run dino:child-playtest` with 57 pass, 0 warn, 0 fail, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit`. Final merge remains gated by real iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, root validation at merge time, and explicit user approval.
  - Progress notes: 2026-05-25 Orchestrator made Say It turn-taking interaction-driven: a rhythm beat changes the active turn from Dino to Charlotte, and `I Tried` unlocks `Next dino word`. The child-playtest now validates those state changes and refuses non-Dino HTTP 200 responses before browser flow. Validation passed: scripts typecheck, app typecheck, child-playtest on port 25921 with 60 pass, 0 warn, 0 fail, root typecheck, root build, root build:replit, and `git diff --check`. P4-006 remains open because physical iPad Safari, parent-approved audio, family avatar decisions, clean Git baseline, commit, merge, and explicit user approval remain unresolved.
