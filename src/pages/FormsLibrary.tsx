import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Download, 
  FileText, 
  Heart, 
  DollarSign, 
  Briefcase, 
  Home, 
  Shield, 
  Scale,
  CheckCircle,
  Info,
  Building2,
  Baby,
  HandHeart,
  ClipboardList,
  Users
} from 'lucide-react';
import { states, stateAbbreviations } from '@/lib/states';
import { getStateFormsData, stateCourtWebsites, legalAreaCategories, CourtForm, federalCourtForms, federalCourtInfo } from '@/lib/formsLibraryData';

const categoryIcons: Record<string, React.ReactNode> = {
  "family": <Heart className="h-5 w-5" />,
  "small-claims": <DollarSign className="h-5 w-5" />,
  "employment": <Briefcase className="h-5 w-5" />,
  "housing": <Home className="h-5 w-5" />,
  "criminal": <Shield className="h-5 w-5" />,
  "federal": <Scale className="h-5 w-5" />,
  "general": <FileText className="h-5 w-5" />,
  "cps": <Baby className="h-5 w-5" />,
  "workers-rights": <Users className="h-5 w-5" />,
  "human-rights": <HandHeart className="h-5 w-5" />,
  "agency-complaints": <ClipboardList className="h-5 w-5" />,
};

export default function FormsLibrary() {
  const [selectedState, setSelectedState] = useState<string>('CA');
  const [selectedCategory, setSelectedCategory] = useState<string>('family');
  const [searchQuery, setSearchQuery] = useState('');

  const stateData = useMemo(() => getStateFormsData(selectedState), [selectedState]);
  const stateInfo = stateCourtWebsites[selectedState];

  const filteredForms = useMemo(() => {
    // For federal category, use federal forms instead of state forms
    if (selectedCategory === 'federal') {
      if (!searchQuery.trim()) return federalCourtForms;
      const query = searchQuery.toLowerCase();
      return federalCourtForms.filter(form => 
        form.name.toLowerCase().includes(query) ||
        form.formNumber.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query) ||
        form.category.toLowerCase().includes(query)
      );
    }
    
    const categoryForms = stateData.forms[selectedCategory] || [];
    if (!searchQuery.trim()) return categoryForms;
    
    const query = searchQuery.toLowerCase();
    return categoryForms.filter(form => 
      form.name.toLowerCase().includes(query) ||
      form.formNumber.toLowerCase().includes(query) ||
      form.description.toLowerCase().includes(query) ||
      form.category.toLowerCase().includes(query)
    );
  }, [stateData, selectedCategory, searchQuery]);

  const hasDetailedData = selectedCategory === 'federal' || ['CA', 'TX', 'NY', 'FL', 'IL'].includes(selectedState);
  const isFederalCategory = selectedCategory === 'federal';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${stateInfo?.name || 'State'} Court Forms Library - US Justice Bot`}
        description={`Access official court forms for ${stateInfo?.name || 'your state'}. Family law, small claims, employment, housing, and criminal defense forms with direct links to official court websites.`}
        keywords={`${stateInfo?.name} court forms, legal forms, divorce forms, small claims forms, eviction forms, court documents, fee waiver forms`}
        url={`https://justicebot-usa.com/forms-library`}
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Court Forms Library</h1>
              <p className="text-primary-foreground/80">Official court forms for all 50 states</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* State & Search Selection */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Your State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {states.map((state) => {
                      const abbr = stateAbbreviations[state] || state;
                      const hasDetailed = ['CA', 'TX', 'NY', 'FL', 'IL'].includes(abbr);
                      return (
                        <SelectItem key={abbr} value={abbr}>
                          {state} {hasDetailed && '✓'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search Forms</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by form name, number, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State/Federal Info Banner */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">
                    {isFederalCategory ? 'Federal Courts' : `${stateInfo?.name || 'State'} Courts`}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {isFederalCategory 
                      ? 'Federal court forms apply nationwide for U.S. District Courts'
                      : hasDetailedData 
                        ? 'Detailed forms with official court links available'
                        : 'Basic form templates - visit state court website for official forms'
                    }
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isFederalCategory ? (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <a href={federalCourtInfo.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        US Courts
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={federalCourtInfo.pacer} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        PACER
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={federalCourtInfo.findCourt} target="_blank" rel="noopener noreferrer">
                        <Search className="h-4 w-4 mr-2" />
                        Find Court
                      </a>
                    </Button>
                  </>
                ) : (
                  <>
                    {stateData.courtWebsite && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={stateData.courtWebsite} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          State Courts
                        </a>
                      </Button>
                    )}
                    {stateData.selfHelpUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={stateData.selfHelpUrl} target="_blank" rel="noopener noreferrer">
                          <Info className="h-4 w-4 mr-2" />
                          Self-Help Center
                        </a>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            {!hasDetailedData && !isFederalCategory && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Detailed forms data is available for CA, TX, NY, FL, and IL. 
                  For other states, please visit the official court website above for specific form numbers and requirements.
                </p>
              </div>
            )}
            {isFederalCategory && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Federal Forms:</strong> These forms are used in U.S. District Courts nationwide. 
                  Some district courts have local forms - check your specific court's website for local requirements.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
            {legalAreaCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 border"
              >
                {categoryIcons[category.id]}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {legalAreaCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {/* Forms Grid */}
              {filteredForms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredForms.map((form, index) => (
                    <FormCard key={`${form.formNumber}-${index}`} form={form} hasDetailedData={hasDetailedData} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Forms Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No forms matching "${searchQuery}" in ${category.name}`
                      : `No ${category.name} forms available for this state`
                    }
                  </p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Need Help With Your Forms?
            </CardTitle>
            <CardDescription>
              Our AI-powered tools can help you understand which forms you need and how to fill them out correctly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/case-analysis">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Case Analysis</span>
                  <span className="text-xs text-muted-foreground">Get personalized form recommendations</span>
                </Button>
              </Link>
              <Link to="/ai-tools/use">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Search className="h-6 w-6" />
                  <span className="font-medium">Document Analyzer</span>
                  <span className="text-xs text-muted-foreground">Analyze your legal documents</span>
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Info className="h-6 w-6" />
                  <span className="font-medium">Get Support</span>
                  <span className="text-xs text-muted-foreground">Contact our support team</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Form Card Component
function FormCard({ form, hasDetailedData }: { form: CourtForm; hasDetailedData: boolean }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="mb-2 text-xs">
              {form.formNumber}
            </Badge>
            <CardTitle className="text-base leading-tight">{form.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm">{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {form.category}
          </Badge>
          {form.feeAmount && (
            <Badge variant={form.feeAmount === 'Free' ? 'default' : 'outline'} className="text-xs">
              {form.feeAmount}
            </Badge>
          )}
          {form.feeWaiverAvailable && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Fee Waiver Available
            </Badge>
          )}
        </div>
        
        {form.url && hasDetailedData ? (
          <Button variant="default" size="sm" className="w-full" asChild>
            <a href={form.url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download Form
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full" disabled={!form.url}>
            <FileText className="h-4 w-4 mr-2" />
            {form.url ? 'View Form' : 'Check State Court Website'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
