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

Overall bounding box: **x 10 → 118, y 34 → 116**. The **animal below the tail**
occupies only the bottom half of the frame — the torso, head and legs together
are ~54 units deep against 96 units of width, and the **torso alone is ≤ 34
deep**. Everything in the upper half of the frame is tail and club. Stance:
**standing quadruped, belly close to the ground, head carried low and level, and
no part of the back rising above the frame's midline.**

Ordered walk of the body, clockwise from the snout:

1. Snout tip — blunt, squared-off, not pointed. The head is the lowest forward
   mass in the roster.
2. Up the short blunt face to the top of the skull.
3. Across the **flat** skull roof to the back of the head. Head is a low wedge:
   ~22 long, ~14 deep.
4. Shallow neck rise to the shoulder.
5. **Back apex**, at roughly mid-back — a single **broad, flat, smooth convex
   arc**. Total rise from shoulder to apex is only **≤ 8 units**. No spikes, no
   teeth, no scallops cut into this edge.
6. Long shallow descent to the hip.
7. Tail base — thickness at the base ≈ 20.
8. **The tail lifts.** It sweeps up and back along a smooth arc, tapering to
   ≈ 12 thick, and terminates at the club neck. This lift is what puts the club
   in the upper half of the frame.
9. **Club:** a solid ball, radius **≥ 11**, at the end of the lifted tail. It is
   part of the same closed outline (a rounded lobe), or a separate closed circle
   overlapping the tail tip by ~6 units — either is acceptable, but it must read
   as one solid mass, never as an outlined ring.
10. Return down the tail's underside to the hip.
11. Hind leg: straight down from the hip to the foot, foot forward, then back up
    to the belly.
12. Belly: a nearly straight, low line forward to the chest. The belly-to-ground
    gap is only **~14 units** — this is the ground-hugging read.
13. Fore leg: same short straight column, foot forward, up to the chest.
14. Chest to the throat, closed back to the snout tip.

Far-side legs are two extra closed shapes drawn behind the body, inset 8 units
and 3 units shorter, so four legs are visible.

Armor is applied as **separate closed shapes on top of the body**, never cut
into the outline: two rows of low rounded studs along the flank (each 8–10 units
across, sitting entirely inside the body outline) and one blunt rounded cheek
boss on each side of the head. **All armor is rounded. Nothing on this animal
comes to a point.**

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | placement |
|---|---|---|
| Body loaf (snout→hip length) | ≥ 78 long, ≤ 34 deep **excluding legs** | lower half of the frame |
| Overall silhouette width | ≥ 96 | snout to club |
| **Tail club ball** | ≥ **22 diameter** (r ≥ 11) | end of the lifted tail, upper half of the frame |
| Lifted tail (hip → club neck) | ≥ **46** arc length, ≥ 12 thick at midpoint | hip up and back to the club |
| Head wedge | ≥ 22 long × ≥ 14 deep | front of the body, carried low |
| Each near-side leg | ≥ 14 wide × ≥ 18 tall | belly down to the ground line |
| Flank armor stud row (total span) | ≥ 40 wide | along the flank, inside the outline |
| Cheek boss | ≥ 10 across | side of the head, behind the eye |

The club is the single most important feature. If it renders below 22 units
across at 96 px, the asset fails outright.

## 4. Countable elements

Source: `dinos.ts` → `ankylo.practice.countPrompt` = **"Count five tail taps."**
Also `movePrompt`: "Make five strong tail taps."

The countable object is the **tail itself, banded into five segments** — the
child counts up the tail, one tap per band, arriving at the club.

- Required count: **exactly 5** bands, drawn as five stroke-divided armor rings
  crossing the tail between the hip and the club neck.
- Bands sit at approximately **1/6, 2/6, 3/6, 4/6 and 5/6 of the tail arc** —
  evenly spaced, marching up the tail toward the club.
- Each band spans the **full thickness of the tail at that point: ≥ 18 units at
  the base band, ≥ 12 at the last band**. Each band is ≥ 3 units thick.
