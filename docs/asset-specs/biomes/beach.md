---
id: beach
name: Beach
kind: biome
output: artifacts/dino-math-quest/public/biomes/beach.svg
viewBox: "0 0 192 128"
mood: pale sand, open water, bright
base_fill: "#F7E3B0"
band_fills: ["#BFE7F2", "#A8DCE4", "#EFF7F8", "#F0DEB6", "#F7E3B0"]
accent_fills: ["#FBEFCE", "#8FCFDB"]
forbidden_fills: ["#55B7D9", "#E8C15A", "#F5C55A", "#78B94B", "#C3D96B", "#A9D66E", "#3F8F72", "#D9DCF2", "#B9BEE6"]
max_stroke_width: 1.5
sibling_biomes: [jungle, volcano, ice-cave]
repeat_motifs:
  - { motif: cloud puff, instances: 5, register: "y 4-26" }
  - { motif: foam scallop, instances: 9, register: "y 68-78" }
  - { motif: shell / pebble cluster, instances: 5, register: "y 104-126" }
---

## 1. Identity in one line

"It's the beach — blue water at the top, yellow sand at the bottom, with white
foamy bits where they meet."

## 2. Composition zones

Five horizontal bands running the full 192-unit width. The banding is the primary
identity channel because it is the only structure that survives every crop.

| band | y range | fill | contents |
|---|---|---|---|
| A — sky | 0–28 | `#BFE7F2` | 5 cloud puffs in `#EFF7F8` |
| B — open water | 28–70 | `#A8DCE4` | 3 flat ripple dashes, flanks only |
| C — foam line | 68–78 | `#EFF7F8` | 9 scallops, the waterline motif |
| D — wet sand | 78–100 | `#F0DEB6` | empty |
| E — dry sand | 100–128 | `#F7E3B0` (base fill) | 5 shell/pebble clusters |

- The A/B boundary at y 28 is above the safe zone: highest-contrast edge in the
  file, `#BFE7F2` against `#A8DCE4`.
- The C foam line and the D/E boundary at y 100 are the two structures that touch
  or cross the safe zone. Both are governed by §3 and §5.
- **There is no green band.** Round 1 put a full-width green band between sky and
  sand that read as a grass field. Beach has sky, water, foam, wet sand, dry sand
  — five bands, no sixth.

## 3. UI safe zone — `x 60–132, y 30–100`

A title pill, the answer tiles and the letter tray render over this rectangle.

Allowed inside `x 60–132, y 30–100`:
- Bands B, C and D as flat fills.
- The foam line crossing horizontally at y 68–78, in quiet variant only: fill
  `#EFF7F8`, no stroke, scallop amplitude ≤ 5 units inside this x range (it may
  be up to 9 units outside it).
- The B/C and C/D horizontal edges, which are the beach's waterline and therefore
  the one identity structure permitted to cross. They are hue edges, not
  luminance edges: `#A8DCE4` (L 78%), `#EFF7F8` (L 95%), `#F0DEB6` (L 83%).
- At most two quiet haze blobs in `#FBEFCE` or `#CDEBF2`.

Not allowed inside `x 60–132, y 30–100`:
- Any stroke of any width or color. Zero stroked geometry crosses this rectangle.
- **Dark outline arcs on the sand.** Round 1's "waves" were dark brown outline
  arcs sitting on top of the sand and read as cracks or tire tracks. Foam is a
  **filled pale shape**, never an outlined one, and it sits on the boundary
  between water and sand, not on top of the sand.
- Any fill with HSL saturation > 35%.
- Any edge whose two adjacent fills differ by more than 0.18 relative luminance.
  (The `#EFF7F8`/`#F0DEB6` foam-to-sand edge is 0.12 and passes; anything higher
  is a fail.)
- Palm trees, umbrellas, boats, sun, starfish, crabs, footprints, or any single
  hero object. Round 1's sun was a single instance in the crop-away zone.
- Any shape with a bounding box smaller than 20×20 units, except foam scallops,
  which are exempt because they are a contiguous repeated row, not discrete
  objects.

The strips y 0–30 and y 100–128 are outside the safe zone and may carry full
contrast at any x, including x 60–132.

## 4. Crop safety

`background-size: cover`. Two reference crops:

**Phone 375×812.** Cover scale = max(375/192, 812/128) = 6.344. Rendered width
1218 px → horizontal crop. Visible source width = 375/6.344 = 59.1 units,
centered: **x 66.4–125.6, y 0–128 survives.** Full height survives, so the
y 0–30 and y 100–128 registers are visible on phone even though the x column
coincides with the safe zone.

**Desktop 1280×800.** Cover scale = max(1280/192, 800/128) = 6.667. Rendered
height 853 px → vertical crop. Visible source height = 800/6.667 = 120 units,
centered: **x 0–192, y 4–124 survives.** Top 4 and bottom 4 units discarded.

Requirements that follow:

1. **No identifying element may be a single instance.** Round 1's sun was one
   shape and the crop ate it. Every motif below repeats at the stated count
   across the full 192-unit width.
