---
id: volcano
name: Volcano
kind: biome
output: artifacts/dino-math-quest/public/biomes/volcano.svg
viewBox: "0 0 192 128"
mood: warm dark, ember glow
base_fill: "#EFA98C"
band_fills: ["#F7D6BE", "#EFA98C", "#E09479", "#D98F78"]
accent_fills: ["#F6C0A4", "#FBD9C2", "#E8886B"]
forbidden_fills: ["#C0553F", "#F39A49", "#B96C47", "#F5C55A", "#503B32"]
max_stroke_width: 1.5
sibling_biomes: [jungle, beach, ice-cave]
repeat_motifs:
  - { motif: ember mote, instances: 9, register: "y 4-28" }
  - { motif: cone ridge, instances: 5, register: "flank cones y 34-128, center cones y 100-128" }
  - { motif: lava rivulet, instances: 5, register: "y 104-126" }
---

## 1. Identity in one line

"It's the volcano — orange all over, with pointy mountains and little sparks
floating up."

## 2. Composition zones

Four horizontal bands full width, plus a cone silhouette register. Banding is the
primary identity channel because it survives every crop.

| band | y range | fill | contents |
|---|---|---|---|
| A — ash sky | 0–28 | `#F7D6BE` | 9 ember motes in `#E8886B` |
| B — haze field | 28–100 | `#EFA98C` (base fill) | flank cones only; center is empty |
| C — ash plain | 100–116 | `#E09479` | cone bases, 5 lava rivulets |
| D — foreground crust | 116–128 | `#D98F78` | flat, unbroken |

Cone register — 5 cones, and their heights are governed by x position:

| cone | x span | peak y | fill | notes |
|---|---|---|---|---|
| 1 | 0–44 | 34 | `#E09479` | flank, full height allowed |
| 2 | 30–66 | 52 | `#E8886B` | flank, must not cross x 60 above y 100 |
| 3 | 72–120 | **100** | `#EFA98C`→`#F6C0A4` quiet variant | center, low ridge only |
| 4 | 126–170 | 46 | `#E09479` | flank |
| 5 | 156–192 | 38 | `#E8886B` | flank |

Cone 3 is the center repeat. Its peak sits at y 100, exactly on the bottom edge
of the safe zone, and it is filled in quiet variant. **No cone mass rises above
y 100 anywhere inside x 60–132.** Round 1's dark cone sat upper-center — the
darkest mass in the file, in the highest-contrast biome of the four, exactly
where the title pill sits. Title text over it was unreadable.

## 3. UI safe zone — `x 60–132, y 30–100`

A title pill, the answer tiles and the letter tray render over this rectangle.
Volcano is the highest-contrast biome of the four, so this section is the tightest
of the four specs.

Allowed inside `x 60–132, y 30–100`:
- The base fill `#EFA98C` covering essentially the whole region.
- At most two quiet haze blobs in `#F6C0A4` or `#FBD9C2`, both within 0.08
  relative luminance of `#EFA98C`.
- Nothing else.

Not allowed inside `x 60–132, y 30–100`:
- **Any cone, ridge, peak, crater rim, or triangular mass.** Cone 3's peak is
  capped at y 100 for exactly this reason. Cones 2 and 4 must have their x spans
  clipped so no cone geometry enters x 60–132 above y 100.
- Any stroke of any width or color. Zero stroked geometry crosses this rectangle.
- Any ember, spark, glow dot, or lava element. Embers live in y 4–28 only; lava
  lives in y 104–126 only.
- Any fill darker than L 65% in HSL. `#E8886B` (L 67%) and `#D98F78` (L 66%) are
  banned here.
- Any fill with HSL saturation > 45%.
- Any edge where the two adjacent fills differ by more than 0.08 relative
  luminance.
- Any shape with a bounding box smaller than 20×20 units.

The strips y 0–30 and y 100–128 are outside the safe zone and may carry full
contrast at any x, including x 60–132. That is where the center repeats of every
motif live.

