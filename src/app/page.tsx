import { GameBoard } from '@/components/GameBoard';
import { TECH_DATA } from '@/data';
import { getDailyAnswer } from '@/lib/gameLogic';

export default function Home() {
  const answer = getDailyAnswer(TECH_DATA, new Date());

  return (
    <main className="min-h-screen bg-void">
      <GameBoard answerId={answer.id} />
    </main>
  );
}
