---
id: jungle
name: Jungle
kind: biome
output: artifacts/dino-math-quest/public/biomes/jungle.svg
viewBox: "0 0 192 128"
mood: warm green, dense canopy
base_fill: "#CDE8BE"
band_fills: ["#EDF6D8", "#9FCB7C", "#CDE8BE", "#B0D28E", "#A2C47F"]
accent_fills: ["#DCEFC6", "#8FBF6E"]
forbidden_fills: ["#78B94B", "#C3D96B", "#3F8F72", "#A9D66E"]
max_stroke_width: 1.5
sibling_biomes: [beach, volcano, ice-cave]
repeat_motifs:
  - { motif: canopy leaf-lobe scallop, instances: 7, register: "y 2-26" }
  - { motif: understory frond fan, instances: 5, register: "y 102-126" }
  - { motif: trunk column, instances: 4, register: "flanks only" }
---

## 1. Identity in one line

"It's the leafy jungle — big soft leaves up top and bushy ground down below."

## 2. Composition zones

The frame is four horizontal bands plus two motif registers. Band boundaries are
horizontal and run the full 192-unit width; this banding is the primary identity
channel because it is the only thing that survives every crop.

| band | y range | fill | contents |
|---|---|---|---|
| A — canopy | 0–26 | `#9FCB7C` mass over `#EDF6D8` sky gaps | 7 leaf-lobe scallops hanging down from y 0 to a lobe bottom between y 14 and y 26 |
| B — mid field | 26–100 | `#CDE8BE` (base fill) | open, near-empty haze; trunks in flanks only |
| C — understory | 100–116 | `#B0D28E` | 5 frond fans, tips reaching up to y 102 |
| D — floor | 116–128 | `#A2C47F` | flat, unbroken; no texture, no stroke |

- The A/B boundary sits at y 26 — above the safe zone, so it is allowed to be the
  highest-contrast edge in the file (`#9FCB7C` against `#CDE8BE`).
- The B/C boundary sits at y 100, exactly on the bottom edge of the safe zone. It
  is the only band edge permitted to touch the safe zone and it must be a straight
  horizontal line, not a scalloped or stroked one.
- Trunk columns: 4 vertical soft-edged columns, `#B8DCA6`, width 8–12 units, at
  x centers 10, 38, 154, 182. They run y 26–116. None may enter x 60–132.

## 3. UI safe zone — `x 60–132, y 30–100`

A title pill, the answer tiles and the letter tray render over this rectangle. It
must read as one quiet, near-flat field.

Allowed inside `x 60–132, y 30–100`:
- The base fill `#CDE8BE` covering essentially the whole region.
- At most **two** quiet-variant shapes (see §4), each filled `#DCEFC6` or
  `#C2E0B0` — both within 0.08 relative luminance of `#CDE8BE`.
- Nothing else.

Not allowed inside `x 60–132, y 30–100`:
- Any stroke of any width or color. Zero stroked geometry crosses this rectangle.
- Any fill from the sprite tier or any fill more saturated than S 35% in HSL.
- Any edge where the two adjacent fills differ by more than 0.08 relative
  luminance.
- Trunks, vines, hanging creepers, ropes, or any vertical dark element. Round 1
  put four thick dark vine strokes at the exact geometric center of the canvas,
  straddling the title pill and the answer tiles. There are no vines in this
  asset at all.
- Any shape whose bounding box is smaller than 20×20 units (small shapes read as
  UI artifacts under the tiles).

Elements may pass *through* the horizontal strips y 0–30 and y 100–128 at any x,
including x 60–132, at full contrast. Those strips are outside the safe zone.

## 4. Crop safety

The rendered element is `background-size: cover`. Two reference crops:

**Phone 375×812.** Cover scale = max(375/192, 812/128) = 6.344. Rendered width
1218 px, so the crop is horizontal. Visible source width = 375/6.344 = 59.1
units, centered: **x 66.4–125.6, y 0–128 survives.** Everything outside x 66–126
is discarded. Note that this surviving column is almost exactly the safe zone in
x — but the full 128 units of height survive, so the y 0–30 and y 100–128
registers are visible on phone.

**Desktop 1280×800.** Cover scale = max(1280/192, 800/128) = 6.667. Rendered
height 853 px, so the crop is vertical. Visible source height = 800/6.667 = 120
units, centered: **x 0–192, y 4–124 survives.** The top 4 and bottom 4 units are
discarded.

Consequences, which are requirements:

1. **No identifying element may be a single instance.** Every motif below repeats
   at the stated count across the full 192-unit width.
2. **Nothing identifying may live in y 0–4 or y 124–128** (lost on desktop). Canopy
   lobe *bottoms* must fall between y 14 and y 26; frond *tips* must reach up to
   y 102 or higher. The lobes and fronds must remain nameable if the outer 4 units
   are removed.
