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
          Start with a few plain-language questions.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            onClick={() => navigate("/start")}
            className="text-lg px-10 py-6 h-auto font-bold"
          >
            Tell Us What Happened
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onPrepareForm ? onPrepareForm() : navigate("/pricing")}
            className="text-lg px-10 py-6 h-auto font-bold"
          >
            Fill In a Form — Free
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Court forms and form guides are free in California and New York. Courts set their own filing fees.
        </p>
      </div>
    </section>
  );
};

export default ClosingCTA;
