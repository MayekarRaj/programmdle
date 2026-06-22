import type { TechEntry, GuessResult, Guess, CellState } from '@/types';

const EPOCH = new Date('2025-01-01T00:00:00Z');
const SEED = 42;

export const MAX_GUESSES = 8;
export const YEAR_ORDER = [
  'Pre-1990',
  '1990–2000',
  '2001–2010',
  '2011–2015',
  '2016–2020',
  'Post-2020',
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getDayIndex(date: Date): number {
  return Math.floor((date.getTime() - EPOCH.getTime()) / MS_PER_DAY);
}

function seededShuffle<T>(data: T[]): T[] {
  const shuffled = [...data];
  let seed = SEED;

  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(seed) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getDailyAnswer(data: TechEntry[], date: Date): TechEntry {
  const dayIndex = getDayIndex(date);
  const shuffled = seededShuffle(data);
  return shuffled[dayIndex % data.length];
}

export function getPuzzleNumber(date: Date): number {
  return getDayIndex(date) + 1;
}

const PARADIGM_FAMILIES = ['Multi-paradigm', 'Functional', 'OOP'];

function compareAttribute(
  attribute: keyof TechEntry,
  guess: TechEntry,
  answer: TechEntry,
): GuessResult {
  const guessValue = guess[attribute];
  const answerValue = answer[attribute];
  const label = String(guessValue);

  if (attribute === 'paradigm') {
    if (guessValue === answerValue) {
      return { attribute, state: 'green', label };
    }
    if (
      PARADIGM_FAMILIES.includes(String(guessValue)) &&
      PARADIGM_FAMILIES.includes(String(answerValue))
    ) {
      return { attribute, state: 'amber', label };
    }
    return { attribute, state: 'gray', label };
  }

  if (attribute === 'platform') {
    if (guessValue === answerValue) {
      return { attribute, state: 'green', label };
    }
    if (guessValue === 'Cross-platform' || answerValue === 'Cross-platform') {
      return { attribute, state: 'amber', label };
    }
    return { attribute, state: 'gray', label };
  }

  if (attribute === 'yearBand') {
    if (guessValue === answerValue) {
      return { attribute, state: 'green', label };
    }
    const guessIndex = YEAR_ORDER.indexOf(String(guessValue));
    const answerIndex = YEAR_ORDER.indexOf(String(answerValue));
    const arrow = answerIndex > guessIndex ? '↑' : '↓';
    return { attribute, state: 'blue', label: `${label} ${arrow}` };
  }

  const state: CellState = guessValue === answerValue ? 'green' : 'gray';
  return { attribute, state, label };
}

export function compareEntry(guess: TechEntry, answer: TechEntry): GuessResult[] {
  const attributes: (keyof TechEntry)[] = [
    'category',
    'paradigm',
    'primaryUse',
    'typing',
    'yearBand',
    'origin',
    'openSource',
    'platform',
  ];

  return attributes.map((attribute) => compareAttribute(attribute, guess, answer));
}

const STATE_EMOJI: Record<CellState, string> = {
  green: '🟩',
  amber: '🟨',
  gray: '⬜',
  blue: '🟦',
};

export function buildShareText(guesses: Guess[], puzzleNum: number, maxGuesses: number): string {
  const lastGuess = guesses[guesses.length - 1];
  const isWin = lastGuess !== undefined && lastGuess.results.every((r) => r.state === 'green');
  const countLabel = isWin ? String(guesses.length) : '✕';

  const header = `programmdle #${puzzleNum} ${countLabel}/${maxGuesses}`;
  const rows = guesses.map((guess) =>
    guess.results.map((result) => STATE_EMOJI[result.state]).join(''),
  );

  return [header, '', ...rows, '', 'programmdle.dev'].join('\n');
}

const ATTRIBUTE_LABELS: Record<string, string> = {
  category: 'Category',
  paradigm: 'Paradigm',
  primaryUse: 'Use case',
  typing: 'Typing',
  yearBand: 'Era',
  origin: 'Origin',
  openSource: 'Open source',
  platform: 'Platform',
};

const STATE_DESCRIPTIONS: Record<CellState, string> = {
  green: 'correct',
  amber: 'partial match',
  gray: 'incorrect',
  blue: 'wrong era',
};

function describeResult(result: GuessResult): string {
  const baseLabel = result.label.replace(/ [↑↓]$/, '');
  const description =
    result.state === 'blue'
      ? `wrong era, answer is ${result.label.endsWith('↑') ? 'later' : 'earlier'}`
      : STATE_DESCRIPTIONS[result.state];

  return `${ATTRIBUTE_LABELS[result.attribute]}: ${baseLabel}, ${description}.`;
}

export function buildGuessAnnouncement(guess: Guess): string {
  return `Guessed ${guess.entry.name}. ${guess.results.map(describeResult).join(' ')}`;
}

export function buildOutcomeAnnouncement(
  status: 'won' | 'lost',
  answer: TechEntry,
  guessCount: number,
): string {
  if (status === 'won') {
    return `Correct! The answer was ${answer.name}. Solved in ${guessCount} guesses.`;
  }
  return `Out of guesses. The answer was ${answer.name}.`;
}

export function validateGuess(
  name: string,
  data: TechEntry[],
  guessedIds: Set<number>,
): TechEntry | null {
  const match = data.find((entry) => entry.name.toLowerCase() === name.toLowerCase());

  if (!match || guessedIds.has(match.id)) {
    return null;
  }

  return match;
}
