import type { Guess } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { GuessCell } from './GuessCell';
import { GRID_COLUMNS } from './gridLayout';

interface GuessRowProps {
  guess: Guess;
  isNewest?: boolean;
}

const STAGGER_MS = 60;

export function GuessRow({ guess, isNewest = false }: GuessRowProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = isNewest && !prefersReducedMotion;

  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: GRID_COLUMNS }}>
      <GuessCell value={guess.entry.name} state="name" />
      {guess.results.map((result, index) => (
        <GuessCell
          key={result.attribute}
          value={result.label}
          state={result.state}
          animDelay={index * STAGGER_MS}
          animate={animate}
        />
      ))}
    </div>
  );
}
