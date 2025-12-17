import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react";

const tutorials = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn how to navigate the platform and find the right legal resources for your case.",
    steps: [
      "Create your free account",
      "Select your state and legal area",
      "Upload your case details",
      "Get instant AI analysis",
    ],
  },
  {
    id: 2,
    title: "Using AI Case Analysis",
    description: "Maximize your merit score with our powerful AI analysis tools.",
    steps: [
      "Describe your situation clearly",
      "Upload supporting evidence",
      "Review your merit score",
      "Follow improvement suggestions",
    ],
  },
  {
    id: 3,
    title: "Downloading Forms",
    description: "Access state-specific legal forms with step-by-step guidance.",
    steps: [
      "Search by form number or type",
      "Select your state/county",
      "Preview form requirements",
      "Download and fill out",
    ],
  },
  {
    id: 4,
    title: "Legal Journey Wizard",
    description: "Track your progress through your entire legal process.",
    steps: [
      "Start from your case analysis",
      "Follow guided steps",
      "Track deadlines and tasks",
      "Complete with confidence",
    ],
  },
];

const InteractiveTutorial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = tutorials[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tutorials.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tutorials.length) % tutorials.length);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4">How-To Guides</Badge>
        <h2 className="text-3xl font-bold">Learn How to Use US Justice Bot</h2>
      </div>

      <Card className="relative">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Content */}
            <div>
              <Badge className="mb-4">Tutorial {currentIndex + 1} of {tutorials.length}</Badge>
              <h3 className="text-2xl font-bold mb-2">{current.title}</h3>
              <p className="text-muted-foreground mb-6">{current.description}</p>
              
              <div className="space-y-3">
                {current.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual placeholder */}
            <div className="bg-muted rounded-lg flex items-center justify-center min-h-[250px]">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Interactive Demo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex gap-2">
              {tutorials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorial;
