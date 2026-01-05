import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const StickyBottomCTA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissed state when navigating to home
  useEffect(() => {
    if (location.pathname === '/') {
      setIsDismissed(false);
    }
  }, [location.pathname]);

  // Don't show on certain pages or if dismissed
  const hiddenPaths = ['/pricing', '/auth', '/case-journey', '/case-analysis'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p)) || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-3 md:hidden safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => setIsDismissed(true)}
          className="p-1 -ml-1 text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">Get started for $4.99</p>
        </div>
        <Button onClick={() => navigate("/pricing")} size="sm" className="shrink-0">
          Start Now
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default StickyBottomCTA;
