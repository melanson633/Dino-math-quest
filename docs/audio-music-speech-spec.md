# Audio, Music, And Speech Spec

Last updated: 2026-05-25

## Product Rule

Audio should make Dino Island more playful and easier to repeat aloud, but it must never make Charlotte wait, feel judged, or depend on a network request during play.

## Runtime Layers

1. Synthesized local tones
   - Always available.
   - Used for taps, success, retry, rhythm beats, and missing-asset fallback.

2. Reviewed static audio assets
   - Generated or recorded outside the child flow.
   - Stored under `artifacts/dino-math-quest/public/audio/`.
   - Played only after a user gesture and governed by the same mute state as tones.

3. Feature-flagged AI/audio prototypes
   - Off by default.
   - Parent-approved.
   - Never required for Math, Spelling, Speech, or Music to function.

## Music Direction

Music should land between Montessori calm and Sesame Street-like fun:

- Short, catchy, repeatable motifs.
- Clear beat patterns Charlotte can tap or say.
- Call-and-response phrases with simple words.
- No long intro animations or songs that block play.
- No overstimulating loops, harsh effects, or busy background layers.

Initial music moments:

- Math: "Count with Tri" three-beat count cue.
- Spelling: letter sound tap cue.
- Speech: modeled syllable rhythm cue.
- Dino Den: unlocked dino name chant.
- Reward: short sparkle or new-friend motif.

## Speech Interaction Rules

Speech practice is participation-first:

- Prompt with "Say it with me" or "Help Dino say it".
- Use syllable breaks and visible beat buttons.
- Allow one cheerful retry at most.
- Never say "I can't understand you".
- Never mark pronunciation wrong.
- Treat silence as an opportunity for another positive try, then move on.
- Live voice participation, when prototyped, can detect attempt/silence only.

Starter focus:

- `L`: la-la-lion, Lily-style tongue-up practice later if approved.
- `W`: wow, we won, water-style round-lip practice later if approved.
- Family names: Mama, Dada, River, Gracie, Max.
- Charlotte's name when added to spelling/speech content.

## Spelling Progression Rules

Spelling can advance faster than speech but should still stay playful:

- Start with high-confidence short words and family names.
- Use letter order, first sound, and missing-letter tasks before full spelling variety.
- Favor large letter tiles and visual clues over paragraph instructions.
- Wrong taps should reset gently or give a smaller next target.
- Repeated friction should silently lower word length or reduce distractor letters.
- Quick success can add longer words, blends, or harder distractors.

Starter word groups:

- Familiar: MAMA, DADA, MAX.
- Dino/game: DINO, TRI, EGG.
- Speech-support crossover: WOW, LION.
- Next: RIVER, DOG, MAP, STAR, HOME.

## Generated Audio Asset Rules

Any ElevenLabs-generated audio must be:

- Short.
- Scripted.
- Parent-reviewed before being added to normal gameplay.
- Stored as a static asset.
- Replaceable by local tone fallback.
- Documented with prompt, voice/model, date, and approval status.

Do not expose `ELEVENLABS_API_KEY` to client code.

## Acceptance Checks

For any audio-facing implementation:

- `pnpm --filter @workspace/dino-math-quest run typecheck`
- `$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build`
- Browser check with mute on and off.
- Confirm no audio starts before a child/adult gesture.
- Confirm Home navigation stops or contains background audio correctly.
- Tablet portrait smoke check, mobile portrait when quick.

