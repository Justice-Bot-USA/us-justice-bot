import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    // Check if user has already responded
    const consent = localStorage.getItem("analytics_consent");
    if (consent === null) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasResponded(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("analytics_consent", "accepted");
    setIsVisible(false);
    setHasResponded(true);
    // Enable analytics if needed
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("analytics_consent", "declined");
    setIsVisible(false);
    setHasResponded(true);
    // Disable analytics
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!isVisible || hasResponded) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-fade-in">
      <div className="bg-white dark:bg-background rounded-xl border shadow-2xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-muted-foreground">
              We use analytics to improve your experience. This includes page views, 
              session data, and usage patterns. No personal legal information is tracked. 
              You can change your preference anytime in{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Settings
              </Link>
              .
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleDecline}
            className="flex-1"
          >
            Decline
          </Button>
          <Button 
            onClick={handleAccept}
            className="flex-1"
          >
            Accept Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsentBanner;
