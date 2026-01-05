import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const ChurnPreventionNudge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Don't show on mobile - too intrusive and beforeunload doesn't work well
    if (isMobile) return;
    
    // Show after user has been on site for 2 minutes and is about to leave
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const timeOnSite = Date.now() - (window as any).siteEntryTime;
      const hasInteracted = localStorage.getItem("hasInteracted");
      
      if (timeOnSite > 120000 && !hasInteracted) {
        setIsOpen(true);
        e.preventDefault();
      }
    };

    (window as any).siteEntryTime = Date.now();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isMobile]);

  const handleAccept = () => {
    localStorage.setItem("hasInteracted", "true");
    setIsOpen(false);
    navigate("/pricing");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Wait! Here's a special offer
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Before you go, get <strong>50% off your first month</strong> when you
            sign up today. Start your legal journey for just $4.99.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleAccept} className="flex-1">
              Claim Offer
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              No Thanks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChurnPreventionNudge;