## 4. Crop safety

`background-size: cover`. Two reference crops:

**Phone 375×812.** Cover scale = max(375/192, 812/128) = 6.344. Rendered width
1218 px → horizontal crop. Visible source width = 375/6.344 = 59.1 units,
centered: **x 66.4–125.6, y 0–128 survives.** The surviving x column coincides
almost exactly with the safe zone, but all 128 units of height survive, so the
y 0–30 and y 100–128 registers are visible on phone.

**Desktop 1280×800.** Cover scale = max(1280/192, 800/128) = 6.667. Rendered
height 853 px → vertical crop. Visible source height = 800/6.667 = 120 units,
centered: **x 0–192, y 4–124 survives.** Top 4 and bottom 4 units discarded.

Requirements that follow:

1. **No identifying element may be a single instance.** A lone hero cone is a
   fail regardless of where it sits.
2. **Nothing identifying in y 0–4 or y 124–128.** Ember motes sit fully within
   y 4–28. Lava rivulets sit fully within y 104–122.
3. **Phone identity** is carried by (a) the four-band warm color structure, which
   survives every crop; (b) the 3 ember motes that fall inside x 66–126 in the
   y 4–28 register; (c) cone 3's low ridge and the lava rivulet at x 96, both in
   the y 100–128 register. The tall flank cones are a desktop-only payoff, by
   design, because tall cones cannot coexist with the safe zone.

Motif instance table:

| motif | count | x centers | y register | phone-visible instances |
|---|---|---|---|---|
| ember mote | 9 | 12, 34, 56, 78, 96, 116, 138, 160, 182 | 4–28 | 3 (x 78, 96, 116) |
| cone ridge | 5 | 20, 48, 96, 148, 176 | see §2 table | 1 (cone 3, as a low ridge) |
| lava rivulet | 5 | 18, 54, 96, 138, 174 | 104–122 | 1 full (x 96) + partials |

Ember motes must each be ≥ 5 units across (below that they read as noise at 96 px,
not as sparks). Lava rivulets at x 54 and x 138 must each be ≥ 30 units wide so a
recognizable part falls inside x 66–126.

**Quiet-variant rule.** Any motif instance overlapping `x 60–132, y 30–100` must
be quiet: fill `#F6C0A4` or `#FBD9C2`, no stroke, no glow, no interior detail.
In practice cone 3 is the only instance that would qualify and it is capped at
y 100, so **no motif geometry enters the safe zone at all.**

## 5. Contrast budget

| role | hex | HSL (approx) |
|---|---|---|
| ash sky (band A) | `#F7D6BE` | 26° 78% 86% |
| haze field / base fill (band B) | `#EFA98C` | 16° 74% 74% |
| ash plain (band C) | `#E09479` | 15° 62% 67% |
| foreground crust (band D) | `#D98F78` | 13° 56% 66% |
| cone / ember accent | `#E8886B` | 13° 72% 67% |
| quiet accent (safe-zone-legal) | `#F6C0A4` | 21° 79% 80% |
| quiet accent (safe-zone-legal) | `#FBD9C2` | 25° 83% 87% |

Intended contrast against the sprite tier:

- Volcano-adjacent sprites are trex `#C0553F` (L 50%), raptor `#F39A49` (L 62%),
  mammo `#B96C47` (L 50%).
- Base fill `#EFA98C` is L 74%: **24 points lighter than trex, 12 points lighter
  than raptor, 24 points lighter than mammo.** Requirement: every fill in this
  file is ≥ 12 HSL lightness points lighter than `#F39A49` and ≥ 15 points
  lighter than `#C0553F` and `#B96C47`. The darkest fills in the file are
  `#D98F78` (L 66%) and `#E8886B` (L 67%), which clear `#F39A49` by only 4–5
  points — therefore **`#D98F78` and `#E8886B` are permitted only in y ≥ 100 and
  y ≤ 28, never in the y 28–100 band where a sprite stands.**
