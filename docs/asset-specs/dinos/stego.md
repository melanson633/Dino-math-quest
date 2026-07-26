---
id: stego
name: Stegosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/stego.svg
viewBox: "0 0 128 128"
silhouette_class: "low quadruped, twin row of large rounded plates"
body_fill: "#78B94B"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [ankylo, iguano]
countable: { element: back plates, count: 3 }
---

# Stegosaurus — asset spec

## 1. Identity in one line

"The one with the big round plates on its back."

## 2. Silhouette contract

Filled flat black, this must read as a **long, low four-legged animal with a
smooth domed back carrying three large separate lobes standing above it**, tiny
head at the low front, thick tail at the low back.

Overall bounding box: **x 12 → 118, y 22 → 116**. Width ≈ 106, height ≈ 94, but
the *body mass alone* (excluding plates) is only y 48 → 116 — the body is a
wide, low slab and everything above y 48 is plate. Stance: **standing quadruped,
all four feet on one ground line**, head carried **below** the back line.

Two separate silhouette masses. This is the defining structural rule:

- **Mass A — the body.** One closed outline. Its back edge is a single **smooth
  convex arc with no notches, no teeth, no zigzag**.
- **Mass B — three plates.** Three independent closed shapes sitting on top of
  the back arc, overlapping it by ~6 units so they read as attached.

Ordered walk of Mass A, clockwise from the snout:

1. Snout tip — the lowest, leftmost point of the head.
2. Up the face to the top of the small skull, then a slight dip at the nape
   before the neck climbs.
3. Shoulder, then one **smooth continuous convex curve** to the hip, peaking
   near the middle of the back. No feature is cut into this edge.
4. Hip down to the tail base, then a taper rearward and slightly **upward** to a
   blunt tip. Tail base is roughly 2.5× the thickness of the tip.
5. Return along the tail underside to the haunch.
6. Hind leg down to the ground line, across the foot, and back up its front edge.
7. Belly runs forward, gently convex downward, to the fore leg.
8. Fore leg down to the ground line, across the foot, and back up.
9. Chest up to the throat, then closed back to the snout tip.

Far-side legs are drawn as two additional closed shapes **behind** Mass A, inset
rearward from their near-side partners and slightly shorter, so the silhouette
shows four legs, not two stubs.

Mass B is three independently drawn closed rounded shapes spaced along the back
arc: two flanking a taller centre plate, which peaks with the back. The two
outer plates sit slightly lower and are drawn slightly narrower than the centre
one — this staggering is how "twin row" is honored, not by adding plates. Plate
profile is a **rounded fan / leaf**: broad rounded top, waist narrowing toward
the base. It is **not** a triangle and **not** a spike.

**The total plate count is exactly three** (see Section 4).

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | placement |
|---|---|---|
| Body slab (nose→tail-tip length) | ≥ 100 long, ≥ 34 deep at the ribs | spans the frame width |
| Back plates (each) | ≥ 22 wide × ≥ 24 tall | standing above the back arc |
| Plate row total span | ≥ 52 wide | centred on the back |
| Tail | ≥ 26 long from hip, ≥ 16 thick at base | rear, above the ground line |
| Head | ≥ 20 long × ≥ 14 deep | front, carried below the back line |
| Each near-side leg | ≥ 16 wide × ≥ 26 tall | down to the ground line |
| Far-side leg pair (visible portion) | ≥ 12 wide × ≥ 22 tall | inset behind the near legs |

Anything listed above that lands under its minimum is treated as **absent** and
fails review.

## 4. Countable elements

Source: `dinos.ts` → `stego.practice.countPrompt` = **"Count three back plates."**
Also `movePrompt`: "Tap three sleepy plates awake."

- Required count: **exactly 3** plates. Not 4, not 5, not a decorative ridge of
  small bumps.
- Each plate is a separate closed path with its own visible stroke. No plate
  shares an edge with another plate.
- Clear gap between neighboring plates: **≥ 9 units** (≈ 7 px at 96 px render).
- All three plates are the same shape family and within 20% of each other in
  area, so none reads as "the big one and two decorations."
- A child pointing at 96 px must be able to land a fingertip on each plate
  independently: each plate's tappable area is ≥ 22 × 24 units.

## 5. Stance and framing

- Ground line: **y = 114**. All four feet terminate on it. Nothing except the
  stroke extends below y = 114.
