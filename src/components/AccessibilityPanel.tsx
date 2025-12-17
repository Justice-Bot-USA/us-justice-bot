import { useState } from "react";
import { Accessibility, Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const AccessibilityPanel = () => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
    setFontSize(size);
  };

  const toggleHighContrast = (enabled: boolean) => {
    document.documentElement.classList.toggle("high-contrast", enabled);
    setHighContrast(enabled);
  };

  const toggleReducedMotion = (enabled: boolean) => {
    document.documentElement.classList.toggle("reduce-motion", enabled);
    setReducedMotion(enabled);
  };

  const resetAll = () => {
    applyFontSize(100);
    toggleHighContrast(false);
    toggleReducedMotion(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-20 right-4 z-50 rounded-full"
          aria-label="Accessibility options"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Accessibility Options</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Font Size */}
          <div className="space-y-3">
            <Label>Text Size: {fontSize}%</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => applyFontSize(Math.max(80, fontSize - 10))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Slider
                value={[fontSize]}
                min={80}
                max={150}
                step={10}
                onValueChange={([value]) => applyFontSize(value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => applyFontSize(Math.min(150, fontSize + 10))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast</Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduce Motion</Label>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
            />
          </div>

          {/* Reset */}
          <Button variant="outline" className="w-full" onClick={resetAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilityPanel;
