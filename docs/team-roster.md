# Dino Quest Team Roster

Last updated: 2026-05-25

## Purpose

This file keeps mega-thread roles coordinated without duplicating the main repo guidance. Every team thread should read `AGENTS.md` first, then this roster, then only the role-specific docs or source files needed for its task.

## Shared Context Entry Points

- Main repo guidance: `AGENTS.md`
- Product north star: `docs/product-blueprint.md`
- Approved execution plan, when active: `tasks/dino-island-build-task-list.md`
- Local setup and first exploration notes: `docs/local-exploration-notes.md`
- Research lane outputs: `research/`
- Charlotte-facing game app: `artifacts/dino-math-quest`
- Primary validation: tablet/iPad portrait, with mobile portrait when quick

## Current Handoff Status

The current local Dino Island scope is complete through P4 Math/Dino Den/Music/Speech hardening, including P4-009 through P4-013 in `tasks/dino-island-build-task-list.md`. Future threads should treat the app as a validated local foundation, then continue from the documented follow-ups: real iPad Safari playtest, child-observation tuning, approved static audio/avatar polish, bespoke visual polish, and deeper content variety.

Latest validation evidence is in `docs/local-validation-harness.md`, with the repeatable child-playtest currently at 60 pass, 0 warn, 0 fail plus root and Replit-routed builds passing. The child-playtest app handoff is now safer because it refuses non-Dino HTTP 200 responses before browser flow. The durable product state is summarized in `docs/product-blueprint.md`; avoid re-deriving the roadmap from older exploration notes unless comparing before/after behavior.

## Team Roles

### 1. Orchestrator

- Owner: this thread.
- Scope: directory structure, harness, team prompts, integration sequencing, cross-thread synthesis, and final scope control.
- Writes durable coordination notes here when team structure changes.
- Does not own large feature implementation unless needed to unblock the team.

### 2. Git Thread

- Scope: branch hygiene, diffs, commits when explicitly requested, GitHub/PR coordination, and preserving unrelated work.
- Expected hand-off: current branch/state, changed files, commit/PR status, conflicts, and any files that should not be touched by other roles.

### 3. Researcher Thread

- Scope: learning science, speech-support patterns, early childhood UX, gifted/advanced learner considerations, and practical evidence synthesis for Charlotte.
- Primary output location: `research/`.
- Expected hand-off: concise recommendations, confidence level, source notes when available, and implementation implications for design/code threads.

### 4. UI/UX Design Thread

- Scope: child-centered product design, tablet-first interaction design, visual system, feedback loops, speech-support affordances, and prototype-quality implementation guidance.
- Expected hand-off: prioritized design recommendations, screen-level specs, interaction states, accessibility/touch notes, and validation checklist.
- Should coordinate with Researcher before treating developmental assumptions as settled.

### 5. Code Review Thread

- Scope: review proposed or completed changes for correctness, regressions, maintainability, accessibility, local validation, and project fit.
- Expected hand-off: findings ordered by severity with file/line references, test gaps, and concrete fix recommendations.
- Should avoid broad redesign commentary unless it creates a real implementation risk.

### 6. Learning Design / Curriculum Thread

- Scope: translate research and Charlotte context into practical learning progression, content sequencing, speech-support moments, challenge pacing, and reward cadence.
- Expected hand-off: progression recommendations, content ideas, difficulty assumptions, confidence/speech-support opportunities, and implementation implications.
- Should coordinate with Researcher for evidence and UI/UX for how learning moments appear in play.

### 7. QA / Playtest Thread

- Scope: repeatedly verify the running game on tablet/mobile-sized viewports, explore child-facing flows, and catch regressions in usability, progression, audio, layout, and independent play.
- Expected hand-off: tested build/URL, viewport/device assumptions, flows exercised, issues found with reproduction steps, and recommended retest checklist.
- Should coordinate with Code Review on implementation risks and UI/UX on experience regressions.

## Handoff Format

Use this compact shape when a thread hands work back to the orchestrator:

1. Files read or changed
2. Key decisions or findings
3. Risks, blockers, or assumptions
4. Validation performed
5. Recommended next action

## Coordination Rules

- Prefer links to existing docs over copying context between role threads.
- Use `docs/product-blueprint.md` for product intent and `tasks/dino-island-build-task-list.md` for execution order after approval.
- Role threads should wait for explicit implementation instructions; if they want to get started before approval, they may only gather context from the current directory and brainstorm suggested next steps.
- Keep changes scoped to the active role unless a blocker requires a small adjacent fix.
- Do not alter global Codex, MCP, plugin, trusted project, or tool policy configuration.
- Preserve `data-testid` attributes and existing project conventions unless a role explicitly documents why a change is needed.
- Any child-facing change should be checked against Charlotte's likely tablet use, confidence, speech support, and independent play.
