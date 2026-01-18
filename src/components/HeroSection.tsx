import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, FileText, Users } from "lucide-react";
import usFlagHero from "@/assets/us-flag-hero.png";

interface HeroSectionProps {
  language: 'en' | 'es';
  onGetStarted: () => void;
}

const HeroSection = ({ language, onGetStarted }: HeroSectionProps) => {
  const text = {
    en: {
      slogan: "IGNORANCE IS NOT AN OPTION",
      title: "Know Your Rights. Protect Yourself and Your Family.",
      subtitle: "US Justice Bot helps Americans understand their legal rights and navigate the justice system with confidence.",
      cta: "GET STARTED FREE",
      learnMore: "Learn More",
      features: [
        { icon: Scale, label: "Know Your Rights" },
        { icon: FileText, label: "Find Legal Forms" },
        { icon: Users, label: "Protect Your Family" }
      ]
    },
    es: {
      slogan: "LA IGNORANCIA NO ES UNA OPCIÓN",
      title: "Conoce Tus Derechos. Protégete a Ti y a Tu Familia.",
      subtitle: "US Justice Bot ayuda a los americanos a entender sus derechos legales y navegar el sistema de justicia con confianza.",
      cta: "COMENZAR GRATIS",
      learnMore: "Más Información",
      features: [
        { icon: Scale, label: "Conoce Tus Derechos" },
        { icon: FileText, label: "Encuentra Formularios" },
        { icon: Users, label: "Protege a Tu Familia" }
      ]
    }
  };

  const t = text[language];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${usFlagHero})` }}
      />
      
      {/* Dark Blue/Black Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)]/80 via-[hsl(220,30%,10%)]/70 to-[hsl(220,30%,6%)]/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onGetStarted} 
              className="text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all font-bold"
            >
              {t.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onGetStarted}
              className="text-lg px-10 py-6 h-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white shadow-xl transition-all font-bold"
            >
              {t.learnMore}
            </Button>
          </div>

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
  );
};

export default HeroSection;
