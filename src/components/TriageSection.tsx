import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scale, FileText, Users, Home, Briefcase, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const legalAreas = [
  { id: "family", name: "Family Law", icon: Users, description: "Divorce, custody, child support" },
  { id: "housing", name: "Housing", icon: Home, description: "Tenant rights, evictions, landlord disputes" },
  { id: "employment", name: "Employment", icon: Briefcase, description: "Wrongful termination, discrimination" },
  { id: "small-claims", name: "Small Claims", icon: Scale, description: "Disputes under $10,000" },
  { id: "human-rights", name: "Human Rights", icon: Heart, description: "Discrimination, civil rights" },
  { id: "criminal", name: "Criminal", icon: Shield, description: "Defense, appeals, records" },
];

const TriageSection = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedArea) {
      navigate(`/case-analysis?area=${selectedArea}`);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Smart Triage</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What's Your Legal Issue?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your area of concern and we'll guide you to the right resources
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          {legalAreas.map((area) => (
            <Card
              key={area.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedArea === area.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => setSelectedArea(area.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedArea === area.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <area.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{area.name}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedArea && (
          <div className="text-center">
            <Button onClick={handleContinue} size="lg" className="group">
              Continue with {legalAreas.find(a => a.id === selectedArea)?.name}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TriageSection;
