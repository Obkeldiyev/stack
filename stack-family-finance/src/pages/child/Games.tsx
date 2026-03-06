import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";
import { EmptyState } from "@/components/EmptyState";
import { Gamepad2, Coins, Brain, Grid3X3, Calculator, Type, Target } from "lucide-react";

const GAME_ICONS: Record<string, any> = {
  math_rush: Calculator,
  memory_cards: Grid3X3,
  smart_quiz: Brain,
  word_scramble: Type,
  number_guess: Target,
};

// Fallback games if backend is unreachable
const FALLBACK_GAMES = [
  { id: 1, code: "math_rush", title: "Math Rush", description: "Solve math problems in 60 seconds!", coinsPerHundredPoints: 10 },
  { id: 2, code: "memory_cards", title: "Memory Cards", description: "Match all the pairs!", coinsPerHundredPoints: 15 },
  { id: 3, code: "smart_quiz", title: "Smart Quiz", description: "Answer 10 trivia questions!", coinsPerHundredPoints: 12 },
  { id: 4, code: "word_scramble", title: "Word Scramble", description: "Unscramble financial words!", coinsPerHundredPoints: 13 },
  { id: 5, code: "number_guess", title: "Number Guess", description: "Guess numbers in 5 rounds!", coinsPerHundredPoints: 11 },
];

export default function Games() {
  const [games, setGames] = useState<any[]>(FALLBACK_GAMES);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to load from backend, but use fallback if it fails
    gamesApi.list()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data);
        }
      })
      .catch(() => {
        // Keep using FALLBACK_GAMES
      });
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  if (games.length === 0) return <EmptyState icon={Gamepad2} title="No games" description="No games available yet." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-muted-foreground">Play fun games and earn coins!</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => {
          const Icon = GAME_ICONS[game.code] ?? Gamepad2;
          return (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{game.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {game.coinsPerHundredPoints} coins / 100 pts
                    </p>
                  </div>
                </div>
                {game.description && <p className="text-sm text-muted-foreground">{game.description}</p>}
                <Button onClick={() => navigate(`/child/games/${game.code}`, { state: { game } })} className="w-full min-h-[44px]">
                  Play
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
