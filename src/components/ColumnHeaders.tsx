const LABELS = [
  'Name',
  'Category',
  'Paradigm',
  'Use Case',
  'Typing',
  'Era',
  'Origin',
  'Open Src',
  'Platform',
];

const GRID_COLUMNS = '130px repeat(8, 1fr)';

export function ColumnHeaders() {
  return (
    <div
      className="sticky top-0 z-10 grid gap-[3px] bg-void py-2"
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      {LABELS.map((label) => (
        <div
          key={label}
          className="truncate text-center font-mono text-[9px] uppercase tracking-wide text-[var(--text3)]"
        >
          {label}
        </div>
      ))}
    </div>
  );
}
