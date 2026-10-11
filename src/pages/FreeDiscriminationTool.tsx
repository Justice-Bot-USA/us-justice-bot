import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Home, ChevronRight, ExternalLink } from "lucide-react";
import { OfficialFormList, GuideDisclaimer, pickForms } from "@/components/legal-help/OfficialFormList";
import { CA_HUMAN_RIGHTS_FORMS } from "@/lib/ca/forms";
import { NY_HUMAN_RIGHTS_FORMS } from "@/lib/ny/forms";

// A free guide page (the route keeps its old "helper" slug so existing links work). Discrimination
// complaints are filed on the agencies' own sites; there is no form to fill here.
const SECTIONS = [
  {
    state: "CA" as const,
    heading: "How it usually works in California",
    deadlines: [
      "California Civil Rights Department (CRD) employment complaint: generally 3 years from the last act.",
      "CRD housing complaints, businesses open to the public (Unruh Civil Rights Act) and most other CRD complaints: generally 1 year from the last act.",
      "EEOC charge (employment only): 300 days in California.",
    ],
    steps: [
      "Write down what happened: dates, the people involved, witnesses, and any documents.",
      "File an intake with the Civil Rights Department (CRD). It covers employment, housing, and businesses open to the public. Employment complaints are usually filed with the EEOC at the same time.",
      "CRD interviews you and decides whether to investigate or to issue a right-to-sue notice.",
      "With a right-to-sue notice you can take the claim to court. For California claims, the lawsuit generally must be filed within 1 year of the date on the notice. A federal right-to-sue notice from the EEOC generally gives you 90 days after you receive it. Check the deadline printed on your notice, and talk to an attorney or free legal aid as soon as you get it.",
    ],
    forms: pickForms(CA_HUMAN_RIGHTS_FORMS, ["CRD Intake", "EEOC Charge"]),
    help: { label: "CRD: How the complaint process works", href: "https://calcivilrights.ca.gov/complaintprocess/" },
  },
  {
    state: "NY" as const,
    heading: "How it usually works in New York",
    deadlines: [
      "NY State Division of Human Rights (NYSDHR): 3 years for discrimination on or after February 15, 2024.",
      "NYC Commission on Human Rights: 1 year, or 3 years for gender-based harassment.",
      "EEOC charge: 300 days in New York.",
    ],
    steps: [
      "Choose where to file with care: filing a complaint with NYSDHR or the NYC Commission on Human Rights generally bars a later court case on the same facts under state and city law (the \"election of remedies\" rule). An EEOC charge that the EEOC refers to those agencies does not count as filing with them. Because this choice is hard to undo, many people talk to a lawyer or free legal aid (LawHelpNY.org) before filing.",
      "File the complaint with the agency, describing what happened, the protected characteristic, and the harm, with any supporting documents.",
      "The employer, landlord, or business answers, and an investigator may interview witnesses and ask for documents.",
      "If the agency finds probable cause, the case goes to a public hearing before an administrative law judge.",
    ],
    forms: pickForms(NY_HUMAN_RIGHTS_FORMS, ["NYSDHR Complaint", "NYC CHR Intake", "EEOC Charge"]),
    help: { label: "NY State Division of Human Rights", href: "https://dhr.ny.gov" },
  },
];

const FreeDiscriminationTool = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Discrimination Complaint Guide: California and New York | Justice Bot USA</title>
        <meta name="description" content="Where discrimination complaints are filed in California and New York, the deadlines, and what happens after you file with CRD, NYSDHR, NYC CHR, or the EEOC. Legal information, not legal advice. Other states coming soon." />
        <meta name="keywords" content="discrimination complaint guide, EEOC charge deadline, california civil rights department complaint, new york division of human rights complaint" />
        <link rel="canonical" href="https://justicebot-usa.com/free-discrimination-complaint-helper" />
      </Helmet>
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
          <ChevronRight className="h-3.5 w-3.5" /><span className="text-foreground font-medium">Discrimination Complaint Guide</span>
        </nav>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Free Guide · California &amp; New York</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Discrimination Complaints: A Free Guide</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Where discrimination complaints are filed in California and New York, the deadlines, and what happens after you
            file. Filing with these agencies is free, and you file on the agency's own website; Justice Bot USA doesn't file
            complaints for you. Other states are coming soon.
          </p>
          <Button asChild size="lg" className="text-lg px-8"><Link to="/legal-help/discrimination-law">Read the Discrimination Guide <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>

        <Card className="mb-12"><CardContent className="p-6 flex items-start gap-3">
          <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">
            <strong>Deadlines are short.</strong> Workplace charges with the EEOC generally must be filed within 180 days, or
            300 days where a state or local agency enforces a similar law (as in California and New York). Federal employees
            have different rules.
          </p>
        </CardContent></Card>

        {SECTIONS.map((s) => (
          <section key={s.state} className="mb-12">
            <Card className="mb-6 border-l-4 border-l-primary bg-primary/5"><CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{s.heading}</h2>
              <h3 className="text-sm font-semibold mb-2">Deadlines</h3>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                {s.deadlines.map((d, i) => <li key={i} className="text-sm text-foreground/90">{d}</li>)}
              </ul>
              <p className="text-xs text-muted-foreground mb-4">
                Your exact deadline can depend on the facts. If a deadline is close, contact the agency or free legal aid right away.
              </p>
              <h3 className="text-sm font-semibold mb-2">Steps</h3>
              <div className="space-y-3">
                {s.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/90">{step}</p></div>
                ))}
              </div>
              <a href={s.help.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline">
                {s.help.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent></Card>
            <h3 className="text-lg font-semibold mb-1">Where to file in {s.state === "CA" ? "California" : "New York"}</h3>
            <p className="text-sm text-muted-foreground mb-3">Official agency links. You decide which agency fits your situation.</p>
            <OfficialFormList state={s.state} forms={s.forms} />
          </section>
        ))}

        <div className="bg-primary/5 rounded-2xl p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">More Discrimination Information</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/legal-help/discrimination-law">Discrimination Guide <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/legal-help/how-to-file-civil-rights-complaint">How to File a Civil Rights Complaint <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "CA Workplace Discrimination", href: "/legal-help/california-workplace-discrimination" },
            { label: "Housing Discrimination", href: "/legal-help/housing-discrimination" },
            { label: "Civil Rights Guide", href: "/legal-help/discrimination-law" },
            { label: "California Civil Rights Steps", href: "/ca/legal-center?area=human-rights" },
            { label: "New York Human Rights Steps", href: "/ny/legal-center?area=human-rights" },
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
export default FreeDiscriminationTool;
