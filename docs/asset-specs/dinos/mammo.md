---
id: mammo
name: Woolly Mammoth
kind: dino
output: artifacts/dino-math-quest/public/dinos/mammo.svg
viewBox: "0 0 128 128"
silhouette_class: four-legged shaggy hump, trunk and paired tusks
body_fill: "#B96C47"
accent_fills: ["#FFF4D5"]
nearest_neighbors: [stego, ankylo]
countable: { element: shaggy ridge peaks along the back, count: 5 }
---

## 1. Identity in one line

"An elephant with big hair and big curly tusks."

## 2. Silhouette contract

Filled flat black this must read as **a four-legged furry animal with a hump on
its shoulders, a hanging trunk, and two curving tusks.** Trunk plus four legs
carries the identity; the shaggy ridge carries the count.

Bounding box: **x 14–116, y 22–116.** Ground line **y = 114.** Facing **left.**
Stance: **standing four-square**, all four feet on the ground, body level, head
low and forward. **Not** rearing, **not** bipedal, **not** walking with a lifted
foot.

Ordered walk of the outline, starting at the shoulder hump and going clockwise
(back first, then rear, then underside, then head):

1. **Hump apex (59, 26)** — the highest point of the whole animal, sitting over
   the shoulders at roughly 45% of the body length from the front.
