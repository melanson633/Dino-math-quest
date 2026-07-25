---
id: carno
name: Carnotaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/carno.svg
viewBox: "0 0 128 128"
silhouette_class: "biped, two bull horns above the eyes, stub arms"
body_fill: "#EE8A9B"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [trex, pachy]
countable: { element: horns, count: 2 }
---

# Carnotaurus — asset spec

## 1. Identity in one line

"The tall pink one standing up straight with two little bull horns."

## 2. Silhouette contract

Filled flat black at 96 px this must read as **a tall, upright, long-legged
two-legged animal with a short square head that has two separate horns sticking
out sideways, and a thin tail held up behind it.** Two horns and an upright
posture. The horns are essential — but the spec's harder requirement is that
**this outline is still not trex even with the horns removed.**

Overall bounding box: **x 20 → 110, y 12 → 120**. Width ≈ 90, height ≈ 108.
**Aspect ratio L:H ≈ 0.85 — the only one of the four bipeds narrower than it is
tall** (raptor 1.64, trex 1.28, spino 1.04). At thumbnail size carno is the
tall skinny one and this ratio alone separates it from trex.

Stance: **standing tall, near-upright.** Spine (hip → shoulder) rises at
**≈ 45° from horizontal** — the steepest of the four (spino 8°, trex 15°,
raptor 35° in the opposite, nose-down sense). **The entire head sits at or above
the hip line (y ≤ 64).** No other biped in the roster carries its head fully
above its hips.

Proportions, stated so they cannot converge with the other three bipeds:

| measure | carno value | why it is different |
|---|---|---|
| Head length | **32** units | 36% of body length, but the *shape* is the point |
| Head depth | **32** units | **head aspect (depth ÷ length) = 1.07 — the only square head in the roster.** trex 0.79 (long box), raptor 0.57, spino 0.38 (flat plank) |
| Head depth ÷ standing height | **0.30** excluding horns, **0.49** including | deliberately **below trex's 0.44** excluding horns, so trex still wins on head mass; carno wins on head *shape* and horns |
| Muzzle | **short and blunt**, 14 units from the eye to the snout tip | trex's is 32. Carno is a bulldog; trex is a crocodile-box |
| Neck | **18** units, rising | trex's is 10 (head on shoulders). Carno's head is lifted clear |
| **Tail** | **rises**, 48 long, base depth 16, tip depth 4 | **the only tail in the four that goes UP.** trex droops and is 32 deep, spino droops, raptor is level |
| Hip-joint height above ground | **56** units = 53% of height, **thigh 20 wide, shin 10 wide** | **slenderest legs of the four.** trex's shin is 22 wide — more than double |

Ordered walk of the body outline, clockwise from the snout tip:

1. Snout tip **(104, 52)** — short, blunt, deep, 5-unit corner radius. The
   muzzle front is a **short vertical face**, y 46 → 58.
2. Straight up the blunt muzzle front to **(104, 44)**, then back along a
   **short flat skull roof** to **(72, 34)**. Skull roof length only 32 units.
3. **HORN A (rear horn)** leaves the roofline at base **x 68 → 84 (16 wide)**
   and rises **outward and back** to a **blunt rounded tip at (70, 14)** —
   height **20 units**, tip radius **4**.
4. **The roofline dips back down between the horns** to **(86, 44)** — a
   **10-unit dip below both horn bases**. This dip is what makes them read as
   two separate horns rather than one crest.
5. **HORN B (front horn)** rises from base **x 88 → 102 (14 wide)** outward and
   forward to a **blunt rounded tip at (100, 16)** — height **20 units**.
6. **Horn tip separation: 30 units** (from x 70 to x 100). Both tips are clear
   of any other outline by ≥ 8 units of background.
7. From the rear of the skull **(68, 42)**, the neck runs **down and back** to
   the shoulder **(56, 52)** — 18 units of visible neck, curving.
8. Back line falls steeply rearward: **(56, 52) → (48, 58) → hip (40, 68)**.
   Rise 16 over run 16 ≈ **45°**.
