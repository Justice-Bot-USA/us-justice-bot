import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/us-courthouse-hero.jpg";

interface HeroSectionProps {
  language: 'en' | 'es';
  onGetStarted: () => void;
}

const HeroSection = ({ language, onGetStarted }: HeroSectionProps) => {
  const text = {
    en: {
      badge: "🎉 Try FREE for 5 Days — No Credit Card",
      title1: "Fight Back.",
      title2: "Know Your",
      title3: "Rights.",
      subtitle: "AI-powered legal tools for tenants, workers & families",
      subtitleBold: "across America",
      price: "Court forms from",
      priceAmount: "$4.99",
      inMinutes: "In 2 minutes, you'll know:",
      points: [
        "Which court handles your case (Small Claims, Housing, EEOC)",
        "Exactly which forms you need to file",
        "Your next 3 steps — in plain English",
      ],
      cta: "Get Free Case Assessment",
      ctaSecondary: "Start 5-Day Free Trial",
      ctaNote: "Start with a free assessment of your legal situation",
      noSignup: "No signup required",
      cancelAnytime: "Cancel trial anytime",
      resultsIn: "Results in 2 min",
      stat: "89%",
      statLabel: "Cases resolved favorably",
      disclaimer: "US Justice Bot provides legal information, not legal advice. We help you prepare and understand your options.",
    },
    es: {
      badge: "🎉 Prueba GRATIS por 5 Días — Sin Tarjeta de Crédito",
      title1: "Defiéndete.",
      title2: "Conoce Tus",
      title3: "Derechos.",
      subtitle: "Herramientas legales impulsadas por IA para inquilinos, trabajadores y familias",
      subtitleBold: "en toda América",
      price: "Formularios judiciales desde",
      priceAmount: "$4.99",
      inMinutes: "En 2 minutos, sabrás:",
      points: [
        "Qué tribunal maneja tu caso (Reclamos Menores, Vivienda, EEOC)",
        "Exactamente qué formularios necesitas presentar",
        "Tus próximos 3 pasos — en español sencillo",
      ],
      cta: "Obtener Evaluación Gratuita",
      ctaSecondary: "Iniciar Prueba de 5 Días",
      ctaNote: "Comienza con una evaluación gratuita de tu situación legal",
      noSignup: "Sin registro requerido",
      cancelAnytime: "Cancela en cualquier momento",
      resultsIn: "Resultados en 2 min",
      stat: "89%",
      statLabel: "Casos resueltos favorablemente",
      disclaimer: "US Justice Bot proporciona información legal, no asesoramiento legal. Te ayudamos a preparar y entender tus opciones.",
    }
  };

  const t = text[language];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="max-w-xl">
            <Badge className="mb-6 bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
              ✨ {t.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="text-foreground">{t.title1}</span>
              <br />
              <span className="text-primary">{t.title2}</span>
              <br />
              <span className="text-primary">{t.title3}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              {t.subtitle} <strong className="text-foreground">{t.subtitleBold}</strong>.
            </p>
            
            <p className="text-lg mb-6">
              {t.price} <span className="text-2xl font-bold text-primary">{t.priceAmount}</span>
            </p>

            {/* What you'll know box */}
            <div className="bg-white rounded-xl border p-6 mb-6 shadow-sm">
              <p className="text-primary font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {t.inMinutes}
              </p>
              <ol className="space-y-3">
                {t.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
                {t.cta}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={onGetStarted} className="text-lg px-8">
                {t.ctaSecondary}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{t.ctaNote}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>✓ {t.noSignup}</span>
              <span>✓ {t.cancelAnytime}</span>
              <span>✓ {t.resultsIn}</span>
            </div>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Modern courthouse representing legal clarity and justice"
                className="w-full h-auto object-cover"
              />
              
              {/* Stats overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur rounded-xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{t.stat}</p>
                    <p className="text-sm text-muted-foreground">{t.statLabel}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;