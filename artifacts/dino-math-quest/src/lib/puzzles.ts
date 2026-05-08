export type PuzzleType = 'addition' | 'subtraction' | 'shapes';

export interface PuzzleOption {
  id: string;
  label: string | React.ReactNode;
  isCorrect: boolean;
}

export interface Puzzle {
  type: PuzzleType;
  prompt: string;
  display: React.ReactNode;
  options: PuzzleOption[];
}

export function generatePuzzle(): Puzzle {
  const rand = Math.random();
  if (rand < 0.4) return generateAddition();
  if (rand < 0.8) return generateSubtraction();
  return generateShapes();
}

function generateAddition(): Puzzle {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 9); // sum max 18
  const sum = a + b;
  
  const wrong1 = Math.max(0, sum + (Math.random() > 0.5 ? 1 : 2));
  const wrong2 = Math.max(0, sum - (Math.random() > 0.5 ? 1 : 2));
  
  const options = shuffle([
    { id: '1', label: sum.toString(), isCorrect: true },
    { id: '2', label: wrong1 === sum ? (sum + 1).toString() : wrong1.toString(), isCorrect: false },
    { id: '3', label: wrong2 === sum || wrong2 === wrong1 ? Math.max(0, sum - 1).toString() : wrong2.toString(), isCorrect: false }
  ]);

  return {
    type: 'addition',
    prompt: `Help Tri count!`,
    display: `${a} + ${b} = ?`,
    options
  };
}

function generateSubtraction(): Puzzle {
  const a = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const b = Math.floor(Math.random() * (a + 1)); // 0 to a
  const diff = a - b;

  const wrong1 = diff + (Math.random() > 0.5 ? 1 : 2);
  const wrong2 = Math.max(0, diff - (Math.random() > 0.5 ? 1 : 2));

  const options = shuffle([
    { id: '1', label: diff.toString(), isCorrect: true },
    { id: '2', label: wrong1 === diff ? (diff + 1).toString() : wrong1.toString(), isCorrect: false },
    { id: '3', label: wrong2 === diff || wrong2 === wrong1 ? Math.max(0, diff - 1).toString() : wrong2.toString(), isCorrect: false }
  ]);

  return {
    type: 'subtraction',
    prompt: `How many are left?`,
    display: `${a} - ${b} = ?`,
    options
  };
}

function generateShapes(): Puzzle {
  const shapes = ['🔴', '🟩', '🔺', '⭐', '❤️', '🔷'];
  const shapeNames = ['Circle', 'Square', 'Triangle', 'Star', 'Heart', 'Diamond'];
  const targetIndex = Math.floor(Math.random() * shapes.length);
  
  const options = shuffle([
    { id: '1', label: shapes[targetIndex], isCorrect: true },
    { id: '2', label: shapes[(targetIndex + 1) % shapes.length], isCorrect: false },
    { id: '3', label: shapes[(targetIndex + 2) % shapes.length], isCorrect: false }
  ]);

  return {
    type: 'shapes',
    prompt: `Tap the ${shapeNames[targetIndex]}!`,
    display: `Find the shape!`,
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
