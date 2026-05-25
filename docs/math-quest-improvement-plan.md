# Math Quest Improvement Plan

Date: 2026-05-24

Source: `docs/math-quest-rubric.md`, baseline score 53/100.

## Immediate Slice

Focus: make the current Math Quest feel more intentional and confidence-building without changing the whole puzzle engine.

1. Tablet-native presentation
   - Use a wider tablet-aware layout inside the existing app shell.
   - Keep answer targets large and stable on mobile.
   - Give the prompt, companion/dino art, puzzle visual, and answers clearer zones.

2. Feedback and early reward
   - Make wrong-answer feedback warmer than `Try again!`.
   - Keep one-tap recovery and do not add failure states.
   - Move the first dino unlock earlier so a short first session can produce a visible reward.

3. Companion participation
   - Show the selected companion in Math Quest with a short encouragement line.
   - Keep solo mode clean.
   - Use existing companion content/assets and avoid new likeness generation.

## Next Math Slice

1. Puzzle variety and pacing
   - Add math modes beyond random addition/subtraction/shapes.
   - Add visual quantity comparison and missing-number patterns.
   - Add lightweight difficulty bands and silent fallback after repeated misses.

2. Reward loop
   - Add progress-to-next-dino affordance.
   - Add short optional rhythm prompts for shape words or counting.
   - Make Dino Den feel connected to Math progress.

3. Validation
   - Add repeatable Playwright smoke coverage for Home to Math, wrong answer, correct answer, unlock, and return Home.
   - Re-score against the rubric after the first Math Quest pass.

## Guardrails

- Do not add timers, score pressure, or punitive correction.
- Do not require speech or audio to complete Math.
- Do not make companion UI crowd the puzzle or answers.
- Keep mobile portrait clean even while improving iPad portrait.
