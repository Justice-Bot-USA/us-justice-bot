import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const competitors = [
  {
    name: "Traditional Lawyer",
    price: "$200-500/hr",
    features: [
      { text: "Expert legal advice", us: false, them: true },
      { text: "24/7 availability", us: true, them: false },
      { text: "Affordable pricing", us: true, them: false },
      { text: "Instant access", us: true, them: false },
      { text: "California & New York (48 more states coming soon)", us: true, them: false },
      { text: "Court representation", us: false, them: true },
    ],
  },
  {
    name: "Other Legal Sites",
    price: "$20-50/mo",
    features: [
      { text: "AI-powered analysis", us: true, them: false },
      { text: "State-specific forms", us: true, them: "partial" },
      { text: "Merit score calculator", us: true, them: false },
      { text: "Legal journey wizard", us: true, them: false },
      { text: "Bilingual support", us: true, them: false },
      { text: "Evidence analysis", us: true, them: false },
    ],
  },
];

const CompetitorComparison = () => {
  const renderCheck = (value: boolean | string) => {
    if (value === true) return <Check className="h-5 w-5 text-green-500" />;
    if (value === false) return <X className="h-5 w-5 text-destructive" />;
    return <span className="text-yellow-500 text-sm">Partial</span>;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Justice Bot USA?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we compare to traditional legal options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {competitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>vs. {competitor.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {competitor.price}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2">
                    <span>Feature</span>
                    <span className="text-center text-primary">Us</span>
                    <span className="text-center">Them</span>
                  </div>
                  {competitor.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="grid grid-cols-3 gap-4 text-sm items-center"
                    >
                      <span className="text-muted-foreground">
                        {feature.text}
                      </span>
                      <div className="flex justify-center">
                        {renderCheck(feature.us)}
                      </div>
                      <div className="flex justify-center">
                        {renderCheck(feature.them)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;
