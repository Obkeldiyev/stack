import { useState, useEffect, useCallback, useRef } from "react";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ResultModal } from "@/components/ResultModal";

function generateQuestion() {
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number;
  if (op === "*") {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
  } else {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
  }
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { text: `${a} ${op} ${b}`, answer };
}

interface Props { gameId?: number; onBack: () => void; }

export function MathRush({ gameId, onBack }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState(generateQuestion());
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const finishedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = async () => {
    setStarting(true);
    try {
      if (gameId) {
        const res = await gamesApi.start(gameId);
        setSessionId(res.id ?? res.sessionId);
      }
      setScore(0);
      setTimeLeft(60);
      setQuestion(generateQuestion());
      setUserAnswer("");
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

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { finishGame(score); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, score, finishGame]);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer);
    if (isNaN(parsed)) return;
    if (parsed === question.answer) {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 3));
    }
    setQuestion(generateQuestion());
    setUserAnswer("");
    inputRef.current?.focus();
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
          <h2 className="text-2xl font-bold">Math Rush ⚡</h2>
          <p className="text-muted-foreground">Solve as many math problems as you can in 60 seconds!</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>+10 points for correct</li>
            <li>−3 points for wrong</li>
          </ul>
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
      <Card>
        <CardContent className="py-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Score: {score}</span>
            <span className="text-sm font-medium">{timeLeft}s</span>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="h-2" />
          <div className="text-center py-4">
            <p className="text-4xl font-bold">{question.text} = ?</p>
          </div>
          <form onSubmit={handleSubmitAnswer} className="flex gap-2">
            <Input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Answer"
              className="text-center text-lg min-h-[44px]"
              autoFocus
            />
            <Button type="submit" className="min-h-[44px] shrink-0">Submit</Button>
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
