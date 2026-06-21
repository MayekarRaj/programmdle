export type Category = 'Language' | 'Framework' | 'Library' | 'Runtime' | 'DevTool';

export interface TechEntry {
  id: number;
  name: string;
  category: Category;
  paradigm: string;
  primaryUse: string;
  typing: string;
  yearBand: string;
  yearActual: number;
  origin: string;
  openSource: string;
  platform: string;
}

export type CellState = 'green' | 'amber' | 'gray' | 'blue';

export interface GuessResult {
  attribute: string;
  state: CellState;
  label: string;
}

export interface Guess {
  entry: TechEntry;
  results: GuessResult[];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  guesses: Guess[];
  status: GameStatus;
  answerId: number;
}
