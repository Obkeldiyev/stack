import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X, QrCode, Keyboard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [manualMode, setManualMode] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please enter code manually.",
        variant: "destructive",
      });
      setManualMode(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim().toUpperCase());
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Join Family</h3>
          <Button variant="ghost" size="sm" onClick={handleClose} className="min-h-[44px]">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!manualMode ? (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              {!scanning ? (
                <>
                  <div className="flex justify-center">
                    <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan the QR code shared by your family admin
                    </p>
                    <Button onClick={startCamera} size="lg" className="min-h-[44px]">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-primary/50 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Position the QR code within the frame
                  </p>
                  <Button onClick={stopCamera} variant="outline" className="min-h-[44px]">
                    Stop Camera
                  </Button>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                stopCamera();
                setManualMode(true);
              }}
              className="w-full min-h-[44px]"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Enter Code Manually
            </Button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Keyboard className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the 6-character invite code
              </p>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="ABC123"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-wider uppercase min-h-[44px]"
                autoFocus
              />
              <p className="text-xs text-center text-muted-foreground">
                Code is case-insensitive
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setManualMode(false)}
                className="min-h-[44px]"
              >
                <Camera className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
              <Button
                type="submit"
                disabled={manualCode.length !== 6}
                className="min-h-[44px]"
              >
                Join Family
              </Button>
            </div>
          </form>
        )}

        <div className="text-xs text-center text-muted-foreground">
          Don't have an invite code? Ask your family admin to share one
        </div>
      </CardContent>
    </Card>
  );
}
