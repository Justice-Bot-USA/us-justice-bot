import { FileText, Brain, FileCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HowItWorksProps {
  language: 'en' | 'es';
}

const HowItWorks = ({ language }: HowItWorksProps) => {
  const text = {
    en: {
      title: "How US Justice Bot Works",
      subtitle: "Get legal help in 4 simple steps. No lawyer required.",
      demo: "See a Live Demo",
      steps: [
        {
          icon: FileText,
          title: "Describe Your Issue",
          description: "Answer simple questions about your legal situation"
        },
        {
          icon: Brain,
          title: "AI Analysis",
          description: "Our AI analyzes your case and determines the best legal pathway"
        },
        {
          icon: FileCheck,
          title: "Get Your Forms",
          description: "Receive customized legal forms pre-filled with your information"
        },
        {
          icon: Send,
          title: "File & Proceed",
          description: "Follow step-by-step instructions to file your case confidently"
        }
      ]
    },
    es: {
      title: "Cómo Funciona US Justice Bot",
      subtitle: "Obtenga ayuda legal en 4 simples pasos. Sin necesidad de abogado.",
      demo: "Ver Demostración",
      steps: [
        {
          icon: FileText,
          title: "Describa Su Problema",
          description: "Responda preguntas simples sobre su situación legal"
        },
        {
          icon: Brain,
          title: "Análisis de IA",
          description: "Nuestra IA analiza su caso y determina la mejor vía legal"
        },
        {
          icon: FileCheck,
          title: "Obtenga Sus Formularios",
          description: "Reciba formularios legales personalizados con su información"
        },
        {
          icon: Send,
          title: "Presente y Continúe",
          description: "Siga instrucciones paso a paso para presentar su caso con confianza"
        }
      ]
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text[language].title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {text[language].steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="relative text-center group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}
                
                {/* Step number badge */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-10">
                  {index + 1}
                </div>
                
                {/* Icon container */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:shadow-lg transition-all duration-300 hover-scale">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="hover-scale">
            <Link to="/case-analysis">{text[language].demo}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;