---
title: Measure SVG asset clearances in rendered space, not fill space
date: 2026-07-25
category: conventions
module: asset-specs
problem_type: convention
component: documentation
severity: high
applies_when:
  - Writing or reviewing an asset spec that states a minimum gap, clearance, or separation between shapes
  - Specifying a count of repeated countable elements (puffs, footprints, splashes, bands, crests) inside a fixed frame
  - Reviewing generated SVG art against a spec that the art appears to satisfy on paper
tags: [svg, asset-specs, silhouette, stroke, spec-authoring, countable-elements, dino-math-quest]
---

# Measure SVG asset clearances in rendered space, not fill space

## Context

Dino Math Quest's twelve dino assets are authored from written specs in
`docs/asset-specs/dinos/`. Each spec states minimum gaps ("legs must be
separated by N units") and countable-element budgets ("ten roar puffs in two
rows of five"). The art is drawn as SVG paths on a 128×128 viewBox and stroked
with `stroke-width="3"`.

Three separate assets — `mammo`, `trex`, and `raptor` — were authored to spec,
reviewed as passing, and still failed the thing the spec existed to guarantee:
the child could not count the parts. `mammo`'s four legs read as three masses.
`trex`'s ten roar puffs fused into a single bar. One of `raptor`'s footprints
welded itself to the body. In every case the numbers in the spec were satisfied
and the rendered image was wrong.

Two authoring sessions (one Codex, one Claude Code) burned revision rounds on
this before the shared cause was named. It is not a drawing mistake — it is a
class of spec defect.

## Guidance

**1. State every clearance as a post-stroke measurement.**

A stroke is centered on the path, so `stroke-width="3"` outsets each edge by
1.5 units. Two stroked shapes lose **3 units** of the gap you drew between
their fill outlines. A spec rule written against fill coordinates silently
overstates the clearance the viewer actually sees by that same 3 units.

Write the rule the way the reader will experience it:

```
Bad:  Adjacent leg columns are separated by ≥ 3 units.
Good: Adjacent leg columns leave ≥ 6 units of background between their
      rendered outer stroke edges (so ≥ 9 units between fill edges at
      stroke-width 3).
```

This is now the wording in `docs/asset-specs/dinos/mammo.md:64` and
`docs/asset-specs/dinos/trex.md:119`.

**2. Solve countable-element budgets against the body and the frame before
publishing the count.**

A count is not a free parameter. `count × min_size + (count − 1) × min_gap`
must fit inside the run of background actually available — which is the frame
envelope *minus the body's footprint in that band*, not the full 128 units.

The dino frame's usable envelope is `7.5 ≤ x,y ≤ 120.5`, i.e. **113 units**,
because a stroke centered on x=7.5 lands its outer edge at x=6. Do the
arithmetic inline in the spec so the next author can see the ceiling rather
than rediscovering it.

**3. When the arithmetic does not close, change the count — not the gap.**

Cutting the gap to make a count fit reproduces the original failure at a
smaller scale. Cutting the count preserves countability, which is the actual
product requirement. Counts that appear in gameplay copy must follow the art:
`artifacts/dino-math-quest/src/lib/dinos.ts` carries the T-Rex `movePrompt`
("Do six quiet brave roars"), which had to move from ten to six with the puffs.

**4. Verify by rasterizing flat-black and counting connected components.**

Reading the SVG source cannot tell you whether two shapes merge. Render the
file to a canvas with every `fill` and `stroke` forced to `#000` and
`opacity="1"`, then run connected-component labeling at 32px and 64px. The
component count is the objective answer to "can a child count these?" — a
`trex` that resolves to 7 components (body + 6 puffs) passes; one that
resolves to 2 does not. This works headlessly and does not depend on anyone
looking at the image.

## Why This Matters

The silhouette test at 32px and 64px is the whole point of the asset spec —
Charlotte sees the dino small, on a tablet, and the countable elements are
part of the math. A spec that certifies geometry in a coordinate space the
renderer does not use produces art that passes review and fails the child.

The failure is also expensive in a way that compounds: because the spec was
internally consistent, each authoring agent concluded its own drawing was at
fault and burned revision rounds redrawing shapes that were already correct.
`mammo` consumed two full Codex revisions and stalled the session before the
measurement basis — not the art — was identified as the defect.

This is a distinct defect class from the one the spec schema was originally
written to fix. `docs/asset-specs/README.md` already bans prescribed
coordinate tables (the "No prescribed coordinates" section), because coordinate
walks and minimum-size tables were being written as two independent passes that
were never solved against each other. Removing the coordinates removed the
contradictory *positions* but left the count × size × gap budgets unsolved
against the body geometry. Both classes share a root: **a spec asserted
geometry it never checked against the space that geometry has to occupy.**

## When to Apply

- Any spec rule containing "gap", "clearance", "separation", "clear of", or a
  minimum distance between two drawn shapes.
- Any spec that fixes a count of repeated elements inside a bounded frame.
- Reviewing art that "meets the spec" but fails a visual or silhouette check —
  suspect the spec's measurement basis before suspecting the art.
- Changing `stroke-width` on an existing asset family: every stated clearance
  is now wrong by the delta, in both directions.

## Examples

**trex — the count did not fit the band.**

The roar puffs sit in a band above the body that clears the tail and crown;
that band is roughly 66 units wide. Five puffs per row at the spec's minimum
size, with post-stroke gaps, needs about 82 units of run. The spec asked for
two rows of five. Reduced to **two staggered rows of three**, which fits with
3.2 units of post-stroke background between puffs in a row and 4.0 between
rows. The asset now rasterizes to 7 connected components.

**raptor — the frame itself was too small for the stated minimums.**

The near footprint row shares the ground band with the body, which occupies
roughly x 55 to x 105 — leaving about 43 usable units, not 113. Six prints at
the spec's `≥ 12 wide` floor plus post-stroke gaps needs 119 units against a
113-unit envelope, so the post-stroke rule was **not achievable at any
placement**. Resolution: prints reduced from 10 to 8, the width floor relaxed
to 11, the near row cut to a single pair placed left of the legs, and the far
row lifted 3 units to clear the tail. Because the post-stroke reading cannot
fit, `docs/asset-specs/dinos/raptor.md:249` explicitly records that raptor's
pair gaps are measured fill-edge to fill-edge and says why — an exception
that is documented rather than silently taken.

**mammo — the gap closed entirely under the stroke.**

The rear leg pair had a 2-unit fill gap. At `stroke-width="3"` the two strokes
overlap, so the gap did not merely shrink — it disappeared, and four legs
rendered as three masses. Respaced to 9-unit fill gaps, leaving 6 post-stroke.

Note one honest consequence: `mammo.md` previously carried a rule requiring
≥ 26 units of empty ground *between the front foot group and the rear foot
group*. Grouping into two pairs and separating all four legs cannot both fit
under a 75-unit body, so that rule was dropped in favor of the per-pair
post-stroke minimum. Changing a spec to fit the art is a real risk in this
workflow — it is acceptable only when the old rule is arithmetically
impossible, and it should be called out in the change rather than absorbed.

## Related

- `docs/asset-specs/README.md` — the schema, the "No prescribed coordinates"
  rule, and the sibling defect class.
- `docs/asset-specs/dinos/mammo.md`, `trex.md`, `raptor.md` — the three specs
  restated in post-stroke terms.
- [PR #4](https://github.com/melanson633/Dino-math-quest/pull/4) — the change
  that authored the assets and repaired these specs.
