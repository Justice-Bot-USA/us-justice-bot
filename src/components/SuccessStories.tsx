import { Star, Quote, TrendingUp, FileCheck, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SuccessStoriesProps {
  language: 'en' | 'es';
}

const SuccessStories = ({ language }: SuccessStoriesProps) => {
  const text = {
    en: {
      title: "Real Results from Real Americans",
      subtitle: "Join hundreds of Americans who've successfully navigated the legal system with US Justice Bot",
      testimonials: [
        {
          initials: "SM",
          name: "Sarah M.",
          location: "Houston, TX",
          category: "Housing Court",
          quote: "US Justice Bot helped me prepare my housing court application in under an hour. The AI guidance was clear and the forms were automatically filled. I won my case and got my deposit back!",
          result: "✓ Won case, recovered $2,400 deposit",
          rating: 5
        },
        {
          initials: "JT",
          name: "James T.",
          location: "Chicago, IL",
          category: "EEOC Complaint",
          quote: "As someone with no legal background, I was overwhelmed. US Justice Bot walked me through every step, explained the process clearly, and helped me file a solid complaint.",
          result: "✓ Case accepted, settlement reached",
          rating: 5
        },
        {
          initials: "PK",
          name: "Priya K.",
          location: "Los Angeles, CA",
          category: "Small Claims Court",
          quote: "The document analyzer saved me so much time! I uploaded my contracts, and it immediately identified the key issues.",
          result: "✓ Settled for $4,500",
          rating: 5
        }
      ],
      stats: [
        { value: "87%", label: "Success Rate" },
        { value: "1,200+", label: "Cases Filed" },
        { value: "$2.8M", label: "Total Recovered" },
        { value: "4.9/5", label: "Average Rating" }
      ]
    },
    es: {
      title: "Resultados Reales de Estadounidenses Reales",
      subtitle: "Únase a cientos de estadounidenses que han navegado exitosamente el sistema legal con US Justice Bot",
      testimonials: [
        {
          initials: "SM",
          name: "Sarah M.",
          location: "Houston, TX",
          category: "Tribunal de Vivienda",
          quote: "US Justice Bot me ayudó a preparar mi solicitud ante el tribunal de vivienda en menos de una hora. La guía de IA fue clara y los formularios se llenaron automáticamente. ¡Gané mi caso y recuperé mi depósito!",
          result: "✓ Ganó el caso, recuperó $2,400 de depósito",
          rating: 5
        },
        {
          initials: "JT",
          name: "James T.",
          location: "Chicago, IL",
          category: "Queja EEOC",
          quote: "Como alguien sin conocimientos legales, estaba abrumado. US Justice Bot me guió en cada paso, explicó el proceso claramente y me ayudó a presentar una queja sólida.",
          result: "✓ Caso aceptado, acuerdo alcanzado",
          rating: 5
        },
        {
          initials: "PK",
          name: "Priya K.",
          location: "Los Angeles, CA",
          category: "Tribunal de Reclamos Menores",
          quote: "¡El analizador de documentos me ahorró tanto tiempo! Subí mis contratos y de inmediato identificó los problemas clave.",
          result: "✓ Acordado por $4,500",
          rating: 5
        }
      ],
      stats: [
        { value: "87%", label: "Tasa de Éxito" },
        { value: "1,200+", label: "Casos Presentados" },
        { value: "$2.8M", label: "Total Recuperado" },
        { value: "4.9/5", label: "Calificación Promedio" }
      ]
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Success Stories</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text[language].title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {text[language].testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{testimonial.category}</Badge>
                </div>
              </div>

              {/* Quote */}
              <div className="relative mb-4">
                <Quote className="w-6 h-6 text-primary/20 absolute -top-2 -left-1" />
                <p className="text-muted-foreground text-sm pl-4 italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Result */}
              <div className="bg-primary/5 rounded-lg p-3 text-sm font-medium text-primary">
                {testimonial.result}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {text[language].stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;