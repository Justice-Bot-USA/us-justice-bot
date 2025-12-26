import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, FileSearch, ClipboardList, DollarSign, Calculator, ArrowRight } from "lucide-react";
import { format, addDays, addMonths } from "date-fns";

const quickTools = [
  {
    id: "deadline",
    name: "Deadline Calculator",
    description: "Calculate key filing deadlines based on your situation",
    icon: Calendar,
    badge: "Popular",
  },
  {
    id: "form-finder",
    name: "Form Finder",
    description: "Find exactly which forms you need for your case type",
    icon: FileSearch,
    badge: null,
  },
  {
    id: "checklist",
    name: "Document Checklist",
    description: "Get a personalized checklist of documents to gather",
    icon: ClipboardList,
    badge: null,
  },
  {
    id: "settlement",
    name: "Settlement Estimator",
    description: "Estimate potential settlement ranges for your case",
    icon: DollarSign,
    badge: "New",
  },
];

const deadlineTypes = [
  { value: "eviction-notice", label: "Eviction Notice Response", days: 5 },
  { value: "small-claims", label: "Small Claims Filing", days: 30 },
  { value: "eeoc", label: "EEOC Complaint", days: 180 },
  { value: "wage-claim", label: "Wage Claim", days: 365 },
  { value: "personal-injury", label: "Personal Injury (varies by state)", days: 730 },
];

const QuickLegalTools = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [deadlineType, setDeadlineType] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState<string>("");
  const [calculatedDeadline, setCalculatedDeadline] = useState<string | null>(null);

  const calculateDeadline = () => {
    if (!deadlineType || !incidentDate) return;
    
    const deadline = deadlineTypes.find(d => d.value === deadlineType);
    if (!deadline) return;
    
    const incident = new Date(incidentDate);
    const deadlineDate = addDays(incident, deadline.days);
    setCalculatedDeadline(format(deadlineDate, "MMMM d, yyyy"));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">Free Tools</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Legal Tools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers. No signup required for these free tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-10">
          {quickTools.map((tool) => (
            <Card
              key={tool.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeTool === tool.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {tool.badge && (
                    <Badge variant={tool.badge === "Popular" ? "default" : "secondary"} className="mb-3">
                      {tool.badge}
                    </Badge>
                  )}
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    Use Now <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deadline Calculator Widget */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quick Deadline Calculator
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select your situation and incident date to see your deadline
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What type of deadline?</label>
                <Select value={deadlineType} onValueChange={setDeadlineType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deadline type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deadlineTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">When did it happen?</label>
                <Input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={calculateDeadline} className="w-full" disabled={!deadlineType || !incidentDate}>
              Calculate Deadline
            </Button>

            {calculatedDeadline && (
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Your filing deadline is:</p>
                <p className="text-xl font-bold text-primary">{calculatedDeadline}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  * Deadlines vary by state. Consult local court rules.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuickLegalTools;
