import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Trophy, X, TrendingUp, AlertCircle } from "lucide-react";
import { ResultModal } from "../ResultModal";

interface SavingsRaceProps {
  gameId?: number;
  onBack: () => void;
}

interface Choice {
  text: string;
  savings: number;
  spending: number;
}

interface Scenario {
  situation: string;
  choices: Choice[];
}

const SCENARIOS: Scenario[] = [
  {
    situation: "You received $20 for your birthday. What do you do?",
    choices: [
      { text: "Save all $20", savings: 20, spending: 0 },
      { text: "Save $15, spend $5", savings: 15, spending: 5 },
      { text: "Save $10, spend $10", savings: 10, spending: 10 },
      { text: "Spend all $20", savings: 0, spending: 20 },
    ],
  },
  {
    situation: "You want a $50 toy. You have $30 saved. What do you do?",
    choices: [
      { text: "Wait and save $20 more", savings: 0, spending: 0 },
      { text: "Buy a cheaper $25 toy", savings: 0, spending: 25 },
      { text: "Ask parents for $20", savings: 0, spending: 50 },
      { text: "Forget about it", savings: 0, spending: 0 },
    ],
  },
  {
    situation: "You earned $15 from chores. Your friend wants to go to the movies ($10).",
    choices: [
      { text: "Go to movies, save $5", savings: 5, spending: 10 },
      { text: "Skip movies, save all $15", savings: 15, spending: 0 },
      { text: "Go to movies, buy snacks ($15)", savings: 0, spending: 15 },
      { text: "Suggest free activity, save $15", savings: 15, spending: 0 },
    ],
  },
  {
    situation: "You found $10 on the ground. What do you do?",
    choices: [
      { text: "Save it all", savings: 10, spending: 0 },
      { text: "Buy candy ($3), save $7", savings: 7, spending: 3 },
      { text: "Donate to charity", savings: 0, spending: 0 },
      { text: "Spend it all on games", savings: 0, spending: 10 },
    ],
  },
  {
    situation: "Your allowance is $10/week. You want to save for a $100 bike.",
    choices: [
      { text: "Save $8/week, spend $2", savings: 8, spending: 2 },
      { text: "Save $5/week, spend $5", savings: 5, spending: 5 },
      { text: "Save all $10/week", savings: 10, spending: 0 },
      { text: "Save $3/week, spend $7", savings: 3, spending: 7 },
    ],
  },
  {
    situation: "You have $40 saved. There's a sale on a game you want (was $50, now $35).",
    choices: [
      { text: "Buy it! It's a good deal", savings: 0, spending: 35 },
      { text: "Wait for a better sale", savings: 0, spending: 0 },
      { text: "Buy it, but save more next month", savings: 0, spending: 35 },
      { text: "Skip it, keep saving", savings: 0, spending: 0 },
    ],
  },
  {
    situation: "You earned $25 from a lemonade stand. What's your plan?",
    choices: [
      { text: "Save $20, fun money $5", savings: 20, spending: 5 },
      { text: "Save $15, spend $10", savings: 15, spending: 10 },
      { text: "Save all $25", savings: 25, spending: 0 },
      { text: "Reinvest $15, save $10", savings: 10, spending: 0 },
    ],
  },
  {
    situation: "Your savings goal is $200. You have $150. You get $30.",
    choices: [
      { text: "Add all $30 to savings", savings: 30, spending: 0 },
      { text: "Add $25, treat yourself $5", savings: 25, spending: 5 },
      { text: "Add $20, spend $10", savings: 20, spending: 10 },
      { text: "Add $15, spend $15", savings: 15, spending: 15 },
    ],
  },
];

