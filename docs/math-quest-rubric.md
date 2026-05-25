# Math Quest 100-Point Rubric

Date: 2026-05-24

Purpose: define the quality bar for turning Math Quest into the benchmark Dino Island adventure. Scores are practical product judgments grounded in `docs/product-blueprint.md`, the current React implementation, and local browser smoke evidence.

## Scores

Baseline Math Quest score from the first rubric pass: **53 / 100**

Current Math Quest score after the P1 10x pass, rhythm cue follow-up, mission cues, Dino Den friend-practice trail, Math island visual scenes, count-trail self-checks, and harness hardening: **76 / 100**

Baseline evidence:

- App path: `artifacts/dino-math-quest`
- Current Math screen: `src/screens/PuzzleScreen.tsx`
- Current puzzle generator: `src/lib/puzzles.ts`
- Current reward/progression state: `src/context/GameContext.tsx`, `src/lib/dinos.ts`, `src/lib/biomes.ts`
- Latest verified local URL: `http://127.0.0.1:25918/`
- Verified viewports from recent smoke work: tablet `820 x 1180`, mobile `390 x 844`
- Current validation: Playwright Chromium smoke at tablet `820 x 1180` and mobile `390 x 844`; Home loaded, Mama companion selected, Math opened, wrong-answer feedback appeared, first dino reward appeared, and console warnings/errors were empty.
- Current validation artifact location outside repo: `%TEMP%\dino-quest-validation`
- Validation known passing for the current foundation slice: app-specific typecheck and build, plus browser smoke across Home, Math, Spelling, Speech, and Music.
- 2026-05-25 release-readiness validation passed on tablet `834 x 1112` and mobile `390 x 844`, including Math wrong/correct flow, companion selection, Dino Den practice, settings persistence, and no console errors or warnings. Root `pnpm run typecheck` and `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build` passed. Real iPad Safari remains required before raising smoothness/reliability scores.
- 2026-05-25 rhythm/visual-clue validation passed on tablet `834 x 1112` and mobile `390 x 844`, including Math `Count Beat`, visible mobile answer choices, Words DINO icon clue completion, and Say It one-try positive completion. Root `pnpm run typecheck`, ElevenLabs dry run, and `pnpm run build:replit` passed.
- 2026-05-25 Dino Den friend-practice validation passed on tablet `744 x 1133`, including Clap Name, Dino Song, Count, Move, the completed three-step practice trail, no console errors, and the screenshot `artifacts/dino-math-quest/test-results/child-playtest/dinoden-practice.png`. Latest child-playtest harness result: 54 pass, 0 warn, 0 fail. Root `pnpm run build:replit` passed.
- 2026-05-25 Math island visual-scene validation passed, replacing generic emoji-only quantity rows with child-countable Dino Island mini-scenes for counting, addition, subtraction, compare, missing-number, and shape prompts. Latest child-playtest harness result: 55 pass, 0 warn, 0 fail. App typecheck, scripts typecheck, and root `pnpm run build:replit` passed.
- 2026-05-25 Math count-trail validation passed, adding numbered self-check badges to countable Math scene tokens and enforcing them in the child-playtest harness. Latest child-playtest harness result: 57 pass, 0 warn, 0 fail. App typecheck, scripts typecheck, root `pnpm run typecheck`, root `pnpm run build`, and root `pnpm run build:replit` passed.

## Rubric

