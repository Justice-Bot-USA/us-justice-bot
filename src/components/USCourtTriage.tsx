import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Scale,
  Users,
  Briefcase,
  Heart,
  Shield,
  Plane,
  Building,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tribunals = [
  {
    id: "housing",
    name: "Housing Court",
    description: "Evictions, rent disputes, repairs, security deposits",
    icon: Home,
    examples: ["Eviction defense", "Rent disputes", "Repair issues", "Security deposits"],
  },
  {
    id: "small-claims",
    name: "Small Claims Court",
    description: "Disputes under $10,000 (varies by state)",
    icon: Scale,
    examples: ["Unpaid invoices", "Property damage", "Contract disputes", "Security deposits"],
  },
  {
    id: "eeoc",
    name: "EEOC / Civil Rights",
    description: "Discrimination, harassment, retaliation",
    icon: Heart,
    examples: ["Workplace discrimination", "Housing discrimination", "ADA violations", "Retaliation"],
  },
  {
    id: "family",
    name: "Family Court",
    description: "Divorce, custody, child support, domestic violence",
    icon: Users,
    examples: ["Child custody", "Child support", "Divorce filings", "Protective orders"],
  },
  {
    id: "labor",
    name: "Labor Board / DOL",
    description: "Wage theft, wrongful termination, FMLA",
    icon: Briefcase,
    examples: ["Unpaid wages", "Wrongful termination", "FMLA violations", "Workers' comp"],
  },
  {
    id: "immigration",
    name: "Immigration Court",
    description: "Asylum, deportation defense, visa issues",
    icon: Plane,
    examples: ["Asylum applications", "Deportation defense", "DACA renewals", "Work permits"],
  },
  {
    id: "agency",
    name: "Government Agencies",
    description: "Police complaints, agency misconduct, FOIA",
    icon: Building,
    examples: ["Police complaints", "FOIA requests", "Agency appeals", "Licensing issues"],
  },
];

const USCourtTriage = () => {
  const navigate = useNavigate();
  const [selectedTribunal, setSelectedTribunal] = useState<string | null>(null);
  const [customDescription, setCustomDescription] = useState("");

  const handleStartCase = (tribunalId: string) => {
    navigate(`/case-analysis?area=${tribunalId}`);
  };

  const handleSmartTriage = () => {
    navigate("/case-analysis");
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">AI-Powered Routing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Legal Triage</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us your situation in plain language. We'll map it to the right venue and guide you through the process.
          </p>
          
          <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground max-w-2xl mx-auto text-left">
            "Equal justice under law is not merely a caption on the facade of the Supreme Court building, it is perhaps the most inspiring ideal of our society."
            <footer className="text-sm mt-2 not-italic">— Lewis F. Powell Jr., U.S. Supreme Court Justice</footer>
          </blockquote>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto mb-10">
          {tribunals.map((tribunal) => (
            <Card
              key={tribunal.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                selectedTribunal === tribunal.id ? "ring-2 ring-primary border-primary" : ""
              }`}
              onClick={() => setSelectedTribunal(tribunal.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      selectedTribunal === tribunal.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-primary/10"
                    }`}>
                      <tribunal.icon className={`h-5 w-5 ${
                        selectedTribunal === tribunal.id ? "" : "text-primary"
                      }`} />
                    </div>
                    <h3 className="font-semibold">{tribunal.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tribunal.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                    {tribunal.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {example}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCase(tribunal.id);
                    }}
                  >
                    Start here <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Not Sure Card */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">Not Sure Where to Start?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Describe your legal situation in your own words. Our AI will determine the best venue, recommend forms, and outline your next steps.
              </p>
              <Button onClick={handleSmartTriage} className="mt-auto">
                <Sparkles className="h-4 w-4 mr-2" />
                Start Smart Triage
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Free • No signup required • Results in 2 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default USCourtTriage;
