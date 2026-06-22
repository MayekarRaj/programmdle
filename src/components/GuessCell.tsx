import type { CellState } from '@/types';

export type GuessCellState = CellState | 'name' | 'empty';

interface GuessCellProps {
  value: string;
  state: GuessCellState;
  animDelay?: number;
  animate?: boolean;
}

const REVEAL_DURATION_MS = 60;

const STATE_CLASSES: Record<GuessCellState, string> = {
  green: 'border-teal bg-teal/15 text-teal',
  amber: 'border-amber bg-amber/15 text-amber',
  gray: 'border-[var(--border)] bg-white/5 text-[var(--text2)]',
  blue: 'border-blue bg-blue/15 text-blue',
  name: 'border-[var(--border)] bg-surface2 font-mono font-bold text-[var(--text)]',
  empty: 'border-dashed border-[var(--border)] bg-transparent text-[var(--text3)]',
};

const HOVERABLE_STATES: GuessCellState[] = ['green', 'amber', 'gray', 'blue'];

export function GuessCell({ value, state, animDelay = 0, animate = false }: GuessCellProps) {
  const isName = state === 'name';
  const canHover = HOVERABLE_STATES.includes(state);

  return (
    <div
      className={`flex min-h-[68px] w-full min-w-0 items-center justify-center rounded-md border px-1.5 py-1 text-center leading-tight transition-[filter,border-color] duration-150 [transform-origin:center] ${
        isName ? 'text-[13px]' : 'text-xs'
      } ${STATE_CLASSES[state]} ${canHover ? 'hover:border-[var(--border2)] hover:brightness-110' : ''}`}
      style={
        animate
          ? {
              animation: `cell-reveal ${REVEAL_DURATION_MS}ms ease-out ${animDelay}ms both`,
            }
          : undefined
      }
    >
      <span className="min-w-0 whitespace-normal break-words">{value}</span>
    </div>
  );
}
