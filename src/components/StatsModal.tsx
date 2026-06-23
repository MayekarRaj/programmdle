'use client';

import { useEffect, useRef } from 'react';
import type { Streak } from '@/hooks/useStreak';
import { MAX_GUESSES } from '@/lib/gameLogic';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: Streak;
  played: number;
  wins: number;
  distribution: number[];
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-surface2 p-2">
      <p className="font-mono text-lg font-bold">{value}</p>
      <p className="text-[9px] uppercase text-[var(--text2)]">{label}</p>
    </div>
  );
}

export function StatsModal({ isOpen, onClose, streak, played, wins, distribution }: StatsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;
  const maxCount = Math.max(1, ...distribution);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-[var(--border)] bg-surface p-6 text-sm text-[var(--text)]"
      >
        <h2 id="stats-modal-title" className="mb-4 font-mono text-lg font-bold text-violet">Stats</h2>
        <div className="mb-4 grid grid-cols-4 gap-2 text-center">
          <StatCard label="Played" value={played} />
          <StatCard label="Win %" value={winRate} />
          <StatCard label="Streak" value={streak.current} />
          <StatCard label="Best" value={streak.best} />
        </div>
        <p className="mb-2 text-xs uppercase text-[var(--text2)]">Guess Distribution</p>
        <div className="space-y-1">
          {Array.from({ length: MAX_GUESSES }).map((_, index) => {
            const count = distribution[index] ?? 0;
            const widthPercent = (count / maxCount) * 100;
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 text-[10px] text-[var(--text2)]">{index + 1}</span>
                <div className="h-4 flex-1 rounded bg-surface2">
                  <div className="h-4 rounded bg-teal" style={{ width: `${widthPercent}%` }} />
                </div>
                <span className="w-6 text-right text-[10px] text-[var(--text2)]">{count}</span>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-surface2 py-2 text-xs font-bold hover:bg-surface3"
        >
          Close
        </button>
      </div>
    </div>
  );
}
