interface HeaderProps {
  onStatsClick: () => void;
  onHowToPlayClick: () => void;
}

export function Header({ onStatsClick, onHowToPlayClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-void px-4 py-3">
      <div className="flex items-center gap-2">
        <h1 className="font-mono text-lg font-bold text-[var(--text)]">
          pro<span className="text-violet">{'〈gramm〉'}</span>dle
        </h1>
        <span className="rounded bg-teal/15 px-2 py-0.5 text-[10px] font-bold uppercase text-teal">
          Daily
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onStatsClick}
          aria-label="Stats"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text2)] hover:bg-surface2"
        >
          📊
        </button>
        <button
          type="button"
          onClick={onHowToPlayClick}
          aria-label="How to play"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text2)] hover:bg-surface2"
        >
          ?
        </button>
      </div>
    </header>
  );
}