9. **Tail top edge climbs from the hip**: **(40, 68) → (32, 54) → (26, 38) →
   blunt tip (22, 26)**. The tail **rises 42 units above the hip** and ends
   pointing up and back.
10. Tail underside back down: **(24, 30) → (34, 54) → (46, 82)**. Base depth 16,
    tip depth 4. A thin rising whip.
11. Belly, tight and high: **(46, 82) → (58, 90) → chest (68, 82)**.
12. Chest rises to the throat **(70, 70)**, then the underside of the short jaw
    runs forward: **(72, 66) → (88, 64) → (104, 58)**, closing at the snout tip.
    **Jaw depth at the hinge = 66 − 42 = 24.**
13. **Near leg — long and slender:** hip **(52, 64)** → knee forward to
    **(64, 92)** → shin back and down to the ankle **(56, 110)** → foot forward
    to the toes **(70, 118)**. **Thigh 20 wide, shin only 10 wide.**
14. **Far leg** drawn as a separate closed shape behind, inset 9 units rearward,
    2 units narrower.
15. **Stub arms:** two very short closed shapes at the chest, x 68 → 82,
    y 72 → 86 (see Section 3).

**The horns break the head outline.** They are part of the head's closed path,
not shapes stacked on top. Tracing the skull roof from x 104 to x 68 must go
**up over horn B, down into the dip, up over horn A and down the back of the
skull** — two peaks and a valley, all in one outline.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | position |
|---|---|---|
| **Horn A and Horn B (each)** | **≥ 20 tall × ≥ 14 wide at the base**, blunt tip radius ≥ 4 | x 68–84 and x 88–102, tips at y 14–16 |
| **Roofline dip between the horns** | **≥ 10 units deep** below the lower horn base, **≥ 4 units wide** at its floor | x 84–88 |
| **Horn tip separation** | **≥ 24 units** | x 70 ↔ x 100 |
| **Square head** | **≥ 30 long × ≥ 30 deep** (aspect between 0.95 and 1.20) | x 72–104, y 32–64 |
| Short muzzle | **≤ 18 long** from eye center to snout tip (a **maximum**) | x 90–104 |
| Neck | ≥ 16 long, visible as neck | x 56–70, y 42–58 |
| **Rising tail** | **≥ 40 long, tip ≥ 34 units ABOVE the hip**, base depth 14–18 | x 22–46, y 26–82 |
| Each leg | thigh ≥ 18 wide, **shin ≤ 12 wide**, ≥ 52 units of vertical run | y 64–118 |
| Each stub arm + hand | ≥ 18 long total, two rounded fingers ≥ 7 each | x 68–86, y 72–88 |
| Foot pad + toes | ≥ 24 long, 3 toe bumps ≥ 8 each | y 112–118 |

Note the shin is specified as a **maximum** width and the muzzle as a **maximum**
length. Both are anti-drift controls against trex.

## 4. Countable elements

Source: `dinos.ts` → `carno.practice.countPrompt` = **"Count two little
horns."** Also `movePrompt`: "Stomp two careful horn steps." and `fact`: "It had
two little horns over its eyes!"

- Required count: **exactly 2** horns. Not a crest. Not three. Not a row of
  bumps. **Round 1 rendered the horns as a 19-unit punk crest** — a crest counts
  as **zero** horns for this test.
- Each horn is **≥ 20 tall × ≥ 14 wide at the base** with a blunt rounded tip.
- The two horns are separated by a **roofline dip ≥ 10 units deep**, so a child
  at 96 px sees **two distinct peaks with a valley between them**. Horn tips are
  **≥ 24 units apart**.
- Both horns sit **above and behind the eyes** — horn bases at x 68–102, eyes at
  x 78–96 and y 48–56. "Two little horns over its eyes" is literal.
- A child must be able to land a fingertip on each horn independently: each
  horn's tappable area is ≥ 20 × 14 units.
- The horns are filled `#F5C55A` gold against the `#EE8A9B` body, so they are
  countable in colour as well as in outline. **They must remain countable when
  the whole sprite is filled flat black** — that is the point of the dip.
