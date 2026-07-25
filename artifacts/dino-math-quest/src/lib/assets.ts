/**
 * Resolves a path under `public/` against the Vite base URL, so assets keep
 * working when the app is served from a subdirectory.
 *
 * Art paths live on the data records themselves — `Dino.art` in `lib/dinos.ts`
 * and `Biome.art` in `lib/biomes.ts` — and are authored to the contracts in
 * `docs/asset-specs/`. Pass those fields through here rather than hardcoding
 * URLs at the render site.
 */
export function publicAssetUrl(src: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
}
