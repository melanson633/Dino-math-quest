---
id: iguano
name: Iguanodon
kind: dino
output: artifacts/dino-math-quest/public/dinos/iguano.svg
viewBox: "0 0 128 128"
silhouette_class: semi-quadruped, visible forelimb and hand, thumb spike
body_fill: "#E8C15A"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [trex, stego]
countable: { element: hand digits (thumb spike + three fingers), count: 4 }
---

## 1. Identity in one line

"The dinosaur with a spiky thumb — look, it's giving a thumbs up!"

## 2. Silhouette contract

Filled flat black, this must read as a **big-bellied plant-eater leaning forward
on hind legs, with one arm reaching down and out in front of it, and a spike
sticking off that hand.** The arm is the whole identity. If the arm is missing,
the asset is a failure regardless of everything else.

Bounding box: **x 24–118, y 30–116.** Ground line **y = 114**. Facing **left**.
Stance: **semi-quadruped** — hind legs planted and bearing the weight, spine
carried at a shallow forward tilt (roughly 15° down from horizontal), the single
near forelimb swung forward and down toward, but not touching, the ground.

Ordered walk of the outline, clockwise from the snout tip:

1. **Snout tip (26, 46)** — blunt and square-ended. A vertical front face ~8
   units tall from (26, 42) to (26, 50). No point, no fang, no theropod hook.
2. Up the muzzle to the **brow (38, 34)**.
3. Flat **skull crown** across to (49, 32).
4. Down the back of the skull to the **neck notch (55, 40)**.
5. **Neck** rises in a *shallow* curve to the **shoulder (67, 44)**. Total rise
   from notch to shoulder must be **≤ 8 units**. This is not a neck arch.
6. **Back** runs from shoulder (67, 44) in a near-straight line, very slightly
   downhill, to the **hip (93, 52)**. Deviation from a straight line between
   those two points must stay **under 4 units**. Unbroken — no plates, no spines,
   no scallops.
7. **Tail base (101, 56)**; the tail tapers straight back and down to a blunt
   point at **(118, 80)**. Tail is thick at the base (≥ 16 units deep) and held
   low, clearly below the back line.
8. Underside of the tail returns forward to the **rear hip (97, 80)**.
9. **Near hind leg**: thigh bulges out to (101, 90), shank narrows to (94, 106),
   flat foot on the ground from (98, 114) forward to (82, 114). Thigh depth
   ≥ 22 units.
10. **Belly** runs forward from (88, 94) through its lowest point (74, 92) to
    (62, 84). Deep, rounded, convex — the belly is the widest part of the body.
11. **Near forelimb** leaves the body at the **shoulder/chest (61, 54)**, angles
    forward and down to an **elbow (52, 70)**, then to a **wrist (45, 86)**, then
    to the **hand centered (40, 92)**. See §3 for width and clearance.
12. **Hand**: three short forward-pointing fingers, the longest reaching
    **(33, 96)**.
13. **Thumb spike** rises off the *inner top* of the wrist at (45, 84) and points
    up-and-forward to a sharp tip at **(40, 72)**.
14. **Chest** returns up from behind the arm at (55, 62) to the **throat
    (35, 52)** and closes at the snout tip.

Depth cues (drawn, but they do not alter the outline): the far hind leg is a
darker-value column at x 84–96 behind the near leg; the far forelimb is a short
stub at x 56–64, y 56–74, and must be *shorter and higher* than the near arm so
the near arm stays the dominant shape.

**Negative-space rule (the round-1 fix):** between the rear edge of the forearm
and the front edge of the chest/belly there must be **≥ 10 units of open
background** along at least 20 units of the arm's length. The arm must be a limb
you could see daylight through, not a shape laid on the torso.

## 3. Required features

