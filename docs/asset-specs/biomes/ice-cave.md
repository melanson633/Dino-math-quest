---
id: ice-cave
name: Ice Cave
kind: biome
output: artifacts/dino-math-quest/public/biomes/ice-cave.svg
viewBox: "0 0 192 128"
mood: cool blue-violet, no green anywhere
base_fill: "#D9DCF2"
band_fills: ["#B9BEE6", "#D9DCF2", "#C6D6EE", "#B4C6E4"]
accent_fills: ["#E7E9F8", "#C9BEEA"]
forbidden_fills: ["#55B7D9", "#8AA2E0", "#C77BB5", "#A9D66E", "#78B94B", "#C3D96B", "#3F8F72", "#F5C55A", "#BFE7F2", "#A8DCE4"]
max_stroke_width: 1.5
sibling_biomes: [jungle, beach, volcano]
repeat_motifs:
  - { motif: stalactite tooth, instances: 7, register: "y 4-28" }
  - { motif: stalagmite tooth, instances: 5, register: "y 102-126" }
  - { motif: wall ice facet, instances: 4, register: "flanks only" }
---

## 1. Identity in one line

"It's the ice cave — cold purple-blue, with pointy icicles hanging down from the
top and pointy ice spikes coming up from the floor."

## 2. Composition zones

Four horizontal bands full width, plus two tooth registers. Banding is the
primary identity channel because it survives every crop, and the opposed
top/bottom tooth rows are what make it read as a *cave* rather than a sky.

| band | y range | fill | contents |
|---|---|---|---|
| A — cave ceiling | 0–28 | `#B9BEE6` | 7 stalactite teeth pointing down, tips y 18–28 |
| B — cave air | 28–100 | `#D9DCF2` (base fill) | wall facets in flanks only; center empty |
| C — ice floor | 100–116 | `#C6D6EE` | 5 stalagmite teeth pointing up, tips y 102–108 |
| D — foreground ice | 116–128 | `#B4C6E4` | flat, unbroken |

- The A/B boundary at y 28 is above the safe zone and is the highest-contrast
  edge in the file: `#B9BEE6` against `#D9DCF2`.
- The B/C boundary at y 100 sits exactly on the bottom edge of the safe zone and
  must be a straight horizontal line, unstroked.
- Wall ice facets: 4 flat-shaded angular panels in `#C9BEEA`, at x spans 0–26,
  26–52, 142–168, 168–192, running y 28–116. None may enter x 60–132.

## 3. UI safe zone — `x 60–132, y 30–100`

A title pill, the answer tiles and the letter tray render over this rectangle.

Allowed inside `x 60–132, y 30–100`:
- The base fill `#D9DCF2` covering essentially the whole region.
- At most two quiet haze blobs in `#E7E9F8`, within 0.08 relative luminance of
  `#D9DCF2`.
- Nothing else.

Not allowed inside `x 60–132, y 30–100`:
- **Any diamond, gem, crystal, star, or faceted geometric shape.** Round 1 put a
  saturated gold diamond dead center, exactly where a number tile goes. There are
  no gems in this asset at all, anywhere in the frame.
- Any stalactite, stalagmite, spike, or point. Both tooth rows are confined to
  y ≤ 28 and y ≥ 100.
- Any stroke of any width or color. Zero stroked geometry crosses this rectangle.
- Any wall facet, seam, crack, or angular panel.
- Any fill with HSL saturation > 35% or lightness < 78%.
- Any edge where the two adjacent fills differ by more than 0.08 relative
  luminance.
- Any shape with a bounding box smaller than 20×20 units.

The strips y 0–30 and y 100–128 are outside the safe zone and may carry full
contrast at any x, including x 60–132. Both tooth rows live there, which is what
makes the cave readable on a phone crop without touching the UI region.

## 4. Crop safety

`background-size: cover`. Two reference crops:

**Phone 375×812.** Cover scale = max(375/192, 812/128) = 6.344. Rendered width
1218 px → horizontal crop. Visible source width = 375/6.344 = 59.1 units,
centered: **x 66.4–125.6, y 0–128 survives.** The surviving x column coincides
almost exactly with the safe zone in x, but all 128 units of height survive.

**Desktop 1280×800.** Cover scale = max(1280/192, 800/128) = 6.667. Rendered
height 853 px → vertical crop. Visible source height = 800/6.667 = 120 units,
centered: **x 0–192, y 4–124 survives.** Top 4 and bottom 4 units discarded.

Requirements that follow:

1. **No identifying element may be a single instance.** Round 1's stalactites
   were one cluster and the crop destroyed them. Every motif below repeats at the
   stated count across the full 192-unit width.
2. **Nothing identifying may live in y 0–4 or y 124–128.** Stalactite *roots*
   start at y 0 but their identifying tips are at y 18–28, well inside the
   surviving window. Stalagmite tips are at y 102–108 and their bases sit on
   y 122, not y 128 — so the desktop crop losing y 124–128 removes nothing.
3. **Phone identity** is carried by (a) the four-band cool color structure, which
   survives every crop; (b) the 3 stalactite teeth inside x 66–126; (c) the
   stalagmite tooth at x 96 plus partials at x 56 and x 136. The wall facets are
   a desktop-only motif by design, because vertical panels cannot cross the safe
   zone.

Motif instance table:

| motif | count | x centers | y register | phone-visible instances |
|---|---|---|---|---|
| stalactite tooth | 7 | 14, 42, 70, 96, 122, 150, 178 | 0–28 | 3 (x 70, 96, 122) |
| stalagmite tooth | 5 | 20, 56, 96, 136, 172 | 102–126 | 1 full (x 96) + partials |
| wall ice facet | 4 | 13, 39, 155, 180 | 28–116 | 0 (desktop-only, by design) |

Stalactite teeth must each be ≥ 14 units wide at the root and ≥ 18 units tall.
Stalagmite teeth at x 56 and x 136 must each be ≥ 28 units wide at the base so a
recognizable part falls inside x 66–126.

**Quiet-variant rule.** Any motif instance overlapping `x 60–132, y 30–100` must
be rendered quiet: `#E7E9F8` fill, no stroke, no facet lines. In this biome the
wall facets are the only candidates and they are banned from x 60–132 outright,
so **no motif geometry enters the safe zone at all.**

## 5. Contrast budget

| role | hex | HSL (approx) |
|---|---|---|
| cave ceiling (band A) | `#B9BEE6` | 234° 48% 81% |
| cave air / base fill (band B) | `#D9DCF2` | 233° 49% 90% |
| ice floor (band C) | `#C6D6EE` | 214° 51% 85% |
| foreground ice (band D) | `#B4C6E4` | 214° 46% 80% |
| ice highlight | `#E7E9F8` | 233° 55% 94% |
| wall facet | `#C9BEEA` | 258° 46% 83% |

Intended contrast against the sprite tier:

- Ice-cave-adjacent sprites are mammo `#B96C47` (L 50%, the boss), pachy
  `#8AA2E0` (L 71%), plesi `#55B7D9` (L 59%), ptero `#C77BB5` (L 63%).
- Base fill `#D9DCF2` is L 90%: **40 points lighter than mammo, 19 points lighter
  than pachy, 31 lighter than plesi, 27 lighter than ptero.** Requirement: every
  fill in this file is ≥ 9 HSL lightness points lighter than `#8AA2E0`, the
  closest sprite. The darkest fill in the file is `#B4C6E4` at L 80%, which
  clears `#8AA2E0` by 9 points — and `#B4C6E4` is confined to y ≥ 116.
- Pachy `#8AA2E0` is the sprite most at risk. Requirement: in the band a pachy
  stands on (y 28–100), the only fills are `#D9DCF2` and `#E7E9F8`, both ≥ 19
  lightness points off `#8AA2E0`.
- **Requirement: no fill in this file equals `#8AA2E0`, `#55B7D9`, `#C77BB5`,
  `#B96C47`, `#F5C55A`, `#FFF4D5`, or `#503B32`.**
