export type PuzzleType = 'addition' | 'subtraction' | 'shapes';

export interface PuzzleOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface Puzzle {
  type: PuzzleType;
  prompt: string;
  display: string;
  options: PuzzleOption[];
  operands?: [number, number];
}

export function generatePuzzle(): Puzzle {
  const rand = Math.random();
  if (rand < 0.4) return generateAddition();
  if (rand < 0.8) return generateSubtraction();
  return generateShapes();
}

function uniqueDistractors(correct: number, count: number): number[] {
  const used = new Set([correct]);
  const result: number[] = [];
  const offsets = [1, 2, -1, -2, 3, -3];
  for (const off of offsets) {
    if (result.length >= count) break;
    const candidate = correct + off;
    if (candidate >= 0 && candidate <= 18 && !used.has(candidate)) {
      used.add(candidate);
      result.push(candidate);
    }
  }
  return result;
}

function generateAddition(): Puzzle {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * Math.min(10, 19 - a));
  const sum = a + b;
  const distractors = uniqueDistractors(sum, 2);
  const options = shuffle([
    { id: 'c', label: sum.toString(), isCorrect: true },
    { id: 'w1', label: distractors[0].toString(), isCorrect: false },
    { id: 'w2', label: distractors[1].toString(), isCorrect: false }
  ]);
  return {
    type: 'addition',
    prompt: 'Help Tri count!',
    display: `${a} + ${b} = ?`,
    options,
    operands: [a, b]
  };
}

function generateSubtraction(): Puzzle {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * (a + 1));
  const diff = a - b;
  const distractors = uniqueDistractors(diff, 2);
  const options = shuffle([
    { id: 'c', label: diff.toString(), isCorrect: true },
    { id: 'w1', label: distractors[0].toString(), isCorrect: false },
    { id: 'w2', label: distractors[1].toString(), isCorrect: false }
  ]);
  return {
    type: 'subtraction',
    prompt: 'How many are left?',
    display: `${a} \u2212 ${b} = ?`,
    options,
    operands: [a, b]
  };
}

const SHAPE_DEFS: { name: string; emoji: string }[] = [
  { name: 'Circle',   emoji: '🔴' },
  { name: 'Square',   emoji: '🟩' },
  { name: 'Triangle', emoji: '🔺' },
  { name: 'Star',     emoji: '⭐' },
  { name: 'Heart',    emoji: '❤️' },
  { name: 'Diamond',  emoji: '🔷' }
];

const PATTERN_PAIRS: [string, string][] = [
  ['🦕', '🥚'],
  ['🌿', '🌸'],
  ['⭐', '🌙'],
  ['🔵', '🔴'],
  ['🐢', '🦋'],
  ['🍎', '🍊']
];

function generateShapes(): Puzzle {
  return Math.random() < 0.5 ? generateShapeRecognition() : generatePatternCompletion();
}

function generateShapeRecognition(): Puzzle {
  const targetIdx = Math.floor(Math.random() * SHAPE_DEFS.length);
  const target = SHAPE_DEFS[targetIdx];
  const wrongIndices = shuffle(
    SHAPE_DEFS.map((_, i) => i).filter(i => i !== targetIdx)
  ).slice(0, 2);
  const options = shuffle([
    { id: 'c',  label: target.emoji, isCorrect: true },
    { id: 'w1', label: SHAPE_DEFS[wrongIndices[0]].emoji, isCorrect: false },
    { id: 'w2', label: SHAPE_DEFS[wrongIndices[1]].emoji, isCorrect: false }
  ]);
  return {
    type: 'shapes',
    prompt: `Tap the ${target.name}!`,
    display: `Find it! 👀`,
    options
  };
}

function generatePatternCompletion(): Puzzle {
  const pairIdx = Math.floor(Math.random() * PATTERN_PAIRS.length);
  const [a, b] = PATTERN_PAIRS[pairIdx];
  const wrongOptions = shuffle(
    PATTERN_PAIRS.filter((_, i) => i !== pairIdx).map(p => p[Math.floor(Math.random() * 2)])
  );
  const options = shuffle([
    { id: 'c',  label: b, isCorrect: true },
    { id: 'w1', label: wrongOptions[0], isCorrect: false },
    { id: 'w2', label: wrongOptions[1], isCorrect: false }
  ]);
  return {
    type: 'shapes',
    prompt: 'What comes next?',
    display: `${a}${b}${a}${b}${a}${b}${a}❓`,
    options
  };
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
