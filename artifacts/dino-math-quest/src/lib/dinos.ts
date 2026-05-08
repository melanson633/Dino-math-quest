export interface Dino {
  id: string;
  name: string;
  emoji: string;
  fact: string;
  unlockAt: number;
}

export const DINOS: Dino[] = [
  { id: "stego", name: "Stegosaurus", emoji: "🦕", fact: "It had plates on its back to stay cool!", unlockAt: 5 },
  { id: "ankylo", name: "Ankylosaurus", emoji: "🐢", fact: "It had a heavy club on its tail!", unlockAt: 10 },
  { id: "raptor", name: "Velociraptor", emoji: "🦤", fact: "It was small but very fast!", unlockAt: 15 },
  { id: "brachi", name: "Brachiosaurus", emoji: "🦕", fact: "Its long neck reached the highest leaves!", unlockAt: 20 },
  { id: "spino", name: "Spinosaurus", emoji: "🐊", fact: "It had a huge sail and loved water!", unlockAt: 25 },
  { id: "plesi", name: "Plesiosaurus", emoji: "🦕", fact: "It swam in the ancient oceans!", unlockAt: 30 },
  { id: "carno", name: "Carnotaurus", emoji: "🦖", fact: "It had two little horns over its eyes!", unlockAt: 35 },
  { id: "iguano", name: "Iguanodon", emoji: "🦎", fact: "It had a thumb spike to defend itself!", unlockAt: 40 },
  { id: "trex", name: "T-Rex", emoji: "🦖", fact: "The king of the dinosaurs with tiny arms!", unlockAt: 45 },
  { id: "mammo", name: "Woolly Mammoth", emoji: "🦣", fact: "It had long hair for the ice age!", unlockAt: 50 },
  { id: "pachy", name: "Pachycephalosaurus", emoji: "🐏", fact: "It had a really thick skull!", unlockAt: 55 },
  { id: "ptero", name: "Pterodactyl", emoji: "🦅", fact: "It wasn't a dinosaur, it was a flying reptile!", unlockAt: 60 }
];
