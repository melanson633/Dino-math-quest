---
id: trex
name: T-Rex
kind: dino
output: artifacts/dino-math-quest/public/dinos/trex.svg
viewBox: "0 0 128 128"
silhouette_class: "biped, massive head, thick counterbalance tail"
body_fill: "#C0553F"
accent_fills: ["#FFF4D5"]
nearest_neighbors: [carno, raptor]
countable: { element: roar puffs, count: 10 }
---

# T-Rex — asset spec

## 1. Identity in one line

"The one with the giant head and the teeny tiny arms."

## 2. Silhouette contract

Filled flat black at 96 px this must read as **a huge head balanced against a
huge tail over two short thick legs** — a see-saw. The head is not a feature on
the animal; **the head is roughly a third of the animal.** Round 1's trex had no
defining feature at all; the head mass *is* the defining feature and it must be
impossible to miss.

Overall bounding box (body): **x 8 → 116, y 32 → 118**. Width ≈ 108, height
≈ 86. **Aspect ratio L:H ≈ 1.28** (raptor 1.64, spino 1.04, carno 0.85).

Stance: **standing biped, head carried high and forward, spine pitched
≈ 15° from horizontal (head end up).** Weight sits at the two ends and the
middle is short. Compare spino 8° flat, raptor 35° nose-down, carno 45° upright.

Proportions, stated so they cannot converge with the other three bipeds:

| measure | trex value | why it is different |
|---|---|---|
| Head length | **48** units | **44% of body length — the largest head:body ratio in the roster** (carno 0.31, spino 0.29, raptor 0.24) |
| Head depth | **38** units | head aspect 0.79 — a long *and* deep box, distinct from carno's near-square 1.07 and spino's flat 0.38 |
| **Head depth ÷ standing height** | **0.44** | spino 0.11, raptor 0.22, carno 0.30 excluding horns. **Nothing else comes close.** |
| Neck length | **10** units | shortest neck of the four — the head sits almost on the shoulders |
| Torso length | **30** units | short; the animal is head + tail with a hinge |
| **Tail base depth** | **32** units | **thickest tail in the roster.** raptor 14, carno 16, spino 20 |
| Tail length | 34 units | short and heavy, not long and thin — a wedge, not a whip |
| Hip-joint height above ground | **50** units = 58% of standing height, **thigh 28 wide, shin 22 wide** | **thickest legs of the four.** carno's shin is 10 wide |

The single sentence that governs this file: **the head silhouette area and the
tail silhouette area must each be at least 25% of the total, and the two must be
within 40% of each other in area.** That is the counterbalance.

Ordered walk of the body outline, clockwise from the snout tip:

1. Snout tip — blunt, deep, ~5-unit corner radius. The snout front is nearly
   **vertical**, ~14 units of face. Nothing else in the roster has a blunt
   vertical snout front.
2. Up the front of the muzzle to the top of the snout.
3. Along the top of the skull, rising rearward to the **crown**.
4. Back of the skull drops to the **nape**. The head box measures ~48 × 38.
5. Very short neck from nape to **shoulder** — only ~10 units. The skull sits
   directly on the shoulders.
6. Back line falls gently rearward to the **hip**.
7. Tail top edge runs back and down to a **blunt tail tip**, rounded and ~6 units
   across — a blunt heavy end, never a point.
8. Tail underside returns forward to the belly. **Base depth ≈ 32.** The tail
   keeps its depth for its first two thirds and only tapers in the last stretch.
   Round 1's "thin taper with no counterbalance mass" is exactly what this
   forbids.
9. Belly, broad and low, forward to the chest.
10. Chest rises steeply to the throat.
11. Underside of the jaw runs forward and slightly down, closing at the snout
    tip. **Jaw depth at the hinge ≈ 30 units** — a deep jaw is half the head-mass
    read.
12. **Near leg:** a broad thigh mass blended into the body outline, then a
    **thick shin**, then a foot pad on the ground line with **three visible
    rounded toe bumps**, each ≥ 9 units.
13. **Far leg** drawn as a separate closed shape behind, inset rearward and
    narrower, same short thick proportions.
14. **Arms:** two separate closed shapes leaving the chest, angling forward and
    down — see Section 3. They hang in open space below the jaw so they are
    visible against background, not lost on the chest.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | placement |
|---|---|---|
| **Head** | **≥ 44 long × ≥ 34 deep**, and head depth **≥ 0.35 × standing height** | carried high and forward, over the shoulders |
| **Jaw depth at the hinge** | **≥ 28** | rear of the head, under the nape |
| **Tail** | **≥ 30 deep at the base**, ≥ 30 long, blunt tip ≥ 6 across | off the hip, running back and slightly down |
| **Arm + two fingers** | **≥ 20 units total reach**, hand shows **exactly two rounded fingers, each ≥ 8 long × ≥ 6 wide**, separated by a ≥ 4-unit notch | off the chest, hanging in open space below the jaw |
| Each leg — thigh | ≥ 26 wide | under the hip |
| Each leg — shin | ≥ 20 wide × ≥ 20 tall | below the thigh, down to the ground line |
| Foot pad + toes | ≥ 30 long, 3 toe bumps ≥ 9 each | on the ground line, pointing forward |
| Neck | ≤ 14 long (a **maximum**, not a minimum) | between nape and shoulder |

