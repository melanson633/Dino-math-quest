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

### tap-soft

- Kind: sound_effect
- Use: Touch feedback
- Output: artifacts\dino-math-quest\public\audio\generated\tap-soft.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 1s
- Prompt influence: 0.3
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
One tiny warm wooden tap for a preschool learning game, soft and friendly, no click harshness.
```

### success-sparkle

- Kind: sound_effect
- Use: Correct-answer celebration
- Output: artifacts\dino-math-quest\public\audio\generated\success-sparkle.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 1s
- Prompt influence: 0.35
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A very short warm sparkle chime for a preschool learning game, gentle marimba and a tiny twinkle, happy but not loud.
```

### try-again-leaf

- Kind: sound_effect
- Use: Gentle retry cue
- Output: artifacts\dino-math-quest\public\audio\generated\try-again-leaf.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 1s
- Prompt influence: 0.35
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A tiny gentle leaf-rustle and warm rising bell for a preschool learning game, encouraging, never sad or buzzy.
```

### dino-three-beat

- Kind: sound_effect
- Use: Speech and music rhythm cue
- Output: artifacts\dino-math-quest\public\audio\generated\dino-three-beat.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 1s
- Prompt influence: 0.4
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Three soft playful baby dinosaur foot taps with a light wooden drum beat, warm, clear rhythm, not scary.
```

### phonics-pop

- Kind: sound_effect
- Use: Correct letter feedback
- Output: artifacts\dino-math-quest\public\audio\generated\phonics-pop.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 1s
- Prompt influence: 0.35
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A tiny gentle two-note marimba pop for a preschool phonics game, warm and clear, no harsh click.
```

### new-dino-friend

- Kind: tts
- Use: Dino unlock
- Output: artifacts\dino-math-quest\public\audio\generated\new-dino-friend.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A new dino friend is here!
```

### biome-discovery

- Kind: tts
- Use: Biome unlock
- Output: artifacts\dino-math-quest\public\audio\generated\biome-discovery.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A new island is ready to explore!
```

### island-play-song

- Kind: music
- Use: Optional Music Den one-shot
- Output: artifacts\dino-math-quest\public\audio\generated\island-play-song.mp3
- Generation approved: yes
- Gameplay approved: yes
- Duration target: 7s
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
A seven-second calm, cheerful instrumental preschool discovery cue for a dinosaur island game. Gentle hand-clap rhythm, warm marimba, ukulele, one light sparkle, no vocals, no big drums, no long intro, Montessori calm with a little Sesame Street joy.
```

### speech-l-lion

- Kind: tts
- Use: Modeled L phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-l-lion.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. La, la, lion.
```

### speech-w-wow

- Kind: tts
- Use: Modeled W phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-w-wow.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. Wow, we won!
```

### speech-w-love

- Kind: tts
- Use: Modeled W and L phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-w-love.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. We love Dino.
```

### speech-l-little

- Kind: tts
- Use: Modeled L phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-l-little.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. Little lion.
```

### speech-w-walk

- Kind: tts
- Use: Modeled W phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-w-walk.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. Max walks with me.
```

### speech-max-name

- Kind: tts
- Use: Modeled family phrase
- Output: artifacts\dino-math-quest\public\audio\generated\speech-max-name.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Say it with Dino. Max says mama.
```

### word-dino

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-dino.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Dino. Di-no.
```

### word-mama

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-mama.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Mama. Ma-ma.
```

### word-dada

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-dada.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Dada. Da-da.
```

### word-max

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-max.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Max.
```

### word-dog

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-dog.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Dog.
```

### word-we

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-we.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
We.
```

### word-wow

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-wow.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Wow!
```

### word-home

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-home.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Home.
```

### word-love

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-love.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Love.
```

### word-lion

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-lion.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Lion. Li-on.
```

### word-walk

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-walk.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Walk.
```

### word-river

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-river.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
River. Ri-ver.
```

### word-charlotte

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-charlotte.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Charlotte. Char-lotte.
```

### word-gracie

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-gracie.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Gracie. Gra-cie.
```

### word-count

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-count.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Count.
```

### word-beach

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-beach.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Beach.
```

### word-ocean

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-ocean.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Ocean. O-cean.
```

### word-shell

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-shell.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Shell.
```

### word-shark

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-shark.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Shark.
```

### word-plane

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-plane.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Plane.
```

### word-cloud

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-cloud.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Cloud.
```

### word-frog

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-frog.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Frog.
```

### word-bird

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-bird.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Bird.
```

### word-star

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-star.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Star.
```

### word-cake

- Kind: tts
- Use: Spelling word model
- Output: artifacts\dino-math-quest\public\audio\generated\word-cake.mp3
- Generation approved: yes
- Gameplay approved: yes
- Parent review:
  - [ ] Text/prompt fits Charlotte and the app tone
  - [ ] Voice/sound is warm, clear, and not overstimulating
  - [ ] Approved to generate
  - [ ] Approved for gameplay after listening

```text
Cake.
```
