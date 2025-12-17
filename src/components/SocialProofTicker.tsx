import { useState, useEffect } from "react";
import { CheckCircle, Users } from "lucide-react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm">
      <div
        className={`bg-background border border-border rounded-lg shadow-lg p-4 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium">{activities[currentIndex]}</p>
            <p className="text-xs text-muted-foreground mt-1">Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofTicker;
