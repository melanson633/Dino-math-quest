---
id: ptero
name: Pterodactyl
kind: dino
output: artifacts/dino-math-quest/public/dinos/ptero.svg
viewBox: "0 0 128 128"
silhouette_class: airborne, wide wing span, backswept head crest
body_fill: "#C77BB5"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [pachy, plesi]
countable: { element: wings, count: 2 }
---

## 1. Identity in one line

"The flying one with the huge wings!"

## 2. Silhouette contract

Ptero was the **one pass of round 1** — the wings were unmistakable, they spanned
**x = 11 to x = 116**, and it was the only silhouette a child would name
instantly. **That span is preserved verbatim.** The only silhouette change is the
head crest, which round 1 drew as a mass merging into the neck and shoulders and
which must now read as a clean backswept horn behind the skull.

Filled flat black this must read as **a flying animal seen from the front:
a narrow body hanging in the middle, two enormous wings stretched left and
right, a pointed beak up top, and a horn sweeping back off the head.**

Bounding box: **x 11–116, y 18–108.** **No ground line — this sprite is
airborne.** Facing **the viewer**, head turned slightly right. Stance:
**gliding, wings level and fully outstretched**, legs tucked and hanging.

Ordered walk of the outline, counter-clockwise starting at the left wingtip:

1. **Left wingtip (11, 42)** — the leftmost point of the sprite.
2. **Leading edge** sweeps right and slightly down through the **left wrist
   (21, 40)** and the **left elbow (35, 43)** to the **left shoulder (56, 52)**.
   This edge is gently convex — one long clean curve, no notches.
3. **Neck**: up from the shoulder to the **jaw hinge (65, 39)**. Neck run
   **≤ 16 units** long and ≤ 12 units wide.
4. **Lower jaw** runs forward and up to the **beak tip (85, 24)**.
5. **Upper jaw** returns back from the tip to the **skull dome (65, 30)**.
6. **Crest**: from the top-rear of the skull at **(67, 28)** a single tapering
   horn sweeps **up and back** (up and to the left) to a point at **(48, 18)**.
   Its underside returns to the skull at **(63, 33)**. See §3 #2 for the
   clearance rule that keeps it off the shoulders.
7. **Right shoulder (70, 52)**, reached down the back of the neck.
8. **Right leading edge** sweeps right through the **right elbow (91, 43)** and
   **right wrist (105, 40)** to the **right wingtip (116, 42)** — the rightmost
   point.
9. **Right trailing edge** returns from the tip toward the body through two
   concave scallops: down to (101, 60), scallop notch, out to (86, 66), scallop
   notch, in to the **right hip (71, 76)**.
10. **Right leg** hangs from (71, 78) down to a small foot at **(73, 96)**.
11. **Tail** drops from the body centre at (64, 80) to (66, 100), ending in a
    **small diamond vane** centred (66, 102).
12. **Left leg** hangs from (58, 78) down to a small foot at **(56, 96)**.
13. **Left trailing edge** runs from the **left hip (57, 76)** back out through
    two mirrored concave scallops: (42, 66), (26, 60), closing at the left
    wingtip (11, 42).

**Silhouette-critical proportions:**
- **Wing span ≥ 100 units** measured tip to tip (11 → 116 = 105). This is the
  single most important number in the file.
- Span is **≥ 6× the body width** (body ≈ 15 units at the shoulders).
- The two wings are **mirror-symmetric about x = 63** within **4 units** at every
  matched landmark (tip, wrist, elbow, scallop notches, hip). Asymmetric wings
  read as damage, not flight.
- **Nothing touches y = 114 or below.** No ground contact anywhere.

## 3. Required features

| # | Feature | Minimum size (viewBox units) | Position |
|---|---|---|---|
| 1 | **Wing pair** — two outstretched membranes | **span ≥ 100 units** tip to tip; each wing **≥ 42 units** long and **≥ 28 units** deep at the elbow | left x 11–56, right x 70–116, y 38–76 |
| 2 | **Backswept crest** — one tapering horn behind the skull | **≥ 24 units** long, **≥ 9 units** at the base, tapering to a point | base (67, 28) → tip (48, 18) |
| 3 | **Beak** — a long narrow pointed wedge | **≥ 24 units** from jaw hinge to tip, ≤ 14 units deep at the hinge | (65, 34) → tip (85, 24) |
| 4 | **Trailing-edge scallops** — 2 concave notches per wing | each notch **≥ 8 units** deep and **≥ 14 units** wide | left at x 26 and x 42; right mirrored at x 86 and x 101 |
| 5 | **Tucked legs** — two short hanging legs with feet | each **≥ 18 units** long, ≤ 7 units wide | (58, 78)→(56, 96) and (71, 78)→(73, 96) |
| 6 | **Tail with vane** | tail **≥ 20 units**; vane **≥ 12 units** tall × 9 wide | (64, 80) → vane at (66, 102) |

