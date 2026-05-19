import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileSearch, 
  Calculator, 
  Scale,
  Home,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { states } from "@/lib/states";

const LEGAL_AREAS = [
  "Personal Injury",
  "Medical Malpractice", 
  "Employment Law",
  "Family Law",
  "Contract Dispute",
  "Property Dispute",
  "Insurance Claim",
  "Product Liability",
  "Civil Rights",
  "Other"
];

const DocumentAnalyzerTab = () => {
  const [documentText, setDocumentText] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const analyzeDocument = async () => {
    if (!documentText.trim()) {
      toast({ title: "Please enter document text", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('document-analyzer', {
        body: { documentText, documentType }
      });

      if (error) throw error;
      
      setAnalysis(data.analysis);
      toast({ title: "Document analyzed successfully!" });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({ 
        title: "Analysis failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="docType">Document Type (Optional)</Label>
          <Input 
            id="docType"
            placeholder="e.g., Employment Contract, Lease Agreement, NDA..."
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="docText">Paste Document Text</Label>
          <Textarea 
            id="docText"
            placeholder="Paste the text of your legal document here for analysis..."
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <Button onClick={analyzeDocument} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Document...
            </>
          ) : (
            <>
              <FileSearch className="w-4 h-4 mr-2" />
              Analyze Document
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Analysis Results
            </CardTitle>
            <CardDescription>{analysis.documentType}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>

            {analysis.keyTerms?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Terms</h4>
                <div className="space-y-2">
                  {analysis.keyTerms.map((term: any, i: number) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{term.term}</span>
                        <Badge variant={term.importance === 'high' ? 'destructive' : 'secondary'}>
                          {term.importance}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.risks?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Identified Risks
                </h4>
                <div className="space-y-2">
                  {analysis.risks.map((risk: any, i: number) => (
                    <div key={i} className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{risk.risk}</span>
                        <Badge variant={risk.severity === 'high' ? 'destructive' : 'outline'}>
                          {risk.severity}
                        </Badge>
                      </div>
                      {risk.mitigation && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.actionItems?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Action Items</h4>
                <ul className="space-y-1">
                  {analysis.actionItems.map((item: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>{item.action}</span>
                      <Badge variant="outline">{item.priority}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg text-sm">
              <strong>Disclaimer:</strong> {analysis.legalDisclaimer}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const SettlementCalculatorTab = () => {
  const [formData, setFormData] = useState({
    caseType: "",
    state: "",
    description: "",
    damages: "",
    factors: ""
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const calculateSettlement = async () => {
    if (!formData.caseType || !formData.state || !formData.description) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setIsCalculating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('settlement-calculator', {
        body: formData
      });

      if (error) throw error;
      
      setResult(data.analysis);
      toast({ title: "Settlement estimate calculated!" });
    } catch (error: any) {
      console.error('Calculation error:', error);
      toast({ 
        title: "Calculation failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="caseType">Case Type *</Label>
            <Select value={formData.caseType} onValueChange={(v) => setFormData(p => ({...p, caseType: v}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {LEGAL_AREAS.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(v) => setFormData(p => ({...p, state: v}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Case Description *</Label>
          <Textarea 
            id="description"
            placeholder="Describe your case, including what happened, injuries sustained, and impact on your life..."
            value={formData.description}
            onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
            className="min-h-[120px]"
          />
        </div>
        <div>
          <Label htmlFor="damages">Claimed Damages (Optional)</Label>
          <Input 
            id="damages"
            placeholder="e.g., $50,000 medical bills, $20,000 lost wages..."
            value={formData.damages}
            onChange={(e) => setFormData(p => ({...p, damages: e.target.value}))}
          />
        </div>
        <div>
          <Label htmlFor="factors">Additional Factors (Optional)</Label>
          <Textarea 
            id="factors"
            placeholder="Any other relevant information: witnesses, police reports, prior injuries, etc."
            value={formData.factors}
            onChange={(e) => setFormData(p => ({...p, factors: e.target.value}))}
          />
        </div>
        <Button onClick={calculateSettlement} disabled={isCalculating} className="w-full">
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating Estimate...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Settlement Estimate
            </>
          )}
        </Button>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Settlement Estimate
            </CardTitle>
            <Badge variant={result.confidenceLevel === 'high' ? 'default' : 'secondary'}>
              {result.confidenceLevel} confidence
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.settlementRange && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Low Estimate</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.settlementRange.low)}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <p className="text-sm text-muted-foreground">Most Likely</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(result.settlementRange.mid)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">High Estimate</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(result.settlementRange.high)}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Methodology</h4>
              <p className="text-muted-foreground text-sm">{result.methodology}</p>
            </div>

            {result.comparableCases?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Comparable Cases</h4>
                <div className="space-y-2">
                  {result.comparableCases.slice(0, 3).map((c: any, i: number) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="font-medium">{c.caseDescription}</p>
                      <p className="text-muted-foreground">
                        Outcome: {c.outcome} ({c.state}, {c.year})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.stateSpecificNotes && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <h4 className="font-semibold mb-1">{formData.state} Specific Notes</h4>
                <p className="text-sm text-muted-foreground">{result.stateSpecificNotes}</p>
              </div>
            )}

            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg text-sm">
              <strong>Disclaimer:</strong> {result.disclaimer || "This is an educational estimate only. Actual settlements vary based on specific case facts. Consult with a qualified attorney."}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AIToolsInteractive = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Scale className="w-6 h-6" />
              <span className="font-bold text-lg">A.I. ANAL</span>
            </Link>
            <div className="flex gap-2">
              <Button asChild variant="secondary" size="sm">
                <Link to="/ai-tools">
                  View All Tools
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Legal Tools</h1>
            <p className="text-muted-foreground">
              Powered by AI to help you understand your legal documents and estimate case outcomes
            </p>
          </div>

          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Document Analyzer
              </TabsTrigger>
              <TabsTrigger value="settlement" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Settlement Calculator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Analyzer</CardTitle>
                  <CardDescription>
                    Paste your legal document text to get AI-powered analysis of key terms, risks, and action items.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentAnalyzerTab />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settlement" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settlement Calculator</CardTitle>
                  <CardDescription>
                    Get an AI-powered estimate of potential settlement ranges based on your case details and comparable cases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SettlementCalculatorTab />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t mt-auto">
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

export default AIToolsInteractive;