export function SavingsRace({ gameId, onBack }: SavingsRaceProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const startGame = () => {
    setGameState("playing");
    setCurrentScenario(0);
    setTotalSavings(0);
    setTotalSpending(0);
    setFeedback("");
  };

  const handleChoice = (choice: Choice) => {
    setTotalSavings((prev) => prev + choice.savings);
    setTotalSpending((prev) => prev + choice.spending);

    // Show feedback
    if (choice.savings >= 15) {
      setFeedback("Excellent saving! 🌟");
    } else if (choice.savings >= 10) {
      setFeedback("Good balance! 👍");
    } else if (choice.savings >= 5) {
      setFeedback("Some savings is better than none! 💰");
    } else {
      setFeedback("Consider saving more next time! 💡");
    }

    setTimeout(() => {
      setFeedback("");
      if (currentScenario + 1 >= SCENARIOS.length) {
        setGameState("finished");
        setShowResult(true);
      } else {
        setCurrentScenario((prev) => prev + 1);
      }
    }, 1500);
  };

  const scenario = SCENARIOS[currentScenario];
  const progress = ((currentScenario + 1) / SCENARIOS.length) * 100;
  const savingsRate = totalSavings + totalSpending > 0
    ? (totalSavings / (totalSavings + totalSpending)) * 100
    : 0;

  // Calculate score based on savings rate
  const score = Math.round(totalSavings * (savingsRate / 10));

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Savings Race</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="min-h-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {gameState === "idle" && (
          <div className="text-center space-y-4 py-8">
            <p className="text-muted-foreground">
              Make smart financial decisions in different scenarios. Try to save as much as you can!
            </p>
            <div className="space-y-2 text-sm">
              <p>💰 8 real-life scenarios</p>
              <p>🎯 Balance saving and spending</p>
              <p>📈 Higher savings rate = higher score</p>
            </div>
            <Button onClick={startGame} size="lg" className="min-h-[44px]">
              Start Race
            </Button>
          </div>
        )}

        {gameState === "playing" && scenario && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Scenario {currentScenario + 1}/{SCENARIOS.length}</span>
                <span>Savings Rate: {savingsRate.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-muted-foreground">Total Saved</div>
                <div className="text-2xl font-bold text-green-600">${totalSavings}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold text-orange-600">${totalSpending}</div>
              </div>
            </div>

            {feedback && (
              <div className="p-3 bg-primary/5 rounded-lg text-center font-medium animate-fade-in">
                {feedback}
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="font-medium">{scenario.situation}</p>
              </div>
            </div>

            <div className="space-y-3">
              {scenario.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  variant="outline"
                  className="w-full min-h-[44px] justify-start text-left h-auto py-3 px-4"
                  disabled={!!feedback}
                >
                  <div className="flex-1">
                    <div>{choice.text}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {choice.savings > 0 && (
                        <span className="text-green-600">+${choice.savings} saved </span>
                      )}
                      {choice.spending > 0 && (
                        <span className="text-orange-600">-${choice.spending} spent</span>
                      )}
                      {choice.savings === 0 && choice.spending === 0 && (
                        <span className="text-muted-foreground">No money change</span>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        <ResultModal
          open={showResult}
          onClose={() => {
            setShowResult(false);
            setGameState("idle");
          }}
          score={score}
          gameTitle="Savings Race"
          message={
            savingsRate >= 70
              ? `Amazing! You saved ${savingsRate.toFixed(0)}% of your money! You're a savings superstar! 🌟`
              : savingsRate >= 50
              ? `Great job! You saved ${savingsRate.toFixed(0)}% of your money! Keep it up! 👍`
              : savingsRate >= 30
              ? `Good start! You saved ${savingsRate.toFixed(0)}% of your money. Try to save more! 💰`
              : `You saved ${savingsRate.toFixed(0)}% of your money. Remember, saving is important! 💡`
          }
          additionalInfo={
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Saved:</span>
                <span className="font-bold text-green-600">${totalSavings}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent:</span>
                <span className="font-bold text-orange-600">${totalSpending}</span>
              </div>
              <div className="flex justify-between">
                <span>Savings Rate:</span>
                <span className="font-bold">{savingsRate.toFixed(0)}%</span>
              </div>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