**Crest clearance rule (the round-1 fix):** the crest must have **≥ 12 units of
open background** beneath its full underside, separating it from the neck, the
left shoulder and the left wing's leading edge. Measured from the crest's
underside line (67, 28)→(48, 18) straight down to the nearest other filled path.
A crest that merges into the neck or shoulder mass — round 1's failure — is a
rejection. In the flat-black silhouette the crest must appear as a **separate
spur with sky visible under it.**

## 4. Countable elements

`practice.countPrompt` for Pterodactyl is **"Count twelve wing flaps."**

**A flap is a movement, and twelve is far too many for static art.** Twelve
separately countable objects at 96 px would each be under 8 units — below the
readability floor in the schema — and any attempt (twelve feathers, twelve
membrane ribs, twelve scallops) would destroy the clean wing edge that was the
one thing round 1 got right. The art must **not** contain twelve of anything.

The countable element in the art is the **wings: exactly two.**

- Count: **2**, exactly. One left, one right, mirror-symmetric about x = 63.
- Separation: the body column (x 56–70) sits between them, so the two wings are
  visibly separate masses joined by a narrow torso rather than one continuous
  bar. The torso must be **≤ 16 units wide** at the shoulders.
- Both wings must be fully inside the frame and unclipped, so both are countable.

Secondary fixed count, not narrated but reviewable: **exactly one** crest,
**exactly two** legs, **exactly two** scallops per wing.

`movePrompt` ("Flap twelve wide wing beats") is the child's body doing the
counting. The art's job is to give them two obvious wings to flap.

## 5. Stance and framing

- **No ground line.** Ptero is airborne. Nothing rests on or near y = 114; the
  lowest point of the sprite is the tail vane at y = 108.
- Occupancy: sprite fills **≥ 82%** of frame width — the widest sprite in the
  roster — and **≈ 70%** of frame height.
- **Minimum margin from every frame edge: 6 units**, to the outer edge of the
  stroke. No path coordinate outside x 8–120 or y 8–120. **The wingtips at
  x = 11 and x = 116 are the tightest points in the whole asset set** — with a
  3-unit stroke they render at 9.5 and 117.5, inside the margin. Do not widen the
  stroke on the wing outline beyond 3 units, and do not push the tips outward.
- Vertical placement: the sprite sits high in the frame (body centre y ≈ 60) with
  ≥ 18 units of empty space below the tail vane, so it reads as flying rather
  than standing.

## 6. Color plan

| Role | Fill |
|---|---|
| Body, head, beak base, neck, legs, tail, wing upper surface | `#C77BB5` (reserved) |
| Wing membrane inner panel — one panel per wing, inset ≥ 6 units from the leading edge | `#FFF4D5` cream |
| Crest and beak tip | `#F5C55A` gold |
| Eye white | `#FFF4D5` |
| Pupil, beak split line, all outlines | `#503B32` |

**The reserved body fill is now `#C77BB5`.** In round 1 ptero shared its body
fill exactly with `pachy`; that is fixed at the reservation level. Pachy is
`#8AA2E0` (blue) and ptero is `#C77BB5` (pink-violet). Under no circumstances may
this file use `#8AA2E0`, and the two must be distinguishable side by side as
thumbnails on color alone.

## 7. Face treatment

Pterodactyl is the **bright, alert, bird-eyed** face — the sharpest expression of
the four.

- **Eye:** the largest eye in this batch relative to the skull — a **circle
  11 units in diameter**, cream `#FFF4D5`, centred **(71, 32)**, set very far
  forward, right at the base of the beak. It dominates the head.
- **Pupil:** `#503B32`, **r = 3**, ringed by a **thin cream annulus** ≥ 1.5 units
  wide inside the eye white — the only ringed pupil in the roster, and what gives
  ptero its bird-bright look.
- **Lid:** a **sharp angled upper lid** — a straight stroked chord cutting the
  top-front quarter of the eye at roughly 30°, giving a keen, forward-focused
  expression. Angular, not curved.
- **Mouth:** **the beak split itself** — a single straight line **≥ 22 units**
  long running the full length of the beak from the hinge (65, 34) to the tip
  (85, 24). No separate mouth shape, no arc, no teeth.
- **Second eye:** not drawn; the head is a three-quarter turn to the right and
  the far eye is occluded by the beak.
- **How it differs:** biggest eye, only ringed pupil, only angular lid, and the
  only face whose mouth is a beak line rather than a drawn mouth. Against `pachy`
  (tiny eye under a straight brow bar, flat mouth) and `plesi` (small eye on a
  narrow snout) there is no shared element.

