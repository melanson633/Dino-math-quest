---
id: raptor
name: Velociraptor
kind: dino
output: artifacts/dino-math-quest/public/dinos/raptor.svg
viewBox: "0 0 128 128"
silhouette_class: "small lean biped, forward pitch, long horizontal tail"
body_fill: "#F39A49"
accent_fills: ["#F5C55A"]
nearest_neighbors: [trex, spino]
countable: { element: footprints, count: 10 }
---

# Velociraptor — asset spec

## 1. Identity in one line

"The little fast one that leans forward and has the big curvy toe claw."

## 2. Silhouette contract

Filled flat black at 96 px this must read as **a small, low, long animal leaning
forward, with a stick-straight tail held out level behind it and a big hooked
claw lifted off the ground**. Small, low, long, leaning. Those four words are
the contract.

Overall bounding box: **x 6 → 124, y 48 → 120**. Width ≈ 118, height ≈ 72.
**Aspect ratio L:H ≈ 1.64 — the widest and by far the shortest of the four
bipeds** (trex 1.28, spino 1.04, carno 0.85). The top 40% of the frame
(y 6 → 46) is **empty**, and that emptiness is a required feature: no other
biped in the roster leaves it empty. If a reviewer sees the sprite touching the
top of the frame, it is not the raptor.

Stance: **running biped, hips higher than shoulders, head carried low and
forward.** Spine pitch (hip → shoulder line) is **≈ 35° from horizontal, nose
down** — the steepest forward pitch of the four (spino 8°, trex 15°, carno 45°
but *upright*, i.e. tipped the other way).

Proportions, stated so they cannot converge with the other three bipeds:

| measure | raptor value | why it is different |
|---|---|---|
| Standing height | **72** units | **smallest sprite in the four** — trex 86, spino 108, carno 106 |
| Head length | **28** units | 24% of body length |
| Head depth | **16** units | head aspect 0.57 (spino 0.38, trex 0.79, carno 1.07) |
| Head depth ÷ standing height | **0.22** | small-headed but not tiny; trex is 0.44 |
| Hip-joint height above ground | **60** units = **83%** of standing height | **longest legs relative to body in the roster** — the raptor is mostly leg |
| Torso length | **26** units | shortest torso; a compact wedge between long legs |
| Tail | 50 long, base depth 14, tip depth 5, held **dead level** | trex's tail is 34 long × 32 deep and droops; spino's droops; carno's rises |

Ordered walk of the body outline, clockwise from the snout tip:

1. Snout tip **(124, 62)** — small and rounded, 3-unit radius.
2. Top of the muzzle back and slightly up to the brow **(112, 56)**.
3. Over the small domed skull to the back of the head **(98, 56)**. Head box is
   x 96–124, y 56–72.
4. Short down-curving neck: **(96, 58) → (88, 62) → shoulder (80, 70)**. The
   neck curves **downward and forward** — the head hangs below the shoulder.
   This is the forward-pitch read.
5. **Back line climbs steeply rearward** from the shoulder **(80, 70) → (66, 60)
   → hip (54, 50)**. Rise 20 over run 26 ≈ **35°**.
6. **Tail: leaves the hip at (54, 50) and runs dead straight and level to the
   tip (6, 54).** Top edge drops only 4 units over 48 units of length. This is a
   ruler-straight horizontal bar, not a droop and not a curve.
7. Tail underside back: **(6, 58) → (30, 62) → (54, 64)**. Base depth 14, tip
   depth 4.
8. Belly, shallow and tucked: **(54, 64) → (68, 78) → chest (82, 76)**. The
   belly is high and tight — no sag. Raptor is lean.
9. Chest up to the throat **(86, 72)**, then the underside of the jaw runs
   forward: **(86, 72) → (106, 70) → (124, 66)**, closing at the snout tip.
10. **Near leg (the one carrying the claw), a deep folded Z**: hip **(60, 60)**
    → knee forward and down to **(74, 88)** → shin back to the ankle
    **(60, 106)** → foot forward to the toes **(80, 120)**. The leg's total
    vertical run is 60 units and it crosses the body's own width twice — a leg
    that is obviously folded and springy, not a straight stub.
11. **Far leg** drawn as a separate closed shape behind the body, inset 10 units
    rearward, same Z fold, 3 units narrower.
12. Two small arms drawn as separate closed shapes tucked at the chest
    (see Section 3).

**The sickle claw** is drawn into the near foot's outline as a large hooked
crescent (Section 3) and must appear in the flat-black silhouette as a **hook
against open background**, not as a notch cut into the foot.

## 3. Required features — minimum sizes

