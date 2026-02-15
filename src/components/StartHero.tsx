import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import usFlagHero from "@/assets/us-flag-hero.png";
import veritasLogo from "@/assets/veritas-path-logo.png";

interface StartHeroProps {
  language: 'en' | 'es';
  onPrepareForm?: () => void;
}

const StartHero = ({ language, onPrepareForm }: StartHeroProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/start');
  };

  const handleBoundaries = () => {
    const section = document.getElementById('boundaries-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${usFlagHero})`, backgroundPositionY: '60%' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)]/80 via-[hsl(220,30%,10%)]/70 to-[hsl(220,30%,6%)]/90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6">
            <img src={veritasLogo} alt="Veritas Path" className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-white p-2 shadow-2xl" />
          </div>

          {/* Platform Badge */}
          <div className="inline-block mb-6">
            <span className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-sm md:text-base font-bold tracking-wider uppercase">
              Veritas Path — Powered by Justice-Bot™
            </span>
          </div>
          
          {/* H1 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Navigate the U.S. legal system with clarity — not confusion
          </h1>
          
          {/* Supporting copy */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
            Veritas Path is an informational civic-guidance platform. Justice-Bot™ helps you understand legal processes, records, and next steps — supporting self-represented individuals without providing legal advice.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="text-lg px-10 py-6 h-auto bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all font-bold"
            >
              Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleBoundaries}
              className="text-lg px-10 py-6 h-auto bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white shadow-xl transition-all font-bold"
            >
              <Info className="h-5 w-5 mr-2" />
              What This Platform Can — and Can't — Do
            </Button>
          </div>

          {/* Micro disclaimer */}
          <p className="text-white/50 text-xs max-w-lg mx-auto">
            This is legal information, not legal advice. Veritas Path does not access law-enforcement databases, check warrants, or monitor individuals.
          </p>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default StartHero;
