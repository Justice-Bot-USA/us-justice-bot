import { FileText, Brain, Shield, Clock, Scale, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "State-Specific Forms",
    description: "Access court forms for all 50 states with exact form numbers and official court URLs.",
  },
  {
    icon: Brain,
    title: "AI Case Analysis",
    description: "Get instant merit scores and legal pathway recommendations powered by advanced AI.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level encryption protects your sensitive legal information at all times.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access legal guidance anytime, anywhere. No appointments needed.",
  },
  {
    icon: Scale,
    title: "Expert Guidance",
    description: "Step-by-step instructions for filing, deadlines, and procedures.",
  },
  {
    icon: Users,
    title: "All Legal Areas",
    description: "Family law, small claims, employment, housing, human rights, and more.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Your Legal Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you navigate the legal system with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
