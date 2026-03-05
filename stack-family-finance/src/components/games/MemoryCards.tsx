import { useState, useEffect, useRef, useCallback } from "react";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResultModal } from "@/components/ResultModal";
import { cn } from "@/lib/utils";

const EMOJIS = ["🍎", "🚀", "⭐", "🎮", "💎", "🔥", "🌈", "🎯"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props { gameId?: number; onBack: () => void; }

export function MemoryCards({ gameId, onBack }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [scorePoints, setScorePoints] = useState(0);
  const finishedRef = useRef(false);
  const lockRef = useRef(false);

  const startGame = async () => {
    setStarting(true);
    try {
      if (gameId) {
        const res = await gamesApi.start(gameId);
        setSessionId(res.id ?? res.sessionId);
      }
      setCards(shuffle([...EMOJIS, ...EMOJIS]));
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setStartTime(Date.now());
      finishedRef.current = false;
      setCoinsEarned(null);
      setSubmitError(null);
      setPhase("playing");
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setStarting(false);
    }
  };

  const finishGame = useCallback(async (finalScore: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setScorePoints(finalScore);
    setPhase("done");
    setSubmitLoading(true);
    try {
      if (sessionId) {
        const res = await gamesApi.finish(sessionId, finalScore);
        setCoinsEarned(res.coinsEarned ?? 0);
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  }, [sessionId]);

  const handleFlip = (index: number) => {
    if (lockRef.current || flipped.includes(index) || matched.includes(index)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;
      if (cards[next[0]] === cards[next[1]]) {
        const newMatched = [...matched, next[0], next[1]];
        setMatched(newMatched);
        setFlipped([]);
        lockRef.current = false;
        if (newMatched.length === cards.length) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const sc = Math.max(0, 200 - (moves + 1) * 5 - elapsed * 2);
          finishGame(sc);
        }
      } else {
        setTimeout(() => { setFlipped([]); lockRef.current = false; }, 800);
      }
    }
  };

  const retryFinish = () => {
    finishedRef.current = false;
    setSubmitError(null);
    finishGame(scorePoints);
  };

  if (phase === "idle") {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Memory Cards 🃏</h2>
          <p className="text-muted-foreground">Match all pairs with the fewest moves!</p>
          <Button onClick={startGame} disabled={starting} className="min-h-[44px]">
            {starting ? "Starting..." : "Start Game"}
          </Button>
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span>Moves: {moves}</span>
          <span>Matched: {matched.length / 2} / {EMOJIS.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cards.map((emoji, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleFlip(i)}
                className={cn(
                  "aspect-square rounded-lg text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 min-h-[60px]",
                  isFlipped
                    ? "bg-primary/10 border-2 border-primary scale-95"
                    : "bg-muted hover:bg-muted/80 border-2 border-transparent"
                )}
              >
                {isFlipped ? emoji : "?"}
              </button>
            );
          })}
        </div>
      </div>
      <ResultModal
        open={phase === "done"}
        scorePoints={scorePoints}
        coinsEarned={coinsEarned}
        loading={submitLoading}
        error={submitError}
        onPlayAgain={startGame}
        onBack={onBack}
        onRetry={retryFinish}
      />
    </>
  );
}
