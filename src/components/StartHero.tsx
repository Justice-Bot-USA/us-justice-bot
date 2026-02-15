import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, FileText, Users } from "lucide-react";
import UnifiedEntryFlow from "./UnifiedEntryFlow";
import usFlagHero from "@/assets/us-flag-hero.png";
import veritasLogo from "@/assets/veritas-path-logo.png";

interface StartHeroProps {
  language: 'en' | 'es';
  onPrepareForm?: () => void;
}

const StartHero = ({ language, onPrepareForm }: StartHeroProps) => {
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const text = {
    en: {
      slogan: "SELF-HELP TOOLS · NOT LEGAL ADVICE",
      title: "Find out what's going on — then prepare the right official filing.",
      subtitle: "Free public-record lookups and step-by-step form preparation for your state. Clear instructions. No fluff. No legal advice.",
      cta: "Start with a Free Lookup",
      learnMore: "Prepare a Form — from $9.99",
      trustChips: [
        "Official sources only (state & court sites)",
        "Works on mobile",
        "Save your progress (paid)",
        "Privacy-first (no selling your data)"
      ],
      features: [
        { icon: Scale, label: "Official Sources" },
        { icon: FileText, label: "State-Specific Forms" },
        { icon: Users, label: "All 50 States" }
      ]
    },
    es: {
      slogan: "HERRAMIENTAS DE AUTOAYUDA · NO ES ASESORÍA LEGAL",
      title: "Descubre qué está pasando — luego prepara la presentación oficial correcta.",
      subtitle: "Búsquedas gratuitas de registros públicos y preparación paso a paso de formularios para tu estado. Instrucciones claras. Sin relleno.",
      cta: "Comenzar con Búsqueda Gratuita",
      learnMore: "Preparar un Formulario — desde $9.99",
      trustChips: [
        "Solo fuentes oficiales (sitios estatales y judiciales)",
        "Funciona en móvil",
        "Guarda tu progreso (pago)",
        "Privacidad primero (no vendemos tus datos)"
      ],
      features: [
        { icon: Scale, label: "Fuentes Oficiales" },
        { icon: FileText, label: "Formularios Estatales" },
        { icon: Users, label: "Los 50 Estados" }
      ]
    }
  };

  const t = text[language];

  const handleStart = () => {
    setIsFlowOpen(true);
  };

  const handleLearnMore = () => {
    if (onPrepareForm) {
      onPrepareForm();
    } else {
      const howSection = document.getElementById('how-it-works');
      if (howSection) {
        howSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${usFlagHero})`, backgroundPositionY: '60%' }}
        />
        
        {/* Dark Blue/Black Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)]/80 via-[hsl(220,30%,10%)]/70 to-[hsl(220,30%,6%)]/90" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Veritas Path Logo */}
            <div className="mb-6">
              <img src={veritasLogo} alt="Veritas Path" className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-white p-2 shadow-2xl" />
            </div>

            {/* Slogan Badge */}
            <div className="inline-block mb-6">
              <span className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-sm md:text-base font-bold tracking-wider uppercase">
                {t.slogan}
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {t.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
              {t.subtitle}
            </p>

            {/* Trust Chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {t.trustChips.map((chip, i) => (
                <span key={i} className="bg-white/10 backdrop-blur border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-xs md:text-sm">
                  ✓ {chip}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleStart} 
                className="text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all font-bold"
              >
                {t.cta}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleLearnMore}
                className="text-lg px-10 py-6 h-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white shadow-xl transition-all font-bold"
              >
                {t.learnMore}
              </Button>
            </div>

            {/* Microcopy */}
            <p className="text-white/60 text-sm mb-8">
              Most people start free. Pay only when you're ready to export.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {t.features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
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