2. **Nothing identifying in y 0–4 or y 124–128.** Cloud puffs must sit fully
   within y 4–26. Shell clusters must sit fully within y 104–122.
3. **Phone identity** is carried by (a) the five-band color structure, (b) the
   foam line, which is a full-width horizontal motif and therefore present in
   every possible x window, and (c) the cloud and shell instances that fall
   inside x 66–126 in the y 0–30 and y 100–128 registers.

Motif instance table:

| motif | count | x centers | y register | phone-visible instances |
|---|---|---|---|---|
| cloud puff | 5 | 18, 54, 96, 138, 174 | 4–26 | 1 full (x 96) + partials at 54/138 |
| foam scallop | 9 | 10, 32, 54, 76, 98, 120, 142, 164, 186 | 68–78 | 3 (x 76, 98, 120) |
| shell / pebble cluster | 5 | 16, 52, 96, 140, 176 | 104–122 | 1 full (x 96) + partials at 52/140 |

Cloud puffs at x 54 and x 138 must each be ≥ 34 units wide so a recognizable part
falls inside x 66–126. Same for shell clusters at x 52 and x 140.

**Quiet-variant rule.** Any motif instance overlapping `x 60–132, y 30–100` must
be quiet: pale fill, no stroke, no interior detail, reduced amplitude. This
applies to foam scallops at x 76, 98 and 120 — amplitude ≤ 5 units there.

## 5. Contrast budget

| role | hex | HSL (approx) |
|---|---|---|
| sky (band A) | `#BFE7F2` | 192° 62% 85% |
| cloud puff | `#EFF7F8` | 189° 45% 95% |
| open water (band B) | `#A8DCE4` | 189° 51% 78% |
| ripple dash (flanks only) | `#8FCFDB` | 189° 50% 71% |
| foam (band C) | `#EFF7F8` | 189° 45% 95% |
| wet sand (band D) | `#F0DEB6` | 43° 63% 83% |
| dry sand / base fill (band E) | `#F7E3B0` | 42° 79% 83% |
| quiet accent | `#FBEFCE` | 42° 80% 89% |

Intended contrast against the sprite tier:

- Beach-adjacent sprites are plesi `#55B7D9` (L 59%), iguano `#E8C15A` (L 63%),
  raptor `#F39A49` (L 62%).
- The water band `#A8DCE4` is L 78% vs plesi's L 59% — **19 lightness points of
  separation**, and 25 points less saturated. Requirement: ≥ 15 points.
- The sand bands `#F0DEB6` / `#F7E3B0` are L 83% vs iguano's L 63% — **20 points**.
  Requirement: ≥ 15 points.
- **Requirement: no fill in this file equals `#55B7D9`, `#E8C15A`, `#F5C55A`, or
  any reserved dino body fill.**
- **Requirement: no green fill anywhere.** Any fill with HSL hue between 70° and
  160° is a FAIL. This kills round 1's grass band at the source.
- **Requirement: the sky fill must not equal ice-cave's base fill.** Round 1's
  beach sky was identical to ice-cave's base, making the two thumbnail-confusable.
  Beach sky is `#BFE7F2` (hue 192°, cyan). Ice Cave base is `#D9DCF2` (hue 233°,
  periwinkle). 41° of hue separation. Any beach fill with hue > 210° is a FAIL.

Stroke budget:

- **Max stroke width 1.5 units.** Reason: this file is full-bleed. Desktop scale
  is 6.667 px per unit, so `stroke-width="4"` renders at ~27 px, and round 1's
  4-unit strokes on a 128-square source rendered as a ~40 px near-black brown
  line across the art. That is sprite weight on a background plate.
- Strokes are permitted only in y 0–28 and y 100–128, only in `#8FCFDB` or
  `#E3CE9E`, and only on cloud and shell outlines. Total stroked path length
  ≤ 400 units.
- **No stroke on the sand, ever.** Round 1's dark brown outline arcs on the sand
  read as cracks or tire tracks. Sand is flat fill.
- No stroke may be `#503B32` in this file.
- Round joins and caps. Every stroked path ≥ 1 unit inside the viewBox.

## 6. Color plan

- Band A sky — `#BFE7F2` flat, y 0–28 full width.
- Cloud puffs — `#EFF7F8`, 5 instances, each ≥ 26 units wide and ≥ 10 tall.
- Band B open water — `#A8DCE4` flat, y 28–70 full width.
- Ripple dashes — `#8FCFDB`, 3 instances, x centers 14, 34, 172, each 18–24 units
  long and ≤ 3 units tall. Flanks only; none in x 60–132.
- Band C foam — `#EFF7F8` filled scallop row, y 68–78.
- Band D wet sand — `#F0DEB6` flat, y 78–100.
- Band E dry sand — `#F7E3B0` flat, y 100–128. Base fill.
- Shell/pebble clusters — `#FBEFCE` and `#E3CE9E`, 5 clusters of 3 rounded shapes
  each, every shape ≥ 6 units across, all within y 104–122.
- No gold `#F5C55A`, no cream `#FFF4D5`, no `#503B32`.
- No gradients, no opacity < 1.0, no `<defs>`.

