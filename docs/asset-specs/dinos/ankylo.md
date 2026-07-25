---
id: ankylo
name: Ankylosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/ankylo.svg
viewBox: "0 0 128 128"
silhouette_class: "ground-hugging armored wedge, ball club tail"
body_fill: "#C3D96B"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [stego, mammo]
countable: { element: tail segment bands, count: 5 }
---

# Ankylosaurus — asset spec

## 1. Identity in one line

"The low bumpy one with a big ball on its tail."

## 2. Silhouette contract

Filled flat black, this must read as a **long, low, smooth-topped armored loaf
on four short legs, with a tail that lifts up and back and ends in a solid
ball**. The read is *wide and heavy*, not tall.

Overall bounding box: **x 10 → 118, y 34 → 116**. The **body mass alone** is
only y 62 → 116 — 54 units deep against 96 units of width. Everything above
y = 62 is tail and club. Stance: **standing quadruped, belly close to the
ground, head carried low and level, no part of the back above y = 62.**

Ordered walk of the body, clockwise from the snout:

1. Snout tip **(10, 92)** — blunt, squared-off, not pointed. The head is the
   lowest forward mass in the roster.
2. Up the short blunt face to the top of the skull **(18, 82)**.
3. Across the flat skull roof to the back of the head **(30, 80)**. Head is a
   low wedge: ~22 long, ~14 deep.
4. Shallow neck rise to the shoulder **(38, 74)**.
5. **Back apex (58, 66)** — a single **broad, flat, smooth convex arc**. Total
   rise from shoulder to apex is only **8 units**. No spikes, no teeth, no
   scallops cut into this edge.
6. Long shallow descent to the hip **(80, 72)**.
7. Tail base **(88, 74)** — thickness at the base ≈ 20.
8. **The tail lifts.** It sweeps up and back along an arc through **(98, 62)**
   and **(106, 50)**, tapering to ≈ 12 thick, and terminates at the club neck
   **(108, 44)**.
9. **Club:** a solid ball centered **(105, 38)**, radius **12**. It is part of
   the same closed outline (a rounded lobe), or a separate closed circle
   overlapping the tail tip by 6 units — either is acceptable, but it must read
   as one solid mass, never as an outlined ring.
10. Return down the tail's underside through **(100, 56) → (92, 68) → (86, 84)**.
11. Hind leg: **(84, 86) → (84, 110)**, foot **(84, 112) → (68, 112)**, up
    **(68, 110) → (68, 92)**.
12. Belly: a nearly straight, low line **(68, 96) → (44, 98) → (38, 94)**. The
    belly-to-ground gap is only **14 units** — this is the ground-hugging read.
13. Fore leg: **(38, 96) → (38, 110)**, foot **(38, 112) → (24, 112)**, up
    **(24, 110) → (24, 88)**.
14. Chest **(22, 88)** to the throat **(14, 94)**, closed back to the snout tip.

Far-side legs are two extra closed shapes drawn behind the body, inset 8 units
and 3 units shorter, so four legs are visible.

Armor is applied as **separate closed shapes on top of the body**, never cut
into the outline: two rows of low rounded studs along the flank (each 8–10 units
across, sitting entirely inside the body outline) and one blunt rounded cheek
boss on each side of the head. **All armor is rounded. Nothing on this animal
comes to a point.**

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | position |
|---|---|---|
| Body loaf (snout→hip length) | ≥ 78 long, ≤ 34 deep | y 62–98 |
| Overall silhouette width | ≥ 96 | x 10–118 |
| **Tail club ball** | ≥ **22 diameter** (r ≥ 11) | centered ≈ (105, 38) |
| Lifted tail (hip → club neck) | ≥ 40 arc length, ≥ 12 thick at midpoint | x 86–110, y 42–76 |
| Head wedge | ≥ 22 long × ≥ 14 deep | x 10–32 |
| Each near-side leg | ≥ 14 wide × ≥ 18 tall | y 92–112 |
| Flank armor stud row (total span) | ≥ 40 wide | x 34–78 |
| Cheek boss | ≥ 10 across | x 20–30 |

The club is the single most important feature. If it renders below 22 units
across at 96 px, the asset fails outright.

## 4. Countable elements

Source: `dinos.ts` → `ankylo.practice.countPrompt` = **"Count five tail taps."**
Also `movePrompt`: "Make five strong tail taps."

The countable object is the **tail itself, banded into five segments** — the
child counts up the tail, one tap per band, arriving at the club.

- Required count: **exactly 5** bands, drawn as five stroke-divided armor rings
  crossing the tail between the hip (x ≈ 88) and the club neck (x ≈ 108).
- Bands sit at approximately **1/6, 2/6, 3/6, 4/6 and 5/6 of the tail arc**,
  centered near **(91, 71), (96, 64), (100, 57), (104, 50), (106, 44)**.
- Each band spans the **full thickness of the tail at that point: ≥ 18 units at
  the base band, ≥ 12 at the last band**. Each band is ≥ 3 units thick.
- Clear gap between adjacent bands along the tail arc: **≥ 8 units**.
- The club is **not** one of the five. Five bands, then the ball — six things,
  five of them countable as "taps."
- Bands are `#F5C55A` gold against the `#C3D96B` body so each one is separately
  visible at 96 px.

