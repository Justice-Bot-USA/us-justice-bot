import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
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
    description: "Plain-language explanations of your legal documents, contracts, and case files: key terms, parties, dates, and the deadlines the document states.",
    features: ["Key term extraction", "Parties and obligations", "Dates and stated deadlines", "Plain English summaries"],
    status: "Available",
    link: "/ai-tools/use"
  },
  {
    icon: MapPin,
    title: "Court Locator",
    description: "Find courts and court self-help centers near you, with addresses, contact info, and general filing information.",
    features: ["Self-help centers", "Court contact info", "General filing information", "Hours & directions"],
    status: "Coming Soon",
    link: "#"
  },
  {
    icon: FileText,
    title: "Official Form Filling",
    description: "In California and New York, fill in official court forms with your own answers and download the PDF. You review, sign, and file it yourself. Other states coming soon.",
    features: ["Official CA & NY forms", "Plain-language instructions", "Your own answers", "PDF download"],
    status: "Available",
    link: "/forms-library"
  },
  {
    icon: FolderOpen,
    title: "Evidence Upload & Summary",
    description: "Upload your documents with your story and get a plain-language summary of your situation, built from what you tell us. Not legal advice.",
    features: ["Document upload", "Plain-language summary", "Saved with your case", "Links to official sources"],
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
              <span className="font-bold text-lg">Justice Bot USA</span>
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
            Understand documents, organize your evidence, and fill in official forms—all in one place.
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
            Our AI-powered tools can help you understand your legal situation and find
            official forms and resources. They do not give legal advice.
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
            These AI tools provide educational information only and do not constitute legal advice. AI answers can be
            wrong, and our content has not yet been reviewed by a licensed attorney. For specific legal matters, please
            consult a licensed attorney.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AITools;
