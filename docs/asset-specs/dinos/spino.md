---
id: spino
name: Spinosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/spino.svg
viewBox: "0 0 128 128"
silhouette_class: "biped, one continuous convex sail, long narrow snout"
body_fill: "#7B5EA7"
accent_fills: ["#FFF4D5", "#55B7D9"]
nearest_neighbors: [trex, raptor]
countable: { element: water splashes, count: 6 }
---

# Spinosaurus — asset spec

## 1. Identity in one line

"The one with the big sail on its back and the long crocodile mouth."

## 2. Silhouette contract

Filled flat black at 96 px this must read as **a long, low two-legged animal
whose back carries one huge smooth dome, with a long flat snout sticking out
level in front**. The sail and the snout are the two facts. Everything else is
support.

Overall bounding box: **x 8 → 120, y 12 → 120**. Width ≈ 112, height ≈ 108.
**Aspect ratio L:H ≈ 1.04** — spino is the only one of the four bipeds that is
close to square in the frame (raptor 1.64, trex 1.28, carno 0.85). That ratio is
itself an acceptance test.

Stance: **standing biped, near-horizontal spine, head carried low and level.**
Spine pitch (hip → shoulder line) is **≈ 8° from horizontal** — the flattest
back of the four. Compare raptor 35°, trex 15°, carno 45°.

Proportions, stated so they cannot converge with the other three bipeds:

| measure | spino value | why it is different |
|---|---|---|
| Head length | **32** units | 29% of body length |
| Head depth | **12** units | **head aspect (depth ÷ length) = 0.38 — the flattest head in the roster** (raptor 0.57, trex 0.79, carno 1.07) |
| Head depth ÷ standing height | **0.11** | trex is 0.44; spino's head is a small detail, trex's head is the animal |
| Hip-joint height above ground | **42** units = **39%** of standing height | **shortest legs of the four** (trex 58%, carno 53%, raptor 83%) |
| Tail base depth / length | 20 / 44 | thick-ish, held **low and drooping** |
| Sail | 44 wide × 34 tall above the back line | ≈ 1/3 of total silhouette area |

Ordered walk of the body outline, clockwise from the snout tip:

1. Snout tip **(120, 62)** — blunt, 4-unit corner radius. Not a point.
2. Top of the snout runs **back almost level** to **(98, 58)**. Rise of only 4
   units over 22 units of length. This long flat run is the crocodile read.
3. One soft brow rise to **(90, 52)** — a single 6-unit bump, the only feature
   cut into the head's top edge.
4. Dip at the nape **(82, 58)**, then up onto the shoulder **(80, 48)**.
5. **Sail leading edge:** leaves the back at **(84, 46)** and climbs in **one
   unbroken convex curve** to the apex **(62, 12)**.
6. **Sail trailing edge:** from the apex **(62, 12)** down in **one unbroken
   convex curve** to **(40, 46)**. The sail's full perimeter from step 5 to here
   contains **zero concave segments and zero vertices under 150°**.
7. Back line continues to the hip **(36, 52)**.
8. Tail top edge: **(36, 52) → (20, 64) → tail tip (8, 78)**. One gentle droop,
   no kink.
9. Tail underside back up: **(8, 78) → (24, 76) → (40, 72)**. Base depth 20,
   tip depth 6.
10. Belly, deep and rounded: **(40, 72) → (56, 84) → (74, 80)**. Lowest belly
    point y = 84.
11. Far leg: down from **(46, 80)** to the foot at **(44, 116)**, foot pad
    forward to **(60, 116)**.
12. Near leg: down from **(66, 82)** to **(70, 116)**, foot pad forward to
    **(86, 116)**. Legs are short columns ≈ 16 wide.
13. Chest rises **(78, 74) → throat (86, 68)**.
14. **Underside of the jaw is dead straight**: **(86, 68) → (104, 66) →
    (120, 64)**, closing at the snout tip. No chin, no jowl. A straight lower
    jaw under a straight upper jaw is what makes it a crocodile snout and not a
    muzzle tab.

Two arms, small, drawn as separate closed shapes on the chest (see Section 3).

