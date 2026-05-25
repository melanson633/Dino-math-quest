# Dino Island Product Blueprint

Last updated: 2026-05-25

## Purpose

Dino Island is Charlotte's personal learning game world: a calm, joyful, tablet-first place where she chooses her own adventure instead of passive video/filler time, then builds math fluency, spelling, and speech confidence through play.

This document is the durable product north star for team threads. It should guide decisions without freezing the product. When implementation evidence contradicts an assumption, update this file with the smallest useful clarification.

## Product Thesis

Charlotte should be able to start at a familiar family home base, choose whether someone tags along, pick a learning area on Dino Island, and play independently with minimal adult reading or navigation help.

The game should feel:

- 65% Montessori-calm: clear, warm, uncluttered, predictable, confidence-building.
- 35% Sesame Street-like fun: catchy music, playful call-and-response, memorable characters, gentle humor, and rhythmic language.

The app is a Charlotte-first "Charlotte OS" rather than a generic school product. It can remain maintainable and extensible by keeping personalization, learning content, and activity variants data-driven.

## Primary User

Charlotte is a bright 4-year-old who mainly uses an iPad/tablet, sometimes a phone, and essentially never desktop.

Current known strengths:

- Counts confidently and can move ahead quickly in math.
- Reads basic books and can handle simple navigation text after first use.
- Spells and has strong visual memory.
- Loves music.

Current support needs:

- Speech clarity and confidence.
- Gentle practice with difficult sounds, especially `L` and `W`.
- Rhythmic word emphasis, syllable breaks, short repetition, and music-supported speech moments.

## Goals

1. Replace low-value filler screen time with independent educational play.
2. Improve the current Math Quest materially before broad expansion.
3. Add spelling and speech/music adventures in parallel with the architecture needed to sustain them.
4. Personalize the world around Charlotte, Mama, Dada, River, Gracie, and Max.
5. Keep the child-facing experience simple, smooth, and joyful even as the underlying system becomes more capable.

## Non-Goals

- No open-ended AI conversation for Charlotte.
- No punitive speech recognition or "I can't understand you" feedback.
- No complex menus, verbose adult-facing UI, or screens that require adult reading to play.
- No gamified pressure, timers that end runs, failure states, ads, accounts, social features, or in-app purchases.
- No broad desktop-first redesign.

## Current Implementation Status

The current local build has the Dino Island foundation in place: Family Home Base, 0-or-1 companion selection, YAML-weighted visible home companion activity variants, Math Quest, first playable Words, Say It, and Music sections, Dino Den friend-practice, section-specific companion participation across Math, Words, Say It, and Music, grown-up controls wired into speech/music play behavior, local silent adaptation, feature-flagged voice participation off by default, and a parent-reviewed static ElevenLabs asset pipeline. Words now includes phonics cues, syllable/rhythm prompts, and more family-centered spelling content; Math now includes child-countable Dino Island mini-scenes and visible count-trail badges for countable puzzle types; Music now makes the next beat visually explicit during ordered patterns; Say It now includes an interaction-driven turn-taking cue that starts on Dino modeling, hands the turn to Charlotte after a rhythm beat tap, and unlocks the next word after `I Tried`.

Math Quest has been materially improved from the first imported version and currently scores 76/100 against `docs/math-quest-rubric.md`. The experience now supports richer math variety, positive retry feedback, first-session dino reward timing, companion participation, Dino Den follow-through, child-readable context cues, compact island mission cues, and countable island visual scenes before answer tapping. Dino Den now gives unlocked friends a short confidence loop with Clap Name, Dino Song, Count, and Move actions plus a visible three-step friend-practice reward.

Local release-readiness validation passed on 2026-05-25 in Playwright Chromium at tablet `834 x 1112` and mobile `390 x 844`, with no console errors or warnings. Follow-up tablet/mobile walkthroughs also verified section-specific companion labels, Speech Light behavior, quiet Music cues, first-screen mobile Home Base navigation, Math Home testability, ordered Music Den beat matching, explicit Music next-beat cueing, Speech turn-taking cueing, Math context cues, Math island mission cues, Math island visual scenes, Math count-trail badges, Words spelling context cues, Dino Den empty/unlocked practice flow with direct empty-state Math routing, Dino Den friend-practice trail completion, grown-up controls persistence/reset behavior, and Home Base solo mascot containment. The repeatable child-playtest harness now includes a spelling word-bank audit, a source/content guardrail against discouraging speech-recognition copy, public audio manifest safety validation, Dino Den speech-math practice coverage, grown-up controls persistence and reset coverage, Math mission-cue coverage, Math visual-scene/count-trail coverage, Music next-beat coverage, interaction-driven Speech turn-taking coverage, and latest recorded pass of 60 pass, 0 warn, 0 fail. The harness also refuses non-Dino HTTP 200 responses before browser flow by checking for the Vite app entrypoint. Root `pnpm run typecheck`, `pnpm run build`, and `pnpm run build:replit` also passed. Real iPad Safari playtesting, parent approval for generated audio, and final family/avatar polish remain the next evidence gates.

