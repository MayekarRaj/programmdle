'use client';

import { useEffect, useState } from 'react';
import type { TechEntry } from '@/types';

interface StatusBannerProps {
  status: 'won' | 'lost';
  answer: TechEntry;
  guessCount: number;
  onShare: () => void;
}

function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');
}

export function StatusBanner({ status, answer, guessCount, onShare }: StatusBannerProps) {
  const [msLeft, setMsLeft] = useState(() => getMsUntilMidnight());
  const isWon = status === 'won';

  useEffect(() => {
    if (!isWon) return;
    const interval = setInterval(() => setMsLeft(getMsUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  return (
    <div
      className={`rounded-lg border p-4 text-center ${
        isWon ? 'border-teal bg-teal/10 text-teal' : 'border-red-500 bg-red-500/10 text-red-400'
      }`}
    >
      <p className="font-mono text-sm font-bold">
        {isWon ? `Got it in ${guessCount}!` : `The answer was ${answer.name}`}
      </p>
      <button
        type="button"
        onClick={onShare}
        className="mt-3 rounded-md bg-surface2 px-4 py-2 text-xs font-bold text-[var(--text)] hover:bg-surface3"
      >
        Copy Result
      </button>
      {isWon && (
        <p className="mt-3 text-xs text-[var(--text2)]">
          Next puzzle in {formatCountdown(msLeft)}
        </p>
      )}
    </div>
  );
}
