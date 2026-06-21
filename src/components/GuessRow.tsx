import type { Guess } from '@/types';
import { GuessCell } from './GuessCell';

interface GuessRowProps {
  guess: Guess;
}

const STAGGER_MS = 60;
const GRID_COLUMNS = '130px repeat(8, 1fr)';

export function GuessRow({ guess }: GuessRowProps) {
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: GRID_COLUMNS }}>
      <GuessCell value={guess.entry.name} state="name" />
      {guess.results.map((result, index) => (
        <GuessCell
          key={result.attribute}
          value={result.label}
          state={result.state}
          animDelay={index * STAGGER_MS}
        />
      ))}
    </div>
  );
}
