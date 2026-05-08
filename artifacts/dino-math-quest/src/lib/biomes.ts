export interface Biome {
  id: number;
  name: string;
  colors: {
    bgFrom: string;
    bgTo: string;
    text: string;
    primary: string;
  };
  bossDinoId: string;
  threshold: number;
}

export const BIOMES: Biome[] = [
  {
    id: 0,
    name: "Jungle",
    colors: { bgFrom: "#4ade80", bgTo: "#16a34a", text: "#14532d", primary: "#facc15" },
    bossDinoId: "para",
    threshold: 0,
  },
  {
    id: 1,
    name: "Beach",
    colors: { bgFrom: "#fde047", bgTo: "#fbbf24", text: "#713f12", primary: "#38bdf8" },
    bossDinoId: "plesi",
    threshold: 15,
  },
  {
    id: 2,
    name: "Volcano",
    colors: { bgFrom: "#f97316", bgTo: "#dc2626", text: "#450a0a", primary: "#fcd34d" },
    bossDinoId: "trex",
    threshold: 30,
  },
  {
    id: 3,
    name: "Ice Cave",
    colors: { bgFrom: "#93c5fd", bgTo: "#3b82f6", text: "#1e3a8a", primary: "#e879f9" },
    bossDinoId: "mammo",
    threshold: 45,
  }
];