3. **Nothing identifying may depend on x < 66 or x > 126 alone** (lost on phone).
   Because that column coincides with the safe zone in x, phone identity is carried
   by (a) the four-band color structure, which survives every crop, and (b) the
   motif instances that sit in the y 0–30 and y 100–128 registers within
   x 66–126, which are outside the safe zone and therefore may be full contrast.

Motif instance table — x centers, and which crop each serves:

| motif | count | x centers | y register | phone-visible instances |
|---|---|---|---|---|
| canopy leaf-lobe scallop | 7 | 12, 40, 68, 96, 124, 152, 180 | 0–26 | 3 (x 68, 96, 124) |
| understory frond fan | 5 | 20, 56, 96, 136, 172 | 102–126 | 1 (x 96) — plus partials at 56/136 |
| trunk column | 4 | 10, 38, 154, 182 | 26–116 | 0 (desktop-only motif, by design) |

Frond fans at x 56 and x 136 must each be at least 34 units wide so that a
recognizable portion falls inside x 66–126.

**Quiet-variant rule.** A motif instance whose bounding box overlaps
`x 60–132, y 30–100` must be rendered in quiet variant: fill `#DCEFC6` or
`#C2E0B0`, no stroke, no accent, no interior detail. In this biome only the
trunk columns would ever qualify, and trunks are banned from x 60–132 outright,
so the practical rule is: **no motif geometry enters the safe zone at all.**

## 5. Contrast budget

Background tier only. Same hue family as the jungle sprites, lightened and
desaturated so a green dino never sits on its own color.

| role | hex | HSL (approx) |
|---|---|---|
| sky gap (band A background) | `#EDF6D8` | 82° 62% 91% |
| canopy mass (band A) | `#9FCB7C` | 92° 42% 64% |
| mid field / base fill (band B) | `#CDE8BE` | 96° 50% 83% |
| understory (band C) | `#B0D28E` | 88° 43% 69% |
| floor (band D) | `#A2C47F` | 88° 38% 63% |
| quiet accent (safe-zone-legal) | `#DCEFC6` | 90° 57% 86% |
| leaf highlight (outside safe zone) | `#8FBF6E` | 92° 41% 59% |

Intended contrast against the sprite tier:

- Jungle-adjacent sprites are stego `#78B94B` (L 51%), ankylo `#C3D96B` (L 64%),
  brachi `#3F8F72` (L 40%). The base fill `#CDE8BE` sits at L 83%.
- **Requirement: every background fill in this file is at least 15 HSL lightness
  points lighter than `#78B94B` and at least 15 points less saturated than
  `#C3D96B`.** The darkest fill in the file is `#8FBF6E` at L 59% / S 41%, which
  clears `#78B94B` by 8 points of lightness — and `#8FBF6E` is permitted only
  above y 26 and below y 100, where sprites do not stand.
- **Requirement: no fill in this file is any of `#78B94B`, `#C3D96B`, `#3F8F72`,
  or `#A9D66E`.** Round 1 painted the jungle at sprite saturation with the sprite
  palette; a `#A9D66E` dino on a `#A9D66E` field is invisible.

Stroke budget:

- **Max stroke width 1.5 units** (README caps at 2; this file goes tighter).
- Reason, stated so it is not re-litigated: this file is full-bleed. At desktop
  the scale factor is 6.667 px per unit. `stroke-width="4"` renders at ~27 px,
  and round 1's 4-unit strokes on a 128-square source rendered near 40 px of
  near-black `#503B32`. That is foreground sprite weight on a background plate.
  1.5 units renders at ~10 px, which reads as a drawn edge, not a bar.
- Strokes are permitted only in band A (y 0–26) and band C/D (y 100–128), only in
  `#8FBF6E`, and only on leaf-lobe and frond outlines. Total stroked path length
  across the file must not exceed 600 units.
- No stroke may be `#503B32` in this file. Dark brown is a sprite-tier value here.
- Round joins and caps. Every stroked path must sit at least 1 unit inside the
  viewBox so the stroke half-width is not clipped.

## 6. Color plan

- Band A canopy mass — `#9FCB7C`, occupying y 0–26 full width, with `#EDF6D8`
  sky showing through between the 7 lobes.
- Band A leaf highlight — `#8FBF6E`, one crescent per lobe, ≥12 units wide.
- Band B mid field — `#CDE8BE` flat, full width y 26–100. This is the base fill
  and the dominant area of the file (~58% of the frame).
- Band B trunk columns — `#B8DCA6`, flanks only.
- Band C understory — `#B0D28E`, with frond fans in `#9FCB7C`.
- Band D floor — `#A2C47F` flat.
- Quiet accent — `#DCEFC6`, used for at most two soft haze blobs in the safe zone.
- No gold `#F5C55A`. No cream `#FFF4D5`. No `#503B32`. Those are sprite-tier
  structural colors and their presence in a background reduces sprite separation.
- No gradients, no opacity below 1.0, no `<defs>`.

## 7. Forbidden

