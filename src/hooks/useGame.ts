import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Guess, GameStatus } from '@/types';
import { TECH_DATA } from '@/data';
import { compareEntry, getPuzzleNumber, MAX_GUESSES, validateGuess } from '@/lib/gameLogic';
import { useTodayState } from './useTodayState';
import { useStreak } from './useStreak';

export function useGame(answerId: number) {
  const answer = useMemo(() => TECH_DATA.find((entry) => entry.id === answerId)!, [answerId]);
  const puzzleNum = useMemo(() => getPuzzleNumber(new Date()), []);

  const { savedState, saveState } = useTodayState(puzzleNum);
  const { recordWin, recordLoss } = useStreak();

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');

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
      saveState(newGuesses.map((guess) => guess.entry.id), newStatus);

      if (newStatus === 'won') {
        recordWin(new Date().toISOString().slice(0, 10));
      } else if (newStatus === 'lost') {
        recordLoss();
      }
    },
    [status, guessedIds, guesses, answer, saveState, recordWin, recordLoss],
  );

  return {
    guesses,
    status,
    answer,
    puzzleNum,
    submitGuess,
    guessedIds,
    maxGuesses: MAX_GUESSES,
  };
}