- Raptor `#F39A49` is the sprite most at risk here. Requirement: in the band a
  raptor stands on (y 28–100), the only fills are `#EFA98C`, `#F6C0A4`, `#FBD9C2`
  — all ≥ 12 lightness points and ≥ 9 saturation points off `#F39A49`.
- **Requirement: no fill in this file equals `#C0553F`, `#F39A49`, `#B96C47`,
  `#F5C55A`, `#FFF4D5`, or `#503B32`.**
- **Requirement: no fill in this file may be darker than L 65%.** There is no
  dark mass anywhere in the file. Volcano reads as warm through hue and
  saturation, not through value. This is the fix for the round-1 dark cone.

Stroke budget:

- **Max stroke width 1.5 units.** Reason: this file is full-bleed. Desktop scale
  is 6.667 px per unit, so `stroke-width="4"` renders at ~27 px, and round 1's
  4-unit strokes on a 128-square source rendered as a ~40 px near-black brown
  line across the art. That is foreground sprite weight on a background plate.
- Strokes are permitted only in y 100–128, only in `#E8886B`, only on lava
  rivulet edges. Total stroked path length ≤ 300 units.
- No stroke may be `#503B32` in this file, and no stroke may appear above y 100.
- Round joins and caps. Every stroked path ≥ 1 unit inside the viewBox.

## 6. Color plan

- Band A ash sky — `#F7D6BE` flat, y 0–28 full width.
- Ember motes — `#E8886B` rounded blobs, 9 instances, each 5–9 units across, all
  within y 4–28.
- Band B haze field — `#EFA98C` flat, y 28–100 full width. Base fill and the
  dominant area of the frame (~56%).
- Flank cones 1, 2, 4, 5 — `#E09479` and `#E8886B`, soft-shouldered triangles,
  bases on y 116, peaks per the §2 table. All geometry above y 100 is confined to
  x < 60 or x > 132.
- Cone 3 (center) — `#F6C0A4`, a wide low ridge, base y 116, peak y 100.
- Band C ash plain — `#E09479` flat, y 100–116.
- Lava rivulets — `#E8886B` filled tapered strips, 5 instances, y 104–122, each
  ≥ 22 units long.
- Band D foreground crust — `#D98F78` flat, y 116–128.
- No gold `#F5C55A` (that is the sprite accent), no cream `#FFF4D5`, no `#503B32`.
- No smoke plume, no crater glow, no red-hot core — those are dark/saturated
  masses and this file has none.
- No gradients, no opacity < 1.0, no `<defs>`.

## 7. Forbidden

Round-1 failures this spec exists to prevent:

1. **`stroke-width="4"`.** All four round-1 biomes used it on a 128 viewBox.
   Full-bleed at 1280 px desktop that is a ~40 px near-black brown line. These
   were foreground-weight graphics, not backgrounds. Cap here is 1.5.
2. **Square 1:1 viewBox composed as a portrait band-stack.** Cropped cover to
   1280×800 the visible window was only y 24–104, and each biome's identity lived
   in a single element in the crop-away zone. This asset is `0 0 192 128`.
3. **Sprite-tier saturation and the identical 10-hex sprite palette.** A
   background painted at sprite value makes sprites invisible. This file uses the
   background tier in §5 and none of the reserved body fills.
4. **The dark upper-center cone.** Round 1's volcano was the best of the four and
   clearly distinct, but its dark cone sat upper-center — the darkest mass in the
   file against the highest-contrast pairing in the set — exactly where the title
   pill sits. Title text over it was unreadable. **Fixes, all mandatory: (a) no
   cone geometry above y 100 inside x 60–132; (b) five cones, not one, so no
   single cone carries identity; (c) no fill anywhere in the file darker than
   L 65%, so there is no "darkest mass" to land under the title at all.**