- **Requirement: no green. Any fill with HSL hue between 70° and 190° is a FAIL.
  Any fill whose green channel exceeds both its red and blue channels is a FAIL.**
  Round 1 was a hard fail here: a full-width jungle-green `#A9D66E` band across
  the lower middle of an ice cave.
- **Requirement: no fill may equal beach's sky or water.** Round 1's beach sky was
  identical to ice-cave's base, making the two thumbnail-confusable. Ice Cave
  fills must have hue ≥ 210°; `#BFE7F2` (192°) and `#A8DCE4` (189°) are banned.
- **Requirement: no saturated accent of any kind.** Maximum HSL saturation in the
  file is 55%, and no fill may have hue in the warm range 20°–70° at any
  saturation above 20%. This kills the gold diamond at the palette level.

Stroke budget:

- **Max stroke width 1.5 units.** Reason: this file is full-bleed. Desktop scale
  is 6.667 px per unit, so `stroke-width="4"` renders at ~27 px, and round 1's
  4-unit strokes on a 128-square source rendered as a ~40 px near-black brown
  line across the art. Foreground sprite weight on a background plate.
- Strokes are permitted only in y 0–28 and y 100–128, only in `#B4C6E4`, only on
  tooth outlines. Total stroked path length ≤ 400 units.
- No stroke may be `#503B32` in this file — a warm dark brown line in an ice cave
  is both a value failure and a hue failure.
- Round joins and caps. Every stroked path ≥ 1 unit inside the viewBox.

## 6. Color plan

- Band A ceiling — `#B9BEE6` flat, y 0–28 full width.
- Stalactite teeth — `#D9DCF2` fill with a `#E7E9F8` highlight edge, 7 instances
  hanging from y 0, tips at y 18–28.
- Band B cave air — `#D9DCF2` flat, y 28–100 full width. Base fill and the
  dominant area of the frame (~56%).
- Wall ice facets — `#C9BEEA`, 4 angular panels, flanks only.
- Band C ice floor — `#C6D6EE` flat, y 100–116.
- Stalagmite teeth — `#E7E9F8` with `#C6D6EE` shadow side, 5 instances rising
  from y 122 to tips at y 102–108.
- Band D foreground ice — `#B4C6E4` flat, y 116–128.
- No gold `#F5C55A`, no cream `#FFF4D5`, no `#503B32`, no green of any value, no
  warm hue above 20% saturation.
- No gradients, no opacity < 1.0, no `<defs>`.

## 7. Forbidden

Round-1 failures this spec exists to prevent:

1. **`stroke-width="4"`.** All four round-1 biomes used it on a 128 viewBox.
   Full-bleed at 1280 px desktop that is a ~40 px near-black brown line. These
   were foreground-weight graphics, not backgrounds. Cap here is 1.5.
2. **Square 1:1 viewBox composed as a portrait band-stack.** Cropped cover to
   1280×800 the visible window was only y 24–104, and ice-cave's stalactites —
   its entire identity — lived in the crop-away zone. This asset is
   `0 0 192 128`, the stalactite tips are at y 18–28, and there are 7 of them.
3. **Sprite-tier saturation and the identical 10-hex sprite palette.** A
   background painted at sprite value makes sprites invisible. This file uses the
   background tier in §5 and none of the reserved body fills.
4. **The green band. This was a hard fail.** Round 1's ice cave contained a
   full-width jungle-green `#A9D66E` band across the lower middle of an ice cave.
   **Ice Cave must contain NO GREEN. Any fill with HSL hue between 70° and 190°,
   or whose green channel exceeds both its red and blue channels, is a FAIL — no
   exceptions, no moss, no algae, no aurora, no glow.**
5. **The gold diamond.** Round 1 put a saturated gold diamond dead center, exactly
   where a number tile goes. **There are no gems, crystals, diamonds, stars or
   faceted geometric ornaments anywhere in this asset, and no fill in the warm
   hue range 20°–70° above 20% saturation.**

