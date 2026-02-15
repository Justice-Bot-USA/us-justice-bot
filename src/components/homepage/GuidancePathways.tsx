import { useNavigate } from "react-router-dom";
import { Brain, FileSearch, FileText, Building2, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const pathways = [
  {
    icon: Brain,
    title: "Understand My Situation",
    description: "Plain-language explanations of legal and administrative issues facing you or your family.",
    href: "/case-analysis",
  },
  {
    icon: FileSearch,
    title: "Request Official Records",
    description: "FOIA and public-records request preparation — guided, step-by-step.",
    href: "/foia-request-generator",
  },
  {
    icon: FileText,
    title: "Prepare Documents or Letters",
    description: "Guided, informational document generation for courts, agencies, and more.",
    href: "/forms-library",
  },
  {
    icon: Building2,
    title: "Navigate a Court or Agency Process",
    description: "Step-by-step procedural guidance for self-represented individuals.",
    href: "/case-journey",
  },
  {
    icon: GraduationCap,
    title: "Learn My Options",
    description: "Educational pathways to understand what you can do — without legal advice.",
    href: "/ai-tools",
  },
];

const GuidancePathways = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Choose Where You'd Like to Start
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Select the path that fits your situation. Each leads to a guided, step-by-step experience.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((p, i) => (
            <Card
              key={i}
              className="cursor-pointer group hover:shadow-lg hover:border-primary/40 transition-all text-left"
              onClick={() => navigate(p.href)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {p.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {p.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidancePathways;
