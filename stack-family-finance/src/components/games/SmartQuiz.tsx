import { useState, useRef, useCallback } from "react";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResultModal } from "@/components/ResultModal";
import { cn } from "@/lib/utils";
import quizData from "@/data/quiz.json";

function pickQuestions(count: number) {
  const shuffled = [...quizData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface Props { gameId?: number; onBack: () => void; }

export function SmartQuiz({ gameId, onBack }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<typeof quizData>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const finishedRef = useRef(false);

  const startGame = async () => {
    setStarting(true);
    try {
      if (gameId) {
        const res = await gamesApi.start(gameId);
        setSessionId(res.id ?? res.sessionId);
      }
      setQuestions(pickQuestions(10));
      setCurrent(0);
      setScore(0);
      setSelected(null);
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

  const handleAnswer = (optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const correct = optIndex === questions[current].correctIndex;
    const newScore = correct ? score + 20 : score;
    if (correct) setScore(newScore);

    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= questions.length) {
        finishGame(newScore);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 800);
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
          <h2 className="text-2xl font-bold">Smart Quiz 🧠</h2>
          <p className="text-muted-foreground">Answer 10 trivia questions. +20 per correct answer!</p>
          <Button onClick={startGame} disabled={starting} className="min-h-[44px]">
            {starting ? "Starting..." : "Start Game"}
          </Button>
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        </CardContent>
      </Card>
    );
  }

  const q = questions[current];
  if (!q) return null;

  return (
    <>
      <Card>
        <CardContent className="py-6 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Question {current + 1}/{questions.length}</span>
            <span className="font-medium">Score: {score}</span>
          </div>
          <Progress value={((current + 1) / questions.length) * 100} className="h-2" />
          <p className="text-lg font-semibold text-center py-2">{q.question}</p>
          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              let variant: "outline" | "default" | "destructive" = "outline";
              if (selected !== null) {
                if (i === q.correctIndex) variant = "default";
                else if (i === selected) variant = "destructive";
              }
              return (
                <Button
                  key={i}
                  variant={variant}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={cn("min-h-[44px] justify-start text-left", selected === null && "hover:bg-primary/5")}
                >
                  {opt}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <ResultModal
        open={phase === "done"}
        scorePoints={score}
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
