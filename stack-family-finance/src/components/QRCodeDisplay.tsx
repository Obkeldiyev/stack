import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  size?: number;
}

export function QRCodeDisplay({ value, title = "Scan to Join", size = 300 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [value, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "Invite code copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "family-invite-qr.png";
      link.href = url;
      link.click();
      toast({
        title: "Downloaded!",
        description: "QR code saved to your device",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share this QR code or invite code with family members
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border-2 border-border">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">Invite Code</div>
            <div className="text-2xl font-bold font-mono tracking-wider">{value}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleCopy} className="min-h-[44px]">
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
            <Button variant="outline" onClick={handleDownload} className="min-h-[44px]">
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Family members can scan this QR code or enter the code manually to join
        </div>
      </CardContent>
    </Card>
  );
}
