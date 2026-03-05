import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Coins } from "lucide-react";

interface ResultModalProps {
  open: boolean;
  scorePoints: number;
  coinsEarned: number | null;
  loading?: boolean;
  error?: string | null;
  onPlayAgain: () => void;
  onBack: () => void;
  onRetry?: () => void;
}

export function ResultModal({ open, scorePoints, coinsEarned, loading, error, onPlayAgain, onBack, onRetry }: ResultModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Game Over!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <span className="text-2xl font-bold">{scorePoints}</span>
              <span className="text-xs text-muted-foreground">Points</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-14 w-14 rounded-full bg-warning/10 flex items-center justify-center">
                <Coins className="h-7 w-7 text-warning" />
              </div>
              <span className="text-2xl font-bold">
                {loading ? "..." : coinsEarned ?? "—"}
              </span>
              <span className="text-xs text-muted-foreground">Coins</span>
            </div>
          </div>
          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
              {onRetry && (
                <Button variant="ghost" size="sm" onClick={onRetry} className="ml-2">
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onPlayAgain} disabled={loading} className="w-full min-h-[44px]">
            Play Again
          </Button>
          <Button variant="outline" onClick={onBack} disabled={loading} className="w-full min-h-[44px]">
            Back to Games
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
