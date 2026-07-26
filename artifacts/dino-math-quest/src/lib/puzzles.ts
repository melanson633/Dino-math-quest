export type PuzzleType = 'addition' | 'subtraction' | 'shapes' | 'counting' | 'missing-number' | 'compare' | 'fill-to-ten' | 'word-problem';
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
  /** For fill-to-ten: how many cells are already filled */
  filledCount?: number;
}

export function generatePuzzle(difficulty: PuzzleDifficulty = 'steady'): Puzzle {
  const rand = Math.random();
  const mix = PUZZLE_MIX[difficulty];

  let cum = 0;
  if (rand < (cum += mix.addition)) return withMission(generateAddition(difficulty));
  if (rand < (cum += mix.subtraction)) return withMission(generateSubtraction(difficulty));
  if (rand < (cum += mix.counting)) return withMission(generateCounting(difficulty));
  if (rand < (cum += mix.missingNumber)) return withMission(generateMissingNumber(difficulty));
  if (rand < (cum += mix.compare)) return withMission(generateCompare(difficulty));
  if (rand < (cum += mix.fillToTen)) return withMission(generateFillToTen(difficulty));
  if (rand < (cum += mix.wordProblem)) return withMission(generateWordProblem(difficulty));
  return withMission(generateShapes());
}

