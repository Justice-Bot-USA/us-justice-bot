import { ArrowRight, FileText, Brain, Download, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: FileText,
    title: "Describe Your Case",
    description: "Tell us about your legal situation, state, and what happened.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI analyzes your case and generates a merit score with recommendations.",
  },
  {
    icon: Download,
    title: "Get Your Forms",
    description: "Access state-specific court forms with step-by-step instructions.",
  },
  {
    icon: CheckCircle,
    title: "Take Action",
    description: "Follow your personalized legal journey to resolution.",
  },
];

export const JourneyFlowchart = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Path to Justice in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've simplified the legal process so you can focus on what matters
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground mx-auto mb-4 flex items-center justify-center">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyFlowchart;