## Core Experience

### Home Base

Each session begins at a family home base. Charlotte can:

- Pick 0 or 1 companion for the adventure.
- Choose a Dino Island learning area.
- Recognize options through stable visual icons, short labels, and familiar character imagery.

Family companions:

- Mama
- Dada
- River
- Gracie
- Max

Companions should be both emotional and mechanically meaningful over time. Start simple:

- Base home avatar.
- A few subtle home variants such as sleeping or cooking dinner.
- Action variants by learning area or task type.
- Optional short dialogue/audio moments when relevant.

The structure should support future expansion to multiple companions, but the live experience should allow 0 or 1 companion for now.

### Dino Island Areas

Initial target areas:

- Math Quest: improve first and use as quality benchmark.
- Spelling Adventure: simple words, letter sounds, phonics, and personalized names.
- Speech and Music: short "say it with me" moments, help-the-dino-say-it prompts, rhythm, syllable breaks, and songs.

The island should remain a game world, not a dashboard. Adult configuration can exist, but it should not dominate Charlotte's path.

## Learning Model

Math and spelling can advance more quickly than speech. Speech support should remain gentle, optional, positive, and confidence-based.

Difficulty should adapt silently:

- Move ahead when Charlotte succeeds quickly.
- Fall back when repeated friction appears.
- Avoid announcing failure, struggle, or remediation.
- Reward effort, persistence, and participation.

Speech interaction rules:

- Use positive reinforcement only.
- If silent or undecipherable, ask for one cheerful retry at most.
- Never say the app could not understand her.
- Treat voice recognition as participation detection first, not correctness scoring.

## AI, Voice, Music, and Personalization

AI scope is ambitious but bounded:

- AI may generate or help generate songs, sounds, and scripted content.
- AI voice/listening should be narrow, scripted, and feature-flagged until highly reliable.
- Open-ended AI character conversation is out of scope.
- ElevenLabs API integration should be researched for narrow voice/song/audio use cases.

Family photos:

- Start with placeholder character slots and schema.
- Replace or enhance avatars after family images are provided.
- Keep generated family likeness use opt-in and controlled.

## Content Architecture Direction

Prefer a coherent YAML/content schema for:

- Family companions and avatar variants.
- Learning activities, difficulty, and reward hooks.
- Speech prompts, music moments, and weighted variant triggers.

This should make it easy to tune focus areas and difficulty without scattering hard-coded product logic across components. The UI should expose only minimal, useful configuration entry points.

## Math Quest Quality Bar

Math Quest should become the benchmark for all future sections. Before major redesign, create a 100-point rubric grounded in this blueprint, then score the current app.

The rubric should cover:

- Independent child navigation.
- Tablet-first layout and touch ergonomics.
- Visual clarity and polish.
- Math content quality and progression.
- Feedback, reward, and confidence loop.
- Story/world integration.
- Audio/music contribution.
- Personalization and companion integration.
- Smoothness, performance, and reliability.
- Validation coverage.

For each category, define what a "10x better" experience feels like in practical terms. This does not mean multiplying the score; it means defining the target experience that would feel dramatically better to Charlotte and her parents.

## Validation Standard

Every meaningful child-facing change should pass:

- `pnpm run typecheck`
- `pnpm run build`
- Browser smoke/playtest at tablet portrait viewport.
- Mobile portrait check when quick.
- Flow-specific validation notes in the relevant task or handoff.

Smooth gameplay is a product requirement. Bugs, lag, blank screens, confusing navigation, and broken audio are high-priority issues.

## Team Operating Model

The orchestrator owns cross-thread synthesis and scope control.

Role threads should use:

- `AGENTS.md` as the first local instruction entry point.
- `docs/team-roster.md` for role boundaries.
- This PRD for product direction.
- `tasks/dino-island-build-task-list.md` for execution order once approved.

Threads should wait for explicit implementation instructions before changing files. If they start early, they may gather context from the current directory and brainstorm suggested next steps only.
