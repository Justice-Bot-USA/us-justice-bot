import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Scale, Clock, DollarSign, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { US_STATES } from "@/lib/states";
import { legalAreaData } from "@/lib/legalAreaData";

const LegalAreaPage = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const areaData = areaId ? legalAreaData[areaId] : null;

  if (!areaData) {
    return (
      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Legal Area Not Found</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const Icon = areaData.icon;
  const stateGuidance = selectedState ? areaData.stateGuidance[selectedState] : null;

  // Related areas for cross-linking (exclude current)
  const relatedAreaIds = Object.keys(legalAreaData)
    .filter(id => id !== areaId && !["federal"].includes(id))
    .slice(0, 5);

  const selectedStateLabel = US_STATES.find(s => s.value === selectedState)?.label ?? "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${areaData.title} Help by State — Veritas Path`}
        description={`Free state-specific guidance for ${areaData.title.toLowerCase()} cases: forms, deadlines, fees, and key laws for all 50 states. Powered by Justice-Bot.`}
        keywords={`${areaData.title.toLowerCase()}, ${areaData.keywords.join(", ")}, legal help by state, self-help legal`}
      />
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/legal-areas" className="hover:text-foreground transition-colors">Legal Areas</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{areaData.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-primary/20 rounded-xl">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{areaData.title}</h1>
                {areaData.badge && (
                  <Badge variant={areaData.badge.variant as any}>{areaData.badge.text}</Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-4">{areaData.description}</p>
              <div className="flex flex-wrap gap-2">
                {areaData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* State Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Select Your State for Specific Guidance
            </CardTitle>
            <CardDescription>
              Laws vary significantly by state. Select your state to see relevant forms, deadlines, and procedures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Choose your state..." />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* State-Specific Guidance */}
        {stateGuidance && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Required Forms in {US_STATES.find(s => s.value === selectedState)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {stateGuidance.forms.map((form, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <FileText className="w-4 h-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{form.name}</p>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                        {form.url && (
                          <a 
                            href={form.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            Download Form <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Important Deadlines & Statutes of Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {stateGuidance.deadlines.map((deadline, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-4 h-4 text-destructive mt-1" />
                      <div>
                        <p className="font-medium">{deadline.name}</p>
                        <p className="text-sm text-muted-foreground">{deadline.timeframe}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Filing Fees & Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {stateGuidance.fees.map((fee, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{fee.name}</p>
                        <p className="text-sm text-muted-foreground">{fee.amount}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Key State Laws
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {stateGuidance.laws.map((law, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Scale className="w-4 h-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{law.name}</p>
                        <p className="text-sm text-muted-foreground">{law.summary}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Common Topics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Common {areaData.title} Topics</CardTitle>
            <CardDescription>Click on a topic to get specific guidance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {areaData.commonTopics.map((topic) => (
                <Button 
                  key={topic}
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => navigate(`/case-analysis?area=${areaId}&topic=${encodeURIComponent(topic)}&state=${selectedState}`)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground mb-8">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Analyze Your {areaData.title} Case?</h2>
            <p className="mb-6 opacity-90">
              Get AI-powered legal analysis, find the right forms, and understand your options.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(`/case-analysis?area=${areaId}&state=${selectedState}`)}
              >
                Start Case Analysis
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/ai-tools")}
              >
                Explore AI Tools
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Legal Areas — boosts internal linking & crawlability */}
        <section aria-labelledby="related-areas-heading" className="mb-8">
          <h2 id="related-areas-heading" className="text-xl font-semibold mb-4">Explore Related Legal Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {relatedAreaIds.map((id) => {
              const area = legalAreaData[id];
              if (!area) return null;
              const AreaIcon = area.icon;
              return (
                <Link
                  key={id}
                  to={`/legal-areas/${id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent transition-colors text-center"
                >
                  <AreaIcon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium leading-tight">{area.title}</span>
                </Link>
              );
            })}
            <Link
              to="/legal-areas"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent transition-colors text-center"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium leading-tight">All Legal Areas</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LegalAreaPage;