## 8. Forbidden

Round-1 `ptero.svg` **passed**. The dominant instruction for this asset is
**preserve what worked**; only the two named weaknesses change.

1. **Do not narrow the wings.** The x 11–116 span is the reason this asset
   passed. Any span under 100 units is a rejection, no matter what else improves.
2. **A crest that reads as a neck or shoulder mass.** Round 1's crest merged into
   the body and read as bulk rather than a horn. The crest must be a distinct
   backswept spur with ≥ 12 units of open background under it (§3 clearance
   rule). Forbidden: a crest pointing forward, a crest sitting on top of the
   skull like a fin, a crest fused to the neck, a crest under 24 units.
3. **`#8AA2E0` anywhere in the file.** Round 1 shared its body fill exactly with
   `pachy`. The reserved fill is now `#C77BB5`.
4. Twelve of any repeated element (see §4).
5. Feather detail, membrane ribs, or texture lines that break the clean leading
   edge. The leading edge is one unbroken convex curve per wing.
6. Asymmetric wings — mismatched tips, elbows, scallops or hips beyond 4 units.
7. Any ground contact, standing pose, folded wings, or perched stance.
8. Drift toward **pachy**: no dome, no knobs, no gold cap on the skull, no
   upright biped torso, no thick legs. Ptero's legs are ≤ 7 units wide and hang.
9. Drift toward **plesi**: no S-curved neck (ptero's neck is ≤ 16 units and
   straight), no hull-shaped body, no paddle flippers. Ptero's limbs are pointed
   wings with scalloped trailing edges, not rounded paddles.
10. Reusing, mirroring or perturbing another asset's path data.
11. A full-bleed sky rectangle behind the sprite — it composites over a biome.

## 9. Acceptance tests

1. Fill every path flat black. A reviewer names the silhouette "the flying one"
   or "pterodactyl" without a label. **PASS/FAIL**
2. Flat-black silhouette placed beside `pachy` and `plesi`: a reviewer picks
   ptero out of the three with no label. **PASS/FAIL**
3. Wing span measured tip to tip is **≥ 100 units** (target x 11 → 116).
   **PASS/FAIL**
4. Span is ≥ 6× the shoulder body width, and the torso is ≤ 16 units wide at the
   shoulders. **PASS/FAIL**
5. Left and right wings match within 4 units at tip, wrist, elbow, both scallop
   notches, and hip, mirrored about x = 63. **PASS/FAIL**
6. Exactly **two** wings, both fully inside the frame and countable as separate
   masses either side of the torso. **PASS/FAIL**
7. Crest is present, ≥ 24 units long, ≥ 9 units at the base, sweeping **up and
   back** from the rear of the skull. **PASS/FAIL**
8. ≥ 12 units of open background lie under the crest's full underside; in the
   flat-black silhouette the crest is a separate spur with visible sky beneath.
   **PASS/FAIL**
9. Each wing has exactly 2 trailing-edge scallops, each ≥ 8 units deep and
   ≥ 14 units wide; the leading edge has none. **PASS/FAIL**
10. The file contains no group of twelve repeated shapes. **PASS/FAIL**
11. Every feature in the §3 table meets its stated minimum. **PASS/FAIL**
12. Body fill is `#C77BB5`; `#8AA2E0` appears nowhere in the file. **PASS/FAIL**
13. Thumbnailed at 96 px beside `pachy`, the two are distinguishable on color
    alone. **PASS/FAIL**
14. Nothing in the sprite reaches y ≥ 110; ≥ 18 units of empty space sit below the
    tail vane. **PASS/FAIL**
15. Eye is an 11-unit circle with an r = 3 pupil, a cream annulus ≥ 1.5 units, and
    a straight angled upper lid. **PASS/FAIL**
16. Mouth is the beak split line ≥ 22 units; no separate mouth arc exists.
    **PASS/FAIL**
17. `viewBox="0 0 128 128"` exactly; no `width`, no `height`. **PASS/FAIL**
18. No `<image>`, raster, or data URI. **PASS/FAIL**
19. No `<text>` and no font reference. **PASS/FAIL**
20. No `<style>`, `class`, `<script>`, `<defs>`, or external `href`. **PASS/FAIL**
21. No opaque full-bleed background `<rect>`. **PASS/FAIL**
22. Stroke color is `#503B32`; joins and caps round; wing outline stroke ≤ 3
    units. **PASS/FAIL**
23. Every path including its stroke half-width lies within x 8–120, y 8–120 —
    both wingtips explicitly measured with stroke included. **PASS/FAIL**
24. Path data is not a copy or numeric perturbation of any other asset in
    `public/dinos/`. **PASS/FAIL**
