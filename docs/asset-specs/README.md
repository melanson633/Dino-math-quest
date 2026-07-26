# Asset specs — schema and reservations

One spec file per asset. A spec is a **contract for an artist or a generator**: it
says what must be true of the finished SVG, in checkable terms. It is not a
description of a picture.

- Dino specs: `docs/asset-specs/dinos/<id>.md` (12)
- Biome specs: `docs/asset-specs/biomes/<id>.md` (4)
- Delivered art: `artifacts/dino-math-quest/public/dinos/<id>.svg`, `.../public/biomes/<id>.svg`

## Why this exists

The first generated set failed review. All twelve dinos were one drawing template
with jittered coordinates: the cream face blob, the `r="3"` pupil, the smile arc
and the two-leg stub were byte-near-identical across every file, and the body
outlines collapsed into **five** distinguishable silhouettes for twelve species.
Four of six theropod outlines were the same path with the horns deleted.

The root cause was that nothing reserved a distinct shape per species, so every
file drifted toward the same mean. **This schema fixes that by reserving the
silhouette class and the body color up front** (see Reservations below). A spec
author does not get to choose them, and therefore cannot collide with another
author working in parallel.

## Global constraints — every asset, no exceptions

1. `viewBox` exactly as reserved. **No `width` or `height` attributes.**
2. No `<image>`, no embedded raster, no data URIs.
3. No `<text>`, no font references. Numerals and words are rendered by the app.
4. No `<style>`, no `class`, no `<script>`, no `<defs>`, no external `href`.
5. No opaque full-bleed background `<rect>` on dino sprites — they composite over
   a biome.
6. Shared stroke color `#503B32`. Round joins and caps.
7. Every path must sit fully inside the viewBox **including its stroke half-width.**
   A stroke of width *w* on a path touching coordinate 0 renders at −*w*/2 and is
   clipped. Round-1 `ankylo.svg` clipped its tail club this way.
8. Hand-author each outline independently. Do not copy another asset's path and
   perturb the numbers. This is the failure being corrected.

## No prescribed coordinates

**A spec states sizes, counts, proportions and relationships — never the
coordinates that satisfy them.** The only numbers tied to the grid are
frame-level: the overall bounding box, the ground line, occupancy percentages,
and the stroke-clearance envelope in global constraint 7.

This is the second defect class the schema had to close. Reserving the
silhouette and body fill stops two *different* specs from converging, but says
nothing about whether one spec is internally solvable. Round 2's specs each
carried a coordinate walk *and* a minimum-size table written as two independent
passes, never solved against each other — so a spec could demand six splashes at
≥ 18 units wide inside a 128-unit frame, or place a snout tip outside its own
clipping envelope. An author following the numbers and an author following the
minimums produced different, and sometimes impossible, drawings. Codex halted on
this before authoring a single file.

Every quantity a spec states must therefore be **arithmetically checkable
against every other quantity in the same file.** Where N repeated elements have
a minimum size and a minimum gap, the spec must show the sum fits the frame and
say so inline, so the next author cannot silently raise one number past the
budget.

The biome motif tables are the deliberate exception, and they show what the
allowed use looks like: those x centers exist **because** the crop-safety rule
is stated as "which instances survive the `x 66–126` phone window," so each
number is the answer to a check rather than a drawing instruction. A coordinate
earns its place in a spec only when a stated test reads it.

## Palette

Structural: stroke `#503B32`, cream `#FFF4D5` (bellies, tusks, eye whites),
gold accent `#F5C55A`.

Body fills are **reserved one per dino** — see the table. No two dinos share a
body fill, so color is an independent identity channel from shape.

Biome fills come from a **separate background tier**: same hue family, but
lightened and desaturated so a sprite never sits on its own color. A `#78B94B`
Stegosaurus on a `#78B94B` jungle is invisible. Background tier values are named
in each biome spec.

## Reservations — do not deviate

| id | species | reserved silhouette class | body fill |
|---|---|---|---|
| stego | Stegosaurus | low quadruped, twin row of large rounded plates | `#78B94B` |
| ankylo | Ankylosaurus | ground-hugging armored wedge, ball club tail | `#C3D96B` |
| brachi | Brachiosaurus | extreme vertical, neck fills top half of frame | `#3F8F72` |
| plesi | Plesiosaurus | aquatic, S-neck over a hull body, flippers, no legs | `#55B7D9` |
| spino | Spinosaurus | biped, one continuous convex sail, long narrow snout | `#7B5EA7` |
| raptor | Velociraptor | small lean biped, forward pitch, long horizontal tail | `#F39A49` |
| trex | T-Rex | biped, massive head, thick counterbalance tail | `#C0553F` |
| carno | Carnotaurus | biped, two bull horns above the eyes, stub arms | `#EE8A9B` |
| iguano | Iguanodon | semi-quadruped, visible forelimb and hand, thumb spike | `#E8C15A` |
| mammo | Woolly Mammoth | four-legged shaggy hump, trunk and paired tusks | `#B96C47` |
| pachy | Pachycephalosaurus | biped, thick knobbed dome skull | `#8AA2E0` |
| ptero | Pterodactyl | airborne, wide wing span, backswept head crest | `#C77BB5` |

