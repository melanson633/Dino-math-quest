---
id: brachi
name: Brachiosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/brachi.svg
viewBox: "0 0 128 128"
silhouette_class: "extreme vertical, neck fills top half of frame"
body_fill: "#3F8F72"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [plesi, iguano]
countable: { element: tall leaves, count: 4 }
---

# Brachiosaurus — asset spec

## 1. Identity in one line

"The tallest one — its neck goes all the way up to the leaves."

## 2. Silhouette contract

Filled flat black, this must read as a **giant standing on four pillar legs with
a neck rising almost to the top of the frame**. The frame is filled top to
bottom by one animal. Verticality is the entire identity.

Overall bounding box: **x 18 → 118, y 9 → 116**. Height ≈ 107 (84% of frame),
width ≈ 100. Stance: **standing quadruped on four straight columnar legs, front
shoulder higher than the hip, back sloping down toward a short tail, neck
climbing up and to the left.**

The single hard geometric rule: **the head-and-neck column is at least 66 units
tall — ≥ 52% of the frame height, running from the top band down to the
shoulder — while the neck's maximum width is 22 units, at most 0.6× the torso's
38-unit depth.** A neck that is short, or as thick as the body, produces the
round-1 swan and fails.

Ordered walk, clockwise from the top of the head:

1. Crest apex — the domed nasal crest, **the highest point of the asset**.
   Rounded, not a spike.
2. Forward and down the face to the snout tip. Head is a small boxy wedge,
   ~22 long, ~16 deep — the head is **smaller than one foot**.
3. Jaw underside back to the throat.
4. **Neck, front edge:** a long shallow S descending toward the chest — gently
   concave at the top, convex at the base.
5. Chest.
6. Belly, **nearly flat**, running back to the hip.
7. Hip underside.
8. **Tail:** short and thin, sweeping rearward and slightly down to a tapered
   tip, then back along its top edge to the hip. Tail total length ≤ **26
   units — no more than 40% of the neck's length.**
9. Back line, hip forward to the shoulder and **rising**. The shoulder is
   **≥ 10 units higher than the hip** — the classic brachiosaur downslope.
10. **Neck, back edge:** climbs from the shoulder up to the back of the skull,
    closing at the crest apex.

Neck width measured perpendicular: **≤ 22 at the base**, **≤ 16 at the top**. It
tapers upward continuously — no uniform-width tube.

Legs are four separate closed shapes drawn behind the torso outline, straight
and columnar with no knee bend:

| leg | width | height | placement |
|---|---|---|---|
| near fore | 18 | 28 | under the shoulder, frontmost |
| far fore | 14 | 26 | behind and slightly forward of the near fore |
| near hind | 16 | 24 | under the hip |
| far hind | 12 | 22 | behind and slightly forward of the near hind |

Every foot terminates on the ground line; the far legs are inset so all four
read as separate columns in flat black.

**The forelegs are longer than the hind legs** (28 vs. 24 units) — this is what
lifts the shoulder above the hip and is a required, checkable trait.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | placement |
|---|---|---|
| **Head + neck column height** | ≥ **66 tall** | top band down to the shoulder |
| Neck length along its centerline | ≥ 58 | throat to chest |
| Neck width | ≤ 16 top, ≤ 22 base — **must taper ≥ 6 units** | — |
| Torso | ≥ 40 long × ≥ 34 deep | shoulder to hip, right of the neck |
| Each of 4 legs | ≥ 12 wide × ≥ 22 tall; near legs ≥ 16 × 26 | body down to the ground line |
| Foreleg−hindleg length difference | ≥ 4 units, forelegs longer | — |
| Shoulder above hip | ≥ 10 units | — |
| Head with nasal crest | ≥ 22 long × ≥ 18 deep including crest | top of the neck column |
| Tail | ≤ 26 long (a **maximum**, not a minimum) | behind the hip |
| Each countable leaf | ≥ 18 long × ≥ 12 wide | upper right, clear of head and neck |

## 4. Countable elements

Source: `dinos.ts` → `brachi.practice.countPrompt` = **"Count four tall leaves."**
Also `movePrompt`: "Reach for four leafy snacks." And `fact`: "Its long neck
reached the highest leaves!"

- Required count: **exactly 4** leaves. Not three, not a bushy cluster.
- The leaves hang in the **upper right quadrant** — up where the head has
  reached, on the far side of the neck from the face. They must **not** overlap
  the head and must not touch the neck outline.
- Arrange the four in a **loose diamond** (one high, two at mid height, one
  lower), long axis of each leaf roughly vertical. A tight 2×2 grid does not fit
  the quadrant once the ≥ 8-unit gaps are honoured.
- Each leaf: a closed pointed-oval shape **≥ 18 long × ≥ 12 wide**, on a short
  stem.
- Clear gap between adjacent leaf outlines: **≥ 8 units**.
- Leaves are `#F5C55A` gold with a `#503B32` stroke — **never green**, because a
  `#3F8F72` leaf on a `#3F8F72` neck is uncountable, and a green leaf on a green
  jungle biome disappears entirely.
- The four leaves sit in the frame's top band, which the app does not overlay;
  they must all be visible with no leaf cropped.

## 5. Stance and framing

- Ground line: **y = 116**. All four feet terminate on it.
- Stroke width **3**; every path point and control point must satisfy
  **7.5 ≤ x ≤ 120.5** and **7.5 ≤ y ≤ 120.5**. The crest apex is the topmost
  shape in the file — place it so the outline **plus its stroke half-width**
  clears the margin.
- Occupancy: ≥ 80% of frame height. **A render whose ink does not reach the top
  band fails**; the animal must climb into it.
