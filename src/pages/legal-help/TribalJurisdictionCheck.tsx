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
  /** General items people in similar situations often look into (not instructions). */
  thingsToLookInto: string[];
  warnings: string[];
}

// General information keyed to the answers. It describes how courts often divide matters like
// the one described; it does not decide which court has jurisdiction in a particular case.
function describeJurisdiction(
  tribalMember: string,
  tribalLand: string,
  caseType: string,
  state: string
): JurisdictionResult {
  const result: JurisdictionResult = {
    possibleCourts: [],
    explanation: "",
    keyLaws: [],
    thingsToLookInto: [],
    warnings: [],
  };

  const isMember = tribalMember === "yes";
  const onTribalLand = tribalLand === "yes";
  const maybeTribalLand = tribalLand === "not-sure";

  // Mandatory Public Law 280 states (some reservations in them are excepted or have retroceded).
  const pl280States = ["California", "Minnesota", "Nebraska", "Oregon", "Wisconsin", "Alaska"];
  const isPL280 = pl280States.includes(state);

  if (isMember && onTribalLand) {
    if (caseType === "criminal") {
      result.possibleCourts = ["Tribal Court", "Federal Court"];
      result.explanation = "When a crime involving a tribal member happens on tribal land, tribal courts generally have jurisdiction, and federal courts may also have jurisdiction over serious crimes under the Major Crimes Act (18 U.S.C. § 1153).";
      result.keyLaws = ["Major Crimes Act (18 U.S.C. § 1153)", "Indian Country Crimes Act (18 U.S.C. § 1152)", "Tribal Law and Order Act of 2010"];
      if (isPL280) {
        result.possibleCourts = ["Tribal Court", "State Court (PL-280)", "Federal Court (limited)"];
        result.explanation += ` ${state} is a Public Law 280 state. There, the state generally has criminal jurisdiction on most tribal lands, and the federal Major Crimes Act usually does not apply, though there are exceptions for some reservations.`;
        result.keyLaws.push("Public Law 280 (18 U.S.C. § 1162)");
      }
    } else {
      if (caseType === "family") {
        result.possibleCourts = ["Tribal Court"];
        result.explanation = "Family and child welfare matters involving tribal members on tribal land are often heard in tribal court. The Indian Child Welfare Act (ICWA) also sets rules for state court child custody proceedings involving Indian children.";
        result.keyLaws = ["Indian Child Welfare Act (25 U.S.C. §§ 1901-1963)", "Tribal court family law codes"];
        result.thingsToLookInto.push(
          "The tribe's ICWA office or representative",
          "ICWA's rules on which court hears a child custody proceeding involving an Indian child, including transfer from state court to tribal court (25 U.S.C. § 1911)"
        );
      } else if (caseType === "housing") {
        result.possibleCourts = ["Tribal Court", "Tribal Housing Authority"];
        result.explanation = "Housing on tribal land is often governed by tribal law and run through tribal housing authorities. Federal programs such as NAHASDA may apply.";
        result.keyLaws = ["Native American Housing Assistance and Self-Determination Act (NAHASDA)", "Tribal housing codes"];
      } else {
        result.possibleCourts = ["Tribal Court"];
        result.explanation = "Civil matters between tribal members on tribal land are generally heard in tribal court. Many tribes have their own civil codes and court systems.";
        result.keyLaws = ["Tribal civil codes", "Indian Civil Rights Act (25 U.S.C. §§ 1301-1304)"];
      }
      if (isPL280) {
        result.possibleCourts.push("State Court (PL-280)");
        result.explanation += ` In Public Law 280 states such as ${state}, state courts may also hear many private civil cases that arise on tribal land.`;
        result.keyLaws.push("Public Law 280 (28 U.S.C. § 1360)");
      }
    }
  } else if (isMember && !onTribalLand) {
    result.possibleCourts = ["State Court"];
    result.explanation = "Matters involving tribal members that happen off tribal land are usually handled in state court, under the same state laws that apply to anyone else.";
    if (caseType === "family") {
      result.explanation += " ICWA can still apply to child custody proceedings involving an Indian child, wherever they take place.";
      result.keyLaws.push("Indian Child Welfare Act (ICWA)");
      result.thingsToLookInto.push("Whether ICWA applies; in involuntary child custody cases in state court, the child's tribe must be notified");
    }
    result.thingsToLookInto.push("Whether the tribe offers legal help for matters off tribal land");
  } else if (!isMember && onTribalLand) {
    result.possibleCourts = ["Tribal Court (limited)", "Federal Court", "State Court"];
    result.explanation = "Matters involving people who are not tribal members on tribal land raise complex questions. Tribal courts generally cannot prosecute non-Indians for crimes, except certain crimes such as domestic violence under special tribal criminal jurisdiction, and tribal civil authority over non-members is limited. Federal or state courts may be involved depending on the facts.";
    result.keyLaws = ["Oliphant v. Suquamish Indian Tribe (1978)", "Montana v. United States (1981)", "Special Tribal criminal jurisdiction (25 U.S.C. § 1304)"];
    result.warnings.push("Jurisdiction over non-members on tribal land is a complex area of law. Many people in this situation talk to an attorney familiar with federal Indian law.");
  } else {
    result.possibleCourts = ["State Court"];
    result.explanation = "Matters that don't involve tribal members or tribal land are usually handled in state court, or in federal court for federal matters.";
  }

  if (tribalMember === "not-sure") {
    result.warnings.push("If you're not sure about tribal enrollment, the tribe's enrollment office can tell you. Enrollment can change which courts may be involved; this information assumes no enrollment.");
  }
  if (maybeTribalLand) {
    result.warnings.push("If you're unsure whether the location is tribal land, the Bureau of Indian Affairs (BIA) or the tribal government can clarify the land's status.");
  }

  result.thingsToLookInto.push(
    "Documents showing tribal enrollment, if any",
    "The rules of the tribal court involved, if tribal jurisdiction may apply"
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
    const r = describeJurisdiction(tribalMember, tribalLand, caseType, state);
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
        <title>Tribal Jurisdiction Check: General Information on Tribal, State, and Federal Courts | Justice Bot USA</title>
        <meta name="description" content="Free general information about when tribal, state, or federal courts may be involved in a legal matter, based on tribal membership, location, and the type of issue. Legal information, not legal advice." />
        <meta name="keywords" content="tribal jurisdiction check, tribal court jurisdiction, federal indian law, tribal membership legal, PL-280 states, ICWA jurisdiction" />
        <link rel="canonical" href="https://justicebot-usa.com/legal-help/tribal-jurisdiction-check" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Tribal Jurisdiction Check",
          description: "General information about which court systems may be involved in a legal matter, based on tribal membership and location.",
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
          Answer four questions to see general information about how tribal, state, and federal courts often divide matters like the
          one you describe. It does not decide which court has jurisdiction in your case.
        </p>

        <Alert className="mb-8 border-primary/20">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Legal information, not legal advice. This page gives general information about jurisdiction. It does not determine legal rights, eligibility, or which court your matter belongs in. Tribal jurisdiction is a complex area of law; for advice about your situation, talk to an attorney familiar with federal Indian law.
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
              <MapPin className="mr-2 h-4 w-4" /> Show General Information
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Alert className="border-primary/20">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                General information for situations like the one you described, not a conclusion about your case. Which court has jurisdiction depends on facts and law this page doesn't cover.
              </AlertDescription>
            </Alert>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2"><Scale className="h-5 w-5 text-primary" /> Court Systems Often Involved in Situations Like This</h2>
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
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Laws and Cases Often Discussed</h3>
                  <ul className="space-y-1">{result.keyLaws.map((l, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary">•</span>{l}</li>)}</ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Things People in Similar Situations Often Look Into</h3>
                <ul className="space-y-2">{result.thingsToLookInto.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-primary">•</span>{s}</li>)}</ul>
              </CardContent>
            </Card>

            <div className="bg-primary/5 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-foreground mb-3">Learn More</h2>
              <p className="text-muted-foreground mb-6 text-sm">Read more general information about tribal courts and jurisdiction.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild><Link to="/legal-help/tribal-jurisdiction">Tribal Jurisdiction Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/legal-help/tribal-court">Tribal Court Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/legal-help/native-american-rights">Tribal Rights Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-6 mt-10">
          <p><strong>Disclaimer:</strong> Legal information, not legal advice. This page gives general information about court jurisdiction; it does not determine legal rights, tribal membership, eligibility for services, or which court hears your matter. Justice Bot USA is not a law firm, and our content has not yet been reviewed by a licensed attorney. Jurisdiction in Indian Country is a complex area of law. For advice specific to your situation, consult an attorney experienced in federal Indian law.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TribalJurisdictionCheck;
