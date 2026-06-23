'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGame } from '@/hooks/useGame';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useColorblindMode } from '@/hooks/useColorblindMode';
import { buildShareText } from '@/lib/gameLogic';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { ColumnHeaders } from './ColumnHeaders';
import { GuessRow } from './GuessRow';
import { EmptyRow } from './EmptyRow';
import { StatusBanner } from './StatusBanner';

const HowToPlayModal = dynamic(() => import('./HowToPlayModal').then((mod) => mod.HowToPlayModal), {
  ssr: false,
});
const StatsModal = dynamic(() => import('./StatsModal').then((mod) => mod.StatsModal), {
  ssr: false,
});

interface GameBoardProps {
  answerId: number;
  puzzleNum: number;
}

type ModalKind = 'howto' | 'stats' | null;

const TOAST_DURATION_MS = 2000;

export function GameBoard({ answerId, puzzleNum }: GameBoardProps) {
  const {
    guesses,
    status,
    answer,
    newestGuessId,
    announcement,
    submitGuess,
    guessedIds,
    maxGuesses,
    streak,
    playStats,
  } = useGame(answerId, puzzleNum);

  const [modal, setModal] = useState<ModalKind>(null);
  const [showToast, setShowToast] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage('pgmdle-seen', false);
  const { enabled: colorblindEnabled, toggle: toggleColorblind } = useColorblindMode();
  const [todayLabel, setTodayLabel] = useState('');

  useEffect(() => {
    if (!hasSeenIntro) {
      setModal('howto');
      setHasSeenIntro(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    );
  }, []);

  const isGameOver = status !== 'playing';
  const remainingSlots = Math.max(0, maxGuesses - guesses.length);

  const handleShare = async () => {
    const text = buildShareText(guesses, puzzleNum, maxGuesses);
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 pb-8 sm:px-6 lg:px-8">
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>

      <Header onStatsClick={() => setModal('stats')} onHowToPlayClick={() => setModal('howto')} />

      <div className="flex items-center justify-between text-xs text-[var(--text2)]">
        <span>
          Puzzle #{puzzleNum}
          {todayLabel ? ` · ${todayLabel}` : ''}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: maxGuesses }).map((_, index) => {
            const isUsed = index < guesses.length;
            const isWinningGuess = isUsed && status === 'won' && index === guesses.length - 1;
            return (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  isWinningGuess ? 'bg-teal' : isUsed ? 'bg-[var(--text3)]' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      <SearchBar onGuess={submitGuess} guessedIds={guessedIds} disabled={isGameOver} />

      <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
        <div className="flex w-fit min-w-full flex-col gap-2">
          <ColumnHeaders />

          <div className="flex flex-col gap-[3px]">
            {guesses.map((guess) => (
              <GuessRow
                key={guess.entry.id}
                guess={guess}
                isNewest={guess.entry.id === newestGuessId}
              />
            ))}
            {Array.from({ length: remainingSlots }).map((_, index) => (
              <EmptyRow key={index} fadeLevel={isGameOver ? index + 1 : 0} />
            ))}
          </div>
        </div>
      </div>

      {isGameOver && (
        <StatusBanner
          status={status === 'won' ? 'won' : 'lost'}
          answer={answer}
          guessCount={guesses.length}
          onShare={handleShare}
        />
      )}

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-surface3 px-4 py-2 text-xs text-[var(--text)] shadow-lg">
          Copied to clipboard!
        </div>
      )}

      {modal === 'howto' && (
        <HowToPlayModal
          isOpen
          onClose={() => setModal(null)}
          colorblindEnabled={colorblindEnabled}
          onToggleColorblind={toggleColorblind}
        />
      )}
      {modal === 'stats' && (
        <StatsModal
          isOpen
          onClose={() => setModal(null)}
          streak={streak}
          played={playStats.played}
          wins={playStats.wins}
          distribution={playStats.distribution}
        />
      )}
    </div>
  );
}
