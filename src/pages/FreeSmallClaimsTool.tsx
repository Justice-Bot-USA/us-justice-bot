import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Home, ChevronRight, ExternalLink } from "lucide-react";
import { OfficialFormList, GuideDisclaimer, pickForms } from "@/components/legal-help/OfficialFormList";
import { CA_CIVIL_FORMS } from "@/lib/ca/forms";
import { NY_CIVIL_FORMS } from "@/lib/ny/forms";

// A free guide page (the route keeps its old "case builder" slug so existing links work). The real
// tools here are the free SC-100, CIV-SC-50 and fee waiver form fillers.
const SECTIONS = [
  {
    state: "CA" as const,
    heading: "How it usually works in California",
    steps: [
      "Small claims limit: $12,500 for individuals, $6,250 for businesses. Lawyers can't appear for you at the hearing.",
      "Ask the other side to pay before you file; courts expect you to try.",
      "Fill out the Plaintiff's Claim (SC-100) and file it in the right county. The fee is $30, $50 or $75 depending on the amount, or you can ask for a fee waiver (FW-001).",
      "An adult who is not you serves the defendant at least 15 days before the court date (20 days if they live outside the county), then you file the proof of service (SC-104) at least 5 days before the hearing. If the papers are left with someone else and mailed (substituted service), service is not complete until 10 days after the mailing, so allow extra time.",
      "Go to the hearing with your evidence, witnesses, and copies of everything you filed. A defendant who loses can appeal within 30 days after the clerk mails or hands over the notice of entry of judgment; a plaintiff can appeal only a claim the defendant filed back. If you were the defendant and missed the hearing, you can't appeal yet: first file a Motion to Vacate Judgment (SC-135) within 30 days after the notice was mailed (or within 180 days of learning of the judgment if you were never properly served).",
    ],
    forms: pickForms(CA_CIVIL_FORMS, ["SC-100", "SC-104", "FW-001"]),
    help: { label: "California Courts: Small claims self-help", href: "https://selfhelp.courts.ca.gov/small-claims-california" },
  },
  {
    state: "NY" as const,
    heading: "How it usually works in New York",
    steps: [
      "Pick the right court. Small claims limits: $10,000 in NYC Civil Court, $5,000 in City Courts (and District Courts in Nassau and Suffolk), and $3,000 in Town and Village Courts.",
      "In New York City, file the Statement of Claim (CIV-SC-50). The fee is $15 for claims up to $1,000 and $20 for larger claims. You can ask the court to waive fees with UCS-FW1.",
      "Outside New York City there is no single statewide claim form. Go to the small claims clerk of the City, District, or Town or Village Court where the defendant lives, works, or has a business; the clerk will help you prepare the claim. The fee is $15 (claims up to $1,000) or $20 in City and District Courts, and $10 or $15 in Town and Village Courts.",
      "The clerk sends the notice of claim to the defendant by mail and gives you a hearing date.",
      "At the hearing, the case is heard by an arbitrator if both sides agree, or otherwise by a judge. Bring your evidence and witnesses.",
      "If you win and the other side doesn't pay, there are court procedures for collecting the judgment, such as wage garnishment.",
    ],
    forms: pickForms(NY_CIVIL_FORMS, ["CIV-SC-50", "UCS-FW1"]),
    help: { label: "NY Courts: Small claims help", href: "https://www.nycourts.gov/help/small-claims" },
  },
];

const FreeSmallClaimsTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Small Claims Guide and Claim Forms: California and New York | Justice Bot USA</title>
        <meta name="description" content="How small claims court works in California and New York: limits, fees, serving the other side, and the hearing. Fill in California's SC-100 or New York City's CIV-SC-50 for free. Other states coming soon." />
        <meta name="keywords" content="small claims guide, small claims court california SC-100, new york small claims CIV-SC-50, how to file small claims" />
        <link rel="canonical" href="https://justicebot-usa.com/free-small-claims-case-builder" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Small Claims Guide</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Guide · California &amp; New York</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Small Claims Court: A Free Guide</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            How small claims works in California and New York, the limits and fees, and the official forms. You can fill in
            California's claim form (SC-100) or New York City's (CIV-SC-50) with your own answers for free, then file it
            with the court yourself. Other states are coming soon.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/fill/ca/sc-100">Fill California's SC-100 <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/fill/ny/civ-sc-50">Fill NYC's CIV-SC-50 <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        {SECTIONS.map((s) => (
          <section key={s.state} className="mb-12">
            <Card className="mb-6 border-l-4 border-l-primary bg-primary/5"><CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{s.heading}</h2>
              <div className="space-y-3">
                {s.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{step}</p></div>
                ))}
              </div>
              <a href={s.help.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline">
                {s.help.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent></Card>
            <h3 className="text-lg font-semibold mb-1">Official {s.state === "CA" ? "California" : "New York"} forms</h3>
            <p className="text-sm text-muted-foreground mb-3">Forms commonly used in these cases. You decide which ones apply to you.</p>
            <OfficialFormList state={s.state} forms={s.forms} />
          </section>
        ))}

        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">More Small Claims Information</h2>
          <p className="text-muted-foreground mb-6">Read about what to bring and what usually happens at a small claims hearing.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/legal-help/small-claims-court">Read the Small Claims Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/fill/ca">All Free California Forms <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/fill/ny">All Free New York Forms <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "California Small Claims Steps & Forms", href: "/ca/legal-center?area=civil" },
            { label: "New York Small Claims Court", href: "/legal-help/new-york-small-claims-court" },
            { label: "General Small Claims Guide", href: "/legal-help/small-claims-court" },
            { label: "Small Claims Evidence Guide", href: "/legal-help/small-claims-evidence" },
          ].map((p, i) => (
            <Link key={i} to={p.href} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors text-sm text-foreground">
              <ArrowRight className="h-4 w-4 text-primary" />{p.label}
            </Link>
          ))}
        </div>
        <GuideDisclaimer />
      </main>
      <Footer />
    </div>
  );
};
export default FreeSmallClaimsTool;