- Stroke width **3**; therefore every path coordinate must satisfy
  **7.5 ≤ x ≤ 120.5** and **7.5 ≤ y ≤ 120.5**, and the spec's own bounding box
  (x 12–118, y 22–116) leaves ≥ 6 units of clearance on every edge before the
  stroke is applied.
- Occupancy: the sprite fills ≈ 83% of frame width and ≈ 73% of frame height.
- Silhouette weight sits **low**: at least 60% of the filled area is below
  y = 60.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs | `#78B94B` (reserved) |
| Back plates | `#F5C55A` gold |
| Belly patch (optional) | `#FFF4D5` cream |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

Far-side legs may use `#78B94B` at no reduced opacity; separate them from the
near legs with the stroke, not with transparency. No gradients, no filters.

## 7. Face treatment

Stegosaurus has the **smallest, sleepiest eye in the roster** — the head is tiny
and the face is calm and beaked.

- Eye: an ellipse **9 wide × 8 tall**, set high and far forward on the small
  skull.
- Lid: a straight horizontal upper lid cuts off the **top 30%** of the eye,
  giving a half-lidded, placid expression. No other dino in the set gets a
  straight-cut lid.
- Pupil: `r = 2.5` circle, positioned **low and forward** within the eye, not
  centered — the eye looks down toward the child.
- Mouth: a **short straight beak line**, ≥ 12 units long, running back from the
  snout tip with a single small upward tick at its rear end. Flat and beaked,
  **not an arc smile**.
- Nostril: one 2-unit dot near the snout tip, above the mouth line.

Differentiators: smallest eye of the four (9 units vs. brachi's 12 and plesi's
14-wide lens), the only straight-cut sleepy lid, the only flat beak-line mouth.

## 8. Forbidden

Round-1 failure for this species, to be corrected explicitly:

- **The back plates were drawn as a sawtooth zigzag cut into the body outline** —
  the same drawing vocabulary as spino's "sail" and ankylo's back. Forbidden:
  any triangular tooth, spike, or zigzag that is part of the body path. The back
  edge of the body is one smooth convex curve; plates are separate rounded
  closed shapes drawn on top of it.
- **Two open subpaths carried a fill, producing stray gold triangles.** Every
  filled path must be explicitly closed (`Z`). No open subpath may carry a
  `fill`. Zero floating gold fragments anywhere in the frame.
- No more or fewer than three plates.
- Do not drift toward **ankylo**: no ball or knob on the tail tip, no low
  ground-hugging armored wedge, no continuous armor band along the back.
- Do not drift toward **iguano**: no raised forelimb, no visible hand, no thumb
  spike, no semi-bipedal rear-heavy stance. Stego is on all fours, head low.
- No copied path data from any other asset with numbers perturbed.

## 9. Acceptance tests

1. Fill every path flat black at 96 px. A reviewer names it "Stegosaurus" or
   "the one with plates" without seeing color. **Pass/fail.**
2. Flat-black side-by-side against `ankylo.svg`: stego is taller-backed with
   three isolated lobes standing clear of the back line and a **plain tapering
   tail**; ankylo is lower, smooth-backed and ends in a **ball**. Distinguishable
   at 96 px. **Pass/fail.**
3. Flat-black side-by-side against `iguano.svg`: stego is a level four-legged
   slab with a head below its back line; iguano is rear-heavy with a visible
   forelimb and hand. Distinguishable at 96 px. **Pass/fail.**
4. Count the plate shapes: exactly **3**. **Pass/fail.**
5. Measure the minimum clear gap between neighboring plates: **≥ 9 units**.
   **Pass/fail.**
6. Each plate measures **≥ 22 × 24 units**. **Pass/fail.**
7. Trace the body path's back edge from shoulder to hip: it contains **no
   concave notch and no vertex forming an angle < 150°**. It is a smooth convex
   arc. **Pass/fail.**
8. Every path carrying a `fill` ends in `Z`. Count of open filled subpaths = 0.
   **Pass/fail.**
9. Four legs are visible in the flat-black render. **Pass/fail.**
10. Each Section 3 feature meets its stated minimum size. **Pass/fail.**
11. All coordinates lie within 7.5 ≤ x,y ≤ 120.5; no stroke is clipped by the
    frame. **Pass/fail.**
12. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps.
    **Pass/fail.**
13. Diff the body path against every other delivered dino path: no shared
    sequence of three or more control points. **Pass/fail.**
