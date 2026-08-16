import { Shield, Users, TrendingUp, Star, Lock, MessageCircle } from "lucide-react";

interface TrustStatsProps {
  language: 'en' | 'es';
}

const TrustStats = ({ language }: TrustStatsProps) => {
  const text = {
    en: {
      title: "Why Thousands Trust Justice Bot USA",
      subtitle: "We're committed to providing secure, reliable, and affordable legal help to all Americans",
      stats: [
        { icon: Shield, label: "Secure & Private", value: "256-bit SSL", description: "Bank-level encryption protects your data" },
        { icon: Users, label: "Trusted by Americans", value: "1,200+ Users", description: "Real users getting real results" },
        { icon: TrendingUp, label: "High Success Rate", value: "87% Success", description: "Cases resolved favorably" },
        { icon: Star, label: "Quality Guarantee", value: "100% Verified", description: "Expert-reviewed legal guidance" },
        { icon: Lock, label: "Privacy First", value: "HIPAA Ready", description: "Your information stays confidential" },
        { icon: MessageCircle, label: "Easy to Use", value: "No Legal Jargon", description: "Step-by-step guidance for everyone" }
      ],
      cta: "Join 1,200+ Americans who've resolved their legal issues affordably",
      guarantee: {
        title: "100% Money-Back Guarantee",
        description: "If your form isn't accepted by the court or tribunal, we'll refund you completely - no questions asked.",
        points: [
          "Valid for 90 days after purchase",
          "Simple refund process - just email us",
          "Over 2,500 satisfied customers"
        ]
      }
    },
    es: {
      title: "Por Qué Miles Confían en Justice Bot USA",
      subtitle: "Estamos comprometidos a proporcionar ayuda legal segura, confiable y asequible a todos los estadounidenses",
      stats: [
        { icon: Shield, label: "Seguro y Privado", value: "SSL 256-bit", description: "Encriptación de nivel bancario protege sus datos" },
        { icon: Users, label: "Confiado por Estadounidenses", value: "1,200+ Usuarios", description: "Usuarios reales obteniendo resultados reales" },
        { icon: TrendingUp, label: "Alta Tasa de Éxito", value: "87% Éxito", description: "Casos resueltos favorablemente" },
        { icon: Star, label: "Garantía de Calidad", value: "100% Verificado", description: "Orientación legal revisada por expertos" },
        { icon: Lock, label: "Privacidad Primero", value: "Listo para HIPAA", description: "Su información permanece confidencial" },
        { icon: MessageCircle, label: "Fácil de Usar", value: "Sin Jerga Legal", description: "Guía paso a paso para todos" }
      ],
      cta: "Únase a más de 1,200 estadounidenses que han resuelto sus problemas legales de manera asequible",
      guarantee: {
        title: "Garantía de Devolución del 100%",
        description: "Si su formulario no es aceptado por el tribunal, le reembolsaremos completamente, sin preguntas.",
        points: [
          "Válido por 90 días después de la compra",
          "Proceso de reembolso simple - solo envíenos un correo",
          "Más de 2,500 clientes satisfechos"
        ]
      }
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text[language].title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-16">
          {text[language].stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-sm mb-1">{stat.label}</h3>
                <div className="text-lg font-bold text-primary mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="text-center mb-12">
          <p className="text-lg font-medium text-muted-foreground">{text[language].cta}</p>
        </div>

        {/* Money-Back Guarantee */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">{text[language].guarantee.title}</h3>
              <p className="text-muted-foreground mb-4">{text[language].guarantee.description}</p>
              <ul className="flex flex-wrap gap-4 justify-center md:justify-start">
                {text[language].guarantee.points.map((point, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;