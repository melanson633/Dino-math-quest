# Dino Math Quest — Aruba Trip Polish Plan

**Date:** 2026-07-25
**Author:** ce-plan (invoked by voice notes + annotated screenshots)
**Context:** Aruba flight entertainment for Charlotte (4, strong visual learner, speech delay) and River. The app needs to hold Charlotte's attention for hours on an iPad without a parent hovering. Current version has several correctness and engagement gaps called out in a live dogfood session.

---

## Problem Frame

The current app builds in multiple answer-giveaways that let Charlotte pattern-match instead of actually thinking. The UI is also cluttered enough that the learning content gets buried. Two feature areas (Say It, Music) are visible but non-functional, which wastes screen real estate and risks tap confusion. Family companion photos were added but don't work as intended and need to come out.

This plan covers five work streams:

1. **Home screen cleanup** — remove family companions and non-functional learning areas
2. **Math: remove numbered cheat-badges** — SceneToken count overlays
3. **Math: fix subtraction visual** — two-group layout instead of fading same-type items
4. **Math: reduce puzzle screen clutter** — strip sidebar chrome, mission bar, hint chips
5. **Words: spelling overhaul** — hidden target word, shuffled letters, harder words, remove unused buttons

A **CE Dogfood** section is included at the end with test scenarios from both a 4-year-old's perspective and a parent's perspective.

---

## Scope Boundary

**In scope:**
- `artifacts/dino-math-quest/src/screens/HomeScreen.tsx`
- `artifacts/dino-math-quest/src/screens/PuzzleScreen.tsx`
- `artifacts/dino-math-quest/src/screens/SpellingAdventureScreen.tsx`
- `artifacts/dino-math-quest/src/lib/puzzles.ts`
- `artifacts/dino-math-quest/src/content/dino-island.yaml`
- `artifacts/dino-math-quest/src/content/dinoIslandContent.ts`

**Out of scope:**
- SpeechAdventureScreen.tsx, MusicDenScreen.tsx (kept but unreachable)
- API server, generated clients, DB schema
- Audio pipeline changes
- New dino unlocks or biome content

---

## Work Stream 1: Home Screen Cleanup

### Problem
- Six companion picker buttons (Solo, Mama, Dada, River, Gracie, Max) + companion preview section take up ~40% of scroll height. Family photos were unintentional for this release.
- "Say It" and "Music" tiles show as "Play now" but lead to non-functional screens.

### Approach