- Unlike the other three in this set, carno's countable **is** anatomy and is
  therefore **included** in the flat-black silhouette test.

## 5. Stance and framing

- Ground line: **y = 118**. Both feet terminate on it. Nothing extends below.
- Stroke width **3**, so every coordinate satisfies **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. Horn A's tip at y = 14 leaves 6.5 units after the stroke
  and Horn B's at y = 16 leaves 8.5 — both safe. The tail tip at (22, 26) is
  safe.
- Occupancy: **≈ 70% of frame width** (the narrowest of the four bipeds),
  ≈ 84% of frame height.
- Weight distribution: **at least 55% of the filled silhouette area lies above
  y = 70.** Carno is top-heavy and upright; trex and spino are not.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs, arms | `#EE8A9B` (reserved) |
| **Both horns** | **`#F5C55A` gold** — the only gold on the sprite, and the only gold horns in the roster |
| Belly, throat and chest patch | `#FFF4D5` cream |
| Toe tips | `#FFF4D5` |
| Eye whites | `#FFF4D5` |
| Pupils | `#503B32` |
| Cheek blush | `#EE8A9B` at a darker mix is **not permitted** — use no blush; see Section 7 |
| All strokes | `#503B32`, width 3, round joins and caps |

Gold is reserved on this sprite for the horns alone. Nothing else in the file
may be `#F5C55A`, so the two countable elements are the two gold shapes — a
second, redundant channel for the count.

## 7. Face treatment

Carnotaurus is the **only three-quarter face in this set — two eyes visible** —
and it is the proud, pleased one. Short square head, wide-set eyes tucked under
the horn bases, a small satisfied bulldog smile.

- Eyes: **two**, each an oval **10 wide × 9 tall**, tilted **15° outward**,
  centered **(82, 52)** and **(96, 50)**. Centre-to-centre spacing **14 units**.
  Two visible eyes is unique to carno among these four and is instantly
  readable in colour.
- Lid: a **lower-lid arc** under each eye, cutting the bottom 25% — the
  "pleased, cheeks-up" expression. Carno is the only species with a **lower**
  lid; spino has a heavy upper lid, trex a brow ridge, raptor no lid at all.
- Pupils: `r = 3.5` circles, both looking slightly forward and down, at
  (83, 53) and (97, 51).
- **Mouth: a short upturned bulldog smile, 16 units wide**, from (88, 62)
  dipping to (96, 64) and rising to (104, 60), with a **small round dimple dot
  (2.5 units) at each corner** — (87, 61) and (105, 59). The dimples are
  carno-only. **No teeth. No open jaw.**
- Nostril: two small 2-unit dots at (101, 55) and (103, 53) — paired nostrils on
  the blunt front face, only possible because carno faces three-quarter.
- No cheek blush patch. The expression comes from the lower lids, the dimples
  and the upturned mouth.

Differentiators against the other three bipeds: only two-eye three-quarter face;
only lower-lid treatment; only dimples; only paired nostrils; mouth is a short
upturned smile against trex's open cavity, spino's long horizontal line and
raptor's tiny V.

## 8. Forbidden

The specific round-1 failures for this species, to be corrected:

- **The horns were present but rendered as a 19-unit punk crest.** Forbidden:
  any crest, mohawk, fin, sawtooth or continuous raised ridge on the skull. The
  skull roof shows **exactly two peaks with a ≥ 10-unit valley between them**.
  A raised feature without that valley counts as **zero horns** and fails
  Section 4.
- **Carno's outline was trex's path with the horns inserted — delete the horns
  and they are the same file.** This is the governing failure of this spec. The
  fix is structural, not decorative:
  - carno L:H **0.85** vs trex **1.28**
  - carno head aspect **1.07 (square)** vs trex **0.79 (long box)**
  - carno muzzle **≤ 18** vs trex **32**
  - carno neck **18 and rising** vs trex **10, head on shoulders**
  - carno tail **rises, 16 deep** vs trex **droops, 32 deep**
  - carno shin **≤ 12 wide** vs trex **22 wide**
  - carno head fully above the hip line vs trex's head forward and level
  Every one of those must hold **before** the horns are drawn. The horn-deletion
  test in Section 9 is the acceptance gate.
