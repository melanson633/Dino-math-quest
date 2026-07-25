export interface Biome {
  id: number;
  name: string;
  colors: {
    bgFrom: string;
    bgTo: string;
    text: string;
    primary: string;
  };
  /**
   * Path under public/, authored to docs/asset-specs/biomes/<slug>.md.
   * Layered over the `colors` gradient, which stays as the fallback.
   */
  art: string;
  bossDinoId: string;
  threshold: number;
}

export const BIOMES: Biome[] = [
  {
    id: 0,
    name: "Jungle",
    colors: { bgFrom: "#4ade80", bgTo: "#16a34a", text: "#14532d", primary: "#facc15" },
    art: "/biomes/jungle.svg",
    // Was "para" (Parasaurolophus), which has no entry in DINOS — the lookup in
    // BiomeUnlockScreen returned undefined and its guard silently rendered no
    // boss dino for the very first unlock. Stegosaurus is the first dino the
    // player unlocks (unlockAt: 2), so it is the right greeter for biome 0.
    bossDinoId: "stego",
    threshold: 0,
  },
  {
    id: 1,
    name: "Beach",
    colors: { bgFrom: "#fde047", bgTo: "#fbbf24", text: "#713f12", primary: "#38bdf8" },
    art: "/biomes/beach.svg",
    bossDinoId: "plesi",
    threshold: 15,
  },
  {
    id: 2,
    name: "Volcano",
    colors: { bgFrom: "#f97316", bgTo: "#dc2626", text: "#450a0a", primary: "#fcd34d" },
    art: "/biomes/volcano.svg",
    bossDinoId: "trex",
    threshold: 30,
  },
  {
    id: 3,
    name: "Ice Cave",
    colors: { bgFrom: "#93c5fd", bgTo: "#3b82f6", text: "#1e3a8a", primary: "#e879f9" },
    art: "/biomes/ice-cave.svg",
    bossDinoId: "mammo",
    threshold: 45,
  }
];

/**
 * Background style for a biome: the authored SVG over the gradient, so a
 * missing or mid-regeneration art file degrades to the original look.
 */
export function biomeBackground(biome: Biome, assetUrl: (src: string) => string) {
  return {
    backgroundImage: `url(${assetUrl(biome.art)}), linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})`,
    backgroundSize: 'cover, auto',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
  };
}
