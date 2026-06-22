import { GameBoard } from '@/components/GameBoard';
import { TECH_DATA } from '@/data';
import { getDailyAnswer, getPuzzleNumber } from '@/lib/gameLogic';

// This page's output depends on the current date (new Date()), but uses no
// dynamic API Next.js can detect — without this it gets statically cached
// at build time and serves the same answer for every day until the next deploy.
export const dynamic = 'force-dynamic';

export default function Home() {
  const today = new Date();
  const answer = getDailyAnswer(TECH_DATA, today);
  const puzzleNum = getPuzzleNumber(today);

  return (
    <main className="min-h-screen bg-void">
      <GameBoard answerId={answer.id} puzzleNum={puzzleNum} />
    </main>
  );
}
