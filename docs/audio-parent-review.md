# ElevenLabs Parent Audio Review

Generated from `scripts/audio/elevenlabs-audio-manifest.json`.

Use this as a review worksheet before changing `approved_for_generation` or `approved_for_gameplay` in the source manifest. Do not expose generated files in the runtime public manifest until they have been listened to and explicitly approved.

## Safe Approval Sequence

1. Review the text and prompts below with an adult before changing any approval flags.
2. Set `approved_for_generation` to `true` only for specific items approved for candidate generation.
3. Run `pnpm --filter @workspace/scripts run elevenlabs:review` to validate the manifest and refresh this worksheet.
4. Run `pnpm --filter @workspace/scripts run elevenlabs:audio` to generate only approved candidates.
5. Listen to every generated file under `artifacts/dino-math-quest/public/audio/generated/`.
6. Set `approved_for_gameplay` to `true` only for files that are warm, clear, gentle, and parent-approved after listening.
7. Rerun `pnpm --filter @workspace/scripts run elevenlabs:audio`, then browser-check the game after a tap with sound muted and unmuted.

Guardrails: generated audio is optional, must stay static, and must never block Charlotte's play loop. If anything is missing or unapproved, the app should use local synthesized fallback sounds.

## Review Items

### tri-great-counting

- Kind: tts
- Use: Correct Math Quest answer
- Output: artifacts\dino-math-quest\public\audio\generated\tri-great-counting.mp3
- Generation approved: no
- Gameplay approved: no
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Great counting, Charlotte.
```

### tri-one-more-try

- Kind: tts
- Use: Gentle retry
- Output: artifacts\dino-math-quest\public\audio\generated\tri-one-more-try.mp3
- Generation approved: no
- Gameplay approved: no
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Good try. One more dino try.
```

### tri-new-friend

- Kind: tts
- Use: Dino reward screen
- Output: artifacts\dino-math-quest\public\audio\generated\tri-new-friend.mp3
- Generation approved: no
- Gameplay approved: no
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A new dino friend is here.
```

### tri-say-it-with-me

- Kind: tts
- Use: Speech prompt
- Output: artifacts\dino-math-quest\public\audio\generated\tri-say-it-with-me.mp3
- Generation approved: no
- Gameplay approved: no
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with me. La, la, lion.
```

### dino-soft-stomp

- Kind: sound_effect
- Use: Music or speech beat cue
- Output: artifacts\dino-math-quest\public\audio\generated\dino-soft-stomp.mp3
- Generation approved: no
- Gameplay approved: no
- Duration target: 1s
- Prompt influence: 0.35
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Soft playful baby dinosaur stomp, warm and gentle, not scary.
```

### sparkle-short

- Kind: sound_effect
- Use: Reward cue
- Output: artifacts\dino-math-quest\public\audio\generated\sparkle-short.mp3
- Generation approved: no
- Gameplay approved: no
- Duration target: 1s
- Prompt influence: 0.4
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Short warm sparkle chime for a preschool learning game.
```

### count-with-tri-song

- Kind: music
- Use: Short Math Quest counting celebration music bed
- Output: artifacts\dino-math-quest\public\audio\generated\count-with-tri-song.mp3
- Generation approved: no
- Gameplay approved: no
- Duration target: 8s
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A calm, cheerful preschool counting song for a dinosaur island game. Gentle hand-clap rhythm, warm marimba and ukulele, simple call-and-response energy, no vocals, no busy drums, Montessori calm with a little Sesame Street fun.
```

### wow-word-song

- Kind: music
- Use: Optional Say It rhythm support for W focus moments
- Output: artifacts\dino-math-quest\public\audio\generated\wow-word-song.mp3
- Generation approved: no
- Gameplay approved: no
- Duration target: 7s
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A gentle preschool word-practice music cue for W sounds. Warm xylophone, soft claps, simple two-beat pauses for repeat-after-me moments, encouraging and playful, no vocals, not overstimulating.
```

### lion-light-song

- Kind: music
- Use: Optional Say It rhythm support for L focus moments
- Output: artifacts\dino-math-quest\public\audio\generated\lion-light-song.mp3
- Generation approved: no
- Gameplay approved: no
- Duration target: 7s
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A soft preschool word-practice music cue for L sounds. Light bells, gentle clap breaks, clear rhythmic space for la-la-lion repetition, positive and calm, no vocals, no startling sounds.
```
