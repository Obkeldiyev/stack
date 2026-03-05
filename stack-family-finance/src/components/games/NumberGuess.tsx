import { useState, useEffect, useCallback, useRef } from "react";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResultModal } from "@/components/ResultModal";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface Props { gameId?: number; onBack: () => void; }

export function NumberGuess({ gameId, onBack }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [targetNumber, setTargetNumber] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [guesses, setGuesses] = useState<{ guess: number; hint: string }[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const finishedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxRounds = 5;

  const generateNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const startGame = async () => {
    setStarting(true);
    try {
      if (gameId) {
        const res = await gamesApi.start(gameId);
        setSessionId(res.id ?? res.sessionId);
      }
      setTargetNumber(generateNumber());
      setScore(0);
      setRound(1);
      setAttempts(0);
      setGuesses([]);
      setUserGuess("");
      finishedRef.current = false;
      setCoinsEarned(null);
      setSubmitError(null);
      setPhase("playing");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setStarting(false);
    }
  };

  const finishGame = useCallback(async (finalScore: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("done");
    const pts = Math.max(0, finalScore);
    setSubmitLoading(true);
    try {
      if (sessionId) {
        const res = await gamesApi.finish(sessionId, pts);
        setCoinsEarned(res.coinsEarned ?? 0);
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  }, [sessionId]);

  const nextRound = () => {
    if (round >= maxRounds) {
      finishGame(score);
    } else {
      setRound((r) => r + 1);
      setTargetNumber(generateNumber());
      setAttempts(0);
      setGuesses([]);
      setUserGuess("");
      inputRef.current?.focus();
    }
  };

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = parseInt(userGuess);
    if (isNaN(guess) || guess < 1 || guess > 100) return;

    setAttempts((a) => a + 1);
    const newAttempts = attempts + 1;

    if (guess === targetNumber) {
      // Correct! Award points based on attempts
      const points = Math.max(5, 25 - (newAttempts - 1) * 5);
      setScore((s) => s + points);
      setGuesses([...guesses, { guess, hint: `🎯 Correct! +${points} points` }]);
      setTimeout(nextRound, 1500);
    } else {
      const hint = guess < targetNumber ? "📈 Higher!" : "📉 Lower!";
      setGuesses([...guesses, { guess, hint }]);
      setUserGuess("");
      inputRef.current?.focus();
    }
  };

  const retryFinish = () => {
    finishedRef.current = false;
    setSubmitError(null);
    finishGame(score);
  };

  if (phase === "idle") {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Number Guess 🎯</h2>
          <p className="text-muted-foreground">Guess numbers between 1-100 in 5 rounds!</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Fewer attempts = more points</li>
            <li>1st try: 25 points</li>
            <li>2nd try: 20 points</li>
            <li>3rd try: 15 points</li>
            <li>4th+ try: 10 points</li>
          </ul>
          <Button onClick={startGame} disabled={starting} className="min-h-[44px]">
            {starting ? "Starting..." : "Start Game"}
          </Button>
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        </CardContent>
      </Card>
    );
  }

  const isCorrect = guesses.length > 0 && guesses[guesses.length - 1].hint.includes("Correct");

  return (
    <>
      <Card>
        <CardContent className="py-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Score: {score}</span>
            <span className="text-sm font-medium">Round: {round}/{maxRounds}</span>
            <span className="text-sm font-medium">Attempts: {attempts}</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <Target className="h-12 w-12 mx-auto text-primary" />
            <p className="text-lg font-semibold">Guess a number between 1 and 100</p>
          </div>

          {/* Guesses history */}
          {guesses.length > 0 && (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {guesses.map((g, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                    g.hint.includes("Correct")
                      ? "bg-green-100 text-green-700"
                      : g.hint.includes("Higher")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  <span className="font-bold">{g.guess}</span>
                  <span>{g.hint}</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitGuess} className="space-y-2">
            <Input
              ref={inputRef}
              type="number"
              min="1"
              max="100"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              placeholder="Enter your guess"
              className="text-center text-lg min-h-[44px]"
              autoFocus
              disabled={isCorrect}
            />
            <Button type="submit" className="w-full min-h-[44px]" disabled={isCorrect}>
              {isCorrect ? "Next Round..." : "Guess"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ResultModal
        open={phase === "done"}
        scorePoints={Math.max(0, score)}
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
