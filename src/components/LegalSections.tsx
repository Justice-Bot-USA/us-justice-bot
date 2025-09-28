import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Briefcase, Shield, Users, DollarSign, Home, Gavel, Heart } from "lucide-react";

interface LegalSectionsProps {
  language: 'en' | 'es';
  onSectionSelect: (section: string) => void;
}

const LegalSections = ({ language, onSectionSelect }: LegalSectionsProps) => {
  const text = {
    en: {
      title: "Select Your Legal Area",
      subtitle: "Choose the area of law that matches your situation",
      sections: [
        {
          id: "small-claims",
          title: "Small Claims Court",
          description: "Disputes under $10,000 - landlord issues, unpaid debts, property damage",
          icon: DollarSign,
          popular: true
        },
        {
          id: "criminal",
          title: "Criminal Defense",
          description: "DUI, theft, assault, drug charges, traffic violations",
          icon: Shield,
          urgent: true
        },
        {
          id: "workplace",
          title: "Employment & Workplace",
          description: "Wrongful termination, discrimination, harassment, wage theft",
          icon: Briefcase,
          popular: true
        },
        {
          id: "civil",
          title: "Civil Rights",
          description: "Constitutional violations, police misconduct, discrimination",
          icon: Users,
          important: true
        },
        {
          id: "family",
          title: "Family Law",
          description: "Divorce, custody, child support, domestic violence",
          icon: Heart,
          popular: true
        },
        {
          id: "housing",
          title: "Housing & Tenant Rights",
          description: "Evictions, security deposits, habitability issues",
          icon: Home,
          popular: true
        },
        {
          id: "consumer",
          title: "Consumer Protection",
          description: "Fraud, scams, debt collection, warranty issues",
          icon: Scale,
          popular: true
        },
        {
          id: "immigration",
          title: "Immigration",
          description: "Deportation, asylum, citizenship, work permits",
          icon: Gavel,
          urgent: true
        }
      ]
    },
    es: {
      title: "Seleccione Su Área Legal",
      subtitle: "Elija el área del derecho que coincida con su situación",
      sections: [
        {
          id: "small-claims",
          title: "Corte de Reclamos Menores",
          description: "Disputas bajo $10,000 - problemas de arrendador, deudas, daños",
          icon: DollarSign,
          popular: true
        },
        {
          id: "criminal",
          title: "Defensa Criminal",
          description: "DUI, robo, asalto, cargos de drogas, violaciones de tránsito",
          icon: Shield,
          urgent: true
        },
        {
          id: "workplace",
          title: "Empleo y Trabajo",
          description: "Despido injusto, discriminación, acoso, robo de salarios",
          icon: Briefcase,
          popular: true
        },
        {
          id: "civil",
          title: "Derechos Civiles",
          description: "Violaciones constitucionales, mala conducta policial, discriminación",
          icon: Users,
          important: true
        },
        {
          id: "family",
          title: "Derecho Familiar",
          description: "Divorcio, custodia, manutención infantil, violencia doméstica",
          icon: Heart,
          popular: true
        },
        {
          id: "housing",
          title: "Vivienda y Derechos de Inquilinos",
          description: "Desalojos, depósitos de seguridad, problemas de habitabilidad",
          icon: Home,
          popular: true
        },
        {
          id: "consumer",
          title: "Protección al Consumidor",
          description: "Fraude, estafas, cobro de deudas, problemas de garantía",
          icon: Scale,
          popular: true
        },
        {
          id: "immigration",
          title: "Inmigración",
          description: "Deportación, asilo, ciudadanía, permisos de trabajo",
          icon: Gavel,
          urgent: true
        }
      ]
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{text[language].title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {text[language].sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.id}
                className="relative hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => onSectionSelect(section.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className="w-8 h-8 text-primary mb-2" />
                    <div className="flex flex-col gap-1">
                      {section.popular && (
                        <Badge variant="default" className="text-xs">
                          {language === 'en' ? 'Popular' : 'Popular'}
                        </Badge>
                      )}
                      {section.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          {language === 'en' ? 'Urgent' : 'Urgente'}
                        </Badge>
                      )}
                      {section.important && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'en' ? 'Important' : 'Importante'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {section.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    {language === 'en' ? 'Get Help' : 'Obtener Ayuda'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LegalSections;