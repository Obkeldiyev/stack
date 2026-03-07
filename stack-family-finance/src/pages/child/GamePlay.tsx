import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MathRush } from "@/components/games/MathRush";
import { MemoryCards } from "@/components/games/MemoryCards";
import { SmartQuiz } from "@/components/games/SmartQuiz";
import { WordScramble } from "@/components/games/WordScramble";
import { NumberGuess } from "@/components/games/NumberGuess";
import { CoinCatcher } from "@/components/games/CoinCatcher";
import { BudgetChallenge } from "@/components/games/BudgetChallenge";
import { SavingsRace } from "@/components/games/SavingsRace";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GamePlay() {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const game = (location.state as any)?.game;
  const gameId = game?.id;

  const handleBack = () => navigate("/child/games");

  const renderGame = () => {
    switch (code) {
      case "math_rush":
        return <MathRush gameId={gameId} onBack={handleBack} />;
      case "memory_cards":
        return <MemoryCards gameId={gameId} onBack={handleBack} />;
      case "smart_quiz":
        return <SmartQuiz gameId={gameId} onBack={handleBack} />;
      case "word_scramble":
        return <WordScramble gameId={gameId} onBack={handleBack} />;
      case "number_guess":
        return <NumberGuess gameId={gameId} onBack={handleBack} />;
      case "coin_catcher":
        return <CoinCatcher gameId={gameId} onBack={handleBack} />;
      case "budget_challenge":
        return <BudgetChallenge gameId={gameId} onBack={handleBack} />;
      case "savings_race":
        return <SavingsRace gameId={gameId} onBack={handleBack} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg font-medium">Game not found</p>
            <Button variant="outline" onClick={handleBack} className="mt-4 min-h-[44px]">Back to Games</Button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Button variant="ghost" size="sm" onClick={handleBack} className="mb-4 min-h-[44px]">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      {renderGame()}
    </div>
  );
}
