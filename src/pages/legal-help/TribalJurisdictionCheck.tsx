import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Scale, MapPin, Shield, ArrowRight, Home, ChevronRight, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { states } from "@/lib/states";

const CASE_TYPES = [
  { value: "criminal", label: "Criminal Matter" },
  { value: "family", label: "Family / Child Welfare" },
  { value: "civil", label: "Civil Dispute" },
  { value: "housing", label: "Housing / Land" },
  { value: "employment", label: "Employment" },
  { value: "dv", label: "Domestic Violence / Protective Order" },
  { value: "other", label: "Other" },
];

interface JurisdictionResult {
  possibleCourts: string[];
  explanation: string;
  keyLaws: string[];
  nextSteps: string[];
  warnings: string[];
}

function analyzeJurisdiction(
  tribalMember: string,
  tribalLand: string,
  caseType: string,
  state: string
): JurisdictionResult {
  const result: JurisdictionResult = {
    possibleCourts: [],
    explanation: "",
    keyLaws: [],
    nextSteps: [],
    warnings: [],
  };

  const isMember = tribalMember === "yes";
  const onTribalLand = tribalLand === "yes";
  const maybeTribalLand = tribalLand === "not-sure";

  // PL-280 states
  const pl280States = ["California", "Minnesota", "Nebraska", "Oregon", "Wisconsin", "Alaska"];
  const isPL280 = pl280States.includes(state);

  if (isMember && onTribalLand) {
    if (caseType === "criminal") {
      result.possibleCourts = ["Tribal Court", "Federal Court"];
      result.explanation = "Criminal matters involving tribal members on tribal land generally fall under tribal court jurisdiction. Depending on the severity of the crime, federal jurisdiction may apply under the Major Crimes Act (18 U.S.C. § 1153).";
      result.keyLaws = ["Major Crimes Act (18 U.S.C. § 1153)", "Indian Country Crimes Act (18 U.S.C. § 1152)", "Tribal Law and Order Act of 2010"];
      if (isPL280) {
        result.possibleCourts.push("State Court (PL-280)");
        result.explanation += ` Because ${state} is a Public Law 280 state, the state may also have concurrent criminal jurisdiction.`;
        result.keyLaws.push("Public Law 280 (18 U.S.C. § 1162)");
      }
    } else if (caseType === "family") {
      result.possibleCourts = ["Tribal Court"];
      result.explanation = "Family and child welfare matters involving tribal members on tribal land typically fall under tribal court jurisdiction. The Indian Child Welfare Act (ICWA) provides additional protections for tribal children in state proceedings.";
      result.keyLaws = ["Indian Child Welfare Act (25 U.S.C. §§ 1901-1963)", "Tribal court family law codes"];
      result.nextSteps.push("Contact your tribe's ICWA representative", "Request transfer to tribal court if case is in state court");
    } else if (caseType === "housing") {
      result.possibleCourts = ["Tribal Court", "Tribal Housing Authority"];
      result.explanation = "Housing matters on tribal land are generally governed by tribal law and administered through tribal housing authorities. Federal programs like NAHASDA may apply.";
      result.keyLaws = ["Native American Housing Assistance and Self-Determination Act (NAHASDA)", "Tribal housing codes"];
    } else {
      result.possibleCourts = ["Tribal Court"];
      result.explanation = "Civil matters between tribal members on tribal land generally fall under tribal court jurisdiction. Some tribes have their own civil codes and court systems.";
      result.keyLaws = ["Tribal civil codes", "Indian Civil Rights Act (25 U.S.C. §§ 1301-1304)"];
    }
  } else if (isMember && !onTribalLand) {
    result.possibleCourts = ["State Court"];
    result.explanation = "Matters involving tribal members that occur off tribal land generally fall under state court jurisdiction, with standard state laws applying.";
    if (caseType === "family") {
      result.explanation += " However, ICWA may still apply to child welfare proceedings involving tribal children regardless of location.";
      result.keyLaws.push("Indian Child Welfare Act (ICWA)");
      result.nextSteps.push("Notify the relevant tribe if child welfare proceedings are initiated");
    }
    result.nextSteps.push("Check if your tribe offers legal assistance for off-reservation matters");
  } else if (!isMember && onTribalLand) {
    result.possibleCourts = ["Tribal Court (limited)", "Federal Court", "State Court"];
    result.explanation = "Non-tribal members on tribal land face complex jurisdictional questions. Tribal courts may have limited jurisdiction over non-members. Federal or state courts may have primary jurisdiction depending on the circumstances.";
    result.keyLaws = ["Montana v. United States (1981)", "Duro v. Reina (1990)"];
    result.warnings.push("Jurisdiction over non-members on tribal land is a complex area of law. Consider consulting an attorney familiar with federal Indian law.");
  } else {
    result.possibleCourts = ["State Court"];
    result.explanation = "Standard state court jurisdiction applies for matters not involving tribal members or tribal land.";
  }

  if (maybeTribalLand) {
    result.warnings.push("If you're unsure whether the location is tribal land, contact the Bureau of Indian Affairs (BIA) or the relevant tribal government to clarify land status.");
  }

  result.nextSteps.push(
    "Gather documentation of tribal membership (if applicable)",
    "Research the specific tribal court rules if tribal jurisdiction applies",
    "Use Veritas Path to organize your case documents and evidence"
  );

  return result;
}

