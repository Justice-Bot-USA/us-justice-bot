import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FeatureHighlightBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">New:</span>
            <span className="text-muted-foreground">
              AI-powered merit score calculator now available
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/case-analysis")}
            className="group"
          >
            Try It Free
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlightBanner;
