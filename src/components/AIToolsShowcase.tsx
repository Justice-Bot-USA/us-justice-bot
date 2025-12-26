import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calculator, 
  FileText, 
  Shield, 
  RefreshCw, 
  ScanLine 
} from "lucide-react";

const tools = [
  {
    icon: Search,
    name: "AI Case Law Search",
    description: "Searches CourtListener & legal databases for relevant precedents",
  },
  {
    icon: Calculator,
    name: "Smart Merit Calculator",
    description: "AI analyzes your case strength with real case law",
  },
  {
    icon: FileText,
    name: "100+ Official Forms",
    description: "Pre-filled with AI for all 50 states - family, housing, employment & more",
  },
  {
    icon: Shield,
    name: "Bank-Level Security",
    description: "Encrypted data with strict access controls",
  },
  {
    icon: RefreshCw,
    name: "Auto-Updated Daily",
    description: "Sweeps for new laws and case updates automatically",
  },
  {
    icon: ScanLine,
    name: "Evidence Analysis",
    description: "OCR scanning extracts key facts from your documents",
  },
];

const AIToolsShowcase = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">Powered by AI</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Legal Tools That Actually Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The same research power lawyers use — now accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Badge variant="outline" className="text-destructive border-destructive">
            Limited spots available this month — Only 15 spots left for new cases
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default AIToolsShowcase;