const MATH_MISSIONS: Record<PuzzleType, PuzzleMission> = {
  addition: { icon: '🥚', title: 'Egg Count', cue: 'Put both nests together.' },
  subtraction: { icon: '🌿', title: 'Snack Share', cue: 'Some snacks went away.' },
  counting: { icon: '🦕', title: 'Dino Count', cue: 'Count each friend.' },
  'missing-number': { icon: '🦶', title: 'Number Path', cue: 'Find the missing step.' },
  compare: { icon: '🌋', title: 'Big Pile', cue: 'Pick the pile with more.' },
  shapes: { icon: '💎', title: 'Shape Hunt', cue: 'Find the matching shape.' },
  'fill-to-ten': { icon: '🌟', title: 'Fill the Frame', cue: 'How many more to reach ten?' },
  'word-problem': { icon: '📖', title: 'Dino Story', cue: 'Listen to the story, then count!' }
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
  fillToTen: number;
  wordProblem: number;
}> = {
  support:  { addition: 0.18, subtraction: 0.08, counting: 0.26, missingNumber: 0.08, compare: 0.07, fillToTen: 0.14, wordProblem: 0.09 },
  steady:   { addition: 0.18, subtraction: 0.14, counting: 0.10, missingNumber: 0.10, compare: 0.06, fillToTen: 0.12, wordProblem: 0.16 },
  stretch:  { addition: 0.14, subtraction: 0.13, counting: 0.06, missingNumber: 0.17, compare: 0.07, fillToTen: 0.09, wordProblem: 0.18 }
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
  // fallback
  let fallback = 0;
  while (result.length < count) {
    if (!used.has(fallback)) { used.add(fallback); result.push(fallback); }
    fallback++;
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

const ADD_WORD_PROBLEMS = [
  (a: number, b: number) => `Tri found ${a} eggs 🥚. Then ${b} more hatched. How many now?`,
  (a: number, b: number) => `${a} dinos 🦕 were playing. ${b} more joined the fun! How many total?`,
  (a: number, b: number) => `Tri picked ${a} berries 🫐. Then found ${b} more. How many berries?`,
  (a: number, b: number) => `${a} shells on the beach 🐚. The tide brought ${b} more. Count them all!`,
  (a: number, b: number) => `Tri had ${a} friends 🦕. ${b} new friends came to play. How many friends now?`,
];

const SUB_WORD_PROBLEMS = [
  (a: number, b: number) => `Tri had ${a} berries 🫐. Ate ${b} for a snack. How many left?`,
  (a: number, b: number) => `${a} eggs were in the nest 🥚. ${b} hatched and hopped away. How many remain?`,
  (a: number, b: number) => `${a} shells on the sand 🐚. A wave took ${b} away. How many are left?`,
  (a: number, b: number) => `Tri had ${a} dino friends 🦕. ${b} went home for dinner. How many still here?`,
];

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

function generateWordProblem(difficulty: PuzzleDifficulty): Puzzle {
  const range = getNumberRange(difficulty);
  const isAdd = Math.random() < 0.55;

  if (isAdd) {
    const maxSum = range.max;
    const a = randomInt(range.min, Math.min(maxSum, difficulty === 'support' ? 5 : 10));
    const b = randomInt(1, Math.min(maxSum - a, difficulty === 'stretch' ? 12 : 8));
    const sum = a + b;
    const template = ADD_WORD_PROBLEMS[Math.floor(Math.random() * ADD_WORD_PROBLEMS.length)];
    return {
      type: 'word-problem',
      prompt: template(a, b),
      display: `${a} + ${b} = ?`,
      childHints: ['listen to the story', 'count both groups', `${a} and ${b} together`],
      options: numberOptions(sum, maxSum),
      operands: [a, b]
    };
  } else {
    const a = randomInt(2, range.max);
    const b = randomInt(1, difficulty === 'support' ? Math.min(a - 1, 4) : Math.max(1, a - 1));
    const diff = a - b;
    const template = SUB_WORD_PROBLEMS[Math.floor(Math.random() * SUB_WORD_PROBLEMS.length)];
    return {
      type: 'word-problem',
      prompt: template(a, b),
      display: `${a} \u2212 ${b} = ?`,
      childHints: ['listen to the story', 'what stays behind?', `${a} take away ${b}`],
      options: numberOptions(diff, range.max),
      operands: [a, b]
    };
  }
}

function generateFillToTen(difficulty: PuzzleDifficulty): Puzzle {
  // n is already filled; answer is 10 - n
  const maxFilled = difficulty === 'support' ? 7 : difficulty === 'stretch' ? 9 : 8;
  const minFilled = difficulty === 'support' ? 1 : 2;
  const n = randomInt(minFilled, maxFilled);
  const answer = 10 - n;

  return {
    type: 'fill-to-ten',
    prompt: `Tri has ${n}. How many more to make 10?`,
    display: `${n} + ? = 10`,
    childHints: ['count the empty spaces', 'fill the frame to 10', `10 take ${n}`],
    options: numberOptions(answer, 10),
    operands: [n, answer],
    filledCount: n
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

  // Stretch gets skip-counting by 2 or 5
  let step = 1;
  if (difficulty === 'stretch') {
    const r = Math.random();
    if (r < 0.25) step = 5;
    else if (r < 0.55) step = 2;
  } else if (difficulty === 'steady' && Math.random() < 0.2) {
    step = 2;
  }

  const missingIndex = randomInt(1, 3);
  const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
  const answer = sequence[missingIndex];
  const shown = sequence.map((n, i) => (i === missingIndex ? '?' : n)).join('  ');

  let hint = 'next number';
  if (step === 5) hint = 'count by 5s';
  else if (step === 2) hint = 'skip count by 2';

  return {
    type: 'missing-number',
    prompt: 'What number is missing?',
    display: shown,
    childHints: ['say in order', 'find the gap', hint],
    options: numberOptions(answer, sequence[4] + step)
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

  // Randomly choose pattern type: AB, ABB, AABB
  const patternType = shuffle(['AB', 'ABB', 'AABB'])[0];
  let sequence: string;
  let answer: string;

  if (patternType === 'AB') {
    // ABABAB? → answer is A or B depending on position
    // Show: ABABAB? where ? = A (next in cycle)
    sequence = `${a}${b}${a}${b}${a}${b}${a}❓`;
    answer = b;
  } else if (patternType === 'ABB') {
    // ABBABB? → answer is A
    sequence = `${a}${b}${b}${a}${b}${b}${a}❓`;
    answer = b;
  } else {
    // AABB: AABBAABB? → answer is A
    sequence = `${a}${a}${b}${b}${a}${a}${b}❓`;
    answer = b;
  }

  const wrongOptions = shuffle(
    PATTERN_PAIRS.filter((_, i) => i !== pairIdx).map(p => p[Math.floor(Math.random() * 2)])
  );
  const options = shuffle([
    { id: 'c',  label: answer, isCorrect: true },
    { id: 'w1', label: wrongOptions[0], isCorrect: false },
    { id: 'w2', label: wrongOptions[1], isCorrect: false }
  ]);

  let patternCue = '';
  if (patternType === 'AB') patternCue = `${a} then ${b}`;
  else if (patternType === 'ABB') patternCue = `${a} then ${b}${b}`;
  else patternCue = `${a}${a} then ${b}${b}`;

  return {
    type: 'shapes',
    prompt: 'What comes next?',
    display: sequence,
    childHints: [patternCue, 'look at the pattern', 'touch next one'],
    options
  };
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
