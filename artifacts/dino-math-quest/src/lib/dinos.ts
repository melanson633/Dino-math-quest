export interface Dino {
  id: string;
  name: string;
  emoji: string;
  /** Path under public/, authored to docs/asset-specs/dinos/<id>.md. */
  art: string;
  fact: string;
  unlockAt: number;
  practice: {
    syllables: string[];
    chant: string;
    countPrompt: string;
    wordPrompt: string;
    movePrompt: string;
    cheer: string;
  };
}

export const DINOS: Dino[] = [
  {
    id: "stego",
    name: "Stegosaurus",
    emoji: "🦕",
    art: "/dinos/stego.svg",
    fact: "It had plates on its back to stay cool!",
    unlockAt: 2,
    practice: {
      syllables: ["Steg", "o", "saur", "us"],
      chant: "Steg-o-saur-us, step with me.",
      countPrompt: "Count three back plates.",
      wordPrompt: "Find the word STEGO.",
      movePrompt: "Tap three sleepy plates awake.",
      cheer: "Steggy is smiling with you.",
    },
  },
  {
    id: "ankylo",
    name: "Ankylosaurus",
    emoji: "🐢",
    art: "/dinos/ankylo.svg",
    fact: "It had a heavy club on its tail!",
    unlockAt: 5,
    practice: {
      syllables: ["An", "ky", "lo"],
      chant: "An-ky-lo, slow and strong.",
      countPrompt: "Count five tail taps.",
      wordPrompt: "Say AN, then KY, then LO.",
      movePrompt: "Make five strong tail taps.",
      cheer: "Anky heard your strong beats.",
    },
  },
  {
    id: "raptor",
    name: "Velociraptor",
    emoji: "🦤",
    art: "/dinos/raptor.svg",
    fact: "It was small but very fast!",
    unlockAt: 15,
    practice: {
      syllables: ["Ve", "lo", "ci", "rap", "tor"],
      chant: "Ve-lo-ci-rap-tor, quick little steps.",
      countPrompt: "Count by twos to ten.",
      wordPrompt: "Tap the sound RAP.",
      movePrompt: "Take quick steps: two, four, six.",
      cheer: "Raptor raced beside you.",
    },
  },
  {
    id: "brachi",
    name: "Brachiosaurus",
    emoji: "🦕",
    art: "/dinos/brachi.svg",
    fact: "Its long neck reached the highest leaves!",
    unlockAt: 20,
    practice: {
      syllables: ["Bra", "chi", "o", "saur", "us"],
      chant: "Bra-chi-o-saur-us, reach up high.",
      countPrompt: "Count four tall leaves.",
      wordPrompt: "Say BRACHIO slowly.",
      movePrompt: "Reach for four leafy snacks.",
      cheer: "Brachio likes your tall voice.",
    },
  },
  {
    id: "spino",
    name: "Spinosaurus",
    emoji: "🐊",
    art: "/dinos/spino.svg",
    fact: "It had a huge sail and loved water!",
    unlockAt: 25,
    practice: {
      syllables: ["Spi", "no"],
      chant: "Spi-no, sail and splash.",
      countPrompt: "Count six water splashes.",
      wordPrompt: "Find the word SPIN.",
      movePrompt: "Splash six little waves.",
      cheer: "Spino made a happy splash.",
    },
  },
  {
    id: "plesi",
    name: "Plesiosaurus",
    emoji: "🦕",
    art: "/dinos/plesi.svg",
    fact: "It swam in the ancient oceans!",
    unlockAt: 30,
    practice: {
      syllables: ["Ple", "si", "o", "saur", "us"],
      chant: "Ple-si-o-saur-us, glide with me.",
      countPrompt: "Count seven ocean waves.",
      wordPrompt: "Practice the L in PLE.",
      movePrompt: "Glide through seven soft waves.",
      cheer: "Plesi loved that gentle L.",
    },
  },
  {
    id: "carno",
    name: "Carnotaurus",
    emoji: "🦖",
    art: "/dinos/carno.svg",
    fact: "It had two little horns over its eyes!",
    unlockAt: 35,
    practice: {
      syllables: ["Car", "no", "taur", "us"],
      chant: "Car-no-taur-us, stomp stomp smile.",
      countPrompt: "Count two little horns.",
      wordPrompt: "Say CAR, then NO.",
      movePrompt: "Stomp two careful horn steps.",
      cheer: "Carno did a proud little stomp.",
    },
  },
  {
    id: "iguano",
    name: "Iguanodon",
    emoji: "🦎",
    art: "/dinos/iguano.svg",
    fact: "It had a thumb spike to defend itself!",
    unlockAt: 40,
    practice: {
      syllables: ["I", "gua", "no", "don"],
      chant: "I-gua-no-don, thumbs up.",
      countPrompt: "Count eight tiny steps.",
      wordPrompt: "Build the word DON.",
      movePrompt: "Give eight tiny thumbs-up taps.",
      cheer: "Iggy gives you a thumbs up.",
    },
  },
  {
    id: "trex",
    name: "T-Rex",
    emoji: "🦖",
    art: "/dinos/trex.svg",
    fact: "The king of the dinosaurs with tiny arms!",
    unlockAt: 45,
    practice: {
      syllables: ["T", "Rex"],
      chant: "T-Rex, big brave roar.",
      countPrompt: "Count ten quiet roars.",
      wordPrompt: "Spell REX.",
      movePrompt: "Do ten quiet brave roars.",
      cheer: "Rex heard your brave voice.",
    },
  },
  {
    id: "mammo",
    name: "Woolly Mammoth",
    emoji: "🦣",
    art: "/dinos/mammo.svg",
    fact: "It had long hair for the ice age!",
    unlockAt: 50,
    practice: {
      syllables: ["Wool", "ly", "Mam", "moth"],
      chant: "Wool-ly Mam-moth, warm and slow.",
      countPrompt: "Count nine snow steps.",
      wordPrompt: "Practice the W in Woolly.",
      movePrompt: "Walk nine warm snow steps.",
      cheer: "Woolly warmed up with you.",
    },
  },
  {
    id: "pachy",
    name: "Pachycephalosaurus",
    emoji: "🐏",
    art: "/dinos/pachy.svg",
    fact: "It had a really thick skull!",
    unlockAt: 55,
    practice: {
      syllables: ["Pa", "chy", "ceph", "a", "lo", "saur", "us"],
      chant: "Pa-chy, tap and smile.",
      countPrompt: "Count three gentle taps.",
      wordPrompt: "Say PA, then CHY.",
      movePrompt: "Tap three gentle head beats.",
      cheer: "Pachy practiced gently.",
    },
  },
  {
    id: "ptero",
    name: "Pterodactyl",
    emoji: "🦅",
    art: "/dinos/ptero.svg",
    fact: "It was a flying reptile with wide wings!",
    unlockAt: 60,
    practice: {
      syllables: ["Pter", "o", "dac", "tyl"],
      chant: "Pter-o-dac-tyl, wings up high.",
      countPrompt: "Count twelve wing flaps.",
      wordPrompt: "Find the word WING.",
      movePrompt: "Flap twelve wide wing beats.",
      cheer: "Ptero flew with your words.",
    },
  },
];