## 7. Forbidden

Round-1 failures this spec exists to prevent:

1. **`stroke-width="4"`.** All four round-1 biomes used it on a 128 viewBox.
   Full-bleed at 1280 px desktop that is a ~40 px near-black brown line. Cap here
   is 1.5.
2. **Square 1:1 viewBox composed as a portrait band-stack.** Cropped cover to
   1280×800 the visible window was only y 24–104, and beach's sun — a single
   instance — lived in the crop-away zone. This asset is `0 0 192 128` and has no
   sun at all; identity is banding plus three repeated motifs.
3. **Sprite-tier saturation and the identical 10-hex sprite palette.** Backgrounds
   painted at sprite value make sprites invisible. This file uses the background
   tier in §5.
4. **The green band.** Round 1 had a full-width green band between sky and sand
   that read as a grass field. **No fill in this file may have HSL hue between
   70° and 160°.**
5. **The brown outline arcs.** Round 1's "waves" were dark brown outline arcs
   sitting on top of the sand, reading as cracks or tire tracks. **Foam is a
   filled pale shape on the water/sand boundary. There are no arcs on the sand
   and no stroked geometry below y 100 other than shell outlines in `#E3CE9E`.**
6. **The shared sky.** Round 1's beach sky fill was identical to ice-cave's base,
   making the two thumbnail-confusable. **No fill in this file may have hue
   > 210°, and no fill may equal `#D9DCF2`, `#B9BEE6`, or `#C6D6EE`.**

Also forbidden: palm trees, umbrellas, boats, sun, starfish, crabs, footprints,
any single hero object; text or numerals; `<image>`, raster, data URIs, `<style>`,
`class`, `<script>`, `<defs>`, external `href`; `width`/`height` on the root
`<svg>`.

## 8. Acceptance tests

1. Root element is `<svg viewBox="0 0 192 128">` with no `width` and no `height`.
   PASS/FAIL.
2. No `<image>`, `<text>`, `<style>`, `<script>`, `<defs>`, `class=`, `href=`,
   data URI, or gradient element. PASS/FAIL.
3. Maximum `stroke-width` anywhere in the file is ≤ 1.5. PASS/FAIL.
4. No stroked element has geometry intersecting `x 60–132, y 30–100`. PASS/FAIL.
5. No stroked element has geometry anywhere below y 100 except shell outlines in
   `#E3CE9E`. PASS/FAIL.
6. No fill in the file has HSL hue in the range 70°–160°. There is no green.
   PASS/FAIL.
7. No fill in the file has HSL hue > 210°, and no fill equals `#D9DCF2`,
   `#B9BEE6`, or `#C6D6EE`. PASS/FAIL.
8. No fill equals `#55B7D9`, `#E8C15A`, `#F5C55A`, `#FFF4D5`, `#503B32`, or any
   reserved dino body fill. PASS/FAIL.
9. Every fill has HSL lightness ≥ 71%. PASS/FAIL.
10. Inside `x 60–132, y 30–100` only the fills `#A8DCE4`, `#EFF7F8`, `#F0DEB6`,
    `#FBEFCE`, `#CDEBF2` appear. PASS/FAIL.
11. No edge inside `x 60–132, y 30–100` exceeds 0.18 relative luminance
    difference between its two adjacent fills. PASS/FAIL.
12. Cloud puffs: exactly 5, x centers within ±4 of 18, 54, 96, 138, 174, all
    bounded by y 4–26, each ≥ 26 units wide; the x 54 and x 138 puffs are ≥ 34
    units wide. PASS/FAIL.
13. Foam scallops: exactly 9, x centers within ±3 of 10, 32, 54, 76, 98, 120,
    142, 164, 186; amplitude ≤ 5 units for the instances at x 76, 98, 120;
    all filled, none stroked. PASS/FAIL.
14. Shell/pebble clusters: exactly 5, x centers within ±4 of 16, 52, 96, 140,
    176, all bounded by y 104–122. PASS/FAIL.
15. Crop to `x 66–126, y 0–128` (phone). The result shows ≥ 1 cloud, ≥ 3 foam
    scallops, ≥ 1 shell cluster, and the full five-band structure. PASS/FAIL.
16. Crop to `x 0–192, y 4–124` (desktop). No cloud puff and no shell cluster is
    clipped. PASS/FAIL.
17. Thumbnail test at 96×64 px alongside `jungle.svg`, `volcano.svg` and
    `ice-cave.svg`: a viewer names this one "beach", and specifically does not
    confuse it with ice-cave. Base fills: beach `#F7E3B0`, jungle `#CDE8BE`,
    volcano `#EFA98C`, ice-cave `#D9DCF2`. PASS/FAIL.
18. Composite plesi (`#55B7D9`), iguano (`#E8C15A`) and raptor (`#F39A49`) at
    96 px over this background at three x positions. Each silhouette fully
    separable everywhere. PASS/FAIL.
19. Every path, including stroke half-width, lies inside `0 0 192 128`. PASS/FAIL.
20. Total stroked path length ≤ 400 units. PASS/FAIL.
