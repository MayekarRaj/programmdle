'use client';

import { useEffect, useState } from 'react';
import type { CellState } from '@/types';

export type GuessCellState = CellState | 'name' | 'empty';

interface GuessCellProps {
  value: string;
  state: GuessCellState;
  animDelay?: number;
}

const STATE_CLASSES: Record<GuessCellState, string> = {
  green: 'border-teal bg-teal/15 text-teal',
  amber: 'border-amber bg-amber/15 text-amber',
  gray: 'border-[var(--border)] bg-white/5 text-[var(--text2)]',
  blue: 'border-blue bg-blue/15 text-blue',
  name: 'border-[var(--border)] bg-surface2 font-mono font-bold text-[var(--text)]',
  empty: 'border-dashed border-[var(--border)] bg-transparent text-[var(--text3)]',
};

export function GuessCell({ value, state, animDelay = 0 }: GuessCellProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
  }, []);

  return (
    <div
      className={`flex h-[58px] items-center justify-center rounded-md border px-1 text-center text-[11px] leading-tight transition-transform duration-200 ${STATE_CLASSES[state]}`}
      style={{
        transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
        transitionDelay: `${animDelay}ms`,
      }}
    >
      <span className="truncate">{value}</span>
    </div>
  );
}