2. Back descends rearward through the shaggy ridge (§3 #1) to the **rump
   (105, 52)**.
3. **Rump** rounds down to the **tail root (108, 58)**; a **short thin tail**
   drops to (112, 70). Tail length **≤ 14 units**, width ≤ 5 units, and it must
   hang — never extend horizontally.
4. **Near rear leg**: rear edge from (105, 60) straight down to (105, 106); foot
   pad flares out to (111, 114) and forward to (94, 114); front edge of the leg
   rises to (94, 92).
5. **Far rear leg** occupies x 84–96, foot on the ground x 84–96 at y 114,
   drawn behind the near rear leg with **≥ 6 units** of its column visible so it
   reads as a separate leg in the silhouette.
6. **Belly** runs forward from (92, 92) to (48, 94), carrying a hanging fur
   fringe (§3 #4).
7. **Far front leg** occupies x 54–68, foot x 54–68 at y 114, again with ≥ 6
   units of column visible.
8. **Near front leg**: rear edge from (50, 92) down to (48, 106), foot pad
   (36, 114) to (52, 114), front edge rising to (40, 82).
9. **Chest** rises from (40, 80) to the **throat (34, 62)**.
10. **Trunk** leaves the face at (32, 58) and descends as a tube (§3 #2) through
    (28, 72), (26, 88), to a tip curling forward at **(34, 102)**.
11. Front of the face rises from the trunk root at (30, 54) over the **brow
    (32, 44)** to the **shaggy forehead crown (38, 38)**.
12. Crown runs rearward and upward, joining the hump apex at (59, 26).

Depth cues that do not alter the outline: the far tusk is drawn behind the trunk
in the same cream, offset 6 units up and back from the near tusk; far legs are
the body fill at reduced opacity.

**Silhouette-critical proportions:**
- Body length (x 34 → 108) is **≥ 68 units**; body height at the hump (y 26 →
  94) is **≥ 62 units** — a bulky, near-square mass.
- The trunk tip (y ≈ 102) hangs **below the knee line (y = 92)**.
- The gap between the two front feet and the two rear feet, measured foot-edge to
  foot-edge along y = 114, is **≥ 26 units** of empty ground, so four separate
  feet are visible on the ground line.

## 3. Required features

| # | Feature | Minimum size (viewBox units) | Position |
|---|---|---|---|
| 1 | **Shaggy back ridge** — 5 rounded peaks with V-valleys | ridge spans **≥ 48 units** of x; each peak **≥ 10 units** wide; each valley **≥ 6 units** deep | peaks at (48,33) (59,26) (70,31) (82,37) (94,44) |
| 2 | **Trunk** — a downward tube of even width with a gentle forward S | **≥ 44 units** long from face to tip; **10–13 units** wide the whole way, tapering no more than 3 units | root (32, 58) → tip (34, 102) |
| 3 | **Tusk pair** — two cream crescents, one on each side of the trunk, mirrored | each **≥ 32 units** of arc length, **≥ 7 units** thick at the base | near tusk root (33, 62) sweeping to tip (15, 84); far tusk root (39, 60) sweeping to tip (21, 90) |
| 4 | **Belly fur fringe** — hanging hair points along the underside | fringe band **≥ 44 units** wide, each point **≥ 7 units** deep | x 48–92, y 92–100 |
| 5 | **Four legs** — straight vertical columns | each **≥ 14 units** wide and **≥ 30 units** tall | near front x 36–52; far front x 54–68; far rear x 84–96; near rear x 94–111 |
| 6 | **Shoulder hump** | rises **≥ 18 units** above the rump line (y 52) | apex (59, 26) |
| 7 | **Shaggy forehead crown** | **≥ 18 units** wide | x 30–48, y 38–46 |

**Tusk symmetry rule (the round-1 fix):** the two tusks must be the **same curve
geometry** — same arc direction, same taper, same thickness — differing only in
position offset and length, and the length difference must be **≤ 8 units.** Both
sweep **down, forward, then up**, and both tips must end **higher than the arc's
lowest point** so they read as curling. Two shapes that are not obvious mirrors
of each other is a rejection.

## 4. Countable elements

`practice.countPrompt` for Woolly Mammoth is **"Count nine snow steps."**

**This is a movement prompt, not a drawing instruction.** Steps happen over time;
a static sprite cannot show nine of them, and forcing nine of anything onto a
mammoth (nine hair tufts, nine snowflakes, nine toes) would add a false identity
motif and wreck the silhouette. The art must **not** contain nine of anything.

The countable element in the art is the **shaggy back ridge: exactly five
peaks.**

- Count: **5**, exactly. This was the strongest thing about round-1 mammo and it
  is preserved deliberately.
- Peak centers: (48, 33), (59, 26), (70, 31), (82, 37), (94, 44). Horizontal
  spacing 11–12 units, evenly stepped.
- Separation: the valley between any two adjacent peaks is **≥ 6 units deep**
  measured from the lower of the two peak tops, so the peaks stay individually
  countable at 96 px and do not blur into one furry lump.
- The peak row must be the **only** repeated shape on the top outline. No
  secondary bumps on the rump, neck or hump.

Secondary fixed count, not narrated but reviewable: **exactly two** tusks. Never
one, never three.

## 5. Stance and framing

- Ground line **y = 114.** All four foot pads sit flat on it.
- Occupancy: sprite fills **≥ 78%** of frame width and **≥ 72%** of frame height.
  Mammo is the bulkiest sprite in the roster and should feel it.
- **Minimum margin from every frame edge: 6 units**, to the outer edge of the
  stroke. No path coordinate outside x 8–120 or y 8–120. The near tusk tip at
  x = 15 is the tightest point — verify it and its stroke.
- The trunk hangs in open space; keep **≥ 8 units** of background between the
  trunk's rear edge and the near front leg so the trunk is not read as a fifth
  leg.
- Body axis is **level**: hump apex (y 26) and rump (y 52) define a back that
  slopes down toward the rear, but the belly line (y 92–94) is horizontal within
  4 units.

## 6. Color plan

| Role | Fill |
|---|---|
| Body, hump, ridge, head, all four legs, trunk, tail | `#B96C47` (reserved) |
| Both tusks | `#FFF4D5` cream |
| Belly fur fringe | `#B96C47` with a cream `#FFF4D5` under-edge ≤ 6 units tall |
| Eye white | `#FFF4D5` |
| Pupil, catchlight ring, all outlines | `#503B32` |
| Far legs and far tusk (depth) | same hexes at reduced opacity — no new hex |

**No gold anywhere.** **No green anywhere** — round 1's other quadrupeds were
green and mammo correctly was not; keep it that way. Brown is half of mammo's
identity at thumbnail size.

## 7. Face treatment

Woolly Mammoth is the **big, warm, wide-open, mouthless** face of the roster.

- **Eye:** the largest simple eye in the set — a **circle 10 units in diameter**,
  cream `#FFF4D5`, centered **(40, 46)**, set high on the head and well back from
  the trunk root.
- **Pupil:** a large round `#503B32` dot, **r = 3.5**, with a single cream
  catchlight notch at its upper-left. The pupil-to-eye ratio (0.7) is the
  highest of the twelve and is what makes the face read as gentle and warm.
- **Lid:** none. Fully open. Instead, a **shaggy brow fringe of exactly three
  hair points**, each ≥ 6 units, hanging from (32, 40) to (48, 40) partially over
  the top of the eye — the eye peers out from under hair.
- **Mouth: none.** Mammo is the **only sprite in the roster with no drawn
  mouth** — the trunk root and the two tusk roots occupy the entire mouth region.
  Adding a smile arc here is a rejection.
- **Second eye:** not drawn. Strict side view.
- **How it differs:** biggest eye, biggest pupil ratio, only brow-fringe, only
  face with zero mouth geometry. Against `stego` (tiny eye, smiling arc) and
  `ankylo` (narrow eye under an armored brow) there is no overlap.

## 8. Forbidden

Round-1 `mammo.svg` had the best silhouette of the set — a real 5-point shaggy
ridge, correctly brown and not green — and that must be preserved. Its three
failures are forbidden:

1. **No trunk.** Round 1 shipped a mammoth with no trunk at all. A trunk meeting
   §3 #2 is mandatory; a short nub, a curl tucked against the chest, or a trunk
   that stops above the knee line is a rejection.
2. **Asymmetric tusks.** Round 1's two tusks were unrelated shapes that read as
   "a cheek and a scarf." The pair must be mirrored per the §3 symmetry rule.
   Never one tusk; never two shapes of different families.
3. **Standing on two legs.** Round 1 put the mammoth on two legs. A mammoth on
   two legs is wrong. Four legs, four foot pads on the ground line, no rearing,
   no lifted foot, no bipedal stance under any circumstance.
4. Losing the 5-peak ridge, changing its count, or blurring the valleys.
5. Green, gold, or grey body fill. Brown `#B96C47` only.
6. Drift toward **stego**: no triangular or kite-shaped plates, no twin row, no
   spiked tail. The ridge peaks are *rounded* fur, not plates, and the tail is a
   thin hanging string ≤ 14 units.
7. Drift toward **ankylo**: no armor plating, no body-wide bony scutes, no tail
   club, no ground-hugging low posture. Mammo stands tall on long straight legs.
8. Reusing, mirroring or perturbing another asset's path data.
9. Nine of any repeated element (see §4).

## 9. Acceptance tests

1. Fill every path flat black. A reviewer names the silhouette "mammoth" or
   "elephant" without a label. **PASS/FAIL**
2. Flat-black silhouette placed beside `stego` and `ankylo`: a reviewer picks
   mammo out of the three with no label. **PASS/FAIL**
3. Exactly **four** legs are present, each ≥ 14 units wide and ≥ 30 units tall,
   with four separate foot pads touching y = 114. **PASS/FAIL**
4. Total empty ground between the front foot group and the rear foot group along
   y = 114 is ≥ 26 units. **PASS/FAIL**
5. A trunk is present: ≥ 44 units long, 10–13 units wide throughout, tip below
   y = 92. **PASS/FAIL**
6. ≥ 8 units of background separate the trunk from the near front leg.
   **PASS/FAIL**
7. Exactly **two** tusks, mirrored: same arc direction and taper, length
   difference ≤ 8 units, each ≥ 32 units of arc and ≥ 7 units thick at base, one
   on each side of the trunk. **PASS/FAIL**
8. Both tusk tips end higher than the lowest point of their own arc. **PASS/FAIL**
9. Exactly **five** ridge peaks, each ≥ 10 units wide, valleys ≥ 6 units deep,
   individually countable at 96 px. **PASS/FAIL**
10. The file contains no group of nine repeated shapes. **PASS/FAIL**
11. Every feature in the §3 table meets its stated minimum. **PASS/FAIL**
12. Body fill is `#B96C47`; no green and no gold appear anywhere in the file.
    **PASS/FAIL**
13. No mouth path exists in the face region x 26–48, y 48–62. **PASS/FAIL**
14. Eye is a 10-unit circle with an r = 3.5 pupil and a 3-point brow fringe.
    **PASS/FAIL**
15. `viewBox="0 0 128 128"` exactly; no `width`, no `height`. **PASS/FAIL**
16. No `<image>`, raster, or data URI. **PASS/FAIL**
17. No `<text>` and no font reference. **PASS/FAIL**
18. No `<style>`, `class`, `<script>`, `<defs>`, or external `href`. **PASS/FAIL**
19. No opaque full-bleed background `<rect>`. **PASS/FAIL**
20. Stroke color is `#503B32`; joins and caps round. **PASS/FAIL**
21. Every path including its stroke half-width lies within x 8–120, y 8–120;
    the near tusk tip at x ≈ 15 is explicitly checked. **PASS/FAIL**
22. Path data is not a copy or numeric perturbation of any other asset in
    `public/dinos/`. **PASS/FAIL**
