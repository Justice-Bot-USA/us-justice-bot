import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Shield, CheckCircle, Clock } from "lucide-react";
import UnifiedEntryFlow from "./UnifiedEntryFlow";

interface StartHeroProps {
  language: 'en' | 'es';
}

const StartHero = ({ language }: StartHeroProps) => {
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const text = {
    en: {
      headline: "Get the right legal help for your situation",
      subheadline: "We guide you to the correct forms, courts, and next steps. No guesswork.",
      cta: "Start — it takes 2 minutes",
      secondary: "See how it works",
      trustBadge1: "No signup required",
      trustBadge2: "100% free assessment",
      time: "2 minutes to your personalized plan",
    },
    es: {
      headline: "Obtén la ayuda legal correcta para tu situación",
      subheadline: "Te guiamos a los formularios, tribunales y próximos pasos correctos. Sin adivinanzas.",
      cta: "Comenzar — toma 2 minutos",
      secondary: "Ver cómo funciona",
      trustBadge1: "Sin registro requerido",
      trustBadge2: "Evaluación 100% gratis",
      time: "2 minutos para tu plan personalizado",
    },
  };

  const t = text[language];

  const handleStart = () => {
    setIsFlowOpen(true);
  };

  const handleSeeHow = () => {
    const howSection = document.getElementById('how-it-works');
    howSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-rose-50 via-white to-background">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-foreground">
              {t.headline}
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.subheadline}
            </p>

            {/* Time indicator */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{t.time}</span>
            </div>

            {/* Primary CTA - BIG and dominant */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                size="lg"
                onClick={handleStart}
                className="text-lg px-10 py-7 h-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                {t.cta}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* Secondary CTA */}
              <Button
                variant="ghost"
                size="lg"
                onClick={handleSeeHow}
                className="text-muted-foreground hover:text-foreground"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                {t.secondary}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
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

      {/* Entry Flow Modal */}
      <UnifiedEntryFlow 
        isOpen={isFlowOpen} 
        onClose={() => setIsFlowOpen(false)} 
      />
    </>
  );
};

export default StartHero;
