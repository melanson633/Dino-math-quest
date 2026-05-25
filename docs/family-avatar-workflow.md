# Family Avatar Workflow

Purpose: let family companion art improve over time without changing the game flow or accidentally committing raw family photos.

## Current Runtime Assets

The app currently loads approved companion images from:

```text
artifacts/dino-math-quest/public/characters/
```

Runtime references live in:

```text
artifacts/dino-math-quest/src/content/dino-island.yaml
```

The YAML is the swap point. Update companion `homeVariants` and `actionVariants` there when replacing placeholders or adding new section-specific poses.

Current naming pattern:

```text
<member>-<variant>.png
```

Examples:

```text
mama-baseline.png
dada-helping.png
river-bouncer.png
gracie-baseline.png
max-baseline.png
```

## Source Image Handling

Raw family photos should stay out of the repo unless the user explicitly approves otherwise. If source images need to be staged near the project, use the ignored local folder:

```text
private-family-source/
```

Suggested source layout:

```text
private-family-source/
  mama/
  dada/
  river/
  gracie/
  max/
```

Use descriptive filenames such as:

```text
2026-05-25-front-smile.jpg
2026-05-25-side-play.jpg
```

## Approval Rules

- Do not generate, edit, stylize, or replace family likenesses without explicit user approval for that specific batch.
- Do not upload raw family photos to external services unless the user explicitly approves the destination and purpose.
- Keep outputs child-friendly, warm, and simple. Avoid uncanny realism, busy backgrounds, exaggerated expressions, or anything that distracts from the learning task.
- Add new variants gradually. The app supports 0 or 1 companion now; keep the YAML flexible for future expansion.

## Output Targets

For approved runtime assets:

- Put final app-ready files in `artifacts/dino-math-quest/public/characters/`.
- Prefer PNG for transparent or cutout-style assets; WebP can be considered later if asset size becomes a real performance issue.
- Keep the visible subject centered with enough padding for rounded UI containers.
- Use stable dimensions across variants for the same family member when practical.
- Keep filenames lowercase and hyphenated.

Recommended variant names:

```text
<member>-baseline.png
<member>-home-<activity>.png
<member>-math-<action>.png
<member>-spelling-<action>.png
<member>-speech-<action>.png
<member>-music-<action>.png
```

## Replacement Steps

1. Stage raw/source photos outside the repo or in `private-family-source/`.
2. Confirm the exact requested output variants with the user.
3. Generate or edit the approved app-ready assets.
4. Place only final approved runtime files in `artifacts/dino-math-quest/public/characters/`.
5. Update `artifacts/dino-math-quest/src/content/dino-island.yaml` variant `asset`, `label`, and `weight` values.
6. Run:

```powershell
pnpm --filter @workspace/dino-math-quest run typecheck
$env:PORT='25918'; $env:BASE_PATH='/'; pnpm --filter @workspace/dino-math-quest run build
```

7. Browser-check Home Base plus at least one learning section on tablet portrait. Confirm the avatar is not cropped, distorted, oversized, or visually distracting.

## Current Gap

The existing assets are enough for the current app structure, but Gracie and Max only have baseline variants. Future art work should add a small number of section/action variants before adding complex animation.
