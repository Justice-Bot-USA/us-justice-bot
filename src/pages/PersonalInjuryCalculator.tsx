import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calculator, 
  Scale,
  Home,
  Loader2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Phone,
  Car,
  HardHat,
  Heart,
  Stethoscope,
  Bone,
  Brain,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { states } from "@/lib/states";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const INJURY_TYPES = [
  { value: "car-accident", label: "Car Accident", icon: Car },
  { value: "slip-fall", label: "Slip and Fall", icon: AlertTriangle },
  { value: "workplace", label: "Workplace Injury", icon: HardHat },
  { value: "medical-malpractice", label: "Medical Malpractice", icon: Stethoscope },
  { value: "dog-bite", label: "Dog Bite", icon: Heart },
  { value: "product-liability", label: "Product Liability", icon: FileText },
  { value: "wrongful-death", label: "Wrongful Death", icon: Heart },
  { value: "other", label: "Other Injury", icon: Bone },
];

const INJURY_SEVERITY = [
  { value: "minor", label: "Minor (bruises, strains, minor cuts)", multiplier: "1-2x" },
  { value: "moderate", label: "Moderate (fractures, sprains, whiplash)", multiplier: "2-3x" },
  { value: "severe", label: "Severe (surgery required, long recovery)", multiplier: "3-5x" },
  { value: "permanent", label: "Permanent disability or disfigurement", multiplier: "5-10x+" },
  { value: "catastrophic", label: "Catastrophic (paralysis, TBI, death)", multiplier: "10x+" },
];

const FAQ_DATA = [
  {
    question: "How is a personal injury settlement calculated?",
    answer: "Personal injury settlements are typically calculated using medical expenses as a base, then applying a multiplier (1-5x or more) based on injury severity, plus lost wages, property damage, and pain and suffering. Factors like liability clarity, insurance limits, and jurisdiction also affect the final amount."
  },
  {
    question: "How long does it take to settle a personal injury case?",
    answer: "Most personal injury cases settle within 6-18 months. Simple cases with clear liability may settle in 3-6 months, while complex cases involving serious injuries, disputed liability, or litigation can take 2-3 years or more."
  },
  {
    question: "What is the average personal injury settlement amount?",
    answer: "Average settlements vary widely: minor injuries typically settle for $10,000-$25,000, moderate injuries for $50,000-$100,000, severe injuries for $100,000-$500,000, and catastrophic injuries can exceed $1 million. Your specific case depends on many factors."
  },
  {
    question: "Do I need a lawyer for a personal injury claim?",
    answer: "While you can handle minor claims yourself, an attorney is recommended for moderate to severe injuries. Studies show represented claimants typically receive 3-4x higher settlements, even after attorney fees. Our calculator helps you understand your case value first."
  },
  {
    question: "What damages can I claim in a personal injury case?",
    answer: "You can claim economic damages (medical bills, lost wages, property damage, future medical costs) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment of life). Some states also allow punitive damages for egregious conduct."
  }
];

