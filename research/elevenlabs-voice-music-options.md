# ElevenLabs Voice And Music Options

Last checked: 2026-05-25

## Scope For Dino Island

Use ElevenLabs for parent-approved, scripted audio assets and experiments, not for open-ended live conversation with Charlotte.

Best first use:

- Pre-generate short dino phrases such as "Great counting" or "Say it with me".
- Pre-generate a few section identity sounds or dino sound effects.
- Store generated audio as static assets in the app and play them after a user gesture.
- Keep local synthesized tones as the fallback when generated assets are missing, muted, offline, or not approved yet.

Do not use yet:

- Live network generation during Charlotte's normal gameplay.
- Open-ended voice agents or improvised character dialogue.
- Speech correctness scoring.
- Long-form generated songs that slow down iteration or increase review burden.

## Current Official API Notes

The ElevenLabs Text to Speech capability supports multiple models. The docs currently position `eleven_flash_v2_5` for low-latency interactive use, `eleven_multilingual_v2` for stable longer speech, and `eleven_v3` for more expressive performance. For this app, default to a stable or fast model for UI phrases and reserve highly expressive models for parent-reviewed songs or character moments.

Streaming is available through the Text to Speech API, but Dino Island should not need streaming in Charlotte's child flow at first. Static asset generation is safer for iPad reliability, cost control, and adult approval.

The Sound Effects API can generate short effects from text prompts. This is a fit for non-speech cues such as soft dino stomps, chimes, or section sounds, provided the generated output is reviewed before shipping.

Sources:

- ElevenLabs Text to Speech overview: https://elevenlabs.io/docs/overview/capabilities/text-to-speech
- ElevenLabs streaming API reference: https://elevenlabs.io/docs/api-reference/streaming
- ElevenLabs models docs: https://elevenlabs.io/docs/models/
- ElevenLabs sound effects overview: https://elevenlabs.io/docs/capabilities/sound-effects/
- ElevenLabs sound generation API reference: https://elevenlabs.io/docs/api-reference/sound-generation/

## Recommended Integration Shape

Add a repo-local generation script rather than browser-side API calls.

Input:

- A reviewed manifest of short phrases and sound prompts.
- Voice/model IDs selected by an adult.
- Output filenames and intended app locations.

Output:

- Static `.mp3` or `.wav` files under `artifacts/dino-math-quest/public/audio/`.
- A generated or maintained manifest consumed by the app.
- Provenance metadata recording prompt text, model, voice, date, and approval state.

Runtime behavior:

- Child-facing app only fetches local audio assets.
- If a file is missing, use `src/lib/audio.ts` synthesized fallback.
- Audio playback remains gated behind a user gesture.
- Mute must silence generated assets and synthesized tones together.

Environment:

- Use `ELEVENLABS_API_KEY` from the host environment or repo-local `.env`.
- Never expose the API key to Vite client code.
- Do not log the key or generated request headers.

## Initial Asset Manifest Proposal

Start with a tiny parent-reviewable set:

| Id | Type | Text or prompt | Use |
| --- | --- | --- | --- |
| `tri-great-counting` | tts | Great counting, Charlotte. | Correct Math Quest answer |
| `tri-one-more-try` | tts | Good try. One more dino try. | Gentle retry |
| `tri-new-friend` | tts | A new dino friend is here. | Dino reward screen |
| `tri-say-it-with-me` | tts | Say it with me. La, la, lion. | Speech prompt |
| `dino-soft-stomp` | sound-effect | Soft playful baby dinosaur stomp, warm and gentle, not scary. | Music/Speech beat cue |
| `sparkle-short` | sound-effect | Short warm sparkle chime for a preschool learning game. | Reward cue |

## Risks And Boundaries

- Cost and quota: keep generated copy short and cache outputs as files.
- Review burden: do not generate large libraries before the app proves the interaction.
- Reliability: avoid live API dependency during iPad play.
- Safety and tone: all text prompts must be adult-reviewed and positive-only.
- Likeness/voice consent: do not clone family voices without explicit user approval.
- Latency: static assets beat streamed generation for this product phase.

## Non-Blocking Prototype Path

1. Add `audio/manifest.yaml` for reviewed phrase and sound IDs.
2. Add a PowerShell-friendly script under `scripts/` that reads the manifest and writes static audio files.
3. Add `public/audio/manifest.json` or a typed app manifest.
4. Update `src/lib/audio.ts` to play manifest assets when present and synthesized tones otherwise.
5. Validate in browser with muted/unmuted paths and iPad-style user gesture gating.

