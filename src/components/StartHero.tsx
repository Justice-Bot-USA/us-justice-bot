import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import brandLogo from "@/assets/ai-anal-logo.png";

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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(220,30%,8%)] via-[hsl(220,30%,10%)] to-[hsl(220,30%,6%)]">
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6">
            <img src={brandLogo} alt="Justice Bot USA" width={128} height={128} fetchPriority="high" className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-white p-2 shadow-2xl" />
          </div>

          {/* Platform Badge */}
          <div className="inline-block mb-6">
            <span className="bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-sm md:text-base font-bold tracking-wider uppercase">
              Justice Bot USA
            </span>
          </div>
          
          {/* H1 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Navigate the U.S. legal system with clarity — not confusion
          </h1>
          
          {/* Supporting copy */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
            Justice Bot USA is an AI-powered civic-guidance platform. We help you understand legal processes, prepare documents, and request public records — supporting self-represented individuals. We are <strong>not</strong> a law firm and do <strong>not</strong> provide legal advice.
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
            Justice Bot USA. This is legal information, not legal advice. We do not access law-enforcement databases, check warrants, or monitor individuals.
          </p>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default StartHero;
