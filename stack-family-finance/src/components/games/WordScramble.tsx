import { useState, useEffect, useCallback, useRef } from "react";
import { gamesApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ResultModal } from "@/components/ResultModal";

const WORDS = [
  { word: "MONEY", hint: "What you save in a bank" },
  { word: "SAVINGS", hint: "Money you keep for later" },
  { word: "BUDGET", hint: "A plan for spending money" },
  { word: "INVEST", hint: "Put money to grow" },
  { word: "PROFIT", hint: "Money you earn" },
  { word: "CREDIT", hint: "Borrowed money" },
  { word: "WALLET", hint: "Where you keep cash" },
  { word: "COINS", hint: "Metal money" },
  { word: "BILLS", hint: "Paper money" },
  { word: "SPEND", hint: "Use money to buy" },
  { word: "EARN", hint: "Get money for work" },
  { word: "PRICE", hint: "Cost of something" },
  { word: "CHANGE", hint: "Money returned" },
  { word: "DEPOSIT", hint: "Put money in bank" },
  { word: "WITHDRAW", hint: "Take money out" },
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

interface Props { gameId?: number; onBack: () => void; }

export function WordScramble({ gameId, onBack }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState(pickWord());
  const [scrambled, setScrambled] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(90);
  const [coinsEarned, setCoinsEarned] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const finishedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = async () => {
    setStarting(true);
    try {
      if (gameId) {
        const res = await gamesApi.start(gameId);
        setSessionId(res.id ?? res.sessionId);
      }
      const word = pickWord();
      setCurrentWord(word);
      setScrambled(scramble(word.word));
      setScore(0);
      setRound(1);
      setTimeLeft(90);
      setUserAnswer("");
      setFeedback(null);
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
    if (!userAnswer.trim()) return;

    if (userAnswer.toUpperCase() === currentWord.word) {
      setScore((s) => s + 15);
      setFeedback("correct");
      setTimeout(() => {
        const word = pickWord();
        setCurrentWord(word);
        setScrambled(scramble(word.word));
        setUserAnswer("");
        setRound((r) => r + 1);
        setFeedback(null);
        inputRef.current?.focus();
      }, 800);
    } else {
      setScore((s) => Math.max(0, s - 5));
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer("");
        inputRef.current?.focus();
      }, 800);
    }
  };

  const handleSkip = () => {
    const word = pickWord();
    setCurrentWord(word);
    setScrambled(scramble(word.word));
    setUserAnswer("");
    setRound((r) => r + 1);
    setFeedback(null);
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
          <h2 className="text-2xl font-bold">Word Scramble 🔤</h2>
          <p className="text-muted-foreground">Unscramble financial words in 90 seconds!</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>+15 points for correct</li>
            <li>−5 points for wrong</li>
            <li>Use hints to help!</li>
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
            <span className="text-sm font-medium">Round: {round}</span>
            <span className="text-sm font-medium">{timeLeft}s</span>
          </div>
          <Progress value={(timeLeft / 90) * 100} className="h-2" />
          
          <div className="text-center py-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Unscramble this word:</p>
              <p className="text-4xl font-bold tracking-wider">{scrambled}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-muted-foreground">
                💡 Hint: {currentWord.hint}
              </p>
            </div>
          </div>

          {feedback && (
            <div className={`text-center py-2 rounded-lg ${
              feedback === "correct" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {feedback === "correct" ? "✓ Correct! +15" : "✗ Wrong! -5"}
            </div>
          )}

          <form onSubmit={handleSubmitAnswer} className="space-y-2">
            <Input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
              placeholder="Your answer"
              className="text-center text-lg min-h-[44px] uppercase"
              autoFocus
              disabled={feedback !== null}
            />
            <div className="flex gap-2">
              <Button type="submit" className="min-h-[44px] flex-1" disabled={feedback !== null}>
                Submit
              </Button>
              <Button type="button" variant="outline" onClick={handleSkip} className="min-h-[44px]" disabled={feedback !== null}>
                Skip
              </Button>
            </div>
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