The sail is drawn as **part of the body outline** — one closed path, body and
sail together. It is not a stack of separate shapes and it is not applied on
top. A viewer tracing the top edge from x 84 to x 40 must never leave the
outline.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | position |
|---|---|---|
| **Sail** | **≥ 44 wide × ≥ 32 tall above the back line**, single convex arc | x 40–84, y 12–46 |
| **Long snout** | **≥ 30 long × ≤ 14 deep**, upper and lower jaw lines within 6° of horizontal | x 88–120, y 52–68 |
| Body/torso | ≥ 34 long × ≥ 26 deep | x 40–78, y 46–84 |
| Tail | ≥ 40 long, ≥ 18 thick at base | x 8–40 |
| Each leg | ≥ 16 wide × ≥ 34 tall | y 80–116 |
| Each foot pad | ≥ 16 wide | y 112–116 |
| Each arm + hand | ≥ 20 long total, two rounded fingers ≥ 7 each | x 74–92, y 72–90 |
| Brow bump | ≥ 6 tall (detail, not a silhouette feature) | x 84–92 |

Anything below its minimum counts as **absent** and fails review.

## 4. Countable elements

Source: `dinos.ts` → `spino.practice.countPrompt` = **"Count six water
splashes."** Also `movePrompt`: "Splash six little waves."

- Required count: **exactly 6** splash shapes. Not 5, not 7, not a continuous
  wavy water line that a child cannot resolve into units.
- Each splash: **≥ 18 wide × ≥ 12 tall**, a rounded three-lobed water bloom
  (one taller center lobe, two shorter side lobes), each a separate closed path.
- Placement: a single row on the water line at **y 108 → 122**, centers at
  approximately **x 16, 38, 60, 82, 100, 118** — evenly spaced left to right.
- Splashes 3 and 4 sit at the two feet (x 60, x 82); the other four sit in open
  water. This is natural and still leaves six equal, separately countable units.
- Minimum clear gap between neighboring splash outlines: **≥ 5 units**.
- Splashes are filled `#55B7D9` and use the shared stroke. **They must never
  merge with the body outline** — minimum 4 units of clear background between
  any splash path and any body path, except where a splash passes behind a foot,
  in which case the foot's stroke keeps them separate.
- Splashes are **excluded from the flat-black silhouette test** in Section 9
  test 1: fill the body paths black, hide the splashes, and the animal must
  still be nameable.

## 5. Stance and framing

- Ground / water line: **y = 116**. Both feet terminate on it. Splash paths may
  reach y = 122; nothing else goes below y = 116.
- Stroke width **3**, so every path coordinate satisfies **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. The sail apex at y = 12 leaves 4.5 units of clearance
  after the stroke; the tail tip at x = 8 leaves 0.5 units. **Round the tail tip
  in to x = 10** if the stroke is authored wider than 3.
- Occupancy: ≈ 88% of frame width, ≈ 84% of frame height.
- Weight distribution: **at least 30% of the filled silhouette area lies above
  y = 46** (that area is the sail). If less, the sail is too small.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs, arms | `#7B5EA7` (reserved) |
| **Sail membrane** | `#7B5EA7` — same reserved body fill, **with a cream inner rim** |
| Sail inner rim | `#FFF4D5`, a 6-unit-wide band following the sail's inner edge |
| Belly patch (x 44–78, y 70–84) | `#FFF4D5` |
| Water splashes | `#55B7D9` |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

**Spino uses no gold (`#F5C55A`) anywhere.** Gold is how carno's horns and
raptor's belly read; keeping it off spino preserves color as an independent
identity channel. The cream sail rim is spino's only accent signature.

## 7. Face treatment

Spinosaurus has a **narrow, calm, half-lidded face on a long flat skull** — the
sleepy river animal.

- Eye: a small **almond**, 8 wide × 6 tall, centered **(92, 56)** — set high and
  far back on the skull, at 12% of the head length from the rear, so the long
  empty snout in front of it reads as snout.
- Lid: a **heavy curved upper lid** covering the top 40% of the eye and
  extending 4 units past the eye's rear corner into a soft brow. Half-lidded and
  content, not sleepy-flat like stego's straight-cut lid.
- Pupil: `r = 2` circle, forward-set at (93, 57). The smallest pupil in the
  roster.