## 5. Stance and framing

- Ground line: **y = 112**. All four feet terminate on it.
- Stroke width **3**; every path coordinate must satisfy **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. The club's rightmost extent is 105 + 12 = **117**, plus
  1.5 stroke = 118.5, leaving **9.5 units** of clearance. Its top is 38 − 12 =
  **26**, plus stroke = 24.5.
- **No coordinate, control point, or curve handle may be negative or exceed 128
  — including off-curve control points.** Round 1 failed this exact test.
- Occupancy: ≈ 84% of frame width, ≈ 64% of frame height.
- At least 70% of the filled body area (excluding the tail and club) lies below
  y = 66. The animal is bottom-heavy by construction.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, club, legs | `#C3D96B` (reserved) |
| Tail bands (5) | `#F5C55A` gold |
| Flank armor studs, cheek boss | `#F5C55A` gold |
| Belly patch (x 24–68, y 90–98) | `#FFF4D5` cream |
| Eye white | `#FFF4D5` |
| Pupil and brow ridge | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

No greens borrowed from stego (`#78B94B`), no blues, no gradients.

## 7. Face treatment

Ankylosaurus is the **deadpan tank** — a small squinting eye set low and far
forward under a heavy brow, with a wide flat mouth.

- Eye: an ellipse **8 wide × 6 tall**, centered ≈ **(20, 86)** — set **low and
  forward**, near the snout, unlike every other species in the set, which carry
  the eye high.
- Brow: a thick `#503B32` armor ridge, **14 units long × 3 thick**, running from
  (14, 81) to (28, 80) directly over the eye and slightly overlapping its top —
  the eye reads as squinting out from under a helmet.
- Pupil: `r = 2` circle, the **smallest pupil in the roster**, centered in the
  eye. No highlight dot.
- Mouth: a **wide flat straight line**, 16 units, from (10, 96) to (26, 96),
  running the full width of the blunt snout, with a **small downward tick at the
  forward end**. Stoic, not smiling. **No smile arc anywhere on this face.**
- Nostril: one 2.5-unit dot at (12, 90).

Differentiators: the only low-and-forward eye placement, the only heavy brow
ridge overlapping the eye, the smallest pupil, and the only deliberately
non-smiling mouth in the set.

## 8. Forbidden

Round-1 failures for this species, to be corrected explicitly:

- **The body was spiky-backed — a stegosaur back on an ankylosaur.** Forbidden:
  any triangular spike, plate, zigzag, sawtooth or scallop on the dorsal line.
  The back is one smooth, low, convex arc rising ≤ 8 units from shoulder to
  apex. All armor is rounded and drawn *inside* the outline.
- **The tail club's control point sat at x = −4 and was clipped by the frame
  edge.** Forbidden: any coordinate or Bézier control point outside
  7.5 ≤ x,y ≤ 120.5. The club sits fully inside with ≥ 9 units of clearance and
  is verified including its stroke half-width.
- No pointed anything: no horn, no spike, no claw, no pointed tail tip.
- Do not drift toward **stego**: no plates standing above the back line, no
  tapering plain tail, no arched back. Ankylo's back is flat and its tail ends
  in a ball.
- Do not drift toward **mammo**: no shaggy shoulder hump, no trunk, no tusks, no
  long fur fringe on the belly, no tall shoulder. Ankylo's high point is at
  mid-back, not at the shoulder.
- No copied path data from any other asset with numbers perturbed.

## 9. Acceptance tests

1. Fill every path flat black at 96 px. A reviewer names it "Ankylosaurus" or
   "the one with the ball tail" without seeing color. **Pass/fail.**
2. Flat-black side-by-side against `stego.svg`: ankylo's dorsal line is smooth
   and its tail terminates in a **ball**; stego carries **three lobes above the
   back** and a tapering tail. Distinguishable at 96 px. **Pass/fail.**
3. Flat-black side-by-side against `mammo.svg`: ankylo's highest point is
   mid-back and it has no trunk, tusks or shoulder hump. Distinguishable at
   96 px. **Pass/fail.**
4. Count the gold tail bands: exactly **5**. **Pass/fail.**
5. Minimum clear gap between adjacent tail bands along the tail arc:
   **≥ 8 units**. Base band spans **≥ 18 units** across the tail. **Pass/fail.**
6. Tail club measures **≥ 22 units** across in both axes. **Pass/fail.**
7. Trace the dorsal line from shoulder (x 38) to hip (x 80): total rise
   **≤ 8 units**, no concave notch, no vertex under 150°. **Pass/fail.**
8. Every coordinate **and every Bézier control point** in the file satisfies
   7.5 ≤ value ≤ 120.5. Explicitly re-check the club and tail. **Pass/fail.**
9. Render at 96 px and inspect all four frame edges: no shape is cut. Round 1
   failed here. **Pass/fail.**
10. Body mass depth (y 62 → 112) ≤ 34 units while overall width ≥ 96 units.
    **Pass/fail.**
11. Each Section 3 feature meets its stated minimum size. **Pass/fail.**
12. Four legs are visible in the flat-black render. **Pass/fail.**
13. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
14. Diff the body path against every other delivered dino path: no shared
    sequence of three or more control points. **Pass/fail.**
