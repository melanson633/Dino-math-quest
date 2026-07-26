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

Overall bounding box: **x 8 → 120, y 11 → 119** (the splashes set the lower
edge; the body itself stops at the water line). Width ≈ 112, height ≈ 108.
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

1. Snout tip — blunt, ~4-unit corner radius. Not a point.
2. Top of the snout runs **back almost level** toward the brow: a rise of no more
   than 4 units over the snout's whole length. This long flat run is the
   crocodile read.
3. One soft brow rise — a single ~6-unit bump, the only feature cut into the
   head's top edge.
4. Dip at the nape, then up onto the shoulder.
5. **Sail leading edge:** leaves the back just behind the shoulder and climbs in
   **one unbroken convex curve** to the apex, the topmost point of the sprite.
6. **Sail trailing edge:** from the apex down in **one unbroken convex curve** to
   the back line ahead of the hip. The sail's full perimeter from step 5 to here
   contains **zero concave segments and zero vertices under 150°**.
7. Back line continues to the hip.
8. Tail top edge droops from the hip to a tapered tip. One gentle droop, no kink.
9. Tail underside returns forward to the belly. Base depth ≈ 20, tip depth ≈ 6.
10. Belly, deep and rounded — its lowest point sits under the mid-torso.
11. Far leg drops to a foot on the ground line, foot pad pointing forward.
12. Near leg drops to a foot on the ground line, foot pad forward. Legs are short
    columns ≈ 16 wide.
13. Chest rises to the throat.
14. **Underside of the jaw is dead straight** from the throat forward to the
    snout tip, closing the outline. No chin, no jowl. A straight lower jaw under
    a straight upper jaw is what makes it a crocodile snout and not a muzzle tab.

Two arms, small, drawn as separate closed shapes on the chest (see Section 3).

The sail is drawn as **part of the body outline** — one closed path, body and
sail together. It is not a stack of separate shapes and it is not applied on
top. A viewer tracing the top edge from the shoulder to the hip must never leave
the outline.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | placement |
|---|---|---|
| **Sail** | **≥ 44 wide × ≥ 32 tall above the back line**, single convex arc | spanning shoulder to hip, apex topmost |
| **Long snout** | **≥ 30 long × ≤ 14 deep**, upper and lower jaw lines within 6° of horizontal | front of the head, held level |
| Body/torso | ≥ 34 long × ≥ 26 deep | between shoulder and hip, under the sail |
| Tail | ≥ 40 long, ≥ 18 thick at base | off the hip, drooping rearward |
| Each leg | ≥ 16 wide × ≥ 34 tall | under the torso, down to the water line |
| Each foot pad | ≥ 16 wide | on the water line |
| Each arm + hand | ≥ 20 long total, two rounded fingers ≥ 7 each | on the chest, ahead of the near leg |
| Brow bump | ≥ 6 tall (detail, not a silhouette feature) | above and just ahead of the eye |

Anything below its minimum counts as **absent** and fails review.

## 4. Countable elements

Source: `dinos.ts` → `spino.practice.countPrompt` = **"Count six water
splashes."** Also `movePrompt`: "Splash six little waves."

- Required count: **exactly 6** splash shapes. Not 5, not 7, not a continuous
  wavy water line that a child cannot resolve into units.
- Each splash: **≥ 14 wide × ≥ 10 tall**, a rounded three-lobed water bloom
  (one taller center lobe, two shorter side lobes), each a separate closed path.
  *This width is the ceiling the frame allows:* six splashes plus five ≥ 5-unit
  gaps plus the 6-unit edge margins already consume ~115 of the 128 available
  units, so do not raise it.
- Placement: a single row straddling the water line, spanning the full frame
  width and **evenly spaced left to right**.
- Two of the six sit behind the feet; the other four sit in open water. This is
  natural and still leaves six equal, separately countable units.
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
  reach **y = 119** — far enough to read as water closing over the feet, but
  still inside the stroke envelope below; nothing else goes below y = 116.
- Stroke width **3**, so every path coordinate satisfies **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. The sail apex and the tail tip are the two tightest
  points — check both with the stroke half-width included, and pull the tail tip
  inward rather than clipping it.
- Occupancy: ≈ 88% of frame width, ≈ 84% of frame height.
- Weight distribution: **at least 30% of the filled silhouette area lies above
  the back line** (that area is the sail). If less, the sail is too small.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs, arms | `#7B5EA7` (reserved) |
| **Sail membrane** | `#7B5EA7` — same reserved body fill, **with a cream inner rim** |
| Sail inner rim | `#FFF4D5`, a 6-unit-wide band following the sail's inner edge |
| Belly patch, chest back to the hind leg | `#FFF4D5` |
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

- Eye: a small **almond**, 8 wide × 6 tall — set high and far back on the skull,
  within the rear 12% of the head length, so the long empty snout in front of it
  reads as snout.
- Lid: a **heavy curved upper lid** covering the top 40% of the eye and
  extending 4 units past the eye's rear corner into a soft brow. Half-lidded and
  content, not sleepy-flat like stego's straight-cut lid.
- Pupil: `r = 2` circle, forward-set within the eye. The smallest pupil in the
  roster.
- **Mouth: one long gentle horizontal line, ≥ 30 units**, running the full length
  of the jaw from the rear corner to the snout tip, with a single small upward
  hook at the rear corner. This is the only long-line mouth in the roster and it
  is what makes the crocodile read. **No arc smile. No teeth. No open jaw.**
- Nostril: one 2.5-unit dot near the snout tip — nostrils placed far forward are
  a second crocodile cue.
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
  convex membrane.** The top edge from shoulder to hip is a single unbroken
  curve. Any concave notch on that edge is an automatic fail.
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
4. Trace the sail's top edge from shoulder to hip. It contains **zero concave
   segments and zero vertices forming an interior angle < 150°**. **Pass/fail.**
5. The sail measures **≥ 44 wide × ≥ 32 tall** above the back line, and the sail
   area is **≥ 30%** of total silhouette area. **Pass/fail.**
6. The sail is part of the body's single closed path, not a separate shape or
   group stacked on the back. **Pass/fail.**
7. The snout measures **≥ 30 long and ≤ 14 deep**; both jaw lines are within 6°
   of horizontal. **Pass/fail.**
8. Count the splash shapes: exactly **6**, each **≥ 14 × 10 units**, minimum
   neighbor gap **≥ 5 units**, all six inside the frame margins. **Pass/fail.**
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