| id | biome | reserved viewBox | mood |
|---|---|---|---|
| jungle | Jungle | `0 0 192 128` | warm green, dense canopy |
| beach | Beach | `0 0 192 128` | pale sand, open water, bright |
| volcano | Volcano | `0 0 192 128` | warm dark, ember glow |
| ice-cave | Ice Cave | `0 0 192 128` | cool blue-violet, **no green anywhere** |

Biomes are landscape because a 1:1 source cropped `cover` to a 1280×800 desktop
loses the top and bottom 24 units — which is exactly where round-1 put every
identifying element.

## Dino spec schema

Frontmatter, then the numbered sections. Every spec uses all of them in order.

```yaml
---
id: stego
name: Stegosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/stego.svg
viewBox: "0 0 128 128"
silhouette_class: low-quadruped-plated
body_fill: "#78B94B"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [ankylo, iguano]
countable: { element: back plates, count: 3 }
---
```

1. **Identity in one line.** What a four-year-old says out loud when they see it.
2. **Silhouette contract.** The asset filled flat black must still be nameable.
   Describe the outline as an ordered **relational** walk — snout to brow, brow
   over the skull, skull down to the shoulder, shoulder up to the hip — naming
   the direction, the curvature and the proportion of each run. State the overall
   bounding box and the stance. This section is the primary deliverable — if it
   is vague the asset will fail.
3. **Required features.** Each defining anatomical feature, with a **minimum size
   in viewBox units** and a **relational placement** ("on the near foot, arcing
   up and forward", not "at (66, 108)"). A feature smaller than ~18 units does
   not read at 96 px and does not count as present. Round 1 failed here: the
   raptor's sickle claw was a ~10-unit notch.
4. **Countable elements.** The app narrates counting against the art —
   `dinos.ts` `practice.countPrompt`. If the prompt says "Count three back
   plates", the art must show **exactly three**, individually separated and
   countable at 96 px. Give the required count and spacing.
5. **Stance and framing.** Ground line, bounding box occupancy, minimum margin
   from every frame edge (see global constraint 7).
6. **Color plan.** Every fill by role, using the reserved body fill.
7. **Face treatment.** Eye shape and size, pupil, mouth, and **what makes this
   face different from the other eleven.** A single `r="3"` dot and a generic
   smile arc on every species is a round-1 failure; vary eye size, spacing, lid,
   and mouth shape by species and say how.
8. **Forbidden.** The specific round-1 failure for this species, quoted or
   described, plus anything that would drift it toward a neighbor.
9. **Acceptance tests.** Numbered, checkable, pass/fail. Must include:
   the flat-black silhouette test naming the two `nearest_neighbors` it must not
   be confusable with; the countable-element check; a check that every required
   feature meets its minimum size; and the global constraint list.

## Biome spec schema

Same frontmatter shape with `kind: biome`, then:

1. **Identity in one line.**
2. **Composition zones.** The frame divided into bands. Name what occupies each.
3. **UI safe zone.** Content sits over this art — a title pill, answer tiles, a
   letter tray. The region `x 60–132, y 30–100` must stay visually quiet: no
   high-contrast edge, no saturated shape, no dark stroke crossing it. Round 1
   put a gold diamond and a dark cone dead center.
4. **Crop safety.** The art is cropped differently on phone and desktop, so
   **no identifying element may be a single instance.** Every identity motif
   repeats at least three times across the full width, so any crop window
   contains one. Color banding, which survives all crops, carries primary
   identity.
5. **Contrast budget.** Background tier hexes only. State the intended contrast
   against the sprite tier. Max stroke width **2 units** — round 1 used 4, which
   renders as a ~40 px near-black line at desktop width.
6. **Color plan.**
7. **Forbidden.** Including the specific round-1 failure for this biome.
8. **Acceptance tests.** Numbered and checkable, including the safe-zone check,
   the repeat-motif check, the stroke-width cap, and distinctness from the other
   three biomes as thumbnails.

## What a spec is not

Not prose about mood. Not a prompt. Not a coordinate dump — see **No prescribed
coordinates**. Every requirement must be something a reviewer can hold the
finished SVG against and answer yes or no, and every requirement must be
satisfiable at the same time as every other requirement in the file.