The arms are the second half of the identity ("tiny arms" is in the `fact`
string) and round 1 delivered "a featureless 4-point stub with no fingers." The
arms are *small in proportion* but they are **not small in absolute units**:
20 units of reach with two clearly separated fingers. A hand without two
resolvable fingers counts as **absent**.

## 4. Countable elements

Source: `dinos.ts` → `trex.practice.countPrompt` = **"Count ten quiet roars."**
Also `movePrompt`: "Do ten quiet brave roars."

- Required count: **exactly 10** roar puffs. Not 9, not 12, not an
  indeterminate cloud.
- Each puff: a rounded three-lobe cloud shape, **≥ 11 units across × ≥ 9 tall**,
  its own closed path.
- Layout — **two staggered rows of five** in the empty band above the back and
  ahead of the head. Five-and-five is the easiest ten for a four-year-old to
  count, and it is what fits:
  - **Row A** sits highest, **Row B** below it, each row evenly spaced left to
    right across the band.
  - Row B is offset horizontally by roughly half a spacing so **no puff sits
    directly under another**.
- Minimum clear gap between any two puff outlines: **≥ 3 units**. No puff may
  overlap another; no puff may touch the head, back or tail — **minimum 4 units
  of clear background** to any body path. Row B's lower edge is the one to check
  against the crown, which is the body's highest point.
- Puffs grow slightly from the leftmost of row A (the 11-unit floor) to the
  rightmost of row B (up to ~14 units), so the set reads as sound travelling out
  from the mouth rather than as wallpaper. No puff may fall below the floor.
- Puffs are filled `#FFF4D5` with the shared stroke and are **excluded from the
  flat-black silhouette test** in Section 9 test 1.

Puffs are countable tokens, not anatomy, and are exempt from the 18-unit
anatomical minimum — but they carry their own hard floor of 11 × 9 and must
survive a 96 px screenshot check.

## 5. Stance and framing

- Ground line: **y = 118**. Both feet terminate on it. Nothing extends below.
  (The ground line sits at 118, not 120, so the foot outline **plus its 1.5-unit
  stroke half-width** still lands inside the 120.5 envelope below.)
- Stroke width **3**, so every coordinate satisfies **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. Row A's puffs are the topmost shapes in the file — place
  the row so the puff outline **plus its stroke half-width** clears the margin,
  not just the puff center.
- Occupancy: ≈ 84% of frame width; body ≈ 67% of frame height, and the puff band
  fills the remainder.
- Weight distribution: **at least 40% of the filled body area lies forward of the
  shoulder** (head end) and **at least 25% lies behind the hip** (tail end). The
  middle is the thin part. This is the see-saw check.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs, arms | `#C0553F` (reserved) |
| **Belly, throat, inner jaw and chest patch** | **`#FFF4D5` cream** |
| Mouth cavity | `#FFF4D5` |
| Roar puffs | `#FFF4D5` |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

**T-Rex uses no gold (`#F5C55A`) anywhere in the file.** Round 1 gave trex and
raptor the identical accent (`#F5C55A` belly) on top of near-identical shapes.
Trex's belly is cream and raptor's belly is gold; neither rule may be relaxed.
Trex is the only one of these four whose accent list is a single colour, and
that austerity is deliberate — the head carries the identity, not decoration.

## 7. Face treatment

T-Rex has the **smallest eye on the biggest head** — a big gentle animal
squinting kindly, mouth open in a quiet round "roar" that is obviously a sound,
not a threat.

