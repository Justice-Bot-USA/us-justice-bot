import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClosingCTAProps {
  onPrepareForm?: () => void;
}

const ClosingCTA = ({ onPrepareForm }: ClosingCTAProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get clarity in minutes.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            onClick={() => navigate("/warrant-lookup")}
            className="text-lg px-10 py-6 h-auto font-bold"
          >
            Start Free Lookup
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onPrepareForm ? onPrepareForm() : navigate("/pricing")}
            className="text-lg px-10 py-6 h-auto font-bold"
          >
            Prepare a Form — $9.99
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          No subscription required to try. Cancel anytime.
        </p>
      </div>
    </section>
  );
};

export default ClosingCTA;
