import { useEffect } from 'react';
import type { GameStatus } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export interface TodayState {
  guessIds: number[];
  status: GameStatus;
}

const DEFAULT_TODAY_STATE: TodayState = { guessIds: [], status: 'playing' };
const KEY_PREFIX = 'pgmdle-today-';

export function useTodayState(puzzleNum: number) {
  const key = `${KEY_PREFIX}${puzzleNum}`;
  const [savedState, setSavedState] = useLocalStorage<TodayState>(key, DEFAULT_TODAY_STATE);

  useEffect(() => {
    try {
      const staleKeys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const storedKey = window.localStorage.key(i);
        if (storedKey && storedKey.startsWith(KEY_PREFIX) && storedKey !== key) {
          staleKeys.push(storedKey);
        }
      }
      staleKeys.forEach((staleKey) => window.localStorage.removeItem(staleKey));
    } catch {
      // localStorage unavailable — nothing to clean up
    }
  }, [key]);

  const saveState = (guessIds: number[], status: GameStatus) => {
    setSavedState({ guessIds, status });
  };

  return { savedState, saveState };
}
