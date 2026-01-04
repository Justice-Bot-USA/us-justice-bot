import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, Home, Briefcase, Users, Scale, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// US States grouped by region for quick selection
const STATE_GROUPS = [
  { label: "CA", value: "CA" },
  { label: "TX", value: "TX" },
  { label: "FL", value: "FL" },
  { label: "NY", value: "NY" },
  { label: "IL", value: "IL" },
  { label: "PA", value: "PA" },
  { label: "OH", value: "OH" },
  { label: "GA", value: "GA" },
  { label: "Other", value: "OTHER" },
];

const LEGAL_AREAS = [
  { id: "housing", label: "Housing / Eviction", icon: Home, color: "bg-blue-500" },
  { id: "employment", label: "Employment / Wages", icon: Briefcase, color: "bg-green-500" },
  { id: "family", label: "Family / Custody", icon: Users, color: "bg-purple-500" },
  { id: "small-claims", label: "Small Claims / Money", icon: Scale, color: "bg-amber-500" },
];

const URGENCY_OPTIONS = [
  { label: "Urgent (< 7 days)", value: "urgent", emoji: "🔴" },
  { label: "Soon (< 30 days)", value: "soon", emoji: "🟡" },
  { label: "Planning ahead", value: "planning", emoji: "🟢" },
];

interface USAHeroMicroDecisionsProps {
  language: 'en' | 'es';
}

const USAHeroMicroDecisions = ({ language }: USAHeroMicroDecisionsProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    state: "",
    legalArea: "",
    urgency: "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleStateSelect = (state: string) => {
    setSelections(prev => ({ ...prev, state }));
    setStep(1);
  };

  const handleLegalAreaSelect = (area: string) => {
    setSelections(prev => ({ ...prev, legalArea: area }));
    setStep(2);
  };

  const handleUrgencySelect = (urgency: string) => {
    setSelections(prev => ({ ...prev, urgency }));
    // Navigate to case analysis with pre-filled data
    navigate(`/case-analysis?state=${selections.state}&area=${selections.legalArea}&urgency=${urgency}`);
  };

  const text = {
    en: {
      headline: "Get your court forms in minutes",
      subheadline: "Filled correctly. State-specific. No lawyer needed.",
      step1: "What state are you in?",
      step2: "What's this about?",
      step3: "How urgent is this?",
      trustBadge1: "No signup required",
      trustBadge2: "100% free assessment",
      time: "90 seconds to your personalized plan",
    },
    es: {
      headline: "Obtén tus formularios judiciales en minutos",
      subheadline: "Llenados correctamente. Específicos del estado. Sin abogado.",
      step1: "¿En qué estado estás?",
      step2: "¿De qué se trata?",
      step3: "¿Qué tan urgente es?",
      trustBadge1: "Sin registro requerido",
      trustBadge2: "Evaluación 100% gratis",
      time: "90 segundos para tu plan personalizado",
    },
  };

  const t = text[language];

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-rose-50 via-white to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Headline - Outcome focused */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-foreground">
              {t.headline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t.subheadline}
            </p>
          </div>

          {/* Progress Bar - Always visible */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t.time}
              </span>
              <span className="font-medium">{step}/{totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Micro-Decision Cards */}
          <div className="bg-white rounded-2xl border shadow-xl p-6 md:p-8 min-h-[280px]">
            <AnimatePresence mode="wait">
              {/* Step 0: State Selection */}
              {step === 0 && (
                <motion.div
                  key="state"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{t.step1}</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {STATE_GROUPS.map((state) => (
                      <Button
                        key={state.value}
                        variant="outline"
                        size="lg"
                        onClick={() => handleStateSelect(state.value)}
                        className="h-14 text-lg font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      >
                        {state.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Legal Area Selection */}
              {step === 1 && (
                <motion.div
                  key="legal-area"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{t.step2}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {LEGAL_AREAS.map((area) => {
                      const Icon = area.icon;
                      return (
                        <Button
                          key={area.id}
                          variant="outline"
                          size="lg"
                          onClick={() => handleLegalAreaSelect(area.id)}
                          className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{area.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(0)}
                    className="mt-4 text-muted-foreground"
                  >
                    ← Back
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Urgency Selection */}
              {step === 2 && (
                <motion.div
                  key="urgency"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{t.step3}</h2>
                  </div>
                  <div className="space-y-3">
                    {URGENCY_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="lg"
                        onClick={() => handleUrgencySelect(option.value)}
                        className="w-full h-14 justify-start text-left text-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      >
                        <span className="mr-3 text-xl">{option.emoji}</span>
                        {option.label}
                        <ArrowRight className="h-5 w-5 ml-auto" />
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="mt-4 text-muted-foreground"
                  >
                    ← Back
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              {t.trustBadge1}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-primary" />
              {t.trustBadge2}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USAHeroMicroDecisions;
