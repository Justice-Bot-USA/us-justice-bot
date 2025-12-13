import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
  Calculator, 
  MapPin, 
  FileText, 
  FolderOpen, 
  ArrowRight, 
  Sparkles,
  Scale,
  Home
} from "lucide-react";

const tools = [
  {
    icon: FileSearch,
    title: "Document Analyzer",
    description: "AI-powered analysis of your legal documents, contracts, and case files. Get instant insights on key terms, potential issues, and recommended actions.",
    features: ["Contract review", "Risk identification", "Key term extraction", "Plain English summaries"],
    status: "Available",
    link: "/case-analysis"
  },
  {
    icon: Calculator,
    title: "Settlement Calculator",
    description: "Estimate potential settlement ranges based on your case type, jurisdiction, and comparable cases. Understand what your claim might be worth.",
    features: ["Case value estimation", "Comparative analysis", "Factor weighting", "Range predictions"],
    status: "Available",
    link: "/case-analysis"
  },
  {
    icon: MapPin,
    title: "Court Locator",
    description: "Find the right court for your case based on your location, case type, and claim amount. Get addresses, contact info, and filing requirements.",
    features: ["Jurisdiction finder", "Court contact info", "Filing requirements", "Hours & directions"],
    status: "Coming Soon",
    link: "#"
  },
  {
    icon: FileText,
    title: "Form Generator",
    description: "Generate state-specific legal forms pre-filled with your case information. Download court-ready documents with proper formatting.",
    features: ["State-specific forms", "Auto-fill capability", "Court formatting", "PDF export"],
    status: "Available",
    link: "/case-analysis"
  },
  {
    icon: FolderOpen,
    title: "Evidence Organizer",
    description: "Upload, organize, and manage your case evidence. Tag documents, create timelines, and build a comprehensive evidence package.",
    features: ["File management", "Evidence tagging", "Timeline creation", "Cloud storage sync"],
    status: "Available",
    link: "/case-analysis"
  }
];

const AITools = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Scale className="w-6 h-6" />
              <span className="font-bold text-lg">US Justice Bot</span>
            </Link>
            <Button asChild variant="secondary" size="sm">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Legal Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Legal AI Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to help you navigate the legal system. 
            Analyze documents, calculate settlements, find courts, and generate forms—all in one place.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge 
                      variant={tool.status === "Available" ? "default" : "secondary"}
                      className={tool.status === "Available" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                    >
                      {tool.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="grid grid-cols-2 gap-2">
                      {tool.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {tool.status === "Available" ? (
                      <Button asChild className="w-full group/btn">
                        <Link to={tool.link}>
                          Use Tool
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our AI-powered tools are here to help you understand your legal situation 
            and take the right steps forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/case-analysis">
                Start Case Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            These AI tools provide educational information only and do not constitute legal advice. 
            For specific legal matters, please consult a licensed attorney.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AITools;