- **Mouth: one long gentle horizontal line, 30 units, from (92, 65) to
  (120, 63)**, with a single small upward hook at the rear corner (92, 65). This
  is the only long-line mouth in the roster and it is what makes the crocodile
  read. **No arc smile. No teeth. No open jaw.**
- Nostril: one 2.5-unit dot at **(112, 58)**, near the snout tip — nostrils
  placed far forward are a second crocodile cue.
- Cheek: no cheek blush. Spino's friendliness comes from the lid and the soft
  upturned mouth corner, not from a blob.

Differentiators against the other three bipeds: smallest pupil (r 2) vs raptor's
r 4; only long horizontal line mouth vs trex's open cavity, carno's short
upturned bulldog smile, raptor's tiny V; only face where the eye sits in the
rear 12% of a very long skull.

## 8. Forbidden

The specific round-1 failures for this species, to be corrected:

- **The sail was drawn as a sawtooth row of spikes — literally stego's plate row
  recolored purple.** Absolutely forbidden: any triangular tooth, any spike, any
  zigzag, any row of separate shapes along the back. **A sail is ONE continuous
  convex membrane.** The top edge from x 84 to x 40 is a single unbroken curve.
  Any concave notch on that edge is an automatic fail.
- **The crocodile snout was absent; the head was the same snub muzzle tab used
  on stego and ankylo.** Forbidden: any head shorter than 30 units, any head
  deeper than 14 units, any rounded snub muzzle, any downturned or hooked jaw.
  The upper and lower jaw lines are both within 6° of horizontal.
- Do not drift toward **trex**: spino's head must never dominate. Head depth
  must stay under 0.15 of standing height. No deep boxy skull, no thick
  counterbalance tail (spino's tail droops and tapers), no short thick legs
  paired with a massive head.
- Do not drift toward **raptor**: spino is not lean and it is not pitched
  forward. Spine pitch stays under 15°; the tail droops instead of running
  straight and level; no sickle claw on any toe.
- No sail built from separate stacked shapes drawn on top of the back.
- No copied path data from any other asset with the numbers perturbed. The
  outline is hand-authored.

## 9. Acceptance tests

1. Fill every body path flat black at 96 px (splashes hidden). A reviewer names
   it "Spinosaurus" or "the one with the sail." **Pass/fail.**
2. Flat-black side by side with `trex.svg` at 96 px: spino's head depth is under
   15% of its standing height and its back carries a 32-unit dome; trex's head
   depth is over 35% of its standing height and its back is bare. A reviewer
   assigns each name correctly. **Pass/fail.**
3. Flat-black side by side with `raptor.svg` at 96 px: spino's L:H ratio is
   ≈ 1.04 and its spine pitch is under 15°; raptor's L:H is ≈ 1.64 and its pitch
   is over 30°. A reviewer assigns each name correctly. **Pass/fail.**
4. Trace the sail's top edge from x 84 to x 40. It contains **zero concave
   segments and zero vertices forming an interior angle < 150°**. **Pass/fail.**
5. The sail measures **≥ 44 wide × ≥ 32 tall** above the back line, and the sail
   area is **≥ 30%** of total silhouette area. **Pass/fail.**
6. The sail is part of the body's single closed path, not a separate shape or
   group stacked on the back. **Pass/fail.**
7. The snout measures **≥ 30 long and ≤ 14 deep**; both jaw lines are within 6°
   of horizontal. **Pass/fail.**
8. Count the splash shapes: exactly **6**, each **≥ 18 × 12 units**, minimum
   neighbor gap **≥ 5 units**. **Pass/fail.**
9. Every Section 3 feature meets its stated minimum size. **Pass/fail.**
10. Head depth ÷ standing height ≤ 0.15; hip-joint height ÷ standing height
    ≤ 0.45. **Pass/fail.**
11. No `#F5C55A` appears anywhere in the file. **Pass/fail.**
12. No bared teeth, no pointed claws, no open snarling jaw anywhere. **Pass/fail.**
13. All coordinates satisfy 7.5 ≤ x, y ≤ 120.5; no stroke is clipped by the
    frame. **Pass/fail.**
14. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
15. Diff the body path against every other delivered dino path: no shared
    sequence of three or more control points. **Pass/fail.**
