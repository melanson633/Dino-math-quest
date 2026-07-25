---
id: plesi
name: Plesiosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/plesi.svg
viewBox: "0 0 128 128"
silhouette_class: "aquatic, S-neck over a hull body, flippers, no legs"
body_fill: "#55B7D9"
accent_fills: ["#FFF4D5", "#F5C55A"]
nearest_neighbors: [brachi, spino]
countable: { element: ocean waves, count: 7 }
---

# Plesiosaurus — asset spec

## 1. Identity in one line

"The swimming one with flippers and a curvy neck, in the water."

## 2. Silhouette contract

Filled flat black, this must read as a **wide, low boat-shaped body with four
broad paddles and a curling S-neck, floating on a row of waves**. It is a
*swimmer*: horizontal, legless, and in contact with water rather than ground.

Overall bounding box: **x 8 → 122, y 26 → 118** (the wave band occupies
y 100 → 118). The **animal alone** is **x 8 → 122, y 26 → 100** — width ≈ 114,
height ≈ 74. **Width exceeds height by ≥ 40 units.** Stance: **horizontal
glide, hull level, neck rising from the front of the hull in a shallow S, head
carried up-left, tail a short stub at the rear.**

Ordered walk of the animal, clockwise from the snout:

1. Snout tip **(8, 40)** — leftmost point of the asset. The head is a small
   flat lozenge, ~22 long, ~11 deep, angled slightly up.
2. Skull roof back to **(26, 30)**.
3. **Neck, upper/back edge — the S.** From the back of the skull it curves down
   and right in a **convex-then-concave double curve**:
   **(32, 34) → (40, 48) → (48, 60) → (56, 66)** into the hull's front-top.
4. **Hull top:** one broad, shallow, convex lens curve —
   **(56, 66) → (72, 60) → (88, 60) → (102, 66)**. The hull is **50 units wide
   and 30 deep**, a boat/lens, not a barrel.
5. **Tail:** short and blunt, sweeping right from **(106, 70)** to a rounded tip
   **(122, 76)** and back to **(106, 82)**. Tail total length **≤ 18 units** —
   a stub, deliberately far shorter than the neck.
6. **Hull underside:** convex downward, **(102, 84) → (86, 92) → (70, 92) →
   (58, 84)**.
7. **Neck, lower/front edge:** rises left and up, mirroring the S at 15 units'
   offset — **(52, 72) → (44, 60) → (34, 46) → (24, 38)**.
8. Jaw underside **(20, 44)**, closed to the snout tip (8, 40).

Neck width, measured perpendicular: **12 at the skull, 16 at the hull join** —
narrow and even, roughly **0.5× the hull's 30-unit depth**.

**Flippers — four, and they are mass, not line.** Each is an independently
drawn **closed teardrop paddle**: narrow where it meets the hull, widening to a
broad rounded blade at the far end.

| flipper | attaches at | blade tip | length | max width |
|---|---|---|---|---|
| near fore | (64, 86) | (48, 104) | 28 | 16 |
| far fore | (72, 84) | (62, 98) | 22 | 13 |
| near hind | (94, 86) | (110, 104) | 28 | 16 |
| far hind | (88, 84) | (98, 98) | 22 | 13 |

The near pair angles **down and outward**; the far pair is shorter and drawn
behind the hull. All four blades are visible in the flat-black render.

**There are no legs.** No knee, no ankle, no foot, no toe, no vertical limb, no
ground contact. If any limb reads as a leg, the asset fails.

Below the animal, the **wave band** spans **x 8 → 122, y 100 → 118**: seven
rounded crests along its top edge, ends rounded and inset from the frame edges.
The band is a shape, not a background — its top edge is scalloped and its ends
do not touch the frame sides. The near flippers overlap into it by ~6 units, so
the animal is *in* the water.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | position |
|---|---|---|
| Hull body | ≥ 50 long × ≥ 28 deep | x 56–106, y 60–92 |
| Overall animal width | ≥ 112, and **≥ height + 40** | x 8–122 |
| S-neck length along centerline | ≥ 50 | (22,38) → (56,70) |
| Neck width | 12–16 (≤ 0.6× hull depth) | — |
| **Each near flipper** | ≥ **26 long × ≥ 14 wide blade** | see table above |
| Each far flipper | ≥ 20 long × ≥ 12 wide blade | see table above |
| Head lozenge | ≥ 20 long × ≥ 10 deep | x 8–28 |
| Tail stub | ≤ 18 long (a **maximum**) | x 106–122 |
| Wave band | ≥ 110 wide × ≥ 16 tall | x 8–122, y 100–118 |
| Each wave crest | ≥ 15 wide × ≥ 8 tall | along y 100–110 |

