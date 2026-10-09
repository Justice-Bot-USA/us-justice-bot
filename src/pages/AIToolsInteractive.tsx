import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileSearch, 
  Scale,
  Home,
  Loader2,
  CheckCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

            {analysis.actionItems?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">What the document says must be done</h4>
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

const AIToolsInteractive = () => {
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
              Plain-language explanations of your legal documents
            </p>
          </div>

          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Document Analyzer
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="document" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Analyzer</CardTitle>
                  <CardDescription>
                    Paste your legal document text to get a plain-language summary of its key terms, dates and stated deadlines.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentAnalyzerTab />
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