- Do not drift toward **pachy**: **no dome.** The skull roof between the horns is
  a *dip*, never a bulge; no knobs, bosses or bumps ring the skull; the head is
  square and blunt, not round. Round 1 gave carno the same head lobe size as
  pachy's — carno's head is square (aspect ≈ 1.07) and pachy's is a rounded dome
  with a knobbed rim, and they must be distinguishable in flat black with the
  horns hidden.
- No horn under 20 units tall. No horn narrower than 14 units at the base. No
  pointed horn tips (tip radius ≥ 4) — these are gentle bull horns, not spikes.
- No bared teeth, no pointed claws, no lowered-head charging posture. Carno
  stands tall and pleased.
- No copied path data from any other asset with the numbers perturbed. The
  outline is hand-authored. This file is checked against `trex.svg` first.

## 9. Acceptance tests

1. Fill every path flat black at 96 px. A reviewer names it "Carnotaurus" or
   "the one with two horns." **Pass/fail.**
2. **The horn-deletion test.** Flat-black side by side with `trex.svg` at 96 px,
   **with carno's horns digitally erased**. The two outlines must still be told
   apart, and a reviewer must still assign each name correctly, on the strength
   of: L:H (0.85 vs 1.28), head aspect (1.07 vs 0.79), muzzle length (≤ 18 vs
   32), tail direction and depth (rising/16 vs drooping/32), shin width (≤ 12 vs
   22) and head-above-hip. **Pass/fail. This is the gating test for this file.**
3. Flat-black side by side with `pachy.svg` at 96 px, **with carno's horns
   erased**: carno's skull is square with a dipped roofline; pachy's is a
   rounded knobbed dome. A reviewer assigns each name correctly. **Pass/fail.**
4. Flat-black side by side with `trex.svg` **with the horns present**: two
   distinct peaks and a valley are visible on carno's skull at 96 px; trex's
   skull roof is smooth. **Pass/fail.**
5. Count the horns: **exactly 2**. Each **≥ 20 tall × ≥ 14 wide at the base**.
   **Pass/fail.**
6. Measure the roofline dip between the horns: **≥ 10 units deep, ≥ 4 units wide
   at its floor**. Measure horn tip separation: **≥ 24 units**. **Pass/fail.**
7. Screenshot at exactly 96 px in flat black and ask a reviewer to count the
   horns without being told the number. Answer must be **two**. **Pass/fail.**
8. Head aspect (depth ÷ length) falls between **0.95 and 1.20**; head measures
   ≥ 30 × 30. **Pass/fail.**
9. Muzzle length from eye center to snout tip is **≤ 18 units**. **Pass/fail.**
10. Tail tip sits **≥ 34 units above the hip**; tail base depth is **14–18
    units**. **Pass/fail.**
11. Shin width is **≤ 12 units** on both legs; each leg has ≥ 52 units of
    vertical run. **Pass/fail.**
12. L:H ratio is **≤ 0.90**; ≥ 55% of filled area lies above y = 70; the whole
    head lies at or above the hip line. **Pass/fail.**
13. Every Section 3 feature meets its minimum, and the muzzle and shin meet
    their stated maxima. **Pass/fail.**
14. Exactly **two** gold `#F5C55A` shapes exist in the file, and they are the
    two horns. **Pass/fail.**
15. Zero teeth, zero pointed horn tips (all tip radii ≥ 4), zero pointed claws.
    **Pass/fail.**
16. All coordinates satisfy 7.5 ≤ x, y ≤ 120.5; no stroke is clipped by the
    frame. **Pass/fail.**
17. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
18. Diff the body path against `trex.svg` first, then every other delivered dino
    path: no shared sequence of three or more control points. **Pass/fail.**
