import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Guess, GameStatus } from '@/types';
import { TECH_DATA } from '@/data';
import {
  buildGuessAnnouncement,
  buildOutcomeAnnouncement,
  compareEntry,
  MAX_GUESSES,
  validateGuess,
} from '@/lib/gameLogic';
import { useTodayState } from './useTodayState';
import { useStreak } from './useStreak';
import { useLocalStorage } from './useLocalStorage';

export interface PlayStats {
  played: number;
  wins: number;
  distribution: number[];
}

const DEFAULT_PLAY_STATS: PlayStats = {
  played: 0,
  wins: 0,
  distribution: Array(MAX_GUESSES).fill(0),
};

export function useGame(answerId: number, puzzleNum: number) {
  const answer = useMemo(() => TECH_DATA.find((entry) => entry.id === answerId)!, [answerId]);

  const { savedState, saveState } = useTodayState(puzzleNum);
  const { streak, recordWin, recordLoss } = useStreak();
  const [playStats, setPlayStats] = useLocalStorage<PlayStats>('pgmdle-stats', DEFAULT_PLAY_STATS);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [newestGuessId, setNewestGuessId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (savedState.guessIds.length === 0) {
      return;
    }

    const rehydrated: Guess[] = savedState.guessIds
      .map((id) => TECH_DATA.find((entry) => entry.id === id))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
      .map((entry) => ({ entry, results: compareEntry(entry, answer) }));

    setGuesses(rehydrated);
    setStatus(savedState.status);
  }, [savedState, answer]);

  const guessedIds = useMemo(() => new Set(guesses.map((guess) => guess.entry.id)), [guesses]);

  const submitGuess = useCallback(
    (name: string) => {
      if (status !== 'playing') {
        return;
      }

      const entry = validateGuess(name, TECH_DATA, guessedIds);
      if (!entry) {
        return;
      }

      const results = compareEntry(entry, answer);
      const newGuesses = [...guesses, { entry, results }];

      const isWin = results.every((result) => result.state === 'green');
      const isLoss = !isWin && newGuesses.length >= MAX_GUESSES;
      const newStatus: GameStatus = isWin ? 'won' : isLoss ? 'lost' : 'playing';

      setGuesses(newGuesses);
      setStatus(newStatus);
      setNewestGuessId(entry.id);
      saveState(newGuesses.map((guess) => guess.entry.id), newStatus);

      const guessAnnouncement = buildGuessAnnouncement({ entry, results });
      const outcomeAnnouncement =
        newStatus === 'playing' ? '' : ` ${buildOutcomeAnnouncement(newStatus, answer, newGuesses.length)}`;
      setAnnouncement(`${guessAnnouncement}${outcomeAnnouncement}`);

      if (newStatus === 'won') {
        recordWin(new Date().toISOString().slice(0, 10));
        const distribution = [...playStats.distribution];
        const index = newGuesses.length - 1;
        distribution[index] = (distribution[index] ?? 0) + 1;
        setPlayStats({ played: playStats.played + 1, wins: playStats.wins + 1, distribution });
      } else if (newStatus === 'lost') {
        recordLoss();
        setPlayStats({ ...playStats, played: playStats.played + 1 });
      }
    },
    [
      status,
      guessedIds,
      guesses,
      answer,
      saveState,
      recordWin,
      recordLoss,
      playStats,
      setPlayStats,
    ],
  );

  return {
    guesses,
    status,
    answer,
    puzzleNum,
    newestGuessId,
    announcement,
    submitGuess,
    guessedIds,
    maxGuesses: MAX_GUESSES,
    streak,
    playStats,
  };
}