| # | Feature | Minimum size (viewBox units) | Position |
|---|---|---|---|
| 1 | **Near forelimb** — a filled limb with the body fill and the shared stroke, shoulder to fingertips | **≥ 46 units total length**, **≥ 9 units wide** at the forearm | shoulder (61, 54) → hand (40, 92) |
| 2 | **Hand** — a distinct wider mass at the end of the arm | **≥ 18 units** across including fingers, **≥ 12 units** tall | centered (40, 92) |
| 3 | **Thumb spike** — gold, straight-sided cone, tip up-forward | **≥ 20 units long**, **≥ 8 units** wide at the base | base at the wrist (45, 84), tip (40, 72) |
| 4 | **Blunt square muzzle** — flat vertical front face | front face **≥ 8 units** tall; muzzle **≥ 18 units** long | x 26–44, y 34–52 |
| 5 | **Deep convex belly** | belly bulge dips **≥ 20 units** below the back line | x 62–90, y 84–94 |
| 6 | **Thick low tail** | **≥ 30 units** long, base **≥ 16 units** deep | x 93–118 |
| 7 | **Planted hind leg with flat foot** | leg **≥ 34 units** tall, foot **≥ 18 units** long | x 82–101, y 80–114 |

The thumb spike's base must **overlap the hand outline by ≥ 4 units** so the two
shapes are visibly joined. A spike whose base does not touch a hand is a
rejection.

## 4. Countable elements

`practice.countPrompt` for Iguanodon is **"Count eight tiny steps."**

**This is a movement prompt, not a drawing instruction.** Steps are events in
time. There is no honest way to show eight separately countable steps in one
static sprite, and any attempt (eight footprints, eight toes, eight body
scallops) would clutter the silhouette and add a false identity motif. The art
must **not** contain eight of anything.

The countable element in the art is the **hand: exactly four digits — the gold
thumb spike plus three fingers.**

- Count: **4**, exactly. Not three, not five.
- The thumb spike is visually distinct (gold, larger, pointing the opposite
  direction) so a child counting "one — two, three, four" gets a clean start.
- Separation: adjacent fingertips ≥ 5 units apart, with a visible notch ≥ 4
  units deep between each pair, so the fingers do not merge into a mitten at
  96 px.
- All four digits must be inside the region x 33–48, y 72–98 and none may be
  occluded by the belly or the ground.

`movePrompt` ("Give eight tiny thumbs-up taps") is the app's job — the art only
has to give the child one unmistakable thumb to tap.

## 5. Stance and framing

- Ground line **y = 114**. The near hind foot sits flat on it. Nothing but foot
  strokes touch it.
- Occupancy: the sprite fills **≥ 70%** of the frame width and **≥ 62%** of the
  frame height.
- **Minimum margin from every frame edge: 6 units**, measured to the *outer*
  edge of the stroke. With the maximum 3-unit stroke width, no path coordinate
  may fall outside x 8–120 or y 8–120.
- The forelimb reaches into the lower-left quadrant; keep at least 8 units of
  background between the fingertips and the left edge so the hand reads as
  reaching, not as clipped.
- Overall pitch: shoulder (y 44) sits **above** hip (y 52) — a forward-tilted
  spine. A level or rear-high spine is wrong.

## 6. Color plan

| Role | Fill |
|---|---|
| Body, head, neck, tail, all four limbs | `#E8C15A` (reserved) |
| Belly panel, from throat (35, 52) along the underside to (88, 94) | `#FFF4D5` cream, ≥ 14 units tall at its deepest |
| Thumb spike | `#F5C55A` gold |
| Eye white | `#FFF4D5` |
| Pupil, nostril, all outlines | `#503B32` |
| Far limbs (depth) | `#E8C15A` at reduced opacity, no new hex |

The forelimb is the **body fill**, not gold. Only the spike is gold. Round 1's
error was a gold shape with no yellow limb under it.

## 7. Face treatment

Iguanodon is the **calm, sleepy-lidded herbivore** of the roster.

- **Eye:** a *horizontal almond*, **9 units wide × 5 units tall** — the flattest
  eye of the twelve. Cream `#FFF4D5`. Centered (37, 41).
- **Pupil:** a **vertical** oval, 2.5 wide × 4.5 tall — a reptile slit-ish
  pupil. It is the only vertical pupil in the set.
- **Lid:** a heavy stroked upper lid crossing the top **third** of the eye,
  extending 3 units past the eye on the snout side. This is what makes the face
  read as placid rather than alarmed.
