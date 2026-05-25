# Local Exploration Notes

Date: 2026-05-23

## 2026-05-25 Implementation Status Update

The original local exploration issues have been addressed in the current foundation build: Home Base now supports family companion selection, Dino Island has Math, Words, Say It, and Music entry points, Math Quest has richer progression and reward flow, Dino Den has optional practice, adult controls exist in the settings modal, and speech/music support has playable first versions without requiring recognition or live AI.

Latest local validation used Playwright Chromium at `http://127.0.0.1:25918/` with tablet `834 x 1112` and mobile `390 x 844`. The app loaded without a blank screen or runtime overlay, major flows passed, console checks returned no errors or warnings, and root `pnpm run typecheck` plus `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm run build` passed.

Remaining next checks: real iPad Safari for touch feel, safe area, PWA behavior, and audio unlock; parent approval before any generated ElevenLabs audio becomes child-facing; and direct observation of Charlotte using the current Home Base and first adventure sections.

## Local Setup Summary

- App package: `@workspace/dino-math-quest`
- App path: `artifacts/dino-math-quest`
- Package manager: `pnpm`
- Install command: `pnpm install`
- Dev command, PowerShell:
  - `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run dev`
- Local URL: `http://localhost:25918/`

One minimal local setup fix was needed: the root `preinstall` guard used `sh`, which fails in this Windows-native workspace. It now uses a cross-platform Node inline script while preserving the pnpm-only guard and stray lockfile cleanup.

## Verification Summary

- Dev server started successfully at `http://localhost:25918/`.
- Browser tool path: Playwright MCP was used after the Browser plugin workflow exposed only limited controls and Chrome DevTools MCP could not attach cleanly to its existing profile.
- Tablet viewport checked: `820 x 1180`.
- Mobile viewport checked: `390 x 844`.
- Page identity: title is `Dino Math Quest`.
- Blank/runtime overlay check: passed. The home screen, puzzle screen, and Dino Den rendered visibly.
- Interaction proof: tapped `Start Adventure`, answered a pattern puzzle correctly, answered a subtraction puzzle incorrectly then correctly, opened Dino Den, and reset local progress for a fresh home state.
- Console health: no errors. Warnings observed:
  - Web Audio tried to start before a user gesture.
  - `apple-mobile-web-app-capable` is deprecated without `mobile-web-app-capable`.
  - Manifest references `/icon-192.png` and `/icon-512.png`, but those files are not present or valid.
- Typecheck: `pnpm run typecheck` passed.
- Build: `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build` passed.

## Charlotte-Perspective Exploration Notes

- The first screen is simple and tap-friendly. `Start Adventure` is large, low on the screen, and likely easy for Charlotte to hit on iPad or phone.
- The top bar buttons are large enough for touch, but the Dino Den icon, mute icon, and settings icon may not be self-explanatory without prior adult introduction.
- On tablet portrait, the game remains constrained to a 430px phone-like frame centered in the viewport. It works, but it does not use iPad space; that is acceptable for a kiosk-style game, but future tablet polish could make the play area feel more intentionally iPad-native.
- Puzzle answer buttons are strong for a 4-year-old: three choices, high contrast, large type, and 80px minimum height.
- The puzzle prompt starts at the very top of the game content and visually competes with the floating top bar. On the checked tablet viewport, prompt text appeared under/behind the top bar area. This is the clearest immediate layout issue.
- Current wrong-answer feedback is gentle: the wrong option disables, shakes, and briefly shows `Try again!`. That avoids hard failure, which fits confidence-building play.
- Correct-answer feedback is positive but brief. The celebration gives a quick reward, then immediately moves on. There may be room for slightly richer effort reinforcement without slowing short sessions too much.
- The math range is cognitively plausible for Charlotte. Addition/subtraction up to 18, visual counters, and patterns are likely within reach. Some puzzles may be easy for her, which can be useful for fluency and confidence if variety increases over time.
- Shape recognition prompts like `Tap the Circle!` assume reading or adult reading. Charlotte can read basic books, so this may be okay, but a pre-reader/tired-child mode would benefit from audio prompts and stronger visual hinting.
- Pattern puzzles are visually strong and likely a good match for strong visual memory.
- There is little explicit speech practice right now. The app has music/sound hooks, but no rhythmic call-and-repeat, syllable clapping, or spoken word modeling.
- Difficult sounds such as `L` and `W` are not currently handled in a speech-supportive way. Dino names and facts could become a gentle practice surface, but should stay optional and encouraging.
- Dino Den gives long-term motivation, but early progress is slow: the first dino unlocks at 5 correct. For a short caregiving moment, a smaller first reward or visible "almost there" path may help.
- The settings reset flow is clear for adults, but it is accessible to the child from the main screen. The confirmation reduces risk, though a parent-only affordance might be worth considering later.

## Prioritized Improvement Ideas

### Quick Wins

- Add top padding or layout accounting so puzzle prompts never sit under the floating top bar.
- Delay background music creation/resume until the first tap, or explicitly resume audio after `Start Adventure`, to remove autoplay warnings and improve reliability on iPad.
- Add the missing PWA icon files or update `manifest.json` to point at existing assets.
- Add `<meta name="mobile-web-app-capable" content="yes">` alongside the Apple mobile web app meta tag.
- Make the Dino Den button communicate reward/progress more clearly, such as a tiny count badge or unlocked sparkle when something new is available.
- Give wrong-answer encouragement a little more warmth and specificity, for example "Good try!" before "Try again!", while keeping it short.

### Medium-Sized Enhancements

- Add optional tap-to-hear prompts for puzzles: "Help Tri count", "How many are left", and shape names. Keep text visible, but do not require adult reading.
- Add rhythmic speech moments after selected puzzles: "tri-an-gle", "yel-low", "woo-lly", or "long neck", with visual beat dots or gentle clap cues.
- Create a short "practice word" reward after some correct answers, especially for `L` and `W` sounds, but allow skipping so it never blocks play.
- Add a fast first-session reward: unlock a starter dino after 2-3 correct answers, then continue the normal 5-answer cadence.
- Use iPad width intentionally: keep the phone frame as an option, or create a wider tablet layout with larger dino art and answer buttons that still remain simple.
- Add a "music boost" or call-and-response mode where correct answers trigger short melodic phrases tied to the prompt.

### Larger Product Ideas

- Build a caregiver-tunable progression profile: easy confidence rounds, mixed challenge rounds, and speech-practice rounds. Keep this outside the child’s main play path.
- Add a tiny content system for personalized words, favorite songs, family names, and hard sounds, so speech support can grow with Charlotte.
- Add lightweight session summaries for adults: puzzles attempted, repeated misses, words practiced, and new dinos unlocked.
- Expand Dino Den into a confidence space: tap a dino to hear its name broken into syllables, hear a fun fact, or repeat a short rhythmic phrase.
- Introduce adaptive variety so the game notices when Charlotte is succeeding quickly and rotates in new patterns, numbers, or sound-play without turning the game into assessment.

## Blockers, Assumptions, Follow-Up Checks

- No blocker remains for local development: install, typecheck, build, dev server, and browser smoke verification all worked.
- The app has no dedicated test runner configured, so validation is currently typecheck plus browser smoke testing.
- The exploration was local Chrome/Playwright, not a real iPad Safari session. Follow-up on an actual iPad is recommended for audio unlock behavior, touch feel, PWA install behavior, and viewport safe-area behavior.
- I assumed the Charlotte-facing game is `@workspace/dino-math-quest`, based on the package name, Replit artifact metadata, and rendered app.
