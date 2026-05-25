export type PuzzleType = 'addition' | 'subtraction' | 'shapes' | 'counting' | 'missing-number' | 'compare';
export type PuzzleDifficulty = 'support' | 'steady' | 'stretch';

export interface PuzzleOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface PuzzleMission {
  icon: string;
  title: string;
  cue: string;
}

export interface Puzzle {
  type: PuzzleType;
  prompt: string;
  display: string;
  childHints: string[];
  mission?: PuzzleMission;
  options: PuzzleOption[];
  operands?: [number, number];
}

export function generatePuzzle(difficulty: PuzzleDifficulty = 'steady'): Puzzle {
  const rand = Math.random();
  const mix = PUZZLE_MIX[difficulty];

  if (rand < mix.addition) return withMission(generateAddition(difficulty));
  if (rand < mix.addition + mix.subtraction) return withMission(generateSubtraction(difficulty));
  if (rand < mix.addition + mix.subtraction + mix.counting) return withMission(generateCounting(difficulty));
  if (rand < mix.addition + mix.subtraction + mix.counting + mix.missingNumber) {
    return withMission(generateMissingNumber(difficulty));
  }
  if (rand < mix.addition + mix.subtraction + mix.counting + mix.missingNumber + mix.compare) {
    return withMission(generateCompare(difficulty));
  }
  return withMission(generateShapes());
}

const MATH_MISSIONS: Record<PuzzleType, PuzzleMission> = {
  addition: { icon: '🥚', title: 'Egg Count', cue: 'Put both nests together.' },
  subtraction: { icon: '🌿', title: 'Snack Share', cue: 'Some snacks went away.' },
  counting: { icon: '🦕', title: 'Dino Count', cue: 'Count each friend.' },
  'missing-number': { icon: '🦶', title: 'Number Path', cue: 'Find the missing step.' },
  compare: { icon: '🌋', title: 'Big Pile', cue: 'Pick the pile with more.' },
  shapes: { icon: '💎', title: 'Shape Hunt', cue: 'Find the matching shape.' }
};

function withMission(puzzle: Puzzle): Puzzle {
  return {
    ...puzzle,
    mission: puzzle.mission ?? MATH_MISSIONS[puzzle.type]
  };
}

const PUZZLE_MIX: Record<PuzzleDifficulty, {
  addition: number;
  subtraction: number;
  counting: number;
  missingNumber: number;
  compare: number;
}> = {
  support: { addition: 0.24, subtraction: 0.12, counting: 0.34, missingNumber: 0.10, compare: 0.10 },
  steady: { addition: 0.30, subtraction: 0.22, counting: 0.18, missingNumber: 0.14, compare: 0.08 },
  stretch: { addition: 0.28, subtraction: 0.24, counting: 0.10, missingNumber: 0.22, compare: 0.10 }
};

function getNumberRange(difficulty: PuzzleDifficulty) {
  if (difficulty === 'support') return { min: 0, max: 8 };
  if (difficulty === 'stretch') return { min: 0, max: 20 };
  return { min: 0, max: 14 };
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function uniqueDistractors(correct: number, count: number, max = 20): number[] {
  const used = new Set([correct]);
  const result: number[] = [];
  const offsets = shuffle([1, 2, -1, -2, 3, -3, 4, -4]);
  for (const off of offsets) {
    if (result.length >= count) break;
    const candidate = correct + off;
    if (candidate >= 0 && candidate <= max && !used.has(candidate)) {
      used.add(candidate);
      result.push(candidate);
    }
  }
  return result;
}

function numberOptions(correct: number, max = 20): PuzzleOption[] {
  const distractors = uniqueDistractors(correct, 2, max);
  return shuffle([
    { id: 'c', label: correct.toString(), isCorrect: true },
    { id: 'w1', label: distractors[0].toString(), isCorrect: false },
    { id: 'w2', label: distractors[1].toString(), isCorrect: false }
  ]);
}

function generateAddition(difficulty: PuzzleDifficulty): Puzzle {
  const range = getNumberRange(difficulty);
  const maxSum = range.max;
  const a = randomInt(range.min, Math.min(maxSum, difficulty === 'support' ? 6 : 12));
  const b = randomInt(0, Math.min(maxSum - a, difficulty === 'stretch' ? 14 : 10));
  const sum = a + b;
  return {
    type: 'addition',
    prompt: 'Help Tri count!',
    display: `${a} + ${b} = ?`,
    childHints: ['count both groups', 'touch answer', `${a} and ${b}`],
    options: numberOptions(sum, maxSum),
    operands: [a, b]
  };
}

function generateSubtraction(difficulty: PuzzleDifficulty): Puzzle {
  const range = getNumberRange(difficulty);
  const a = randomInt(1, range.max);
  const b = randomInt(0, difficulty === 'support' ? Math.min(a, 5) : a);
  const diff = a - b;
  return {
    type: 'subtraction',
    prompt: 'How many are left?',
    display: `${a} \u2212 ${b} = ?`,
    childHints: ['look at what stays', 'touch answer', `${a} take ${b}`],
    options: numberOptions(diff, range.max),
    operands: [a, b]
  };
}

function generateCounting(difficulty: PuzzleDifficulty): Puzzle {
  const max = difficulty === 'support' ? 8 : difficulty === 'stretch' ? 16 : 12;
  const count = randomInt(3, max);
  const emoji = shuffle(['🦕', '🥚', '⭐', '🌿', '🐚'])[0];

  return {
    type: 'counting',
    prompt: 'How many do you see?',
    display: Array.from({ length: count }, () => emoji).join(' '),
    childHints: ['count the pictures', 'touch answer', `${count} friends`],
    options: numberOptions(count, max + 2)
  };
}

function generateMissingNumber(difficulty: PuzzleDifficulty): Puzzle {
  const maxStart = difficulty === 'support' ? 5 : difficulty === 'stretch' ? 16 : 10;
  const start = randomInt(0, maxStart);
  const step = difficulty === 'stretch' && Math.random() < 0.35 ? 2 : 1;
  const missingIndex = randomInt(1, 3);
  const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
  const answer = sequence[missingIndex];
  const shown = sequence.map((n, i) => (i === missingIndex ? '?' : n)).join('  ');

  return {
    type: 'missing-number',
    prompt: 'What number is missing?',
    display: shown,
    childHints: ['say in order', 'find the gap', step === 2 ? 'skip count' : 'next number'],
    options: numberOptions(answer, sequence[4] + 2)
  };
}

function generateCompare(difficulty: PuzzleDifficulty): Puzzle {
  const max = difficulty === 'support' ? 9 : difficulty === 'stretch' ? 20 : 14;
  const a = randomInt(1, max);
  let b = randomInt(1, max);
  while (a === b) {
    b = randomInt(1, max);
  }
  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);
  const distractor = Math.max(0, smaller - 1);
  const fallbackDistractor = Math.max(0, bigger - 2);
  const thirdOption = distractor !== smaller ? distractor : fallbackDistractor;

  return {
    type: 'compare',
    prompt: 'Tap the bigger group!',
    display: `${a}  or  ${b}`,
    childHints: ['bigger pile', 'more friends', `${bigger} is more`],
    options: shuffle([
      { id: 'c', label: bigger.toString(), isCorrect: true },
      { id: 'shown-smaller', label: smaller.toString(), isCorrect: false },
      { id: 'near-smaller', label: thirdOption.toString(), isCorrect: false }
    ]),
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
    childHints: [`${target.emoji} ${target.name.toLowerCase()}`, 'match the shape', 'touch same one'],
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
    childHints: [`${a} then ${b}`, 'look at pattern', 'touch next one'],
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
