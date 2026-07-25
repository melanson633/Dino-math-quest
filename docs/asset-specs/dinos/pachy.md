---
id: pachy
name: Pachycephalosaurus
kind: dino
output: artifacts/dino-math-quest/public/dinos/pachy.svg
viewBox: "0 0 128 128"
silhouette_class: biped, thick knobbed dome skull
body_fill: "#8AA2E0"
accent_fills: ["#F5C55A", "#FFF4D5"]
nearest_neighbors: [carno, trex]
countable: { element: dome rim knobs, count: 3 }
---

## 1. Identity in one line

"The bumpy-head dinosaur — his head is a helmet with bumps on it."

## 2. Silhouette contract

Filled flat black this must read as **a short, stocky, standing-up dinosaur whose
head is a thick bumpy dome and whose tail is a stubby droop.** Pachy is the
species at real risk of becoming a generic biped, so the silhouette is defined by
**proportion rules as much as by outline**: it is **taller than it is long**,
its back is **short and steep**, and its tail is **short and hanging**. Those
three facts are what separate it from every theropod in the roster.

Bounding box: **x 22–108, y 14–116.** Ground line **y = 114.** Facing **left.**
Stance: **upright biped**, torso carried near-vertical like a standing barrel,
head held forward and low over a very short neck, both feet planted.

Ordered walk of the outline, clockwise starting at the dome apex:

1. **Dome apex (48, 16)** — top of the skull, and the topmost point of the sprite.
2. Dome curves down and forward through (39, 20) and (33, 30) to the **front
   dome rim (30, 36)**, where the three knobs sit (§3 #2). The knobs interrupt
   this arc — the outline must bulge out at each one.
3. Down past the last knob to the **brow (30, 52)**.
4. Forward and down to the **blunt muzzle tip (24, 58)**; short vertical front
   face 6 units; back along the **jaw line** to the **jaw hinge (40, 62)**.
5. **Throat** drops steeply to the **chest (45, 72)**. Neck run from jaw hinge to
   chest is **≤ 14 units** — the shortest neck in the roster.
6. **Chest** bulges forward to its widest at **(42, 82)**, then the **belly**
   curves back and down to the **groin (54, 100)**.
7. **Near leg**: front edge of the thigh from (54, 96) down the shank to
   (56, 108); **foot** forward to (45, 114), back along the ground to (67, 114);
   rear edge of the leg rises to (66, 94).
8. **Far leg** occupies x 68–86, foot on the ground x 70–88 at y 114, with
   ≥ 8 units of its column visible behind the near leg.
9. **Hip / rump (80, 76)**.
10. **Tail** leaves the hip at (84, 78) and sweeps back and **down** to a blunt
    end at **(106, 96)**. See §3 #5.
11. Underside of the tail returns to the rump at (82, 88).
12. **Back** runs from the hip (80, 74) forward and **steeply upward** to the
    **shoulder (58, 52)**, then to the **back of the skull (63, 36)**, closing at
    the dome apex.
13. **Arms**: two short arms leave the chest at (46, 74), angling forward and
    down to small hands at (36, 88).

**Anti-theropod proportion rules — all three are hard requirements:**

- **R1 — Taller than long.** Torso vertical extent (skull back y 36 → groin
  y 100 = 64 units) must **exceed** torso horizontal extent (chest x 42 → hip
  x 84 = 42 units) by **≥ 15 units.** A theropod is longer than it is tall;
  pachy is the reverse.
- **R2 — Short steep back.** The horizontal run from hip (80, 74) to shoulder
  (58, 52) is **≤ 26 units**, and the back rises **≥ 20 units** over that run —
  a slope steeper than 35°. `trex` and `carno` have long near-horizontal backs of
  45+ units. Any back longer than 32 units horizontally is a rejection.
- **R3 — Short drooping tail.** See §3 #5.

## 3. Required features

| # | Feature | Minimum size (viewBox units) | Position |
|---|---|---|---|
| 1 | **Dome** — a thick rounded skull cap, gold, distinctly taller than a skull profile needs to be | **≥ 36 units** wide, rising **≥ 22 units** above the brow line (y 52) | x 30–66, y 16–42 |
| 2 | **Dome rim knobs** — exactly 3 rounded bumps on the front rim | knob band spans **≥ 22 units**; each knob **≥ 9 units** across and projects **≥ 5 units** clear of the dome arc | centers (31, 30), (29, 40), (33, 49) |
| 3 | **Blunt short muzzle** below the dome | **≥ 18 units** long, jaw depth ≥ 10 units | x 24–42, y 50–62 |
| 4 | **Barrel torso** — near-vertical, widest at the chest | chest-to-back thickness **≥ 34 units**; torso height **≥ 60 units** | x 42–84, y 40–100 |
| 5 | **Short drooping tail** — thick, blunt-ended | length **26–34 units**, base **≥ 16 units** deep, blunt tip **≥ 8 units** wide, hanging at 30–45° below horizontal, tip at y ≥ 92 and x ≤ 108 | hip (84, 78) → tip (106, 96) |
| 6 | **Two thick legs** | each **≥ 18 units** wide, **≥ 34 units** tall, foot **≥ 20 units** long | near x 45–67, far x 68–88 |
| 7 | **Two short arms with hands** | each **≥ 20 units** long, **≥ 7 units** wide, hand ≥ 9 units across, clear of the belly by ≥ 6 units | chest (46, 74) → hand (36, 88) |

The dome must be **stroked separately from the skull** so it reads as a thick cap
sitting on the head, and its lower rim must **overlap the skull outline by ≥ 6
units** — not float above it. A dome that touches the skull at a single tangent
point reads as a hat and is a rejection.

## 4. Countable elements

`practice.countPrompt` for Pachycephalosaurus is **"Count three gentle taps."**

**A tap is a movement, not an object.** Nothing in the art can literally be three
taps. But unlike Iguanodon's "eight tiny steps," the number three is small enough
to anchor to a real anatomical feature, and pachy *needs* countable knobs on its
dome anyway. So the count is deliberately mapped:

The countable element is the **dome rim knobs: exactly three.** The child taps
three visible bumps while the app narrates three gentle taps.

- Count: **3**, exactly. Not two, not five, not a scattering of texture bumps.
- Centers: **(31, 30), (29, 40), (33, 49)** — a descending arc down the front rim
  of the dome, from the crown toward the brow.
- Spacing: adjacent knob centers **10–11 units apart**, with a visible concave
  notch **≥ 4 units deep** between each pair.
- Each knob must **break the dome's outline** by ≥ 5 units, so all three survive
  the flat-black silhouette test and are countable at 96 px.
- No additional bumps, studs, spots or texture dots anywhere else on the dome,
  skull, back or tail. Three is the total on the whole sprite.

## 5. Stance and framing

- Ground line **y = 114.** Both feet flat on it.
- Occupancy: sprite fills **≥ 66%** of frame width and **≥ 78%** of frame
  height — the tallest-feeling non-`brachi` sprite, and the vertical emphasis is
  deliberate.
- **Minimum margin from every frame edge: 6 units**, to the outer edge of the
  stroke. No path coordinate outside x 8–120 or y 8–120. The dome apex at y = 16
  is the tightest point — verify it and its stroke half-width.
- The tail must not reach the right edge: tip x ≤ 108, leaving ≥ 20 units of
  background to the right. A tail that runs to the frame edge is what makes a
  sprite look like a theropod.
- The dome apex is the highest point of the sprite; nothing on the back or tail
  may rise above y = 36.

## 6. Color plan

| Role | Fill |
|---|---|
| Body, neck, torso, legs, arms, tail, lower skull | `#8AA2E0` (reserved) |
| Dome cap and the three rim knobs | `#F5C55A` gold |
| Belly panel, chest to groin | `#FFF4D5` cream, ≥ 12 units tall at its deepest |
| Eye white | `#FFF4D5` |
| Pupil, brow bar, all outlines | `#503B32` |
| Far leg (depth) | `#8AA2E0` at reduced opacity, no new hex |

The knobs are the **same gold as the dome** and are read by their outline bulge,
not by a color change. Do not tint them a second color.

## 7. Face treatment

Pachycephalosaurus is the **small-eyed, heavy-browed, patient** face — a face
looking out from under a helmet.

- **Eye:** the **smallest and lowest-set** eye of the four in this batch — a
  **circle 6 units in diameter**, cream `#FFF4D5`, centered **(34, 55)**, tucked
  directly beneath the dome rim with **≤ 5 units** between the eye top and the
  lowest knob. The crowding is the point.
- **Pupil:** small, **r = 2**, and **offset upward** within the eye so pachy
  reads as glancing up under his own dome.
- **Lid:** none, but a **straight heavy brow bar** — a `#503B32` stroked bar
  **13 units long × 3 units thick** — sits horizontally at (28, 50)–(41, 50),
  directly above the eye. It is the only straight-bar brow in the roster.
- **Mouth:** a **flat wide line, 17 units long**, from (25, 60) to (42, 60), with
  the corners turned up **only in the final 2 units at each end** — a closed,
  contained, gentle expression to match `cheer: "Pachy practiced gently."` No
  open jaw, no teeth, no broad smile arc.
- **Second eye:** not drawn. Strict side view.
- **How it differs:** smallest eye + smallest pupil + only straight-bar brow +
  only flat mouth with turned-up ends. Against `carno` (eyes under two horns,
  wide toothy grin) and `trex` (large round eye, open toothed jaw) it shares no
  face element.

## 8. Forbidden

Round-1 `pachy.svg` failed on both head and body. Both failures are forbidden:

1. **A smooth dome.** Round 1's dome was "a large smooth gold cubic with zero
   knobs, bumps or spikes on its rim" — it read as **a hat or a balloon** on a
   generic dino. Exactly three knobs breaking the outline (§3 #2, §4) are
   mandatory. A smooth arc is an automatic rejection.
2. **The recycled theropod template.** Round 1's body was the same body shared
   with `trex` and `carno`. Rules **R1, R2 and R3** in §2 exist solely to make
   that impossible: taller than long, back ≤ 26 units horizontally, tail 26–34
   units and hanging. Any of the three violated is a rejection regardless of how
   good the head is.
3. **A long horizontal counterbalance tail.** Any tail over 34 units, or held
   within 20° of horizontal, or reaching past x = 108.
4. **A forward-pitched running crouch.** The torso is upright: the chest-to-groin
   axis must be within 20° of vertical.
5. **Stub arms or no arms.** Round-1 theropods used vestigial nubs; pachy's arms
   are ≥ 20 units and end in visible hands, clear of the belly.
6. A dome that floats above the skull with no overlap, or that is drawn as a
   separate detached ellipse.
7. Any bumps, studs or texture dots outside the three rim knobs.
8. Drift toward **carno**: no paired horns above the eyes, no bull brow. Pachy's
   knobs sit on the **front rim of the dome in a descending arc of three**, never
   as a symmetric pair over the eyes.
9. Drift toward **trex**: no massive head relative to body, no open toothed jaw,
   no thick horizontal tail.
10. Reusing, mirroring or perturbing another asset's path data — especially
    `trex.svg` or `carno.svg`.
11. Purple, pink or violet body fill (that is `spino` and `carno` territory).
    `#8AA2E0` blue only.

## 9. Acceptance tests

1. Fill every path flat black. A reviewer names the silhouette "the bumpy-head
   dinosaur" without a label. **PASS/FAIL**
2. Flat-black silhouette placed beside `carno` and `trex`: a reviewer picks pachy
   out of the three with no label, and does **not** describe it as "the same body
   with a different head." **PASS/FAIL**
3. **R1:** torso vertical extent exceeds torso horizontal extent by ≥ 15 units.
   **PASS/FAIL**
4. **R2:** horizontal run from hip to shoulder ≤ 26 units, with ≥ 20 units of
   rise. **PASS/FAIL**
5. **R3:** tail length 26–34 units, held 30–45° below horizontal, blunt tip
   ≥ 8 units wide, tip at y ≥ 92 and x ≤ 108. **PASS/FAIL**
6. Chest-to-groin axis is within 20° of vertical. **PASS/FAIL**
7. Exactly **three** knobs on the dome rim, each ≥ 9 units across, each breaking
   the dome outline by ≥ 5 units, with ≥ 4-unit notches between adjacent pairs,
   all three countable at 96 px. **PASS/FAIL**
8. Zero bumps, studs or texture dots anywhere else on the sprite. **PASS/FAIL**
9. Dome is ≥ 36 units wide and rises ≥ 22 units above the brow, and its rim
   overlaps the skull outline by ≥ 6 units. **PASS/FAIL**
10. Two arms are present, each ≥ 20 units long, ending in a hand ≥ 9 units
    across, clear of the belly by ≥ 6 units. **PASS/FAIL**
11. Every feature in the §3 table meets its stated minimum. **PASS/FAIL**
12. Body fill is `#8AA2E0`; the dome and knobs are `#F5C55A`; no other body hue
    appears. **PASS/FAIL**
13. Eye is a 6-unit circle with an r = 2 upward-offset pupil, ≤ 5 units below the
    lowest knob, with a straight 13 × 3 brow bar above it. **PASS/FAIL**
14. Mouth is a 17-unit flat line with turn-ups only in the last 2 units at each
    end — not an arc, not open, no teeth. **PASS/FAIL**
15. Dome apex is the topmost point; nothing on back or tail rises above y = 36.
    **PASS/FAIL**
16. `viewBox="0 0 128 128"` exactly; no `width`, no `height`. **PASS/FAIL**
17. No `<image>`, raster, or data URI. **PASS/FAIL**
18. No `<text>` and no font reference. **PASS/FAIL**
19. No `<style>`, `class`, `<script>`, `<defs>`, or external `href`. **PASS/FAIL**
20. No opaque full-bleed background `<rect>`. **PASS/FAIL**
21. Stroke color is `#503B32`; joins and caps round. **PASS/FAIL**
22. Every path including its stroke half-width lies within x 8–120, y 8–120; the
    dome apex at y ≈ 16 is explicitly checked. **PASS/FAIL**
23. Path data is not a copy or numeric perturbation of `trex.svg`, `carno.svg`,
    or any other asset in `public/dinos/`. **PASS/FAIL**