const TribalJurisdictionCheck = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [tribalMember, setTribalMember] = useState("");
  const [tribalLand, setTribalLand] = useState("");
  const [caseType, setCaseType] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState<JurisdictionResult | null>(null);

  const canAnalyze = tribalMember && tribalLand && caseType && state;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    const r = analyzeJurisdiction(tribalMember, tribalLand, caseType, state);
    setResult(r);
    // Track
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "tribal_jurisdiction_check", {
        event_category: "tool_use",
        case_type: caseType,
        state,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tribal Jurisdiction Check | Does Tribal Court Apply? | Veritas Path</title>
        <meta name="description" content="Free tool to check whether tribal, state, or federal court jurisdiction applies to your legal matter. Understand how tribal membership and location affect your case." />
        <meta name="keywords" content="tribal jurisdiction check, tribal court jurisdiction, federal indian law, tribal membership legal, PL-280 states, ICWA jurisdiction" />
        <link rel="canonical" href="https://justicebot-usa.com/legal-help/tribal-jurisdiction-check" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Tribal Jurisdiction Check",
          description: "Determine which court system may apply to your legal matter based on tribal membership and location.",
          url: "https://justicebot-usa.com/legal-help/tribal-jurisdiction-check",
          applicationCategory: "LegalService",
          operatingSystem: "Web",
        })}</script>
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/legal-help" className="hover:text-foreground">Legal Help</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Tribal Jurisdiction Check</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Tribal Jurisdiction Check</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Determine which court system — tribal, state, or federal — may apply to your legal matter based on tribal membership and location.
        </p>

        <Alert className="mb-8 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This tool provides general educational guidance about jurisdiction. It does not determine legal rights or eligibility. Tribal jurisdiction is a complex area of law — consult an attorney familiar with federal Indian law for specific advice.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Answer These Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Are you an enrolled member of a federally recognized tribe?</Label>
              <RadioGroup value={tribalMember} onValueChange={setTribalMember} className="space-y-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="tm-yes" /><Label htmlFor="tm-yes">Yes</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="no" id="tm-no" /><Label htmlFor="tm-no">No</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="not-sure" id="tm-ns" /><Label htmlFor="tm-ns">Not sure</Label></div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Did the legal issue occur on tribal land or a reservation?</Label>
              <RadioGroup value={tribalLand} onValueChange={setTribalLand} className="space-y-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="tl-yes" /><Label htmlFor="tl-yes">Yes</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="no" id="tl-no" /><Label htmlFor="tl-no">No</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="not-sure" id="tl-ns" /><Label htmlFor="tl-ns">Not sure</Label></div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">What type of legal issue?</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger><SelectValue placeholder="Select case type" /></SelectTrigger>
                <SelectContent>{CASE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">What state?</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <Button onClick={handleAnalyze} disabled={!canAnalyze} size="lg" className="w-full">
              <MapPin className="mr-2 h-4 w-4" /> Check Jurisdiction
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Possible Court Systems</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.possibleCourts.map((c, i) => <Badge key={i} variant="secondary" className="text-sm">{c}</Badge>)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.explanation}</p>
              </CardContent>
            </Card>

            {result.warnings.length > 0 && (
              <Alert className="border-destructive/30">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  <ul className="space-y-1">{result.warnings.map((w, i) => <li key={i} className="text-sm">{w}</li>)}</ul>
                </AlertDescription>
              </Alert>
            )}

            {result.keyLaws.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Key Laws & Authorities</h3>
                  <ul className="space-y-1">{result.keyLaws.map((l, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary">•</span>{l}</li>)}</ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Suggested Next Steps</h3>
                <ul className="space-y-2">{result.nextSteps.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="font-bold text-primary">{i + 1}.</span>{s}</li>)}</ul>
              </CardContent>
            </Card>

            <div className="bg-primary/5 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-foreground mb-3">Need Help Preparing Your Case?</h2>
              <p className="text-muted-foreground mb-6 text-sm">Use Veritas Path to organize evidence, generate documents, and prepare your case timeline.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild><Link to="/case-analysis">Start Case Analysis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/legal-help/native-american-rights">Tribal Rights Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-6 mt-10">
          <p><strong>Disclaimer:</strong> This tool provides general educational guidance about court jurisdiction. It does not determine legal rights, tribal membership, or eligibility for services. Jurisdiction in Indian Country is a complex area of law. For advice specific to your situation, consult an attorney experienced in federal Indian law.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TribalJurisdictionCheck;