A flipper drawn as a stroke arc, or a flipper under 26 units long, counts as
**absent**. This is the exact round-1 failure.

## 4. Countable elements

Source: `dinos.ts` → `plesi.practice.countPrompt` = **"Count seven ocean waves."**
Also `movePrompt`: "Glide through seven soft waves."

- Required count: **exactly 7** wave crests, along the top edge of the wave band.
- Crest apex x-positions, evenly pitched at **16 units**: **x = 15, 31, 47, 63,
  79, 95, 111**. Apex height y ≈ 102; troughs between crests at y ≈ 110.
- Each crest: **≥ 15 wide × ≥ 8 tall** from trough to apex, so each is a
  distinct hump at 96 px (a 16-unit pitch renders as 12 px).
- The seven crests are the **only** wave-like shapes in the file. No extra
  ripple marks, no spray dots, no foam flecks — anything wave-shaped is
  counted by a four-year-old.
- Crests 3, 4 and 5 (x = 47, 63, 79) pass **behind** the hull and near flippers.
  Each of those must still show **≥ 10 units of its own apex clear of any
  overlapping shape**, so all seven remain individually countable.
- Wave band fill `#FFF4D5` cream with a `#503B32` stroke — cream reads as foam
  against the `#55B7D9` body and stays legible on every biome.

## 5. Stance and framing

- **There is no ground line.** The animal does not touch the bottom of the
  frame; the wave band does. The lowest animal ink is a near-flipper tip at
  **y = 104**, overlapping the water.
- Stroke width **3**; every coordinate and control point must satisfy
  **7.5 ≤ x ≤ 120.5** and **7.5 ≤ y ≤ 120.5**. The snout at x = 8 renders its
  stroke to 6.5; the tail tip at x = 122 renders to 123.5 — **pull the tail tip
  in to x = 119** so the stroke ends at 120.5. Same correction applies to the
  wave band ends: inset to x 10 and 118.
- Occupancy: ≈ 89% of frame width, ≈ 72% of frame height including water.
- The silhouette's long axis is **horizontal**: the least-squares axis through
  the animal's filled area lies within **20° of horizontal**.

## 6. Color plan

| role | fill |
|---|---|
| Hull, neck, head, tail, all four flippers | `#55B7D9` (reserved) |
| Belly / underside patch (x 60–100, y 84–92, and neck front edge) | `#FFF4D5` cream |
| Wave band and its seven crests | `#FFF4D5` cream |
| Optional dorsal highlight along the hull top | `#F5C55A` gold, ≤ 6 units thick |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

**No green anywhere in this file.** Round 1 put a green belly on a blue body —
the only cross-family color mix in the roster. The belly is cream. `#3F8F72`,
`#78B94B` and `#C3D96B` must not appear.

## 7. Face treatment

Plesiosaurus is the **sleek swimmer** — a long narrow eye and a long thin closed
jawline, streamlined, calm, nothing round about it.

- Eye: a **lens/almond shape, 14 long × 7 tall**, long axis horizontal, centered
  ≈ **(20, 36)**. It is the **widest eye in the roster but the shallowest** —
  the opposite proportion to brachi's 12-unit circle.
- Pupil: a **vertical oval, 3 wide × 5 tall**, at (19, 36). The only non-circular
  pupil in the set. No highlight dot.
- Lid: a shallow curved upper lid following the eye's top arc, coming to a point
  at the rear corner — the eye tapers backward like a fish's.
- Mouth: a **long thin closed line, 18 units**, running from the snout tip
  (8, 44) back along the jaw to (26, 41), with a **single small upward hook at
  the rear end only**. Sleek and closed. No teeth. **No smile arc.**
- Nostril: one 2-unit dot high on the snout at (12, 37).

Differentiators: the only horizontally-elongated eye, the only vertical-oval
pupil, the only tapering rear eye corner, and the only long jawline mouth.

## 8. Forbidden

Round-1 failures for this species, to be corrected explicitly:

- **The asset was brachi's land torso with two stroke arcs stuck on as
  "flippers" — no flipper mass, no paddle shape, no water.** Forbidden: any
  flipper drawn as a stroke, an arc, or an open path. All four flippers are
  closed filled teardrop paddles meeting the Section 3 minimums, and the wave
  band is mandatory.
- **A green belly on a blue body — the only cross-family color mix in the set.**
  Forbidden: any green hex in the file. The belly is `#FFF4D5`.
- **Shared geometry with brachi:** same start point `M18 ~90`, same neck-base
  notch, same closing curve. Forbidden: this file's outline starts at the snout
  tip **(8, 40)**, has no notch at the neck base (the neck meets the hull as a
  continuous curve), and closes at the jaw. It must not share three consecutive
  control points with `brachi.svg`.
- **Divergence contract with brachi — all four must hold:**
  1. plesi is **horizontal** (width ≥ 112, height ≤ 74, width − height ≥ 40);
     brachi is **vertical** (height 108 > width).
  2. plesi has **no legs and no ground contact**; brachi stands on four legs at
     y = 116.
  3. plesi's neck is a **shallow double-curve S laid over the water**, reaching
     up only to y ≈ 30 and forward to x = 8; brachi's neck **rises** to y = 8
     as a near-straight tapering column.
  4. plesi is blue `#55B7D9` in cream water; brachi is green `#3F8F72` on land
     with gold leaves.
- No legs, no feet, no toes, no knee bend, no vertical limb of any kind.
- Do not drift toward **spino**: no sail, no dorsal fin, no crocodilian snout
  with teeth, no bipedal stance, no splash plumes. Plesi's back is a smooth
  hull curve.
- No copied path data from any other asset with numbers perturbed.

## 9. Acceptance tests

1. Fill every path flat black at 96 px. A reviewer names it "Plesiosaurus" or
   "the swimming one with flippers" without seeing color. **Pass/fail.**
2. Flat-black side-by-side against `brachi.svg`: plesi is wider than tall, shows
   **four paddle blades and zero legs**, and sits on a wave band; brachi is
   taller than wide and stands on four legs. A reviewer must not confuse them at
   96 px, and neither silhouette can be overlaid on the other. **Pass/fail.**
3. Flat-black side-by-side against `spino.svg`: plesi has no sail, no biped
   stance, and a hull with paddles; spino has a continuous convex sail over a
   two-legged body. Distinguishable at 96 px. **Pass/fail.**
4. Count the wave crests: exactly **7**, pitch ≈ 16 units, each **≥ 15 wide ×
   ≥ 8 tall**. **Pass/fail.**
5. Crests 3, 4 and 5 each show **≥ 10 units of apex clear of the hull and
   flippers**. All seven are countable at 96 px. **Pass/fail.**
6. Count limbs: exactly **4 flippers, 0 legs**. Each flipper is a **closed
   filled path**; zero flippers are stroke-only or open. **Pass/fail.**
7. Near flippers measure **≥ 26 long × ≥ 14 wide** at the blade; far flippers
   **≥ 20 × 12**. **Pass/fail.**
8. Animal width − animal height **≥ 40 units**; long axis within **20° of
   horizontal**. **Pass/fail.**
9. No shape belonging to the animal touches y = 118 or any frame edge; the wave
   band is the only element in the bottom band, inset to x 10–118.
   **Pass/fail.**
10. Grep the file for `#3F8F72`, `#78B94B`, `#C3D96B` and any other green hex:
    **zero matches**. **Pass/fail.**
11. Diff `plesi.svg` against `brachi.svg` path by path: **no shared start point
    (this file starts at the snout, ≈ (8, 40)), no shared neck-base notch, no
    shared closing curve, no shared sequence of three or more control points.**
    This is a hard gate — it is the worst round-1 collision in the roster.
    **Pass/fail.**
12. Tail stub **≤ 18 units** and shorter than half the neck. **Pass/fail.**
13. Each Section 3 feature meets its stated minimum (or maximum, for the tail).
    **Pass/fail.**
14. All coordinates and Bézier control points satisfy 7.5 ≤ value ≤ 120.5,
    including the tail tip and the wave band ends. **Pass/fail.**
15. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; **no opaque
    full-bleed background `<rect>`** — the wave band is a scalloped, inset shape
    and must not span the full frame as a rectangle; stroke `#503B32` with round
    joins and caps; every filled path closed with `Z`. **Pass/fail.**