| feature | min size (viewBox units) | position |
|---|---|---|
| **Sickle claw** | **≥ 22 long × ≥ 8 thick**, crescent, tip lifted **≥ 14 units clear of the ground line** | arcs from (66, 108) up-forward to a blunt tip at (84, 96) |
| **Straight level tail** | **≥ 46 long**, top edge falling **≤ 6 units** over its whole length | x 6–54, y 50–64 |
| Head | ≥ 26 long × ≥ 14 deep | x 96–124 |
| Torso | ≥ 24 long × ≥ 20 deep | x 54–82 |
| Each leg | ≥ 12 wide at the thigh, **≥ 56 units of vertical run** hip to toe | y 58–120 |
| Each foot | ≥ 18 long | y 112–120 |
| Each arm + hand | ≥ 20 long total, two rounded fingers ≥ 7 each | x 78–98, y 74–92 |

The sickle claw is the single most-failed item in this file. **Round 1 delivered
a ~10-unit angular notch at the toe. At 96 px that is 7 screen pixels and no
child saw it.** A claw under 22 units, or a claw that touches the ground, or a
claw that is a concave notch in the foot rather than a convex hook standing out
from it, is treated as **absent** and fails review.

The claw tip is **blunt and rounded (3-unit radius)** — it is a big friendly
comma, not a knife. Friendliness and size are both required; solving only one
fails.

## 4. Countable elements

Source: `dinos.ts` → `raptor.practice.countPrompt` = **"Count by twos to ten."**
Also `movePrompt`: "Take quick steps: two, four, six." and `chant`:
"Ve-lo-ci-rap-tor, quick little steps."

- Required count: **exactly 10** footprints, arranged in **exactly 5 pairs**, so
  a child counting 2-4-6-8-10 lands one number per pair.
- Each footprint: **≥ 12 wide × ≥ 9 tall**, a rounded three-toed pad, its own
  closed path.
- **Within a pair**, the gap between the two prints is **3–5 units**. **Between
  pairs**, the gap is **≥ 10 units**. The two spacings must differ by at least
  a factor of 2 so the pairing is unambiguous at 96 px. A child must see five
  clusters, not ten scattered dots.
- Layout, a receding trail behind the running raptor:
  - **Near row**, y centers ≈ **114**: pairs at x centers **(12, 26)** and
    **(42, 56)** — 2 pairs, 4 prints.
  - **Far row**, y centers ≈ **100**: pairs at x centers **(14, 28)**,
    **(46, 60)** and **(78, 92)** — 3 pairs, 6 prints.
- Total 10. The far row sits behind the tail; the near row sits under it. No
  print may touch the tail, a leg, or the sickle claw — **minimum 4 units of
  clear background** between any print and any body path.
- Footprints are filled `#F5C55A` with the shared stroke, and are **excluded
  from the flat-black silhouette test** in Section 9 test 1.

Footprints are countable tokens, not anatomy, and are therefore exempt from the
18-unit anatomical minimum — but they carry their own hard floor of 12 × 9 and
must survive a 96 px screenshot check.

## 5. Stance and framing

- Ground line: **y = 120**. Both feet terminate on it. Nothing extends below.
- Stroke width **3**, so every coordinate satisfies **7.5 ≤ x ≤ 120.5** and
  **7.5 ≤ y ≤ 120.5**. The snout tip at x = 124 and the tail tip at x = 6 both
  violate this: **pull the snout in to x = 118 and the tail tip out only to
  x = 9** when authoring. Bounding box then reads x 9 → 118.
- Occupancy: ≈ 85% of frame width, **≈ 56% of frame height**. Low occupancy is
  intentional and is checked.
- Weight distribution: **at least 85% of the filled silhouette area lies below
  y = 48.** The upper third of the frame is empty.

## 6. Color plan

| role | fill |
|---|---|
| Body, head, tail, legs, arms | `#F39A49` (reserved) |
| **Belly, throat and inner-leg patch** | **`#F5C55A` gold** |
| Sickle claw | `#FFF4D5` cream — the claw is the one cream shape on the body, so it pops in color as well as in outline |
| Footprints | `#F5C55A` |
| Eye white | `#FFF4D5` |
| Pupil | `#503B32` |
| All strokes | `#503B32`, width 3, round joins and caps |

**Round 1 gave raptor the exact colour set of trex (`#F39A49` body,
`#F5C55A` belly), so the two collided on shape *and* colour.** The reserved
fills now differ (raptor `#F39A49`, trex `#C0553F`) and the accents are split
deliberately: **raptor's belly is gold and raptor uses cream only for the claw
and the eye; trex's belly is cream and trex uses no gold at all.** Neither rule
may be relaxed.

## 7. Face treatment

Velociraptor has the **biggest, brightest, most awake eye relative to its head**
in the roster — a quick, curious little animal.

- Eye: a **full circle, 13 units across**, centered **(108, 62)**. On a 28-unit
  head that is **46% of head length** — by far the largest eye:head ratio of the
  twelve (trex is 19%).
- Lid: **none.** The eye is fully open and perfectly round. Raptor is the only
  species with no lid line, and that alone identifies the face.
- Pupil: `r = 4` circle at (109, 62), plus a single **3-unit cream highlight
  dot** at the upper-left of the pupil. The highlight is raptor-only.
- Brow: a short 8-unit arc floating 3 units above the eye, tilted 15° up at the
  front — reads as bright and eager rather than fierce.
