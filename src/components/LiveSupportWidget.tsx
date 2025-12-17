import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LiveSupportWidget = () => {
  const handleOpenChat = () => {
    // In production, this would open your live chat widget
    window.open("mailto:support@justicebot-usa.com", "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleOpenChat}
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat support</span>
      </Button>
    </div>
  );
};

export default LiveSupportWidget;
