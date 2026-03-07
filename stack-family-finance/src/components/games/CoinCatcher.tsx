import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Trophy, X } from "lucide-react";
import { ResultModal } from "../ResultModal";

interface CoinCatcherProps {
  gameId?: number;
  onBack: () => void;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  speed: number;
  value: number;
}

export function CoinCatcher({ gameId, onBack }: CoinCatcherProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [showResult, setShowResult] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const coinIdRef = useRef(0);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(45);
    setCoins([]);
    setBasketX(50);
  };

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawn coins
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(() => {
      const newCoin: Coin = {
        id: coinIdRef.current++,
        x: Math.random() * 90 + 5,
        y: 0,
        speed: Math.random() * 2 + 2,
        value: Math.random() > 0.7 ? 10 : 5,
      };
      setCoins((prev) => [...prev, newCoin]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  // Move coins
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setCoins((prev) => {
        const updated = prev.map((coin) => ({
          ...coin,
          y: coin.y + coin.speed,
        }));

        // Check collisions
        updated.forEach((coin) => {
          if (coin.y >= 85 && coin.y <= 95) {
            const distance = Math.abs(coin.x - basketX);
            if (distance < 8) {
              setScore((s) => s + coin.value);
              coin.y = 100; // Mark for removal
            }
          }
        });

        // Remove coins that are off screen
        return updated.filter((coin) => coin.y < 100);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState, basketX]);

  // Mouse/touch control
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== "playing" || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let clientX: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, x)));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Coin Catcher</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="min-h-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {gameState === "idle" && (
          <div className="text-center space-y-4 py-8">
            <p className="text-muted-foreground">
              Move the basket to catch falling coins! Gold coins are worth more points.
            </p>
            <div className="space-y-2 text-sm">
              <p>⭐ Silver coins: 5 points</p>
              <p>🌟 Gold coins: 10 points</p>
              <p>⏱️ Time: 45 seconds</p>
            </div>
            <Button onClick={startGame} size="lg" className="min-h-[44px]">
              Start Game
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Score: {score}</span>
              <span>Time: {timeLeft}s</span>
            </div>

            <div
              ref={gameAreaRef}
              className="relative h-96 bg-gradient-to-b from-sky-100 to-sky-200 rounded-lg overflow-hidden cursor-none"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
            >
              {/* Falling coins */}
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="absolute transition-none"
                  style={{
                    left: `${coin.x}%`,
                    top: `${coin.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Coins
                    className={`h-6 w-6 ${
                      coin.value === 10 ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                </div>
              ))}

              {/* Basket */}
              <div
                className="absolute bottom-4 transition-all duration-100"
                style={{
                  left: `${basketX}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-16 h-12 bg-amber-700 rounded-b-lg border-4 border-amber-800" />
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Move your mouse or finger to control the basket
            </p>
          </div>
        )}

        <ResultModal
          open={showResult}
          onClose={() => {
            setShowResult(false);
            setGameState("idle");
          }}
          score={score}
          gameTitle="Coin Catcher"
          message={
            score >= 200
              ? "Amazing! You're a coin catching master!"
              : score >= 100
              ? "Great job! Keep practicing!"
              : "Good try! Play again to improve!"
          }
        />
      </CardContent>
    </Card>
  );
}
