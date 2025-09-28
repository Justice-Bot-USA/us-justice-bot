import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Shield, Scale } from "lucide-react";
import heroImage from "@/assets/us-courthouse-hero.jpg";

interface HeroSectionProps {
  language: 'en' | 'es';
  onGetStarted: () => void;
}

const HeroSection = ({ language, onGetStarted }: HeroSectionProps) => {
  const text = {
    en: {
      title: "Free Legal Guidance for Every American",
      subtitle: "Navigate the US legal system with confidence. Get personalized guidance based on your state's laws.",
      cta: "Get Legal Help Now",
      stats: [
        { icon: Users, label: "50+ States Covered", value: "All US Jurisdictions" },
        { icon: Clock, label: "24/7 Available", value: "Always Online" },
        { icon: Shield, label: "Confidential", value: "Your Privacy Protected" },
        { icon: Scale, label: "Constitutional Rights", value: "Know Your Rights" }
      ]
    },
    es: {
      title: "Orientación Legal Gratuita para Cada Estadounidense",
      subtitle: "Navegue el sistema legal de EE.UU. con confianza. Obtenga orientación personalizada basada en las leyes de su estado.",
      cta: "Obtener Ayuda Legal Ahora",
      stats: [
        { icon: Users, label: "50+ Estados Cubiertos", value: "Todas las Jurisdicciones de EE.UU." },
        { icon: Clock, label: "Disponible 24/7", value: "Siempre En Línea" },
        { icon: Shield, label: "Confidencial", value: "Su Privacidad Protegida" },
        { icon: Scale, label: "Derechos Constitucionales", value: "Conozca Sus Derechos" }
      ]
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.4)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            🇺🇸 {language === 'en' ? 'Powered by the Constitution' : 'Basado en la Constitución'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {text[language].title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {text[language].subtitle}
          </p>
          
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 h-auto"
          >
            {text[language].cta}
          </Button>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {text[language].stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                  <div className="text-sm text-white/70">{stat.label}</div>
                  <div className="font-semibold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;