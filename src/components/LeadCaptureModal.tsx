import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface LeadCaptureModalProps {
  trigger: "time" | "exit";
  delaySeconds?: number;
}

export const LeadCaptureModal = ({
  trigger,
  delaySeconds = 30,
}: LeadCaptureModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if already shown
    const alreadyShown = localStorage.getItem("leadModalShown");
    if (alreadyShown) return;

    if (trigger === "time") {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("leadModalShown", "true");
      }, delaySeconds * 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, delaySeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your email service
    console.log("Lead captured:", email);
    setSubmitted(true);
    setTimeout(() => setIsOpen(false), 2000);
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-green-500">Thank you!</h3>
            <p className="text-muted-foreground mt-2">
              Check your email for your free guide.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Get Your Free Legal Rights Guide
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Download our comprehensive guide covering your rights in 15+ legal
            situations across all 50 states.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Send Me the Guide
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
