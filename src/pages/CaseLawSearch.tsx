import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Search, Scale, FileText, Upload, BookOpen, Gavel, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analytics } from "@/hooks/useAnalytics";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "Federal"
];

const LEGAL_AREAS = [
  { value: "criminal-defense", label: "Criminal Defense", category: "criminal" },
  { value: "dui-dwi", label: "DUI/DWI Defense", category: "criminal" },
  { value: "drug-crimes", label: "Drug Crimes", category: "criminal" },
  { value: "theft-burglary", label: "Theft & Burglary", category: "criminal" },
  { value: "assault-battery", label: "Assault & Battery", category: "criminal" },
  { value: "domestic-violence", label: "Domestic Violence", category: "criminal" },
  { value: "white-collar", label: "White Collar Crimes", category: "criminal" },
  { value: "sex-crimes", label: "Sex Crimes Defense", category: "criminal" },
  { value: "juvenile", label: "Juvenile Defense", category: "criminal" },
  { value: "family-law", label: "Family Law", category: "civil" },
  { value: "divorce", label: "Divorce & Separation", category: "civil" },
  { value: "child-custody", label: "Child Custody", category: "civil" },
  { value: "child-support", label: "Child Support", category: "civil" },
  { value: "personal-injury", label: "Personal Injury", category: "civil" },
  { value: "medical-malpractice", label: "Medical Malpractice", category: "civil" },
  { value: "employment-law", label: "Employment Law", category: "civil" },
  { value: "wrongful-termination", label: "Wrongful Termination", category: "civil" },
  { value: "discrimination", label: "Discrimination", category: "civil" },
  { value: "housing-eviction", label: "Housing & Eviction", category: "civil" },
  { value: "landlord-tenant", label: "Landlord-Tenant", category: "civil" },
  { value: "small-claims", label: "Small Claims", category: "civil" },
  { value: "contract-disputes", label: "Contract Disputes", category: "civil" },
  { value: "civil-rights", label: "Civil Rights", category: "civil" },
  { value: "immigration", label: "Immigration", category: "civil" },
  { value: "bankruptcy", label: "Bankruptcy", category: "civil" },
  { value: "probate-estate", label: "Probate & Estate", category: "civil" },
];

interface CasePrecedent {
  caseName: string;
  citation: string;
  year: string;
  court: string;
  relevance: string;
  keyHolding: string;
  applicability: string;
  jurisdiction: string;
}

interface SearchResults {
  precedents: CasePrecedent[];
  legalPrinciples: string[];
  relevantStatutes: string[];
  searchSummary: string;
  recommendedStrategy: string;
}

const CaseLawSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [state, setState] = useState("");
  const [legalArea, setLegalArea] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Track document uploads
      newFiles.forEach(file => {
        analytics.documentUpload(file.type || 'unknown');
      });
      
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added to your search context.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    if (!state || !legalArea || !caseDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a state, legal area, and describe your case.",
        variant: "destructive",
      });
      return;
    }

    const legalAreaLabel = LEGAL_AREAS.find(a => a.value === legalArea)?.label || legalArea;
    
    // Track case law search
    analytics.caseLawSearch(legalAreaLabel, state);

    setIsSearching(true);
    setResults(null);

    try {
      const legalAreaLabel = LEGAL_AREAS.find(a => a.value === legalArea)?.label || legalArea;
      const legalCategory = LEGAL_AREAS.find(a => a.value === legalArea)?.category || "civil";
      
      const fileContext = uploadedFiles.length > 0 
        ? `\n\nEvidence/Documents provided: ${uploadedFiles.map(f => f.name).join(", ")}`
        : "";

      const { data, error } = await supabase.functions.invoke('case-law-search', {
        body: {
          state,
          legalArea: legalAreaLabel,
          legalCategory,
          caseDescription: caseDescription + fileContext,
        }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Search Complete",
        description: `Found ${data.precedents?.length || 0} relevant case precedents.`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search case law. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Case Law Search</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Find relevant legal precedents, citations, and case law for your situation
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Parameters
                </CardTitle>
                <CardDescription>
                  Provide details about your case to find relevant precedents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Jurisdiction / State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {US_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Legal Area</Label>
                  <Select value={legalArea} onValueChange={setLegalArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal area..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="" disabled>-- Criminal --</SelectItem>
                      {LEGAL_AREAS.filter(a => a.category === "criminal").map(area => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="" disabled>-- Civil --</SelectItem>
                      {LEGAL_AREAS.filter(a => a.category === "civil").map(area => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Case Description</Label>
                  <Textarea
                    placeholder="Describe your case, the facts, key issues, and what you're trying to prove or defend against..."
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Evidence (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                    <Label htmlFor="evidence-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload documents, photos, or evidence
                      </p>
                    </Label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching Case Law...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Precedents
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {!results && !isSearching && (
              <Card className="p-8 text-center">
                <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Search for Case Law</h3>
                <p className="text-muted-foreground">
                  Enter your case details to find relevant legal precedents, court decisions, 
                  and citations that may support your case.
                </p>
              </Card>
            )}

            {isSearching && (
              <Card className="p-8 text-center">
                <Loader2 className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" />
                <h3 className="text-xl font-semibold mb-2">Searching Legal Databases...</h3>
                <p className="text-muted-foreground">
                  Analyzing your case and finding relevant precedents from {state} courts...
                </p>
              </Card>
            )}

            {results && (
              <>
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      Search Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{results.searchSummary}</p>
                  </CardContent>
                </Card>

                {/* Precedents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Relevant Case Precedents
                    </CardTitle>
                    <CardDescription>
                      Found {results.precedents?.length || 0} cases that may be relevant to your situation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-2">
                      {results.precedents?.map((precedent, index) => (
                        <AccordionItem key={index} value={`case-${index}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="text-left">
                              <div className="font-semibold">{precedent.caseName}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Badge variant="outline">{precedent.citation}</Badge>
                                <span>{precedent.court} • {precedent.year}</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-3 pt-2">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Key Holding</h4>
                              <p className="text-sm text-muted-foreground">{precedent.keyHolding}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Relevance to Your Case</h4>
                              <p className="text-sm text-muted-foreground">{precedent.relevance}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">How to Apply</h4>
                              <p className="text-sm text-muted-foreground">{precedent.applicability}</p>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Badge>{precedent.jurisdiction}</Badge>
                              <Button variant="outline" size="sm" className="ml-auto">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Full Case
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Relevant Statutes */}
                {results.relevantStatutes?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Relevant Statutes & Laws
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.relevantStatutes.map((statute, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Scale className="h-4 w-4 mt-1 text-primary shrink-0" />
                            <span className="text-sm">{statute}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Legal Principles */}
                {results.legalPrinciples?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Legal Principles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.legalPrinciples.map((principle, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="text-sm text-muted-foreground">{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Strategy Recommendation */}
                {results.recommendedStrategy && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Gavel className="h-5 w-5" />
                        Recommended Legal Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{results.recommendedStrategy}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Disclaimer */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                      <strong>Disclaimer:</strong> This case law search provides educational information only 
                      and does not constitute legal advice. Case citations should be verified through official 
                      legal databases. Consult a licensed attorney in {state} for your specific situation.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseLawSearch;
