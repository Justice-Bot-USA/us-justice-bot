import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StickyBottomCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm">Get started for $4.99</p>
          <p className="text-xs text-muted-foreground">No subscription required</p>
        </div>
        <Button onClick={() => navigate("/pricing")} size="sm" className="group">
          Start Now
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default StickyBottomCTA;
