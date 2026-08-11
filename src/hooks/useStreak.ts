import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Streak {
  current: number;
  best: number;
  lastWonDate: string | null;
}

const DEFAULT_STREAK: Streak = { current: 0, best: 0, lastWonDate: null };

function isYesterday(dateStr: string, todayStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date(`${todayStr}T00:00:00Z`).getTime();
  const diffDays = Math.round((today - date) / (24 * 60 * 60 * 1000));
  return diffDays === 1;
}

export function useStreak() {
  const [streak, setStreak] = useLocalStorage<Streak>('pgmdle-streak', DEFAULT_STREAK);

  // Returns the new streak length, or null if today's win was already recorded.
  // Callers need the value synchronously (the `streak` state above is still the
  // pre-win value until React re-renders).
  const recordWin = useCallback(
    (todayStr: string): number | null => {
      if (streak.lastWonDate === todayStr) {
        return null;
      }

      const current =
        streak.lastWonDate && isYesterday(streak.lastWonDate, todayStr) ? streak.current + 1 : 1;

      setStreak({
        current,
        best: Math.max(streak.best, current),
        lastWonDate: todayStr,
      });

      return current;
    },
    [streak, setStreak],
  );

  const recordLoss = useCallback(() => {
    setStreak({ ...streak, current: 0 });
  }, [streak, setStreak]);

  return { streak, recordWin, recordLoss };
}
