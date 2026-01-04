import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Clock, Shield } from "lucide-react";

interface HeroSectionProps {
  language: 'en' | 'es';
  onGetStarted: () => void;
}

const HeroSection = ({ language, onGetStarted }: HeroSectionProps) => {
  const text = {
    en: {
      title1: "US Justice Bot:",
      title2: "Your Legal Ally in America",
      subtitle: "When people are expected to follow the law, ignorance should not be an option.",
      description: "US Justice Bot helps people understand their legal situation and next steps in plain language.",
      features: [
        "Find your exact court/form (Small Claims, EEOC, Housing)",
        "Get a score showing your case strength",
        "Step-by-step instructions in plain language"
      ],
      time: "Takes less than 90 seconds",
      cta: "GET STARTED — FREE",
      noSignup: "No signup required",
      freeAssessment: "100% free assessment",
      painTitle: "Terminology is confusing. Deadlines are strict. Mistakes cost you.",
      painDescription: "Most people lose or delay cases because they don't know what forms to file or which court to approach.",
      painSolution: "US Justice Bot tells you exactly what matters for your legal situation — step by step.",
      noCost: "No lawyer fee. No complex legal jargon.",
      startBtn: "Start Free Assessment"
    },
    es: {
      title1: "US Justice Bot:",
      title2: "Tu Aliado Legal en América",
      subtitle: "Cuando se espera que las personas sigan la ley, la ignorancia no debería ser una opción.",
      description: "US Justice Bot ayuda a las personas a entender su situación legal y los próximos pasos en lenguaje simple.",
      features: [
        "Encuentra tu corte/formulario exacto (Reclamos Menores, EEOC, Vivienda)",
        "Obtén una puntuación que muestra la fortaleza de tu caso",
        "Instrucciones paso a paso en lenguaje sencillo"
      ],
      time: "Toma menos de 90 segundos",
      cta: "COMENZAR — GRATIS",
      noSignup: "Sin registro requerido",
      freeAssessment: "Evaluación 100% gratuita",
      painTitle: "La terminología es confusa. Los plazos son estrictos. Los errores cuestan.",
      painDescription: "La mayoría de las personas pierden o retrasan casos porque no saben qué formularios presentar o a qué tribunal acudir.",
      painSolution: "US Justice Bot te dice exactamente lo que importa para tu situación legal — paso a paso.",
      noCost: "Sin honorarios de abogado. Sin jerga legal compleja.",
      startBtn: "Comenzar Evaluación Gratuita"
    }
  };

  const t = text[language];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-rose-50 via-white to-background">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground italic">{t.title1}</span>
              <br />
              <span className="text-primary">{t.title2}</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground italic mb-6 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            
            <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
              {t.description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {t.features.map((feature, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border shadow-sm"
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Time indicator */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <Clock className="h-4 w-4" />
              <span>{t.time}</span>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg" 
              onClick={onGetStarted} 
              className="text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              {t.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                {t.noSignup}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                {t.freeAssessment}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-background to-rose-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl border shadow-lg p-8 md:p-12">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.painTitle}</h2>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">{t.painDescription.split("because")[0]}</strong>
                  {t.painDescription.includes("because") && "because" + t.painDescription.split("because")[1]}
                </p>
                <p className="text-lg font-medium text-primary mb-4">{t.painSolution}</p>
                <p className="text-muted-foreground">{t.noCost}</p>
                
                <Button onClick={onGetStarted} className="mt-6">
                  {t.startBtn}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
