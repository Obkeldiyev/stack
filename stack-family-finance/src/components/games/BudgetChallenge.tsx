import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Trophy, X, ShoppingCart, Home, Utensils, Gamepad2 } from "lucide-react";
import { ResultModal } from "../ResultModal";

interface BudgetChallengeProps {
  gameId?: number;
  onBack: () => void;
}

interface BudgetItem {
  id: string;
  name: string;
  icon: any;
  amount: number;
  min: number;
  max: number;
}

const SCENARIOS = [
  {
    title: "Monthly Budget: $500",
    budget: 500,
    items: [
      { id: "rent", name: "Rent", icon: Home, amount: 200, min: 150, max: 250 },
      { id: "food", name: "Food", icon: Utensils, amount: 150, min: 100, max: 200 },
      { id: "entertainment", name: "Fun", icon: Gamepad2, amount: 50, min: 20, max: 100 },
      { id: "shopping", name: "Shopping", icon: ShoppingCart, amount: 100, min: 50, max: 150 },
    ],
  },
  {
    title: "Weekly Budget: $100",
    budget: 100,
    items: [
      { id: "food", name: "Food", icon: Utensils, amount: 40, min: 30, max: 50 },
      { id: "transport", name: "Transport", icon: ShoppingCart, amount: 20, min: 10, max: 30 },
      { id: "entertainment", name: "Fun", icon: Gamepad2, amount: 20, min: 10, max: 30 },
      { id: "savings", name: "Savings", icon: DollarSign, amount: 20, min: 10, max: 40 },
    ],
  },
  {
    title: "Daily Budget: $20",
    budget: 20,
    items: [
      { id: "breakfast", name: "Breakfast", icon: Utensils, amount: 5, min: 3, max: 8 },
      { id: "lunch", name: "Lunch", icon: Utensils, amount: 8, min: 5, max: 12 },
      { id: "snacks", name: "Snacks", icon: ShoppingCart, amount: 4, min: 2, max: 6 },
      { id: "savings", name: "Savings", icon: DollarSign, amount: 3, min: 1, max: 5 },
    ],
  },
];

export function BudgetChallenge({ gameId, onBack }: BudgetChallengeProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setGameState("playing");
    setCurrentRound(0);
    setScore(0);
    loadRound(0);
  };

  const loadRound = (round: number) => {
    if (round >= SCENARIOS.length) {
      setGameState("finished");
      setShowResult(true);
      return;
    }
    setItems(SCENARIOS[round].items);
  };

  const handleSliderChange = (id: string, value: number[]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: value[0] } : item))
    );
  };

  const submitBudget = () => {
    const scenario = SCENARIOS[currentRound];
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const difference = Math.abs(total - scenario.budget);

    // Calculate score based on accuracy
    let roundScore = 0;
    if (difference === 0) {
      roundScore = 100; // Perfect!
    } else if (difference <= 5) {
      roundScore = 80; // Very close
    } else if (difference <= 10) {
      roundScore = 60; // Close
    } else if (difference <= 20) {
      roundScore = 40; // Okay
    } else {
      roundScore = 20; // Needs work
    }

    // Bonus for balanced budget (no category too high or too low)
    const balanced = items.every(
      (item) => item.amount >= item.min + 5 && item.amount <= item.max - 5
    );
    if (balanced) roundScore += 20;

    setScore((prev) => prev + roundScore);

    // Next round
    setTimeout(() => {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      loadRound(nextRound);
    }, 1500);
  };

  const scenario = SCENARIOS[currentRound];
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const remaining = scenario?.budget - total;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Budget Challenge</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="min-h-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {gameState === "idle" && (
          <div className="text-center space-y-4 py-8">
            <p className="text-muted-foreground">
              Balance your budget across different categories! Try to spend exactly the budget amount.
            </p>
            <div className="space-y-2 text-sm">
              <p>💰 3 budget scenarios</p>
              <p>🎯 Perfect balance = 100 points</p>
              <p>⚖️ Bonus for balanced spending</p>
            </div>
            <Button onClick={startGame} size="lg" className="min-h-[44px]">
              Start Challenge
            </Button>
          </div>
        )}

        {gameState === "playing" && scenario && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">{scenario.title}</h3>
              <div className="flex justify-center gap-4 text-sm">
                <span>Round: {currentRound + 1}/3</span>
                <span>Score: {score}</span>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg text-center">
              <div className="text-2xl font-bold">
                ${total} / ${scenario.budget}
              </div>
              <div
                className={`text-sm font-medium ${
                  remaining === 0
                    ? "text-green-600"
                    : remaining > 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {remaining === 0
                  ? "Perfect Balance!"
                  : remaining > 0
                  ? `$${remaining} remaining`
                  : `$${Math.abs(remaining)} over budget`}
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">${item.amount}</span>
                    </div>
                    <Slider
                      value={[item.amount]}
                      onValueChange={(value) => handleSliderChange(item.id, value)}
                      min={item.min}
                      max={item.max}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${item.min}</span>
                      <span>${item.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={submitBudget}
              className="w-full min-h-[44px]"
              disabled={total !== scenario.budget}
            >
              {total === scenario.budget ? "Submit Budget" : "Balance your budget first"}
            </Button>
          </div>
        )}

        <ResultModal
          open={showResult}
          onClose={() => {
            setShowResult(false);
            setGameState("idle");
          }}
          score={score}
          gameTitle="Budget Challenge"
          message={
            score >= 250
              ? "Outstanding! You're a budgeting expert!"
              : score >= 180
              ? "Great job! You understand budgeting well!"
              : "Good effort! Keep practicing budgeting!"
          }
        />
      </CardContent>
    </Card>
  );
}
