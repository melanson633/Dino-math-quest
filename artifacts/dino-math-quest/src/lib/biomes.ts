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
  /** The ambient companion dino shown in PuzzleScreen while in this biome. */
  companionDinoId: string;
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
    companionDinoId: "stego",
    threshold: 0,
  },
  {
    id: 1,
    name: "Beach",
    colors: { bgFrom: "#fde047", bgTo: "#fbbf24", text: "#713f12", primary: "#38bdf8" },
    art: "/biomes/beach.svg",
    bossDinoId: "plesi",
    companionDinoId: "plesi",
    threshold: 15,
  },
  {
    id: 2,
    name: "Volcano",
    colors: { bgFrom: "#f97316", bgTo: "#dc2626", text: "#450a0a", primary: "#fcd34d" },
    art: "/biomes/volcano.svg",
    bossDinoId: "trex",
    companionDinoId: "carno",
    threshold: 30,
  },
  {
    id: 3,
    name: "Ice Cave",
    colors: { bgFrom: "#93c5fd", bgTo: "#3b82f6", text: "#1e3a8a", primary: "#e879f9" },
    art: "/biomes/ice-cave.svg",
    bossDinoId: "mammo",
    companionDinoId: "mammo",
    threshold: 45,
  },
  {
    id: 4,
    name: "Amber Forest",
    colors: { bgFrom: "#d97706", bgTo: "#92400e", text: "#451a03", primary: "#fbbf24" },
    art: "/biomes/amber-forest.svg",
    bossDinoId: "tricera",
    companionDinoId: "raptor",
    threshold: 60,
  },
  {
    id: 5,
    name: "Deep Ocean",
    colors: { bgFrom: "#0369a1", bgTo: "#1e3a5f", text: "#e0f2fe", primary: "#38bdf8" },
    art: "/biomes/deep-ocean.svg",
    bossDinoId: "para",
    companionDinoId: "plesi",
    threshold: 80,
  },
  {
    id: 6,
    name: "Sky Kingdom",
    colors: { bgFrom: "#818cf8", bgTo: "#6d28d9", text: "#1e1b4b", primary: "#f0abfc" },
    art: "/biomes/sky-kingdom.svg",
    bossDinoId: "styra",
    companionDinoId: "ptero",
    threshold: 100,
  },
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
