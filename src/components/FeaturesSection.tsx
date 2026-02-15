import { Search, FileText, Shield, Download, CheckCircle, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const freeFeatures = [
  {
    icon: Search,
    title: "Sex Offender Registry Lookup",
    description: "Search official state registries instantly.",
  },
  {
    icon: Shield,
    title: "Warrant Lookup",
    description: "Check for outstanding warrants in your area.",
  },
  {
    icon: FileText,
    title: "Form Finder",
    description: "Find the official form page for your state and issue.",
  },
  {
    icon: CheckCircle,
    title: "Plain-Language Explanations",
    description: "Understand what results mean — no legal jargon.",
  },
];

const paidFeatures = [
  {
    icon: Download,
    title: "Export Filing Packets (PDF)",
    description: "Prepare and download official filing documents.",
  },
  {
    icon: FileText,
    title: "Autofill Assistance",
    description: "Guided fields help you complete forms accurately.",
  },
  {
    icon: CheckCircle,
    title: "Filing Checklist",
    description: "Step-by-step instructions on where and how to file.",
  },
  {
    icon: Save,
    title: "Save & Re-download",
    description: "Save cases and re-download anytime (subscription).",
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What You Can Do Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free — pay only when you need exports and saved workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                FREE
              </span>
              No account needed
            </h3>
            <div className="space-y-4">
              {freeFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Paid Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                PAID
              </span>
              When you want action + exports
            </h3>
            <div className="space-y-4">
              {paidFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button size="lg" onClick={() => navigate("/warrant-lookup")} className="font-bold">
            Start Free
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="font-bold">
            See Pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
