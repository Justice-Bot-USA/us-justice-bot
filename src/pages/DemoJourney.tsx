import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Upload, 
  ClipboardCheck,
  Sparkles,
  Play,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const demoSteps = [
  {
    id: 1,
    title: "Describe Your Legal Issue",
    description: "Tell us about your situation in plain language. Our AI understands context and asks clarifying questions.",
    icon: FileText,
    color: "bg-blue-500",
    demo: {
      type: "input",
      label: "What's your legal issue?",
      placeholder: "My landlord hasn't returned my $2,400 security deposit after 45 days...",
      response: "I understand you're dealing with a security deposit dispute. Let me ask a few questions to guide you to the right solution."
    }
  },
  {
    id: 2,
    title: "AI Analysis & Triage",
    description: "Our AI analyzes your case and determines the best legal pathway for your situation.",
    icon: Scale,
    color: "bg-purple-500",
    demo: {
      type: "analysis",
      results: [
        { label: "Case Type", value: "Landlord-Tenant Dispute" },
        { label: "Jurisdiction", value: "Small Claims Court" },
        { label: "Estimated Filing Fee", value: "$30-$75" },
        { label: "Time to Resolution", value: "30-60 days" }
      ]
    }
  },
  {
    id: 3,
    title: "Get Your Merit Score",
    description: "Receive an AI-powered assessment of your case strength with real precedent analysis.",
    icon: Sparkles,
    color: "bg-green-500",
    demo: {
      type: "merit",
      score: 78,
      strengths: [
        "Clear documentation of deposit amount",
        "45 days exceeds most state return limits",
        "Written communication as evidence"
      ],
      improvements: [
        "Gather move-out inspection report",
        "Document property condition with photos"
      ]
    }
  },
  {
    id: 4,
    title: "Upload Evidence",
    description: "Organize your documents and evidence. Our AI extracts key facts automatically.",
    icon: Upload,
    color: "bg-orange-500",
    demo: {
      type: "evidence",
      files: [
        { name: "lease_agreement.pdf", status: "Analyzed", keyFacts: 3 },
        { name: "deposit_receipt.jpg", status: "Analyzed", keyFacts: 2 },
        { name: "move_out_photos.zip", status: "Analyzed", keyFacts: 8 }
      ]
    }
  },
  {
    id: 5,
    title: "Generate Your Forms",
    description: "Get customized legal forms pre-filled with your information, ready to file.",
    icon: ClipboardCheck,
    color: "bg-red-500",
    demo: {
      type: "forms",
      forms: [
        { name: "Small Claims Complaint", status: "Ready", pages: 4 },
        { name: "Demand Letter", status: "Ready", pages: 2 },
        { name: "Evidence Summary", status: "Ready", pages: 6 }
      ]
    }
  }
];

const DemoJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const step = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const autoPlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const renderDemoContent = () => {
    const { demo } = step;

    switch (demo.type) {
      case "input":
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">{demo.label}</label>
            <div className="p-4 bg-muted rounded-lg border-2 border-dashed border-primary/30">
              <p className="text-muted-foreground italic">{demo.placeholder}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm">{demo.response}</p>
              </div>
            </div>
          </div>
        );

      case "analysis":
        return (
          <div className="grid grid-cols-2 gap-4">
            {demo.results.map((result, i) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-muted rounded-lg"
              >
                <p className="text-xs text-muted-foreground mb-1">{result.label}</p>
                <p className="font-semibold">{result.value}</p>
              </motion.div>
            ))}
          </div>
        );

      case "merit":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <span className="text-3xl font-bold text-green-600">{demo.score}</span>
              </div>
              <p className="text-sm text-muted-foreground">Merit Score (1-100)</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths</p>
                <ul className="text-sm space-y-1">
                  {demo.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">To Improve</p>
                <ul className="text-sm space-y-1">
                  {demo.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "evidence":
        return (
          <div className="space-y-3">
            {demo.files.map((file, i) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{file.keyFacts} key facts extracted</Badge>
                  <Badge className="bg-green-500">{file.status}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "forms":
        return (
          <div className="space-y-3">
            {demo.forms.map((form, i) => (
              <motion.div
                key={form.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{form.name}</p>
                    <p className="text-xs text-muted-foreground">{form.pages} pages</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
              </motion.div>
            ))}
            <div className="p-4 bg-primary/10 rounded-lg text-center mt-6">
              <p className="font-medium text-primary">All forms ready to download!</p>
              <p className="text-sm text-muted-foreground">Pre-filled with your case information</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Demo Journey - See Justice Bot USA in Action | Interactive Walkthrough"
        description="Experience a complete walkthrough of the Justice Bot USA legal assistance platform. See how our AI helps you from case description to filing-ready forms."
        url="https://justicebot-usa.com/demo-journey"
      />
      
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Interactive Demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              See How Justice Bot USA Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Walk through a complete user journey — from describing your issue to getting filing-ready legal forms.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={autoPlay} disabled={isPlaying} size="lg">
                <Play className="h-4 w-4 mr-2" />
                {isPlaying ? "Playing..." : "Auto Play Demo"}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of {demoSteps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {demoSteps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground scale-110"
                    : i < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  {renderDemoContent()}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep === demoSteps.length - 1 ? (
              <Button asChild>
                <Link to="/case-analysis">
                  Start Your Real Case
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 p-8 bg-primary/5 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Case?</h2>
            <p className="text-muted-foreground mb-6">
              Get the same AI-powered legal guidance for your real situation. It takes less than 5 minutes.
            </p>
            <Button size="lg" asChild>
              <Link to="/case-analysis">
                Start Free Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoJourney;