- The vertical mass sits **left of center** (the neck) and the body mass **right
  of center** (the torso) — the silhouette is an off-balance L, which no other
  asset in the roster is.

## 6. Color plan

| role | fill |
|---|---|
| Neck, head, torso, tail, all four legs | `#3F8F72` (reserved) |
| Belly / throat patch — the underside from chest to hip, plus a narrow ~6-unit strip down the **front** edge of the neck | `#FFF4D5` cream |
| Four leaves | `#F5C55A` gold |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

Far-side legs use the same `#3F8F72` at full opacity, separated by stroke only.
**No blue anywhere** — blue belongs to plesi and mixing the two families is what
broke round 1.

## 7. Face treatment

Brachiosaurus is the **big-eyed gentle giant** — the largest, roundest eye in
the set, on the smallest head, with a soft open mouth reaching for a leaf.

- Eye: a **full circle, diameter 12**, filling most of the small skull — the
  largest eye in the roster, deliberately oversized so the face reads as
  friendly at 96 px from a distance.
- Iris/pupil: `r = 3.5` circle set **high and forward** in the eye, plus a
  single `r = 1.5` cream highlight above and ahead of it — the only highlight
  dot allowed in the four-species set.
- Lid: none. The eye is fully open and round — the opposite of stego's cut lid
  and ankylo's squint.
- Mouth: a **small open oval, 8 wide × 6 tall**, at the snout tip, angled **up
  toward the leaves**. Not an arc, not a line — an open reaching mouth.
- Crest: the domed nasal bump above and behind the eye is part of the head
  outline and doubles as the face's signature.
- Nostril: one 2-unit dot high on the crest, ahead of the eye.

Differentiators: the only perfectly circular eye, the largest eye (12 vs. stego
9, ankylo 8), the only cream highlight dot, and the only open-oval mouth.

## 8. Forbidden

Round-1 failures for this species, to be corrected explicitly:

- **The neck was thick and only ~35% of frame height — it read as a swan, not a
  brachiosaur.** Forbidden: a neck shorter than 66 units of column height, a
  neck wider than 22 units, or a neck that does not taper upward. The swan read
  comes from a uniform-width neck on a small round body; brachi is corrected
  with a long tapering neck on a heavy torso carried by four thick pillar legs.
- **The body outline was the same path as plesi's with numeric jitter.**
  Forbidden: any shared start point (this asset's outline begins at the crest
  apex, which plesi has no counterpart for), any shared neck-base notch, any
  shared closing curve. These two files must not share three consecutive control
  points.
- **Divergence contract with plesi — all four must hold:**
  1. brachi is **vertical** (height ≈ 107 > width ≈ 100); plesi is **horizontal**
     (width ≥ 106, height ≤ 74).
  2. brachi has **four legs with feet on the ground line**; plesi has **no legs
     and no ground contact at all**.
  3. brachi's neck is **straight-ish and rising**; plesi's neck is a **double-
     curve S laid over the water**.
  4. brachi is green `#3F8F72` on land with gold leaves; plesi is blue `#55B7D9`
     in cream water.
- No flippers, no paddle shapes, no water, no waves.
- No sail, no back plates, no horns, no club.
- Do not drift toward **iguano**: no raised forelimb, no visible hand, no thumb
  spike, no bipedal or semi-bipedal rear-heavy stance. Brachi stands square on
  four columns.
- No copied path data from any other asset with numbers perturbed.

## 9. Acceptance tests

1. Fill every path flat black at 96 px. A reviewer names it "Brachiosaurus" or
   "the tall one with the long neck" without seeing color. **Pass/fail.**
2. Flat-black side-by-side against `plesi.svg`: brachi is taller than it is
   wide, stands on **four visible legs**, and touches the ground line; plesi is
   wider than it is tall, has **zero legs**, and floats over a wave band. A
   reviewer must not confuse them at 96 px, and must not be able to overlay one
   silhouette on the other. **Pass/fail.**
3. Flat-black side-by-side against `iguano.svg`: brachi's neck column is ≥ 66
   units and its head sits in the top quarter of the frame; iguano's head sits
   below mid-frame and it shows a forelimb and hand. Distinguishable at 96 px.
   **Pass/fail.**
4. Measure the head+neck column: ink reaches the top band and the neck base sits
   at the shoulder; column height **≥ 66 units (≥ 52% of frame)**. **Pass/fail.**
5. Measure neck width at three points: ≤ 22 at the base, ≤ 18 mid, ≤ 16 at the
   top, monotonically decreasing upward. **Pass/fail.**
6. Neck width ÷ torso depth **≤ 0.6**. **Pass/fail.**
7. Count the gold leaves: exactly **4**, each **≥ 18 × 12 units**, minimum gap
   between leaves **≥ 8 units**, none cropped, none overlapping the head or
   neck. **Pass/fail.**
8. Count legs in the flat-black render: exactly **4**, each ≥ 22 tall, all
   terminating on the ground line. **Pass/fail.**
9. Forelegs are longer than hind legs by ≥ 4 units and the shoulder sits ≥ 10
   units above the hip. **Pass/fail.**
10. Tail length **≤ 26 units** and ≤ 40% of neck length. **Pass/fail.**
11. Each Section 3 feature meets its stated minimum (or maximum, for the tail).
    **Pass/fail.**
12. Diff `brachi.svg` against `plesi.svg` path by path: **no shared start point,
    no shared sequence of three or more control points, no shared closing
    curve.** This is a hard gate — it is the specific round-1 failure.
    **Pass/fail.**
13. File contains no blue and no cyan hex value. **Pass/fail.**
14. All coordinates and Bézier control points satisfy 7.5 ≤ value ≤ 120.5; no
    clipping at any edge. **Pass/fail.**
15. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
