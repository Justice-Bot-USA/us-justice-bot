import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

export const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-destructive/10 via-destructive/5 to-destructive/10 border border-destructive/20 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-destructive animate-pulse" />
          <span className="font-semibold text-destructive">Limited Time Offer</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1 font-mono text-lg font-bold">
            <span className="bg-background px-2 py-1 rounded">{formatNumber(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-background px-2 py-1 rounded">{formatNumber(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-background px-2 py-1 rounded">{formatNumber(timeLeft.seconds)}</span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          First month <strong className="text-primary">50% off</strong>
        </span>
      </div>
    </div>
  );
};

export default UrgencyTimer;
