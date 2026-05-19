import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  FileText,
  Calculator,
  Languages,
  Route,
  FolderOpen,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    category: "Location Services",
    title: "Court & Tribunal Locator",
    description: "Find the right location by ZIP code with filing details and contact information.",
  },
  {
    icon: FileText,
    category: "Form Automation",
    title: "Auto-Filled Forms",
    description: "Smart form completion with guided checklists and guardrails to avoid common errors.",
  },
  {
    icon: Calculator,
    category: "Case Analysis",
    title: "Merit Score (1-100)",
    description: "Reality-check your position based on facts, law, and precedent. Know your chances.",
  },
  {
    icon: Languages,
    category: "Translation",
    title: "Plain-Language Explanations",
    description: "Legal sections translated into everyday language. No more confusing legalese.",
  },
  {
    icon: Route,
    category: "Process Guidance",
    title: "Step-by-Step Timelines",
    description: "From start to hearing, including serve/file instructions and important deadlines.",
  },
  {
    icon: FolderOpen,
    category: "Document Tools",
    title: "Evidence Management",
    description: "Organize documents and create clean, professional bundles for submission.",
  },
];

const FeatureGrid = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Navigate the Legal System
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From initial assessment to final submission, A.I. ANAL guides you through every step with tools designed to simplify complex legal processes.
          </p>
          
          <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground max-w-2xl mx-auto text-left">
            "In a government of laws, existence of the government will be imperiled if it fails to observe the law scrupulously."
            <footer className="text-sm mt-2 not-italic">— Louis D. Brandeis, U.S. Supreme Court Justice</footer>
          </blockquote>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit mb-2">{feature.category}</Badge>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block max-w-2xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Built for Self-Represented Litigants</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A.I. ANAL was designed specifically for people navigating the legal system without a lawyer. We focus on practical tools and clear guidance, not legal jargon.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Mobile-optimized for use anywhere</Badge>
                <Badge variant="secondary">All 50 states covered</Badge>
                <Badge variant="secondary">English & Spanish</Badge>
                <Badge variant="secondary">Affordable pricing</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