Also forbidden: a single hero volcano; smoke plume; crater glow; red-hot lava
core; lightning; any dark silhouette layer; text or numerals; `<image>`, raster,
data URIs, `<style>`, `class`, `<script>`, `<defs>`, external `href`;
`width`/`height` on the root `<svg>`; any green fill (hue 70°–160° is a FAIL —
that range belongs to jungle); any cool fill (hue 180°–280° is a FAIL — those
belong to beach and ice-cave).

## 8. Acceptance tests

1. Root element is `<svg viewBox="0 0 192 128">` with no `width` and no `height`.
   PASS/FAIL.
2. No `<image>`, `<text>`, `<style>`, `<script>`, `<defs>`, `class=`, `href=`,
   data URI, or gradient element. PASS/FAIL.
3. Maximum `stroke-width` anywhere in the file is ≤ 1.5. PASS/FAIL.
4. No stroked element has geometry above y 100 anywhere in the file. PASS/FAIL.
5. No stroked element has geometry intersecting `x 60–132, y 30–100`. PASS/FAIL.
6. No fill in the file has HSL lightness < 65%. PASS/FAIL.
7. No fill equals `#C0553F`, `#F39A49`, `#B96C47`, `#F5C55A`, `#FFF4D5`, or
   `#503B32`, or any other reserved dino body fill. PASS/FAIL.
8. Every fill has HSL hue in the range 10°–30°. No green (70°–160°), no cool
   (180°–280°). PASS/FAIL.
9. Inside `x 60–132, y 30–100` only the fills `#EFA98C`, `#F6C0A4`, `#FBD9C2`
   appear. PASS/FAIL.
10. No cone, ridge, peak, crater or triangular mass has any geometry inside
    `x 60–132` above y 100. Cone 3's peak is at y ≥ 100. PASS/FAIL.
11. No ember, spark or lava element has geometry inside `x 60–132, y 30–100`.
    PASS/FAIL.
12. No edge inside `x 60–132, y 30–100` exceeds 0.08 relative luminance
    difference between its two adjacent fills. PASS/FAIL.
13. Ember motes: exactly 9, x centers within ±4 of 12, 34, 56, 78, 96, 116, 138,
    160, 182, all bounded by y 4–28, each ≥ 5 units across. PASS/FAIL.
14. Cone ridges: exactly 5, x centers within ±6 of 20, 48, 96, 148, 176; peak y
    values match the §2 table within ±4. PASS/FAIL.
15. Lava rivulets: exactly 5, x centers within ±4 of 18, 54, 96, 138, 174, all
    bounded by y 104–122, each ≥ 22 units long; the x 54 and x 138 instances are
    ≥ 30 units wide. PASS/FAIL.
16. Fills `#D98F78` and `#E8886B` appear only in y ≤ 28 or y ≥ 100. PASS/FAIL.
17. Crop to `x 66–126, y 0–128` (phone). The result shows ≥ 3 ember motes, the
    cone-3 ridge, ≥ 1 lava rivulet, and the four-band warm structure. PASS/FAIL.
18. Crop to `x 0–192, y 4–124` (desktop). No ember mote and no lava rivulet is
    clipped; all five cones are visible. PASS/FAIL.
19. Thumbnail test at 96×64 px alongside `jungle.svg`, `beach.svg` and
    `ice-cave.svg`: a viewer names this one "volcano". Base fills: volcano
    `#EFA98C`, jungle `#CDE8BE`, beach `#F7E3B0`, ice-cave `#D9DCF2`. PASS/FAIL.
20. Render a white title pill with dark text over `x 60–132, y 30–52`. The text
    is legible at every horizontal offset within that band. PASS/FAIL.
21. Composite trex (`#C0553F`), raptor (`#F39A49`) and mammo (`#B96C47`) at 96 px
    over this background at three x positions. Each silhouette fully separable
    everywhere. PASS/FAIL.
22. Every path, including stroke half-width, lies inside `0 0 192 128`. PASS/FAIL.
23. Total stroked path length ≤ 300 units. PASS/FAIL.