- Clear gap between adjacent bands along the tail arc: **≥ 6 units**. *This is
  what sets the tail's ≥ 46-unit arc length:* five 3-unit bands plus four 6-unit
  gaps plus clearance at each end already consume ~40 units. A shorter tail
  cannot carry five countable bands.
- The club is **not** one of the five. Five bands, then the ball — six things,
  five of them countable as "taps."
- Bands are `#F5C55A` gold against the `#C3D96B` body so each one is separately
  visible at 96 px.

## 5. Stance and framing

- Ground line: **y = 112**. All four feet terminate on it.
- Stroke width **3**; every path point must satisfy **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. The club is the shape most likely to break this rule —
  it is round, it is the rearmost mass, and it is measured from its **outer
  edge plus the stroke half-width**, not from its center.
- **No path point, control point, or curve handle may be negative or exceed 128
  — including off-curve control points.** Round 1 failed this exact test.
- Occupancy: ≈ 84% of frame width, ≈ 64% of frame height.
- At least 70% of the filled body area (excluding the tail and club) lies below
  the frame's midline. The animal is bottom-heavy by construction.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, club, legs | `#C3D96B` (reserved) |
| Tail bands (5) | `#F5C55A` gold |
| Flank armor studs, cheek boss | `#F5C55A` gold |
| Belly patch — the underside between the fore and hind legs | `#FFF4D5` cream |
| Eye white | `#FFF4D5` |
| Pupil and brow ridge | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

No greens borrowed from stego (`#78B94B`), no blues, no gradients.

## 7. Face treatment

Ankylosaurus is the **deadpan tank** — a small squinting eye set low and far
forward under a heavy brow, with a wide flat mouth.

- Eye: an ellipse **8 wide × 6 tall**, set **low and forward**, near the snout —
  unlike every other species in the set, which carry the eye high on the skull.
- Brow: a thick `#503B32` armor ridge, **14 units long × 3 thick**, running
  directly over the eye and slightly overlapping its top — the eye reads as
  squinting out from under a helmet.
- Pupil: `r = 2` circle, the **smallest pupil in the roster**, centered in the
  eye. No highlight dot.
- Mouth: a **wide flat straight line**, 16 units, running the full width of the
  blunt snout below the eye, with a **small downward tick at the forward end**.
  Stoic, not smiling. **No smile arc anywhere on this face.**
- Nostril: one 2.5-unit dot at the snout tip, above the mouth.

Differentiators: the only low-and-forward eye placement, the only heavy brow
ridge overlapping the eye, the smallest pupil, and the only deliberately
non-smiling mouth in the set.

## 8. Forbidden

Round-1 failures for this species, to be corrected explicitly:

- **The body was spiky-backed — a stegosaur back on an ankylosaur.** Forbidden:
  any triangular spike, plate, zigzag, sawtooth or scallop on the dorsal line.
  The back is one smooth, low, convex arc rising ≤ 8 units from shoulder to
  apex. All armor is rounded and drawn *inside* the outline.
- **The tail club's control point sat outside the frame and was clipped by the
  edge.** Forbidden: any path point or Bézier control point outside
  7.5 ≤ x,y ≤ 120.5. The club sits fully inside the envelope and is verified
  including its stroke half-width.
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
   **≥ 6 units**. Base band spans **≥ 18 units** across the tail. **Pass/fail.**
6. Tail club measures **≥ 22 units** across in both axes. **Pass/fail.**
7. Trace the dorsal line from shoulder to hip: total rise **≤ 8 units**, no
   concave notch, no vertex under 150°. **Pass/fail.**
8. Every path point **and every Bézier control point** in the file satisfies
   7.5 ≤ value ≤ 120.5. Explicitly re-check the club and tail. **Pass/fail.**
9. Render at 96 px and inspect all four frame edges: no shape is cut. Round 1
   failed here. **Pass/fail.**
10. Torso depth **excluding the legs** ≤ 34 units, while overall silhouette
    width ≥ 96 units. **Pass/fail.**
11. Each Section 3 feature meets its stated minimum size. **Pass/fail.**
12. Four legs are visible in the flat-black render. **Pass/fail.**
13. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
14. Diff the body path against every other delivered dino path: no shared
    sequence of three or more control points. **Pass/fail.**