- **Mouth:** a **straight horizontal line, 16 units long**, from (27, 50) to
  (43, 50), with a small downward curl only in the last 3 units at the rear —
  a flat cropping bill. **No smile arc.**
- **Nostril:** a single 2.5-unit dot at (30, 41).
- **How it differs:** flattest eye, only vertical pupil, only heavy half-lid, and
  a straight bill mouth instead of a curve. Against `trex` (large round eye,
  toothed open jaw) and `stego` (tiny high dot eye) it is unmistakable.

## 8. Forbidden

The round-1 `iguano.svg` was a **hard fail**. Specifically forbidden:

1. **A thumb spike attached to nothing.** Round 1 drew the spike as a *gold
   triangle floating on the belly*, which read as a chest bib. There were **no
   arms anywhere in the file** — no forelimb, no hand, no stub — so the spike had
   nothing to attach to. Any spike whose base does not overlap a drawn hand is an
   automatic rejection.
2. **Any triangle, chevron, or wedge on the chest or belly.** Gold on the torso
   is banned outright. Gold appears only on the spike.
3. **The shared neck-arch quadruped template.** Round 1 reused the same arched
   neck + even four-legged stance as the other quadrupeds. The neck rise is
   capped at 8 units and the back must be straight (§2 steps 5–6).
4. Reusing, mirroring, or perturbing the path data of `stego`, `brachi`, `mammo`
   or any other asset.
5. Drift toward **trex**: no massive head, no open toothed jaw, no tail held
   horizontal at back height, no tiny vestigial arms. The iguano arm is long and
   functional and reaches past the belly line.
6. Drift toward **stego**: no plates, spikes, scallops or bumps of any kind on
   the back line.
7. Fully upright bipedal posture with the arm tucked at the chest.
8. Green, orange or red body fill.

## 9. Acceptance tests

1. Fill every path flat black. A reviewer shown only the silhouette names it
   "dinosaur with an arm reaching down and a spike on its hand." **PASS/FAIL**
2. Flat-black silhouette placed beside `trex` and `stego`: a reviewer picks
   iguano out of the three with no label. **PASS/FAIL**
3. A forelimb exists as a distinct limb in the silhouette, ≥ 46 units long and
   ≥ 9 units wide. **PASS/FAIL**
4. Open background of ≥ 10 units separates the forearm from the chest/belly along
   ≥ 20 units of the arm. **PASS/FAIL**
5. The thumb spike is ≥ 20 units long, ≥ 8 units at the base, and its base
   overlaps the hand outline by ≥ 4 units. **PASS/FAIL**
6. Exactly **four** digits are present and separately countable at 96 px, with
   ≥ 4-unit notches between adjacent fingertips. **PASS/FAIL**
7. The file contains no group of eight repeated shapes. **PASS/FAIL**
8. Every feature in the §3 table meets its stated minimum, measured in viewBox
   units. **PASS/FAIL**
9. No gold fill appears anywhere on the torso, chest or belly. **PASS/FAIL**
10. Neck rise from notch to shoulder ≤ 8 units; back deviates < 4 units from
    straight between (67, 44) and (93, 52). **PASS/FAIL**
11. Shoulder y-coordinate is smaller than hip y-coordinate (forward tilt).
    **PASS/FAIL**
12. Eye is a horizontal almond ≥ 9 × 5 with a vertical pupil and a heavy upper
    lid; mouth is a straight 16-unit line, not an arc. **PASS/FAIL**
13. `viewBox="0 0 128 128"` exactly; no `width`, no `height`. **PASS/FAIL**
14. No `<image>`, raster, or data URI. **PASS/FAIL**
15. No `<text>` and no font reference. **PASS/FAIL**
16. No `<style>`, `class`, `<script>`, `<defs>`, or external `href`. **PASS/FAIL**
17. No opaque full-bleed background `<rect>`. **PASS/FAIL**
18. Stroke color is `#503B32`; joins and caps are round. **PASS/FAIL**
19. Every path including its stroke half-width lies within x 8–120, y 8–120 —
    nothing clipped at any edge. **PASS/FAIL**
20. Path data is not a copy or numeric perturbation of any other asset in
    `public/dinos/`. **PASS/FAIL**
