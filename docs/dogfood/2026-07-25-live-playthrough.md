# Dogfood: live play-through, 2026-07-25

Recorded by Claude Opus 5 driving a real browser against `pnpm run dev:dino` at
commit `20e46f9`. Every claim below came from clicking the running app, not from
reading code — code references were added afterward to locate the cause.

This is **evidence, not a work order.** It is deliberately kept out of `AGENTS.md`
so it does not preload into every session. A refactor should form its own view of
the app first, then use this to check whether it caught the same things.

## Method

Played both games end to end at 375×812, 768×1024, and ~1017×910. Clicked through
the full loop: hub → math → correct answer → wrong answer → reward → collection →
settings → words. Read console and network throughout.

## Blocker — Words game serves unsolvable puzzles

Target word **DINO**. The letter tray offered `A U V O P K C Q F N L X` — no `D`,
no `I`. The word cannot be spelled. "Next Word" stays disabled; the only exit is
Home. Reloaded and drew a fresh tray: `X Y F K C W N A M E …` — again no `D`, no `I`.
Two independent samples, both dead ends.

Cause, `screens/SpellingAdventureScreen.tsx:106`:

```js
const pool = Array.from(new Set([...word.word.split(''), ...extras]));
return shuffle(pool).slice(0, 12);
```

The answer's letters are mixed into a 26-element pool and *then* sliced to 12, so
any required letter landing past index 12 is silently dropped. For a 4-distinct-letter
word the chance all four survive is roughly 4% — meaning **~96% of letter-build
rounds are unwinnable.**

Origin: `docs/plans/2026-07-25-dino-aruba-polish-plan.md:199` ("5c. Shuffle letter
choices") asked for a shuffle before the slice without reserving the answer letters.

Shape of a fix: reserve the word's distinct letters, sample distractors only to
fill the remainder, then shuffle the union. The same guarantee should hold for any
future mode that builds a tray.

## Header collides at phone width

At 375px the title pill occupies x=87→288 while the Mute button starts at x=223 —
a measured **65px overlap**. "Dino Island" renders as "Dino Isl▮▮" under the speaker
icon. Clean at ≥768px. Given the audience is a 4-year-old on a tablet or phone,
this is on the primary surface.

Element: `components/TopBar.tsx`.

## Orphaned feature — companions can never be chosen

`docs/product-blueprint.md` describes the Core Experience as beginning at a family
Home Base where Charlotte picks 0 or 1 companion. **That screen does not exist in
this checkout.** The app opens directly on the Dino Island hub.

The feature is wired everywhere except the one place that would make it reachable:

- All six companions are authored in `content/dino-island.yaml` (`none`, `mama`,
  `dada`, `river`, `gracie`, `max`).
- `GameContext.tsx:171` exposes `selectCompanion()`.
- Three screens read the result — `AdventurePreviewScreen.tsx:9`,
  `MusicDenScreen.tsx:12`, `SpeechAdventureScreen.tsx:18`.
- **No UI anywhere calls `selectCompanion`.** `selectedCompanionId` is initialized
  to `'none'` at `GameContext.tsx:36` and can never change.

So every companion-aware screen permanently renders the solo path, and five
authored family characters are unreachable. Whether the right move is to build the
picker or to remove the plumbing is a product call, not a bug fix — but the current
state is a half-feature that reads as complete from the code and as absent from the
app. Note that HEAD is `20e46f9` "Git commit prior to merge", so this may be a
pre-merge state rather than a regression.

## Verified working

- Math loop: missing-number and fill-to-ten (ten-frame) both render and advance.
- Wrong-answer handling is gentle and non-punishing — "Good try. Pick one more! ⭐",
  stays on the question, no life lost. This is a genuine strength; preserve it.
- Reward screen (Stegosaurus), Dino Den at 1/12 with unlock thresholds, and the
  Grown-up Controls modal (Math Pace, Speech Support, Music cues, Reset Adventure).
- State persists across navigation and full reload.
- Zero console errors across the entire session.

## Not verified

- **All audio.** No audio capture was available. Howler is wired and the mute and
  music toggles exist, but nothing confirms sound actually plays.
  `docs/plans/2026-07-25-dino-aruba-polish-plan.md:188` flags "Letter Sound" and
  "Clap Word" as non-functional, and clicking **Clap Name** in the Dino Den produced
  no DOM change and no network request — consistent with still-stubbed. Needs a
  human ear.
- Later biomes, later puzzle types, and the music/speech screens beyond first load.
- Real touch input on a real tablet.