- **Mouth: a tiny closed V, 10 units wide**, from (114, 68) dipping to (119, 70)
  and back to (124, 67). It is the smallest mouth in the roster, deliberately
  paired with the largest eye. **No teeth. No open jaw. No smile arc.**
- Nostril: one 2-unit dot at (120, 63).
- Two small cheek freckles, 2 units each, at (104, 68) and (100, 70) — raptor
  only.

Differentiators against the other three bipeds: only lidless perfectly round
eye; only pupil highlight; largest eye:head ratio (0.46) against trex's smallest
(0.19); only tiny V mouth against trex's open cavity, spino's long line and
carno's upturned bulldog smile; only freckles.

## 8. Forbidden

The specific round-1 failures for this species, to be corrected:

- **The sickle claw was a ~10-unit angular notch at the toe that no child would
  see.** Forbidden: any claw under 22 units, any claw drawn as a concave notch
  or a chevron cut into the foot, any claw touching the ground line. The claw is
  a convex hook standing clear against open background, tip lifted ≥ 14 units.
- **Raptor shared trex's exact colour set (`#F39A49` body, `#F5C55A` belly), so
  it collided with trex on both shape and colour.** Forbidden: any cream belly
  (that is trex's), any use of `#C0553F`, any palette overlap with trex beyond
  the shared stroke and eye white.
- Do not drift toward **trex** on shape: raptor's head must stay under 0.25 of
  its standing height; the tail must stay level and thin (base depth ≤ 16) and
  must never become a thick drooping counterbalance wedge; the legs must stay
  slender (thigh ≤ 16 wide) and long; the spine must pitch **nose-down**, never
  head-high.
- Do not drift toward **spino**: no dome, hump, sail, ridge or raised shape of
  any kind on the back — the back line from hip to shoulder is one straight
  climb. No long flat crocodile snout; raptor's head is short (≤ 30) and its
  aspect ratio is 0.57, not 0.38.
- Raptor must not grow. Standing height ≤ 76 units. If the sprite fills the
  frame vertically it has stopped being the small fast one.
- No bared teeth, no pointed claws on the hands, no snarl.
- No copied path data from any other asset with the numbers perturbed. The
  outline is hand-authored.

## 9. Acceptance tests

1. Fill every body path flat black at 96 px (footprints hidden). A reviewer
   names it "Velociraptor" or "the little fast one." **Pass/fail.**
2. Flat-black side by side with `trex.svg` at 96 px: raptor's standing height is
   ≤ 76 units and trex's is ≥ 84; raptor's head depth ÷ height is ≤ 0.25 and
   trex's is ≥ 0.35; raptor's tail base depth is ≤ 16 and trex's is ≥ 30. A
   reviewer assigns each name correctly. **Pass/fail.**
3. Flat-black side by side with `spino.svg` at 96 px: raptor's back line from
   hip to shoulder contains no raised shape and its L:H is ≈ 1.64; spino carries
   a 32-unit dome and its L:H is ≈ 1.04. A reviewer assigns each name correctly.
   **Pass/fail.**
4. Measure the sickle claw: **≥ 22 long, ≥ 8 thick, tip ≥ 14 units above the
   ground line**, convex hook against open background. **Pass/fail.**
5. Screenshot the sprite at exactly 96 px and ask a reviewer to point at the
   claw without being told where it is. **Pass/fail.**
6. Measure the tail: **≥ 46 long**, top edge falls **≤ 6 units** across its
   length. **Pass/fail.**
7. Measure standing height: **≤ 76 units**. At least 85% of filled area lies
   below y = 48. **Pass/fail.**
8. Measure spine pitch, hip to shoulder: **≥ 30° nose-down**. **Pass/fail.**
9. Count the footprints: exactly **10**, in exactly **5** visually unambiguous
   pairs; within-pair gap 3–5 units, between-pair gap ≥ 10 units; each print
   ≥ 12 × 9 units. **Pass/fail.**
10. Every Section 3 feature meets its stated minimum size. **Pass/fail.**
11. The file contains **no `#FFF4D5` fill on the belly** and **no `#C0553F`
    anywhere**. Belly is `#F5C55A`. **Pass/fail.**
12. No bared teeth, no pointed claw tips (claw tip radius ≥ 3), no snarl.
    **Pass/fail.**
13. All coordinates satisfy 7.5 ≤ x, y ≤ 120.5; no stroke is clipped by the
    frame. **Pass/fail.**
14. Global constraints: `viewBox="0 0 128 128"` exactly; **no** `width`/`height`
    attribute; no `<image>`, raster or data URI; no `<text>` or font; no
    `<style>`, `class`, `<script>`, `<defs>`, or external `href`; no opaque
    full-bleed background `<rect>`; stroke `#503B32` with round joins and caps;
    every filled path closed with `Z`. **Pass/fail.**
15. Diff the body path against every other delivered dino path: no shared
    sequence of three or more control points. **Pass/fail.**