| Category | Points | Baseline | Current | Evidence and Remaining Gap | What 10x Better Feels Like |
| --- | ---: | ---: | ---: | --- | --- |
| Independent child navigation | 10 | 6 | 8 | Home Base exposes Math, the Math screen has direct Home access, the reward screen has clear `More Math` and `Dino Den` choices. Remaining gap: top controls still depend on learned labels rather than fully pictorial navigation. | Charlotte immediately knows where Math is, how to keep going, and how to leave, using icons and familiar rhythm without adult reading. |
| Tablet-first layout and touch ergonomics | 10 | 6 | 8 | Tablet smoke at `820 x 1180` shows wide layout, side companion panel, large answer buttons, stable prompt area, and mobile fallback. Remaining gap: real iPad Safari touch/safe-area pass is still needed. | iPad portrait feels intentional: large useful art, stable prompt area, no cramped stacks, and no accidental overlap at any major viewport. |
| Visual clarity and polish | 10 | 5 | 8 | Math now has clearer prompt, visual quantity, companion, progress, answer zones, CSS-based Dino Island mini-scenes, and numbered count-trail badges on countable visual items. Remaining gap: the scenes are still simple/static rather than fully bespoke illustrated companion/dino art. | Math Quest looks like a crafted Dino Island area with calm hierarchy, purposeful visual quantities, and polished companion/dino art that supports the task. |
| Math content quality and progression | 15 | 7 | 11 | Puzzle generation now includes addition, subtraction, counting, missing-number, compare, shapes, patterns, and support/steady/stretch bands. Remaining gap: progression is session-local and not yet tied to broader configurable learning goals. | Sessions mix fluency, number sense, visual quantities, patterns, and challenge pacing that can move quickly for Charlotte while quietly backing off after friction. |
| Feedback, reward, and confidence loop | 15 | 6 | 12 | Wrong answers show positive retry feedback, correct answers stay quick, first dino unlock arrives at 2 correct, progress to next friend is visible, and Dino Den now has a three-moment friend-practice trail with Clap Name, Dino Song, Count, and Move. Remaining gap: Dino Den practice is still session-local and not yet personalized by observed preference. | Every attempt feels safe, correct answers feel joyful without delay, early rewards arrive fast, and effort is reinforced without school-like scoring pressure. |
| Story/world integration | 10 | 4 | 8 | Companions now appear in Math with task-flavored lines, reward flow links back into Dino Den, each puzzle type has a compact island mission cue, and Math prompts now use simple island mini-scenes. Remaining gap: the scenes are still static and not yet deep story beats. | Math feels like an island adventure with tiny story beats, dino helpers, companion participation, and visual reasons for counting or choosing. |
| Audio/music contribution | 10 | 4 | 6 | Audio reliability improved, reward/correct/wrong cues exist, and Math now has an optional `Count Beat` rhythm cue. Remaining gap: Math does not yet have full prompt playback, section-specific generated/static music assets, or richer number-word rhythm coverage. | Math includes optional tap-to-hear prompts, short musical rewards, rhythmic counting, and audio that helps without becoming noisy or required. |
| Personalization and companion integration | 10 | 3 | 7 | Mama, Dada, River, Gracie, Max, and solo mode are represented through YAML-backed weighted variants and Math helper copy. Remaining gap: Gracie/Max have fewer variants and companion effects remain emotional rather than mechanically varied. | Mama, Dada, River, Gracie, or Max can appear in simple weighted moments with short encouragement or task flavor, while solo mode stays clean. |
| Smoothness, performance, and reliability | 5 | 4 | 4 | Current Playwright smoke found no console warnings/errors and responsive Math flow on tablet/mobile. Remaining gap: real iPad Safari has not been run in this pass. | Transitions, audio, answer feedback, and persistence stay smooth on iPad Safari and mobile Chrome, with no lags that interrupt play. |
| Validation coverage and repeatability | 5 | 2 | 4 | The repeatable child-playtest harness now checks Math cues, touch targets, tablet/mobile containment, Dino Den practice, adult controls, and audio manifest safety with screenshot artifacts. Remaining gap: real iPad Safari/manual audio validation is still required. | Future agents can rerun a compact Math playtest script/checklist and prove layout, navigation, answer states, audio, persistence, and rewards. |

## Highest-Value Improvement Targets

1. Expand optional Math prompt audio beyond `Count Beat`: counting, shape words, missing-number patterns, and short generated/static cues gated behind user gesture.
2. Deepen the new Math mini-scenes with bespoke art/assets, small interactions, and observed iPad tuning.
3. After real child observation, decide whether Dino Den should persist favorite practice history, rotate friend moments, or stay session-light.
4. Run a real iPad Safari pass for safe area, touch feel, PWA behavior, and audio unlock.
5. With parent-approved audio, decide which Dino Den cues should become static ElevenLabs assets.

## Scoring Notes

- A "10x better" Math Quest does not require a perfect 100 score. It means the experience feels dramatically more intentional, personal, smooth, and fun for Charlotte.
- Speech practice should remain optional and gentle; Math Quest can include rhythmic language or shape-word support, but should not become a speech test.
- Any future rescore should record browser viewport, commands run, files inspected, and concrete before/after changes.
- The P1 10x pass materially improved Math Quest, but it is not finished at the product-vision level. The largest remaining leverage is audio/rhythm, bespoke visual polish, real iPad evidence, and observed tuning of Dino Den practice.