const PersonalInjuryCalculator = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [formData, setFormData] = useState({
    injuryType: "",
    severity: "",
    state: "",
    description: "",
    medicalBills: "",
    lostWages: "",
    ongoingTreatment: false,
    permanentInjury: false,
    clearLiability: false,
    hasWitnesses: false,
    policeReport: false,
    priorInjuries: false,
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const calculateSettlement = async () => {
    if (!formData.injuryType || !formData.state || !formData.description) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setIsCalculating(true);
    setResult(null);

    // Build comprehensive case description for AI
    const fullDescription = `
Injury Type: ${INJURY_TYPES.find(t => t.value === formData.injuryType)?.label || formData.injuryType}
Severity: ${INJURY_SEVERITY.find(s => s.value === formData.severity)?.label || formData.severity}
State: ${formData.state}
Description: ${formData.description}
Medical Bills: ${formData.medicalBills || "Not specified"}
Lost Wages: ${formData.lostWages || "Not specified"}
Ongoing Treatment Needed: ${formData.ongoingTreatment ? "Yes" : "No"}
Permanent Injury: ${formData.permanentInjury ? "Yes" : "No"}
Clear Liability: ${formData.clearLiability ? "Yes" : "No or Uncertain"}
Witnesses Available: ${formData.hasWitnesses ? "Yes" : "No"}
Police Report Filed: ${formData.policeReport ? "Yes" : "No"}
Prior Injuries to Same Area: ${formData.priorInjuries ? "Yes" : "No"}
    `.trim();

    try {
      const { data, error } = await supabase.functions.invoke('settlement-calculator', {
        body: {
          caseType: "Personal Injury",
          state: formData.state,
          description: fullDescription,
          damages: `Medical: ${formData.medicalBills || "Unknown"}, Lost Wages: ${formData.lostWages || "Unknown"}`,
          factors: `Severity: ${formData.severity}, Type: ${formData.injuryType}`
        }
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

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Personal Injury Settlement Calculator",
    "description": "Free AI-powered tool to estimate your personal injury settlement value. Calculate car accident, slip and fall, workplace injury claims instantly.",
    "url": "https://justicebot-usa.com/injury-settlement-calculator",
    "applicationCategory": "Legal",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": "A.I. ANAL",
      "url": "https://justicebot-usa.com"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your Personal Injury Settlement",
    "description": "Step-by-step guide to estimating your personal injury case value",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select Injury Type",
        "text": "Choose the type of accident or injury (car accident, slip and fall, workplace injury, etc.)"
      },
      {
        "@type": "HowToStep",
        "name": "Rate Injury Severity",
        "text": "Indicate the severity of your injuries from minor to catastrophic"
      },
      {
        "@type": "HowToStep",
        "name": "Enter Financial Details",
        "text": "Input your medical bills, lost wages, and other damages"
      },
      {
        "@type": "HowToStep",
        "name": "Describe Your Case",
        "text": "Provide details about how the injury occurred and its impact on your life"
      },
      {
        "@type": "HowToStep",
        "name": "Get Your Estimate",
        "text": "Our AI analyzes comparable cases in your state to provide a settlement range"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Personal Injury Settlement Calculator | Free AI Case Value Estimator</title>
        <meta name="description" content="Free personal injury settlement calculator. Estimate your car accident, slip and fall, or workplace injury case value. AI-powered with state-specific analysis." />
        <meta name="keywords" content="personal injury calculator, settlement calculator, car accident settlement, slip and fall settlement, injury claim value, how much is my case worth, personal injury lawsuit calculator, accident settlement estimator" />
        <link rel="canonical" href="https://justicebot-usa.com/injury-settlement-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Personal Injury Settlement Calculator | Free Case Value Estimate" />
        <meta property="og:description" content="Calculate your personal injury settlement in minutes. Free AI-powered tool for car accidents, slip and fall, workplace injuries." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justicebot-usa.com/injury-settlement-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Injury Settlement Calculator" />
        <meta name="twitter:description" content="Free tool to estimate your injury settlement value. Car accidents, slip & fall, workplace injuries." />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Free AI-Powered Tool</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Personal Injury Settlement Calculator
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Get a free estimate of your personal injury case value in minutes. 
                Our AI analyzes thousands of comparable cases to provide state-specific settlement ranges.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl border-2">
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary rounded-lg">
                      <Calculator className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Calculate Your Settlement</CardTitle>
                      <CardDescription>Enter your case details for a personalized estimate</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Injury Type Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Type of Injury *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {INJURY_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = formData.injuryType === type.value;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setFormData(p => ({...p, injuryType: type.value}))}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected 
                                  ? 'border-primary bg-primary/10 shadow-md' 
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                            >
                              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                                {type.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Severity & State Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base font-semibold mb-2 block">Injury Severity *</Label>
                        <Select 
                          value={formData.severity} 
                          onValueChange={(v) => setFormData(p => ({...p, severity: v}))}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {INJURY_SEVERITY.map(sev => (
                              <SelectItem key={sev.value} value={sev.value}>
                                <div className="flex items-center justify-between w-full gap-2">
                                  <span>{sev.label}</span>
                                  <Badge variant="outline" className="ml-2">{sev.multiplier}</Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-base font-semibold mb-2 block">State Where Injury Occurred *</Label>
                        <Select 
                          value={formData.state} 
                          onValueChange={(v) => setFormData(p => ({...p, state: v}))}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {states.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Total Medical Bills
                        </Label>
                        <Input 
                          placeholder="e.g., $15,000"
                          value={formData.medicalBills}
                          onChange={(e) => setFormData(p => ({...p, medicalBills: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Lost Wages
                        </Label>
                        <Input 
                          placeholder="e.g., $5,000"
                          value={formData.lostWages}
                          onChange={(e) => setFormData(p => ({...p, lostWages: e.target.value}))}
                        />
                      </div>
                    </div>

                    {/* Case Description */}
                    <div>
                      <Label className="text-base font-semibold mb-2 block">Describe Your Case *</Label>
                      <Textarea 
                        placeholder="Describe what happened, your injuries, treatment received, and how this has affected your life..."
                        value={formData.description}
                        onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
                        className="min-h-[120px]"
                      />
                    </div>

                    {/* Case Factors Checkboxes */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <Label className="text-base font-semibold mb-3 block">Case Strength Factors</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: 'clearLiability', label: 'Clear liability (other party at fault)' },
                          { key: 'hasWitnesses', label: 'Witnesses available' },
                          { key: 'policeReport', label: 'Police/incident report filed' },
                          { key: 'ongoingTreatment', label: 'Ongoing medical treatment' },
                          { key: 'permanentInjury', label: 'Permanent injury/scarring' },
                          { key: 'priorInjuries', label: 'Prior injuries to same area' },
                        ].map(factor => (
                          <div key={factor.key} className="flex items-center space-x-2">
                            <Checkbox 
                              id={factor.key}
                              checked={formData[factor.key as keyof typeof formData] as boolean}
                              onCheckedChange={(checked) => 
                                setFormData(p => ({...p, [factor.key]: checked}))
                              }
                            />
                            <label htmlFor={factor.key} className="text-sm cursor-pointer">
                              {factor.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <Button 
                      onClick={calculateSettlement} 
                      disabled={isCalculating} 
                      className="w-full py-6 text-lg"
                      size="lg"
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing Your Case...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-5 h-5 mr-2" />
                          Calculate My Settlement Estimate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              {result && (
                <Card className="mt-8 shadow-xl border-2 border-primary/20">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Your Settlement Estimate
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={result.confidenceLevel === 'high' ? 'default' : 'secondary'}>
                        {result.confidenceLevel} confidence
                      </Badge>
                      <Badge variant="outline">{formData.state}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {result.settlementRange && (
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                          <p className="text-sm text-muted-foreground font-medium">Low Estimate</p>
                          <p className="text-2xl md:text-3xl font-bold text-orange-600">{formatCurrency(result.settlementRange.low)}</p>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                          <p className="text-sm text-muted-foreground font-medium">Most Likely</p>
                          <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(result.settlementRange.mid)}</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                          <p className="text-sm text-muted-foreground font-medium">High Estimate</p>
                          <p className="text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(result.settlementRange.high)}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Analysis Methodology</h4>
                      <p className="text-muted-foreground text-sm">{result.methodology}</p>
                    </div>

                    {result.comparableCases?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Similar Cases in Your Area</h4>
                        <div className="space-y-2">
                          {result.comparableCases.slice(0, 3).map((c: any, i: number) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg text-sm border">
                              <p className="font-medium">{c.caseDescription}</p>
                              <p className="text-muted-foreground mt-1">
                                <span className="text-primary font-semibold">{c.outcome}</span> • {c.state}, {c.year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.stateSpecificNotes && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          {formData.state} Law Considerations
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.stateSpecificNotes}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
                      <h4 className="font-bold text-lg mb-2">Ready to Take the Next Step?</h4>
                      <p className="text-muted-foreground mb-4">
                        Get a complete case analysis with legal pathway, required forms, and step-by-step guidance.
                      </p>
                      <Button asChild size="lg">
                        <Link to="/case-analysis">
                          Start Full Case Analysis
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg text-sm">
                      <strong>Important Disclaimer:</strong> {result.disclaimer || "This estimate is for educational purposes only. Actual settlements depend on specific case facts, evidence quality, insurance limits, and many other factors. This is not legal advice. Consult with a qualified personal injury attorney for case-specific guidance."}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                How the Settlement Calculator Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: "1",
                    title: "Enter Your Details",
                    description: "Provide information about your injury type, severity, medical bills, and case circumstances."
                  },
                  {
                    step: "2",
                    title: "AI Analysis",
                    description: "Our AI compares your case to thousands of similar settlements in your state."
                  },
                  {
                    step: "3",
                    title: "Get Your Estimate",
                    description: "Receive a settlement range with low, likely, and high estimates based on comparable cases."
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded-lg p-6 border text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Frequently Asked Questions About Personal Injury Settlements
              </h2>
              <div className="space-y-4">
                {FAQ_DATA.map((faq, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-5 border">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need More Than an Estimate?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Our full case analysis provides legal pathways, required court forms, 
              deadlines, and step-by-step guidance for your personal injury case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/case-analysis">
                  Get Full Case Analysis
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Link to="/forms-library">
                  Browse Legal Forms
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PersonalInjuryCalculator;
