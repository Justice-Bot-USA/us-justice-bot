import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const activities = [
  "Someone from California just downloaded Family Law forms",
  "A user in Texas completed their case analysis",
  "Someone from Florida saved 85% on legal fees",
  "A New York user won their small claims case",
  "Someone from Ohio just started their legal journey",
  "A user in Illinois accessed employment forms",
  "Someone from Pennsylvania got their merit score",
  "A Georgia user downloaded housing forms",
];

export const SocialProofTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isMobile = useIsMobile();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches || document.documentElement.classList.contains("reduce-motion"));
    
    const handler = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    
    // Also listen for manual toggle via AccessibilityPanel
    const observer = new MutationObserver(() => {
      setReducedMotion(document.documentElement.classList.contains("reduce-motion"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => {
      mediaQuery.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Don't run ticker on mobile to prevent performance issues
    if (isMobile || isDismissed || reducedMotion) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 8000); // Increased to 8 seconds to reduce frequency

    return () => clearInterval(interval);
  }, [isMobile, isDismissed, reducedMotion]);

  // Don't render on mobile at all
  if (isMobile || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm hidden md:block">
      <div
        className={`bg-background border border-border rounded-lg shadow-lg p-4 ${
          reducedMotion 
            ? "" 
            : `transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{activities[currentIndex]}</p>
            <p className="text-xs text-muted-foreground mt-1">Just now</p>
          </div>
          <button 
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-muted rounded-full flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialProofTicker;