Round-1 failures this spec exists to prevent:

1. **`stroke-width="4"`.** All four round-1 biomes used it on a 128 viewBox. Full
   bleed on a 1280 px desktop that is a ~40 px near-black brown line across the
   art. These were foreground-weight graphics, not backgrounds. Cap here is 1.5.
2. **Square 1:1 viewBox composed as a portrait band-stack.** Cropped cover to
   1280×800 the visible window was only y 24–104, and jungle's entire identity —
   the canopy — lived in the crop-away zone. This asset is `0 0 192 128` and the
   canopy is at y 2–26, which survives the y 4–124 desktop window.
3. **Sprite-tier saturation and the identical 10-hex sprite palette.** A `#A9D66E`
   dino on a `#A9D66E` jungle field is invisible. This file uses the background
   tier in §5 and none of the reserved body fills.
4. **The vines.** Round 1 put four thick dark vine strokes at the exact geometric
   center of the canvas, straddling where the title pill and the answer tiles
   land. **This asset contains no vines, no hanging creepers, and no vertical
   element of any kind inside x 60–132.**

Also forbidden:

- Any single hero element (one big tree, one monkey, one waterfall). Identity is
  banding plus repeats.
- Text, numerals, `<text>`, fonts.
- `<image>`, raster, data URIs, `<style>`, `class`, `<script>`, `<defs>`,
  external `href`.
- `width` or `height` attributes on the root `<svg>`.
- Any green fill also used by beach, volcano, or ice-cave. Ice Cave must contain
  no green at all; jungle owns the green range.
- Flowers, fruit, or eyes peeking from foliage — saturated small shapes that
  compete with answer tiles.

## 8. Acceptance tests

Each is pass/fail against the finished SVG.

1. Root element is `<svg viewBox="0 0 192 128">` with no `width` and no `height`
   attribute. PASS/FAIL.
2. File contains no `<image>`, `<text>`, `<style>`, `<script>`, `<defs>`, `class=`,
   `href=`, no data URI, no gradient element. PASS/FAIL.
3. Maximum `stroke-width` value anywhere in the file is ≤ 1.5. Grep every
   `stroke-width` occurrence; any value > 1.5 is FAIL.
4. No element with a `stroke` attribute has geometry intersecting the rectangle
   `x 60–132, y 30–100`. PASS/FAIL.
5. No fill in the file equals `#78B94B`, `#C3D96B`, `#3F8F72`, `#A9D66E`,
   `#F5C55A`, `#FFF4D5`, or `#503B32`. PASS/FAIL.
6. Every fill used has HSL saturation ≤ 62% and lightness ≥ 59%. PASS/FAIL.
7. Base fill `#CDE8BE` covers ≥ 90% of the pixel area of the rectangle
   `x 60–132, y 30–100`. Remaining area is `#DCEFC6` or `#C2E0B0` only. PASS/FAIL.
8. No two adjacent fills inside `x 60–132, y 30–100` differ by more than 0.08
   relative luminance. PASS/FAIL.
9. Canopy leaf-lobe scallops: exactly 7 instances, x centers within ±4 of
   12, 40, 68, 96, 124, 152, 180; every lobe bottom between y 14 and y 26.
   PASS/FAIL.
10. Understory frond fans: exactly 5 instances at x centers within ±4 of
    20, 56, 96, 136, 172; every fan tip at y ≤ 102 (i.e. reaching up into the
    y 102–126 register) and every fan ≥ 34 units wide. PASS/FAIL.
11. Crop the source to `x 66–126, y 0–128` (phone). The result still shows
    ≥ 3 canopy lobes and ≥ 1 full frond fan, and the four-band color structure
    is intact. PASS/FAIL.
12. Crop the source to `x 0–192, y 4–124` (desktop). No canopy lobe and no frond
    fan is lost or truncated below recognizability. PASS/FAIL.
13. No vine, creeper, rope, trunk, or any element with height > 20 units and
    width < 20 units exists anywhere in `x 60–132`. PASS/FAIL.
14. Trunk columns: exactly 4, all with bounding boxes entirely in x < 60 or
    x > 132. PASS/FAIL.
15. Thumbnail test at 96×64 px alongside `beach.svg`, `volcano.svg` and
    `ice-cave.svg`: a viewer names this one "jungle" and does not confuse it with
    any of the other three. Base fills must be visibly different — jungle
    `#CDE8BE`, beach `#F7E3B0`, volcano `#EFA98C`, ice-cave `#D9DCF2`. PASS/FAIL.
16. Composite the stego (`#78B94B`), ankylo (`#C3D96B`) and brachi (`#3F8F72`)
    sprites at 96 px over this background at three x positions. Each sprite
    silhouette is fully separable from the background at every position.
    PASS/FAIL.
17. Every path, including stroke half-width, lies inside `0 0 192 128`.
    PASS/FAIL.
18. Total stroked path length ≤ 600 units. PASS/FAIL.
