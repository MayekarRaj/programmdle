import { GuessCell } from './GuessCell';
import { GRID_COLUMNS } from './gridLayout';

interface EmptyRowProps {
  fadeLevel?: number;
}

const CELL_COUNT = 9;

export function EmptyRow({ fadeLevel = 0 }: EmptyRowProps) {
  const opacity = Math.max(0.15, 1 - fadeLevel * 0.25);

  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: GRID_COLUMNS, opacity }}>
      {Array.from({ length: CELL_COUNT }).map((_, index) => (
        <GuessCell key={index} value="" state="empty" />
      ))}
    </div>
  );
}