Also forbidden: a single hero icicle cluster; a cave mouth or arch (a single
instance by nature); aurora or glow effects; snowflakes smaller than 20 units;
bats, eyes, or creatures; text or numerals; `<image>`, raster, data URIs,
`<style>`, `class`, `<script>`, `<defs>`, external `href`; `width`/`height` on
the root `<svg>`; any fill shared with `beach.svg`.

## 8. Acceptance tests

1. Root element is `<svg viewBox="0 0 192 128">` with no `width` and no `height`.
   PASS/FAIL.
2. No `<image>`, `<text>`, `<style>`, `<script>`, `<defs>`, `class=`, `href=`,
   data URI, or gradient element. PASS/FAIL.
3. Maximum `stroke-width` anywhere in the file is ≤ 1.5. PASS/FAIL.
4. No stroked element has geometry intersecting `x 60–132, y 30–100`. PASS/FAIL.
5. No stroked element has geometry in y 28–100 anywhere in the file. PASS/FAIL.
6. **Green check.** Parse every fill and stroke value. No value has HSL hue in
   70°–190°, and for no value does the green channel exceed both the red and the
   blue channel. Any hit is a FAIL for the file. PASS/FAIL.
7. **Gold check.** No fill or stroke has HSL hue in 20°–70° with saturation
   > 20%. No fill equals `#F5C55A`. PASS/FAIL.
8. No diamond, gem, crystal, star, or faceted ornament shape exists anywhere in
   the file. PASS/FAIL.
9. No fill equals `#8AA2E0`, `#55B7D9`, `#C77BB5`, `#B96C47`, `#FFF4D5`,
   `#503B32`, or any other reserved dino body fill. PASS/FAIL.
10. Every fill has HSL hue ≥ 210°, saturation ≤ 55%, and lightness ≥ 80%.
    PASS/FAIL.
11. No fill equals `#BFE7F2` or `#A8DCE4` (beach's sky and water). PASS/FAIL.
12. Inside `x 60–132, y 30–100` only the fills `#D9DCF2` and `#E7E9F8` appear.
    PASS/FAIL.
13. No edge inside `x 60–132, y 30–100` exceeds 0.08 relative luminance
    difference between its two adjacent fills. PASS/FAIL.
14. Stalactite teeth: exactly 7, x centers within ±4 of 14, 42, 70, 96, 122, 150,
    178; every tip between y 18 and y 28; every root ≥ 14 units wide; every tooth
    ≥ 18 units tall. PASS/FAIL.
15. Stalagmite teeth: exactly 5, x centers within ±4 of 20, 56, 96, 136, 172;
    every tip between y 102 and y 108; bases on y 122; the x 56 and x 136
    instances ≥ 28 units wide at the base. PASS/FAIL.
16. Wall ice facets: exactly 4, all with bounding boxes entirely in x < 60 or
    x > 132. PASS/FAIL.
17. Crop to `x 66–126, y 0–128` (phone). The result shows ≥ 3 stalactites, ≥ 1
    stalagmite, and the four-band cool structure; it still reads as a cave.
    PASS/FAIL.
18. Crop to `x 0–192, y 4–124` (desktop). No stalactite tip and no stalagmite tip
    is lost. PASS/FAIL.
19. Thumbnail test at 96×64 px alongside `jungle.svg`, `beach.svg` and
    `volcano.svg`: a viewer names this one "ice cave", and specifically does not
    confuse it with beach. Base fills: ice-cave `#D9DCF2`, beach `#F7E3B0`,
    jungle `#CDE8BE`, volcano `#EFA98C`. PASS/FAIL.
20. Composite mammo (`#B96C47`), pachy (`#8AA2E0`), plesi (`#55B7D9`) and ptero
    (`#C77BB5`) at 96 px over this background at three x positions. Each
    silhouette fully separable everywhere. PASS/FAIL.
21. Every path, including stroke half-width, lies inside `0 0 192 128`. PASS/FAIL.
22. Total stroked path length ≤ 400 units. PASS/FAIL.