**Companions:** Remove the entire companion selection row and the companion preview section from `HomeScreen.tsx`. Keep `CompanionId = 'none'` as the permanent active companion — no picker needed. All downstream companion lookups already handle `'none'` gracefully (renders TriDino, uses Tri's voice lines).

**Learning areas:** In `dino-island.yaml`, change `speech` and `music` from `status: playable` to `status: scaffold`. In `HomeScreen.tsx`, filter `LEARNING_AREAS` to only render areas where `status === 'playable'` (this filter is already structurally supported by the `LearningAreaStatus` type — just enforce it in the render). This removes both tiles without touching their backend logic.

**Layout:** With companions gone and only Math + Words showing, the home screen has room to breathe. Change the learning area grid from `grid-cols-2` to a single-column stack or a 2-column layout with larger cards that fill the recovered space. Add a simple welcoming headline ("What do you want to do, Charlotte?") replacing "Pick a helper, then choose an adventure."

### Files
- `artifacts/dino-math-quest/src/screens/HomeScreen.tsx` — remove `CompanionButton`, companion preview section; filter LEARNING_AREAS to playable
- `artifacts/dino-math-quest/src/content/dino-island.yaml` — set `speech.status: scaffold`, `music.status: scaffold`

### Test scenarios
- Home renders with exactly 2 learning area cards (Math, Words)
- No companion picker row appears
- Tapping Math navigates to PuzzleScreen
- Tapping Words navigates to SpellingAdventureScreen
- No crash if `state.selectedCompanionId` is 'none' (already default)

---

## Work Stream 2: Math — Remove Numbered Count Badges

### Problem
Screenshot shows numbered badges (1, 2, 3 … 10) overlaid on each SceneToken. Charlotte matches the "10" badge on the last token to the "10" answer button — zero counting required.

### Root cause
`CountBadge` in `PuzzleScreen.tsx` (lines 16–27) renders an amber number bubble at the top-right of every token. `TokenRow` passes `countLabel={i < fadedFrom ? String(startAt + i) : undefined}` so every visible (non-faded) item gets a sequential number.

### Approach
Delete the `CountBadge` component and remove all `countLabel` props from `SceneToken` and `TokenRow`. The `data-count-index` attribute can stay on `SceneToken` for test automation purposes — just stop rendering the visible badge.

No other counting mechanics change. The prompt "How many do you see?" still works; Charlotte now has to actually count.

### Files
- `artifacts/dino-math-quest/src/screens/PuzzleScreen.tsx` — delete `CountBadge`, remove `countLabel` from `SceneToken` signature and `TokenRow` implementation

### Test scenarios
- Counting puzzle renders N items with zero visible number overlays
- Addition puzzle shows two groups, no number overlays
- Subtraction puzzle shows items, no number overlays
- `data-testid="math-count-badge"` elements are absent from DOM

---

## Work Stream 3: Math — Fix Subtraction Visual

### Problem
Current subtraction (9 − 2): renders 9 tokens in a single row, last 2 are faded/gray. Both groups are the same object type. The child can see all 9, see the 2 gray ones, and count 7 without thinking about subtraction. Screenshot annotations confirm this.

### Correct mental model
Subtraction = "you start with A, B go away, how many are left?" The visual should make this concrete:
- **Top group:** `a` items, normal and vivid — "what we started with"
- **Separator:** A visual cue like "→ some left →" or just spatial separation
- **Bottom group:** `b` items, clearly "removed" — crossed-out, flying-away style, or placed in a distinct "gone" zone
- Child counts the **top group** to find the answer (or counts top − bottom)

Use **different object types** for the two groups to break the visual sameness. The existing `TOKEN_KINDS` (primary) and `SUBTRACT_KINDS` (secondary) are already biome-paired — use tokenKind for the starting group and subtractKind for the "taken away" group.

### Implementation decision
In `PuzzleScreen.tsx → MathVisualScene`, the subtraction branch currently renders:
```
<TokenRow count={a} kind={tokenKind} fadedFrom={a - b} ... />
```

Replace with a two-section layout:
```
<div class="starting group label">
  <TokenRow count={a} kind={tokenKind} /> {/* all vivid, no fading */}
</div>
<div class="taken-away label + visual separator">
  <TokenRow count={b} kind={subtractKind} faded=true /> {/* all faded/crossed */}
</div>
```

The "taken away" group should be visually distinct: a soft red/gray tint background, a label like "gone 🌫️" or just a crossed-out styling. The answer is `a − b` which the child must derive by counting the top group and mentally removing the bottom.

The equation display (`9 − 2 = ?`) stays as-is above the scene — it orients the parent and gives a written reference.

### Files
- `artifacts/dino-math-quest/src/screens/PuzzleScreen.tsx` — rewrite subtraction branch in `MathVisualScene`

### Test scenarios
- Subtraction puzzle shows two distinct groups separated visually
- Top group has `a` vivid tokens of tokenKind; bottom group has `b` tokens of subtractKind (different shape/color)
- No number badges on either group (Work Stream 2)
- Answer options contain the correct `a − b` value

---

## Work Stream 4: Math — Reduce Puzzle Screen Clutter

### Problem (screenshots 2, 3, 4)
The puzzle screen has six distinct chrome areas fighting for attention:
1. Top bar: prompt + Home button ✅ keep
2. Left sidebar (25% width): companion avatar, companion name, companion hint line, "Next friend" box, progress bar, "Count Beat" button — heavy
3. Mission header: icon + title + cue inside the puzzle area ("🌿 Snack Share / Some snacks went away")
4. Visual scene: the actual content ✅ keep
5. Context cue chips: "look at what stays · touch answer · 9 take 2" — noisy
6. Answer buttons ✅ keep

Charlotte taps an answer. The content is the scene + answers. Everything else is secondary.

### Approach

**Sidebar:** Collapse to a thin strip or remove entirely. The "Next friend" progress is motivating but doesn't need to dominate 25% of screen width during a question. Move dino progress to a post-correct celebration overlay (already exists at lines 549–560 — extend it to show next dino info for 1.5s on correct). Remove "Count Beat" button from sidebar — it's an optional feature that takes prime real estate. Keep Count Beat accessible via a small icon button in the top bar if desired, or remove entirely for this release.

**Mission bar:** Remove the mission header card (icon + "Snack Share" title + cue text) from the puzzle area. The top-bar prompt already tells the child the task. A 4-year-old doesn't read "Snack Share" — it's adult scaffolding that wastes space.

**Context cue chips:** Remove or severely limit the chip row. "look at what stays · touch answer · 9 take 2" gives away the answer ("9 take 2" is just the problem restated, "touch answer" is obvious). If any hint is kept, limit to one chip at most and only show on wrong guess.

**Layout post-cleanup:** With sidebar gone, the visual scene + answer buttons can be full-width. On tablet portrait this gives the scene ~60% of vertical space and answers ~30%, which is far more child-friendly.

### Files
- `artifacts/dino-math-quest/src/screens/PuzzleScreen.tsx` — remove sidebar or collapse to minimal dino-progress strip; remove mission bar; remove context cue chips (or gate behind wrong-guess state); expand visual scene to full width

### Test scenarios
- Puzzle screen has no companion sidebar visible during question
- Mission header bar (icon + title + cue) is not rendered
- Context cue chips do not appear on first render of a puzzle
- Visual scene occupies full content width
- Correct animation still plays on right answer
- Home button still accessible in top bar

---

## Work Stream 5: Words — Spelling Overhaul

### Problem (screenshot 6)
Five issues compound to make spelling trivial:

**5a. Target word is shown**: "Build this word" section displays `DINO` in giant text. Child copies rather than spells.

**5b. Rhythm beats give away structure**: `DI · NO` below the word shows syllable count and breaks.

**5c. Letter choices are in word order**: `choices` is built as `Array.from(new Set([...current.word.split(''), ...extras]))`. Since Set preserves insertion order and the word's letters are inserted first, the choices array always starts with the word's letters in sequence. Displayed in a 5-col grid, `D I N O` appear left-to-right, top row — Charlotte reads them off.

**5d. Too few distractors**: Support = 6 choices (for a 4-letter word, only 2 distractors). Even stretch = 10 choices. For a bright near-reader, this is trivially easy.

**5e. Non-functional buttons**: "Letter Sound" (Volume2 icon) and "Clap Word" (Hand icon) exist in the UI but their audio functions are incomplete/non-functional. They consume layout space and may confuse.

### Approach

**5a. Hide target word**: Remove the large `current.word` display from the "Build this word" section. Replace with picture/riddle-only presentation:
- The `current.icon` emoji + `current.clue` text is already in the data ("A friendly helper on the island" for DINO)
- Show: big emoji, clue text, empty letter slots — not the word itself
- The clue text should be the riddle: "What lives on the island and helps Charlotte?" → child thinks, then spells

**5b. Remove rhythm beats**: Remove the rhythm beat chips from the build section. They're good for speech work but for reading/spelling they telegraph the word structure.

**5c. Shuffle letter choices**: Change the `choices` useMemo to shuffle the combined letter+distractor array after deduplication, before slicing to maxChoices:
```ts
const combined = Array.from(new Set([...current.word.split(''), ...extras]));
return shuffle(combined).slice(0, maxChoicesByDifficulty[difficulty]);
```
This ensures the correct letters are distributed randomly in the grid.

**5d. Increase distractor count**: Update maxChoicesByDifficulty:
- `support`: 8 → keep word letters (usually 3–4) + fill to 8 with distractors
- `steady`: 12 → enough to need real letter hunting
- `stretch`: 16 → near-full alphabet subset

Also expand the `extras` distractor pool from 13 letters to the full alphabet minus letters already in the word, to give more variety.

**5e. Remove non-functional buttons**: Delete the "Letter Sound" button and "Clap Word" button and their handlers (`playSoundCue`, `playWordClap`). This also removes the imports for `playPhonicsCue` from audio.ts if no longer used. Clean up the 2-col button grid section entirely.

**5f. Harder words**: The current `spellingWords` list includes DINO (4 letters, trivial). Add a `stretch` band of harder, meaningful words. Examples that would work for a bright 4-year-old who likes reading:
- BEACH, PLANE, CLOUD, OCEAN, SHELL, SHARK, ISLAND, JUNGLE, HOTEL
- DADA, MAMA, RIVER (family words she knows)
- BOOK, CAKE, BIRD, FROG, SNOW
Keep the existing `support` words as-is. Add ~10 new `stretch` words. Clues should be picture + riddle format: "🏖️ — where you swim in the sand" → BEACH.

**Layout after cleanup**: With the two buttons gone and word hidden, the card is: emoji + clue (large) → letter slots → message → letter grid. Much cleaner.

### Files
- `artifacts/dino-math-quest/src/screens/SpellingAdventureScreen.tsx` — hide `current.word`, remove rhythm beats display, shuffle choices, remove Letter Sound + Clap Word buttons, expand distractor pool
- `artifacts/dino-math-quest/src/content/dino-island.yaml` — add stretch-difficulty words with picture/riddle clues
- `artifacts/dino-math-quest/src/content/dinoIslandContent.ts` — verify `SpellingWordContent.clue` field supports riddle format (it does — no type changes needed)

### Test scenarios
- Word is NOT visible in the spelling screen during an active puzzle
- Rhythm beat chips are NOT rendered
- Letter choice grid contains the correct letters shuffled (not in word order)
- Letter grid has 8 choices at support, 12 at steady, 16 at stretch
- Tapping correct letters in sequence completes the word
- Tapping wrong letter clears and drops difficulty (existing behavior)
- "Letter Sound" button is absent from DOM
- "Clap Word" button is absent from DOM
- At stretch difficulty, at least 3 new stretch words appear in rotation

---

## Sequencing & Dependencies

| # | Work stream | Depends on | Risk |
|---|---|---|---|
| 1 | Home cleanup | none | Low — pure removal/filter |
| 2 | Remove count badges | none | Low — single component delete |
| 3 | Fix subtraction visual | 2 (no badges on new layout) | Medium — layout logic change |
| 4 | Puzzle screen clutter | 2, 3 | Medium — layout restructure |
| 5 | Spelling overhaul | none | Medium — touches choice logic + YAML content |

Streams 1, 2, and 5 can be implemented in parallel. Stream 3 depends on Stream 2 being complete so no badges accidentally appear in the new two-group layout. Stream 4 should land after Stream 3 since it restructures the same screen.

---

## CE Dogfood

### Personas

**Charlotte (4 years old, primary user)**
- Bright, strong visual memory, confident counter to ~15
- Speech delay — "L" and "W" sounds are hard; she doesn't read aloud during play
- Uses iPad with one finger, taps quickly, low patience for loading or confusion
- Loves reward moments: unlocking a new dino friend is high-motivation
- Dislikes: prompts she doesn't understand, screens that feel "wrong" without knowing why, having to read text to figure out what to do
- Success signal: she taps without hesitation and stays for "one more"

**Parent/caregiver (secondary user, occasional co-player)**
- Glancing at the screen while managing a flight, not always actively engaged
- Wants to know the game is actually teaching, not just letting Charlotte tap through it
- Will notice immediately if she's cheating (reading numbers off badges, copying the word)
- Needs the Home button to always be visible in case of meltdown

### Dogfood test scenarios — Charlotte perspective

| Scenario | What to verify | Failure signal |
|---|---|---|
| Home screen loads | Sees two big friendly buttons (Math, Words), nothing confusing | Companion row appears; Say It / Music tiles show |
| Taps Math, counting puzzle | Sees objects, counts aloud or with finger, picks number | Sees numbered badges and matches them to answer without counting |
| Counting: wrong guess | Friendly shake animation, no harsh feedback | Red X or buzzer sound that feels punishing |
| Subtraction puzzle | Sees two groups clearly separated, understands "these went away" | Still sees faded-same-color objects in a single row |
| Shape recognition | Big shapes to tap, clear which to find | "Find it! 👀" text in a box that takes up half the screen |
| Returns home mid-math | Home button visible and tappable | Home button is hidden or requires scrolling |
| Taps Words | Sees a clue (emoji + riddle), letter slots, shuffled letter grid | Sees the full word displayed — copies without thinking |
| Spelling at stretch | Sees 16 letters scattered, hunts for the right ones | Letters D-I-N-O appear in positions 1–4 of the grid in order |
| Completes a word correctly | Clear celebration, moves to next word | Nothing visible happens; button to proceed isn't obvious |
| Dino unlock | Big joyful dino reveal moment | Progress bar buried in sidebar she never noticed |

### Dogfood test scenarios — parent perspective

| Scenario | What to verify | Failure signal |
|---|---|---|
| Hands Charlotte the iPad | App loads immediately, she knows what to tap without explanation | She asks "what do I do?" |
| Watches a counting round | Charlotte is actually counting, not badge-matching | She taps instantly without looking at the objects |
| Watches subtraction | Visual makes the "9 minus 2" story clear | Same-type faded items — parent can't tell what the game is trying to show |
| Spelling clue quality | Clues are clever enough that Charlotte has to think | Clue gives away the word ("A friendly helper" → "oh it's dino" before typing) |
| App after 20 min | Still engaging, not stuck on same easy words | Charlotte is bored; game never increased difficulty |
| Flight turbulence moment | Charlotte can pause / exit without losing all progress | Only option is Home which resets state |
| Layout on iPad portrait | All content visible without scrolling during a puzzle | Has to scroll to reach answer buttons |
| Companion-related confusion | No photos of real family members pop up unexpectedly | Family photos still appear if code not cleaned up |

### Dogfood sharp paper cuts (fix in this plan)

These would fail the Charlotte engagement bar even if everything functions:

1. **Spelling shows the answer** — she copies DINO letter by letter. This is the highest-severity issue. Priority fix.
2. **Count badges are a straight-up cheat code** — a 4-year-old finds this immediately. Priority fix.
3. **Subtraction visual is backwards** — 7 green fish + 2 gray fish → she taps 7 (the green ones). Teaches the wrong mental model.
4. **"Say It" and "Music" tiles visible but broken** — tapping "Play now" on a broken feature is confusing for a child who can't read "coming soon" labels.

### Dogfood nice-to-haves (log, do not block this plan)

- After completing several words, show a "word collection" of what she's spelled — Charlotte loves collecting things
- Dino unlock celebration could be bigger/fuller-screen for the flight context
- Letter choice buttons could be slightly larger on tablet portrait (current `aspect-square` in a 5-col grid may be marginal for fat-finger taps)
- Riddle-style clues should avoid words Charlotte can't read yet (keep them single-syllable or image-first)

---

## Excluded from this plan

- Audio improvements (ElevenLabs, phonics cues) — separate track
- New biomes or dino content
- Multiplayer / River mode
- Any backend/API changes
- Say It screen improvements (SpeechAdventureScreen.tsx)
- Music Den (MusicDenScreen.tsx)