- Eye: an ellipse **9 wide × 8 tall** — set high and **far back**, within the
  rear third of the skull. On a 48-unit head that is an eye:head ratio of
  **0.19, the smallest in the roster** (raptor's is 0.46).
  The huge empty expanse of muzzle in front of the eye is what sells the head
  size.
- Lid: a **heavy soft brow ridge**, a 20-unit arc arching 5 units above the eye
  and thickening toward the front. It is a rounded bulge, not a frown — angled
  **up** at the front by 10°. No other species gets a brow ridge this large.
- Pupil: `r = 3` circle set **low and forward** within the eye, so it looks down
  toward the child.
- **Mouth: the only OPEN mouth in the roster** — a rounded cavity **26 wide ×
  12 tall** set in the forward half of the jaw, filled cream, with fully
  **rounded lip corners** (radius ≥ 5) and a soft rounded tongue bump 10 × 5 at
  the bottom. **Zero teeth. No fangs, no serrations, no visible gum line.** The
  shape is a soft "oh" — the ten quiet roars — not a snarl.
- Nostril: one 3-unit dot near the snout tip, high on the deep snout.
- Cheek: a soft cream cheek patch 14 × 10 under the eye, trex only.

Differentiators against the other three bipeds: only open-mouth cavity (spino
has a long line, raptor a tiny V, carno a short upturned smile); smallest
eye:head ratio at 0.19 against raptor's 0.46; only large brow ridge; only visible
tongue.

## 8. Forbidden

The specific round-1 failures for this species, to be corrected:

- **Round 1's trex had NO defining feature at all — "an anonymous orange
  lizard."** Forbidden: any head that is not at least 44 long × 34 deep and at
  least 35% of standing height. If the head can be swapped with carno's or
  pachy's head without anyone noticing, the file fails.
- **The head lobe was the same size as carno's and pachy's.** Forbidden: any
  head whose depth ÷ standing height falls below 0.35. Carno's is 0.30 excluding
  horns; trex must be visibly larger-headed than carno **before** carno's horns
  are considered.
- **The arms were a featureless 4-point stub with no fingers.** Forbidden: any
  hand without exactly two separated rounded fingers of ≥ 8 units each; any arm
  with less than 20 units of total reach.
- **The tail was a thin taper with no counterbalance mass.** Forbidden: any tail
  under 30 units deep at the base; any tail that begins tapering before 60% of
  its length; any pointed tip.
- Do not drift toward **carno**: **no horns, no bumps, no knobs, no crest and no
  raised feature of any kind on the skull roof — the crown from snout to nape is
  one smooth convex curve.** Trex's tail must not rise (carno's does); trex's
  legs must not be slender (carno's are); trex's spine must not go upright
  (carno's does).
- Do not drift toward **raptor**: trex's spine is head-**up** at 15°, never
  nose-down; the tail is a 32-deep wedge, never a level 14-deep bar; the legs
  are short and thick, never long folded Z's; no sickle claw on any toe;
  standing height ≥ 84 so it never reads as the small fast one.
- **Do not solve friendliness by becoming generic.** A rounded, toothless,
  smiling trex that has lost the head mass is a failure of this spec exactly as
  much as a scary one. Both the gentleness and the head dominance are required.
- No bared teeth, no fangs, no pointed claws, no aggressive brow.
- No copied path data from any other asset with the numbers perturbed. The
  outline is hand-authored.

## 9. Acceptance tests

1. Fill every body path flat black at 96 px (puffs hidden). A reviewer names it
   "T-Rex" or "the one with the big head." **Pass/fail.**
2. Flat-black side by side with `carno.svg` at 96 px: **delete nothing** — trex's
   skull roof is smooth with zero bumps and its head depth ÷ height is ≥ 0.35;
   carno carries two 20-unit horns and its head depth ÷ height is ≈ 0.30. Then
   the harder test: **digitally erase carno's horns and compare again.** The two
   outlines must still be told apart by head aspect (trex 0.79 long-boxy vs carno
   1.07 square), tail direction (trex droops and is 32 deep, carno rises and is
   16 deep), leg thickness (trex shin 22 vs carno shin 10) and L:H (1.28 vs
   0.85). **Pass/fail.** This test exists because round 1's carno was trex's path
   with horns inserted.
3. Flat-black side by side with `raptor.svg` at 96 px: trex's standing height is
   ≥ 84 and raptor's ≤ 76; trex's head depth ÷ height ≥ 0.35 vs raptor ≤ 0.25;
   trex's tail base depth ≥ 30 vs raptor ≤ 16; trex's spine is head-up, raptor's
   nose-down. A reviewer assigns each name correctly. **Pass/fail.**
4. Measure the head: **≥ 44 long × ≥ 34 deep**, and head depth ÷ standing height
   **≥ 0.35**. **Pass/fail.**
5. Head silhouette area **≥ 25%** of total; tail silhouette area **≥ 25%** of
   total; the two are within **40%** of each other. **Pass/fail.**
6. Measure the tail base depth: **≥ 30 units**; tapering starts no earlier than
   60% along its length; tip is blunt, ≥ 6 across. **Pass/fail.**
7. Count fingers on each hand: **exactly 2**, each ≥ 8 long × ≥ 6 wide,
   separated by a ≥ 4-unit notch; arm reach ≥ 20 units. **Pass/fail.**
8. Trace the skull roof from the snout tip back to the nape: **zero bumps, knobs,
   horns or vertices under 150°**. **Pass/fail.**
9. Count the roar puffs: exactly **10**, in two rows of five, each ≥ 11 × 9
   units, minimum 3-unit gap between puffs and 4-unit clearance to any body
   path. **Pass/fail.**
10. Every Section 3 feature meets its stated minimum size; the neck meets its
    ≤ 14 maximum. **Pass/fail.**
11. The file contains **no `#F5C55A` anywhere** and **no `#F39A49` anywhere**.
    Belly is `#FFF4D5`. **Pass/fail.**
12. Zero teeth, zero fangs, zero pointed claws in the file. The mouth cavity's
    lip corners have radius ≥ 5. **Pass/fail.**
13. Weight check: ≥ 40% of filled body area forward of the shoulder; ≥ 25%
    behind the hip. **Pass/fail.**
14. All coordinates satisfy 7.5 ≤ x, y ≤ 120.5; no stroke is clipped by the
    frame. **Pass/fail.**
15. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
16. Diff the body path against every other delivered dino path — **carno.svg
    first**: no shared sequence of three or more control points. **Pass/fail.**
